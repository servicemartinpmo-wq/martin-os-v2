import React from 'react';

export const NetworkBroadcastPanel = ({ templateId }: { templateId: string }) => {
  return (
    <div className="p-8 bg-onyx border border-white/10 rounded-3xl shadow-embossed">
      <h3 className="text-silver font-bold mb-6 tracking-widest uppercase text-xs">Network Deployment</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Link 1: Internal Ecosystem */}
        <button className="flex flex-col p-4 bg-white/5 border border-status-blue/30 rounded-xl hover:bg-status-blue/10 transition-all">
          <span className="text-white font-bold text-sm">miidle Ecosystem</span>
          <span className="text-[10px] text-white/40">Deploy to global leaderboard</span>
        </button>

        {/* Link 2: External Lead Gen */}
        <button className="flex flex-col p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
          <span className="text-white font-bold text-sm">Public URL</span>
          <span className="text-[10px] text-white/40">Capture leads via LinkedIn/X</span>
        </button>
      </div>

      {/* Real-time Network Pulse */}
      <div className="h-24 w-full bg-black/40 rounded-xl border border-white/5 p-4 overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="flex justify-between items-center relative z-10">
          <p className="text-[10px] text-white/20 uppercase font-mono">Live Network Ingestion</p>
          <div className="flex -space-x-2">
             <div className="h-6 w-6 rounded-full bg-slate-700 border border-onyx" />
             <div className="h-6 w-6 rounded-full bg-slate-600 border border-onyx" />
             <div className="h-6 w-6 rounded-full bg-status-blue border border-onyx flex items-center justify-center text-[8px]">+14</div>
          </div>
        </div>
        <p className="text-xl text-white font-mono mt-2">1,240 <span className="text-xs text-green-400">Total Interactions</span></p>
      </div>
    </div>
  );
};
