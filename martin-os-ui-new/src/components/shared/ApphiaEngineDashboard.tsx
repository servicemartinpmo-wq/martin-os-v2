import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Activity,
  ShieldCheck,
  Workflow,
  AlertTriangle
} from 'lucide-react';
import { useAI } from '../../context/AIContext';
import { cn } from '../../lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  type?: 'text' | 'supervision' | 'routing';
}

export default function ApphiaEngineDashboard() {
  const { apphia, ai } = useAI();
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: 'Apphia Engine initialized. How can I assist with system supervision or workflow optimization?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [engineStatus, setEngineStatus] = useState<'idle' | 'thinking' | 'error'>('idle');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || engineStatus === 'thinking') return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setEngineStatus('thinking');

    try {
      const routing = await apphia.routeQuery(input);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'system', 
        content: `Routing: ${routing.route}. Reasoning: ${routing.reasoning}`,
        type: 'routing'
      }]);

      const response = await ai.chat([{ role: 'user', content: input }], 'gemini');
      setMessages(prev => [...prev, { id: (Date.now() + 2).toString(), role: 'assistant', content: response }]);
      setEngineStatus('idle');
    } catch (error: any) {
      setEngineStatus('error');
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: `Error: ${error.message}` }]);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Apphia Engine Dashboard</h2>
          <p className="text-slate-500 mt-1">Real-time supervision and workflow interaction.</p>
        </div>
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full border font-bold text-xs uppercase tracking-widest",
          engineStatus === 'idle' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
          engineStatus === 'thinking' ? "bg-amber-50 text-amber-700 border-amber-200" :
          "bg-red-50 text-red-700 border-red-200"
        )}>
          <Activity className="w-4 h-4" />
          {engineStatus === 'idle' ? 'Engine Ready' : engineStatus === 'thinking' ? 'Engine Processing' : 'Engine Error'}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col h-[600px]">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", msg.role === 'user' ? "bg-slate-900 text-white" : "bg-cyan-100 text-cyan-700")}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={cn("max-w-[80%] p-4 rounded-2xl text-sm font-medium", msg.role === 'user' ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900")}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-slate-200">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Apphia Engine..."
                className="w-full pl-4 pr-16 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-cyan-500 transition-all outline-none"
              />
              <button
                onClick={handleSend}
                disabled={engineStatus === 'thinking'}
                className="absolute right-2 top-2 bottom-2 px-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 space-y-6">
          <h3 className="font-bold text-slate-900">Engine Metrics</h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Supervision Score</div>
              <div className="text-2xl font-black text-emerald-600">98.5%</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Agents</div>
              <div className="text-2xl font-black text-blue-600">4</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
