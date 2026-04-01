import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  Save, 
  Plus, 
  FileCode, 
  Folder, 
  Settings, 
  Cpu, 
  Zap, 
  Globe, 
  Database, 
  ShieldCheck,
  ChevronRight,
  Maximize2,
  Minimize2,
  Share2,
  Cloud,
  Activity,
  Code2,
  Layout,
  Workflow,
  RefreshCw,
  Search,
  Lock as LockIcon
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../lib/supabase';

import { toast } from 'sonner';

interface StackAppMakerProps {
  mode: any;
}

export default function StackAppMaker({ mode }: StackAppMakerProps) {
  const [activeFile, setActiveFile] = useState('server.ts');
  const [isExpanded, setIsExpanded] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleAction = async (actionName: string, payload: any = {}) => {
    try {
      setActionLoading(true);
      const res = await fetch(`/api/pmo/${actionName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Action failed');
      toast.success(`Action ${actionName} completed`);
      handleBuildSuccess(data);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'An error occurred');
    } finally {
      setActionLoading(false);
    }
  };
  const [logs, setLogs] = useState<string[]>([
    '[system] Initializing environment...',
    '[system] Node.js v20.11.0 ready',
    '[system] Database connection established',
    '[system] Ready to build.'
  ]);

  const files = [
    { name: 'server.ts', icon: FileCode, type: 'typescript' },
    { name: 'index.html', icon: Globe, type: 'html' },
    { name: 'styles.css', icon: Layout, type: 'css' },
    { name: 'database.ts', icon: Database, type: 'typescript' },
    { name: 'workflow.json', icon: Workflow, type: 'json' },
  ];

  const handleBuildSuccess = (data: any) => {
    setLogs(prev => [...prev, '[build] Build successful!', '[deploy] Deploying to staging...', '[deploy] App live at: https://internal-tool-v1.martin-os.run.app']);
  };

  const handleBuildClick = () => {
    setLogs(prev => [...prev, '[build] Starting build process...', '[build] Compiling TypeScript...', '[build] Optimizing assets...']);
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-slate-950 rounded-3xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-500",
      isExpanded ? "fixed inset-8 z-50" : "relative"
    )}>
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-slate-900/40 backdrop-blur-2xl flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />
            <div className="relative w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-950 rounded-2xl border border-white/20 flex items-center justify-center shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
              <Code2 className="text-blue-400 w-6 h-6 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tighter flex items-center gap-3 italic uppercase">
              STACK APP MAKER
              <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 text-[9px] font-black rounded-full border border-blue-500/20 uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                v1.0.2
              </span>
            </h2>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] flex items-center gap-2 mt-0.5">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              Full-Stack Internal Tooling
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-6 mr-6">
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Environment</span>
              <span className="text-xs font-black font-mono tracking-tighter text-blue-400 uppercase">Staging</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Uptime</span>
              <span className="text-xs font-black font-mono tracking-tighter text-emerald-400">99.9%</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                handleBuildClick();
                handleAction('build_app');
              }}
              disabled={actionLoading}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-slate-950 font-black rounded-xl text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg active:scale-95 disabled:opacity-50"
            >
              Build & Deploy
            </button>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-400 transition-all hover:scale-110 active:scale-95 shadow-lg"
            >
              {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - File Explorer */}
        <div className="w-64 border-r border-white/5 bg-slate-900/20 flex flex-col">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">File Explorer</span>
            <button className="p-1 hover:bg-white/5 rounded text-slate-500">
              <Plus size={14} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {files.map((file) => (
              <button
                key={file.name}
                onClick={() => setActiveFile(file.name)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 group",
                  activeFile === file.name 
                    ? "bg-white/10 text-white shadow-lg" 
                    : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
                )}
              >
                <file.icon className={cn(
                  "w-4 h-4 transition-colors",
                  activeFile === file.name ? "text-blue-400" : "text-slate-600 group-hover:text-slate-400"
                )} />
                <span className="text-xs font-bold tracking-tight">{file.name}</span>
              </button>
            ))}
          </div>
          <div className="p-4 border-t border-white/5 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Resources</span>
                <span className="text-[8px] font-black text-blue-400">12%</span>
              </div>
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[12%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col bg-slate-950 relative">
          {/* Editor Header */}
          <div className="h-10 border-b border-white/5 bg-slate-900/40 flex items-center px-4 gap-4">
            <div className="flex items-center gap-2">
              <FileCode size={14} className="text-blue-400" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">{activeFile}</span>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-3">
              <button className="p-1.5 hover:bg-white/5 rounded text-slate-500 transition-colors">
                <Save size={14} />
              </button>
              <button className="p-1.5 hover:bg-white/5 rounded text-slate-500 transition-colors">
                <Share2 size={14} />
              </button>
              <button className="p-1.5 hover:bg-white/5 rounded text-slate-500 transition-colors">
                <Settings size={14} />
              </button>
            </div>
          </div>

          {/* Code Editor (Simulated) */}
          <div className="flex-1 p-6 font-mono text-sm overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed opacity-80">
            <div className="space-y-1">
              <div className="flex gap-4">
                <span className="text-slate-700 w-6 text-right select-none">1</span>
                <span className="text-purple-400">import</span>
                <span className="text-white">express</span>
                <span className="text-purple-400">from</span>
                <span className="text-emerald-400">'express'</span>
                <span className="text-white">;</span>
              </div>
              <div className="flex gap-4">
                <span className="text-slate-700 w-6 text-right select-none">2</span>
                <span className="text-purple-400">import</span>
                <span className="text-white">path</span>
                <span className="text-purple-400">from</span>
                <span className="text-emerald-400">'path'</span>
                <span className="text-white">;</span>
              </div>
              <div className="flex gap-4">
                <span className="text-slate-700 w-6 text-right select-none">3</span>
              </div>
              <div className="flex gap-4">
                <span className="text-slate-700 w-6 text-right select-none">4</span>
                <span className="text-blue-400">const</span>
                <span className="text-white">app = </span>
                <span className="text-yellow-400">express()</span>
                <span className="text-white">;</span>
              </div>
              <div className="flex gap-4">
                <span className="text-slate-700 w-6 text-right select-none">5</span>
                <span className="text-blue-400">const</span>
                <span className="text-white">PORT = </span>
                <span className="text-orange-400">3000</span>
                <span className="text-white">;</span>
              </div>
              <div className="flex gap-4">
                <span className="text-slate-700 w-6 text-right select-none">6</span>
              </div>
              <div className="flex gap-4">
                <span className="text-slate-700 w-6 text-right select-none">7</span>
                <span className="text-slate-500">// Internal Tool API Endpoint</span>
              </div>
              <div className="flex gap-4">
                <span className="text-slate-700 w-6 text-right select-none">8</span>
                <span className="text-white">app.</span>
                <span className="text-yellow-400">get</span>
                <span className="text-white">(</span>
                <span className="text-emerald-400">'/api/health'</span>
                <span className="text-white">, (req, res) ={">"} {"{"}</span>
              </div>
              <div className="flex gap-4">
                <span className="text-slate-700 w-6 text-right select-none">9</span>
                <span className="text-white ml-8">res.</span>
                <span className="text-yellow-400">json</span>
                <span className="text-white">({"{"} status: </span>
                <span className="text-emerald-400">'operational'</span>
                <span className="text-white"> {"}"});</span>
              </div>
              <div className="flex gap-4">
                <span className="text-slate-700 w-6 text-right select-none">10</span>
                <span className="text-white">{"}"});</span>
              </div>
              <div className="flex gap-4">
                <span className="text-slate-700 w-6 text-right select-none">11</span>
              </div>
              <div className="flex gap-4">
                <span className="text-slate-700 w-6 text-right select-none">12</span>
                <span className="text-white">app.</span>
                <span className="text-yellow-400">listen</span>
                <span className="text-white">(PORT, () ={">"} {"{"}</span>
              </div>
              <div className="flex gap-4">
                <span className="text-slate-700 w-6 text-right select-none">13</span>
                <span className="text-white ml-8">console.</span>
                <span className="text-yellow-400">log</span>
                <span className="text-white">(</span>
                <span className="text-emerald-400">`Server running on port ${"{"}PORT{"}"}`</span>
                <span className="text-white">);</span>
              </div>
              <div className="flex gap-4">
                <span className="text-slate-700 w-6 text-right select-none">14</span>
                <span className="text-white">{"}"});</span>
              </div>
              <div className="flex gap-4">
                <span className="text-slate-700 w-6 text-right select-none">15</span>
                <span className="animate-pulse w-2 h-5 bg-blue-500 ml-10" />
              </div>
            </div>
          </div>

          {/* Terminal / Logs Area */}
          <div className="h-48 border-t border-white/5 bg-slate-900/60 backdrop-blur-xl flex flex-col">
            <div className="h-8 border-b border-white/5 flex items-center px-4 justify-between">
              <div className="flex items-center gap-2">
                <Terminal size={12} className="text-slate-500" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Terminal Output</span>
              </div>
              <button 
                onClick={() => setLogs([])}
                className="text-[9px] font-black text-slate-600 hover:text-slate-400 uppercase tracking-widest transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="flex-1 p-4 font-mono text-[11px] overflow-y-auto space-y-1">
              {logs.map((log, i) => (
                <div key={i} className={cn(
                  "flex gap-3",
                  log.includes('[system]') ? "text-slate-500" : 
                  log.includes('[build]') ? "text-blue-400" : 
                  log.includes('[deploy]') ? "text-emerald-400" : "text-white"
                )}>
                  <span className="opacity-30 select-none">[{new Date().toLocaleTimeString()}]</span>
                  <span>{log}</span>
                </div>
              ))}
              <div className="flex gap-3 text-white">
                <span className="opacity-30 select-none">[{new Date().toLocaleTimeString()}]</span>
                <span className="flex items-center gap-1">
                  <span className="text-blue-400">$</span>
                  <span className="animate-pulse w-1.5 h-3 bg-white" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Tools & Config */}
        <div className="w-80 border-l border-white/5 bg-slate-900/20 flex flex-col">
          <div className="p-6 space-y-8">
            {/* Deployment Status */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Deployment Visibility</h3>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cloud size={14} className="text-blue-400" />
                    <span className="text-xs font-bold text-white">Production</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-black rounded-full border border-emerald-500/20 uppercase tracking-widest">Active</span>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Endpoint</p>
                  <p className="text-[10px] text-blue-400 font-mono truncate">internal-tool-v1.martin-os.run.app</p>
                </div>
                <div className="pt-2 flex gap-2">
                  <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-black text-white uppercase tracking-widest transition-colors">
                    Rollback
                  </button>
                  <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-black text-white uppercase tracking-widest transition-colors">
                    Logs
                  </button>
                </div>
              </div>
            </div>

            {/* Infrastructure Health */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Health</h3>
              <div className="space-y-3">
                {[
                  { label: 'CPU Load', value: '14%', icon: Cpu, color: 'text-blue-400' },
                  { label: 'Memory', value: '2.4GB', icon: Database, color: 'text-cyan-400' },
                  { label: 'Latency', value: '18ms', icon: Activity, color: 'text-emerald-400' },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <stat.icon size={14} className={stat.color} />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                    </div>
                    <span className="text-xs font-black font-mono text-white">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tooling</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'DB Explorer', icon: Database },
                  { label: 'API Tester', icon: Globe },
                  { label: 'Auth Config', icon: ShieldCheck },
                  { label: 'Secrets', icon: LockIcon },
                ].map((tool, i) => (
                  <button key={i} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 flex flex-col items-center gap-2 transition-all group">
                    <tool.icon size={16} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
                    <span className="text-[8px] font-black text-slate-500 group-hover:text-white uppercase tracking-widest">{tool.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
