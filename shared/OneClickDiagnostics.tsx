import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  ArrowRight, 
  Zap, 
  Target, 
  Settings, 
  TrendingUp, 
  Cpu, 
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { AppMode } from '../../types';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface OneClickDiagnosticsProps {
  mode: AppMode;
  className?: string;
}

const questions = [
  { id: 1, text: "How clearly defined is your organization's North Star Metric?", category: 'Strategy' },
  { id: 2, text: "Are your operational processes documented and optimized for throughput?", category: 'Operations' },
  { id: 3, text: "What is your current customer acquisition cost (CAC) vs. lifetime value (LTV)?", category: 'Growth' },
  { id: 4, text: "How frequently do you perform security and compliance audits?", category: 'Risk' },
  { id: 5, text: "Is your technology stack scalable for 10x growth?", category: 'Tech' },
  { id: 6, text: "How engaged and active is your user community?", category: 'Community' },
  { id: 7, text: "How well do your internal teams and external partners collaborate?", category: 'Connective' },
  { id: 8, text: "How strong is your brand presence and awareness in the market?", category: 'Brand Awareness' },
];

export default function OneClickDiagnostics({ mode, className }: OneClickDiagnosticsProps) {
  const [step, setStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers({ ...answers, [questionId]: value });
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const reset = () => {
    setStep(0);
    setIsCompleted(false);
    setAnswers({});
  };

  if (isCompleted) {
    return (
      <div className={cn("bg-white border border-slate-100 rounded-2xl p-8", className)}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-2xl">
              <CheckCircle2 className="text-green-500" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Diagnostic Complete</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Org Intelligence Model (15D)</p>
            </div>
          </div>
          <button onClick={reset} className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors">
            Retake Diagnostic
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">Strategic Diagnosis</h3>
            <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <Target className="text-blue-500" size={18} />
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Growth Constraints</span>
              </div>
              <p className="text-sm text-blue-900 font-medium leading-relaxed mb-4">
                Your strategic alignment is strong, but market positioning shows a gap in product-led growth acquisition.
              </p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-500 text-white text-[8px] font-bold rounded uppercase tracking-tighter">Action Required</span>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Priority: High</span>
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="text-slate-500" size={18} />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Strategic Recommendations</span>
              </div>
              <ul className="space-y-2">
                {['Refine Value Proposition', 'Implement Hooked Model', 'Review Ansoff Matrix'].map((rec, i) => (
                  <li key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                    <div className="w-1 h-1 rounded-full bg-slate-400" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
            
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 mt-8">Brand & Community</h3>
            <div className="p-5 bg-purple-50 rounded-2xl border border-purple-100">
              <div className="flex items-center gap-2 mb-3">
                <Target className="text-purple-500" size={18} />
                <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">Brand Presence</span>
              </div>
              <p className="text-sm text-purple-900 font-medium leading-relaxed mb-4">
                Community engagement is growing, but brand awareness requires more targeted campaigns to reach key demographics.
              </p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-purple-500 text-white text-[8px] font-bold rounded uppercase tracking-tighter">Action Required</span>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Priority: Medium</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">Operational Diagnosis</h3>
            <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100">
              <div className="flex items-center gap-2 mb-3">
                <Settings className="text-amber-500" size={18} />
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Operational Gaps</span>
              </div>
              <p className="text-sm text-amber-900 font-medium leading-relaxed mb-4">
                Process throughput is currently limited by a bottleneck in the quality assurance phase.
              </p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-500 text-white text-[8px] font-bold rounded uppercase tracking-tighter">Action Required</span>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Priority: Medium</span>
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="text-slate-500" size={18} />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Tech Gaps</span>
              </div>
              <ul className="space-y-2">
                {['Upgrade CI/CD Pipeline', 'Implement Automated Testing', 'Review Data Maturity'].map((rec, i) => (
                  <li key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                    <div className="w-1 h-1 rounded-full bg-slate-400" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
            
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 mt-8">Connective Diagnosis</h3>
            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-2 mb-3">
                <Settings className="text-emerald-500" size={18} />
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Collaboration Gaps</span>
              </div>
              <p className="text-sm text-emerald-900 font-medium leading-relaxed mb-4">
                Internal teams are well-connected, but external partner collaboration lacks a centralized communication channel.
              </p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-bold rounded uppercase tracking-tighter">Action Required</span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Priority: Low</span>
              </div>
            </div>
          </div>
        </div>

        <button className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all hover:bg-slate-800 flex items-center justify-center gap-2">
          <Zap size={16} />
          Generate Full Strategic Roadmap
        </button>
      </div>
    );
  }

  return (
    <div className={cn("bg-slate-900 text-white rounded-2xl p-8 relative overflow-hidden", className)}>
      <div className="absolute top-0 right-0 p-12 opacity-10">
        <ClipboardCheck size={160} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-blue-500/20 rounded-2xl mb-4">
            <ClipboardCheck className="text-blue-400" size={32} />
          </div>
          <h2 className="text-3xl font-black mb-2">One-Click Diagnostics</h2>
          <p className="text-slate-400 text-sm">
            Answer 20–30 questions to generate a comprehensive strategic and operational diagnosis of your organization.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Question {step + 1} of {questions.length}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{Math.round(((step + 1) / questions.length) * 100)}% Complete</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500 ease-out" 
              style={{ width: `${((step + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mb-12"
          >
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">{questions[step].category}</span>
            <h3 className="text-2xl font-bold mb-8">{questions[step].text}</h3>
            
            <div className="grid grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => handleAnswer(questions[step].id, val)}
                  className="h-16 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center hover:bg-white/10 hover:border-blue-500/50 transition-all group"
                >
                  <span className="text-lg font-black group-hover:text-blue-400">{val}</span>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">
                    {val === 1 ? 'Very Low' : val === 5 ? 'Very High' : ''}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-center gap-4">
          <button 
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
            className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setStep(step + 1)}
            disabled={step === questions.length - 1}
            className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
