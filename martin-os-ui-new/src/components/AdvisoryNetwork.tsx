import React from 'react';
import { Shield, CheckCircle2, ChevronRight } from 'lucide-react';

const AdvisoryNetwork = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-black tracking-tighter text-white">Advisory Network</h2>
      <div className="flex gap-2">
        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          Advisor Online
        </span>
      </div>
    </div>
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-8 space-y-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <h3 className="text-lg font-bold text-white mb-6">Secure Communication Channel</h3>
          <div className="space-y-6 h-[400px] overflow-y-auto pr-4 custom-scrollbar">
            <div className="flex justify-start">
              <div className="max-w-[80%] bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none">
                <p className="text-xs text-slate-400 mb-2 font-bold uppercase tracking-widest">Advisor • 09:45 AM</p>
                <p className="text-sm text-slate-200 leading-relaxed">I've analyzed your Q1 performance data. The bottleneck in Program Delivery is systemic. Suggesting a shift to the 'Pull' system we discussed last week.</p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="max-w-[80%] bg-blue-600/20 border border-blue-500/30 p-4 rounded-2xl rounded-tr-none">
                <p className="text-xs text-blue-400 mb-2 font-bold uppercase tracking-widest">You • 10:12 AM</p>
                <p className="text-sm text-blue-50 leading-relaxed">Agreed. Let's start the transition for the Engineering team first. Can you draft the SOP update?</p>
              </div>
            </div>
          </div>
          <div className="mt-6 relative">
            <input 
              placeholder="Message your advisor..." 
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pr-16 outline-none focus:border-blue-500/50 transition-all text-sm"
            />
            <button className="absolute right-2 top-2 p-2 bg-blue-600 rounded-xl hover:bg-blue-500 transition-all">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
      <div className="col-span-4 space-y-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-6">Request Strategy Audit</h3>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">Submit a request for a deep-dive operational audit of any department or initiative.</p>
          <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            Submit Request
          </button>
        </div>
        <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-4">Tier Status: COMMAND</h3>
          <p className="text-xs text-blue-100/70 mb-6 leading-relaxed">You have unlimited access to the Advisory Network and real-time diagnostic tools.</p>
          <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
            <CheckCircle2 className="w-4 h-4" />
            Dedicated Advisor Active
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AdvisoryNetwork;
