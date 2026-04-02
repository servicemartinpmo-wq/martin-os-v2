import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Send, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Terminal, 
  Database, 
  Network,
  Maximize2,
  Minimize2,
  RefreshCw,
  Sparkles,
  Brain,
  Users
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { AppMode } from '../../types';
import { supabase } from '../../lib/supabase';

interface ApphiaEngineProps {
  mode: AppMode;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'analyzing' | 'optimizing' | 'complete';
}

export default function ApphiaEngine({ mode }: ApphiaEngineProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Apphia Engine initialized. I am your autonomous support agent. How can I optimize your infrastructure today?",
      timestamp: new Date(),
      status: 'complete'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Call the OS Engine
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/os/engine', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) throw new Error('Failed to fetch AI response');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiContent = '';

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        aiContent += decoder.decode(value, { stream: true });
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiContent,
        timestamp: new Date(),
        status: 'complete'
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting to the engine right now. Please try again later.",
        timestamp: new Date(),
        status: 'complete'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const stats = [
    { label: 'Neural Load', value: '12%', icon: Brain, color: 'text-cyan-500' },
    { label: 'Processing Power', value: '4.2 TFLOPS', icon: Cpu, color: 'text-purple-500' },
    { label: 'Uptime', value: '99.999%', icon: Activity, color: 'text-emerald-500' },
    { label: 'Security Layer', value: 'Active', icon: ShieldCheck, color: 'text-blue-500' },
  ];

  return (
    <div className={cn(
      "flex flex-col h-full bg-slate-950 rounded-3xl border border-white/10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-500 relative",
      isExpanded ? "fixed inset-8 z-50" : "relative"
    )}>
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-500/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-slate-900/40 backdrop-blur-2xl flex items-center justify-between relative z-10">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />
            <div className="relative w-14 h-14 bg-gradient-to-br from-slate-800 to-slate-950 rounded-2xl border border-white/20 flex items-center justify-center shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
              <Bot className="text-cyan-400 w-8 h-8 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3 italic uppercase">
              APPHIA ENGINE
              <span className="px-2.5 py-0.5 bg-cyan-500/10 text-cyan-400 text-[9px] font-black rounded-full border border-cyan-500/20 uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                Autonomous v4.2
              </span>
            </h2>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] flex items-center gap-2 mt-0.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              Strategic Support & Diagnostics
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-6 mr-6">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-end">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                <span className={cn("text-xs font-black font-mono tracking-tighter", stat.color)}>{stat.value}</span>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-400 transition-all hover:scale-110 active:scale-95 shadow-lg"
          >
            {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-950">
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide"
          >
            <AnimatePresence mode="popLayout">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={cn(
                    "flex gap-4 max-w-2xl",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg",
                    msg.role === 'user' ? "bg-slate-800" : "bg-gradient-to-br from-cyan-500 to-blue-600"
                  )}>
                    {msg.role === 'user' ? <Users size={18} className="text-slate-400" /> : <Bot size={18} className="text-white" />}
                  </div>
                  <div className={cn(
                    "p-5 rounded-2xl text-sm leading-relaxed shadow-xl border",
                    msg.role === 'user' 
                      ? "bg-slate-900 border-slate-800 text-slate-200 rounded-tr-none" 
                      : "bg-slate-800/50 border-slate-700 text-white rounded-tl-none backdrop-blur-md"
                  )}>
                    {msg.content}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.status && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-cyan-500 uppercase tracking-widest">
                          <ShieldCheck size={10} />
                          {msg.status}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 mr-auto"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 animate-pulse">
                    <Bot size={18} className="text-white" />
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700 flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-slate-800 bg-slate-900/30 backdrop-blur-md">
            <form onSubmit={handleSend} className="relative max-w-4xl mx-auto">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Apphia to optimize, diagnose, or automate..."
                className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl py-4 pl-6 pr-16 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                <Send size={20} />
              </button>
            </form>
            <div className="mt-4 flex items-center justify-center gap-6">
              <button className="text-[10px] font-bold text-slate-500 hover:text-cyan-400 uppercase tracking-widest transition-colors flex items-center gap-2">
                <RefreshCw size={12} />
                Full System Scan
              </button>
              <button className="text-[10px] font-bold text-slate-500 hover:text-cyan-400 uppercase tracking-widest transition-colors flex items-center gap-2">
                <Zap size={12} />
                Optimize Cache
              </button>
              <button className="text-[10px] font-bold text-slate-500 hover:text-cyan-400 uppercase tracking-widest transition-colors flex items-center gap-2">
                <ShieldCheck size={12} />
                Security Audit
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        {!isExpanded && (
          <div className="w-72 border-l border-slate-800 bg-slate-900/20 p-6 space-y-8 hidden xl:block">
            <div>
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Engine Metrics</h3>
              <div className="space-y-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <stat.icon className={cn("w-4 h-4", stat.color)} />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                      </div>
                      <span className="text-[10px] font-black text-white">{stat.value}</span>
                    </div>
                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '70%' }}
                        className={cn("h-full bg-gradient-to-r from-cyan-500 to-blue-500")} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-slate-800">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Autonomous Tasks</h3>
              <div className="space-y-3">
                {[
                  { title: 'Log Rotation', status: 'Complete' },
                  { title: 'Database Indexing', status: 'In Progress' },
                  { title: 'Threat Hunting', status: 'Active' },
                ].map((task, i) => (
                  <div key={i} className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">{task.title}</span>
                    <span className="text-[8px] font-black text-cyan-500 uppercase tracking-widest">{task.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl mt-auto">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="text-cyan-500 w-4 h-4" />
                <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">System Insight</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed italic">
                "Infrastructure efficiency is currently at 94.2%. I recommend migrating legacy S3 buckets to Intelligent-Tiering to reduce costs by 12%."
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
