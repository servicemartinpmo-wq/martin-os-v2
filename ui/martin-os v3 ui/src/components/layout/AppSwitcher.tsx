import React from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  Share2,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { AppType } from '../../types';

interface AppSwitcherProps {
  currentApp: AppType;
  setApp: (app: AppType) => void;
}

const apps: { id: AppType; label: string; icon: any; color: string; bg: string; shadow: string; desc: string }[] = [
  { 
    id: 'PMO-OPs', 
    label: 'PMO-OPs', 
    icon: ShieldCheck, 
    color: 'text-blue-500', 
    bg: 'bg-blue-500/10',
    shadow: 'shadow-blue-500/20',
    desc: 'Strategic Command' 
  },
  { 
    id: 'TECH-OPs', 
    label: 'TECH-OPs', 
    icon: Terminal, 
    color: 'text-cyan-500', 
    bg: 'bg-cyan-500/10',
    shadow: 'shadow-cyan-500/20',
    desc: 'Infrastructure' 
  },
  { 
    id: 'miidle', 
    label: 'miidle', 
    icon: Share2, 
    color: 'text-purple-500', 
    bg: 'bg-purple-500/10',
    shadow: 'shadow-purple-500/20',
    desc: 'Creative Process' 
  },
];

export default function AppSwitcher({ currentApp, setApp }: AppSwitcherProps) {
  return (
    <div className="space-y-2">
      <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Applications</p>
      <div className="space-y-1">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => setApp(app.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 group",
              currentApp === app.id 
                ? "bg-slate-800 text-white shadow-lg border border-slate-700" 
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110",
              currentApp === app.id 
                ? cn("bg-slate-900 shadow-xl", app.color, app.shadow) 
                : "bg-slate-900/50 text-slate-600"
            )}>
              <app.icon className="w-5 h-5" />
            </div>
            <div className="text-left flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest leading-tight">{app.label}</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter leading-tight mt-0.5">{app.desc}</p>
            </div>
            {currentApp === app.id && <ChevronRight className="w-3 h-3 text-slate-600" />}
          </button>
        ))}
      </div>
    </div>
  );
}
