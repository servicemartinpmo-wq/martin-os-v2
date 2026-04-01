import React from 'react';
import { 
  Trophy, 
  Zap, 
  Target, 
  CheckCircle2, 
  ArrowRight, 
  BarChart3, 
  Search, 
  Globe, 
  MessageSquare,
  Share2,
  TrendingUp,
  Star
} from 'lucide-react';
import { AppMode } from '../../types';
import { cn } from '../../lib/utils';

interface UserEngagementSystemProps {
  mode: AppMode;
  className?: string;
}

export default function UserEngagementSystem({ mode, className }: UserEngagementSystemProps) {
  const streaks = [
    { id: 1, name: 'Decision Accuracy', value: 12, unit: 'days', icon: Target, color: 'blue' },
    { id: 2, name: 'Workflow Efficiency', value: 8, unit: 'days', icon: Zap, color: 'amber' },
    { id: 3, name: 'Team Alignment', value: 15, unit: 'days', icon: CheckCircle2, color: 'green' },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gamification - Scores & Streaks */}
        <div className="md:col-span-2 bg-white border border-slate-100 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-50 rounded-2xl">
                <Trophy className="text-amber-500" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">User Engagement System</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gamification & Intelligence Nudges</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Score:</span>
              <span className="text-sm font-black text-amber-500">12,450</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {streaks.map((streak) => (
              <div key={streak.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center group hover:border-blue-200 transition-colors cursor-pointer">
                <div className={cn("p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform", `bg-${streak.color}-50`)}>
                  <streak.icon className={cn(`text-${streak.color}-500`)} size={20} />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{streak.name}</p>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-black text-slate-900">{streak.value}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{streak.unit}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-slate-900 text-white rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Star size={80} />
            </div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-1">System Nudge: Optimization Suggestion</h3>
                <p className="text-xs text-slate-400">You haven't used the "Strategic Alignment" feature in 3 days. Try it now to boost your score!</p>
              </div>
              <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-xl shadow-amber-500/20">
                Try Now
              </button>
            </div>
          </div>
        </div>

        {/* Social Sharing & Reports */}
        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 flex flex-col">
          <div className="flex items-center gap-2 mb-8">
            <Share2 className="text-slate-400" size={20} />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Social Sharing</span>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-xl shadow-blue-500/10 mb-6">
              <TrendingUp size={32} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Share Your Progress</h3>
            <p className="text-[10px] text-slate-500 leading-relaxed mb-8 max-w-xs">
              Share your organizational health scores and strategic reports with your team or stakeholders.
            </p>
            <div className="grid grid-cols-2 gap-2 w-full">
              <button className="py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-slate-50">
                Copy Link
              </button>
              <button className="py-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-slate-800 flex items-center justify-center gap-2">
                <Share2 size={12} />
                Share
              </button>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="text-amber-500" size={14} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Rank</span>
              </div>
              <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Top 5%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="text-amber-500" size={14} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Badges Earned</span>
              </div>
              <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
