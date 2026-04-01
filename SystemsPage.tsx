import React, { useState } from 'react';
import { Shield, Activity, Zap, Cpu, ChevronRight, RefreshCw, Database, Link as LinkIcon, AlertCircle, Play, Loader2, Info } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { PMO_SYSTEMS } from '../lib/pmo-systems';

const AnalysisModule = () => {
  const [loading, setLoading] = useState(false);

  const handleAction = async (actionName: string, payload: any = {}) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/pmo/${actionName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Action failed');
      toast.success(`Action ${actionName} completed`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">System Analysis Modules</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[8px] font-bold text-slate-500 uppercase">Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-300" />
            <span className="text-[8px] font-bold text-slate-500 uppercase">Standby</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.values(PMO_SYSTEMS).map(sys => (
          <div key={sys.id} className="bg-white/5 border border-white/10 p-5 rounded-3xl group hover:bg-white/10 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-blue-500/10 transition-all" />
            
            <div className="flex justify-between items-center mb-4 relative z-10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-800 rounded-lg border border-white/5">
                  <Cpu size={14} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <span className="text-[10px] font-mono text-slate-500">{sys.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                  sys.isActive ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                )}>
                  {sys.isActive ? 'Processing' : 'Standby'}
                </span>
                <span className={cn(
                  "h-2 w-2 rounded-full",
                  sys.isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-500'
                )} />
              </div>
            </div>
            
            <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors mb-2 relative z-10">
              {sys.name}
            </h3>
            <p className="text-[10px] text-slate-500 leading-relaxed mb-4 relative z-10">
              {sys.description}
            </p>
            
            <div className="flex flex-wrap gap-1.5 mb-4 relative z-10">
              {sys.frameworks.map((f, i) => (
                <span key={i} className="text-[8px] font-bold bg-white/5 text-slate-400 px-2 py-0.5 rounded-md border border-white/5">
                  {f}
                </span>
              ))}
            </div>
            
            <div className="pt-4 border-t border-white/5 flex justify-between items-center relative z-10">
              <div className="flex items-center gap-2">
                <Info size={10} className="text-slate-600" />
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Outputs to: {sys.outputsTo[0]}</span>
              </div>
              <button 
                onClick={() => handleAction('view_logic', { id: sys.id })}
                disabled={loading}
                className="text-[9px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                View Logic <ChevronRight size={10} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AuthorityTable = () => {
  const [loading, setLoading] = useState(false);

  const handleAction = async (actionName: string, payload: any = {}) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/pmo/${actionName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Action failed');
      toast.success(`Action ${actionName} completed`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pb-2 border-b border-white/5">
        <div>Module</div>
        <div>Level</div>
        <div>Last Sync</div>
        <div>Status</div>
      </div>
      {[
        { id: 'pmo_ops', module: 'PMO-Ops', level: 'Full Access', sync: '2m ago', status: 'Active' },
        { id: 'tech_ops', module: 'Tech-Ops', level: 'Restricted', sync: '15m ago', status: 'Active' },
        { id: 'miidle', module: 'MIIDLE', level: 'Full Access', sync: '1h ago', status: 'Standby' },
        { id: 'finance', module: 'Finance', level: 'None', sync: 'N/A', status: 'Locked' },
      ].map((row, i) => (
        <div 
          key={i} 
          className="grid grid-cols-4 items-center p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all cursor-pointer"
          onClick={() => handleAction('view_authority_detail', { id: row.id })}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center border border-white/5">
              <Cpu className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
            </div>
            <span className="text-sm font-bold text-white">{row.module}</span>
          </div>
          <span className="text-xs text-slate-400">{row.level}</span>
          <span className="text-xs text-slate-400 font-mono">{row.sync}</span>
          <div>
            <span className={cn(
              "px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest",
              row.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              row.status === 'Standby' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            )}>
              {row.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const FrameworkChains = () => {
  const [activeChain, setActiveChain] = useState<string | null>(null);

  const handleTrigger = async (name: string) => {
    setActiveChain(name);
    try {
      const res = await fetch('/api/pmo/trigger_system_chain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Action failed');
      toast.success(`Chain ${name} triggered`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to trigger chain');
    } finally {
      setActiveChain(null);
    }
  };

  return (
    <div className="space-y-4">
      {[
        { name: 'Bottleneck Detection', chain: ['KPI Tree', 'Control Charts', 'ToC'], status: 'Active', trigger: 'Variance > 15%' },
        { name: 'Strategic Alignment', chain: ['Balanced Scorecard', 'Logic Model'], status: 'Standby', trigger: 'Monthly Audit' },
        { name: 'Operational Efficiency', chain: ['Lean', 'Value Stream Map'], status: 'Active', trigger: 'Capacity > 85%' },
      ].map((chain, i) => (
        <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3 group hover:bg-white/10 transition-all">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-3 h-3 text-blue-400" />
              <span className="text-sm font-bold text-white">{chain.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn(
                "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                chain.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-500'
              )}>
                {chain.status}
              </span>
              <button 
                onClick={() => handleTrigger(chain.name)}
                disabled={activeChain !== null}
                className="p-1.5 bg-blue-600/20 border border-blue-600/30 rounded-lg hover:bg-blue-600/40 transition-all disabled:opacity-50"
              >
                {activeChain === chain.name ? <Loader2 className="w-3 h-3 text-blue-400 animate-spin" /> : <Play className="w-3 h-3 text-blue-400" />}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {chain.chain.map((step, j) => (
              <React.Fragment key={j}>
                <span className="px-2 py-1 bg-white/5 rounded text-[9px] font-bold text-slate-300 whitespace-nowrap border border-white/5">{step}</span>
                {j < chain.chain.length - 1 && <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />}
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[9px] text-slate-500 italic">
            <AlertCircle className="w-3 h-3" />
            Trigger: {chain.trigger}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function SystemsPage({ sysStats = { lastSync: '10:45 AM', missed: 4, gaps: 12, overdue: 3 } }: { sysStats?: any }) {
  const [loading, setLoading] = useState(false);

  const handleAction = async (actionName: string, payload: any = {}) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/pmo/${actionName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Action failed');
      toast.success(`Action ${actionName} completed`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black tracking-tighter text-white">Systems & Authority</h2>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Last System-Wide Sync: {sysStats.lastSync}</p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-4 space-y-8">
          <div className="cinematic-panel border-l-4 border-status-orange space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-status-orange" />
                <h3 className="text-lg font-bold text-white">Quality Control</h3>
              </div>
              <button 
                className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all disabled:opacity-50"
                onClick={() => handleAction('refresh_quality_stats')}
                disabled={loading}
              >
                <RefreshCw className={cn("w-4 h-4 text-slate-500", loading && "animate-spin")} />
              </button>
            </div>
            
            <ul className="space-y-4">
              <li className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-xs font-bold text-slate-300">Missed Tasks</span>
                <span className="text-xl font-black text-status-red">{sysStats.missed}</span>
              </li>
              <li className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-xs font-bold text-slate-300">Data Gaps</span>
                <span className="text-xl font-black text-status-orange">{sysStats.gaps}</span>
              </li>
              <li className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-xs font-bold text-slate-300">Overdue Approvals</span>
                <span className="text-xl font-black text-status-purple">{sysStats.overdue}</span>
              </li>
            </ul>
            
            <button 
              onClick={() => handleAction('initiate_system_audit')}
              disabled={loading}
              className="w-full py-4 bg-status-orange/10 border border-status-orange/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-status-orange hover:bg-status-orange/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Initiating...' : 'Initiate System Audit'}
            </button>
          </div>

          <div className="cinematic-panel space-y-6">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-white">Active System Chains</h3>
            </div>
            <FrameworkChains />
          </div>
        </div>

        <div className="col-span-8 space-y-8">
          <div className="cinematic-panel space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Authority Matrix</h3>
              </div>
              <button 
                onClick={() => handleAction('update_permissions')}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 rounded-xl text-xs font-bold hover:bg-blue-500 transition-all text-white disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Permissions'}
              </button>
            </div>
            <AuthorityTable />
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="cinematic-panel space-y-6">
              <AnalysisModule />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
