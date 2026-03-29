import React from 'react';
import { 
  Link2, 
  Globe, 
  Users, 
  ArrowRight, 
  Zap, 
  Database, 
  FileJson, 
  Server, 
  Cloud, 
  Search, 
  Share2, 
  TrendingUp,
  Briefcase,
  ShieldCheck,
  Cpu,
  RefreshCw,
  Import,
  Network,
  LayoutGrid
} from 'lucide-react';
import { AppMode } from '../../types';
import { cn } from '../../lib/utils';

interface UniversalConnectivityProps {
  mode: AppMode;
  className?: string;
}

export default function UniversalConnectivity({ mode, className }: UniversalConnectivityProps) {
  const advisors = [
    { id: 'healthcare', name: 'Healthcare Advisor', icon: ShieldCheck, color: 'blue' },
    { id: 'startup', name: 'Startup Advisor', icon: Rocket, color: 'amber' },
    { id: 'engineering', name: 'Engineering Advisor', icon: Cpu, color: 'purple' },
    { id: 'enterprise', name: 'Enterprise Advisor', icon: Globe, color: 'green' },
  ];

  function Rocket(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.95.12-3.5-.5-4.5l-2.5 1.5Z" />
        <path d="M11.5 4.5c-1.26-1.5-5-2-5-2s-.5 3.74-2 5c-.95.71-3.5.12-4.5-.5l1.5 2.5Z" />
        <path d="M9 15l3 3" />
        <path d="M15 9l3 3" />
        <path d="M15 5l-3 3" />
        <path d="M9 11l-3 3" />
        <path d="M18.5 5.5a3.5 3.5 0 1 1-5 5 3.5 3.5 0 0 1 5-5Z" />
      </svg>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Import / Migration Engine */}
        <div className="md:col-span-1 bg-white border border-slate-100 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <Import className="text-blue-500" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Import Engine</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Switch in 60 seconds</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {['Asana', 'Jira', 'Trello', 'Monday.com'].map((platform) => (
              <button key={platform} className="w-full p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                    <Database size={20} />
                  </div>
                  <span className="text-sm font-bold text-slate-900">{platform}</span>
                </div>
                <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Community & Network */}
        <div className="md:col-span-2 bg-slate-900 text-white rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Network size={160} />
          </div>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Network className="text-blue-400" size={24} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Community & Network</span>
              </div>
              
              <h2 className="text-3xl font-black mb-4">Advisory Marketplace</h2>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Connect with industry experts and share/import proven workflows and playbooks from the Martin-OS network.
              </p>
              
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white">1.2k</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Workflows</span>
                </div>
                <div className="w-[1px] h-8 bg-slate-800" />
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-blue-400">450</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expert Advisors</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {[
                { label: 'SaaS Launch Playbook', category: 'Growth', downloads: '1.2k' },
                { label: 'HIPAA Compliance Workflow', category: 'Risk', downloads: '850' },
                { label: 'Agile Scrum Framework', category: 'Ops', downloads: '2.4k' },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{item.category}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.downloads} downloads</span>
                  </div>
                  <p className="text-sm font-bold">{item.label}</p>
                </div>
              ))}
              <button className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2">
                Browse Marketplace
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Industry-Specific Advisors */}
      <div className="bg-white border border-slate-100 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Briefcase className="text-slate-400" size={20} />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Industry-Specific Advisors</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Frameworks:</span>
            <span className="text-sm font-black text-blue-500">Customized</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {advisors.map((advisor) => (
            <div key={advisor.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center group hover:border-blue-200 transition-colors cursor-pointer">
              <div className={cn("p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform", `bg-${advisor.color}-50`)}>
                <advisor.icon className={cn(`text-${advisor.color}-500`)} size={32} />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">{advisor.name}</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-6">Custom KPIs + Frameworks</p>
              <button className="w-full py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-slate-900 hover:text-white">
                Activate Advisor
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
