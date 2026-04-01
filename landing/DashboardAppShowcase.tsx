import React from 'react';
import { Brain, Cpu, Network } from 'lucide-react';

const apps = [
  { name: "PMO-Ops", icon: Brain },
  { name: "Tech-Ops", icon: Cpu },
  { name: "miidle", icon: Network }
];

export default function DashboardAppShowcase() {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {apps.map((app) => {
        const Icon = app.icon;
        return (
          <div key={app.name} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center text-center">
            <Icon className="w-8 h-8 text-indigo-400 mb-2" />
            <h4 className="text-xs font-bold text-white">{app.name}</h4>
          </div>
        );
      })}
    </div>
  );
}
