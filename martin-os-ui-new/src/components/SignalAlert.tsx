import React from 'react';

export default function SignalAlert({ alert }: { alert: any }) {
  return (
    <div className="animate-in fade-in slide-in-from-right-10 duration-500 bg-[#0a0a0a]/80 backdrop-blur-3xl border border-blue-500/30 rounded-xl p-4 shadow-[0_0_30px_rgba(59,130,246,0.15)] group relative overflow-hidden">
      {/* Laminated "Glow" Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
      
      <div className="flex items-start gap-3 relative z-10">
        <div className="mt-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]" />
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold mb-1">
            {alert.type || 'SYSTEM_SIGNAL'}
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-light">
            {alert.content}
          </p>
          <div className="mt-3 flex gap-2">
            {/* This button triggers the 'communicationDraft' tool via the Thinking Engine */}
            <button 
              data-action="workflow" 
              data-value={`generate_draft_for_${alert.domain || 'SYSTEM'}`}
              className="px-3 py-1 bg-blue-600/20 border border-blue-500/40 text-[10px] text-blue-400 rounded-md hover:bg-blue-600 hover:text-white transition-all shadow-inner uppercase tracking-widest font-bold"
            >
              Generate Resolution Draft
            </button>
            
            <button 
              data-action="workflow" 
              data-value="ignore_signal"
              className="px-3 py-1 bg-white/5 text-[10px] text-slate-500 rounded-md hover:text-slate-300 uppercase tracking-widest"
            >
              Mute
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
