'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Table as TableIcon, 
  BarChart3, 
  Activity,
  AlertCircle,
  ChevronRight,
  Zap
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { OSBlueprint } from '../lib/schemas/os-blueprint';
import { toast } from 'sonner';

const handleAction = async (actionName: string, payload: any = {}) => {
  try {
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
  }
};

// --- HIGH FIDELITY COMPONENT PRIMITIVES ---

const StatCard = ({ title, value, actions }: { title: string, value: string | number, actions?: any[] }) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group shadow-2xl">
      {/* 3D Emboss Highlight */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/60">{title}</h4>
        <Activity className="w-4 h-4 text-blue-400/40" />
      </div>
      
      <p className="text-5xl font-black text-white tracking-tighter mb-4">{value}</p>
      
      {/* Dynamic Action Triggers */}
      {actions && actions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {actions.map((btn, idx) => (
            <button
              key={idx}
              onClick={() => handleAction(btn.action, { value: btn.value })}
              className="px-3 py-1.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}
      
      <div className="mt-6 h-1 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 w-2/3 animate-pulse" />
      </div>
    </div>
  );
};

const GlassTable = ({ columns, data, rowActions, title, source }: { columns: string[], data: any[], rowActions?: any[], title: string, source?: string }) => {
  return (
    <div className="w-full bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl col-span-full">
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <TableIcon className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">{title}</h3>
            <p className="text-[10px] text-slate-500 font-mono">{source || 'SYSTEM_DATA'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-500 uppercase tracking-widest">Live Sync</div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black bg-white/5">
              {columns.map(col => <th key={col} className="px-8 py-4">{col}</th>)}
              {rowActions && <th className="px-8 py-4 text-right">Operations</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (rowActions ? 1 : 0)} className="px-8 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 opacity-20">
                    <Zap className="w-8 h-8" />
                    <p className="text-xs font-black uppercase tracking-widest">No records found in {source}</p>
                  </div>
                </td>
              </tr>
            ) : data.map((row, idx) => (
              <tr key={idx} className="hover:bg-white/5 transition-all group">
                {columns.map(col => (
                  <td key={col} className="px-8 py-4 text-xs font-bold text-slate-300">
                    {typeof row[col.toLowerCase()] === 'object' 
                      ? JSON.stringify(row[col.toLowerCase()]) 
                      : String(row[col.toLowerCase()] || '—')}
                  </td>
                ))}
                {/* Table Row Triggers */}
                {rowActions && (
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {rowActions.map((action, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => handleAction(action.action, { value: action.value, id: row.id || idx })}
                          className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-400 transition-all"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ChartComponent = ({ title, chartType }: { title: string, chartType?: 'bar' | 'line' }) => {
  const data = [
    { name: '01', value: 400 },
    { name: '02', value: 300 },
    { name: '03', value: 600 },
    { name: '04', value: 800 },
    { name: '05', value: 500 },
    { name: '06', value: 700 },
    { name: '07', value: 900 },
  ];

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 col-span-full lg:col-span-1 shadow-2xl">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400/60 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          {title}
        </h3>
        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                itemStyle={{ color: '#06b6d4', fontWeight: 'bold' }}
              />
              <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={4} dot={{ r: 4, fill: '#06b6d4', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// --- THE HYDRATOR ---

export default function DynamicUIRenderer({ blueprint }: { blueprint: OSBlueprint }) {
  const [liveData, setLiveData] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!supabase) return;
      setLoading(true);
      const dataSources = blueprint.components
        .filter(c => c.dataSource)
        .map(c => c.dataSource as string);
      
      const uniqueSources = Array.from(new Set(dataSources));
      const results: Record<string, any[]> = {};

      for (const source of uniqueSources) {
        try {
          const { data, error } = await supabase
            .from(source)
            .select('*')
            .limit(10);
          
          if (!error) {
            results[source] = data || [];
          }
        } catch (err) {
          console.warn(`Failed to fetch ${source}:`, err);
        }
      }
      
      setLiveData(results);
      setLoading(false);
    };

    fetchAllData();
  }, [blueprint]);

  return (
    <div className={cn(
      "grid gap-8",
      blueprint.layout === 'grid-cols-2' ? "grid-cols-1 lg:grid-cols-2" : 
      blueprint.layout === 'grid-cols-3' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : 
      "grid-cols-1"
    )}>
      {blueprint.components.map((comp) => {
        const componentData = comp.dataSource ? liveData[comp.dataSource] : null;

        switch (comp.type) {
          case 'stat-card':
            return (
              <StatCard 
                key={comp.id} 
                title={(comp.props as any).title || (comp.props as any).label} 
                value={componentData?.[0]?.value || (comp.props as any).value || (comp.props as any).fallbackValue || '0'} 
                actions={comp.actions} 
              />
            );
          case 'data-table':
            return (
              <GlassTable 
                key={comp.id} 
                title={(comp.props as any).title || 'Data View'}
                source={comp.dataSource}
                columns={(comp.props as any).columns || ['ID', 'Title', 'Status']} 
                data={componentData || []} 
                rowActions={comp.actions} 
              />
            );
          case 'chart':
            return (
              <ChartComponent 
                key={comp.id} 
                title={(comp.props as any).title || 'Analytics'} 
                chartType={(comp.props as any).chartType} 
              />
            );
          default:
            return (
              <div key={comp.id} className="p-8 bg-rose-500/5 border border-rose-500/20 rounded-3xl text-rose-400 flex items-center gap-4">
                <AlertCircle className="w-6 h-6" />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest">Unknown Component: {comp.type}</p>
                  <p className="text-[10px] opacity-60 font-mono">ID: {comp.id}</p>
                </div>
              </div>
            );
        }
      })}
    </div>
  );
}
