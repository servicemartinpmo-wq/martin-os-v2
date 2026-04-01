import React from 'react';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Clock, 
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { cn } from '../../lib/utils';

const coreAdvisors = [
  { name: 'Strategy', desc: 'Strategic planning, OKRs, and roadmaps.' },
  { name: 'Operations', desc: 'Org structure, communication systems, scaling.' },
  { name: 'Project Management', desc: 'Timeline planning, milestone oversight.' },
  { name: 'Administrative Systems', desc: 'Executive support, inbox & calendar management.' },
  { name: 'Process Improvement', desc: 'SOP design, automation, workflow optimization.' },
];

export default function AdvisoryDesk() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto h-full flex flex-col">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Advisory Desk</h2>
        <p className="text-slate-500 mt-1">Submit requests for expert operational and strategic guidance.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        {/* Left: Request Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-500" />
              New Advisory Request
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Request Type</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/20">
                  <option>Strategy Review</option>
                  <option>Process Audit</option>
                  <option>Project Rescue</option>
                  <option>Documentation Review</option>
                  <option>Custom Request</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  placeholder="Describe the challenge or project you need guidance on..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 h-32 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <button className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors text-sm font-medium">
                  <Paperclip className="w-4 h-4" />
                  Attach Documents (PDF, Images, Links)
                </button>
                <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center gap-2">
                  <span>Submit Request</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { title: 'Q3 Strategic Roadmap Review', status: 'In Progress', time: '2h ago' },
                { title: 'Sales Workflow Optimization', status: 'Completed', time: '1d ago' },
              ].map((req, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{req.title}</p>
                      <p className="text-xs text-slate-400">{req.time}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest",
                    req.status === 'Completed' ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
                  )}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Advisors List */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Core Advisors</h3>
            <div className="space-y-4">
              {coreAdvisors.map((advisor) => (
                <div key={advisor.name} className="group cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">{advisor.name}</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-cyan-500 transition-colors" />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{advisor.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-cyan-600 rounded-2xl p-6 text-white shadow-lg shadow-cyan-500/20">
            <ShieldCheck className="w-8 h-8 mb-4 opacity-80" />
            <h3 className="text-lg font-bold mb-2 text-white">Elite Support</h3>
            <p className="text-cyan-100 text-sm mb-6 leading-relaxed">
              Unlock a dedicated operational advisor with our Command Center tier.
            </p>
            <button className="w-full py-2.5 bg-white text-cyan-600 font-bold rounded-xl hover:bg-cyan-50 transition-colors text-sm">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
