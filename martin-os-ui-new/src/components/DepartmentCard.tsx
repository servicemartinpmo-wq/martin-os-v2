import React from 'react';
import { TrendingUp, TrendingDown, MoreVertical, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

interface DepartmentCardProps {
  department: {
    id: string;
    name: string;
    maturity_score: number;
    health_status: 'optimal' | 'drift' | 'critical';
    lead_role_key: string;
  };
}

export default function DepartmentCard({ department }: DepartmentCardProps) {
  const getMaturityColor = (score: number) => {
    if (score <= 40) return 'text-status-red bg-status-red/20 border-status-red/40 shadow-[0_0_15px_rgba(230,57,70,0.2)]';
    if (score <= 60) return 'text-status-yellow bg-status-yellow/20 border-status-yellow/40 shadow-[0_0_15px_rgba(255,183,3,0.2)]';
    if (score <= 80) return 'text-status-green bg-status-green/20 border-status-green/40 shadow-[0_0_15px_rgba(42,157,143,0.2)]';
    return 'text-status-elite bg-status-elite/20 border-status-elite/40 shadow-[0_0_15px_rgba(0,209,255,0.3)]';
  };

  const getMaturityBarColor = (score: number) => {
    if (score <= 40) return 'bg-status-red shadow-[0_0_10px_rgba(230,57,70,0.5)]';
    if (score <= 60) return 'bg-status-yellow shadow-[0_0_10px_rgba(255,183,3,0.5)]';
    if (score <= 80) return 'bg-status-green shadow-[0_0_10px_rgba(42,157,143,0.5)]';
    return 'bg-status-elite shadow-[0_0_10px_rgba(0,209,255,0.6)]';
  };

  const getMaturityTier = (score: number) => {
    if (score <= 40) return 'Foundational';
    if (score <= 60) return 'Developing';
    if (score <= 80) return 'Structured';
    return 'Optimized';
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:bg-white/[0.08] transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 transition-all duration-500",
            getMaturityColor(department.maturity_score)
          )}>
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-1">{department.name}</h3>
            <div className="flex items-center gap-2">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{department.lead_role_key}</p>
              <span className={cn(
                "text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest border",
                department.maturity_score > 80 ? "border-status-elite/30 text-status-elite" : "border-slate-500/30 text-slate-500"
              )}>
                {getMaturityTier(department.maturity_score)}
              </span>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-xl transition-all">
          <MoreVertical className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Operational Maturity</h4>
            <div className="flex items-baseline gap-2">
              <span className={cn(
                "text-3xl font-black tracking-tighter transition-colors duration-500",
                department.maturity_score > 80 ? "text-status-elite" : "text-white"
              )}>{department.maturity_score}</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">/ 100</span>
            </div>
          </div>
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
            department.maturity_score > 60 ? "text-emerald-400 bg-emerald-500/10" : "text-rose-400 bg-rose-500/10"
          )}>
            {department.maturity_score > 60 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {department.maturity_score > 60 ? "+12%" : "-4%"}
          </div>
        </div>

        {/* Maturity Bar */}
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-1000",
              getMaturityBarColor(department.maturity_score)
            )}
            style={{ width: `${department.maturity_score}%` }}
          />
        </div>
      </div>

      {/* Background Glow */}
      <div className={cn(
        "absolute -right-12 -bottom-12 w-32 h-32 rounded-full blur-3xl opacity-10 transition-all duration-1000",
        department.maturity_score > 80 ? "bg-status-elite" : 
        department.maturity_score > 60 ? "bg-status-green" :
        department.maturity_score > 40 ? "bg-status-yellow" : "bg-status-red"
      )} />
    </div>
  );
}
