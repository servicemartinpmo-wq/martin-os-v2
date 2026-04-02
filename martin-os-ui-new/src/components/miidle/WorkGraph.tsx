import React, { useEffect, useState } from 'react';
import { Activity, Users, Target, Cpu, Zap, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';

export default function WorkGraph() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersRes, projectsRes, tasksRes] = await Promise.all([
          supabase.from('users').select('id, full_name'),
          supabase.from('projects').select('id, title'),
          supabase.from('tasks').select('id, title')
        ]);
        
        if (usersRes.error) throw usersRes.error;
        if (projectsRes.error) throw projectsRes.error;
        if (tasksRes.error) throw tasksRes.error;
        
        const derivedNodes = [
          ...(usersRes.data || []).map(u => ({ id: u.id, label: u.full_name, type: 'User' })),
          ...(projectsRes.data || []).map(p => ({ id: p.id, label: p.title, type: 'Project' })),
          ...(tasksRes.data || []).map(t => ({ id: t.id, label: t.title, type: 'Task' }))
        ];
        
        setNodes(derivedNodes);
      } catch (err) {
        console.error('Error fetching work graph data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto h-full flex flex-col">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Work Graph</h2>
        <p className="text-slate-500 mt-1">Visual network of users, projects, skills, and outputs. Verified proof-of-work.</p>
      </header>

      <div className="flex-1 bg-slate-50 rounded-3xl border border-slate-200 relative overflow-hidden flex items-center justify-center p-12">
        {/* Abstract Graph Visualization */}
        <div className="relative w-full h-full max-w-4xl">
          {/* Central Node */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-32 h-32 bg-slate-900 rounded-full flex flex-col items-center justify-center shadow-2xl border-4 border-white animate-pulse">
              <span className="text-white font-bold text-lg">Martin-OS</span>
              <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-widest">Core</span>
            </div>
          </div>

          {/* Orbiting Nodes */}
          {[
            { icon: Users, label: 'Verified Contributors', pos: 'top-0 left-1/4', color: 'bg-blue-500', verified: true },
            { icon: Target, label: 'Proof-of-Work Initiatives', pos: 'top-1/4 right-0', color: 'bg-purple-500', verified: true },
            { icon: Cpu, label: 'Apphia Engine Nodes', pos: 'bottom-0 right-1/4', color: 'bg-cyan-500', verified: true },
            { icon: Zap, label: 'Certified Skills', pos: 'bottom-1/4 left-0', color: 'bg-orange-500', verified: true },
          ].map((node, i) => (
            <div key={i} className={cn("absolute flex flex-col items-center gap-2 group cursor-pointer transition-transform hover:scale-110", node.pos)}>
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg relative", node.color)}>
                <node.icon className="w-8 h-8" />
                {node.verified && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>
                )}
              </div>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-widest group-hover:text-slate-900">{node.label}</span>
              
              {/* Connecting Line (CSS only) */}
              <div className="absolute top-1/2 left-1/2 w-px h-32 bg-slate-200 -z-10 origin-top rotate-45" />
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="absolute bottom-8 left-8 bg-white/80 backdrop-blur p-4 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Graph Legend</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs font-medium text-slate-600">User Node</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-xs font-medium text-slate-600">Project Node</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500" />
              <span className="text-xs font-medium text-slate-600">Output Node</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Connections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-12 flex items-center justify-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : nodes.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            No connections found.
          </div>
        ) : nodes.map(node => (
          <div key={node.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{node.label}</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{node.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
