import React, { useEffect, useState } from 'react';
import { 
  Kanban, 
  ListTodo, 
  ShieldCheck, 
  BarChart3, 
  Users, 
  Clock,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  Plus,
  Loader2
} from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

export default function ProjectHub() {
  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [checklist, setChecklist] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Using backend API instead of direct Supabase calls
      const [projectsRes, checklistRes, remindersRes] = await Promise.all([
        apiFetch('/api/pmo/get_projects', { method: 'POST', body: JSON.stringify({}) }),
        apiFetch('/api/pmo/get_checklist_items', { method: 'POST', body: JSON.stringify({}) }),
        apiFetch('/api/pmo/get_reminders', { method: 'POST', body: JSON.stringify({}) })
      ]);

      setInitiatives(projectsRes.result || []);
      setChecklist(checklistRes.result || []);
      setReminders(remindersRes.result || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Failed to load project data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleChecklist = async (item: any) => {
    try {
      setLoading(true);
      const res = await fetch('/api/pmo/toggle_checklist_item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, currentStatus: item.is_completed }),
      });
      const data = await res.json();
      if (data.result) {
        setChecklist(prev => prev.map(i => i.id === item.id ? { ...i, is_completed: !item.is_completed } : i));
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update checklist');
    } finally {
      setLoading(false);
    }
  };

  const handleDismissReminder = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/pmo/dismiss_reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.result) {
        setReminders(prev => prev.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to dismiss reminder');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    try {
      setLoading(true);
      const payload = { title: 'New Strategic Initiative', type: 'Strategic', status: 'planned' };
      const res = await fetch('/api/pmo/create_project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.result) {
        setInitiatives([data.result, ...initiatives]);
        toast.success('Project created');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const handleGenericAction = async (actionName: string, payload: any = {}) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/pmo/${actionName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.result) {
        toast.success(`Action ${actionName} completed`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Project Command Center</h2>
          <p className="text-sm text-slate-500 font-medium">PMBOK Compliant • Real-time Oversight</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => handleGenericAction('filter_projects')}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Filter className="w-3 h-3" />
            Filter
          </button>
          <button 
            onClick={handleCreateProject}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            <Plus className="w-3 h-3" />
            New Initiative
          </button>
        </div>
      </header>

      {/* Compliance & Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:border-green-200 transition-all"
          onClick={() => handleGenericAction('view_compliance_report')}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-green-50 rounded-lg text-green-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Compliance Status</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">98.4%</p>
          <p className="text-[10px] text-slate-500 mt-0.5 font-medium">PMBOK v7 Alignment: <span className="text-green-600 font-bold">Elite</span></p>
        </div>
        <div 
          className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:border-blue-200 transition-all"
          onClick={() => handleGenericAction('view_velocity_metrics')}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Velocity</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">12.5</p>
          <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Tasks/Day • <span className="text-blue-600 font-bold">+15% vs Last Week</span></p>
        </div>
        <div 
          className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:border-red-200 transition-all"
          onClick={() => handleGenericAction('view_risk_assessment')}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-red-50 rounded-lg text-red-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Risk Exposure</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">Low</p>
          <p className="text-[10px] text-slate-500 mt-0.5 font-medium">3 Critical Dependencies Identified</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Initiatives (Jira/Asana feel) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Kanban className="w-5 h-5 text-slate-400" />
              Active Initiatives
            </h3>
            <div className="flex gap-2">
              <button 
                className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                onClick={() => handleGenericAction('toggle_view_mode', { mode: 'list' })}
              >
                <ListTodo className="w-4 h-4" />
              </button>
              <button 
                className="p-2 bg-slate-900 rounded-lg text-white"
                onClick={() => handleGenericAction('toggle_view_mode', { mode: 'kanban' })}
              >
                <Kanban className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-500 mb-4" />
                <p className="text-sm text-slate-500">Loading initiatives...</p>
              </div>
            ) : initiatives.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-slate-500">No initiatives found.</p>
              </div>
            ) : initiatives.map((initiative) => (
              <div 
                key={initiative.id} 
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                onClick={() => handleGenericAction('view_project_detail', { id: initiative.id })}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter",
                        initiative.type === 'Transformative' ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
                      )}>{initiative.type || 'Operational'}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[100px]" title={initiative.id}>#{initiative.id}</span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{initiative.title}</h4>
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                    initiative.status === 'On Track' ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"
                  )}>
                    {initiative.status || 'planned'}
                  </div>
                </div>
                
                <p className="text-sm text-slate-500 mb-6 line-clamp-2">{initiative.description || 'No description provided.'}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-bold text-slate-600 truncate w-24" title={initiative.owner_id}>{initiative.owner_id || 'Unassigned'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-bold text-slate-600">Impact: {initiative.strategic_alignment || 'Medium'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${initiative.priority_score || 0}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{initiative.priority_score || 0}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Reminders & Compliance */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              Compliance Checklist
            </h3>
            <div className="space-y-4">
              {checklist.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => handleToggleChecklist(item)}
                >
                  <div className={cn(
                    "w-5 h-5 rounded flex items-center justify-center border transition-colors",
                    item.is_completed ? "bg-cyan-500 border-cyan-500" : "border-slate-700 group-hover:border-slate-500"
                  )}>
                    {item.is_completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <span className={cn("text-sm font-medium transition-colors", item.is_completed ? "text-slate-300" : "text-slate-500 group-hover:text-slate-400")}>
                    {item.label}
                  </span>
                </div>
              ))}
              {checklist.length === 0 && <p className="text-xs text-slate-600 italic">No checklist items.</p>}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">System Reminders</h3>
            <div className="space-y-6">
              {reminders.map((reminder) => (
                <div 
                  key={reminder.id} 
                  className="flex items-start gap-4 group cursor-pointer"
                  onClick={() => handleDismissReminder(reminder.id)}
                >
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-2 transition-transform group-hover:scale-125",
                    reminder.type === 'urgent' ? "bg-red-500" : "bg-blue-500"
                  )} />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{reminder.title}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{reminder.time_label}</p>
                  </div>
                </div>
              ))}
              {reminders.length === 0 && <p className="text-xs text-slate-400 italic">No active reminders.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
