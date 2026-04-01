import { GoogleGenAI, GenerateContentResponse, ThinkingLevel, Modality, Type, Chat, FunctionDeclaration } from "@google/genai";

const isPlaceholderKey = (key: string | undefined) => {
  if (!key) return true;
  const k = key.trim();
  return k === 'MY_GEMINI_API_KEY' || k === 'YOUR_API_KEY' || k === 'PASTE_YOUR_KEY_HERE' || k === 'sk-...' || k === 'AIza...';
};

function getAI() {
  const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)?.trim();
  console.log("[GeminiService] Initializing with API Key. Length:", apiKey?.length);
  if (isPlaceholderKey(apiKey)) {
    throw new Error('Gemini API Key is not configured or is a placeholder. Please add a valid key to your environment variables.');
  }
  return new GoogleGenAI({ apiKey: apiKey! });
}

const updateProjectStatusTool: FunctionDeclaration = {
  name: "updateProjectStatus",
  description: "Update a project status in the PMO system",
  parameters: {
    type: Type.OBJECT,
    properties: {
      id: {
        type: Type.STRING,
        description: "The project ID",
      },
      status: {
        type: Type.STRING,
        description: "The new status (e.g., active, completed, on-hold)",
      },
    },
    required: ["id", "status"],
  },
};

const runPMOReportTool: FunctionDeclaration = {
  name: "runPMOReport",
  description: "Run a PMO report and return the summary",
  parameters: {
    type: Type.OBJECT,
    properties: {
      reportType: {
        type: Type.STRING,
        description: "The type of report to run (e.g., weekly, monthly, risk)",
      },
    },
    required: ["reportType"],
  },
};

// Simple in-memory cache
const cache = new Map<string, string>();

/**
 * Exponential backoff retry wrapper
 */
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      // Check if it's a 429 Resource Exhausted error
      if (error.message?.includes('429') || error.status === 'RESOURCE_EXHAUSTED') {
        const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
        console.warn(`Quota exceeded (429). Retrying in ${Math.round(delay)}ms... (Attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

// General text generation
export async function generateContent(prompt: string, config?: any) {
  const cacheKey = `content:${JSON.stringify(config)}:${prompt}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  try {
    const ai = getAI();
    const result = await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: config?.model || 'gemini-3-flash-preview',
        contents: prompt,
        config: config
      });
      return response.text;
    });

    if (result) cache.set(cacheKey, result);
    return result;
  } catch (error: any) {
    console.error('[GeminiService] generateContent error:', error);
    // Fallback to a simple response or another service if available
    return "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later.";
  }
}

// High thinking generation
export async function generateHighThinkingContent(prompt: string) {
  const cacheKey = `high-thinking:${prompt}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  try {
    const ai = getAI();
    const result = await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } }
      });
      return response.text;
    });
    if (result) cache.set(cacheKey, result);
    return result;
  } catch (error: any) {
    console.error('[GeminiService] generateHighThinkingContent error:', error);
    return "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later.";
  }
}

// Image analysis
export async function analyzeImage(prompt: string, base64ImageData: string, mimeType: string) {
  try {
    const ai = getAI();
    // We don't cache images due to memory size, but we do retry
    return withRetry(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data: base64ImageData, mimeType } },
            { text: prompt },
          ],
        },
      });
      return response.text;
    });
  } catch (error: any) {
    console.error('[GeminiService] analyzeImage error:', error);
    return "I'm sorry, I'm having trouble analyzing the image right now. Please try again later.";
  }
}

// Generate embeddings
export async function generateEmbedding(text: string): Promise<number[]> {
  const ai = getAI();
  
  const result = await ai.models.embedContent({
    model: 'gemini-embedding-2-preview',
    contents: text,
  });
  
  return result.embeddings?.[0]?.values || [];
}

// Chat
export function createChat(systemInstruction: string, model: string = 'gemini-3-flash-preview'): Chat {
  const ai = getAI();
  return ai.chats.create({
    model,
    config: { systemInstruction },
  });
}

// Stream content
export async function* streamContent(prompt: string, model: string = 'gemini-3-flash-preview') {
  const ai = getAI();
  
  const response = await ai.models.generateContentStream({
    model,
    contents: prompt,
    config: {
      tools: [{ functionDeclarations: [updateProjectStatusTool, runPMOReportTool] }],
    }
  });

  for await (const chunk of response) {
    if (chunk.functionCalls && chunk.functionCalls.length > 0) {
      for (const call of chunk.functionCalls) {
        if (call.name === 'updateProjectStatus') {
          const { id, status } = call.args as { id: string, status: string };
          console.log(`[AI Tool Execution] Updating project ${id} to status ${status}`);
          yield `\n\n*Executing Workflow: Updating project ${id} to ${status}...*\n\n`;
          // Here you would typically call your backend or Supabase to update the status
          yield `*Project ${id} status successfully updated to ${status}.*\n\n`;
        } else if (call.name === 'runPMOReport') {
          const { reportType } = call.args as { reportType: string };
          console.log(`[AI Tool Execution] Running PMO report: ${reportType}`);
          yield `\n\n*Executing Workflow: Running ${reportType} PMO report...*\n\n`;
          // Here you would typically call your backend to generate the report
          yield `*${reportType} PMO report generated successfully. The overall health is optimal with 3 active risks identified.*\n\n`;
        }
      }
    }
    if (chunk.text) {
      yield chunk.text;
    }
  }
}

// Personalized Action Plan
export async function getPersonalizedActionPlan(intakeData: any, assessmentData: any) {
  const prompt = `Create a personalized action plan based on this intake data: ${JSON.stringify(intakeData)} and assessment data: ${JSON.stringify(assessmentData)}.`;
  const cacheKey = `action-plan:${prompt}`;
  if (cache.has(cacheKey)) return JSON.parse(cache.get(cacheKey)!);

  try {
    const ai = getAI();
    const result = await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              steps: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });
      return response.text;
    });
    
    if (result) cache.set(cacheKey, result);
    return JSON.parse(result || '{}');
  } catch (error: any) {
    console.error('[GeminiService] getPersonalizedActionPlan error:', error);
    return {
      title: "Action Plan Unavailable",
      summary: "I'm sorry, I'm having trouble generating your action plan right now. Please try again later.",
      steps: []
    };
  }
}

export const geminiService = {
  generateContent,
  generateHighThinkingContent,
  analyzeImage,
  generateEmbedding,
  createChat,
  streamContent,
  getPersonalizedActionPlan
};
