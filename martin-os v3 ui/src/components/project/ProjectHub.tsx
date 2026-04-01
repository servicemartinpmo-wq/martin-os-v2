import React from 'react';
import { 
  Kanban, 
  ListTodo, 
  ShieldCheck, 
  BarChart3, 
  Users, 
  Clock,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  Plus
} from 'lucide-react';
import { initiatives } from '../../data/mockData';
import { cn } from '../../lib/utils';

export default function ProjectHub() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Project Command Center</h2>
          <p className="text-slate-500 font-medium">PMBOK Compliant • Real-time Oversight</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            <Plus className="w-4 h-4" />
            New Initiative
          </button>
        </div>
      </header>

      {/* Compliance & Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900">Compliance Status</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">98.4%</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">PMBOK v7 Alignment: <span className="text-green-600 font-bold">Elite</span></p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900">Velocity</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">12.5</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Tasks/Day • <span className="text-blue-600 font-bold">+15% vs Last Week</span></p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-50 rounded-lg text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900">Risk Exposure</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">Low</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">3 Critical Dependencies Identified</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Initiatives (Jira/Asana feel) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Kanban className="w-5 h-5 text-slate-400" />
              Active Initiatives
            </h3>
            <div className="flex gap-2">
              <button className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors">
                <ListTodo className="w-4 h-4" />
              </button>
              <button className="p-2 bg-slate-900 rounded-lg text-white">
                <Kanban className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {initiatives.map((initiative) => (
              <div key={initiative.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter",
                        initiative.type === 'Transformative' ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
                      )}>{initiative.type}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">#{initiative.id}</span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{initiative.title}</h4>
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                    initiative.status === 'On Track' ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"
                  )}>
                    {initiative.status}
                  </div>
                </div>
                
                <p className="text-sm text-slate-500 mb-6 line-clamp-2">{initiative.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-bold text-slate-600">{initiative.owner}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-bold text-slate-600">Impact: {initiative.estimatedImpact}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${initiative.priorityScore}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{initiative.priorityScore}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Reminders & Compliance */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              Compliance Checklist
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Stakeholder Analysis', done: true },
                { label: 'Risk Register Update', done: true },
                { label: 'Resource Allocation', done: false },
                { label: 'Quality Audit', done: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={cn(
                    "w-5 h-5 rounded flex items-center justify-center border",
                    item.done ? "bg-cyan-500 border-cyan-500" : "border-slate-700"
                  )}>
                    {item.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <span className={cn("text-sm font-medium", item.done ? "text-slate-300" : "text-slate-500")}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">System Reminders</h3>
            <div className="space-y-6">
              {[
                { title: 'Budget Review', time: '2h left', type: 'urgent' },
                { title: 'Team Sync', time: 'Tomorrow', type: 'normal' },
                { title: 'Compliance Report', time: 'Friday', type: 'normal' },
              ].map((reminder, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-2",
                    reminder.type === 'urgent' ? "bg-red-500" : "bg-blue-500"
                  )} />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{reminder.title}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{reminder.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
