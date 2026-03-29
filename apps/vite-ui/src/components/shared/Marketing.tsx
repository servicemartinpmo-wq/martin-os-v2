import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Share2, 
  Users, 
  BarChart3, 
  Plus, 
  Send, 
  Calendar, 
  MessageSquare, 
  Target, 
  Zap, 
  Clock, 
  CheckCircle2, 
  MoreVertical,
  Filter,
  Search,
  Layout,
  Linkedin,
  Twitter,
  Instagram,
  Facebook
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface Campaign {
  id: string;
  name: string;
  type: 'Email' | 'Social' | 'SMS' | 'Ads';
  status: 'Draft' | 'Scheduled' | 'Active' | 'Completed';
  audience: string;
  reach: number;
  engagement: number;
  lastUpdated: string;
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Q1 Product Launch',
    type: 'Email',
    status: 'Active',
    audience: 'All Customers',
    reach: 12400,
    engagement: 24.5,
    lastUpdated: '2 hours ago'
  },
  {
    id: '2',
    name: 'Spring Social Blast',
    type: 'Social',
    status: 'Scheduled',
    audience: 'Lookalike Audience',
    reach: 45000,
    engagement: 0,
    lastUpdated: '1 day ago'
  },
  {
    id: '3',
    name: 'Re-engagement SMS',
    type: 'SMS',
    status: 'Draft',
    audience: 'Inactive Users',
    reach: 850,
    engagement: 0,
    lastUpdated: '3 days ago'
  }
];

export default function Marketing() {
  const [activeTab, setActiveTab] = React.useState<'campaigns' | 'contacts' | 'automation'>('campaigns');
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
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">Marketing Command</h1>
          <p className="text-slate-500 font-mono text-xs mt-1 uppercase tracking-widest">Martin Marketing Power + Social Media Hub</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => showNotification('Opening Campaign Creator...')}
            className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20"
          >
            <Plus className="w-4 h-4" />
            Create Campaign
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex gap-8 border-b border-slate-200">
        {[
          { id: 'campaigns', label: 'Campaigns', icon: Target },
          { id: 'contacts', label: 'Contacts & Segments', icon: Users },
          { id: 'automation', label: 'Automations', icon: Zap },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 pb-4 text-xs font-black uppercase tracking-widest transition-all relative",
              activeTab === tab.id ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-900 rounded-full" />}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Reach', value: '1.2M', change: '+18%', icon: Share2, color: 'text-blue-600' },
          { label: 'Avg Open Rate', value: '32.4%', change: '+4.2%', icon: Mail, color: 'text-purple-600' },
          { label: 'Click Rate', value: '8.1%', change: '+1.5%', icon: BarChart3, color: 'text-emerald-600' },
          { label: 'Social Engagement', value: '142k', change: '+24%', icon: MessageSquare, color: 'text-orange-600' },
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

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Martin Campaigns</h3>
              <div className="flex gap-2">
                <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-all">
                  <Filter className="w-4 h-4" />
                </button>
                <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-all">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {mockCampaigns.map((campaign) => (
                <div key={campaign.id} className="p-6 hover:bg-slate-50/50 transition-colors group">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg",
                        campaign.type === 'Email' ? "bg-blue-500" :
                        campaign.type === 'Social' ? "bg-purple-500" :
                        campaign.type === 'SMS' ? "bg-orange-500" : "bg-slate-500"
                      )}>
                        {campaign.type === 'Email' ? <Mail className="w-6 h-6" /> :
                         campaign.type === 'Social' ? <Share2 className="w-6 h-6" /> :
                         campaign.type === 'SMS' ? <MessageSquare className="w-6 h-6" /> : <Layout className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-base font-bold text-slate-900">{campaign.name}</h4>
                          <span className={cn(
                            "text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest",
                            campaign.status === 'Active' ? "bg-emerald-50 text-emerald-600" :
                            campaign.status === 'Scheduled' ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
                          )}>
                            {campaign.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">Audience: {campaign.audience}</p>
                      </div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-slate-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reach</p>
                      <p className="text-sm font-bold text-slate-900">{campaign.reach.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Engagement</p>
                      <p className="text-sm font-bold text-slate-900">{campaign.engagement}%</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Updated</p>
                      <p className="text-sm font-bold text-slate-900">{campaign.lastUpdated}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Social Hub & Quick Actions */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full -mr-32 -mt-32" />
            <div className="relative z-10">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-6">Social Hub</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Linkedin, label: 'Martin Connect', color: 'bg-blue-600' },
                  { icon: Twitter, label: 'Martin Pulse', color: 'bg-sky-500' },
                  { icon: Instagram, label: 'Martin Vision', color: 'bg-rose-500' },
                  { icon: Facebook, label: 'Martin Social', color: 'bg-blue-700' },
                ].map((social, i) => (
                  <button key={i} className="flex flex-col items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform", social.color)}>
                      <social.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{social.label}</span>
                  </button>
                ))}
              </div>
              <button className="w-full mt-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all">
                Connect New Channel
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Automation Flows</h3>
            <div className="space-y-4">
              {[
                { name: 'Welcome Sequence', status: 'Active', icon: Zap, color: 'text-blue-600' },
                { name: 'Abandoned Cart', status: 'Inactive', icon: Clock, color: 'text-orange-600' },
                { name: 'Post-Purchase', status: 'Active', icon: CheckCircle2, color: 'text-emerald-600' },
              ].map((flow, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <flow.icon className={cn("w-4 h-4", flow.color)} />
                    <span className="text-xs font-bold text-slate-900">{flow.name}</span>
                  </div>
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    flow.status === 'Active' ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
                  )} />
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl font-bold text-xs uppercase tracking-widest hover:border-slate-400 hover:text-slate-600 transition-all">
              New Automation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
