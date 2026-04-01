import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'motion/react';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Flag, 
  Layers, 
  MoreHorizontal, 
  Plus, 
  Search, 
  TrendingUp, 
  Users,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { AppMode } from '../../types';
import { Project } from '../../types';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

interface InitiativeDashboardProps {
  mode: AppMode;
}

export default function InitiativeDashboard({ mode }: InitiativeDashboardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
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
      fetchProjects();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'An error occurred');
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    if (!supabase) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeProjects = projects.filter(p => p.status === 'in-progress' || p.status === 'planned').length;
  const atRiskProjects = projects.filter(p => p.status === 'blocked').length;

  return (
    <div className="p-6 space-y-8 bg-white min-h-screen text-slate-900">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
            Initiative Dashboard
          </h1>
          <p className="text-slate-500 font-mono text-xs mt-1 uppercase tracking-widest">
            Portfolio View | {mode.toUpperCase()}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="SEARCH INITIATIVES..." 
              className="bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-500 transition-all w-64 text-slate-900"
            />
          </div>
          <button 
            onClick={() => handleAction('create_project', { userId: 'system-user' })}
            disabled={actionLoading}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm disabled:opacity-50"
          >
            New Initiative
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Projects', value: activeProjects.toString(), icon: Layers, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Projects', value: projects.length.toString(), icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'At Risk', value: atRiskProjects.toString(), icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Upcoming Milestones', value: '0', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-4 shadow-sm">
            <div className={cn("p-3 rounded-lg", stat.bg, stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">{stat.label}</div>
              <div className="text-2xl font-black text-slate-900">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Initiative List */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-600">Active Portfolio</h2>
          <div className="flex gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <span className="text-blue-600 cursor-pointer">All</span>
            <span className="hover:text-slate-900 cursor-pointer transition-colors">Strategic</span>
            <span className="hover:text-slate-900 cursor-pointer transition-colors">Operational</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50/30">
                <th className="p-4">Initiative</th>
                <th className="p-4">Status</th>
                <th className="p-4">Type</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Dependencies</th>
                <th className="p-4">Created</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    <p className="text-xs font-bold uppercase tracking-widest">Loading Portfolio...</p>
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    <Layers className="w-8 h-8 mx-auto mb-3 opacity-20" />
                    <p className="text-xs font-bold uppercase tracking-widest">No initiatives found</p>
                    <p className="text-[10px] mt-1">Click "New Initiative" to create one.</p>
                  </td>
                </tr>
              ) : projects.map((item) => (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors group cursor-pointer">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-tighter">ID: {item.id.split('-')[0]}</div>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest",
                      item.status === 'in-progress' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : 
                      item.status === 'blocked' ? "bg-red-50 text-red-600 border border-red-100" : 
                      item.status === 'complete' ? "bg-slate-100 text-slate-600 border border-slate-200" :
                      "bg-blue-50 text-blue-600 border border-blue-100"
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">
                      {item.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden w-24">
                        <div 
                          className={cn("h-full rounded-full", item.priority_score > 70 ? "bg-red-500" : item.priority_score > 40 ? "bg-amber-500" : "bg-blue-500")} 
                          style={{ width: `${Math.max(item.priority_score, 10)}%` }} 
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{item.priority_score}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">
                      {item.dependencies?.length || 0}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleAction('project_options', { projectId: item.id })}
                      disabled={actionLoading}
                      className="text-slate-400 hover:text-slate-900 transition-colors disabled:opacity-50"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
