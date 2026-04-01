import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'motion/react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  ShieldAlert, 
  Target, 
  Zap, 
  ArrowRight,
  BarChart3,
  Loader2
} from 'lucide-react';
import { AppMode } from '../../types';
import { cn } from '../../lib/utils';
import { useAI } from '../../context/AIContext';
import { AIResultModal } from '../shared/AIResultModal';
import { toast } from 'sonner';

interface ExecutiveCommandCenterProps {
  mode: AppMode;
}

interface Project {
  id: string;
  title: string;
  status: string;
  priority_score: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  created_at: string;
}

export default function ExecutiveCommandCenter({ mode }: ExecutiveCommandCenterProps) {
  const { ai } = useAI();
  const isExecutive = mode === 'Executive' || mode === 'Founder/SMB';
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [alerts, setAlerts] = useState<{ type: string; msg: string; time: string }[]>([]);
  const [decisions, setDecisions] = useState<{ title: string; context: string; deadline: string }[]>([]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsRes, tasksRes, signalsRes] = await Promise.all([
          supabase.from('projects').select('id, title, status, priority_score').order('priority_score', { ascending: false }).limit(3),
          supabase.from('tasks').select('id, title, description, priority, status, created_at').order('created_at', { ascending: false }).limit(5),
          supabase.from('operational_signals').select('*').order('created_at', { ascending: false }).limit(3)
        ]);

        if (projectsRes.error) throw projectsRes.error;
        if (tasksRes.error) throw tasksRes.error;

        setProjects(projectsRes.data || []);
        setTasks(tasksRes.data || []);
        
        if (signalsRes.data) {
          setAlerts(signalsRes.data.map(s => ({
            type: s.priority_score > 0.8 ? 'Critical' : 'Warning',
            msg: s.signal_type.replace(/_/g, ' ') + ': ' + (s.context_data?.userInput || 'System Alert'),
            time: new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          })));
        }

        // For demo purposes, we'll use tasks with 'critical' priority as decisions
        const decisionTasks = (tasksRes.data || []).filter(t => t.priority === 'critical');
        setDecisions(decisionTasks.map(t => ({
          title: t.title,
          context: t.description,
          deadline: 'Today'
        })));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAction = async (actionName: string, payload: any = {}) => {
    try {
      setAiLoading(true);
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
      setAiLoading(false);
    }
  };
  
  const handleRunSimulation = async () => {
    setAiLoading(true);
    setIsModalOpen(true);
    try {
      const context = `
        Active Projects: ${projects.map(p => p.title).join(', ')}
        Pending Tasks: ${tasks.map(t => t.title).join(', ')}
      `;
      
      const r = await handleAction('run_simulation', { 
        mode: 'simulation',
        context 
      });

      setAiResult(r.text || r.message || 'Simulation completed successfully.');
    } catch (error) {
      console.error('Simulation error:', error);
      setAiResult('Error running simulation.');
    } finally {
      setAiLoading(false);
    }
  };
  
  return (
    <div className="p-6 space-y-8 bg-white min-h-screen text-slate-900">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
            Executive Command Center
          </h1>
          <p className="text-slate-500 font-mono text-xs mt-1">
            SYSTEM_STATUS: <span className="text-emerald-600 font-bold">OPTIMAL</span> | MODE: {mode.toUpperCase()}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-right">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Org Health Score</div>
            <div className="text-3xl font-black text-emerald-600">94.2</div>
          </div>
        </div>
      </div>

      {/* Virtual Issues Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900">Virtual Issues</h3>
          <button 
            onClick={() => handleAction('view_issue_queue')}
            disabled={actionLoading}
            className="text-cyan-600 text-sm font-medium hover:underline bg-transparent p-0 border-none shadow-none disabled:opacity-50"
          >
            View Queue
          </button>
        </div>
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mb-2" />
              <p className="text-xs font-bold uppercase tracking-widest">Loading Issues...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p className="text-xs font-bold uppercase tracking-widest">No active issues</p>
            </div>
          ) : tasks.map((ticket) => (
            <div 
              key={ticket.id} 
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors group cursor-pointer"
              onClick={() => handleAction('view_issue_detail', { id: ticket.id })}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border",
                    ticket.priority === 'critical' ? "bg-red-50 text-red-600 border-red-100" : 
                    ticket.priority === 'high' ? "bg-orange-50 text-orange-600 border-orange-100" :
                    "bg-blue-50 text-blue-600 border-blue-100"
                  )}>
                    {ticket.priority}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">TSK-{ticket.id.substring(0, 4)}</span>
                </div>
                <span className="text-xs text-slate-400">{new Date(ticket.created_at).toLocaleDateString()}</span>
              </div>
              <h4 className="font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">{ticket.title}</h4>
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">{ticket.description}</p>
              <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-cyan-50 text-cyan-700 text-[10px] font-bold rounded uppercase">
                    {ticket.status}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-cyan-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Row: Strategic Initiatives & Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strategic Initiatives */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-600">
              <Target className="w-4 h-4 text-blue-600" />
              Strategic Initiatives
            </h2>
            <button 
              onClick={() => handleAction('view_all_initiatives')}
              disabled={actionLoading}
              className="text-[10px] text-blue-600 hover:underline flex items-center gap-1 uppercase font-bold bg-transparent p-0 border-none shadow-none disabled:opacity-50"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest">Loading Initiatives...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p className="text-xs font-bold uppercase tracking-widest">No active initiatives</p>
              </div>
            ) : projects.map((item) => (
              <div key={item.id} className="group p-4 bg-white border border-slate-100 rounded-lg hover:border-blue-500/50 transition-all cursor-pointer hover:shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900">{item.title}</h3>
                    <div className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-tighter">SCORE: {item.priority_score}</div>
                  </div>
                  <span className={cn(
                    "text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter",
                    item.status === 'in-progress' ? "bg-emerald-50 text-emerald-700" : 
                    item.status === 'blocked' ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"
                  )}>
                    {item.status}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>PRIORITY</span>
                    <span>{item.priority_score}/100</span>
                  </div>
                  <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(item.priority_score, 5)}%` }}
                      className={cn(
                        "h-full rounded-full",
                        item.status === 'in-progress' ? "bg-emerald-500" : 
                        item.status === 'blocked' ? "bg-red-500" : "bg-blue-500"
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Alerts */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-600">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              Operational Alerts
            </h2>
          </div>
          <div className="p-4 space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-4 text-slate-400">
                <p className="text-[10px] font-bold uppercase tracking-widest">No active alerts</p>
              </div>
            ) : alerts.map((alert, i) => (
              <div key={i} className={cn(
                "p-3 border-l-2 rounded-r-lg space-y-1",
                alert.type === 'Critical' ? "bg-red-50 border-red-500" : "bg-orange-50 border-orange-500"
              )}>
                <div className="flex justify-between items-center">
                  <span className={cn(
                    "text-[9px] font-black uppercase tracking-widest",
                    alert.type === 'Critical' ? "text-red-600" : "text-orange-600"
                  )}>{alert.type}</span>
                  <span className="text-[9px] text-slate-400 font-mono">{alert.time}</span>
                </div>
                <p className="text-xs text-slate-700 leading-tight font-medium">{alert.msg}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Key Decisions & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Decisions Queue */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-600">
              <Zap className="w-4 h-4 text-amber-600" />
              Decision Queue
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {decisions.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p className="text-xs font-bold uppercase tracking-widest">No pending decisions</p>
              </div>
            ) : decisions.map((decision, i) => (
              <div key={i} className="p-4 bg-white border border-slate-100 rounded-lg flex gap-4 hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{decision.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-3">{decision.context}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAction('approve_budget')}
                      disabled={actionLoading}
                      className="px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold uppercase rounded hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleAction('review_budget')}
                      disabled={actionLoading}
                      className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded hover:bg-slate-200 transition-colors disabled:opacity-50"
                    >
                      Review
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-slate-400 uppercase font-bold mb-1">Deadline</div>
                  <div className="text-xs font-mono text-amber-600 font-bold">{decision.deadline}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intelligence Panel */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden relative group shadow-sm">
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-600">
              <Activity className="w-4 h-4 text-purple-600" />
              Intelligence Feed
            </h2>
          </div>
          <div className="p-6 flex flex-col items-center justify-center text-center space-y-4 min-h-[200px]">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1 uppercase tracking-widest">Predictive Insight Detected</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Based on current execution velocity, "Market Expansion Q3" has a 78% probability of hitting milestones 2 weeks early.
              </p>
            </div>
            <button 
              onClick={handleRunSimulation}
              disabled={aiLoading || actionLoading}
              className="text-[10px] font-black text-blue-600 uppercase tracking-widest border border-blue-200 px-4 py-2 rounded-full hover:bg-blue-50 transition-all disabled:opacity-50"
            >
              {aiLoading || actionLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Run Simulation"}
            </button>
          </div>
        </div>
      </div>
      
      <AIResultModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Predictive Simulation Results"
        content={aiResult}
        loading={aiLoading}
      />
    </div>
  );
}
