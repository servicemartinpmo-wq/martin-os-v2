import React from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Flag, 
  Layers, 
  MoreHorizontal, 
  Plus, 
  Search, 
  TrendingUp, 
  Users,
  AlertCircle
} from 'lucide-react';
import { AppMode } from '../../types';
import { cn } from '../../lib/utils';

interface InitiativeDashboardProps {
  mode: AppMode;
}

export default function InitiativeDashboard({ mode }: InitiativeDashboardProps) {
  return (
    <div className="p-6 space-y-8 bg-white min-h-screen text-slate-900">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
            Initiative Dashboard
          </h1>
          <p className="text-slate-500 font-mono text-xs mt-1 uppercase tracking-widest">
            Portfolio View | {mode.toUpperCase()}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="SEARCH INITIATIVES..." 
              className="bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-500 transition-all w-64 text-slate-900"
            />
          </div>
          <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm">
            <Plus className="w-4 h-4" /> New Initiative
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Projects', value: '14', icon: Layers, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Avg Progress', value: '68%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'At Risk', value: '3', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Upcoming Milestones', value: '8', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-4 shadow-sm">
            <div className={cn("p-3 rounded-lg", stat.bg, stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">{stat.label}</div>
              <div className="text-2xl font-black text-slate-900">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Initiative List */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-600">Active Portfolio</h2>
          <div className="flex gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <span className="text-blue-600 cursor-pointer">All</span>
            <span className="hover:text-slate-900 cursor-pointer transition-colors">Strategic</span>
            <span className="hover:text-slate-900 cursor-pointer transition-colors">Operational</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50/30">
                <th className="p-4">Initiative</th>
                <th className="p-4">Status</th>
                <th className="p-4">Progress</th>
                <th className="p-4">Risk</th>
                <th className="p-4">Owner</th>
                <th className="p-4">Timeline</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { name: 'Market Expansion Q3', status: 'Active', progress: 65, risk: 'Low', owner: 'Sarah Chen', timeline: 'Jul - Sep' },
                { name: 'Product Core Refactor', status: 'At Risk', progress: 42, risk: 'High', owner: 'Mike Ross', timeline: 'Jun - Aug' },
                { name: 'Talent Acquisition Drive', status: 'Active', progress: 88, risk: 'Low', owner: 'Jessica Pearson', timeline: 'May - Jul' },
                { name: 'Data Pipeline Upgrade', status: 'Planned', progress: 15, risk: 'Medium', owner: 'Harvey Specter', timeline: 'Aug - Oct' },
              ].map((item, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors group cursor-pointer">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-tighter">ID: PRJ-00{i+1}</div>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest",
                      item.status === 'Active' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : 
                      item.status === 'At Risk' ? "bg-red-50 text-red-600 border border-red-100" : "bg-blue-50 text-blue-600 border border-blue-100"
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 w-48">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${item.progress}%` }} />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{item.progress}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "text-[10px] font-bold",
                      item.risk === 'Low' ? "text-emerald-600" : 
                      item.risk === 'High' ? "text-red-600" : "text-amber-600"
                    )}>
                      {item.risk}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 uppercase border border-slate-200">
                        {item.owner.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-xs text-slate-600">{item.owner}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> {item.timeline}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-slate-400 hover:text-slate-900 transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
