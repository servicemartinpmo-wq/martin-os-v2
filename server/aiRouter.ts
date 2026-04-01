import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import dotenv from 'dotenv';

dotenv.config();

const TIMEOUT_MS = 20000;

export interface AIRouterRequest {
  intent?: string;
  userInput?: string;
  prompt?: string;
  mode?: string;
  jsonMode?: boolean;
  context?: any;
}

export interface AIRouterResponse {
  ok: boolean;
  provider: string | null;
  fallback: boolean;
  output: string | object;
  error?: string;
  requestId?: string;
}

const providers: { name: string; model: any }[] = [];

const isPlaceholderKey = (key: string | undefined) => {
  if (!key) return true;
  const k = key.trim();
  return k === 'MY_GEMINI_API_KEY' || k === 'YOUR_API_KEY' || k === 'PASTE_YOUR_KEY_HERE' || k === 'sk-...' || k === 'AIza...';
};

if (process.env.OPENAI_API_KEY && !isPlaceholderKey(process.env.OPENAI_API_KEY)) {
  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY.trim(),
  });
  providers.push({ name: 'openai', model: openai('gpt-4o') });
}

const geminiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)?.trim();
if (geminiKey && !isPlaceholderKey(geminiKey)) {
  const google = createGoogleGenerativeAI({
    apiKey: geminiKey,
  });
  providers.push({ name: 'gemini', model: google('gemini-3.1-pro-preview') });
}

export async function routeAIRequest(req: AIRouterRequest): Promise<AIRouterResponse> {
  const { intent, userInput, prompt, jsonMode, context, mode } = req;

  if (providers.length === 0) {
    return {
      ok: false,
      provider: null,
      fallback: true,
      output: jsonMode ? { error: "No AI providers configured" } : "AI services are currently unavailable. Please check server configuration.",
      error: "No API keys found for OpenAI or Gemini.",
    };
  }

  // Build the final prompt
  const basePrompt = prompt || (intent ? `User Intent: ${intent}. User Input: ${userInput || ''}` : userInput || '');
  
  // Detect if JSON is requested
  const isJsonRequested =
    jsonMode === true ||
    /\b(return|respond|output)\b.*\bjson\b/i.test(basePrompt);
  
  let systemInstruction = isJsonRequested 
    ? "Respond ONLY with a valid JSON object. Do not include markdown code blocks or any other text."
    : "Respond with plain text.";

  if (mode) {
    systemInstruction += ` Operating Mode: ${mode}.`;
  }

  const fullPrompt = context 
    ? `Context: ${JSON.stringify(context)}\n\nPrompt: ${basePrompt}`
    : basePrompt;

  const messages: any[] = [
    { role: 'user', content: fullPrompt }
  ];

  // Handle image if present in context
  if (context?.image && context?.mimeType) {
    messages[0].content = [
      { type: 'text', text: fullPrompt },
      { type: 'image', image: context.image, mimeType: context.mimeType }
    ];
  }

  for (const provider of providers) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      try {
        const { text } = await generateText({
          model: provider.model,
          system: systemInstruction,
          messages,
          abortSignal: controller.signal,
        });

        clearTimeout(timeoutId);

        let output: string | object = text;
        if (isJsonRequested) {
          try {
            // Clean up potential markdown blocks if the model ignored the system instruction
            const cleanedText = text.replace(/```json\n?|```/g, '').trim();
            const parsed = JSON.parse(cleanedText);

            // Require a plain JSON object (not array/string/number/null)
            if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
              throw new Error('Parsed JSON is not an object');
            }
            output = parsed;
          } catch (e) {
            console.warn(`[AI Router] Provider ${provider.name} returned invalid JSON object, trying next provider.`);
            continue; // Try next provider if JSON parsing fails or is not an object
          }
        }

        // Avoid canned responses (only relevant for plain text)
        if (!isJsonRequested && typeof output === 'string' && output.includes("Diagnostic complete")) {
          console.warn(`[AI Router] Provider ${provider.name} returned canned response, trying next provider.`);
          continue;
        }

        return {
          ok: true,
          provider: provider.name,
          fallback: false,
          output,
        };
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
          console.error(`[AI Router] Provider ${provider.name} timed out.`);
        } else {
          console.error(`[AI Router] Provider ${provider.name} failed:`, err.message);
        }
        continue; // Try next provider
      }
    } catch (err: any) {
      console.error(`[AI Router] Unexpected error with provider ${provider.name}:`, err.message);
      continue;
    }
  }

  // Fallback response if all providers fail
  return {
    ok: false,
    provider: null,
    fallback: true,
    output: isJsonRequested ? { error: "Service temporarily unavailable" } : "I'm sorry, I'm having trouble connecting to my brain right now. Please try again in a moment.",
    error: "All AI providers failed or timed out.",
  };
}
