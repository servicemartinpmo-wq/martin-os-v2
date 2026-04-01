import { geminiService } from './geminiService';
import { generateContentOpenAI } from './openaiService';

export async function generateContentWithFallback(prompt: string, config?: any) {
  try {
    // 1. Try Gemini
    return await geminiService.generateContent(prompt, config);
  } catch (geminiError) {
    console.error("Gemini failed, falling back to OpenAI:", geminiError);
    try {
      // 2. Fallback to OpenAI
      return await generateContentOpenAI(prompt);
    } catch (openaiError) {
      console.error("OpenAI fallback also failed:", openaiError);
      throw new Error("All AI providers failed. Please check your API configurations.");
    }
  }
}
