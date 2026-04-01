import React, { useState } from 'react';
import { 
  Settings, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  Database, 
  Workflow, 
  Layers, 
  Network, 
  Lock, 
  Eye, 
  EyeOff,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { AppMode } from '../../types';
import { cn } from '../../lib/utils';

interface AdminControlPanelProps {
  mode: AppMode;
  className?: string;
}

export default function AdminControlPanel({ mode, className }: AdminControlPanelProps) {
  const [features, setFeatures] = useState([
    { id: 'intelligence-advisory', name: 'Intelligence Advisory Layer', status: true, category: 'Intelligence' },
    { id: 'signal-engine', name: 'Signal Detection Engine', status: true, category: 'Core' },
    { id: 'workflow-orch', name: 'Workflow Orchestrator', status: true, category: 'Automation' },
    { id: 'marketing-intel', name: 'Marketing Intelligence', status: false, category: 'Growth' },
    { id: 'decision-mem', name: 'Decision Memory System', status: true, category: 'Intelligence' },
    { id: 'data-os', name: 'Data Operating System', status: true, category: 'Core' },
  ]);

  const toggleFeature = (id: string) => {
    setFeatures(features.map(f => f.id === id ? { ...f, status: !f.status } : f));
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Feature Toggles & System Configuration */}
        <div className="md:col-span-2 bg-white border border-slate-100 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-900 text-white rounded-2xl">
                <Settings size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Admin Control Panel</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Configuration Layer</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Status:</span>
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Operational</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature) => (
              <div key={feature.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                    feature.status ? "bg-blue-50 text-blue-500" : "bg-slate-100 text-slate-400"
                  )}>
                    <Zap size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{feature.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{feature.category}</p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleFeature(feature.id)}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-colors",
                    feature.status ? "bg-blue-500" : "bg-slate-200"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                    feature.status ? "left-7" : "left-1"
                  )} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* System Health & Monitoring */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Activity size={160} />
          </div>
          
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-2 mb-8">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Activity className="text-blue-400" size={24} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">System Health</span>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Supabase Connection</span>
                  <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Active</span>
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[98%]" />
                </div>
              </div>
              
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Latency</span>
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">124ms</span>
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[85%]" />
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="text-slate-500" size={14} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data Integrity</span>
                  </div>
                  <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">100%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="text-slate-500" size={14} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Security Audit</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Passed</span>
                </div>
              </div>
            </div>
          </div>

          <button className="mt-8 relative z-10 w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all border border-white/10 flex items-center justify-center gap-2">
            <RefreshCw size={16} />
            Run Full System Audit
          </button>
        </div>
      </div>
    </div>
  );
}
