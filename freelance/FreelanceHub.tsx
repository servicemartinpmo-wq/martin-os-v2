import React, { useEffect, useState } from 'react';
import { 
  Kanban, 
  UserPlus, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Mail,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Loader2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

export default function FreelanceHub() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
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
      return data;
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'An error occurred');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [metricsRes, projectsRes, bookingsRes] = await Promise.all([
        supabase.from('business_metrics').select('*').eq('category', 'freelance'),
        supabase.from('projects').select('*').order('priority_score', { ascending: false }),
        supabase.from('bookings').select('*').order('created_at', { ascending: true })
      ]);

      setMetrics(metricsRes.data || []);
      setProjects(projectsRes.data || []);
      setBookings(bookingsRes.data || []);
    } catch (err) {
      console.error('Error fetching freelance data:', err);
      toast.error('Failed to load freelance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'DollarSign': return DollarSign;
      case 'UserPlus': return UserPlus;
      case 'TrendingUp': return TrendingUp;
      case 'Mail': return Mail;
      default: return Kanban;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-slate-400 mb-4" />
        <p className="text-slate-500 font-medium tracking-tight">Synchronizing Freelance Command...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Freelance Command</h2>
          <p className="text-slate-500 font-medium">CRM • Marketing • Operations</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleAction('new_lead')}
            disabled={actionLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            New Lead
          </button>
          <button 
            onClick={() => handleAction('create_project')}
            disabled={actionLoading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </header>

      {/* CRM & Marketing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {metrics.map((stat) => {
          const Icon = getIcon(stat.icon);
          return (
            <div 
              key={stat.id} 
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm cursor-pointer hover:border-blue-200 transition-all"
              onClick={() => handleAction('view_metric_detail', { id: stat.id })}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                  <Icon className="w-5 h-5" />
                </div>
                <span className={cn(
                  "text-[10px] font-bold px-2 py-1 rounded-full",
                  stat.is_positive ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                )}>{stat.trend}</span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Kanban & CRM Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kanban Board (Simplified) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Kanban className="w-5 h-5 text-slate-400" />
              Active Projects
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['planned', 'in-progress', 'completed'].map((status) => (
              <div key={status} className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{status}</span>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                    {projects.filter(p => p.status === status).length}
                  </span>
                </div>
                <div className="bg-slate-50/50 p-2 rounded-2xl border border-dashed border-slate-200 min-h-[400px] space-y-3">
                  {projects.filter(p => p.status === status).map((project) => (
                    <div 
                      key={project.id} 
                      className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                      onClick={() => handleAction('view_project_detail', { id: project.id })}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-tighter">
                          {project.strategic_alignment || 'Standard'}
                        </span>
                        <button 
                          className="text-slate-400 hover:text-slate-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction('project_options', { id: project.id });
                          }}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">{project.title}</h4>
                      <p className="text-[10px] text-slate-500 line-clamp-2 mb-4">{project.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-1">
                          <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">
                          {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CRM & Appointments */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              Upcoming Bookings
            </h3>
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className="flex items-center gap-4 group cursor-pointer"
                  onClick={() => handleAction('view_booking_detail', { id: booking.id })}
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xs">
                    {booking.booking_time.split(':')[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{booking.client_name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{booking.booking_type} • {booking.booking_time}</p>
                  </div>
                </div>
              ))}
              {bookings.length === 0 && <p className="text-xs text-slate-400 italic">No upcoming bookings.</p>}
            </div>
            <button 
              onClick={() => handleAction('view_calendar')}
              disabled={actionLoading}
              className="w-full mt-8 py-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors border border-slate-100 disabled:opacity-50"
            >
              View Calendar
            </button>
          </div>

          <div 
            className="bg-slate-900 rounded-[2rem] p-8 text-white cursor-pointer hover:bg-slate-800 transition-all"
            onClick={() => handleAction('view_marketing_insights')}
          >
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Marketing Insights
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Your Martin Connect campaign is driving 40% more traffic than last month. Consider increasing budget for "Product Design" keywords.
            </p>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Top Channel</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">Martin Connect Ads</span>
                <span className="text-xs text-cyan-400 font-bold">+24%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
