
import React from 'react';
import { Zap, X } from 'lucide-react';
import { PMO_SYSTEMS } from '../lib/pmo-systems';

interface SmartSignalPopupProps {
  systemKey: string;
  message: string;
  onDismiss: () => void;
  onAction: () => void;
}

export default function SmartSignalPopup({ systemKey, message, onDismiss, onAction }: SmartSignalPopupProps) {
  const system = PMO_SYSTEMS[systemKey];
  
  if (!system) return null;

  return (
    <div className="fixed top-14 left-6 z-[100] w-80 animate-in slide-in-from-left duration-500">
      <div className="bg-white border-l-4 border-status-purple shadow-2xl rounded-r-2xl p-5 relative overflow-hidden group">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full -mr-12 -mt-12 opacity-50 group-hover:scale-110 transition-transform" />
        
        <div className="flex items-start gap-4 relative z-10">
          <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-100 shadow-sm">
            <Zap size={18} className="text-status-purple animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                {system.id} | Signal Detected
              </p>
              <button onClick={onDismiss} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={12} className="text-slate-400" />
              </button>
            </div>
            <p className="text-sm font-bold text-slate-800 leading-tight">
              {message}
            </p>
            
            <div className="mt-4 flex gap-2">
              <button 
                onClick={onAction}
                className="text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white px-3 py-2 rounded-lg hover:bg-slate-700 transition-all shadow-lg hover:shadow-purple-500/20"
              >
                Run Diagnostics
              </button>
              <button 
                onClick={onDismiss}
                className="text-[10px] font-black uppercase tracking-widest border border-slate-200 px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-50 transition-all"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
