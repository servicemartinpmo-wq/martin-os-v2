import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Network, 
  Users, 
  Layers, 
  ChevronRight, 
  Search, 
  Filter, 
  Info,
  GitBranch,
  Building2,
  Workflow
} from 'lucide-react';
import { AppMode } from '../../types';
import { cn } from '../../lib/utils';

interface OrganizationalMapProps {
  mode: AppMode;
}

export default function OrganizationalMap({ mode }: OrganizationalMapProps) {
  const [selectedDept, setSelectedDept] = useState<string | null>('Engineering');

  const departments = [
    { name: 'Engineering', roles: 42, dependencies: 12, health: 92, status: 'Optimal' },
    { name: 'Product', roles: 14, dependencies: 8, health: 88, status: 'Attention' },
    { name: 'Marketing', roles: 22, dependencies: 15, health: 74, status: 'Critical' },
    { name: 'Sales', roles: 35, dependencies: 5, health: 95, status: 'Optimal' },
    { name: 'Operations', roles: 18, dependencies: 22, health: 82, status: 'Optimal' },
  ];

  return (
    <div className="p-6 space-y-8 bg-white min-h-screen text-slate-900">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
            Organizational Map
          </h1>
          <p className="text-slate-500 font-mono text-xs mt-1 uppercase tracking-widest">
            Structural Intelligence | {mode.toUpperCase()}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="SEARCH ROLES/DEPTS..." 
              className="bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-500 transition-all w-64 text-slate-900"
            />
          </div>
          <button className="bg-white hover:bg-slate-50 text-slate-900 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all border border-slate-200 shadow-sm">
            <Filter className="w-4 h-4" /> Filter View
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Panel: Department List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-600">
                <Building2 className="w-4 h-4 text-blue-600" />
                Departments
              </h2>
            </div>
            <div className="p-2 space-y-1">
              {departments.map((dept) => (
                <button
                  key={dept.name}
                  onClick={() => setSelectedDept(dept.name)}
                  className={cn(
                    "w-full p-3 rounded-lg text-left transition-all group flex justify-between items-center",
                    selectedDept === dept.name ? "bg-slate-900 text-white" : "hover:bg-slate-50 text-slate-500"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      dept.status === 'Optimal' ? "bg-emerald-500" : 
                      dept.status === 'Attention' ? "bg-amber-500" : "bg-red-500"
                    )} />
                    <span className="text-sm font-bold uppercase tracking-tight">{dept.name}</span>
                  </div>
                  <ChevronRight className={cn("w-4 h-4 transition-transform", selectedDept === dept.name ? "rotate-90" : "opacity-0 group-hover:opacity-100")} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Total Headcount</span>
              <span className="text-xl font-black text-slate-900">131</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Open Roles</span>
              <span className="text-xl font-black text-blue-600">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Cross-Dept Links</span>
              <span className="text-xl font-black text-purple-600">62</span>
            </div>
          </div>
        </div>

        {/* Center/Right Panel: Map Visualization */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-600">
              <Network className="w-4 h-4 text-purple-600" />
              {selectedDept ? `${selectedDept.toUpperCase()} TOPOLOGY` : 'GLOBAL TOPOLOGY'}
            </h2>
            <div className="flex gap-2">
              <button className="p-1.5 bg-white border border-slate-200 rounded hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all"><Info className="w-4 h-4" /></button>
              <button className="p-1.5 bg-white border border-slate-200 rounded hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all"><Workflow className="w-4 h-4" /></button>
            </div>
          </div>
          
          <div className="flex-1 p-8 relative min-h-[500px] flex items-center justify-center overflow-hidden bg-slate-50/30">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            
            {/* Simplified Node Map */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Central Node */}
              <motion.div 
                layoutId="central-node"
                className="w-32 h-32 rounded-full bg-blue-50 border-2 border-blue-500 flex flex-col items-center justify-center z-10 shadow-[0_0_30px_rgba(59,130,246,0.1)]"
              >
                <Users className="w-8 h-8 text-blue-600 mb-1" />
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-900">{selectedDept}</span>
              </motion.div>

              {/* Satellite Nodes */}
              {[
                { label: 'Infrastructure', icon: Layers, angle: 0, dist: 160 },
                { label: 'Frontend', icon: GitBranch, angle: 72, dist: 160 },
                { label: 'Backend', icon: Network, angle: 144, dist: 160 },
                { label: 'DevOps', icon: Workflow, angle: 216, dist: 160 },
                { label: 'Security', icon: Building2, angle: 288, dist: 160 },
              ].map((node, i) => {
                const x = Math.cos((node.angle * Math.PI) / 180) * node.dist;
                const y = Math.sin((node.angle * Math.PI) / 180) * node.dist;
                
                return (
                  <React.Fragment key={i}>
                    {/* Connection Line */}
                    <motion.div 
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 0.2, scaleX: 1 }}
                      className="absolute h-px bg-blue-500 origin-left z-0"
                      style={{ 
                        width: node.dist, 
                        left: '50%', 
                        top: '50%', 
                        transform: `rotate(${node.angle}deg)` 
                      }}
                    />
                    {/* Node */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="absolute w-20 h-20 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center group hover:border-blue-500/50 transition-all cursor-pointer z-20 shadow-sm"
                      style={{ 
                        left: `calc(50% + ${x}px - 40px)`, 
                        top: `calc(50% + ${y}px - 40px)` 
                      }}
                    >
                      <node.icon className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors mb-1" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">{node.label}</span>
                    </motion.div>
                  </React.Fragment>
                );
              })}
            </div>

            {/* Legend/Info Overlay */}
            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur border border-slate-200 p-3 rounded-lg text-[9px] font-mono text-slate-500 space-y-1 shadow-sm">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> OPTIMAL HEALTH</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500" /> ATTENTION REQUIRED</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /> CRITICAL RISK</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
