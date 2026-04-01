import React, { useState, useEffect } from 'react';
import { User, Star, MessageSquare, Shield, Award, TrendingUp, Users, Loader2, Activity, Plus, X, CheckCircle2, Edit2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTeamCapacity, addTeamMember, updateMemberCapacity, TeamMemberCapacity } from '../services/teamCapacityService';
import { toast } from 'sonner';

const MochaMatrixTable = ({ team, loading, onUpdate }: { team: any[], loading: boolean, onUpdate: (userId: string, updates: any) => void }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<TeamMemberCapacity>>({});

  const handleStartEdit = (member: any) => {
    setEditingId(member.user_id);
    setEditData({
      load_percentage: member.load_percentage || member.capacity,
      status: member.status || 'Available',
      current_task: member.initiative || member.current_task
    });
  };

  const handleSave = async (userId: string) => {
    try {
      await onUpdate(userId, editData);
      setEditingId(null);
      toast.success('Member capacity updated.');
    } catch (error) {
      toast.error('Failed to update capacity.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pb-2 border-b border-white/5">
        <div>Member</div>
        <div>Initiative</div>
        <div>MOCHA Role</div>
        <div>Capacity</div>
        <div>Performance</div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      ) : team.length > 0 ? (
        team.map((member, i) => (
          <div key={i} className="grid grid-cols-5 items-center p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all relative">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center border border-white/5">
                <User className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">{member.full_name || member.name}</span>
                {editingId === member.user_id ? (
                  <select 
                    value={editData.status}
                    onChange={e => setEditData({...editData, status: e.target.value as any})}
                    className="bg-black/40 text-[8px] font-black text-blue-400 uppercase tracking-widest outline-none border border-white/10 rounded px-1"
                  >
                    <option value="Available">Available</option>
                    <option value="Busy">Busy</option>
                    <option value="Ooo">Ooo</option>
                    <option value="Focus">Focus</option>
                  </select>
                ) : (
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest">{member.status || 'Available'}</span>
                )}
              </div>
            </div>
            
            {editingId === member.user_id ? (
              <input 
                value={editData.current_task}
                onChange={e => setEditData({...editData, current_task: e.target.value})}
                className="bg-black/40 text-xs text-slate-400 outline-none border border-white/10 rounded px-2 py-1 w-3/4"
              />
            ) : (
              <span className="text-xs text-slate-400">{member.initiative || member.current_task || 'General Ops'}</span>
            )}

            <div>
              <span className={cn(
                "px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest",
                (member.role === 'Manager' || member.role === 'Lead') ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                member.role === 'Owner' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                member.role === 'Approver' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                'bg-slate-500/10 text-slate-400 border border-slate-500/20'
              )}>
                {member.role || 'Contributor'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {editingId === member.user_id ? (
                <input 
                  type="number"
                  min="0"
                  max="100"
                  value={editData.load_percentage}
                  onChange={e => setEditData({...editData, load_percentage: parseInt(e.target.value)})}
                  className="w-12 bg-black/40 text-[10px] font-black text-white outline-none border border-white/10 rounded px-1"
                />
              ) : (
                <>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all duration-1000", (member.load_percentage || member.capacity) > 80 ? 'bg-rose-500' : 'bg-blue-500')} style={{ width: `${member.load_percentage || member.capacity}%` }} />
                  </div>
                  <span className="text-[10px] font-black text-slate-500">{member.load_percentage || member.capacity}%</span>
                </>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className={cn("w-3 h-3", s <= (member.performance || 4) ? 'text-amber-400 fill-amber-400' : 'text-slate-700')} />
                ))}
              </div>
              
              {member.user_id && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  {editingId === member.user_id ? (
                    <button onClick={() => handleSave(member.user_id)} className="p-1 hover:bg-emerald-500/20 rounded text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                    </button>
                  ) : (
                    <button onClick={() => handleStartEdit(member)} className="p-1 hover:bg-white/10 rounded text-slate-500">
                      <Edit2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="p-12 text-center text-slate-500 italic text-sm">No team members identified in matrix.</div>
      )}
    </div>
  );
};

const AddMemberModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    role: 'Contributor',
    department: 'Operations',
    load_percentage: 0,
    status: 'Available' as 'Available' | 'Busy' | 'Ooo' | 'Focus',
    current_task: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // For demo purposes, we generate a random user_id if not authenticated
      await addTeamMember({ ...formData, user_id: crypto.randomUUID() });
      toast.success('Team member added successfully.');
      onClose();
    } catch (error) {
      toast.error('Failed to add team member.');
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
        <h2 className="text-xl font-black tracking-tighter text-white">Add Team Member</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Full Name</label>
            <input 
              required
              value={formData.full_name}
              onChange={e => setFormData({...formData, full_name: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500/50"
              placeholder="Enter name..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Role</label>
              <select 
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500/50"
              >
                <option value="Owner">Owner</option>
                <option value="Approver">Approver</option>
                <option value="Manager">Manager</option>
                <option value="Contributor">Contributor</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Department</label>
              <select 
                value={formData.department}
                onChange={e => setFormData({...formData, department: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500/50"
              >
                <option value="Operations">Operations</option>
                <option value="Tech-Ops">Tech-Ops</option>
                <option value="Finance">Finance</option>
                <option value="Legal">Legal</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Current Task / Initiative</label>
            <input 
              value={formData.current_task}
              onChange={e => setFormData({...formData, current_task: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500/50"
              placeholder="e.g. Q1 Audit"
            />
          </div>
          <button 
            disabled={isSubmitting}
            className="w-full py-4 bg-blue-600 rounded-2xl text-xs font-black uppercase tracking-widest text-white hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add Member
          </button>
        </form>
      </div>
    </div>
  );
};

const ShoutoutFeed = () => (
  <div className="space-y-4">
    {[
      { from: 'Alex R.', to: 'Sarah M.', msg: 'Incredible work on the Q1 Audit. The structural remedies were spot on.', time: '2h ago' },
      { from: 'David L.', to: 'John D.', msg: 'Thanks for the quick turnaround on the budget drift diagnostic.', time: '5h ago' },
      { from: 'Sarah M.', to: 'Alex R.', msg: 'The new MOCHA matrix is making delegation so much easier.', time: '1d ago' },
    ].map((shout, i) => (
      <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2 group hover:bg-white/10 transition-all">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">{shout.from} → {shout.to}</span>
          </div>
          <span className="text-[8px] text-slate-600 uppercase tracking-widest">{shout.time}</span>
        </div>
        <p className="text-xs text-slate-400 italic">"{shout.msg}"</p>
      </div>
    ))}
  </div>
);

export default function TeamPage({ team = [] }: { team?: any[] }) {
  const [capacityLimit, setCapacityLimit] = useState(200);
  const { capacityData, loading } = useTeamCapacity();
  const [displayTeam, setDisplayTeam] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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

  useEffect(() => {
    if (capacityData.length > 0) {
      setDisplayTeam(capacityData);
    } else if (team.length > 0) {
      setDisplayTeam(team);
    } else {
      setDisplayTeam([
        { name: 'Alex R.', initiative: 'Q1 Audit', role: 'Owner', capacity: 85, performance: 5 },
        { name: 'Sarah M.', initiative: 'Budget Drift', role: 'Manager', capacity: 60, performance: 4 },
        { name: 'John D.', initiative: 'Tech-Ops', role: 'Contributor', capacity: 45, performance: 4 },
        { name: 'David L.', initiative: 'Finance', role: 'Approver', capacity: 30, performance: 5 },
      ]);
    }
  }, [capacityData, team]);

  const handleUpdateCapacity = async (userId: string, updates: any) => {
    await updateMemberCapacity(userId, updates);
  };

  const avgUtilization = displayTeam.length > 0 
    ? Math.round(displayTeam.reduce((acc, curr) => acc + (curr.load_percentage || curr.capacity || 0), 0) / displayTeam.length)
    : 0;

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-black tracking-tighter text-white">Team & MOCHA Matrix</h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <Activity className="w-3 h-3 text-blue-400 animate-pulse" />
            <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Real-time Sync Active</span>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
            <Users className="w-4 h-4 text-blue-400" />
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Org Capacity Limit</span>
              <select 
                value={capacityLimit}
                onChange={(e) => setCapacityLimit(parseInt(e.target.value))}
                className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer"
              >
                <option value={50}>50 Members</option>
                <option value={100}>100 Members</option>
                <option value={200}>200 Members</option>
                <option value={500}>500+ Members</option>
              </select>
            </div>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            disabled={actionLoading}
            className="px-4 py-2 bg-blue-600 rounded-xl text-xs font-bold hover:bg-blue-500 transition-all text-white disabled:opacity-50"
          >
            Add Team Member
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="cinematic-panel col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-white">Authority Matrix</h3>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleAction('export_team_csv')}
                disabled={actionLoading}
                className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 transition-all disabled:opacity-50"
              >
                Export CSV
              </button>
              <button 
                onClick={() => handleAction('filter_team')}
                disabled={actionLoading}
                className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 transition-all disabled:opacity-50"
              >
                Filter
              </button>
            </div>
          </div>
          <MochaMatrixTable 
            team={displayTeam} 
            loading={loading && displayTeam.length === 0} 
            onUpdate={handleUpdateCapacity}
          />
        </div>

        <div className="space-y-8">
          <div className="cinematic-panel space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Team Shoutouts</h3>
            </div>
            <ShoutoutFeed />
            <button 
              onClick={() => handleAction('send_shoutout')}
              disabled={actionLoading}
              className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <MessageSquare className="w-4 h-4" />
              Send Shoutout
            </button>
          </div>

          <div className="cinematic-panel space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Team Capacity</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span>Overall Utilization</span>
                <span>{avgUtilization}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full rounded-full transition-all duration-1000", avgUtilization > 80 ? 'bg-rose-500' : 'bg-blue-500')} 
                  style={{ width: `${avgUtilization}%` }} 
                />
              </div>
              <p className="text-[10px] text-slate-500 italic">
                {avgUtilization > 80 
                  ? '"Team is approaching critical capacity limits."' 
                  : '"Team is currently at optimal capacity for Q1 targets."'}
              </p>
              <div className="pt-4 border-t border-white/5">
                <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-600">
                  <span>Active Members</span>
                  <span>{displayTeam.length} / {capacityLimit}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddMemberModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
