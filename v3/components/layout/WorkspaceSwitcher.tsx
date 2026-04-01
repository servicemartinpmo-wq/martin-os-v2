import React from 'react';
import { 
  Layout, 
  Terminal, 
  Share2, 
  ChevronDown, 
  Briefcase, 
  ShieldCheck, 
  Rocket, 
  Building2, 
  User, 
  Palette, 
  Stethoscope, 
  Accessibility,
  Search
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { AppMode } from '../../types';

interface WorkspaceSwitcherProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
}

const modes: { id: AppMode; label: string; icon: any; color: string; bg: string; shadow: string; desc: string }[] = [
  { 
    id: 'Founder/SMB', 
    label: 'Founder/SMB', 
    icon: Briefcase, 
    color: 'text-blue-600', 
    bg: 'bg-blue-50',
    shadow: 'shadow-blue-500/20',
    desc: 'Oversight & Day-to-Day Ops' 
  },
  { 
    id: 'Executive', 
    label: 'Executive', 
    icon: ShieldCheck, 
    color: 'text-slate-900', 
    bg: 'bg-slate-100',
    shadow: 'shadow-slate-500/20',
    desc: 'Org Visibility & Reporting' 
  },
  { 
    id: 'Startup/Project', 
    label: 'Startup/Project', 
    icon: Rocket, 
    color: 'text-cyan-500', 
    bg: 'bg-slate-950',
    shadow: 'shadow-cyan-500/30',
    desc: 'PMBOK & Compliance' 
  },
  { 
    id: 'Admin/Office', 
    label: 'Admin/Office', 
    icon: Building2, 
    color: 'text-black', 
    bg: 'bg-white',
    shadow: 'shadow-black/10',
    desc: 'Office Management & Admin' 
  },
  { 
    id: 'Freelance', 
    label: 'Freelance', 
    icon: User, 
    color: 'text-orange-600', 
    bg: 'bg-orange-50',
    shadow: 'shadow-orange-500/20',
    desc: 'CRM & Marketing Optimization' 
  },
  { 
    id: 'Creative', 
    label: 'Creative', 
    icon: Palette, 
    color: 'text-white', 
    bg: 'bg-gradient-to-br from-fuchsia-500 to-indigo-600',
    shadow: 'shadow-purple-500/30',
    desc: 'Editorial & Artistic Portfolio' 
  },
  { 
    id: 'Healthcare', 
    label: 'Healthcare', 
    icon: Stethoscope, 
    color: 'text-white', 
    bg: 'bg-cyan-500',
    shadow: 'shadow-cyan-500/20',
    desc: 'HIPAA & Practice Management' 
  },
  { 
    id: 'Assisted', 
    label: 'Assisted', 
    icon: Search, 
    color: 'text-sky-600', 
    bg: 'bg-sky-50',
    shadow: 'shadow-sky-500/20',
    desc: 'Simple & Accessible Interface' 
  },
];

export default function WorkspaceSwitcher({ currentMode, setMode }: WorkspaceSwitcherProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const activeMode = modes.find(m => m.id === currentMode)!;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all duration-300 border border-slate-700 shadow-lg group"
      >
        <div className={cn(
          "w-7 h-7 rounded-lg flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
          activeMode.bg,
          activeMode.color,
          activeMode.shadow
        )}>
          <activeMode.icon className="w-4 h-4" />
        </div>
        <div className="text-left flex-1">
          <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">{activeMode.label}</p>
        </div>
        <ChevronDown className={cn("w-3 h-3 text-slate-500 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-30" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute top-full left-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="p-2 space-y-1">
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    setMode(mode.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 text-left group",
                    currentMode === mode.id ? "bg-slate-800/80" : "hover:bg-slate-800/40"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300",
                    mode.bg,
                    mode.color,
                    mode.shadow
                  )}>
                    <mode.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={cn(
                      "font-black text-[10px] uppercase tracking-widest",
                      currentMode === mode.id ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                    )}>{mode.label}</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter mt-0.5">{mode.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="p-3 bg-slate-950/50 border-t border-slate-800">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest text-center">Martin-OS v1.0.5</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
