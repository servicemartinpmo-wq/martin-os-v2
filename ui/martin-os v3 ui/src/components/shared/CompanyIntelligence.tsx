import React from 'react';
import { 
  Activity, 
  TrendingUp, 
  Target, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  BarChart3, 
  FileText,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { AppMode } from '../../types';
import { cn } from '../../lib/utils';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

interface CompanyIntelligenceProps {
  mode: AppMode;
  className?: string;
}

const data = [
  { name: 'Jan', score: 65, revenue: 4000, ops: 2400 },
  { name: 'Feb', score: 68, revenue: 3000, ops: 1398 },
  { name: 'Mar', score: 75, revenue: 2000, ops: 9800 },
  { name: 'Apr', score: 82, revenue: 2780, ops: 3908 },
  { name: 'May', score: 78, revenue: 1890, ops: 4800 },
  { name: 'Jun', score: 85, revenue: 2390, ops: 3800 },
  { name: 'Jul', score: 92, revenue: 3490, ops: 4300 },
];

export default function CompanyIntelligence({ mode, className }: CompanyIntelligenceProps) {
  const getHealthScore = () => {
    switch (mode) {
      case 'Founder/SMB': return 88;
      case 'Executive': return 92;
      case 'Healthcare': return 85;
      case 'Assisted': return 95;
      default: return 80;
    }
  };

  const healthScore = getHealthScore();

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Company Health Score */}
        <div className="md:col-span-1 bg-white border border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <div className="relative w-32 h-32 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-100"
              />
              <circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={364.4}
                strokeDashoffset={364.4 * (1 - healthScore / 100)}
                className="text-blue-500 transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900">{healthScore}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Health</span>
            </div>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Company Health Score</h3>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">Composite Index</p>
        </div>

        {/* Intelligence Metrics */}
        <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Operations', value: '94%', trend: '+2.4%', icon: Activity, color: 'blue' },
            { label: 'Revenue', value: '$1.2M', trend: '+12.5%', icon: TrendingUp, color: 'green' },
            { label: 'Product', value: '88%', trend: '-1.2%', icon: Target, color: 'amber' },
            { label: 'Team', value: '96%', trend: '+0.5%', icon: Users, color: 'purple' },
          ].map((metric, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col">
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

      {/* Financial Trajectory & Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white border border-slate-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-slate-400" size={20} />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Financial Trajectory</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-200" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operations</span>
              </div>
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
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
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="ops" 
                  stroke="#e2e8f0" 
                  strokeWidth={2}
                  fill="transparent" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Company Report (Auto-generated) */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="text-slate-400" size={20} />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Weekly Intelligence</span>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="p-4 bg-white rounded-xl border border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 mb-2">Executive Summary</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                The organization has maintained a 92% health score this week. Revenue is trending upwards by 12.5% following the launch of the new enterprise module.
              </p>
            </div>
            
            <div className="p-4 bg-white rounded-xl border border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 mb-2">Department Roll-up</h4>
              <div className="space-y-2">
                {[
                  { name: 'Engineering', score: 94 },
                  { name: 'Marketing', score: 82 },
                  { name: 'Sales', score: 88 },
                ].map((dept, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{dept.name}</span>
                    <span className="text-[10px] font-bold text-slate-900">{dept.score}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button className="mt-6 w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
            <Zap size={14} />
            Generate Full Report
          </button>
        </div>
      </div>
    </div>
  );
}
