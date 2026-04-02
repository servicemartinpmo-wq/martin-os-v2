"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FreeTierOnboardingProps {
  onComplete: (data: { role: string; industry: string; mode: string }) => void;
}

const FreeTierOnboarding = ({ onComplete }: FreeTierOnboardingProps) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ industry: '', role: '', mission: '', vision: '' });
  const [isInitializing, setIsInitializing] = useState(false);

  const nextStep = () => setStep(s => s + 1);

  const handleFinish = () => {
    setIsInitializing(true);
    // Simulate initialization
    setTimeout(() => {
        onComplete({ role: data.role, industry: data.industry, mode: 'Assisted' });
    }, 3000);
  };

  if (isInitializing) {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-mono space-y-4"
            >
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>Calibrating {data.industry || 'Industry'} Frameworks...</motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>Mapping {data.role || 'Role'} Command Center...</motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>Aligning Vision to Execution Modules...</motion.div>
            </motion.div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          className="max-w-2xl w-full space-y-8"
        >
          {step === 1 && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-center">Define Your Command</h1>
              <div className="grid grid-cols-2 gap-4">
                <select 
                  className="bg-slate-800 border-b-2 border-blue-500 p-4 text-white rounded-t-lg"
                  onChange={(e) => setData({...data, industry: e.target.value})}
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
                <select 
                  className="bg-slate-800 border-b-2 border-purple-500 p-4 text-white rounded-t-lg"
                  onChange={(e) => setData({...data, role: e.target.value})}
                >
                  <option value="">Select Role...</option>
                  <option value="founder">Founder / SMB</option>
                  <option value="executive">Executive</option>
                  <option value="freelance">Freelancer</option>
                </select>
              </div>
              <button onClick={nextStep} disabled={!data.industry || !data.role} className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50">
                Initialize Environment
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-center">The Mission</h1>
              <p className="text-slate-400 text-center">Where are you today? Describe your primary operational bottleneck in one sentence.</p>
              <input 
                type="text"
                className="w-full bg-slate-900 border border-slate-700 p-4 rounded-lg font-mono text-green-400"
                placeholder="> Enter bottleneck..."
                onChange={(e) => setData({...data, mission: e.target.value})}
              />
              <button onClick={nextStep} disabled={!data.mission} className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50">
                Set Mission
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-center">The Vision</h1>
              <div className="grid grid-cols-2 gap-8">
                <div className="bg-slate-800 p-6 rounded-lg opacity-50">
                    <h3 className="font-bold mb-2">Current State</h3>
                    <p className="text-sm">{data.mission}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-900 to-purple-900 p-6 rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                    <h3 className="font-bold mb-2">Future State</h3>
                    <textarea 
                        className="w-full bg-transparent border-none focus:ring-0 text-sm"
                        placeholder="In 12 months, what does 'Mission Accomplished' look like?"
                        onChange={(e) => setData({...data, vision: e.target.value})}
                    />
                </div>
              </div>
              <button onClick={handleFinish} disabled={!data.vision} className="w-full py-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50">
                Finish & Calibrate
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FreeTierOnboarding;
