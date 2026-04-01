import React from 'react';
import { 
  Kanban, 
  UserPlus, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Mail,
  Plus,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function FreelanceHub() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Freelance Command</h2>
          <p className="text-slate-500 font-medium">CRM • Marketing • Operations</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            New Lead
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </header>

      {/* CRM & Marketing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Pipeline Value', value: '$42,500', trend: '+15%', icon: DollarSign },
          { label: 'Active Leads', value: '24', trend: '+4', icon: UserPlus },
          { label: 'Marketing ROI', value: '3.2x', trend: '+0.4', icon: TrendingUp },
          { label: 'Open Invoices', value: '6', trend: '$8.2k', icon: Mail },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{stat.trend}</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Kanban & CRM Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kanban Board (Simplified) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Kanban className="w-5 h-5 text-slate-400" />
              Active Projects
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['To Do', 'In Progress', 'Done'].map((column) => (
              <div key={column} className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{column}</span>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">2</span>
                </div>
                <div className="bg-slate-50/50 p-2 rounded-2xl border border-dashed border-slate-200 min-h-[400px] space-y-3">
                  {[1, 2].map((card) => (
                    <div key={card} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-tighter">Design</span>
                        <button className="text-slate-400 hover:text-slate-600">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">Project Alpha {card}</h4>
                      <p className="text-[10px] text-slate-500 line-clamp-2 mb-4">Brief description of the freelance project tasks.</p>
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-1">
                          <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">Mar 30</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CRM & Appointments */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              Upcoming Bookings
            </h3>
            <div className="space-y-6">
              {[
                { name: 'Sarah Miller', time: '10:00 AM', type: 'Discovery Call' },
                { name: 'Tech Corp', time: '2:30 PM', type: 'Design Review' },
                { name: 'Mike Ross', time: '4:00 PM', type: 'Consultation' },
              ].map((booking, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xs">
                    {booking.time.split(':')[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{booking.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{booking.type} • {booking.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors border border-slate-100">
              View Calendar
            </button>
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Marketing Insights
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Your Martin Connect campaign is driving 40% more traffic than last month. Consider increasing budget for "Product Design" keywords.
            </p>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Top Channel</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">Martin Connect Ads</span>
                <span className="text-xs text-cyan-400 font-bold">+24%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
