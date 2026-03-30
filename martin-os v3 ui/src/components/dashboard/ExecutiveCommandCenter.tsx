import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  ShieldAlert, 
  Target, 
  Zap,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import { AppMode } from '../../types';
import { cn } from '../../lib/utils';

interface ExecutiveCommandCenterProps {
  mode: AppMode;
}

export default function ExecutiveCommandCenter({ mode }: ExecutiveCommandCenterProps) {
  const isExecutive = mode === 'Executive' || mode === 'Founder/SMB';
  
  return (
    <div className="p-6 space-y-8 bg-white min-h-screen text-slate-900">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
            Executive Command Center
          </h1>
          <p className="text-slate-500 font-mono text-xs mt-1">
            SYSTEM_STATUS: <span className="text-emerald-600 font-bold">OPTIMAL</span> | MODE: {mode.toUpperCase()}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-right">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Org Health Score</div>
            <div className="text-3xl font-black text-emerald-600">94.2</div>
          </div>
        </div>
      </div>

      {/* Top Row: Strategic Initiatives & Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strategic Initiatives */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-600">
              <Target className="w-4 h-4 text-blue-600" />
              Strategic Initiatives
            </h2>
            <button className="text-[10px] text-blue-600 hover:underline flex items-center gap-1 uppercase font-bold">
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            {[
              { title: 'Market Expansion Q3', progress: 65, status: 'On Track', impact: 'High' },
              { title: 'Product Core Refactor', progress: 42, status: 'At Risk', impact: 'Critical' },
              { title: 'Talent Acquisition Drive', progress: 88, status: 'On Track', impact: 'Medium' },
            ].map((item, i) => (
              <div key={i} className="group p-4 bg-white border border-slate-100 rounded-lg hover:border-blue-500/50 transition-all cursor-pointer hover:shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900">{item.title}</h3>
                    <div className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-tighter">IMPACT: {item.impact}</div>
                  </div>
                  <span className={cn(
                    "text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter",
                    item.status === 'On Track' ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                  )}>
                    {item.status}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>PROGRESS</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      className={cn(
                        "h-full rounded-full",
                        item.status === 'On Track' ? "bg-emerald-500" : "bg-red-500"
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Alerts */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-600">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              Operational Alerts
            </h2>
          </div>
          <div className="p-4 space-y-3">
            {[
              { type: 'Risk', msg: 'Engineering capacity bottleneck detected in Sprint 14', time: '2h ago' },
              { type: 'Critical', msg: 'Revenue drift exceeding 5% threshold in EMEA', time: '5h ago' },
              { type: 'Warning', msg: 'Key dependency delay: Project Alpha → Beta', time: '1d ago' },
            ].map((alert, i) => (
              <div key={i} className="p-3 bg-red-50 border-l-2 border-red-500 rounded-r-lg space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">{alert.type}</span>
                  <span className="text-[9px] text-slate-400 font-mono">{alert.time}</span>
                </div>
                <p className="text-xs text-slate-700 leading-tight font-medium">{alert.msg}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Key Decisions & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Decisions Queue */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-600">
              <Zap className="w-4 h-4 text-amber-600" />
              Decision Queue
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {[
              { title: 'Approve Q4 Budget Reallocation', context: 'Strategy shift requires 15% move from Marketing to R&D', deadline: 'Today' },
              { title: 'Hiring Freeze Exception: Lead Architect', context: 'Critical gap in Cloud Infrastructure team', deadline: '2 days' },
            ].map((decision, i) => (
              <div key={i} className="p-4 bg-white border border-slate-100 rounded-lg flex gap-4 hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{decision.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-3">{decision.context}</p>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold uppercase rounded hover:bg-slate-800 transition-colors">Approve</button>
                    <button className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded hover:bg-slate-200 transition-colors">Review</button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-slate-400 uppercase font-bold mb-1">Deadline</div>
                  <div className="text-xs font-mono text-amber-600 font-bold">{decision.deadline}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intelligence Panel */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden relative group shadow-sm">
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-600">
              <Activity className="w-4 h-4 text-purple-600" />
              Intelligence Feed
            </h2>
          </div>
          <div className="p-6 flex flex-col items-center justify-center text-center space-y-4 min-h-[200px]">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1 uppercase tracking-widest">Predictive Insight Detected</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Based on current execution velocity, "Market Expansion Q3" has a 78% probability of hitting milestones 2 weeks early.
              </p>
            </div>
            <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest border border-blue-200 px-4 py-2 rounded-full hover:bg-blue-50 transition-all">
              Run Simulation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
