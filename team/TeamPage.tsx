import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Mail, 
  Phone, 
  MoreHorizontal, 
  Shield,
  Clock,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

const mochaColors: Record<string, string> = {
  Manager: 'text-blue-600 bg-blue-50 border-blue-100',
  Owner: 'text-green-600 bg-green-50 border-green-100',
  Consulted: 'text-purple-600 bg-purple-50 border-purple-100',
  Helped: 'text-orange-600 bg-orange-50 border-orange-100',
  Accountable: 'text-red-600 bg-red-50 border-red-100',
};

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
      return data;
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'An error occurred');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('public_profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setTeamMembers(data || []);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleInviteMember = async () => {
    const email = prompt('Enter team member email:');
    if (!email) return;
    const name = prompt('Enter full name:');
    if (!name) return;

    try {
      await handleAction('add_team_member_action', { 
        email,
        name,
        role: 'Member',
        tier: 'contributor_paid'
      });

      // Refresh list
      const { data } = await supabase
        .from('public_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      setTeamMembers(data || []);
    } catch (error) {
      // Error handled by handleAction
    }
  };

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
      <div 
        className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden cursor-pointer hover:bg-slate-800 transition-all"
        onClick={() => handleAction('view_mocha_framework')}
      >
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
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500 mb-4" />
            <p className="text-sm text-slate-500">Loading team members...</p>
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500">No team members found.</p>
          </div>
        ) : teamMembers.map((member) => (
          <div key={member.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div 
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => handleAction('view_member_profile', { id: member.id })}
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-400 group-hover:bg-cyan-50 group-hover:text-white transition-all duration-300 overflow-hidden">
                  {member.avatar_url ? (
                    <img src={member.avatar_url} alt={member.full_name || member.email} className="w-full h-full object-cover" />
                  ) : (
                    (member.full_name || member.email || '?').substring(0, 2).toUpperCase()
                  )}
                </div>
                <div className="max-w-[150px]">
                  <h4 className="font-bold text-slate-900 truncate" title={member.full_name || member.email}>{member.full_name || member.email}</h4>
                  <p className="text-sm text-slate-500 capitalize">{member.role || 'Member'}</p>
                </div>
              </div>
              <button 
                className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors"
                onClick={() => handleAction('team_member_options', { id: member.id })}
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tier</span>
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border",
                  member.tier === 'enterprise' ? "bg-purple-50 text-purple-600 border-purple-100" :
                  member.tier === 'contributor_paid' ? "bg-blue-50 text-blue-600 border-blue-100" :
                  "bg-slate-50 text-slate-600 border-slate-100"
                )}>
                  {member.tier?.replace('_', ' ') || 'Community'}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500 font-medium">Activity Level</span>
                  <span className={cn(
                    "font-bold",
                    "text-cyan-600"
                  )}>Active</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      "bg-cyan-500"
                    )} 
                    style={{ width: `100%` }} 
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Joined {new Date(member.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                    onClick={() => handleAction('contact_member', { id: member.id, method: 'email' })}
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                  <button 
                    className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                    onClick={() => handleAction('contact_member', { id: member.id, method: 'phone' })}
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button 
          onClick={handleInviteMember}
          disabled={actionLoading}
          className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center group hover:bg-slate-100 transition-colors disabled:opacity-50"
        >
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
            {actionLoading ? <Loader2 className="w-6 h-6 animate-spin text-cyan-500" /> : <Users className="w-6 h-6 text-slate-400" />}
          </div>
          <h4 className="font-bold text-slate-900">{actionLoading ? "Inviting..." : "Invite Member"}</h4>
          <p className="text-sm text-slate-500 mt-1">Add new talent to your organization.</p>
        </button>
      </div>
    </div>
  );
}
