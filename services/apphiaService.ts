import { GoogleGenAI, Type } from "@google/genai";
import { geminiService } from "./geminiService";

export const apphiaService = {
  async routeQuery(query: string) {
    const prompt = `As the Apphia Orchestrator, route this user query to the best agent or workflow.
    Query: ${query}
    Options: 
    1. GENERAL_SUPPORT (Gemini)
    2. DATA_ANALYSIS (OpenAI)
    3. WORKFLOW_CREATION (Apphia Orchestrator)
    
    Return the choice and a brief reasoning.`;

    const response = await geminiService.generateContent(prompt, {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          route: { type: Type.STRING },
          reasoning: { type: Type.STRING }
        },
        required: ["route", "reasoning"]
      }
    });

    return JSON.parse(response || '{}');
  },

  async supervise(agentOutput: string, criteria: string) {
    const prompt = `As the Apphia Orchestrator, supervise the following agent output based on these criteria: ${criteria}. 
    Output: ${agentOutput}
    Provide a score (0-100) and feedback in JSON format with keys: score, feedback, approved.`;

    const response = await geminiService.generateContent(prompt, {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          feedback: { type: Type.STRING },
          approved: { type: Type.BOOLEAN }
        },
        required: ["score", "feedback", "approved"]
      }
    });

    return JSON.parse(response || '{}');
  }
};
