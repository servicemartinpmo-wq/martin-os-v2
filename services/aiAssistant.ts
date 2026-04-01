import { geminiService } from './geminiService';
import { fetchWithLogging } from '../lib/api';

export const aiAssistant = {
  async chat(messages: any[], model: 'gemini' | 'openai' = 'gemini') {
    if (model === 'openai') {
      // OpenAI calls go to the backend
      return await fetchWithLogging('/api/openai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });
    } else {
      // Gemini calls go to the frontend using the SDK
      // Assuming the last message is the prompt
      const prompt = messages[messages.length - 1].content;
      return await geminiService.generateContent(prompt);
    }
  },

  async generateContent(prompt: string, config?: any) {
    return await geminiService.generateContent(prompt, config);
  },

  async generateHighThinkingContent(prompt: string, config?: any) {
    // High thinking is a feature of Gemini 3 series models
    return await geminiService.generateContent(prompt, {
      ...config,
      thinkingConfig: { thinkingLevel: 'HIGH' }
    });
  }
};
