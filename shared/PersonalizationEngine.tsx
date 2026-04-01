import React, { useState } from 'react';
import { 
  User, 
  Zap, 
  Target, 
  Settings, 
  CheckCircle2, 
  ArrowRight, 
  BarChart3, 
  Search, 
  Globe, 
  MessageSquare,
  Share2,
  LayoutGrid,
  Palette,
  Cpu
} from 'lucide-react';
import { AppMode } from '../../types';
import { cn } from '../../lib/utils';

interface PersonalizationEngineProps {
  mode: AppMode;
  className?: string;
}

export default function PersonalizationEngine({ mode, className }: PersonalizationEngineProps) {
  const [personalization, setPersonalization] = useState({
    role: mode,
    theme: 'Modern',
    density: 'Compact',
    aiAssistance: 'High'
  });

  const suggestions = [
    { id: 1, text: 'Enable Project Autopilot for your active initiatives.', category: 'Productivity' },
    { id: 2, text: 'Review the new Strategic Alignment System (#1).', category: 'Strategy' },
    { id: 3, text: 'Optimize your dashboard for Executive Reporting.', category: 'UX' },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Personalization Engine - Intake-based UI */}
        <div className="md:col-span-2 bg-white border border-slate-100 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-2xl">
                <Palette className="text-blue-500" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Personalization Engine</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Intake-based UI (MBTI-style)</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profile:</span>
              <span className="text-sm font-black text-blue-500">{mode}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Founder', 'Executive', 'Creative', 'Freelancer'].map((role) => (
                    <button 
                      key={role}
                      onClick={() => setPersonalization({ ...personalization, role: role as any })}
                      className={cn(
                        "px-4 py-2 border rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                        personalization.role === role ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"
                      )}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">UI Density</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Compact', 'Spacious'].map((density) => (
                    <button 
                      key={density}
                      onClick={() => setPersonalization({ ...personalization, density: density as any })}
                      className={cn(
                        "px-4 py-2 border rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                        personalization.density === density ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"
                      )}
                    >
                      {density}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-center text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Cpu className="text-blue-500" size={32} />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">System Optimization</h3>
              <p className="text-[10px] text-slate-500 leading-relaxed mb-6">
                The engine is continuously learning from your usage patterns to suggest the most relevant features and layouts.
              </p>
              <div className="flex items-center justify-between px-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Learning Rate:</span>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">High</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Suggestions & Usage-based Insights */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Zap size={160} />
          </div>
          
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-2 mb-8">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Zap className="text-blue-400" size={24} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Smart Suggestions</span>
            </div>
            
            <div className="space-y-4">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{suggestion.category}</span>
                    <ArrowRight size={12} className="text-slate-600 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-xs font-bold leading-relaxed">{suggestion.text}</p>
                </div>
              ))}
            </div>
          </div>

          <button className="mt-8 relative z-10 w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all border border-white/10 flex items-center justify-center gap-2">
            View All Insights
          </button>
        </div>
      </div>
    </div>
  );
}
