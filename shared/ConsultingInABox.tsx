import React from 'react';
import { 
  Target, 
  Settings, 
  DollarSign, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  TrendingUp, 
  BarChart3,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { AppMode } from '../../types';
import { cn } from '../../lib/utils';

interface ConsultingInABoxProps {
  mode: AppMode;
  className?: string;
}

export default function ConsultingInABox({ mode, className }: ConsultingInABoxProps) {
  const modules = [
    { 
      id: 'strategy', 
      title: 'Strategy Intelligence', 
      icon: Target, 
      color: 'blue',
      score: 88,
      recommendation: 'Refine Ansoff Matrix for market expansion.',
      frameworks: ['Ansoff Matrix', 'Strategy Diamond', 'Value Chain']
    },
    { 
      id: 'ops', 
      title: 'Operations Intelligence', 
      icon: Settings, 
      color: 'green',
      score: 94,
      recommendation: 'Optimize throughput in the delivery pipeline.',
      frameworks: ['SCOR Model', 'Lean Process', 'Six Sigma']
    },
    { 
      id: 'finance', 
      title: 'Financial Intelligence', 
      icon: DollarSign, 
      color: 'amber',
      score: 82,
      recommendation: 'Review WACC and hurdle rate for new investments.',
      frameworks: ['DuPont Analysis', 'EVA', 'WACC']
    },
    { 
      id: 'team', 
      title: 'Team Performance', 
      icon: Users, 
      color: 'purple',
      score: 96,
      recommendation: 'Address skill gaps in the engineering department.',
      frameworks: ['RACI Matrix', 'McKinsey 7S', 'Span of Control']
    },
    { 
      id: 'risk', 
      title: 'Risk & Compliance', 
      icon: ShieldCheck, 
      color: 'red',
      score: 90,
      recommendation: 'Update data governance policy for HIPAA compliance.',
      frameworks: ['Data Governance', 'Risk Mitigation', 'Compliance Audit']
    }
  ];

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="text-amber-500" size={24} />
          <h2 className="text-xl font-black text-slate-900">Consulting-in-a-Box</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Powered by</span>
          <span className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded uppercase tracking-tighter">Apphia Engine</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {modules.map((module) => (
          <div key={module.id} className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col group hover:border-blue-200 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded-lg", `bg-${module.color}-50`)}>
                <module.icon className={cn(`text-${module.color}-500`)} size={18} />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-lg font-black text-slate-900">{module.score}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/100</span>
              </div>
            </div>
            
            <h3 className="text-sm font-bold text-slate-900 mb-1">{module.title}</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-4">Intelligence Module</p>
            
            <div className="flex-1 space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Recommendation</p>
                <p className="text-[10px] text-slate-900 font-medium leading-relaxed">{module.recommendation}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Frameworks</p>
                <div className="flex flex-wrap gap-1">
                  {module.frameworks.map((f, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-white border border-slate-100 text-[8px] font-bold text-slate-500 rounded uppercase tracking-tighter">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button className="mt-6 w-full py-2 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
              Launch Module
              <ArrowRight size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Recommendation Engine - Next Best Actions */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Zap size={160} />
        </div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="text-amber-400" size={24} />
              <h3 className="text-xl font-black">Next Best Actions</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              The recommendation engine has analyzed 15D organizational signals and prioritized these actions based on impact vs. effort.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white">12</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Actions</span>
              </div>
              <div className="w-[1px] h-8 bg-slate-800" />
              <div className="flex flex-col">
                <span className="text-2xl font-black text-green-400">85%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Success Rate</span>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-3">
            {[
              { text: 'Implement North Star Metric for org alignment', impact: 'High', effort: 'Medium', category: 'Strategy' },
              { text: 'Automate weekly executive briefing generation', impact: 'High', effort: 'Low', category: 'Ops' },
              { text: 'Conduct Value Chain Analysis for cost optimization', impact: 'Medium', effort: 'High', category: 'Finance' },
            ].map((action, i) => (
              <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <CheckCircle2 size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{action.category}</span>
                    <div className="w-1 h-1 rounded-full bg-slate-700" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Impact: {action.impact}</span>
                  </div>
                  <p className="text-sm font-bold">{action.text}</p>
                </div>
                <ArrowRight size={16} className="text-slate-600 group-hover:text-white transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
