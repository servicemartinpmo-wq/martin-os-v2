import React from 'react';
import { 
  Users, 
  Mail, 
  Phone, 
  MoreHorizontal, 
  Shield,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { teamMembers } from '../../data/mockData';
import { cn } from '../../lib/utils';

const mochaColors = {
  Manager: 'text-blue-600 bg-blue-50 border-blue-100',
  Owner: 'text-green-600 bg-green-50 border-green-100',
  Consulted: 'text-purple-600 bg-purple-50 border-purple-100',
  Helped: 'text-orange-600 bg-orange-50 border-orange-100',
  Accountable: 'text-red-600 bg-red-50 border-red-100',
};

export default function TeamPage() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 text-center md:text-left">Team</h2>
          <p className="text-slate-500 mt-1">Manage roles, responsibilities, and workload distribution.</p>
        </div>
        <div className="flex -space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
              {i === 4 ? '+12' : 'JD'}
            </div>
          ))}
        </div>
      </header>

      {/* MOCHA Framework Info */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              <Shield className="w-3 h-3" />
              MOCHA Framework
            </div>
            <h3 className="text-2xl font-bold mb-4">Accountability by Design</h3>
            <p className="text-slate-400 leading-relaxed mb-8">
              We use the MOCHA framework to ensure every task has clear ownership and support structures. This eliminates ambiguity and accelerates decision making.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-cyan-400 font-bold text-lg mb-1">94%</p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Role Clarity</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-green-400 font-bold text-lg mb-1">82%</p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Execution Rate</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {[
              { label: 'Manager', desc: 'Assigns the work and holds Owner accountable.' },
              { label: 'Owner', desc: 'The one person responsible for the outcome.' },
              { label: 'Consulted', desc: 'Provides input and expertise.' },
              { label: 'Helped', desc: 'Assists with execution.' },
              { label: 'Accountable', desc: 'Ultimately responsible for the project.' },
            ].map((item) => (
              <div key={item.label} className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                <div className="w-1.5 h-auto rounded-full bg-cyan-500/30 group-hover:bg-cyan-500 transition-colors" />
                <div>
                  <p className="font-bold text-sm">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-400 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{member.name}</h4>
                  <p className="text-sm text-slate-500">{member.role}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">MOCHA Role</span>
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border",
                  mochaColors[member.mochaRole]
                )}>
                  {member.mochaRole}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500 font-medium">Workload</span>
                  <span className={cn(
                    "font-bold",
                    member.workload > 90 ? "text-red-500" : "text-slate-700"
                  )}>{member.workload}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      member.workload > 90 ? "bg-red-500" : "bg-cyan-500"
                    )} 
                    style={{ width: `${member.workload}%` }} 
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{member.lastUpdate}</span>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                    <Mail className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center group hover:bg-slate-100 transition-colors">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6 text-slate-400" />
          </div>
          <h4 className="font-bold text-slate-900">Invite Member</h4>
          <p className="text-sm text-slate-500 mt-1">Add new talent to your organization.</p>
        </button>
      </div>
    </div>
  );
}
