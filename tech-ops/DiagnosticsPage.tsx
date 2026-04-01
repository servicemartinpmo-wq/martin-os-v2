import React, { useState } from 'react';
import { 
  Activity, 
  Bot, 
  ClipboardCheck, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Terminal,
  Search,
  Settings,
  AlertTriangle
} from 'lucide-react';
import { AppMode } from '../../types';
import { cn } from '../../lib/utils';
import OneClickDiagnostics from '../shared/OneClickDiagnostics';
import ApphiaEngine from './ApphiaEngine';
import { AgenticCard } from '../ui/AgenticCard';

interface DiagnosticsPageProps {
  mode: AppMode;
}

export default function DiagnosticsPage({ mode }: DiagnosticsPageProps) {
  const [activeTab, setActiveTab] = useState<'agent' | 'one-click'>('agent');

  const tabs = [
    { id: 'agent', label: 'Apphia Engine', icon: Bot, description: 'Autonomous Support Agent' },
    { id: 'one-click', label: 'One-Click Diagnostics', icon: ClipboardCheck, description: 'Full System Audit' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight uppercase">System Diagnostics</h2>
          <p className="text-slate-500 mt-1 uppercase text-xs font-bold tracking-widest">Autonomous analysis and optimization suite.</p>
        </div>
        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                activeTab === tab.id 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 h-[calc(100vh-250px)]">
        {activeTab === 'agent' ? (
          <ApphiaEngine mode={mode} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm overflow-y-auto scrollbar-hide">
              <OneClickDiagnostics mode={mode} />
            </div>
            <div className="flex flex-col gap-6">
              <AgenticCard 
                title="Tech-Ops 12-Stage Pipeline" 
                intent="Run Tech-Ops Diagnostic" 
                initialData={{ status_message: "Awaiting signal to begin 12-stage analysis..." }} 
              />
              <AgenticCard 
                title="PMO-Ops 4-Layer Monitor" 
                intent="Run PMO-Ops Diagnostic" 
                initialData={{ status_message: "Awaiting signal to begin 4-layer monitoring..." }} 
              />
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'System Health', value: '99.98%', icon: Activity, color: 'text-emerald-500' },
          { label: 'System Confidence', value: '98.4%', icon: Zap, color: 'text-cyan-500' },
          { label: 'Last Audit', value: '2h ago', icon: ShieldCheck, color: 'text-blue-500' },
          { label: 'Pending Optimizations', value: '3', icon: Settings, color: 'text-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
            <div className={cn("p-2 rounded-xl bg-slate-50", stat.color)}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-lg font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
