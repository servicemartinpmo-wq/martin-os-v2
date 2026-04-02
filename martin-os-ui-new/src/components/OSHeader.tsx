import React from 'react';

export default function OSHeader({ isThinking, currentModel }: { isThinking: boolean, currentModel: string }) {
  return (
    <div className="flex justify-between items-center p-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl">
      <div className="flex items-center gap-4">
        {/* Laminated Pulse Indicator */}
        <div className={`w-3 h-3 rounded-full transition-all duration-500 shadow-[0_0_15px] ${
          isThinking ? 'bg-blue-400 animate-pulse shadow-blue-500' : 'bg-emerald-500 shadow-emerald-500/50'
        }`} />
        <h1 className="text-xl font-bold tracking-widest uppercase">
          Apphia <span className="opacity-20">v2.1</span>
        </h1>
        <div className="h-4 w-px bg-white/10 mx-2" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 italic">
          "You deserve the structure and support to succeed."
        </span>
      </div>

      <div className="flex gap-4 items-center">
        {/* Technical Metadata */}
        <div className="text-[10px] font-mono text-slate-500 flex gap-3">
          <span>LATENCY: <span className="text-blue-400">12ms</span></span>
          <span>ENGINE: <span className="text-white">{currentModel}</span></span>
          <span>STATUS: <span className="text-emerald-400">OPTIMIZED</span></span>
        </div>
      </div>
    </div>
  );
}
