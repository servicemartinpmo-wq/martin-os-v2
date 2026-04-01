"use client";

import { useState } from 'react';
import OnboardingCarousel from './OnboardingCarousel';
import FreeTierOnboarding from '../FreeTierOnboarding';
import PaidTierOnboarding from '../PaidTierOnboarding';

interface OnboardingFlowProps {
  onComplete: (data: { role: string; industry: string; mode: string }) => void;
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  console.log("OnboardingFlow: rendering");
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [tier, setTier] = useState<'free' | 'paid' | null>(null);

  console.log("OnboardingFlow: state", { onboardingComplete, tier });

  if (!onboardingComplete) {
    console.log("OnboardingFlow: rendering OnboardingCarousel");
    return <OnboardingCarousel onComplete={() => {
      console.log("OnboardingFlow: OnboardingCarousel complete");
      setOnboardingComplete(true);
    }} />;
  }

  if (!tier) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white p-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-center">Choose Your Path</h1>
          <div className="flex gap-4">
            <button onClick={() => setTier('free')} className="p-8 bg-slate-800 rounded-xl hover:bg-slate-700">Free Tier</button>
            <button onClick={() => setTier('paid')} className="p-8 bg-slate-800 rounded-xl hover:bg-slate-700">Paid Tier</button>
          </div>
        </div>
      </div>
    );
  }

  return tier === 'free' ? <FreeTierOnboarding onComplete={onComplete} /> : <PaidTierOnboarding onComplete={onComplete} />;
};

export default OnboardingFlow;
