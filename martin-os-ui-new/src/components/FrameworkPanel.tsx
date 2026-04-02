import React from 'react';
import { Target, Zap, Activity, Shield, BarChart3, LayoutGrid } from 'lucide-react';
import { cn } from '../lib/utils';

interface FrameworkPanelProps {
  activeFrameworks: {
    id: string;
    name: string;
    status: 'active' | 'evaluating' | 'optimizing';
    icon: any;
    color: string;
  }[];
}

export default function FrameworkPanel({ activeFrameworks }: FrameworkPanelProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-2">Framework Logic Layer</h3>
          <p className="text-sm text-slate-400 font-medium">Active Strategic Models</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
          <Zap className="w-4 h-4 text-blue-400 animate-pulse" />
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Engine: Optimized</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {activeFrameworks.map((f) => (
          <div 
            key={f.id}
            className="p-5 bg-black/40 border border-white/5 rounded-2xl hover:bg-white/5 transition-all group relative overflow-hidden"
          >
            <div className={cn(
              "absolute -right-4 -bottom-4 w-16 h-16 opacity-10 blur-xl rounded-full",
              f.color === 'blue' ? "bg-blue-500" : f.color === 'cyan' ? "bg-cyan-500" : "bg-purple-500"
            )} />
            
            <div className="flex justify-between items-start mb-4">
              <f.icon className={cn(
                "w-6 h-6",
                f.color === 'blue' ? "text-blue-400" : f.color === 'cyan' ? "text-cyan-400" : "text-purple-400"
              )} />
              <div className={cn(
                "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border",
                f.status === 'active' ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-amber-400 bg-amber-500/10 border-amber-500/20"
              )}>
                {f.status}
              </div>
            </div>
            
            <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-widest">{f.name}</h4>
            <p className="text-[10px] text-slate-500 font-medium">Strategic Logic Active</p>
          </div>
        ))}
      </div>

      {/* Background Glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl opacity-50" />
    </div>
  );
}
