import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

const QualityControlView = () => (
  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">Quality Control</h3>
      <span className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-md text-[8px] font-bold text-amber-400 uppercase tracking-widest">3 Anomalies</span>
    </div>
    <div className="space-y-4">
      {[
        { id: 1, type: 'Missed Task', desc: 'Q1 Audit Report overdue by 48h', severity: 'high' },
        { id: 2, type: 'Data Gap', desc: 'Missing budget allocation for Project Delta', severity: 'medium' },
        { id: 3, type: 'Approval Pending', desc: 'Site Access SOP requires executive sign-off', severity: 'low' },
      ].map(item => (
        <div key={item.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all">
          <div className="flex gap-3 items-center">
            <div className={cn(
              "w-2 h-2 rounded-full",
              item.severity === 'high' ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" : 
              item.severity === 'medium' ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : 
              "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
            )} />
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{item.type}</p>
              <p className="text-xs text-white font-medium">{item.desc}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-all" />
        </div>
      ))}
    </div>
  </div>
);

export default QualityControlView;
