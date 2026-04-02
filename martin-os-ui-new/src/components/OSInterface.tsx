'use client';
import { useState, useEffect } from 'react';
import { 
  Activity, 
  Shield, 
  Zap, 
  LayoutGrid, 
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Server
} from 'lucide-react';
import { cn } from '../lib/utils';
import OSHeader from './OSHeader';

// --- App Status Card ---
const AppStatusCard = ({ name, status, health, load, icon: Icon }: any) => (
  <div className="bg-[#0d1117] p-6 rounded-3xl border border-slate-800 hover:border-indigo-500 transition-all duration-300 flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <div className="w-12 h-12 bg-indigo-950/50 rounded-xl flex items-center justify-center border border-indigo-500/30">
        <Icon className="w-6 h-6 text-indigo-400" />
      </div>
      <div className={cn(
        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
        status === 'Operational' ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
      )}>
        {status}
      </div>
    </div>
    <div>
      <h3 className="text-xl font-bold text-white">{name}</h3>
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-xs text-slate-400">
          <span>System Health</span>
          <span className="text-white font-mono">{health}%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500" style={{ width: `${health}%` }} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 font-mono">
        <Activity className="w-3 h-3" />
        <span>Load: {load}%</span>
      </div>
    </div>
  </div>
);

export default function OSInterface() {
  const [apps] = useState([
    { name: 'PMO-Ops', status: 'Operational', health: 98, load: 45, icon: LayoutGrid },
    { name: 'Tech-Ops', status: 'Operational', health: 92, load: 62, icon: Cpu },
    { name: 'miidle', status: 'Operational', health: 95, load: 30, icon: Server },
  ]);

  return (
    <div className="min-h-screen bg-[#020202] text-slate-100 font-sans p-8">
      <header className="max-w-7xl mx-auto mb-12">
        <OSHeader isThinking={false} currentModel="UNIFIED-OS-V2.1" />
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-white uppercase tracking-widest">System Overview</h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono bg-white/5 px-4 py-2 rounded-lg">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>All systems nominal</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {apps.map(app => (
            <AppStatusCard key={app.name} {...app} />
          ))}
        </div>

        <div className="mt-12 bg-[#0d1117] p-8 rounded-3xl border border-slate-800">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            System Alerts
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
              <span className="text-sm text-slate-300 font-mono">Tech-Ops: Minor latency spike in diagnostic pipeline.</span>
              <span className="text-[10px] text-amber-400 font-bold uppercase">Investigating</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
