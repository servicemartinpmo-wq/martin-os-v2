import React from 'react';
import { 
  Brain, 
  History, 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Zap, 
  BarChart3,
  MessageSquare,
  ShieldCheck,
  Clock,
  TrendingUp
} from 'lucide-react';
import { AppMode } from '../../types';
import { cn } from '../../lib/utils';

interface DecisionMemorySystemProps {
  mode: AppMode;
  className?: string;
}

export default function DecisionMemorySystem({ mode, className }: DecisionMemorySystemProps) {
  const decisions = [
    { 
      id: 1, 
      decision: 'Pivot to Enterprise SaaS Model', 
      reasoning: 'Market shift towards high-value B2B contracts and recurring revenue stability.',
      expectedOutcome: '30% increase in NRR within 6 months.',
      accuracy: 92,
      status: 'Validated',
      date: '2025-10-12'
    },
    { 
      id: 2, 
      decision: 'Implement Intelligence-powered QA Pipeline', 
      reasoning: 'Bottleneck in manual testing slowing down product velocity by 15%.',
      expectedOutcome: '50% reduction in cycle time.',
      accuracy: 85,
      status: 'Tracking',
      date: '2026-01-05'
    },
    { 
      id: 3, 
      decision: 'Expand to APAC Market', 
      reasoning: 'Untapped demand for operational intelligence in manufacturing sector.',
      expectedOutcome: '10 new enterprise clients by Q4.',
      accuracy: 45,
      status: 'Early Stage',
      date: '2026-03-15'
    }
  ];

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Decision Log & Long-term Memory */}
        <div className="md:col-span-2 bg-white border border-slate-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <History className="text-slate-400" size={20} />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Decision Log & Memory</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Decision Accuracy:</span>
              <span className="text-sm font-black text-blue-500">88%</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {decisions.map((item) => (
              <div key={item.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "px-2 py-0.5 text-[8px] font-bold rounded uppercase tracking-tighter",
                      item.status === 'Validated' ? "bg-green-500 text-white" : "bg-blue-500 text-white"
                    )}>
                      {item.status}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{item.decision}</h4>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.date}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reasoning</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.reasoning}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expected Outcome</p>
                    <p className="text-xs text-slate-900 font-bold leading-relaxed">{item.expectedOutcome}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Accuracy</span>
                      <span className={cn(
                        "text-xs font-black",
                        item.accuracy > 80 ? "text-green-500" : "text-amber-500"
                      )}>{item.accuracy}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confidence</span>
                      <span className="text-xs font-black text-slate-900">High</span>
                    </div>
                  </div>
                  <button className="p-2 bg-white border border-slate-100 text-slate-400 rounded-lg hover:text-slate-900 transition-colors">
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Predictive Decision Science */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Brain size={160} />
          </div>
          
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Brain className="text-blue-400" size={24} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Decision Science</span>
            </div>
            
            <h2 className="text-2xl font-black mb-4">Predictive Outcome Modeling</h2>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              The system uses Bayesian Analysis and OODA Loops to model probabilistic outcomes for pending decisions.
            </p>
            
            <div className="space-y-4">
              {[
                { label: 'OODA Loop Cycle', value: '12h', icon: Clock },
                { label: 'Bayesian Confidence', value: '94%', icon: ShieldCheck },
                { label: 'Scenario Models', value: '1,240', icon: BarChart3 },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2">
                    <stat.icon size={14} className="text-blue-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                  </div>
                  <span className="text-sm font-black">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="mt-8 relative z-10 w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2">
            <Zap size={16} />
            Run Scenario Simulation
          </button>
        </div>
      </div>
    </div>
  );
}
