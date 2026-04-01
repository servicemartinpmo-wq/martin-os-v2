import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  TrendingUp, 
  Mail, 
  Phone, 
  Globe, 
  Building2, 
  Briefcase,
  Filter,
  Download,
  Plus,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface Contact {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  source: 'Public' | 'Direct' | 'Referral';
  status: 'Lead' | 'Qualified' | 'Negotiation' | 'Closed';
  value: number;
  lastContact: string;
}

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    role: 'CTO',
    company: 'TechFlow Systems',
    email: 's.jenkins@techflow.io',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    source: 'Public',
    status: 'Negotiation',
    value: 45000,
    lastContact: '2 hours ago'
  },
  {
    id: '2',
    name: 'Marcus Chen',
    role: 'Head of Operations',
    company: 'Global Logistics Corp',
    email: 'm.chen@globallogistics.com',
    phone: '+1 (555) 987-6543',
    location: 'Singapore',
    source: 'Direct',
    status: 'Lead',
    value: 120000,
    lastContact: '1 day ago'
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    role: 'Founder',
    company: 'EcoVibe Retail',
    email: 'elena@ecovibe.com',
    phone: '+1 (555) 456-7890',
    location: 'Austin, TX',
    source: 'Referral',
    status: 'Qualified',
    value: 25000,
    lastContact: '3 days ago'
  }
];

export default function CRM() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [notification, setNotification] = React.useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8 relative">
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 right-8 z-50 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl font-black text-xs uppercase tracking-widest border border-white/10"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">Intelligence CRM</h1>
          <p className="text-slate-500 font-mono text-xs mt-1 uppercase tracking-widest">Martin CRM Power + Apphia Intel</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => showNotification('Exporting CRM Data...')}
            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={() => showNotification('Opening Prospect Wizard...')}
            className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20"
          >
            <Plus className="w-4 h-4" />
            Add Prospect
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Pipeline Value', value: '$1.2M', change: '+12%', icon: TrendingUp, color: 'text-emerald-600' },
          { label: 'Active Leads', value: '482', change: '+5%', icon: Users, color: 'text-blue-600' },
          { label: 'Conversion Rate', value: '24.8%', change: '+2.1%', icon: CheckCircle2, color: 'text-purple-600' },
          { label: 'Public Insights', value: '1.4k', change: 'New', icon: Globe, color: 'text-orange-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-2xl bg-slate-50", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">{stat.change}</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search contacts, companies, or public data..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all">
              <Filter className="w-4 h-4" />
            </button>
            <div className="h-10 w-px bg-slate-200 mx-2" />
            <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-100 transition-all">
              All Contacts
            </button>
            <button className="px-4 py-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition-all">
              Public Data
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Company</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Value</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Contact</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600">
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{contact.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{contact.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">{contact.company}</p>
                        <p className="text-[10px] text-slate-400">{contact.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest",
                      contact.status === 'Closed' ? "bg-emerald-50 text-emerald-600" :
                      contact.status === 'Negotiation' ? "bg-blue-50 text-blue-600" :
                      contact.status === 'Qualified' ? "bg-purple-50 text-purple-600" : "bg-slate-100 text-slate-500"
                    )}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">${contact.value.toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="h-1 w-12 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-2/3" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">{contact.lastContact}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Intelligence Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full -mr-32 -mt-32" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter">Public Intelligence (Apphia Intel)</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">New Intent Signal</p>
                <p className="text-sm font-bold">TechFlow Systems just increased cloud spending by 40%.</p>
                <p className="text-xs text-slate-400 mt-2">Source: Public Financial Filings • 12m ago</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Executive Move</p>
                <p className="text-sm font-bold">New VP of Sales at Global Logistics Corp.</p>
                <p className="text-xs text-slate-400 mt-2">Source: Martin Connect Insights • 1h ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Pipeline Velocity</h3>
          </div>
          <div className="space-y-6">
            {[
              { stage: 'Discovery', count: 12, value: '$140k', color: 'bg-slate-200' },
              { stage: 'Proposal', count: 8, value: '$320k', color: 'bg-blue-200' },
              { stage: 'Negotiation', count: 4, value: '$450k', color: 'bg-purple-200' },
              { stage: 'Closing', count: 2, value: '$290k', color: 'bg-emerald-200' },
            ].map((stage, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{stage.stage}</span>
                  <span className="text-sm font-black text-slate-900">{stage.value}</span>
                </div>
                <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", stage.color)} style={{ width: `${(stage.count / 15) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
