import React from 'react';
import { 
  Stethoscope, 
  HeartPulse, 
  DollarSign, 
  Users, 
  ShieldCheck, 
  FileText, 
  Activity,
  Calendar,
  Search,
  Filter,
  MoreHorizontal,
  Lock
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function HealthcareDashboard() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-2xl text-green-600">
            <Stethoscope className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Practice Command Center</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-green-100">
                <ShieldCheck className="w-3 h-3" />
                HIPAA Compliant
              </span>
              <span className="text-slate-400 font-medium text-sm tracking-wide">Secure Patient Data Access</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
            <Search className="w-4 h-4" />
            Find Patient
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            <FileText className="w-4 h-4" />
            New Encounter
          </button>
        </div>
      </header>

      {/* Practice Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Daily Revenue', value: '$12,450', trend: '+8%', icon: DollarSign },
          { label: 'Patient Volume', value: '42', trend: '+12', icon: Users },
          { label: 'Billing Health', value: '96.2%', trend: '+0.5%', icon: Activity },
          { label: 'Open Claims', value: '18', trend: '$4.2k', icon: FileText },
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

      {/* Practice Management & Accounting */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Patient Queue & Encounters */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-400" />
              Today's Schedule
            </h3>
          </div>

          <div className="space-y-4">
            {[
              { name: 'Sarah Miller', time: '09:00 AM', type: 'Follow-up', status: 'Checked In' },
              { name: 'John Smith', time: '10:30 AM', type: 'Initial Consultation', status: 'Waiting' },
              { name: 'Emily Davis', time: '11:15 AM', type: 'Lab Review', status: 'In Progress' },
              { name: 'Michael Brown', time: '01:00 PM', type: 'Annual Physical', status: 'Scheduled' },
            ].map((patient, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center font-bold text-xs">
                    {patient.time.split(':')[0]}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-green-600 transition-colors">{patient.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{patient.type} • {patient.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                    patient.status === 'Checked In' ? "bg-blue-50 text-blue-600" :
                    patient.status === 'Waiting' ? "bg-yellow-50 text-yellow-600" :
                    patient.status === 'In Progress' ? "bg-green-50 text-green-600" : "bg-slate-50 text-slate-500"
                  )}>
                    {patient.status}
                  </div>
                  <button className="text-slate-400 hover:text-slate-600">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Compliance & Accounting */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-green-400" />
              Security Audit
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Data Encryption', status: 'Active' },
                { label: 'Access Logs', status: 'Verified' },
                { label: 'Backup Status', status: 'Healthy' },
                { label: 'HIPAA Training', status: 'Up to Date' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-400">{item.label}</span>
                  <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">{item.status}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 bg-white/10 text-white rounded-xl text-xs font-bold hover:bg-white/20 transition-colors border border-white/10">
              Run Full Audit
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-red-500" />
              Clinical Insights
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Intelligence analysis of patient outcomes shows a 15% improvement in recovery times for patients using the new follow-up protocol.
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Practice Health</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">Patient Satisfaction</span>
                <span className="text-xs text-green-600 font-bold">4.9/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
