import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Palette, 
  Brain, 
  CheckCircle2, 
  Layout, 
  Settings, 
  ShieldCheck,
  Zap,
  Globe,
  Heart,
  Gamepad2,
  Leaf,
  Sparkles,
  Activity,
  RefreshCw as RefreshCwIcon,
  Info
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Preferences() {
  const [selectedTheme, setSelectedTheme] = React.useState('modern');
  const [selectedMBTI, setSelectedMBTI] = React.useState('INTJ');
  const [isApphiaModified, setIsApphiaModified] = React.useState(false);

  const themes = [
    { id: 'education', name: 'Education', icon: Globe, color: 'bg-blue-500' },
    { id: 'gaming', name: 'Gaming', icon: Gamepad2, color: 'bg-purple-500' },
    { id: 'nature', name: 'Nature', icon: Leaf, color: 'bg-green-500' },
    { id: 'beauty', name: 'Beauty', icon: Sparkles, color: 'bg-rose-500' },
    { id: 'modern', name: 'Modern Tech', icon: Zap, color: 'bg-cyan-500' },
  ];

  const mbtiTypes = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
  ];

  const handleMBTIChange = (type: string) => {
    setSelectedMBTI(type);
    setIsApphiaModified(true);
    setTimeout(() => setIsApphiaModified(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      <header>
        <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">Preferences</h1>
        <p className="text-slate-500 font-mono text-xs mt-1 uppercase tracking-widest">UI Customization & Engine Logic</p>
      </header>

      {/* Industry Themes */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-slate-900">Industry Themes</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={cn(
                "p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 group",
                selectedTheme === theme.id 
                  ? "border-blue-500 bg-blue-50 shadow-lg scale-105" 
                  : "border-slate-100 bg-white hover:border-slate-200"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform",
                theme.color
              )}>
                <theme.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-900">{theme.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Apphia Engine - MBTI Logic */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-slate-900">Apphia Engine Logic (MBTI)</h2>
        </div>
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Cognitive Processing Pattern</h3>
              <p className="text-sm text-slate-500">Modify the backend Apphia engine based on Myers-Briggs types for personalized logic flows.</p>
            </div>
            <AnimatePresence>
              {isApphiaModified && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-purple-50 text-purple-600 px-4 py-2 rounded-xl text-xs font-bold border border-purple-100 flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 animate-pulse" />
                  Engine Reconfigured
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {mbtiTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleMBTIChange(type)}
                className={cn(
                  "py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  selectedMBTI === type
                    ? "bg-purple-600 text-white shadow-lg scale-110"
                    : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                )}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Configuration</span>
            </div>
            <p className="text-sm text-slate-600 font-medium italic">
              "Apphia Engine is currently optimized for <span className="text-purple-600 font-bold not-italic">{selectedMBTI}</span> cognitive patterns. Backend logic flows are prioritizing {selectedMBTI.startsWith('I') ? 'internal analysis' : 'external interaction'} and {selectedMBTI.includes('N') ? 'abstract synthesis' : 'concrete data'}."
            </p>
          </div>
        </div>
      </section>

      {/* Media Quality Engine */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-cyan-600" />
          <h2 className="text-xl font-bold text-slate-900">Media Quality Engine</h2>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Autonomous Upscaling & Frame Interpolation</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                The Martin OS Media Engine automatically converts all incoming assets to meet enterprise standards. Our background process ensures every image is upscaled to 4K resolution and every video is interpolated to 50+ FPS using AI-driven motion estimation.
              </p>
              <div className="flex gap-4">
                <div className="bg-white px-4 py-2 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Image Standard</span>
                  <span className="text-sm font-bold text-slate-900">4K Ultra HD (3840x2160)</span>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Video Standard</span>
                  <span className="text-sm font-bold text-slate-900">50+ FPS (Fluid Motion)</span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-64 h-40 bg-slate-900 rounded-3xl flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 animate-pulse" />
              </div>
              <RefreshCwIcon className="w-8 h-8 text-cyan-400 animate-spin mb-3 relative z-10" />
              <p className="text-[10px] font-black text-white uppercase tracking-widest relative z-10">Engine Active</p>
              <p className="text-[8px] text-cyan-400 font-mono mt-1 relative z-10">Optimizing 142 Assets...</p>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance & Audits */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <h2 className="text-xl font-bold text-slate-900">Certified Compliance</h2>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'ISO 27001 Certification', status: 'Plug & Play', type: 'External Audit', date: 'Ready' },
              { name: 'SOC 2 Type II Compliance', status: 'Plug & Play', type: 'External Audit', date: 'Ready' },
              { name: 'GDPR Data Privacy Audit', status: 'Certified', type: 'Internal Audit', date: '2026-03-20' },
              { name: 'HIPAA Security Standard', status: 'Verified', type: 'Internal Audit', date: '2026-03-28' },
            ].map((audit, i) => (
              <div key={i} className="flex flex-col p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{audit.type}</span>
                  <div className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    audit.status === 'Plug & Play' ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                  )}>
                    {audit.status === 'Certified' || audit.status === 'Verified' ? <CheckCircle2 className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                    {audit.status}
                  </div>
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1">{audit.name}</h4>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-4">Status: {audit.date}</p>
                <button className={cn(
                  "w-full py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all",
                  audit.status === 'Plug & Play' ? "bg-slate-900 text-white hover:bg-blue-600" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}>
                  {audit.status === 'Plug & Play' ? 'Deploy Audit Engine' : 'View Audit Report'}
                </button>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full -mr-32 -mt-32 group-hover:bg-emerald-500/20 transition-all duration-700" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter">Compliance Disclaimer & Legal Framework</h3>
              </div>
              <div className="space-y-4 max-w-3xl">
                <p className="text-xs text-slate-400 leading-relaxed font-medium italic">
                  Martin OS provides automated compliance frameworks and internal audit tools for informational purposes only. Use of these tools does not constitute legal advice or guarantee certification by official bodies. All "Certified" statuses within this engine refer to internal system verification against industry-standard benchmarks.
                </p>
                <p className="text-xs text-slate-400 leading-relaxed font-medium italic">
                  By deploying these modules, you agree to the terms of the Martin OS Compliance Service Agreement, which incorporates legal standards for electronic records and signatures (ESIGN Act / UETA). For official external certification, please consult with an accredited third-party auditor.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20">
                  Accept & Initialize Compliance Engine
                </button>
                <button className="px-8 py-4 bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all backdrop-blur-md">
                  Download Legal Framework PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
