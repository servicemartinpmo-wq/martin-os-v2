import React from 'react';
import { 
  Database, 
  Network, 
  Layers, 
  GitBranch, 
  Workflow, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Link2, 
  FileJson,
  Server,
  Cloud
} from 'lucide-react';
import { AppMode } from '../../types';
import { cn } from '../../lib/utils';

interface DataOperatingSystemProps {
  mode: AppMode;
  className?: string;
}

export default function DataOperatingSystem({ mode, className }: DataOperatingSystemProps) {
  const ontologyNodes = [
    { id: 'customers', label: 'Customers', count: '1.2k', icon: Globe, color: 'blue' },
    { id: 'employees', label: 'Employees', count: '156', icon: ShieldCheck, color: 'purple' },
    { id: 'projects', label: 'Projects', count: '42', icon: Layers, color: 'green' },
    { id: 'revenue', label: 'Revenue', count: '$1.5M', icon: Zap, color: 'amber' },
  ];

  const connections = [
    { id: 'api', label: 'APIs', status: 'Connected', icon: Link2 },
    { id: 'db', label: 'Databases', status: 'Connected', icon: Database },
    { id: 'files', label: 'Files', status: 'Synced', icon: FileJson },
    { id: 'erp', label: 'ERP Systems', status: 'Connected', icon: Server },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ontology Layer & Relationship Mapping */}
        <div className="md:col-span-2 bg-white border border-slate-100 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-2xl">
                <Network className="text-blue-500" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Ontology Layer</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Unified Data Model</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Graph Structure:</span>
              <span className="text-sm font-black text-blue-500">Active</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {ontologyNodes.map((node) => (
              <div key={node.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center group hover:border-blue-200 transition-colors cursor-pointer">
                <div className={cn("p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform", `bg-${node.color}-50`)}>
                  <node.icon className={cn(`text-${node.color}-500`)} size={20} />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{node.label}</p>
                <p className="text-lg font-black text-slate-900">{node.count}</p>
              </div>
            ))}
          </div>

          <div className="p-6 bg-slate-900 text-white rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <GitBranch size={80} />
            </div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-1">Relationship Mapping</h3>
                <p className="text-xs text-slate-400">Mapping 15,240 data relationships across the organization.</p>
              </div>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20">
                Explore Graph
              </button>
            </div>
          </div>
        </div>

        {/* Universal Connectivity */}
        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 flex flex-col">
          <div className="flex items-center gap-2 mb-8">
            <Link2 className="text-slate-400" size={20} />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Universal Connectivity</span>
          </div>
          
          <div className="space-y-4 flex-1">
            {connections.map((conn) => (
              <div key={conn.id} className="p-4 bg-white rounded-xl border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                    <conn.icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{conn.label}</h4>
                    <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">{conn.status}</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud className="text-slate-400" size={14} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cloud Infrastructure</span>
              </div>
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">AWS / GCP / Azure</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="text-slate-400" size={14} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Edge Computing</span>
              </div>
              <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
