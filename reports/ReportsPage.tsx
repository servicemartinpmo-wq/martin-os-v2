import React, { useEffect, useState } from 'react';
import { BarChart3, Download, Filter, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';

export default function ReportsPage() {
  const [metrics, setMetrics] = useState<any[]>([]);
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

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!supabase) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('business_metrics')
          .select('*')
          .limit(4);
        if (error) throw error;
        setMetrics(data || []);
      } catch (err) {
        console.error('Error fetching metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Reports</h2>
          <p className="text-slate-500 mt-1">Export analysis results and track long-term performance trends.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-slate-200 rounded-lg flex items-center gap-2 text-slate-600 hover:bg-slate-50 transition-colors">
            <CalendarIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Last 30 Days</span>
          </button>
          <button 
            onClick={() => handleAction('export_pdf')}
            disabled={actionLoading}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg shadow-sm hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-pulse">
              <div className="h-3 w-24 bg-slate-100 rounded mb-4" />
              <div className="flex items-end justify-between">
                <div className="h-8 w-16 bg-slate-100 rounded" />
                <div className="h-4 w-10 bg-slate-100 rounded" />
              </div>
            </div>
          ))
        ) : metrics.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            No metrics found.
          </div>
        ) : metrics.map((stat) => (
          <div key={stat.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
              <span className={`text-xs font-bold ${stat.is_positive ? 'text-green-500' : 'text-red-500'}`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
          <BarChart3 className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Custom Report Builder</h3>
        <p className="text-slate-500 mt-2 max-w-sm">Drag and drop metrics to create your own executive dashboards and performance summaries.</p>
        <button 
          onClick={() => handleAction('report_builder')}
          disabled={actionLoading}
          className="mt-6 px-6 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          Start Building
        </button>
      </div>
    </div>
  );
}
