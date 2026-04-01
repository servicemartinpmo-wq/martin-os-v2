import React from 'react';
import { 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  MessageSquare, 
  Zap, 
  ArrowRight,
  ShieldAlert,
  Clock,
  Target
} from 'lucide-react';
import { AppMode } from '../../types';
import { cn } from '../../lib/utils';
import { useSignals } from '../../hooks/useSignals';

interface IntelligenceAdvisoryLayerProps {
  mode: AppMode;
  className?: string;
  workspaceId: string;
}

export default function IntelligenceAdvisoryLayer({ mode, className, workspaceId }: IntelligenceAdvisoryLayerProps) {
  const { signals } = useSignals(workspaceId);

  // ... (rest of the component)
  // Mode-specific content logic
  const getBriefing = () => {
    switch (mode) {
      case 'Founder/SMB':
        return {
          title: "Founder's Daily Briefing",
          priorities: ["Review Q3 Cashflow", "Approve Marketing Budget", "Check Team Utilization"],
          risks: [{ type: 'revenue', level: 'medium', text: 'Q3 target at 85% projection' }]
        };
      case 'Executive':
        return {
          title: "Executive Strategic Briefing",
          priorities: ["Org-wide Uptime Review", "Strategic Initiative Alignment", "Leadership Sync"],
          risks: [{ type: 'delays', level: 'high', text: 'Project Alpha delayed by 2 weeks' }]
        };
      case 'Healthcare':
        return {
          title: "Clinical Operations Briefing",
          priorities: ["HIPAA Audit Readiness", "Patient Throughput Optimization", "Staffing Compliance"],
          risks: [{ type: 'compliance', level: 'high', text: 'Data privacy audit due in 48h' }]
        };
      case 'Assisted':
        return {
          title: "Your Daily Helper",
          priorities: ["Check your messages", "Review today's tasks", "Call your assistant"],
          risks: [{ type: 'help', level: 'low', text: 'You have 3 new notifications' }]
        };
      default:
        return {
          title: "Daily Briefing",
          priorities: ["Task Review", "Goal Alignment", "Risk Assessment"],
          risks: []
        };
    }
  };

  const briefing = getBriefing();

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
      {/* Intelligence Advisory - Next Best Action */}
      <div className="col-span-1 md:col-span-2 bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <Brain size={120} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Brain className="text-blue-400" size={20} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Intelligence Advisory</span>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">{briefing.title}</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md">
            Based on current operational signals, here are your next best actions to maintain momentum.
          </p>
          
          <div className="space-y-3">
            {briefing.priorities.map((priority, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group/item">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-400">
                  {i + 1}
                </div>
                <span className="text-sm font-medium">{priority}</span>
                <ArrowRight size={14} className="ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Alerts & Predictive Insights */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-amber-500" size={20} />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Risk Alerts</span>
          </div>
          <div className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold rounded uppercase tracking-tighter">
            Live
          </div>
        </div>

        <div className="space-y-4 flex-1">
          {briefing.risks.length > 0 ? (
            briefing.risks.map((risk, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl border-l-4 border-amber-500">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">{risk.type}</span>
                  <span className={cn(
                    "text-[10px] font-bold uppercase",
                    risk.level === 'high' ? "text-red-500" : "text-amber-500"
                  )}>{risk.level} risk</span>
                </div>
                <p className="text-sm font-bold text-slate-900">{risk.text}</p>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-3">
                <Zap className="text-green-500" size={20} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No Critical Risks</p>
              <p className="text-[10px] text-slate-400 mt-1">Systems are operating within normal parameters.</p>
            </div>
          )}
        </div>

        <button className="mt-6 w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
          <TrendingUp size={14} />
          View Predictive Insights
        </button>
      </div>
    </div>
  );
}
