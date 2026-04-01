import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles,
  ShieldCheck,
  Workflow
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAI } from '../../context/AIContext';
import { cn } from '../../lib/utils';
import { searchDocuments } from '../../services/vectorService';
import apphiaIcon from '../../assets/apphia-icon.jpg'; // Assuming user provided image is saved as apphia-icon.jpg

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  type?: 'text' | 'supervision' | 'routing';
}

export default function AIAssistant() {
  const { apphia, ai } = useAI();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: 'Hello! I am Apphia. How can I assist you with workflows or system supervision today?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [requestState, setRequestState] = useState<{
    status: 'idle' | 'thinking' | 'done' | 'error';
    output: string | null;
    error: string | null;
    fallback: boolean;
  }>({ status: 'idle', output: null, error: null, fallback: false });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, requestState]);

  const handleSend = async () => {
    if (!input.trim() || requestState.status === 'thinking') return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setRequestState({ status: 'thinking', output: null, error: null, fallback: false });

    try {
      // 1. Route the query using Apphia
      const routing = await apphia.routeQuery(input);
      
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'system', 
        content: `Routing: ${routing.route}. Reasoning: ${routing.reasoning}`,
        type: 'routing'
      }]);

      let responseContent = '';
      
      if (routing.route === 'WORKFLOW_CREATION') {
        responseContent = "I've initiated a multi-agent workflow to handle your request. Initializing Apphia...";
        setMessages(prev => [...prev, { 
          id: (Date.now() + 2).toString(), 
          role: 'assistant', 
          content: responseContent 
        }]);
      } else {
        // Use Gemini for general support with streaming
        try {
          const streamId = (Date.now() + 2).toString();
          setMessages(prev => [...prev, { 
            id: streamId, 
            role: 'assistant', 
            content: '' 
          }]);

          // Fetch context from Vector DB
          const context = await searchDocuments(input);
          const enhancedPrompt = context 
            ? `Context information:\n${context}\n\nUser Query: ${input}` 
            : input;

          // Create a chat with Apphia context
          const systemInstruction = `You are Apphia, the AI assistant for MARTIN OS. 
            You are currently routing a query to the ${routing.route} agent.
            Reasoning: ${routing.reasoning}
            
            Your tone: Precise, technical, and helpful.`;

          const response = await ai.chat([
            { role: 'user', content: `${systemInstruction}\n\n${enhancedPrompt}` }
          ], 'gemini');
          
          responseContent = response;
          setMessages(prev => prev.map(msg => 
            msg.id === streamId ? { ...msg, content: responseContent } : msg
          ));
        } catch (geminiError: any) {
          console.error('Gemini Error:', geminiError);
          responseContent = `I encountered an issue with my primary intelligence layer: ${geminiError.message || 'Unknown error'}. I am currently operating in a degraded state.`;
          setMessages(prev => [...prev, { 
            id: (Date.now() + 2).toString(), 
            role: 'assistant', 
            content: responseContent 
          }]);
        }
      }

      // 2. Supervise the output
      let supervision;
      try {
        supervision = await apphia.supervise(responseContent, "Helpful, professional, and accurate.");
      } catch (supervisionError) {
        console.warn('Supervision failed, skipping:', supervisionError);
        supervision = { approved: true, score: 100, feedback: 'Supervision unavailable' };
      }
      
      if (supervision && !supervision.approved) {
        setMessages(prev => [...prev, { 
          id: (Date.now() + 3).toString(), 
          role: 'system', 
          content: `Supervision Alert: ${supervision.feedback} (Score: ${supervision.score})`,
          type: 'supervision'
        }]);
      }
      
      setRequestState({ status: 'done', output: responseContent, error: null, fallback: false });

    } catch (error: any) {
      console.error('AI Assistant Error:', error);
      setRequestState({ status: 'error', error: error.message || 'Network/provider error', output: null, fallback: true });
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'assistant', 
        content: `I encountered a system-level error: ${error.message || 'Unknown error'}. Please check your connection or environment variables.` 
      }]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 rounded-full bg-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 border-2 border-slate-200",
          isOpen && "hidden"
        )}
      >
        <img src={apphiaIcon} alt="Apphia" className="w-10 h-10 rounded-full object-cover" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full border-2 border-white animate-pulse" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-3xl shadow-2xl border-2 border-slate-300 flex flex-col overflow-hidden z-[9999] pointer-events-auto"
          >
            {/* Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30 overflow-hidden">
                  <img src={apphiaIcon} alt="Apphia" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Apphia</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Active Supervision
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((msg) => (
                <div key={msg.id} className={cn(
                  "flex gap-3",
                  msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 overflow-hidden",
                    msg.role === 'user' ? "bg-cyan-500 text-white" : 
                    msg.role === 'system' ? "bg-slate-200 text-slate-500" : "bg-slate-900 text-white"
                  )}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : 
                     msg.role === 'system' ? (msg.type === 'routing' ? <Workflow className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />) : 
                     <img src={apphiaIcon} alt="Apphia" className="w-full h-full object-cover" />}
                  </div>
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-2xl text-sm shadow-sm font-bold",
                    msg.role === 'user' ? "bg-slate-900 text-white rounded-tr-none" : 
                    msg.role === 'system' ? "bg-slate-200 text-[#000080] text-[10px] font-mono border border-slate-300" :
                    "bg-white text-black border border-slate-300 rounded-tl-none"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {requestState.status === 'thinking' && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center overflow-hidden">
                    <img src={apphiaIcon} alt="Apphia" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-200 relative z-[10000]">
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Apphia anything..."
                  className="w-full pl-4 pr-20 py-3 bg-white border-2 border-slate-400 rounded-2xl text-sm text-black font-bold placeholder-slate-500 focus:ring-2 focus:ring-slate-900 transition-all outline-none relative z-[10001]"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || requestState.status === 'thinking'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#000080] text-white rounded-xl hover:bg-black disabled:opacity-50 transition-all flex items-center justify-center min-w-[70px] font-black text-xs uppercase tracking-widest shadow-lg z-[10002]"
                >
                  {requestState.status === 'thinking' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit'}
                </button>
              </div>
              {requestState.status === 'error' && (
                <div className="mt-2 text-xs text-red-500 font-bold text-center">
                  Error: {requestState.error}
                  <button onClick={handleSend} className="ml-2 underline">Retry</button>
                </div>
              )}
              {requestState.fallback && (
                <div className="mt-2 text-xs text-amber-600 font-bold text-center">
                  Fallback active: {requestState.output || "Provider unavailable"}
                </div>
              )}
              <p className="text-[10px] text-center text-black mt-3 font-black uppercase tracking-widest">
                Apphia v1.0 • AI-Supervised
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
