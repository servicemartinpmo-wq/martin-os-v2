import React from 'react';
import { Zap } from 'lucide-react';

const WorkflowBuilder = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-black tracking-tighter text-white">Workflow Builder</h2>
      <button className="px-4 py-2 bg-blue-600 rounded-xl text-xs font-bold hover:bg-blue-500 transition-all">New Workflow</button>
    </div>
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-4">
      <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
        <Zap className="w-8 h-8 text-blue-400" />
      </div>
      <h3 className="text-lg font-bold text-white">No Active Workflows</h3>
      <p className="text-sm text-slate-400 max-w-md">Automate your PMO-Ops by connecting signals to structural remedies. Build custom logic chains for your organization.</p>
    </div>
  </div>
);

export default WorkflowBuilder;
