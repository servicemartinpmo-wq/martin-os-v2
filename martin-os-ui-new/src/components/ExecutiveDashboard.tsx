import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, Zap, Bell, AlertCircle, Info, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import QualityControlView from './QualityControlView';
import ExecutiveLoadMeter from './ExecutiveLoadMeter';
import { toast } from 'sonner';

// Real-time Notification Portal
const SignalPopup = ({ signal }: { signal: { message: string } }) => {
  return (
    <div className="fixed top-20 left-8 z-50 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-l-4 border-purple-500 p-4 rounded-r-2xl flex items-center gap-4 backdrop-blur-xl">
        <div className="bg-purple-500/10 p-2 rounded-xl">
          <AlertCircle size={20} className="text-purple-600" />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">System Signal</p>
          <p className="text-sm font-bold text-slate-800">{signal.message}</p>
        </div>
      </div>
    </div>
  );
};

// Tooltip Logic for Prioritization
const PriorityTooltip = ({ tier }: { tier: number }) => (
  <div className="group relative inline-block ml-2">
    <span className="cursor-help underline decoration-dotted text-slate-500 hover:text-white transition-colors">Tier {tier}</span>
    <div className="invisible group-hover:visible absolute z-50 w-64 p-3 bg-slate-900 border border-white/10 text-white text-[10px] rounded-xl bottom-full mb-2 left-1/2 -translate-x-1/2 shadow-2xl backdrop-blur-xl">
      <div className="font-bold mb-1 uppercase tracking-widest text-blue-400">Prioritization Logic</div>
      {tier === 1 ? "Immediate impact on strategic KPIs. 24hr resolution suggested. High-velocity execution required." : "Standard operational flow. Monitor for variance."}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
    </div>
  </div>
);

const StatCard = ({ icon, title, count, color }: { icon: string | React.ReactNode, title: string, count: number, color: string }) => (
  <div className="flex-1 cinematic-panel flex items-center gap-4 group hover:scale-[1.02] transition-transform">
    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner", 
      color === 'status-orange' ? 'bg-status-orange/10 text-status-orange border border-status-orange/20' :
      color === 'status-yellow' ? 'bg-status-yellow/10 text-status-yellow border border-status-yellow/20' :
      color === 'status-purple' ? 'bg-status-purple/10 text-status-purple border border-status-purple/20' :
      'bg-status-blue/10 text-status-blue border border-status-blue/20'
    )}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{title}</p>
      <p className="text-2xl font-black text-white">{count}</p>
    </div>
  </div>
);

const MeetingList = ({ items }: { items: any[] }) => (
  <div className="space-y-4">
    {items.map((meeting, i) => (
      <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all">
        <div className="flex gap-4 items-center">
          <div className="w-10 h-10 bg-slate-800 rounded-xl flex flex-col items-center justify-center border border-white/5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">{meeting.time.split(' ')[1]}</span>
            <span className="text-xs font-black text-white">{meeting.time.split(' ')[0]}</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">{meeting.title}</h4>
            <div className="flex items-center gap-2">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">{meeting.location || 'Virtual'}</p>
              <PriorityTooltip tier={meeting.priorityTier || 2} />
            </div>
          </div>
        </div>
        {meeting.prepWarning && (
          <div className="flex items-center gap-2 px-3 py-1 bg-status-orange/10 border border-status-orange/20 rounded-lg">
            <ShieldAlert className="w-3 h-3 text-status-orange" />
            <span className="text-[8px] font-black text-status-orange uppercase tracking-widest">{meeting.warningType}</span>
          </div>
        )}
      </div>
    ))}
    {items.length === 0 && <p className="text-sm text-slate-500 italic">No meetings scheduled for today.</p>}
  </div>
);

const FlatCinematicGauge = ({ value, label }: { value: number, label: string }) => (
  <div className="w-full space-y-4">
    <div className="flat-gauge bg-slate-900/50 flex flex-col items-center justify-end pb-4 overflow-hidden relative">
      <div 
        className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-500/40 to-transparent transition-all duration-1000"
        style={{ height: `${value}%` }}
      />
      <div className="relative z-10 text-center">
        <span className="text-4xl font-black text-white">{value}%</span>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</p>
      </div>
    </div>
  </div>
);

const SmartSignalsFeed = () => (
  <div className="space-y-3">
    {[
      { id: 1, type: 'priority', msg: 'Resource bottleneck detected in Tech-Ops Q2 planning.', time: '2m ago' },
      { id: 2, type: 'risk', msg: 'Budget drift exceeding 5% threshold in Finance module.', time: '15m ago' },
      { id: 3, type: 'info', msg: 'System Chain: Strategic Alignment synchronized.', time: '1h ago' },
    ].map((signal) => (
      <div key={signal.id} className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-start gap-3 group hover:bg-white/10 transition-all">
        <div className={cn(
          "w-2 h-2 rounded-full mt-1.5 shrink-0",
          signal.type === 'priority' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' :
          signal.type === 'risk' ? 'bg-status-orange shadow-[0_0_10px_rgba(249,115,22,0.5)]' :
          'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
        )} />
        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-bold text-white leading-tight">{signal.msg}</p>
          <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{signal.time}</span>
        </div>
      </div>
    ))}
  </div>
);

export default function ExecutiveDashboard({ user, org }: { user: any, org: any }) {
  const [activeSignal, setActiveSignal] = useState<{ message: string } | null>(null);
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

  useEffect(() => {
    // Simulate a system signal after mount
    const timer = setTimeout(() => {
      setActiveSignal({ message: "Operational Bottleneck Detected in Project Alpha" });
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen bg-brand-bg text-navy relative">
      {activeSignal && <SignalPopup signal={activeSignal} />}
      
      {/* Dismissible Top Bar */}
      <div className="top-upsell-bar">
        Unlock more with Martin PMO-Ops <span className="underline ml-2 cursor-pointer">Read More</span>
      </div>

      <header className="p-8 border-b border-white/10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white">Good morning, {user.firstName}</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{org.name} Command Center</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => handleAction('run_intelligence_sync')}
            disabled={actionLoading}
            className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-xl flex items-center gap-2 hover:bg-blue-600/30 transition-all text-blue-400 disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Sync Intelligence</span>
          </button>
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Logic Module: Synchronized</span>
          </div>
        </div>
      </header>

      <main className="p-8 grid grid-cols-12 gap-6">
        {/* Section 1: Executive Command View */}
        <div className="col-span-12 flex flex-col gap-4">
          <h2 className="text-xl font-black tracking-tight text-white">Executive Command View</h2>
          <div className="flex gap-4">
            <StatCard icon="🚨" title="Risks" count={4} color="status-orange" />
            <StatCard icon="✅" title="Approvals" count={12} color="status-yellow" />
            <StatCard icon="📅" title="Deadlines" count={3} color="status-purple" />
            <StatCard icon="⚡" title="Priorities" count={7} color="status-blue" />
            <div className="flex-1 cinematic-panel bg-blue-600/10 border-blue-500/30 flex flex-col justify-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">Smart Signals</p>
              <p className="text-xs font-bold text-white">3 High-Velocity Directives pending your approval.</p>
            </div>
          </div>
        </div>

        {/* Section 2: Meeting Shortlist & Quality Control */}
        <div className="col-span-8 space-y-8">
          <div className="cinematic-panel">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black tracking-tight text-white">Today's Meeting Shortlist</h2>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">3 Meetings • 2 Prep Signals</span>
            </div>
            <MeetingList items={user.meetingsToday || []} />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <QualityControlView />
            <div className="cinematic-panel space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Bell className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Operational Signals</h3>
              </div>
              <SmartSignalsFeed />
            </div>
          </div>
        </div>

        {/* Section 3: Operational Status */}
        <div className="col-span-4 space-y-8">
          <div className="cinematic-panel flex flex-col items-center">
            <h2 className="text-xl font-black tracking-tight text-white mb-6">Operational Status</h2>
            <FlatCinematicGauge value={org.executiveLoad || 72} label="Executive Load" />
            <div className="mt-8 text-center w-full pt-8 border-t border-white/5">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Maturity Index</span>
              <div className="text-4xl font-black text-status-elite mt-1">84%</div>
              <p className="text-[10px] text-slate-600 mt-2 italic">Structured Command: Active</p>
            </div>
          </div>
          <ExecutiveLoadMeter userId="current_user" />
        </div>
      </main>
    </div>
  );
}
