import React, { createContext, useContext } from 'react';
import { aiAssistant } from '../services/aiAssistant';
import { apphiaService } from '../services/apphiaService';

interface AIContextType {
  ai: typeof aiAssistant;
  apphia: typeof apphiaService;
}

const AIContext = createContext<AIContextType | null>(null);

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AIContext.Provider value={{ ai: aiAssistant, apphia: apphiaService }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) throw new Error('useAI must be used within an AIProvider');
  return context;
};
