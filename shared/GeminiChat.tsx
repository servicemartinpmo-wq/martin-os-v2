import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const GeminiChat = ({ systemInstruction }: { systemInstruction: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');

    try {
      setLoading(true);
      const res = await fetch('/api/pmo/chat_message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: currentInput,
          systemInstruction,
          history: messages 
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Chat failed');
      
      setMessages(prev => [...prev, { role: 'model', text: data.result?.text || data.result?.message || 'Response received.' }]);
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: `Error: ${error.message || 'Sorry, I encountered an error.'}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}
          >
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", msg.role === 'user' ? "bg-blue-100" : "bg-slate-100")}>
              {msg.role === 'user' ? <User className="w-5 h-5 text-blue-600" /> : <Bot className="w-5 h-5 text-slate-600" />}
            </div>
            <div className={cn("p-3 rounded-2xl text-sm max-w-[80%]", msg.role === 'user' ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-800")}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
            </div>
          </motion.div>
        )}
      </div>
      <div className="p-4 border-t border-slate-100 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button onClick={handleSend} className="p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800">
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Helper to avoid import issues if cn is not available
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
