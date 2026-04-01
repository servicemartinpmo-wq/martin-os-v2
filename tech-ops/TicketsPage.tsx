import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  ArrowUpRight,
  ChevronDown,
  Clock,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  BarChart3,
  HelpCircle,
  Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';
import { AppMode } from '../../types';
import { toast } from 'sonner';

interface TicketsPageProps {
  mode: AppMode;
}

export default function TicketsPage({ mode }: TicketsPageProps) {
  const isAssisted = mode === 'Assisted';
  const [tickets, setTickets] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [sortField, setSortField] = useState<'created_at' | 'priority'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const priorityOrder: Record<string, number> = {
    'critical': 4,
    'high': 3,
    'medium': 2,
    'low': 1,
  };

  const sortedTickets = React.useMemo(() => {
    return [...tickets].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'created_at') {
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortField === 'priority') {
        comparison = (priorityOrder[a.priority || 'medium'] || 0) - (priorityOrder[b.priority || 'medium'] || 0);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [tickets, sortField, sortDirection]);

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
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [ticketsRes, usersRes] = await Promise.all([
        supabase.from('tasks').select('*').order('created_at', { ascending: false }),
        supabase.from('users').select('id, name')
      ]);
      
      if (ticketsRes.error) throw ticketsRes.error;
      if (usersRes.error) throw usersRes.error;

      setTickets(ticketsRes.data || []);
      setUsers(usersRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (ticketId: string, userId: string) => {
    const result = await handleAction('assign_ticket', { ticketId, userId });
    if (result.ok) {
      setTickets(tickets.map(t => t.id === ticketId ? { ...t, assigned_to: userId } : t));
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'Executive': return 'Critical Incidents & Trends';
      case 'Healthcare': return 'Security & Compliance Tickets';
      case 'Assisted': return 'Help Requests';
      default: return 'Ticket Queue';
    }
  };

  const renderExecutiveView = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm cursor-pointer hover:border-cyan-200 transition-all"
          onClick={() => handleAction('view_metric_detail', { id: 'resolution_rate' })}
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Resolution Rate</p>
          <p className="text-3xl font-bold text-slate-900">94.2%</p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-green-500 h-full w-[94%]" />
          </div>
        </div>
        <div 
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm cursor-pointer hover:border-cyan-200 transition-all"
          onClick={() => handleAction('view_metric_detail', { id: 'avg_response_time' })}
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Avg. Response Time</p>
          <p className="text-3xl font-bold text-slate-900">12m</p>
          <p className="text-xs text-green-600 font-bold mt-2">-4m vs Last Week</p>
        </div>
        <div 
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm cursor-pointer hover:border-red-200 transition-all"
          onClick={() => handleAction('view_metric_detail', { id: 'critical_incidents' })}
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Critical Incidents</p>
          <p className="text-3xl font-bold text-red-600">1</p>
          <p className="text-xs text-slate-500 mt-2 font-medium">System: AWS US-EAST-1</p>
        </div>
      </div>
      
      <div 
        className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm cursor-pointer hover:border-cyan-200 transition-all"
        onClick={() => handleAction('view_incident_trends')}
      >
        <h3 className="text-xl font-bold text-slate-900 mb-6">Incident Trend (Last 30 Days)</h3>
        <div className="h-48 flex items-end gap-2">
          {[20, 35, 15, 40, 25, 30, 10, 5, 15, 20, 10, 5, 8, 12, 18, 22, 15, 10, 5, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 15].map((h, i) => (
            <div key={i} className="flex-1 bg-slate-100 rounded-t-sm relative group">
              <div 
                className={cn(
                  "absolute bottom-0 left-0 right-0 rounded-t-sm transition-all duration-500",
                  h > 30 ? "bg-red-400" : "bg-slate-300"
                )} 
                style={{ height: `${h}%` }} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAssistedView = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
          <p className="text-2xl text-slate-500">Loading help requests...</p>
        </div>
      );
    }

    if (tickets.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 mb-2">All Caught Up!</h3>
          <p className="text-xl text-slate-500">There are no active help requests at the moment.</p>
        </div>
      );
    }

    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="bg-white border-4 border-slate-200 rounded-[3rem] p-10 shadow-xl">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 border-4 border-blue-100">
                <HelpCircle className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-4xl font-black text-slate-900">{ticket.title}</h3>
                <p className="text-2xl text-slate-500 mt-2">Status: <span className="font-bold text-slate-900 capitalize">{ticket.status?.replace('_', ' ') || 'Open'}</span></p>
              </div>
            </div>
            <p className="text-2xl text-slate-600 leading-relaxed mb-10">{ticket.description || 'No description provided.'}</p>
            <button 
              className="w-full py-8 bg-slate-900 text-white rounded-[2rem] text-3xl font-black shadow-lg hover:bg-slate-800 transition-all"
              onClick={() => handleAction('view_ticket_detail', { id: ticket.id })}
            >
              See Details
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderDefaultView = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-600 mb-4" />
          <p className="text-slate-500">Loading tickets...</p>
        </div>
      );
    }

    if (tickets.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">No Tickets Found</h3>
          <p className="text-slate-500">Your ticket queue is currently empty.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4">
        {sortedTickets.map((ticket) => (
          <div 
            key={ticket.id} 
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-cyan-200 transition-all group cursor-pointer"
            onClick={() => handleAction('view_ticket_detail', { id: ticket.id })}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                  ticket.status === 'done' ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
                )}>
                  {ticket.status === 'done' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">{ticket.title}</h3>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border",
                      ticket.priority === 'critical' ? "bg-red-50 text-red-600 border-red-100" : 
                      ticket.priority === 'high' ? "bg-orange-50 text-orange-600 border-orange-100" :
                      "bg-slate-50 text-slate-600 border-slate-100"
                    )}>
                      {ticket.priority || 'medium'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-2xl line-clamp-2">{ticket.description || 'No description provided.'}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold uppercase tracking-tighter">System</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-xs text-slate-400 font-medium truncate max-w-[100px]" title={ticket.id}>{ticket.id}</span>
                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-auto">
                <select
                  className="text-xs border border-slate-200 rounded-lg p-1"
                  value={ticket.assigned_to || ''}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleAssign(ticket.id, e.target.value);
                  }}
                >
                  <option value="">Unassigned</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-sm font-bold text-slate-900 capitalize">{ticket.status?.replace('_', ' ') || 'Todo'}</p>
                </div>
                <button 
                  className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 group-hover:text-cyan-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction('view_ticket_detail', { id: ticket.id });
                  }}
                >
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">SYS</span>
                </div>
                <p className="text-xs font-medium text-slate-600">
                  "Apphia Engine suggests reviewing the logs for this task."
                </p>
              </div>
              <button 
                className="text-xs font-bold text-cyan-600 hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction('view_diagnostics', { id: ticket.id });
                }}
              >
                View Diagnostics
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={cn(
      "p-4 space-y-4 max-w-7xl mx-auto transition-all duration-500",
      isAssisted && "p-6 space-y-6"
    )}>
      <header className="flex justify-between items-center">
        <div>
          <h2 className={cn(
            "font-bold text-slate-900 tracking-tight",
            isAssisted ? "text-6xl" : "text-3xl"
          )}>{getTitle()}</h2>
          <p className={cn(
            "text-slate-500 mt-1",
            isAssisted ? "text-2xl mt-4" : "text-base"
          )}>
            {isAssisted ? "We are here to help you with your tech." : "Manage technical support cases and intelligence-assisted resolutions."}
          </p>
        </div>
        {!isAssisted && (
          <button 
            className="px-4 py-2 bg-slate-900 text-white rounded-lg shadow-sm hover:bg-slate-800 transition-colors flex items-center gap-2 font-bold"
            onClick={() => handleAction('new_ticket')}
          >
            <Plus className="w-5 h-5" />
            <span>New Ticket</span>
          </button>
        )}
      </header>

      {!isAssisted && mode !== 'Executive' && (
        <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex gap-4 flex-1 min-w-[300px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search tickets..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                onChange={(e) => handleAction('search_tickets', { query: e.target.value })}
              />
            </div>
            <button 
              className="px-4 py-2 border border-slate-200 rounded-lg flex items-center gap-2 text-slate-600 hover:bg-slate-50 transition-colors"
              onClick={() => handleAction('filter_tickets')}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Sort by:</span>
            <select
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              value={sortField}
              onChange={(e) => setSortField(e.target.value as 'created_at' | 'priority')}
            >
              <option value="created_at">Creation Date</option>
              <option value="priority">Priority</option>
            </select>
            <button 
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors"
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            >
              {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
            </button>
          </div>
        </div>
      )}

      {mode === 'Executive' ? renderExecutiveView() : isAssisted ? renderAssistedView() : renderDefaultView()}
    </div>
  );
}
