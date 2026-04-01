import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function IntakeForm({ onComplete }: { onComplete: (data: any) => void }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    companyName: '',
    role: '',
    industry: '',
    teamSize: '',
    revenue: '',
    goals: [] as string[],
    painPoints: [] as string[],
    tools: [] as string[],
  });

  const roles = ['Founder', 'SMB Owner', 'Office Manager', 'Freelancer', 'Creative', 'Healthcare', 'Executive', 'Startup/Project', 'Other'];
  const industries = ['Technology', 'Healthcare', 'Finance', 'Creative', 'Retail', 'Manufacturing', 'Education', 'Non-Profit', 'Other'];
  const goals = ['Increase revenue', 'Improve operations', 'Reduce workload', 'Scale team', 'Fix bottlenecks'];
  const painPoints = ['Leads not converting', 'No visibility into work', 'Team inefficiency', 'Too many tools', 'No systems / chaos'];
  const tools = ['CRM', 'Project Management', 'Marketing', 'Financial'];

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
    else onComplete(data);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="max-w-md mx-auto bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
      <h2 className="text-2xl font-bold mb-6">Step {step} of 5</h2>
      {step === 1 && (
        <>
          <input type="text" placeholder="Company Name" value={data.companyName} onChange={e => setData({...data, companyName: e.target.value})} className="w-full bg-slate-950/50 border border-white/10 p-4 rounded-xl mb-4" />
          <select value={data.role} onChange={e => setData({...data, role: e.target.value})} className="w-full bg-slate-950/50 border border-white/10 p-4 rounded-xl mb-6 text-slate-400">
            <option value="">Select Role</option>
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </>
      )}
      {step === 2 && (
        <>
          <select value={data.industry} onChange={e => setData({...data, industry: e.target.value})} className="w-full bg-slate-950/50 border border-white/10 p-4 rounded-xl mb-4 text-slate-400">
            <option value="">Select Industry</option>
            {industries.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
          <input type="text" placeholder="Team Size" value={data.teamSize} onChange={e => setData({...data, teamSize: e.target.value})} className="w-full bg-slate-950/50 border border-white/10 p-4 rounded-xl mb-4" />
          <input type="text" placeholder="Revenue Range" value={data.revenue} onChange={e => setData({...data, revenue: e.target.value})} className="w-full bg-slate-950/50 border border-white/10 p-4 rounded-xl mb-4" />
        </>
      )}
      {step === 3 && (
        <div className="mb-6">
          <p className="text-sm text-slate-400 mb-2">Primary Goals</p>
          {goals.map(g => (
            <label key={g} className="flex items-center gap-2 mb-1">
              <input type="checkbox" checked={data.goals.includes(g)} onChange={e => {
                if (e.target.checked) setData({...data, goals: [...data.goals, g]});
                else setData({...data, goals: data.goals.filter(goal => goal !== g)});
              }} />
              {g}
            </label>
          ))}
        </div>
      )}
      {step === 4 && (
        <div className="mb-6">
          <p className="text-sm text-slate-400 mb-2">Where are things breaking?</p>
          {painPoints.map(p => (
            <label key={p} className="flex items-center gap-2 mb-1">
              <input type="checkbox" checked={data.painPoints.includes(p)} onChange={e => {
                if (e.target.checked) setData({...data, painPoints: [...data.painPoints, p]});
                else setData({...data, painPoints: data.painPoints.filter(pp => pp !== p)});
              }} />
              {p}
            </label>
          ))}
        </div>
      )}
      {step === 5 && (
        <div className="mb-6">
          <p className="text-sm text-slate-400 mb-2">Tool Stack</p>
          {tools.map(t => (
            <label key={t} className="flex items-center gap-2 mb-1">
              <input type="checkbox" checked={data.tools.includes(t)} onChange={e => {
                if (e.target.checked) setData({...data, tools: [...data.tools, t]});
                else setData({...data, tools: data.tools.filter(tool => tool !== t)});
              }} />
              {t}
            </label>
          ))}
        </div>
      )}
      <div className="flex gap-4">
        {step > 1 && (
          <button onClick={handleBack} className="flex-1 bg-slate-800 text-white py-4 rounded-xl font-bold hover:bg-slate-700 transition-all">
            Back
          </button>
        )}
        <button onClick={handleNext} className="flex-1 bg-white text-slate-950 py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 hover:bg-cyan-400 transition-all">
          {step < 5 ? 'Continue' : 'Complete Intake'} <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
