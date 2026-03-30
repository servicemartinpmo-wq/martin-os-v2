import React from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  ArrowUpRight,
  ChevronDown
} from 'lucide-react';
import { initiatives } from '../../data/mockData';
import { cn } from '../../lib/utils';
import { Status } from '../../types';

const statusColors: Record<Status, string> = {
  'On Track': 'bg-green-50 text-green-700 border-green-100',
  'Needs Attention': 'bg-amber-50 text-amber-700 border-amber-100',
  'Delayed': 'bg-red-50 text-red-700 border-red-100',
  'Abandoned': 'bg-slate-50 text-slate-700 border-slate-100',
  'Open': 'bg-blue-50 text-blue-700 border-blue-100',
  'In Progress': 'bg-indigo-50 text-indigo-700 border-indigo-100',
  'Resolved': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Closed': 'bg-gray-50 text-gray-700 border-gray-100',
};

export default function InitiativesPage() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Initiatives</h2>
          <p className="text-slate-500 mt-1">Manage and track all organizational programs and projects.</p>
        </div>
        <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg shadow-sm hover:bg-cyan-600 transition-colors flex items-center gap-2 font-bold">
          <Plus className="w-5 h-5" />
          <span>New Initiative</span>
        </button>
      </header>

      {/* Filters & Search */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex gap-4 flex-1 min-w-[300px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search initiatives..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
            />
          </div>
          <button className="px-4 py-2 border border-slate-200 rounded-lg flex items-center gap-2 text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Sort by:</span>
          <button className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2 text-slate-700 text-sm font-medium">
            Priority Score
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Initiatives Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-bottom border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Initiative</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Alignment</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Risk</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {initiatives.map((ini) => (
                <tr key={ini.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">{ini.title}</span>
                      <span className="text-xs text-slate-400 mt-0.5">{ini.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            ini.priorityScore > 90 ? "bg-cyan-500" : "bg-slate-400"
                          )} 
                          style={{ width: `${ini.priorityScore}%` }} 
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{ini.priorityScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                      ini.strategicAlignment === 'Critical' ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                    )}>
                      {ini.strategicAlignment}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-sm font-medium",
                      ini.dependencyRisk === 'High' ? "text-red-500" : 
                      ini.dependencyRisk === 'Medium' ? "text-orange-500" : "text-green-500"
                    )}>
                      {ini.dependencyRisk}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                        {ini.owner.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm text-slate-600">{ini.owner}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold border",
                      statusColors[ini.status]
                    )}>
                      {ini.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1 hover:bg-slate-100 rounded transition-colors text-slate-400 hover:text-slate-600">
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:bg-slate-100 rounded transition-colors text-slate-400 hover:text-slate-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
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
