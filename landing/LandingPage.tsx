import React from 'react';
import LuxuryHero from './LuxuryHero';
import MartinOSJourney from './MartinOSJourney';
import logo from '../../assets/pmo-ops-logo.png';

export default function LandingPage({ onInitialize, onExplore, onNavigate }: { onInitialize: () => void, onExplore: () => void, onNavigate: (page: string) => void }) {
  console.log("LandingPage: rendering");
  return (
    <div className="min-h-screen bg-[#010409] text-[#E2E8F0] font-sans overflow-x-hidden relative">
      <nav className="p-8 flex justify-between items-center fixed w-full top-0 z-50">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Martin-OS Logo" className="w-10 h-10 rounded-lg" />
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter">Martin-OS</span>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">by Martin PMO</span>
            <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">Built on deep expertise, designed to help leaders act with confidence.</span>
          </div>
        </div>
        <div className="space-x-8 text-xs font-bold uppercase tracking-widest text-slate-400">
          <button onClick={() => onNavigate('product')} className="hover:text-white transition-colors">Product</button>
          <button onClick={() => onNavigate('pricing')} className="hover:text-white transition-colors">Pricing</button>
          <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">About</button>
          <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">Contact</button>
          <button onClick={() => onNavigate('blog')} className="hover:text-white transition-colors">Blog</button>
          <button onClick={() => onNavigate('discovery')} className="hover:text-white transition-colors">Discovery Call</button>
          <button onClick={() => onNavigate('signin')} className="bg-white/5 border border-white/10 px-6 py-2 rounded-full hover:bg-white/10 transition-all">Sign In</button>
        </div>
      </nav>

      <LuxuryHero onInitialize={onInitialize} onExplore={onExplore} />
      <MartinOSJourney />

      {/* Footer: Live System Integrity */}
      <footer className="py-12 border-t border-white/5 text-center text-slate-600 text-xs font-mono">
        <p className="mb-4">
          Heartbeat: <span className="text-green-500">Active</span> | 
          EscalationEngine: <span className="text-blue-400">342 ops/s</span> | 
          AutopilotService: <span className="text-purple-400">99.9% uptime</span>
        </p>
      </footer>
    </div>
  );
}
