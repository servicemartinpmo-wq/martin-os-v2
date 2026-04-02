import React, { useState } from 'react';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';

export default function OnboardingAssessment({ onComplete }: { onComplete: (data: any) => void }) {
  const [step, setStep] = useState(0);
  const steps = ['Connect Tools', 'Confirm Workflows', 'Add First Task', 'Invite Team', 'Launch Dashboard'];

  const handleComplete = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else onComplete({});
  };

  return (
    <div className="max-w-4xl mx-auto flex gap-8">
      <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
        <h2 className="text-2xl font-bold mb-6">{steps[step]}</h2>
        <p className="text-slate-400 mb-8">Guided onboarding step {step + 1} of {steps.length}.</p>
        <button onClick={handleComplete} className="bg-white text-slate-950 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-cyan-400">
          {step < steps.length - 1 ? 'Next Step' : 'Launch Dashboard'} <ArrowRight className="w-5 h-5" />
        </button>
      </div>
      <div className="w-64 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
        <h3 className="font-bold mb-4">Onboarding Checklist</h3>
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-3 mb-3 text-sm">
            {i <= step ? <CheckCircle className="w-5 h-5 text-cyan-500" /> : <Circle className="w-5 h-5 text-slate-600" />}
            <span className={i <= step ? 'text-white' : 'text-slate-500'}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
