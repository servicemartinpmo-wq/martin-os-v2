import React, { useState, useEffect } from 'react';
import { User, Calendar, Link as LinkIcon, ExternalLink, AlertCircle, Plus, Filter, ArrowUpDown, Loader2, X, CheckCircle2, Flag, Tag } from 'lucide-react';
import { cn } from '../lib/utils';
import { useActionDirectives, createActionDirective, updateActionDirective, ActionDirective } from '../services/actionDirectivesService';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

const StatusBadge = ({ status }: { status: string }) => (
  <span className={cn(
    "px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest",
    status === 'On Track' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
    status === 'Needs Attention' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
    'bg-rose-500/10 text-rose-400 border border-rose-500/20'
  )}>
    {status}
  </span>
);

// 3-Tier Readiness Signal Component
const TieredReadiness = ({ tier }: { tier: 1 | 2 | 3 }) => {
  const tiers = [
    { id: 1, label: "Strategic", color: "bg-rose-500" },
    { id: 2, label: "Operational", color: "bg-amber-500" },
    { id: 3, label: "Tactical", color: "bg-blue-500" }
  ];

  return (
    <div className="flex gap-1 items-center">
      {tiers.map(t => (
        <div 
          key={t.id}
          className={cn(
            "h-1.5 w-4 rounded-full transition-all duration-500",
            t.id <= tier ? t.color : "bg-slate-800"
          )}
          title={t.label}
        />
      ))}
      <span className="ml-2 text-[8px] font-black uppercase tracking-widest text-slate-500">
        Tier {tier} Readiness
      </span>
    </div>
  );
};

// Meeting Readiness Signal Component
const MeetingPrepSignals = ({ prepStatus }: { prepStatus: Record<string, boolean> }) => {
  const sections = [
    { label: "Clarity", items: ["Objective defined", "Agenda created", "Decisions listed"] },
    { label: "Readiness", items: ["Pre-reads attached", "Stakeholders confirmed", "Updates prepared"] },
    { label: "Execution", items: ["Action items reviewed", "Notes template ready", "Follow-up owner assigned"] }
  ];

  return (
    <div className="grid grid-cols-3 gap-2 p-4 bg-white/5 border-t border-white/10 rounded-b-2xl">
      {sections.map(section => (
        <div key={section.label} className="space-y-1">
          <p className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">{section.label}</p>
          {section.items.map(item => (
            <div key={item} className="flex items-center gap-1 text-[10px]">
              <div className={cn(
                "h-1.5 w-1.5 rounded-full",
                prepStatus[item] ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]' : 'bg-slate-700'
              )} />
              <span className={prepStatus[item] ? 'text-slate-200' : 'text-slate-500'}>{item}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const CreateDirectiveModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [formData, setFormData] = useState({
    title: '',
    detail: '',
    status: 'On Track' as 'On Track' | 'Needs Attention' | 'Delayed',
    priority_tier: 2 as 1 | 2 | 3,
    mocha_role: 'Contributor',
    department: 'Operations',
    category: 'Action Items'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createActionDirective(formData);
      toast.success('Action Directive created successfully.');
      onClose();
    } catch (error) {
      toast.error('Failed to create Action Directive.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg cinematic-panel p-8 space-y-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full">
          <X className="w-4 h-4 text-slate-400" />
        </button>
        <h2 className="text-xl font-black tracking-tighter text-white">New Action Directive</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Title</label>
            <input 
              required
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500/50"
              placeholder="Enter directive title..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Detail</label>
            <textarea 
              required
              value={formData.detail}
              onChange={e => setFormData({...formData, detail: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500/50 h-24 resize-none"
              placeholder="Enter directive details..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Priority Tier</label>
              <select 
                value={formData.priority_tier}
                onChange={e => setFormData({...formData, priority_tier: parseInt(e.target.value) as 1 | 2 | 3})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500/50"
              >
                <option value={1}>Tier 1 (Strategic)</option>
                <option value={2}>Tier 2 (Operational)</option>
                <option value={3}>Tier 3 (Tactical)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">MOCHA Role</label>
              <select 
                value={formData.mocha_role}
                onChange={e => setFormData({...formData, mocha_role: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500/50"
              >
                <option value="Owner">Owner</option>
                <option value="Approver">Approver</option>
                <option value="Contributor">Contributor</option>
                <option value="Helper">Helper</option>
              </select>
            </div>
          </div>
          <button 
            disabled={isSubmitting}
            className="w-full py-4 bg-blue-600 rounded-2xl text-xs font-black uppercase tracking-widest text-white hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Create Directive
          </button>
        </form>
      </div>
    </div>
  );
};

export default function ActionItemsPage({ actionItems: initialActionItems = [] }: { actionItems?: any[] }) {
  const [activeCategory, setActiveCategory] = useState("Action Items");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleAction = async (actionName: string, payload: any = {}) => {
    try {
      setActionLoading(true);
      const res = await fetch(`/api/pmo/${actionName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Action failed');
      toast.success(`Action ${actionName} completed`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'An error occurred');
    } finally {
      setActionLoading(false);
    }
  };
  const [sortBy, setSortBy] = useState<'newest' | 'tier' | 'flagged'>('newest');
  const categories = ["Action Items", "Follow Up", "Meetings", "Email", "Messaging", "Queue"];
  
  const { directives, loading } = useActionDirectives(activeCategory);
  const [displayDirectives, setDisplayDirectives] = useState<any[]>([]);
  const [flaggedItems, setFlaggedItems] = useState<Set<string>>(new Set());
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('users').select('id, name');
      if (error) console.error('Error fetching users:', error);
      else setUsers(data || []);
    };
    fetchUsers();
  }, []);

  const handleAssign = async (id: string, userId: string) => {
    try {
      await updateActionDirective(id, { owner_id: userId, category: 'Action Items' });
      toast.success('Task assigned and moved to Action Items.');
    } catch (error) {
      toast.error('Failed to assign task.');
    }
  };

  const toggleFlag = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFlaggedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    let sorted = [...directives];
    if (directives.length === 0 && initialActionItems.length > 0) {
      sorted = initialActionItems.filter(item => !activeCategory || activeCategory === "Action Items" || item.category === activeCategory);
    }

    if (sortBy === 'tier') {
      sorted.sort((a, b) => (a.priority_tier || 2) - (b.priority_tier || 2));
    } else if (sortBy === 'flagged') {
      sorted.sort((a, b) => {
        const aFlag = flaggedItems.has(a.id) ? 1 : 0;
        const bFlag = flaggedItems.has(b.id) ? 1 : 0;
        return bFlag - aFlag;
      });
    } else {
      sorted.sort((a, b) => new Date(b.created_at || Date.now()).getTime() - new Date(a.created_at || Date.now()).getTime());
    }
    setDisplayDirectives(sorted);
  }, [directives, initialActionItems, activeCategory, sortBy, flaggedItems]);

  // Mock prep status for demonstration
  const mockPrepStatus = {
    "Objective defined": true,
    "Agenda created": true,
    "Decisions listed": false,
    "Pre-reads attached": true,
    "Stakeholders confirmed": false,
    "Updates prepared": true,
    "Action items reviewed": false,
    "Notes template ready": true,
    "Follow-up owner assigned": false
  };

  return (
    <div className="p-8 grid grid-cols-12 gap-8">
      {/* Left Side: Dense Action List (Structured Command) */}
      <div className="col-span-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black tracking-tighter text-white">Action Directives</h2>
            <button 
              onClick={() => setIsModalOpen(true)}
              disabled={actionLoading}
              className="p-2 bg-blue-600/20 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-all group disabled:opacity-50"
            >
              <Plus className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
            </button>
          </div>
          <div className="flex gap-2">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border",
                  activeCategory === cat 
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20" 
                    : "bg-white/5 border-white/10 text-slate-500 hover:bg-white/10 hover:text-slate-300"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <div className="flex items-center gap-2">
              <Filter className="w-3 h-3" />
              <span>Filter: All</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors" onClick={() => {
              if (sortBy === 'newest') setSortBy('tier');
              else if (sortBy === 'tier') setSortBy('flagged');
              else setSortBy('newest');
            }}>
              <ArrowUpDown className="w-3 h-3" />
              <span>Sort: {sortBy === 'newest' ? 'Newest' : sortBy === 'tier' ? 'Priority Tier' : 'Flagged First'}</span>
            </div>
          </div>
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
            {displayDirectives.length} Directives Identified
          </span>
        </div>
        
        <div className="space-y-4">
          {loading && displayDirectives.length === 0 ? (
            <div className="p-12 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : displayDirectives.map(item => (
            <div key={item.id} className="group cinematic-panel hover:scale-[1.01] transition-transform cursor-pointer border-l-4 border-blue-500/50 p-0">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={(e) => toggleFlag(e, item.id)}
                        className={cn(
                          "p-1 rounded-md transition-colors",
                          flaggedItems.has(item.id) ? "bg-rose-500/20 text-rose-500" : "bg-white/5 text-slate-500 hover:text-white"
                        )}
                      >
                        <Flag className={cn("w-3 h-3", flaggedItems.has(item.id) && "fill-rose-500")} />
                      </button>
                      <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">[{item.id.slice(0, 8)}]</span>
                      <span className="text-[10px] font-black uppercase bg-white/5 px-2 py-0.5 rounded text-blue-400 border border-white/5">
                        {item.mocha_role || 'Owner'} • {item.department || 'Ops'}
                      </span>
                      <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-white/5">
                        {item.category || activeCategory}
                      </span>
                      {/* Mock Labels */}
                      <div className="flex items-center gap-1 ml-2">
                        <Tag className="w-3 h-3 text-slate-500" />
                        <span className="text-[8px] font-bold uppercase bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/20">Client</span>
                        <span className="text-[8px] font-bold uppercase bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20">Urgent</span>
                      </div>
                    </div>
                    <TieredReadiness tier={(item.priority_tier || item.priorityTier || 2) as 1 | 2 | 3} />
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                
                <h3 className="font-bold text-lg text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 mb-4">{item.detail}</p>
                
                <div className="grid grid-cols-3 gap-2 text-[10px] border-t border-white/5 pt-4 font-black uppercase tracking-widest text-slate-500">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3" />
                    <select
                      className="bg-transparent text-slate-500 outline-none cursor-pointer hover:text-white"
                      value={item.owner_id || ''}
                      onChange={(e) => handleAssign(item.id, e.target.value)}
                    >
                      <option value="">Unassigned</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {item.deadline || '48hr Mandate'}
                  </div>
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-3 h-3" />
                    {item.initiative_id ? `INI-${item.initiative_id.slice(0, 3)}` : 'INI-002'}
                  </div>
                </div>

                {/* References Section - Hidden until hover */}
                <div className="hidden group-hover:block mt-4 pt-4 border-t border-dashed border-white/10 animate-in fade-in slide-in-from-top-2">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">System References</p>
                  <div className="flex gap-4 items-center">
                    <div className="h-10 w-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-xl">📄</div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">Original Source Email</span>
                      <a href={item.original_message_link || "#"} className="text-[10px] text-blue-400 underline flex items-center gap-1">
                        View Original Source <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              {activeCategory === "Meetings" && (
                <MeetingPrepSignals prepStatus={mockPrepStatus} />
              )}
            </div>
          ))}
          {!loading && displayDirectives.length === 0 && (
            <div className="p-12 text-center space-y-4 bg-white/5 rounded-3xl border border-white/10">
              <p className="text-sm text-slate-500 italic">No action directives currently active.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side: Intake / Source Reference */}
      <div className="col-span-4 space-y-6">
        <div className="cinematic-panel h-fit sticky top-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
              <LinkIcon className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-white">Intake Intelligence</h2>
          </div>
          
          <div className="bg-black/40 p-6 border border-white/10 rounded-2xl text-sm font-mono space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Logic Module</span>
              <span className="text-[8px] text-slate-600">v1.2.0-LAMINATED</span>
            </div>
            <p className="text-slate-300 leading-relaxed">"Formal escalation detected in message thread. Resolution deadline identified as 48 hours from receipt. MOCHA role assigned to Approver based on authority matrix."</p>
            <div className="pt-4 border-t border-white/5">
              <a href="mailto:..." className="text-blue-400 underline text-xs flex items-center gap-2 hover:text-blue-300 transition-all">
                Access Original Workspace Source <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Operational Extract</h3>
            <div className="aspect-video bg-slate-900 rounded-2xl border border-white/10 flex flex-col items-center justify-center relative group overflow-hidden p-4">
              <div className="w-full h-full border border-dashed border-white/5 rounded-lg flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-1 bg-blue-500/20 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-2/3" />
                </div>
                <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">Scanning_Email_Header_v2.1</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-4">
                <p className="text-[10px] font-bold text-white mb-1">RE: Q2 Strategic Alignment</p>
                <span className="text-[8px] text-slate-400">From: CEO Office • 10:42 AM</span>
              </div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Email Snapshot Metadata</p>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="text-slate-400">Sender: <span className="text-white">CEO Office</span></div>
                <div className="text-slate-400">Priority: <span className="text-rose-400 font-bold">CRITICAL</span></div>
                <div className="text-slate-400">Thread ID: <span className="text-white">#TH-882</span></div>
                <div className="text-slate-400">Extracted: <span className="text-white">2m ago</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateDirectiveModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
