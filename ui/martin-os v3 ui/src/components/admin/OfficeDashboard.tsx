import React from 'react';
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
  Search
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function OfficeDashboard() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Office Operations</h2>
          <p className="text-slate-500 font-medium">Administration • Inventory • Team Coordination</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            New Request
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            <Package className="w-4 h-4" />
            Order Supplies
          </button>
        </div>
      </header>

      {/* Office Health Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Office Budget', value: '$8,400', trend: '72% used', icon: DollarSign },
          { label: 'Supply Level', value: 'Good', trend: '2 low items', icon: Package },
          { label: 'Team Presence', value: '12/15', trend: '3 remote', icon: Users },
          { label: 'Open Tasks', value: '8', trend: '2 urgent', icon: ClipboardList },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-full">{stat.trend}</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
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
            {[
              { title: 'Monthly Rent Payment', category: 'Finance', status: 'Completed', time: '09:00 AM' },
              { title: 'Kitchen Supply Restock', category: 'Inventory', status: 'In Progress', time: '10:30 AM' },
              { title: 'New Employee Onboarding', category: 'Team', status: 'Pending', time: '01:00 PM' },
              { title: 'IT Infrastructure Maintenance', category: 'Operations', status: 'Scheduled', time: '04:00 PM' },
            ].map((log, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center font-bold text-xs">
                    {log.time.split(':')[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{log.title}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.category} • {log.time}</p>
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
              {[
                { item: 'Printer Paper', level: '15%' },
                { item: 'Coffee Beans', level: '5%' },
                { item: 'Cleaning Supplies', level: '20%' },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span>{item.item}</span>
                    <span className="text-red-400">{item.level}</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: item.level }} />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 bg-cyan-500 text-slate-900 rounded-xl text-xs font-bold hover:bg-cyan-400 transition-colors">
              Auto-Restock All
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Urgent Alerts
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                <p className="text-xs font-bold text-red-700 mb-1">HVAC System Error</p>
                <p className="text-[10px] text-red-600 font-medium">Maintenance requested for 2nd floor.</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                <p className="text-xs font-bold text-yellow-700 mb-1">Visitor Arriving</p>
                <p className="text-[10px] text-yellow-600 font-medium">Mr. Henderson arriving in 15 mins.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
