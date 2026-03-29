import React from 'react';
import { BarChart3, Download, Filter, Calendar as CalendarIcon } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Reports</h2>
          <p className="text-slate-500 mt-1">Export analysis results and track long-term performance trends.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-slate-200 rounded-lg flex items-center gap-2 text-slate-600 hover:bg-slate-50 transition-colors">
            <CalendarIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Last 30 Days</span>
          </button>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg shadow-sm hover:bg-slate-800 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Initiatives', value: '24', change: '+3' },
          { label: 'Avg. Maturity', value: '72%', change: '+5%' },
          { label: 'SOP Adherence', value: '88%', change: '-2%' },
          { label: 'Resource Utilization', value: '84%', change: '+12%' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
              <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
          <BarChart3 className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Custom Report Builder</h3>
        <p className="text-slate-500 mt-2 max-w-sm">Drag and drop metrics to create your own executive dashboards and performance summaries.</p>
        <button className="mt-6 px-6 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors">
          Start Building
        </button>
      </div>
    </div>
  );
}
