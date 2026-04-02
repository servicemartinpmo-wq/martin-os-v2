"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Users, Target, Zap, BarChart3 } from 'lucide-react';

// Mock Personalization Engine
const PersonalizationEngine = {
  adjustDensity: (size: string) => {
    console.log(`Adjusting dashboard density for organization size: ${size}`);
    // In a real app, this would update global state or localStorage
  }
};

const LaminatedCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, rotateX: -10 }}
    animate={{ opacity: 1, y: 0, rotateX: 0 }}
    exit={{ opacity: 0, y: -20, rotateX: 10 }}
    className={`bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl ${className}`}
  >
    {children}
  </motion.div>
);

interface PaidTierOnboardingProps {
  onComplete: (data: { role: string; industry: string; mode: string }) => void;
}

const PaidTierOnboarding = ({ onComplete }: PaidTierOnboardingProps) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ persona: '', industry: '', orgSize: '', painPoints: [] as string[] });

  const steps = [
    { id: 'persona', title: 'Choose Your Command' },
    { id: 'industry', title: 'Industry' },
    { id: 'orgSize', title: 'Organization Scale' },
    { id: 'calibration', title: 'Signal Calibration' },
  ];

  const handleOrgSizeSelect = (size: string) => {
    setData({ ...data, orgSize: size });
    PersonalizationEngine.adjustDensity(size);
  };

  const handleFinish = () => {
    onComplete({ role: data.persona, industry: data.industry, mode: data.persona === 'visionary' ? 'Executive' : 'Startup/Project' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <div className="absolute top-6 left-6 text-slate-500 text-sm font-medium">
        Support Leaders Who Do It All
      </div>

      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <LaminatedCard key="persona">
              <h2 className="text-3xl font-bold mb-8 text-center">Select Your Persona</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'visionary', label: 'Visionary', icon: Target },
                  { id: 'operator', label: 'Operator', icon: Zap },
                  { id: 'builder', label: 'Builder', icon: Briefcase }
                ].map((p) => (
                  <button 
                    key={p.id}
                    onClick={() => { setData({...data, persona: p.id}); setStep(1); }}
                    className="p-6 rounded-2xl bg-slate-900 border border-slate-700 hover:border-blue-500 transition-all text-center space-y-4"
                  >
                    <p.icon className="w-8 h-8 mx-auto text-blue-400" />
                    <span className="block font-bold">{p.label}</span>
                  </button>
                ))}
              </div>
            </LaminatedCard>
          )}

          {step === 1 && (
            <LaminatedCard key="industry">
              <h2 className="text-3xl font-bold mb-8 text-center">Industry</h2>
              <select 
                className="w-full bg-slate-900 border border-slate-700 p-4 text-white rounded-lg"
                onChange={(e) => { setData({...data, industry: e.target.value}); setStep(2); }}
              >
                <option value="">Select Industry...</option>
                <option value="saas">SaaS / Tech</option>
                <option value="healthcare">Healthcare</option>
                <option value="creative">Creative / Portfolio</option>
                <option value="finance">Finance</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="education">Education</option>
                <option value="non-profit">Non-Profit</option>
                <option value="government">Government</option>
              </select>
            </LaminatedCard>
          )}

          {step === 2 && (
            <LaminatedCard key="orgSize">
              <h2 className="text-3xl font-bold mb-8 text-center">Organization Size</h2>
              <div className="grid grid-cols-2 gap-4">
                {['1', '2-10', '11-50', '50+'].map((size) => (
                  <button 
                    key={size}
                    onClick={() => { handleOrgSizeSelect(size); setStep(3); }}
                    className="p-6 rounded-2xl bg-slate-900 border border-slate-700 hover:border-purple-500 transition-all"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </LaminatedCard>
          )}

          {step === 3 && (
            <LaminatedCard key="calibration">
              <h2 className="text-3xl font-bold mb-8 text-center">Signal Calibration</h2>
              <p className="text-slate-400 text-center mb-6">Rank your top pain points:</p>
              <div className="space-y-4">
                {['Decision Bottlenecks', 'Missed Deadlines', 'Strategic Misalignment'].map((point) => (
                  <div key={point} className="p-4 bg-slate-900 rounded-lg border border-slate-700 cursor-move flex items-center gap-4">
                    <BarChart3 className="text-slate-500" />
                    {point}
                  </div>
                ))}
              </div>
              <button 
                onClick={handleFinish}
                className="w-full mt-8 py-4 bg-blue-600 rounded-xl font-bold hover:bg-blue-700"
              >
                Complete Calibration
              </button>
            </LaminatedCard>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PaidTierOnboarding;
