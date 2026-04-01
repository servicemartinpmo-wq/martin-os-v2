import React, { useState } from 'react';
import { FileText, Zap, ChevronRight, Search, Filter, Download, ExternalLink, LayoutGrid } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

const Frameworks = [
  { name: "Theory of Constraints", execution: "Diagnostics", outputs: "Initiatives", context: "Operational" },
  { name: "Balanced Scorecard", execution: "Diagnostics", outputs: "Dashboard, Reports", context: "Strategic" },
  { name: "Lean", execution: "Diagnostics", outputs: "Departments", context: "Operational" },
];

const ResourceHubMatrix = () => {
  return (
    <div className="cinematic-panel overflow-hidden p-0">
      <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
        <LayoutGrid className="w-5 h-5 text-blue-400" />
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">System Chain Matrix</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/50 text-slate-400 uppercase tracking-widest font-black">
            <tr>
              <th className="p-4 border-b border-white/10">Framework / Method</th>
              <th className="p-4 border-b border-white/10">Execution Module</th>
              <th className="p-4 border-b border-white/10">Outputs To</th>
              <th className="p-4 border-b border-white/10 text-right">Temporal Context</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {Frameworks.map(f => (
              <tr key={f.name} className="hover:bg-white/5 transition-colors cursor-help group">
                <td className="p-4 font-bold text-white group-hover:text-blue-400 transition-colors">{f.name}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md font-black uppercase tracking-tighter text-[10px]">
                    {f.execution}
                  </span>
                </td>
                <td className="p-4 text-slate-300">{f.outputs}</td>
                <td className="p-4 text-slate-500 text-right font-mono italic">{f.context}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function ResourceHub() {
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
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'An error occurred');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tighter text-white">Resource Hub - PMO-Ops</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input 
              placeholder="Search resources..." 
              className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>
      
      <ResourceHubMatrix />

      <div className="grid grid-cols-2 gap-8">
        <div className="cinematic-panel space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Operational Templates</h3>
          </div>
          
          <div className="space-y-2">
            {[
              'Lesson Plan Template (Editable)',
              'Standardized Monday Agenda',
              'Q1 Audit Framework',
              'Site Access SOP Template',
              'MOCHA Assignment Matrix',
            ].map((template, i) => (
              <button key={i} className="w-full text-left p-4 hover:bg-white/5 border-b border-white/5 flex items-center justify-between group transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center border border-white/5">
                    <FileText className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{template}</span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <Download className="w-4 h-4 text-slate-500 hover:text-blue-400" />
                  <ExternalLink className="w-4 h-4 text-slate-500 hover:text-blue-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="cinematic-panel space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center border border-cyan-500/20">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Active Workflows</h3>
          </div>
          
          <div className="space-y-4">
            {[
              { name: 'Standardized Monday Agenda', desc: 'Automated agenda generation for weekly syncs.' },
              { name: 'Budget Drift Diagnostic', desc: 'Real-time analysis of department spending.' },
              { name: 'Onboarding Sequence', desc: 'Step-by-step operational setup for new hires.' },
              { name: 'Risk Escalation Protocol', desc: 'Automated notification chain for critical risks.' },
            ].map((workflow, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-2xl group hover:bg-white/10 transition-all">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-white">{workflow.name}</span>
                  <span className="text-[10px] text-slate-500 italic">{workflow.desc}</span>
                </div>
                <button 
                  onClick={() => handleAction('deploy_workflow')}
                  disabled={actionLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg disabled:opacity-50"
                >
                  Deploy
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
