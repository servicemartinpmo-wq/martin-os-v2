import React from 'react';
import { 
  Rocket, 
  Network, 
  Layers, 
  Target, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  Zap, 
  BarChart3,
  Kanban,
  LayoutGrid,
  GitBranch,
  Workflow
} from 'lucide-react';
import { AppMode } from '../../types';
import { cn } from '../../lib/utils';

interface ProjectWorkManagementProps {
  mode: AppMode;
  className?: string;
}

export default function ProjectWorkManagement({ mode, className }: ProjectWorkManagementProps) {
  const projects = [
    { id: 1, name: 'Project Alpha', status: 'On Track', health: 92, kpi: 'Revenue', progress: 75, type: 'Strategic' },
    { id: 2, name: 'Project Beta', status: 'At Risk', health: 65, kpi: 'User Growth', progress: 40, type: 'Operational' },
    { id: 3, name: 'Project Gamma', status: 'Delayed', health: 45, kpi: 'Market Share', progress: 20, type: 'Growth' },
  ];

  const goals = [
    { id: 1, text: 'Increase Org Revenue by 20%', level: 'Company', progress: 65 },
    { id: 2, text: 'Optimize Engineering Throughput', level: 'Department', progress: 82 },
    { id: 3, text: 'Launch Enterprise Module', level: 'Project', progress: 45 },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Project Autopilot */}
        <div className="md:col-span-2 bg-slate-900 text-white rounded-2xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
            <Rocket size={160} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Rocket className="text-blue-400" size={24} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Project Autopilot</span>
            </div>
            
            <h2 className="text-3xl font-black mb-4">Autonomous Project Execution</h2>
            <p className="text-slate-400 text-sm mb-8 max-w-lg leading-relaxed">
              The autopilot engine is currently managing 12 active initiatives, optimizing resource allocation and predicting risks before they impact delivery.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Active Tasks', value: '156', icon: CheckCircle2, color: 'blue' },
                { label: 'Risk Mitigation', value: '92%', icon: AlertTriangle, color: 'amber' },
                { label: 'Delivery Speed', value: '+12%', icon: Zap, color: 'green' },
              ].map((stat, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon size={14} className={cn(`text-${stat.color}-400`)} />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                  </div>
                  <p className="text-xl font-black">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Work Graph & Relationship Mapping */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Network className="text-slate-400" size={20} />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Work Graph</span>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <div className="relative w-32 h-32 mb-6">
              <div className="absolute inset-0 border-2 border-dashed border-slate-100 rounded-full animate-spin-slow" />
              <div className="absolute inset-4 border-2 border-dashed border-slate-200 rounded-full animate-spin-reverse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                  <Network size={24} />
                </div>
              </div>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Relationship Mapping</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-6">Projects ↔ KPIs ↔ Revenue</p>
            <button className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
              Explore Graph
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Portfolio View & Org-wide Visibility */}
        <div className="md:col-span-2 bg-white border border-slate-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Layers className="text-slate-400" size={20} />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Portfolio View</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-slate-900 transition-colors">
                <LayoutGrid size={16} />
              </button>
              <button className="p-2 bg-slate-900 text-white rounded-lg">
                <Kanban size={16} />
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      project.status === 'On Track' ? "bg-green-500" : project.status === 'At Risk' ? "bg-amber-500" : "bg-red-500"
                    )} />
                    <h4 className="text-sm font-bold text-slate-900">{project.name}</h4>
                    <span className="px-1.5 py-0.5 bg-white border border-slate-200 text-[8px] font-bold text-slate-400 rounded uppercase tracking-tighter">
                      {project.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Health</span>
                      <span className={cn(
                        "text-xs font-black",
                        project.health > 80 ? "text-green-500" : project.health > 60 ? "text-amber-500" : "text-red-500"
                      )}>{project.health}%</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">KPI</span>
                      <span className="text-xs font-black text-slate-900">{project.kpi}</span>
                    </div>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all duration-500 ease-out",
                      project.status === 'On Track' ? "bg-green-500" : project.status === 'At Risk' ? "bg-amber-500" : "bg-red-500"
                    )}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Goals Hierarchy */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Target className="text-slate-400" size={20} />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Goals Hierarchy</span>
          </div>
          
          <div className="space-y-4 flex-1">
            {goals.map((goal) => (
              <div key={goal.id} className="p-4 bg-white rounded-xl border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{goal.level}</span>
                  <span className="text-[10px] font-bold text-slate-900">{goal.progress}%</span>
                </div>
                <p className="text-xs font-bold text-slate-900 mb-3">{goal.text}</p>
                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-500 ease-out" 
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Workflow className="text-slate-400" size={14} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Workflow Engine</span>
              </div>
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitBranch className="text-slate-400" size={14} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Agile System</span>
              </div>
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Scrum</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
