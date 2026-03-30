import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  HelpCircle,
  Phone,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface AssistedCardProps {
  title: string;
  description: string;
  icon: any;
  status: 'Good' | 'Waiting' | 'Action';
  onClick?: () => void;
}

function AssistedCard({ title, description, icon: Icon, status, onClick }: AssistedCardProps) {
  const statusColors = {
    'Good': 'bg-green-100 text-green-700 border-green-200',
    'Waiting': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Action': 'bg-red-100 text-red-700 border-red-200'
  };

  const statusIcons = {
    'Good': CheckCircle2,
    'Waiting': Clock,
    'Action': AlertCircle
  };

  const StatusIcon = statusIcons[status];

  return (
    <button 
      onClick={onClick}
      title={description}
      className="w-full bg-white p-8 rounded-[2rem] border-4 border-slate-100 hover:border-blue-400 transition-all text-left group relative"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="p-6 bg-blue-50 rounded-3xl text-blue-600 group-hover:scale-110 transition-transform">
          <Icon className="w-12 h-12" />
        </div>
        <div className={cn("px-6 py-2 rounded-full border-2 font-bold text-lg flex items-center gap-2", statusColors[status])}>
          <StatusIcon className="w-6 h-6" />
          {status}
        </div>
      </div>
      <h3 className="text-3xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-xl text-slate-500 font-medium leading-relaxed">{description}</p>
      
      {/* Description Tooltip (Visible on Hover) */}
      <div className="absolute top-full left-0 right-0 mt-4 p-4 bg-slate-900 text-white rounded-2xl text-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none shadow-2xl border border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-bold uppercase tracking-widest text-blue-400">What is this?</span>
        </div>
        {description}
      </div>
    </button>
  );
}

export default function AssistedDashboard() {
  return (
    <div className="p-12 space-y-12 max-w-6xl mx-auto">
      <header className="flex justify-between items-center bg-blue-600 p-12 rounded-[3rem] text-white shadow-2xl shadow-blue-200">
        <div>
          <h2 className="text-5xl font-bold mb-4">Good Morning!</h2>
          <p className="text-2xl text-blue-100 font-medium">Everything is looking good today.</p>
        </div>
        <div className="flex gap-4">
          <button className="p-6 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
            <HelpCircle className="w-10 h-10" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <AssistedCard 
          title="Daily Tasks" 
          description="Check your list of things to do today." 
          icon={Calendar}
          status="Action"
        />
        <AssistedCard 
          title="Messages" 
          description="Read and reply to your recent messages." 
          icon={MessageSquare}
          status="Waiting"
        />
        <AssistedCard 
          title="Support" 
          description="Get help from your assistant or family." 
          icon={Phone}
          status="Good"
        />
        <AssistedCard 
          title="Health" 
          description="View your health updates and appointments." 
          icon={HeartPulse}
          status="Good"
        />
      </div>

      <div className="bg-slate-50 p-12 rounded-[3rem] border-4 border-dashed border-slate-200">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            ?
          </div>
          <h3 className="text-3xl font-bold text-slate-900">Need more help?</h3>
        </div>
        <p className="text-2xl text-slate-600 font-medium mb-8 leading-relaxed">
          If you're unsure about anything, you can always click the help button at the top or call your support team.
        </p>
        <button className="px-12 py-6 bg-slate-900 text-white rounded-full text-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
          Call Support Now
        </button>
      </div>
    </div>
  );
}

import { HeartPulse } from 'lucide-react';
