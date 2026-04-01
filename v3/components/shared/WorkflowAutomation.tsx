import React from 'react';
import { 
  Zap, 
  Workflow, 
  Clock, 
  Settings, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Plus, 
  Activity, 
  ShieldCheck,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { AppMode } from '../../types';
import { cn } from '../../lib/utils';

interface WorkflowAutomationProps {
  mode: AppMode;
  className?: string;
}

export default function WorkflowAutomation({ mode, className }: WorkflowAutomationProps) {
  const activeWorkflows = [
    { id: 1, name: 'Initiative Health Diagnostics', trigger: 'Missed Deadline', status: 'Active', runs: 124, lastRun: '2h ago' },
    { id: 2, name: 'Executive Briefing Generation', trigger: 'Scheduled (Weekly)', status: 'Active', runs: 52, lastRun: '3d ago' },
    { id: 3, name: 'Risk Mitigation Protocol', trigger: 'KPI Drop > 10%', status: 'Active', runs: 12, lastRun: '15m ago' },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Workflow Orchestrator */}
        <div className="md:col-span-2 bg-white border border-slate-100 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-2xl">
                <Workflow className="text-blue-500" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Workflow Orchestrator</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Automation Brain</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-slate-800 flex items-center gap-2">
              <Plus size={14} />
              Create Workflow
            </button>
          </div>
          
          <div className="space-y-4">
            {activeWorkflows.map((workflow) => (
              <div key={workflow.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-500">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{workflow.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trigger: {workflow.trigger}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Runs</span>
                      <span className="text-xs font-black text-slate-900">{workflow.runs}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Run</span>
                      <span className="text-xs font-black text-slate-900">{workflow.lastRun}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[8px] font-bold rounded uppercase tracking-tighter border border-green-100">
                      {workflow.status}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rule-based automation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-white border border-slate-100 text-slate-400 rounded-lg hover:text-blue-500 transition-colors">
                      <Settings size={14} />
                    </button>
                    <button className="p-2 bg-white border border-slate-100 text-slate-400 rounded-lg hover:text-green-500 transition-colors">
                      <Play size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Automation Stats */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Cpu size={160} />
          </div>
          
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-2 mb-8">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Activity className="text-blue-400" size={24} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Automation Health</span>
            </div>
            
            <div className="space-y-8">
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-5xl font-black mb-2">94%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Automation Coverage</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Scheduled Jobs</span>
                  <span className="text-xl font-black">24</span>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Event Triggers</span>
                  <span className="text-xl font-black">156</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="text-slate-500" size={14} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cron System</span>
                  </div>
                  <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="text-slate-500" size={14} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Security Layer</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Enterprise</span>
                </div>
              </div>
            </div>
          </div>

          <button className="mt-8 relative z-10 w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all border border-white/10 flex items-center justify-center gap-2">
            <RefreshCw size={16} />
            Run System Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
}
