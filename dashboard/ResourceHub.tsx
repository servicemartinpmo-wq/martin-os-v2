import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Box, 
  BarChart3,
  Download, 
  ExternalLink, 
  FileText, 
  HelpCircle,
  Layers, 
  Layout, 
  Play, 
  Search, 
  Settings, 
  ShieldCheck, 
  Workflow
} from 'lucide-react';
import { AppMode } from '../../types';
import { cn } from '../../lib/utils';
import { useAI } from '../../context/AIContext';
import { AIResultModal } from '../shared/AIResultModal';

interface ResourceHubProps {
  mode: AppMode;
}

export default function ResourceHub({ mode }: ResourceHubProps) {
  const { ai } = useAI();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'advisory', name: 'Advisory', icon: HelpCircle, count: 8, color: 'text-rose-500' },
    { id: 'kpis', name: 'KPIs', icon: BarChart3, count: 14, color: 'text-cyan-500' },
    { id: 'frameworks', name: 'Frameworks', icon: Layout, count: 15, color: 'text-amber-500' },
    { id: 'compliance', name: 'Compliance', icon: ShieldCheck, count: 12, color: 'text-emerald-500' },
  ];

  const handleExportAssets = async () => {
    setLoading(true);
    setIsModalOpen(true);
    try {
      const context = categories.map(c => `${c.name} (${c.count} assets)`).join(', ');
      const result = await ai.generateContent(`Analyze the following resource library categories and suggest an optimized taxonomy and 3 high-impact assets that should be prioritized for a new marketing campaign: ${context}`);
      setAiResult(result || 'No analysis generated.');
    } catch (error) {
      console.error('Export error:', error);
      setAiResult('Error analyzing assets.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8 bg-white min-h-screen text-slate-900">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
            Resource Hub
          </h1>
          <p className="text-slate-500 font-mono text-xs mt-1 uppercase tracking-widest">
            Knowledge Assets | {mode.toUpperCase()}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="SEARCH RESOURCES..." 
              className="bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-500 transition-all w-64 text-slate-900"
            />
          </div>
          <button 
            onClick={handleExportAssets}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" /> Export Assets
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat, i) => (
          <motion.div 
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-slate-200 p-6 rounded-xl hover:border-blue-500/50 transition-all group cursor-pointer shadow-sm"
          >
            <div className={cn("p-3 rounded-lg bg-slate-50 w-fit mb-4 group-hover:scale-110 transition-transform", cat.color)}>
              <cat.icon className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-1">{cat.name}</h3>
            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter">{cat.count} ASSETS AVAILABLE</div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured Workflows */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-600">
                <BarChart3 className="w-4 h-4 text-cyan-600" />
                KPIs & Frameworks
              </h2>
              <button className="text-[10px] text-cyan-600 hover:underline uppercase font-bold">Deploy Assets</button>
            </div>
            <div className="p-4 space-y-3">
              {[
                { name: 'SaaS Growth Framework', desc: 'Interactive scaling model with plug-and-play metrics.', time: 'Ready to Deploy', type: 'Framework' },
                { name: 'Unit Economics Dashboard', desc: 'Real-time KPI tracking for LTV/CAC and churn.', time: 'Live Sync', type: 'KPI' },
                { name: 'Market Penetration Strategy', desc: 'Strategic advisory document with automated projections.', time: 'Interactive', type: 'Advisory' },
              ].map((asset, i) => (
                <div key={i} className="p-4 bg-white border border-slate-100 rounded-lg flex items-center gap-4 group hover:border-cyan-500/30 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-bold text-slate-900">{asset.name}</h3>
                      <span className="text-[9px] font-black px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded uppercase tracking-widest">{asset.type}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-tight">{asset.desc}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-slate-400 font-mono uppercase tracking-widest mb-1">{asset.time}</div>
                    <button className="text-slate-400 hover:text-slate-900 transition-colors"><Download className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Bundles */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-600">
                <Box className="w-4 h-4 text-purple-600" />
                System Bundles
              </h2>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Growth Engine', systems: 5, status: 'Installed' },
                { name: 'Ops Excellence', systems: 8, status: 'Available' },
              ].map((bundle, i) => (
                <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-slate-900">{bundle.name}</h3>
                    <span className={cn(
                      "text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest",
                      bundle.status === 'Installed' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-blue-50 text-blue-600 border border-blue-100"
                    )}>
                      {bundle.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter">{bundle.systems} CORE SYSTEMS INCLUDED</div>
                  <button className="w-full py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded transition-all shadow-sm">
                    {bundle.status === 'Installed' ? 'Manage Bundle' : 'Install Bundle'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Playbooks & Frameworks */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-600">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                Active Playbooks
              </h2>
            </div>
            <div className="p-4 space-y-4">
              {[
                { title: 'Crisis Management v2.1', updated: '2d ago' },
                { title: 'M&A Integration Guide', updated: '1w ago' },
                { title: 'Remote Work Policy', updated: '3w ago' },
              ].map((playbook, i) => (
                <div key={i} className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors border border-slate-100">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{playbook.title}</div>
                    <div className="text-[9px] text-slate-400 font-mono uppercase tracking-widest">Updated {playbook.updated}</div>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-slate-600 transition-colors" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-600">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                Compliance Frameworks
              </h2>
            </div>
            <div className="p-4 space-y-4">
              {[
                { name: 'SOC2 Type II', status: 'Compliant' },
                { name: 'GDPR / CCPA', status: 'Compliant' },
                { name: 'ISO 27001', status: 'In Progress' },
              ].map((fw, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-600">{fw.name}</span>
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest",
                      fw.status === 'Compliant' ? "text-emerald-600" : "text-amber-600"
                    )}>
                      {fw.status}
                    </span>
                  </div>
                  <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className={cn(
                      "h-full rounded-full",
                      fw.status === 'Compliant' ? "bg-emerald-500 w-full" : "bg-amber-500 w-2/3"
                    )} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <AIResultModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Asset Intelligence Analysis"
        content={aiResult}
        loading={loading}
      />
    </div>
  );
}
