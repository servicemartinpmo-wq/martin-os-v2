import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  DollarSign, 
  Package, 
  Users, 
  ClipboardList, 
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Search,
  Loader2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

export default function OfficeDashboard() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
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
      
      if (actionName === 'resolve_alert') {
        setAlerts(prev => prev.filter(a => a.id !== payload.id));
        toast.success('Alert resolved');
      } else {
        toast.success(`Action ${actionName} completed`);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'An error occurred');
    } finally {
      setActionLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [metricsRes, logsRes, inventoryRes, alertsRes] = await Promise.all([
        supabase.from('business_metrics').select('*').eq('category', 'office'),
        supabase.from('operations_log').select('*').order('created_at', { ascending: false }),
        supabase.from('inventory_items').select('*').order('level_percent', { ascending: true }),
        supabase.from('office_alerts').select('*').eq('is_resolved', false).order('created_at', { ascending: false })
      ]);

      setMetrics(metricsRes.data || []);
      setLogs(logsRes.data || []);
      setInventory(inventoryRes.data || []);
      setAlerts(alertsRes.data || []);
    } catch (err) {
      console.error('Error fetching office data:', err);
      toast.error('Failed to load office data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleResolveAlert = async (id: string) => {
    await handleAction('resolve_alert', { id });
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'DollarSign': return DollarSign;
      case 'Package': return Package;
      case 'Users': return Users;
      case 'ClipboardList': return ClipboardList;
      default: return Building2;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-slate-400 mb-4" />
        <p className="text-slate-500 font-medium tracking-tight">Synchronizing Office Ops...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Office Operations</h2>
          <p className="text-slate-500 font-medium">Administration • Inventory • Team Coordination</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleAction('new_request')}
            disabled={actionLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            New Request
          </button>
          <button 
            onClick={() => handleAction('order_supplies')}
            disabled={actionLoading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-50"
          >
            <Package className="w-4 h-4" />
            Order Supplies
          </button>
        </div>
      </header>

      {/* Office Health Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {metrics.map((stat, i) => {
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
                <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-full">{stat.trend}</span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Operations Log */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-slate-400" />
              Operations Log
            </h3>
          </div>

          <div className="space-y-4">
            {logs.map((log) => (
              <div 
                key={log.id} 
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
                onClick={() => handleAction('view_log_detail', { id: log.id })}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center font-bold text-xs">
                    {log.time_label.split(':')[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{log.title}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.category} • {log.time_label}</p>
                  </div>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                  log.status === 'Completed' ? "bg-green-50 text-green-600" :
                  log.status === 'In Progress' ? "bg-blue-50 text-blue-600" :
                  log.status === 'Pending' ? "bg-yellow-50 text-yellow-600" : "bg-slate-50 text-slate-500"
                )}>
                  {log.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory & Alerts */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-cyan-400" />
              Low Inventory
            </h3>
            <div className="space-y-4">
              {inventory.map((item) => (
                <div 
                  key={item.id} 
                  className="space-y-2 cursor-pointer group"
                  onClick={() => handleAction('view_inventory_detail', { id: item.id })}
                >
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span className="group-hover:text-cyan-400 transition-colors">{item.item_name}</span>
                    <span className={cn(item.level_percent < 10 ? "text-red-400" : "text-yellow-400")}>
                      {item.level_percent}%
                    </span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full", item.level_percent < 10 ? "bg-red-500" : "bg-yellow-500")} 
                      style={{ width: `${item.level_percent}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => handleAction('auto_restock')}
              disabled={actionLoading}
              className="w-full mt-8 py-3 bg-cyan-500 text-slate-900 rounded-xl text-xs font-bold hover:bg-cyan-400 transition-colors disabled:opacity-50"
            >
              Auto-Restock All
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Urgent Alerts
            </h3>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={cn(
                    "p-4 rounded-2xl border cursor-pointer hover:shadow-sm transition-all",
                    alert.type === 'urgent' ? "bg-red-50 border-red-100" : "bg-yellow-50 border-yellow-100"
                  )}
                  onClick={() => handleResolveAlert(alert.id)}
                >
                  <p className={cn("text-xs font-bold mb-1", alert.type === 'urgent' ? "text-red-700" : "text-yellow-700")}>
                    {alert.title}
                  </p>
                  <p className={cn("text-[10px] font-medium", alert.type === 'urgent' ? "text-red-600" : "text-yellow-600")}>
                    {alert.description}
                  </p>
                </div>
              ))}
              {alerts.length === 0 && <p className="text-xs text-slate-400 italic">No active alerts.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
