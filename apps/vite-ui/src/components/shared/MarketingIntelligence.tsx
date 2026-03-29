import React from 'react';
import { 
  Megaphone, 
  TrendingUp, 
  Target, 
  Zap, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight, 
  BarChart3, 
  Search, 
  Globe, 
  MessageSquare,
  Share2
} from 'lucide-react';
import { AppMode } from '../../types';
import { cn } from '../../lib/utils';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

interface MarketingIntelligenceProps {
  mode: AppMode;
  className?: string;
}

const campaignData = [
  { name: 'Mon', reach: 4000, conv: 2400 },
  { name: 'Tue', reach: 3000, conv: 1398 },
  { name: 'Wed', reach: 2000, conv: 9800 },
  { name: 'Thu', reach: 2780, conv: 3908 },
  { name: 'Fri', reach: 1890, conv: 4800 },
  { name: 'Sat', reach: 2390, conv: 3800 },
  { name: 'Sun', reach: 3490, conv: 4300 },
];

export default function MarketingIntelligence({ mode, className }: MarketingIntelligenceProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Signal Ingestion & Algorithm Scoring */}
        <div className="md:col-span-1 bg-slate-900 text-white rounded-2xl p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Search size={100} />
          </div>
          
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Megaphone className="text-blue-400" size={20} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Marketing Signals</span>
            </div>
            
            <h3 className="text-xl font-black mb-4">Signal Ingestion</h3>
            <p className="text-slate-400 text-xs mb-6 leading-relaxed">
              The engine is currently ingesting 15,240 signals from 12 ad platforms and social networks.
            </p>
            
            <div className="space-y-3">
              {[
                { label: 'Ad Performance', score: 92 },
                { label: 'Social Sentiment', score: 85 },
                { label: 'Brand Awareness', score: 78 },
              ].map((signal, i) => (
                <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{signal.label}</span>
                    <span className="text-[10px] font-bold text-blue-400">{signal.score}%</span>
                  </div>
                  <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${signal.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="mt-8 relative z-10 w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border border-white/10 flex items-center justify-center gap-2">
            View Signal Map
          </button>
        </div>

        {/* Campaign Scoring & Performance */}
        <div className="md:col-span-3 bg-white border border-slate-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-slate-400" size={20} />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Campaign Scoring & Performance</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reach</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-200" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conversion</span>
              </div>
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={campaignData}>
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
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #f1f5f9', 
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: 700,
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="reach" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="conv" 
                  stroke="#e2e8f0" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Predictive Performance Modeling */}
        <div className="md:col-span-2 bg-white border border-slate-100 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-8">
            <Activity className="text-slate-400" size={20} />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Predictive Performance Modeling</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Conversion Rate', value: '4.2%', trend: '+15%', icon: Target, color: 'blue' },
              { label: 'ROAS', value: '5.6x', trend: '+12%', icon: TrendingUp, color: 'green' },
              { label: 'CPA', value: '$12.40', trend: '-8%', icon: Zap, color: 'amber' },
            ].map((metric, i) => (
              <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-2 rounded-lg", `bg-${metric.color}-50`)}>
                    <metric.icon className={cn(`text-${metric.color}-500`)} size={18} />
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold flex items-center gap-0.5",
                    metric.trend.startsWith('+') ? "text-green-500" : "text-red-500"
                  )}>
                    {metric.trend.startsWith('+') ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {metric.trend}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{metric.label}</p>
                <p className="text-xl font-black text-slate-900">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Intelligence Insights & Recommendations */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="text-blue-500" size={20} />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Intelligence Insights</span>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="p-4 bg-white rounded-xl border border-blue-100 shadow-sm">
              <h4 className="text-xs font-bold text-slate-900 mb-2">Campaign Optimization</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed mb-3">
                Increase budget for Campaign Alpha by 20% to capitalize on the 15% conversion rate surge in the APAC region.
              </p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-500 text-white text-[8px] font-bold rounded uppercase tracking-tighter">High Impact</span>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Priority: High</span>
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-xl border border-blue-100 shadow-sm">
              <h4 className="text-xs font-bold text-slate-900 mb-2">Channel Reallocation</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed mb-3">
                Reallocate 10% of the social media budget to search ads to optimize CPA for the new enterprise module.
              </p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-500 text-white text-[8px] font-bold rounded uppercase tracking-tighter">Medium Impact</span>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Priority: Medium</span>
              </div>
            </div>
          </div>

          <button className="mt-6 w-full py-3 bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all hover:bg-blue-600 flex items-center justify-center gap-2">
            <Zap size={14} />
            Execute Recommendations
          </button>
        </div>
      </div>
    </div>
  );
}
