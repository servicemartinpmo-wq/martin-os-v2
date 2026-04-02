import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Target, User, Calendar, Shield } from 'lucide-react';
import { cn } from '../lib/utils';

const OnboardingOverlay = ({ step, onClose }: { step: string, onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
    <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-md text-center space-y-6 shadow-2xl">
      <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/20">
        <Target className="w-8 h-8 text-blue-400" />
      </div>
      <h3 className="text-2xl font-black text-white tracking-tighter">Welcome to {step}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">This is your command center for all major projects. Track progress, manage dependencies, and ensure maturity across all departments.</p>
      <button 
        onClick={onClose}
        className="w-full py-4 bg-blue-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all"
      >
        Got it, Commander
      </button>
    </div>
  </div>
);

const DropdownDetails = ({ subInitiatives }: { subInitiatives: any[] }) => (
  <div className="mt-4 p-6 bg-black/20 rounded-2xl border border-white/5 space-y-4 animate-in fade-in slide-in-from-top-2">
    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Sub-Initiatives & Milestones</h4>
    <div className="grid gap-4">
      {subInitiatives.map((sub, i) => (
        <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="text-xs font-bold text-white">{sub.name}</span>
          </div>
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{sub.status}</span>
        </div>
      ))}
    </div>
  </div>
);

const InitiativeRow = ({ data, children }: { data: any, children?: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className={cn(
      "p-4 rounded-2xl border border-white/5 transition-all",
      data.priority === 'High' ? 'initiative-row--high-priority' : 'bg-white/5 hover:bg-white/10'
    )}>
      <div 
        className="grid grid-cols-5 items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center border border-white/5">
            <Target className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-sm font-bold text-white">{data.name}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <User className="w-3 h-3" />
          {data.lead}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Calendar className="w-3 h-3" />
          {data.timeline}
        </div>
        <div>
          <span className={cn(
            "px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest",
            data.status === 'On Track' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
            data.status === 'Needs Attention' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
            'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          )}>
            {data.status}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{data.priority}</span>
          {isOpen ? <ChevronDown className="w-4 h-4 text-slate-600" /> : <ChevronRight className="w-4 h-4 text-slate-600" />}
        </div>
      </div>
      {isOpen && children}
    </div>
  );
};

export default function InitiativesPage({ initiatives }: { initiatives: any[] }) {
  const [showTutorial, setShowTutorial] = useState(true);

  return (
    <div className="p-8 space-y-8">
      {showTutorial && <OnboardingOverlay step="Initiatives" onClose={() => setShowTutorial(false)} />}
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tighter text-white">Operational Initiatives</h2>
        <button className="px-4 py-2 bg-blue-600 rounded-xl text-xs font-bold hover:bg-blue-500 transition-all">New Initiative</button>
      </div>
      
      <div className="cinematic-panel w-full space-y-4">
        {/* Sortable Table Header */}
        <div className="grid grid-cols-5 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pb-2 border-b border-white/5">
          <div>Name</div>
          <div>Lead</div>
          <div>Timeline</div>
          <div>Status</div>
          <div>Priority</div>
        </div>
        
        {/* List with Dropdown Accordions */}
        <div className="space-y-4">
          {initiatives.map(init => (
            <InitiativeRow key={init.id} data={init}>
              <DropdownDetails subInitiatives={init.sub_items || []} />
            </InitiativeRow>
          ))}
          {initiatives.length === 0 && (
            <div className="p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto border border-white/5">
                <Shield className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-sm text-slate-500 italic">No active initiatives found in the system.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
