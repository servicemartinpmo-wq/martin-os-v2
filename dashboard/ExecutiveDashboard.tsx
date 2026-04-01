import React, { useEffect, useState } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Zap,
  ArrowRight,
  MoreHorizontal,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import LockscreenBanner from './LockscreenBanner';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';
import { useAI } from '../../context/AIContext';
import { AIResultModal } from '../shared/AIResultModal';
import { toast } from 'sonner';

const chartData = [
  { name: 'Mon', value: 40 },
  { name: 'Tue', value: 30 },
  { name: 'Wed', value: 45 },
  { name: 'Thu', value: 35 },
  { name: 'Fri', value: 55 },
  { name: 'Sat', value: 48 },
  { name: 'Sun', value: 62 },
];

const pieData = [
  { name: 'On Track', value: 65, color: '#22c55e' },
  { name: 'At Risk', value: 20, color: '#f97316' },
  { name: 'Delayed', value: 15, color: '#a855f7' },
];

export default function ExecutiveDashboard() {
  const { ai } = useAI();
  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [signals, setSignals] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
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
      return data;
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'An error occurred');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const [projectsRes, signalsRes, insightsRes] = await Promise.all([
          supabase.from('projects').select('*').order('priority_score', { ascending: false }).limit(3),
          supabase.from('signals').select('*'),
          supabase.from('insights').select('*')
        ]);
        
        if (projectsRes.error) throw projectsRes.error;
        if (signalsRes.error) throw signalsRes.error;
        if (insightsRes.error) throw insightsRes.error;
        
        setInitiatives(projectsRes.data || []);
        setSignals(signalsRes.data || []);
        setInsights(insightsRes.data || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleIntelligenceSync = async () => {
    setAiLoading(true);
    setIsModalOpen(true);
    try {
      const context = `
        Current Initiatives: ${initiatives.map(i => i.title).join(', ')}
        Active Signals: ${signals.map(s => s.title).join(', ')}
        Recent Insights: ${insights.map(i => i.title).join(', ')}
      `;
      
      const r = await handleAction('run_intelligence_sync', { 
        mode: 'executive',
        context 
      });

      setAiResult(r.result?.text || r.result?.message || 'Intelligence synthesized successfully.');
    } catch (error) {
      console.error('Intelligence sync error:', error);
      setAiResult('Error synthesizing intelligence. Please check system logs.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleDelegateTasks = async () => {
    setAiLoading(true);
    setIsModalOpen(true);
    try {
      const r = await handleAction('delegate_tasks', { 
        priority: 'high',
        scope: 'immediate'
      });

      setAiResult(r.result?.text || r.result?.message || 'Tasks delegated successfully.');
    } catch (error) {
      console.error('Delegation error:', error);
      setAiResult('Error delegating tasks.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Lockscreen Banner */}
      <LockscreenBanner mode="Executive" />

      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Good morning, John</h2>
          <p className="text-slate-500 mt-1">Here's what requires your attention today.</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-slate-600">System Active</span>
          </div>
          <button 
            onClick={handleIntelligenceSync}
            disabled={aiLoading || actionLoading}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg shadow-sm hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {aiLoading || actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            <span>{aiLoading || actionLoading ? "Syncing..." : "Run Intelligence Sync"}</span>
          </button>
        </div>
      </header>

      {/* Top Section: Today's Priorities */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-500" />
              Today's Priorities
            </h3>
            <button className="text-cyan-600 text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-cyan-500 mb-2" />
                <p className="text-sm text-slate-500">Loading priorities...</p>
              </div>
            ) : initiatives.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-slate-500">No active priorities found.</p>
              </div>
            ) : initiatives.map((ini) => (
              <div key={ini.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                  ini.status === 'Needs Attention' ? "bg-orange-100 text-orange-600" :
                  ini.status === 'Delayed' ? "bg-purple-100 text-purple-600" : "bg-green-100 text-green-600"
                )}>
                  {ini.status === 'On Track' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 truncate group-hover:text-cyan-600 transition-colors">{ini.title}</h4>
                  <p className="text-sm text-slate-500 truncate">{ini.description || 'No description provided.'}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Impact</p>
                  <p className="text-sm font-bold text-slate-900">{ini.strategic_alignment || 'Medium'}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-cyan-500 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              Executive Load
            </h3>
            <div className="text-5xl font-bold mb-2">84%</div>
            <p className="text-slate-400 text-sm mb-6">Your decision bandwidth is reaching critical levels.</p>
            
            <div className="space-y-4">
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: '84%' }} />
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                <span>Optimal</span>
                <span>Critical</span>
              </div>
            </div>

            <button 
              onClick={handleDelegateTasks}
              disabled={aiLoading || actionLoading}
              className="w-full mt-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {aiLoading || actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delegate Tasks"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {/* Decorative background element */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Middle Section: Operational Signals */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full p-12 flex items-center justify-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : signals.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            No signals found.
          </div>
        ) : signals.map((signal) => (
          <div key={signal.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{signal.title}</p>
              <MoreHorizontal className="w-4 h-4 text-slate-400 cursor-pointer" />
            </div>
            <div className="flex items-end gap-3 mb-4">
              <span className="text-3xl font-bold text-slate-900">{signal.value || '0%'}</span>
              <div className={cn(
                "flex items-center gap-1 text-sm font-bold mb-1",
                signal.is_positive ? "text-green-500" : "text-orange-500"
              )}>
                {signal.is_positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{signal.trend || '0%'}</span>
              </div>
            </div>
            <div className="h-12 w-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={signal.history || chartData}>
                  <defs>
                    <linearGradient id={`gradient-${signal.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={signal.severity === 'critical' ? '#f97316' : '#06b6d4'} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={signal.severity === 'critical' ? '#f97316' : '#06b6d4'} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={signal.severity === 'critical' ? '#f97316' : '#06b6d4'} 
                    fillOpacity={1} 
                    fill={`url(#gradient-${signal.id})`} 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </section>

      {/* Bottom Section: Intelligence Advisory & Portfolio Analytics */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Intelligence Advisory Insights</h3>
            <span className="px-3 py-1 bg-cyan-100 text-cyan-700 text-xs font-bold rounded-full uppercase tracking-wider">
              {insights.length} Insights
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <div className="col-span-full p-12 flex items-center justify-center text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : insights.length === 0 ? (
              <div className="col-span-full p-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                No insights found.
              </div>
            ) : insights.map((insight) => (
              <div key={insight.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    "bg-orange-500"
                  )} />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Insight</span>
                </div>
                <h4 className="font-bold text-slate-900 mb-2 leading-tight">{insight.title}</h4>
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{insight.content}</p>
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs font-bold text-cyan-600 uppercase tracking-wider mb-1">Recommendation</p>
                  <p className="text-sm font-medium text-slate-900">Review and optimize.</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Portfolio Health</h3>
          <div className="h-48 w-full min-h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-slate-900">82</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Score</span>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-medium text-slate-600">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <AIResultModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Intelligence Sync Results"
        content={aiResult}
        loading={aiLoading}
      />
    </div>
  );
}
