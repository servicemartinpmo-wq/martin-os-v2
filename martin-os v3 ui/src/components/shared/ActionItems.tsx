import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckSquare, 
  Calendar, 
  Mail, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  FileText,
  ClipboardList,
  Users,
  MessageSquare,
  Zap
} from 'lucide-react';
import { AppMode, AppType } from '../../types';
import { cn } from '../../lib/utils';

interface ActionItemsProps {
  mode: AppMode;
  app: AppType;
}

export default function ActionItems({ mode, app }: ActionItemsProps) {
  const getTitle = () => {
    if (app === 'TECH-OPs') return "Need your attention";
    if (app === 'miidle') return "Suggestions & Connections";
    return "Action Items";
  };

  const items = [
    {
      id: 1,
      type: 'meeting',
      title: 'Q3 Strategic Alignment',
      time: '14:00 - 15:00',
      prep: 'Review Q2 performance metrics and draft expansion proposal.',
      done: false,
      agenda: '1. Revenue Review, 2. Market Expansion, 3. Resource Allocation',
      participants: 5
    },
    {
      id: 2,
      type: 'email',
      title: 'Follow-up: Client Phoenix',
      time: 'Received 2h ago',
      prep: 'Draft response regarding the technical integration timeline.',
      done: true,
      agenda: 'Integration phase 2 details requested.',
      participants: 1
    },
    {
      id: 3,
      type: 'task',
      title: 'Update SOP Library',
      time: 'Due EOD',
      prep: 'Incorporate feedback from the operations team into the new onboarding SOP.',
      done: false,
      agenda: 'Onboarding process refinement.',
      participants: 2
    }
  ];

  const connections = [
    { name: 'Sarah Chen', role: 'Product Designer', mutual: 12, reason: 'Based on your interest in Fashion Tech' },
    { name: 'Marcus Thorne', role: 'Venture Partner', mutual: 45, reason: 'Similar investment portfolio' },
    { name: 'Elena Rodriguez', role: 'Systems Architect', mutual: 8, reason: 'Expert in Autonomous Systems' }
  ];

  return (
    <div className="space-y-8 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{getTitle()}</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Intelligence-prioritized execution queue</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-full uppercase tracking-widest">
            {items.length} Pending
          </span>
        </div>
      </div>

      {app === 'miidle' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Users size={14} />
              Potential Connections
            </h3>
            {connections.map((conn, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    {conn.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-slate-900">{conn.name}</h4>
                    <p className="text-xs font-bold text-slate-500">{conn.role}</p>
                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-tight mt-1">{conn.reason}</p>
                  </div>
                  <button className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:bg-blue-500 hover:text-white transition-all">
                    <Zap size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Zap size={14} />
              Growth Suggestions
            </h3>
            <div className="p-6 bg-slate-900 text-white rounded-3xl relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-xl font-black mb-2 tracking-tight">Boost Your Visibility</h4>
                <p className="text-sm text-slate-400 mb-6">Your recent "Behind the Scenes" post is trending. Share it to Martin Connect to increase reach by 40%.</p>
                <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                  Share Now
                </button>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                <TrendingUpIcon size={120} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ClipboardList size={14} />
              Priority Queue
            </h3>
            {items.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "p-6 rounded-3xl border transition-all group relative overflow-hidden",
                  item.done 
                    ? "bg-slate-50 border-slate-100 opacity-60" 
                    : "bg-white border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200"
                )}
              >
                <div className="flex items-start gap-6">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                    item.type === 'meeting' ? "bg-blue-50 text-blue-500" :
                    item.type === 'email' ? "bg-amber-50 text-amber-500" :
                    "bg-purple-50 text-purple-500"
                  )}>
                    {item.type === 'meeting' ? <Calendar size={24} /> :
                     item.type === 'email' ? <Mail size={24} /> :
                     <CheckSquare size={24} />}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-black text-slate-900 tracking-tight">{item.title}</h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Clock size={10} />
                          {item.time}
                        </span>
                      </div>
                      {item.done ? (
                        <CheckCircle2 className="text-emerald-500" size={20} />
                      ) : (
                        <button className="w-6 h-6 rounded-full border-2 border-slate-200 hover:border-blue-500 transition-colors" />
                      )}
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap size={12} className="text-blue-500" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Intelligence Prep:</span>
                      </div>
                      <p className="text-sm font-bold text-slate-700 leading-relaxed">{item.prep}</p>
                    </div>

                    {item.agenda && (
                      <div className="flex items-start gap-3 pt-2">
                        <FileText size={14} className="text-slate-400 mt-1" />
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Agenda / Context</span>
                          <p className="text-xs font-bold text-slate-500">{item.agenda}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <AlertCircle size={14} className="text-orange-500" />
                Prep Status
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                    <span className="text-slate-500">Meeting Readiness</span>
                    <span className="text-blue-500">85%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[85%]" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    Agendas in place for all meetings
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    Pre-reads sent to participants
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-400 italic">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-200" />
                    Action items from previous sync pending
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl">
              <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">Daily Directive</h3>
              <p className="text-sm font-bold text-blue-900 leading-relaxed italic">
                "Focus on the Phoenix integration today. The technical blockers are resolved, momentum is key for the 14:00 sync."
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TrendingUpIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
