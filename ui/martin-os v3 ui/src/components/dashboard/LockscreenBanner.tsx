import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  ArrowRight,
  Sparkles,
  Zap,
  Bell,
  Smile,
  Heart,
  ThumbsUp,
  PartyPopper
} from 'lucide-react';
import { AppMode } from '../../types';
import { cn } from '../../lib/utils';

interface LockscreenBannerProps {
  mode: AppMode;
  className?: string;
}

const EMOJIS = ['👍', '❤️', '🔥', '🎉', '🚀'];

export default function LockscreenBanner({ mode, className }: LockscreenBannerProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reactions, setReactions] = useState<Record<number, Record<string, number>>>({});

  // Daily seed for images
  const today = new Date().toISOString().split('T')[0];
  const images = [
    `https://picsum.photos/seed/${today}-1/1920/1080`,
    `https://picsum.photos/seed/${today}-2/1920/1080`,
    `https://picsum.photos/seed/${today}-3/1920/1080`,
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 10000); // Change image every 10 seconds
    return () => clearInterval(timer);
  }, [images.length]);

  const handleReaction = (winIndex: number, emoji: string) => {
    setReactions(prev => ({
      ...prev,
      [winIndex]: {
        ...(prev[winIndex] || {}),
        [emoji]: ((prev[winIndex]?.[emoji]) || 0) + 1
      }
    }));
  };

  const getBannerContent = () => {
    switch (mode) {
      case 'Founder/SMB':
        return {
          title: "Founder's Briefing",
          message: "Momentum is high. 3 key approvals pending for Q3 expansion.",
          wins: ["Closed Deal: Project Phoenix", "Team Velocity +12%"],
          alerts: ["Cashflow Alert: Tax Deadline", "1 Blocker in Dev"]
        };
      case 'Executive':
        return {
          title: "Executive Command",
          message: "Operational uptime is 99.9%. Strategic alignment is at 92%.",
          wins: ["Infrastructure Migration Complete", "Q2 Targets Exceeded"],
          alerts: ["Security Audit: 24h Remaining", "Budget Review Required"]
        };
      case 'Assisted':
        return {
          title: "Your Daily Guide",
          message: "You have 4 simple tasks today. I'm here to help you through them.",
          wins: ["You finished all tasks yesterday!", "Great job on the report"],
          alerts: ["Meeting in 15 mins", "New message from Sarah"]
        };
      default:
        return {
          title: "Daily Briefing",
          message: "System optimized. Focus on high-impact execution today.",
          wins: ["Milestone Reached: Alpha v2", "Client Feedback: 5 Stars"],
          alerts: ["2 Tasks Due Today", "System Update Pending"]
        };
    }
  };

  const content = getBannerContent();

  return (
    <div className={cn("relative w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 h-[500px] md:h-auto", className)}>
      {/* Background Image Carousel with Fade */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img 
            key={currentImageIndex}
            src={images[currentImageIndex]} 
            alt="Banner Background" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px]" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row gap-12 items-start md:items-center min-h-[400px]">
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-[10px] font-black rounded-full border border-cyan-500/30 uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(34,211,238,0.1)]">
              {content.title}
            </span>
            <div className="h-[1px] w-12 bg-white/10" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none max-w-2xl">
            {content.message}
          </h1>

          <div className="flex flex-wrap gap-4 pt-4">
            <button className="px-6 py-3 bg-white text-slate-950 font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl flex items-center gap-2">
              <Zap size={16} />
              Start Daily Focus
            </button>
            <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black rounded-2xl text-xs uppercase tracking-widest transition-all flex items-center gap-2">
              <Calendar size={16} />
              View Schedule
            </button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="w-full md:w-80 space-y-4">
          {/* Team Wins */}
          <div className="p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="text-amber-400" size={16} />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Wins</span>
            </div>
            <div className="space-y-4">
              {content.wins.map((win, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-xs font-bold text-white tracking-tight">{win}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 pl-4">
                    {EMOJIS.map(emoji => (
                      <button 
                        key={emoji}
                        onClick={() => handleReaction(i, emoji)}
                        className="p-1 hover:bg-white/10 rounded-lg transition-colors text-xs flex items-center gap-1"
                      >
                        <span>{emoji}</span>
                        {reactions[i]?.[emoji] > 0 && (
                          <span className="text-[8px] font-black text-white/60">{reactions[i][emoji]}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Alerts */}
          <div className="p-5 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="text-cyan-400" size={16} />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Key Alerts</span>
            </div>
            <div className="space-y-3">
              {content.alerts.map((alert, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                  <span className="text-xs font-bold text-slate-300 tracking-tight">{alert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Priority Strip */}
      <div className="relative z-10 bg-white/5 backdrop-blur-3xl border-t border-white/10 p-4 px-10 flex items-center justify-between overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Smart Priority:</span>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <CheckCircle2 size={12} className="text-emerald-500" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">Q3 Review</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
              <AlertCircle size={12} className="text-orange-500" />
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-tighter">Budget Approval</span>
            </div>
          </div>
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Focus:</span>
            <span className="text-xs font-bold text-white italic">"Execution over tracking. Momentum is the metric."</span>
          </div>
        </div>
        <button className="flex items-center gap-2 text-[10px] font-black text-cyan-400 uppercase tracking-widest hover:text-cyan-300 transition-colors">
          View Full Briefing
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}
