import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Ticket, 
  Activity, 
  ShieldAlert, 
  Cpu, 
  Zap, 
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Clock,
  Server,
  Lock,
  Search,
  Plus,
  BarChart3,
  Globe,
  RefreshCw,
  HelpCircle,
  ClipboardList,
  Users,
  ShieldCheck,
  Shield,
  MessageSquare,
  Monitor,
  Send,
  Bot,
  Terminal,
  Wifi,
  Eye,
  Github,
  GitCommit,
  Database
} from 'lucide-react';
import StackAppMaker from './StackAppMaker';
import { connectors } from '../../data/mockData';
import { cn } from '../../lib/utils';
import { AppMode } from '../../types';
import { supabase } from '../../lib/supabase';
import { fetchWithLogging, apiFetch } from '../../lib/api';
import { toast } from 'sonner';

interface TechDashboardProps {
  mode: AppMode;
}

export default function TechDashboard({ mode }: TechDashboardProps) {
  const isAssisted = mode === 'Assisted';
  const [aiPrompt, setAiPrompt] = React.useState('');
  const [aiResponse, setAiResponse] = React.useState<string | null>(null);
  const [aiTier, setAiTier] = React.useState(5);
  const [chatHistory, setChatHistory] = React.useState<{ role: 'user' | 'agent'; content: string }[]>([]);
  const [logs, setLogs] = React.useState<string[]>([
    'System initialization complete.',
    'Monitoring all nodes...',
    'Security protocols active.'
  ]);
  const [githubRepos, setGithubRepos] = React.useState<any[]>([]);
  const [githubLoading, setGithubLoading] = React.useState(true);
  const [githubError, setGithubError] = React.useState<string | null>(null);

  const [tasks, setTasks] = React.useState<any[]>([]);
  const [tasksLoading, setTasksLoading] = React.useState(true);
  const [connectorsState, setConnectorsState] = React.useState<any[]>([]);
  const [connectorsLoading, setConnectorsLoading] = React.useState(true);

  const [metrics, setMetrics] = React.useState<any[]>([]);
  const [metricsLoading, setMetricsLoading] = React.useState(true);
  const [supabaseStatus, setSupabaseStatus] = React.useState<'checking' | 'connected' | 'error'>('checking');
  const [supabaseLatency, setSupabaseLatency] = React.useState<number | null>(null);
  const [actionLoading, setActionLoading] = React.useState(false);

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

  React.useEffect(() => {
    const checkSupabase = async () => {
      if (!supabase) {
        setSupabaseStatus('error');
        return;
      }
      try {
        const start = performance.now();
        const { error } = await supabase.auth.getSession();
        const end = performance.now();
        if (error) throw error;
        setSupabaseLatency(Math.round(end - start));
        setSupabaseStatus('connected');
      } catch (err) {
        setSupabaseStatus('error');
      }
    };
    checkSupabase();
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      if (!supabase || supabaseStatus !== 'connected') {
        if (supabaseStatus === 'error') {
            setTasksLoading(false);
            setConnectorsLoading(false);
            setMetricsLoading(false);
        }
        return;
      }
      try {
        const [tasksRes, connectorsRes, metricsRes] = await Promise.all([
            supabase.from('tasks').select('*').order('created_at', { ascending: false }).limit(10),
            supabase.from('connectors').select('*'),
            supabase.from('business_metrics').select('*').eq('category', 'tech')
        ]);
        
        if (tasksRes.error) throw tasksRes.error;
        if (connectorsRes.error) throw connectorsRes.error;
        if (metricsRes.error) throw metricsRes.error;
        
        setTasks(tasksRes.data || []);
        setConnectorsState(connectorsRes.data || []);
        setMetrics(metricsRes.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setTasksLoading(false);
        setConnectorsLoading(false);
        setMetricsLoading(false);
      }
    };
    fetchData();
  }, [supabaseStatus]);

  React.useEffect(() => {
    const fetchGithubRepos = async () => {
      try {
        const data = await apiFetch('/api/github/repos');
        setGithubRepos(data);
      } catch (err: any) {
        setGithubError(err.message);
      } finally {
        setGithubLoading(false);
      }
    };
    fetchGithubRepos();
  }, []);

  React.useEffect(() => {
    if (!supabase || supabaseStatus !== 'connected') return;

    // Fetch initial logs
    const fetchLogs = async () => {
      try {
        const { data, error } = await supabase
          .from('execution_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (error) throw error;
        if (data && data.length > 0) {
          setLogs(data.map(log => `[${log.tool || 'System'}] ${log.action_type}: ${JSON.stringify(log.metadata)}`));
        }
      } catch (err) {
        console.error('Error fetching logs:', err);
      }
    };

    fetchLogs();

    // Subscribe to new logs
    const channel = supabase
      .channel('public:execution_logs')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'execution_logs' },
        (payload) => {
          const newLog = payload.new;
          const logString = `[${newLog.tool || 'System'}] ${newLog.action_type}: ${JSON.stringify(newLog.metadata)}`;
          setLogs(prev => [logString, ...prev].slice(0, 10));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabaseStatus]);

  const handleAiPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    
    const userMsg = aiPrompt;
    setAiPrompt('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    
    try {
      const response = await apiFetch('/api/actions/execute', {
        method: 'POST',
        body: JSON.stringify({
          actionId: 'chat_message',
          payload: {
            message: userMsg,
            context: { mode, page: 'TechDashboard' }
          }
        })
      });
      
      setChatHistory(prev => [...prev, { role: 'agent', content: response.message || response.result || "Action executed successfully." }]);
    } catch (err) {
      console.error('AI Chat Error:', err);
      setChatHistory(prev => [...prev, { role: 'agent', content: "Sorry, I encountered an error processing your request." }]);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'Founder/SMB': return 'Infrastructure ROI';
      case 'Executive': return 'Org Uptime & Governance';
      case 'Startup/Project': return 'DevOps Command';
      case 'Healthcare': return 'HIPAA Systems Monitor';
      case 'Assisted': return 'System Support';
      default: return 'Tech-Ops Command';
    }
  };

  const getSubTitle = () => {
    switch (mode) {
      case 'Founder/SMB': return 'Autonomous application management and AI-led Tier 1-5 support.';
      case 'Executive': return 'High-level system governance and AI-driven operational oversight.';
      case 'Startup/Project': return 'AI-managed CI/CD pipelines and automated infrastructure scaling.';
      case 'Healthcare': return 'Secure, AI-monitored patient data infrastructure and automated compliance.';
      case 'Assisted': return 'Simple system status with AI-led autonomous problem solving.';
      default: return 'AI-led autonomous diagnostic pipeline and system health monitoring.';
    }
  };

  // Mode-specific stats
  const getStats = () => {
    if (metricsLoading) return [];
    
    const iconMap: Record<string, any> = {
      DollarSign, Zap, Activity, ShieldAlert, Globe, AlertTriangle, Lock, ClipboardList, Users, Ticket
    };

    const filteredMetrics = metrics.filter(m => {
      if (mode === 'Founder/SMB') return ['Monthly Tech Spend', 'Resource Efficiency', 'System Uptime', 'Security Alerts'].includes(m.label);
      if (mode === 'Executive') return ['Global Uptime', 'Compliance Score', 'Team Velocity', 'Active Incidents'].includes(m.label);
      if (mode === 'Healthcare') return ['HIPAA Compliance', 'Audit Logs', 'Patient Data Encrypted', 'Access Requests'].includes(m.label);
      if (mode === 'Assisted') return ['Everything OK?', 'Help Needed'].includes(m.label);
      return ['Active Tasks', 'System Uptime', 'Security Score', 'Auto-Resolved'].includes(m.label);
    });

    return filteredMetrics.map(m => ({
      label: m.label,
      value: m.value,
      icon: iconMap[m.icon] || Activity,
      color: m.label.includes('Alert') || m.label.includes('Incident') ? 'text-red-600' : 'text-blue-600'
    }));
  };

  const renderFounderLayout = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            Cost Optimization
          </h3>
          <div className="space-y-6">
            <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
              <p className="text-sm font-bold text-green-800 uppercase tracking-wider mb-1">Potential Savings</p>
              <p className="text-2xl font-bold text-green-900">$1,200 / month</p>
              <p className="text-xs text-green-700 mt-2">By consolidating unused AWS instances and optimizing S3 storage.</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Cloud Infrastructure</span>
                <span className="text-sm font-bold text-slate-900">$2,400</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full w-[60%]" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">SaaS Subscriptions</span>
                <span className="text-sm font-bold text-slate-900">$1,850</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full w-[40%]" />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Operational Stability
          </h3>
          <div className="space-y-4">
            {connectorsLoading ? (
              <div className="p-4 text-center text-slate-500">Loading connectors...</div>
            ) : connectors.length === 0 ? (
              <div className="p-4 text-center text-slate-500">No connectors found.</div>
            ) : connectors.map(conn => (
              <div key={conn.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={cn("w-2 h-2 rounded-full", conn.status === 'Healthy' ? 'bg-green-500' : 'bg-red-500')} />
                  <span className="text-sm font-bold text-slate-900">{conn.name}</span>
                </div>
                <span className="text-xs text-slate-400">Last checked {new Date(conn.lastChecked).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900">Virtual Issues</h3>
          <button 
            onClick={() => handleAction('view_queue')}
            disabled={actionLoading}
            className="text-cyan-600 text-sm font-medium hover:underline disabled:opacity-50"
          >
            View Queue
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasksLoading ? (
            <div className="col-span-2 p-8 text-center text-slate-500">Loading tasks from Supabase...</div>
          ) : tasks.length === 0 ? (
            <div className="col-span-2 p-8 text-center text-slate-500">No active tasks found.</div>
          ) : tasks.slice(0, 4).map((task) => (
            <div key={task.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors group cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border",
                    task.priority === 'critical' ? "bg-red-50 text-red-600 border-red-100" : 
                    task.priority === 'high' ? "bg-orange-50 text-orange-600 border-orange-100" :
                    "bg-blue-50 text-blue-600 border-blue-100"
                  )}>
                    {task.priority || 'medium'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium truncate w-24">{task.id.split('-')[0]}</span>
                </div>
                <span className="text-xs text-slate-400">{new Date(task.created_at).toLocaleDateString()}</span>
              </div>
              <h4 className="font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">{task.title}</h4>
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">{task.description}</p>
              <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="flex gap-2">
                  {task.system_context && (
                    <span className="px-2 py-1 bg-cyan-50 text-cyan-700 text-[10px] font-bold rounded uppercase">
                      {task.system_context}
                    </span>
                  )}
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">
                    {task.status}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-cyan-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderExecutiveLayout = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-slate-900">Global System Health</h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase tracking-widest border border-green-100">All Systems Nominal</span>
            </div>
          </div>
          <div className="h-64 flex items-end gap-4">
            {[40, 70, 45, 90, 65, 80, 95, 85, 90, 100, 98, 99].map((h, i) => (
              <div key={i} className="flex-1 bg-slate-100 rounded-t-lg relative group">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-cyan-500 rounded-t-lg transition-all duration-500 group-hover:bg-cyan-400" 
                  style={{ height: `${h}%` }} 
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>Jan</span>
            <span>Mar</span>
            <span>Jun</span>
            <span>Sep</span>
            <span>Dec</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-slate-900 shadow-sm">
          <h3 className="text-xl font-bold mb-6 text-slate-900">Compliance Audit</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                <ShieldCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">SOC2 Type II</p>
                <p className="text-xs text-slate-500">Valid until Dec 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                <ShieldCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">GDPR Compliance</p>
                <p className="text-xs text-slate-500">Verified Q1 2026</p>
              </div>
            </div>
            <div className="pt-6 border-t border-slate-100">
              <p className="text-xs text-slate-500 mb-4">Next internal audit scheduled for next week.</p>
              <button 
                onClick={() => handleAction('download_report')}
                disabled={actionLoading}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
              >
                Download Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHealthcareLayout = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Security & HIPAA Logs</h3>
          <div className="space-y-4">
            {[
              { time: '10:42 AM', user: 'Dr. Smith', action: 'Accessed Patient Record #4421', status: 'Authorized' },
              { time: '09:15 AM', user: 'System', action: 'Automated Backup Completed', status: 'Success' },
              { time: '08:30 AM', user: 'Nurse Joy', action: 'Updated Medication Schedule', status: 'Authorized' },
              { time: '07:00 AM', user: 'Admin', action: 'System Security Patch Applied', status: 'Success' },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-400 tabular-nums">{log.time}</span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{log.action}</p>
                    <p className="text-xs text-slate-500">{log.user}</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded uppercase tracking-widest border border-green-100">
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-red-50 border border-red-100 rounded-3xl p-8 shadow-sm">
        <h3 className="text-xl font-bold text-red-900 mb-6 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" />
          Compliance Checklist
        </h3>
        <div className="space-y-4">
          {[
            { label: 'Data Encryption at Rest', status: true },
            { label: 'Multi-Factor Auth', status: true },
            { label: 'Audit Trail Enabled', status: true },
            { label: 'BIA Completed', status: false },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center",
                item.status ? "bg-green-500 text-white" : "bg-red-200 text-red-600"
              )}>
                {item.status ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
              </div>
              <span className={cn("text-sm font-medium", item.status ? "text-slate-700" : "text-red-700 font-bold")}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
        {!isAssisted && (
          <button 
            onClick={() => handleAction('run_full_audit')}
            disabled={actionLoading}
            className="w-full mt-8 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            Run Full Audit
          </button>
        )}
      </div>
    </div>
  );

  const renderAssistedLayout = () => (
    <div className="space-y-12 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white border-4 border-slate-200 rounded-[3rem] p-12 shadow-xl">
          <h3 className="text-4xl font-black text-slate-900 mb-8">How is the system?</h3>
          <div className="flex items-center gap-6 p-8 bg-green-50 rounded-[2rem] border-4 border-green-200">
            <CheckCircle2 className="w-16 h-16 text-green-600" />
            <div>
              <p className="text-3xl font-bold text-green-900">Everything is working great!</p>
              <p className="text-xl text-green-700 mt-2">No problems found in your tech today.</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8">
          <button 
            onClick={() => handleAction('need_help')}
            disabled={actionLoading}
            className="p-12 bg-blue-600 text-white rounded-[3rem] shadow-xl hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <HelpCircle className="w-16 h-16 mb-4 mx-auto" />
            <p className="text-2xl font-black">I Need Help</p>
          </button>
          <button 
            onClick={() => handleAction('refresh_system')}
            disabled={actionLoading}
            className="p-12 bg-slate-900 text-white rounded-[3rem] shadow-xl hover:bg-slate-800 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className="w-16 h-16 mb-4 mx-auto" />
            <p className="text-2xl font-black">Refresh System</p>
          </button>
        </div>
      </div>
    </div>
  );

  const renderStartupLayout = () => (
    <div className="space-y-8">
      {/* Stack App Maker - Replit Style */}
      <section className="col-span-full">
        <StackAppMaker mode={mode} />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Sprint Progress', value: '68%', color: 'text-blue-600' },
          { label: 'Open PRs', value: '12', color: 'text-purple-600' },
          { label: 'Build Status', value: 'Passing', color: 'text-green-600' },
          { label: 'Technical Debt', value: 'Low', color: 'text-slate-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={cn("text-xl font-bold", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            CI/CD Pipeline
          </h3>
          <div className="space-y-4">
            {[
              { name: 'Production Deploy', status: 'Success', time: '10m ago' },
              { name: 'Staging Build', status: 'Running', time: '2m ago' },
              { name: 'Unit Tests', status: 'Success', time: '1h ago' },
            ].map((job, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    job.status === 'Success' ? "bg-green-500" : "bg-blue-500 animate-pulse"
                  )}></div>
                  <span className="text-sm font-bold text-slate-700">{job.name}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{job.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-500" />
              Supabase Backend
            </h3>
            <button 
              onClick={() => handleAction('simulate_agent')}
              disabled={actionLoading}
              className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full uppercase tracking-widest hover:bg-indigo-100 transition-colors border border-indigo-100 flex items-center gap-1 disabled:opacity-50"
            >
              <Bot className="w-3 h-3" />
              Simulate Agent
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  supabaseStatus === 'connected' ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" :
                  supabaseStatus === 'checking' ? "bg-amber-500 animate-pulse" : "bg-red-500"
                )} />
                <div>
                  <p className="text-sm font-bold text-slate-900">Connection Status</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    {supabaseStatus === 'connected' ? 'Online & Authenticated' : 
                     supabaseStatus === 'checking' ? 'Connecting...' : 'Offline / Missing Keys'}
                  </p>
                </div>
              </div>
              {supabaseLatency && (
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-700">{supabaseLatency}ms</p>
                  <p className="text-[10px] text-slate-400">Latency</p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Auth Service</p>
                <p className={cn("text-sm font-bold", supabaseStatus === 'connected' ? "text-emerald-600" : "text-slate-400")}>
                  {supabaseStatus === 'connected' ? 'Active' : 'Unavailable'}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Database</p>
                <p className={cn("text-sm font-bold", supabaseStatus === 'connected' ? "text-emerald-600" : "text-slate-400")}>
                  {supabaseStatus === 'connected' ? 'Connected' : 'Unavailable'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Github className="w-5 h-5 text-slate-900" />
            GitHub Integration
          </h3>
          <div className="space-y-4">
            {githubLoading ? (
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ) : githubError ? (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">
                <p className="font-bold mb-1">Integration Error</p>
                <p>{githubError}</p>
                <p className="mt-2 text-xs">Ensure GITHUB_TOKEN is set in your AI Studio Secrets.</p>
              </div>
            ) : githubRepos.length === 0 ? (
              <p className="text-sm text-slate-500">No repositories found.</p>
            ) : (
              githubRepos.slice(0, 3).map((repo) => (
                <div key={repo.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <GitCommit className="w-4 h-4 text-slate-500" />
                    <a href={repo.html_url} target="_blank" rel="noreferrer" className="text-sm font-bold text-slate-700 hover:text-cyan-600 transition-colors">
                      {repo.name}
                    </a>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{repo.stargazers_count} ★</span>
                </div>
              ))
            )}
          </div>
          <button 
            onClick={() => handleAction('sync_github_repos')}
            disabled={actionLoading}
            className="w-full mt-6 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors text-xs flex items-center justify-center gap-2 disabled:opacity-50"
          >
            Sync
          </button>
        </div>
      </div>
    </div>
  );

  const renderDefaultLayout = () => (
    <div className="space-y-8">
      {/* Stack App Maker - Replit Style */}
      <section className="col-span-full">
        <StackAppMaker mode={mode} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl h-[300px] flex flex-col">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-500" />
              Autonomous System Logs
            </h3>
            <div className="flex-1 font-mono text-[10px] space-y-1 overflow-hidden opacity-80">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-cyan-500">[{new Date().toLocaleTimeString()}]</span>
                  <span className="text-slate-300">{log}</span>
                </div>
              ))}
              <div className="animate-pulse text-cyan-500">_</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 mb-6 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              Security Posture
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Firewall', status: 'Active', color: 'text-emerald-500' },
                { label: 'Intrusion Detection', status: 'Monitoring', color: 'text-blue-500' },
                { label: 'Endpoint Protection', status: 'Secure', color: 'text-emerald-500' },
                { label: 'Cloud Governance', status: 'Compliant', color: 'text-purple-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{item.label}</span>
                  <span className={cn("text-[10px] font-black uppercase tracking-widest", item.color)}>{item.status}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => handleAction('view_security_audit')}
              disabled={actionLoading}
              className="w-full mt-6 py-3 border-2 border-slate-900 text-slate-900 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-slate-900 hover:text-white transition-all disabled:opacity-50"
            >
              View Security Audit
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-500" />
              Supabase Backend
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    supabaseStatus === 'connected' ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" :
                    supabaseStatus === 'checking' ? "bg-amber-500 animate-pulse" : "bg-red-500"
                  )} />
                  <div>
                    <p className="text-sm font-bold text-slate-900">Connection Status</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                      {supabaseStatus === 'connected' ? 'Online & Authenticated' : 
                       supabaseStatus === 'checking' ? 'Connecting...' : 'Offline / Missing Keys'}
                    </p>
                  </div>
                </div>
                {supabaseLatency && (
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-700">{supabaseLatency}ms</p>
                    <p className="text-[10px] text-slate-400">Latency</p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Auth Service</p>
                  <p className={cn("text-sm font-bold", supabaseStatus === 'connected' ? "text-emerald-600" : "text-slate-400")}>
                    {supabaseStatus === 'connected' ? 'Active' : 'Unavailable'}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Database</p>
                  <p className={cn("text-sm font-bold", supabaseStatus === 'connected' ? "text-emerald-600" : "text-slate-400")}>
                    {supabaseStatus === 'connected' ? 'Connected' : 'Unavailable'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Github className="w-5 h-5" />
              GitHub Integration
            </h3>
            <div className="space-y-4">
              {githubLoading ? (
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded"></div>
                      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              ) : githubError ? (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">
                  <p className="font-bold mb-1">Integration Error</p>
                  <p>{githubError}</p>
                  <p className="mt-2 text-xs">Ensure GITHUB_TOKEN is set in your AI Studio Secrets.</p>
                </div>
              ) : githubRepos.length === 0 ? (
                <p className="text-sm text-slate-500">No repositories found.</p>
              ) : (
                githubRepos.map((repo) => (
                  <div key={repo.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <GitCommit className="w-4 h-4 text-slate-600" />
                      </div>
                      <div>
                        <a href={repo.html_url} target="_blank" rel="noreferrer" className="text-sm font-bold text-slate-900 hover:text-cyan-600 transition-colors">
                          {repo.name}
                        </a>
                        <p className="text-[10px] text-slate-400 font-bold tracking-tighter">
                          {repo.private ? 'Private' : 'Public'} • {repo.language || 'Unknown'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-700">{repo.stargazers_count} ★</p>
                      <p className="text-[10px] text-slate-400">Updated {new Date(repo.updated_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button 
              onClick={() => { setGithubLoading(true); apiFetch('/api/github/repos').then(setGithubRepos).catch(e => setGithubError(e.message)).finally(() => setGithubLoading(false)); }}
              className="w-full mt-6 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Sync Repositories
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLayout = () => {
    switch (mode) {
      case 'Founder/SMB': return renderFounderLayout();
      case 'Executive': return renderExecutiveLayout();
      case 'Healthcare': return renderHealthcareLayout();
      case 'Assisted': return renderAssistedLayout();
      case 'Startup/Project': return renderStartupLayout();
      default: return renderDefaultLayout();
    }
  };

  return (
    <div className={cn(
      "p-8 space-y-8 max-w-7xl mx-auto transition-all duration-500",
      isAssisted && "p-12 space-y-12"
    )}>
      <header className="flex justify-between items-end">
        <div>
          <h2 className={cn(
            "font-bold text-slate-900 tracking-tight",
            isAssisted ? "text-6xl" : "text-3xl"
          )}>{getTitle()}</h2>
          <p className={cn(
            "text-slate-500 mt-1",
            isAssisted ? "text-2xl mt-4" : "text-base"
          )}>{getSubTitle()}</p>
        </div>
      </header>

      {/* Command Center - AI-led Support & Background Execution */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Terminal className="w-32 h-32 text-cyan-500" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
              <Bot className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Command Center</h3>
              <p className="text-xs text-cyan-500 font-mono uppercase tracking-widest">AI-Led Autonomous Operations</p>
            </div>
          </div>

          <div className="bg-black/40 rounded-2xl border border-slate-800 p-6 mb-6 min-h-[200px] font-mono text-sm">
            {chatHistory.length === 0 ? (
              <div className="text-slate-500 italic">Ready for natural language commands... (e.g., "Optimize database performance", "Record cloud issue")</div>
            ) : (
              <div className="space-y-4">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={cn(
                    "flex gap-3",
                    msg.role === 'user' ? "text-cyan-400" : "text-slate-300"
                  )}>
                    <span className="opacity-50">[{msg.role === 'user' ? 'USER' : 'AI'}]</span>
                    <p>{msg.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleAiPrompt} className="relative">
            <input 
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Enter natural language command..."
              className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-6 pr-16 text-white focus:outline-none focus:border-cyan-500 transition-all font-mono text-sm"
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-cyan-500 text-slate-900 rounded-xl flex items-center justify-center hover:bg-cyan-400 transition-all shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-6 flex gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Background Execution Active</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700">
              <Wifi className="w-3 h-3 text-cyan-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cloud Recording Enabled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={cn(
        "grid gap-6",
        isAssisted ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-4"
      )}>
        {getStats().map((stat) => (
          <div key={stat.label} className={cn(
            "bg-white border border-slate-200 shadow-sm transition-all",
            isAssisted ? "rounded-[3rem] p-10 border-4" : "rounded-2xl p-6"
          )}>
            <div className={cn(
              "flex justify-between items-start",
              isAssisted ? "mb-6" : "mb-4"
            )}>
              <p className={cn(
                "font-bold text-slate-400 uppercase tracking-wider",
                isAssisted ? "text-xl" : "text-xs"
              )}>{stat.label}</p>
              <stat.icon className={cn(
                isAssisted ? "w-10 h-10" : "w-5 h-5",
                stat.color
              )} />
            </div>
            <p className={cn(
              "font-bold text-slate-900",
              isAssisted ? "text-5xl" : "text-3xl"
            )}>{stat.value}</p>
          </div>
        ))}
      </div>

      {renderLayout()}
    </div>
  );
}
