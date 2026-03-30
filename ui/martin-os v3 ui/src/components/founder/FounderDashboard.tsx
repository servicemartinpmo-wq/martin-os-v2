import React from 'react';
import { 
  LayoutDashboard, 
  DollarSign, 
  Activity, 
  Users, 
  CheckSquare, 
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function FounderDashboard() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Founder Oversight</h2>
          <p className="text-slate-500 font-medium">Business Health • Operations • Cashflow</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            <Plus className="w-4 h-4" />
            New Action
          </button>
        </div>
      </header>

      {/* Critical Oversight Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Bank Balance', value: '$142,500', trend: '+12%', icon: DollarSign, positive: true },
          { label: 'Burn Rate', value: '$18,200', trend: '-5%', icon: Activity, positive: true },
          { label: 'Team Capacity', value: '84%', trend: 'Stable', icon: Users, positive: null },
          { label: 'Open Risks', value: '3', trend: 'High', icon: AlertCircle, positive: false },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                <stat.icon className="w-5 h-5" />
              </div>
              {stat.positive !== null && (
                <span className={cn(
                  "text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1",
                  stat.positive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                )}>
                  {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
                </span>
              )}
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cashflow & Revenue */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Revenue & Growth
            </h3>
            <div className="flex gap-2">
              {['7D', '30D', '90D'].map(period => (
                <button key={period} className={cn(
                  "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors",
                  period === '30D' ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"
                )}>{period}</button>
              ))}
            </div>
          </div>
          
          <div className="h-64 flex items-end gap-4">
            {[45, 60, 40, 80, 55, 90, 75, 85, 65, 95, 80, 100].map((height, i) => (
              <div key={i} className="flex-1 bg-slate-50 rounded-t-lg relative group">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-lg transition-all duration-500 group-hover:bg-blue-600" 
                  style={{ height: `${height}%` }}
                />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  ${(height * 1.2).toFixed(1)}k
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 px-2">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
              <span key={month} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{month}</span>
            ))}
          </div>
        </div>

        {/* Oversight: No Surprises */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-cyan-400" />
              Critical Checklist
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Payroll Approval', urgent: true },
                { label: 'VAT Return Submission', urgent: true },
                { label: 'Investor Update', urgent: false },
                { label: 'Team Performance Review', urgent: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.urgent && <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Urgent</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Operational Risks
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                <p className="text-xs font-bold text-red-700 mb-1">Low Cash Runway</p>
                <p className="text-[10px] text-red-600 font-medium">Runway estimated at 4.2 months. Action needed.</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                <p className="text-xs font-bold text-yellow-700 mb-1">Key Person Risk</p>
                <p className="text-[10px] text-yellow-600 font-medium">Lead developer on leave for 2 weeks.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
