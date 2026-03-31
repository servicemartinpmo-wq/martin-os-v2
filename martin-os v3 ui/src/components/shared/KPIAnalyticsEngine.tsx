import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Zap, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Users, 
  Target,
  BarChart
} from 'lucide-react';
import { AppMode } from '../../types';
import { cn } from '../../lib/utils';
import { 
  ResponsiveContainer, 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Cell
} from 'recharts';

interface KPIAnalyticsEngineProps {
  mode: AppMode;
  className?: string;
}

const kpiData = [
  { name: 'Revenue', value: 85, target: 100, trend: '+12%', status: 'On Track' },
  { name: 'NRR', value: 92, target: 90, trend: '+5%', status: 'Exceeding' },
  { name: 'CAC', value: 45, target: 40, trend: '-8%', status: 'Optimizing' },
  { name: 'LTV', value: 78, target: 80, trend: '+3%', status: 'Stable' },
  { name: 'Churn', value: 12, target: 10, trend: '+2%', status: 'At Risk' },
];

export default function KPIAnalyticsEngine({ mode, className }: KPIAnalyticsEngineProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Automatic KPI Discovery */}
        <div className="md:col-span-1 bg-slate-900 text-white rounded-2xl p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Search size={100} />
          </div>
          
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Search className="text-blue-400" size={20} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">KPI Discovery</span>
            </div>
            
            <h3 className="text-xl font-black mb-4">Autonomous Discovery</h3>
            <p className="text-slate-400 text-xs mb-6 leading-relaxed">
              The engine has identified 5 new behavioral KPIs based on recent operational patterns.
            </p>
            
            <div className="space-y-3">
              {['Decision Latency', 'Workflow Friction', 'Resource Drag'].map((kpi, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10">
                  <Zap size={12} className="text-amber-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{kpi}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="mt-8 relative z-10 w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border border-white/10 flex items-center justify-center gap-2">
            Review New KPIs
          </button>
        </div>

        {/* KPI Tracking & Benchmarking */}
        <div className="md:col-span-3 bg-white border border-slate-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-slate-400" size={20} />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">KPI Tracking & Benchmarking</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-200" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target</span>
              </div>
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={kpiData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #f1f5f9', 
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: 700,
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={32}>
                  {kpiData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value >= entry.target ? '#3b82f6' : '#94a3b8'} />
                  ))}
                </Bar>
                <Bar dataKey="target" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={32} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Behavioral Analytics */}
        <div className="md:col-span-2 bg-white border border-slate-100 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-8">
            <Activity className="text-slate-400" size={20} />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Behavioral Analytics</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Decision Latency', value: '4.2h', trend: '-15%', icon: Clock, color: 'blue' },
              { label: 'Team Workload', value: '82%', trend: '+5%', icon: Users, color: 'purple' },
              { label: 'Dependency Drag', value: '12%', trend: '-2%', icon: Target, color: 'amber' },
            ].map((metric, i) => (
              <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-2 rounded-lg", `bg-${metric.color}-50`)}>
                    <metric.icon className={cn(`text-${metric.color}-500`)} size={18} />
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold flex items-center gap-0.5",
                    metric.trend.startsWith('-') ? "text-green-500" : "text-red-500"
                  )}>
                    {metric.trend.startsWith('-') ? <ArrowDownRight size={10} /> : <ArrowUpRight size={10} />}
                    {metric.trend}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{metric.label}</p>
                <p className="text-xl font-black text-slate-900">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Predictive KPI Insights */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-blue-500" size={20} />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Predictive Insights</span>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="p-4 bg-white rounded-xl border border-blue-100 shadow-sm">
              <h4 className="text-xs font-bold text-slate-900 mb-2">Revenue Forecast</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed mb-3">
                Based on current momentum, revenue is projected to hit $1.5M by end of Q4, exceeding targets by 15%.
              </p>
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[85%]" />
                </div>
                <span className="text-[10px] font-bold text-blue-500">85% Confidence</span>
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-xl border border-blue-100 shadow-sm">
              <h4 className="text-xs font-bold text-slate-900 mb-2">Churn Risk Detection</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed mb-3">
                Early signals indicate a potential 2% increase in churn for Tier 1 clients due to onboarding friction.
              </p>
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[65%]" />
                </div>
                <span className="text-[10px] font-bold text-amber-500">65% Confidence</span>
              </div>
            </div>
          </div>

          <button className="mt-6 w-full py-3 bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all hover:bg-blue-600 flex items-center justify-center gap-2">
            <Zap size={14} />
            Run Full Projection
          </button>
        </div>
      </div>
    </div>
  );
}
