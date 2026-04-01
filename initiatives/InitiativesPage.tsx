import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  ArrowUpRight,
  ChevronDown,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';
import InitiativeDetailView from './InitiativeDetailView';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  'On Track': 'bg-green-50 text-green-700 border-green-100',
  'Needs Attention': 'bg-amber-50 text-amber-700 border-amber-100',
  'Delayed': 'bg-red-50 text-red-700 border-red-100',
  'Abandoned': 'bg-slate-50 text-slate-700 border-slate-100',
  'Open': 'bg-blue-50 text-blue-700 border-blue-100',
  'In Progress': 'bg-indigo-50 text-indigo-700 border-indigo-100',
  'Resolved': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Closed': 'bg-gray-50 text-gray-700 border-gray-100',
  'planned': 'bg-slate-50 text-slate-700 border-slate-100',
  'in-progress': 'bg-blue-50 text-blue-700 border-blue-100',
  'blocked': 'bg-red-50 text-red-700 border-red-100',
  'complete': 'bg-green-50 text-green-700 border-green-100',
};

export default function InitiativesPage() {
  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInitiative, setSelectedInitiative] = useState<any | null>(null);
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
    const fetchInitiatives = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('priority_score', { ascending: false });
        
        if (error) throw error;
        setInitiatives(data || []);
      } catch (err) {
        console.error('Error fetching initiatives:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitiatives();
  }, []);

  const handleCreateProject = async () => {
    const title = prompt('Enter initiative title:');
    if (!title) return;

    try {
      const result = await handleAction('create_project', { 
        title,
        description: 'New initiative created via dashboard',
        priority_score: 50,
        status: 'planned'
      });

      if (result) {
        // Refresh list
        const { data } = await supabase
          .from('projects')
          .select('*')
          .order('priority_score', { ascending: false });
        setInitiatives(data || []);
      }
    } catch (err) {
      // Error handled in handleAction
    }
  };

  if (selectedInitiative) {
    return <InitiativeDetailView initiative={selectedInitiative} onBack={() => setSelectedInitiative(null)} />;
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Initiatives</h2>
          <p className="text-slate-500 mt-1">Manage and track all organizational programs and projects.</p>
        </div>
        <button 
          onClick={handleCreateProject}
          disabled={actionLoading}
          className="px-4 py-2 bg-cyan-500 text-white rounded-lg shadow-sm hover:bg-cyan-600 transition-colors flex items-center gap-2 font-bold disabled:opacity-50"
        >
          {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
          <span>{actionLoading ? "Creating..." : "New Initiative"}</span>
        </button>
      </header>

      {/* Action Error Display Removed - Handled by toast */}

      {/* Filters & Search */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex gap-4 flex-1 min-w-[300px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search initiatives..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
            />
          </div>
          <button className="px-4 py-2 border border-slate-200 rounded-lg flex items-center gap-2 text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Sort by:</span>
          <button className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2 text-slate-700 text-sm font-medium">
            Priority Score
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Initiatives Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-bottom border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Initiative</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Alignment</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Risk</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-500 mx-auto" />
                    <p className="text-sm text-slate-500 mt-4">Loading initiatives...</p>
                  </td>
                </tr>
              ) : initiatives.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No initiatives found.
                  </td>
                </tr>
              ) : initiatives.map((ini) => (
                <tr 
                  key={ini.id} 
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  onClick={() => setSelectedInitiative(ini)}
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">{ini.title}</span>
                      <span className="text-xs text-slate-400 mt-0.5">{ini.type || 'Operational'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            (ini.priority_score || 0) > 90 ? "bg-cyan-500" : "bg-slate-400"
                          )} 
                          style={{ width: `${ini.priority_score || 0}%` }} 
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{ini.priority_score || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                      ini.strategic_alignment === 'Critical' ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                    )}>
                      {ini.strategic_alignment || 'Medium'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-sm font-medium",
                      "text-orange-500"
                    )}>
                      Medium
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                        {ini.owner_id ? 'U' : '?'}
                      </div>
                      <span className="text-sm text-slate-600 truncate w-24" title={ini.owner_id}>{ini.owner_id || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold border",
                      statusColors[ini.status] || 'bg-slate-50 text-slate-700 border-slate-100'
                    )}>
                      {ini.status || 'planned'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1 hover:bg-slate-100 rounded transition-colors text-slate-400 hover:text-slate-600">
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:bg-slate-100 rounded transition-colors text-slate-400 hover:text-slate-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
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
