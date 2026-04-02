import React, { useState } from 'react';
import { 
  HelpCircle, 
  Mic, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Play, 
  Search, 
  Info,
  ChevronRight,
  ChevronLeft,
  Volume2
} from 'lucide-react';
import { AppMode } from '../../types';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface AssistedOnboardingProps {
  mode: AppMode;
  className?: string;
}

const steps = [
  { 
    id: 1, 
    title: "Welcome to Martin-OS", 
    description: "I'm your system assistant. I'm here to help you manage your organization with ease. Let's start by setting up your workspace.",
    icon: HelpCircle,
    color: 'blue'
  },
  { 
    id: 2, 
    title: "Simplified Dashboard", 
    description: "In Assisted Mode, we've made everything larger and easier to read. You'll only see the most important information.",
    icon: Zap,
    color: 'amber'
  },
  { 
    id: 3, 
    title: "Voice Commands", 
    description: "You can talk to me! Just click the microphone icon and say what you need, like 'Show me my tasks' or 'Explain this report'.",
    icon: Mic,
    color: 'green'
  },
  { 
    id: 4, 
    title: "Guided Workflows", 
    description: "We'll walk you through every process step-by-step. You'll never have to worry about missing a detail.",
    icon: Play,
    color: 'purple'
  }
];

export default function AssistedOnboarding({ mode, className }: AssistedOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isCompleted) {
    return (
      <div className={cn("bg-white border-4 border-slate-900 rounded-3xl p-12 text-center", className)}>
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="text-green-600" size={48} />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-4">You're All Set!</h2>
        <p className="text-xl text-slate-600 mb-12 max-w-lg mx-auto leading-relaxed">
          Your workspace is now optimized for Assisted Mode. I'll be here whenever you need help.
        </p>
        <button 
          onClick={() => setIsCompleted(false)}
          className="px-12 py-6 bg-slate-900 text-white rounded-2xl text-xl font-bold uppercase tracking-widest transition-all hover:scale-105 shadow-2xl shadow-slate-900/20"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const step = steps[currentStep];

  return (
    <div className={cn("bg-slate-50 border-4 border-slate-200 rounded-3xl p-12 relative overflow-hidden", className)}>
      <div className="absolute top-0 right-0 p-12 opacity-5">
        <step.icon size={240} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className={cn("p-4 rounded-2xl", `bg-${step.color}-100`)}>
              <step.icon className={cn(`text-${step.color}-600`)} size={32} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Step {step.id} of {steps.length}</h3>
              <h2 className="text-3xl font-black text-slate-900">{step.title}</h2>
            </div>
          </div>
          <button className="p-4 bg-white border-2 border-slate-200 text-slate-400 rounded-2xl hover:text-slate-900 transition-colors">
            <Volume2 size={24} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-16"
          >
            <p className="text-2xl text-slate-700 leading-relaxed font-medium">
              {step.description}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <button 
            disabled={currentStep === 0}
            onClick={prev}
            className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-slate-200 text-slate-400 rounded-2xl text-lg font-bold uppercase tracking-widest transition-all hover:text-slate-900 disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={24} />
            Back
          </button>
          
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  i === currentStep ? "bg-slate-900 w-8" : "bg-slate-200"
                )} 
              />
            ))}
          </div>

          <button 
            onClick={next}
            className="flex items-center gap-3 px-12 py-6 bg-slate-900 text-white rounded-2xl text-xl font-bold uppercase tracking-widest transition-all hover:scale-105 shadow-xl shadow-slate-900/20"
          >
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="mt-16 pt-12 border-t-2 border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Explain This', icon: Info, text: 'Get a simple explanation of any feature.' },
          { label: 'Intelligence Helper', icon: MessageSquare, text: 'Chat with your assistant anytime.' },
          { label: 'Voice Mode', icon: Mic, text: 'Use your voice to control the system.' },
        ].map((feature, i) => (
          <div key={i} className="flex items-start gap-4 p-6 bg-white rounded-2xl border-2 border-slate-100">
            <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
              <feature.icon size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">{feature.label}</h4>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
