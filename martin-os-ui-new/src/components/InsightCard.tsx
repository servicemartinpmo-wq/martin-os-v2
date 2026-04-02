import React from 'react';
import { AlertCircle, Lightbulb, Target, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface InsightCardProps {
  insight: {
    type?: 'CRITICAL' | 'WARNING' | 'HEALTHY' | 'ELITE';
    situation: string;
    diagnosis: string;
    recommendation: string;
    structural_remedy: string;
    framework: string;
    timestamp: string;
  };
}

export default function InsightCard({ insight }: InsightCardProps) {
  const getStatusColor = (type?: string) => {
    switch (type) {
      case 'CRITICAL': return 'border-status-red shadow-[0_0_20px_rgba(230,57,70,0.1)]';
      case 'WARNING': return 'border-status-yellow shadow-[0_0_20px_rgba(255,183,3,0.1)]';
      case 'HEALTHY': return 'border-status-green shadow-[0_0_20px_rgba(42,157,143,0.1)]';
      case 'ELITE': return 'border-status-elite shadow-[0_0_20px_rgba(0,209,255,0.1)]';
      default: return 'border-white/10';
    }
  };

  const getIconColor = (type?: string) => {
    switch (type) {
      case 'CRITICAL': return 'text-status-red bg-status-red/10 border-status-red/20';
      case 'WARNING': return 'text-status-yellow bg-status-yellow/10 border-status-yellow/20';
      case 'HEALTHY': return 'text-status-green bg-status-green/10 border-status-green/20';
      case 'ELITE': return 'text-status-elite bg-status-elite/10 border-status-elite/20';
      default: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className={cn(
      "bg-white/5 border-l-4 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden group animate-in fade-in zoom-in duration-500",
      getStatusColor(insight.type)
    )}>
      {/* Framework Badge */}
      <div className="absolute top-4 right-4 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
        {insight.framework}
      </div>

      <div className="space-y-6">
        {/* Situation */}
        <div className="flex gap-4">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
            getIconColor(insight.type)
          )}>
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Situation</h4>
            <p className="text-sm text-white font-medium leading-relaxed">{insight.situation}</p>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Diagnosis</h4>
            <p className="text-sm text-slate-300 leading-relaxed italic">"{insight.diagnosis}"</p>
          </div>
        </div>

        {/* Recommendation & Structural Remedy */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex gap-3">
            <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Recommendation</h5>
              <p className="text-xs text-slate-400 leading-relaxed">{insight.recommendation}</p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-white/5">
            <button 
              data-action="workflow"
              data-value={`remedy_${insight.framework.toLowerCase()}`}
              className="w-full flex items-center justify-between group/btn"
            >
              <div className="text-left">
                <h5 className="text-[10px] font-black text-status-elite uppercase tracking-widest mb-1">Structural Remedy</h5>
                <p className="text-xs text-white font-bold">{insight.structural_remedy}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-status-elite group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Background Glow */}
      <div className={cn(
        "absolute -bottom-12 -left-12 w-32 h-32 rounded-full blur-3xl opacity-10",
        insight.type === 'CRITICAL' ? 'bg-status-red' :
        insight.type === 'WARNING' ? 'bg-status-yellow' :
        insight.type === 'HEALTHY' ? 'bg-status-green' : 'bg-status-elite'
      )} />
    </div>
  );
}
