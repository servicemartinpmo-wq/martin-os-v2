import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Brain, 
  Lightbulb, 
  History, 
  Star, 
  Search, 
  TrendingUp, 
  MessageSquare, 
  Share2, 
  ArrowRight,
  BookOpen,
  FileText,
  Zap
} from 'lucide-react';
import { AppMode } from '../../types';
import { cn } from '../../lib/utils';
import { useAI } from '../../context/AIContext';
import { AIResultModal } from '../shared/AIResultModal';

interface KnowledgeSuperbaseProps {
  mode: AppMode;
}

export default function KnowledgeSuperbase({ mode }: KnowledgeSuperbaseProps) {
  const { ai } = useAI();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [loading, setLoading] = useState(false);

  const insights = [
    { id: '1', type: 'Strategic', title: 'Market Saturation in EMEA', content: 'Current growth patterns suggest saturation in Q4. Recommend pivot to APAC.', tags: ['Strategy', 'Growth'], confidence: 92 },
    { id: '2', type: 'Operational', title: 'Engineering Velocity Dip', content: 'Velocity decreased by 15% after shifting to remote-first. Root cause: async communication gaps.', tags: ['Ops', 'Team'], confidence: 88 },
    { id: '3', type: 'Financial', title: 'Burn Rate Optimization', content: 'Cloud infrastructure costs are 20% above benchmark. Potential savings identified in AWS reserved instances.', tags: ['Finance', 'Cloud'], confidence: 95 },
  ];

  const handleIntelligenceSynthesis = async () => {
    setLoading(true);
    setIsModalOpen(true);
    try {
      const context = insights.map(i => `${i.title}: ${i.content}`).join('\n');
      const result = await ai.generateContent(`Synthesize the following organizational insights into a cohesive strategic summary and provide 3 actionable next steps: \n${context}`);
      setAiResult(result || 'No synthesis generated.');
    } catch (error) {
      console.error('Synthesis error:', error);
      setAiResult('Error synthesizing intelligence.');
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
            Organizational Intelligence | {mode.toUpperCase()}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="QUERY THE SUPERBASE..." 
              className="bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-500 transition-all w-64 text-slate-900"
            />
          </div>
          <button 
            onClick={handleIntelligenceSynthesis}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm"
          >
            <Brain className="w-4 h-4" /> Intelligence Synthesis
          </button>
        </div>
      </div>

      {/* Top Insights Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-600">
                <Zap className="w-4 h-4 text-amber-500" />
                Real-Time Insights
              </h2>
              <div className="flex gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <span className="text-blue-600 cursor-pointer">All</span>
                <span className="hover:text-slate-900 cursor-pointer transition-colors">Strategic</span>
                <span className="hover:text-slate-900 cursor-pointer transition-colors">Operational</span>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {insights.map((insight, i) => (
                <motion.div 
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 bg-white border border-slate-100 rounded-xl group hover:border-blue-500/30 transition-all shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform border border-slate-100">
                        <Lightbulb className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-0.5">{insight.type}</div>
                        <h3 className="text-sm font-bold text-slate-900">{insight.title}</h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] text-slate-400 font-mono uppercase tracking-widest mb-1">Confidence</div>
                      <div className="text-xs font-black text-emerald-600">{insight.confidence}%</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{insight.content}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {insight.tags.map(tag => (
                        <span key={tag} className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded uppercase tracking-tighter">#{tag}</span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button className="text-slate-400 hover:text-slate-900 transition-colors"><MessageSquare className="w-4 h-4" /></button>
                      <button className="text-slate-400 hover:text-slate-900 transition-colors"><Share2 className="w-4 h-4" /></button>
                      <button className="text-slate-400 hover:text-slate-900 transition-colors"><ArrowRight className="w-4 h-4" /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Lessons Learned & Best Practices */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-600">
                <History className="w-4 h-4 text-purple-600" />
                Lessons Learned
              </h2>
            </div>
            <div className="p-4 space-y-4">
              {[
                { title: 'Project Alpha Post-Mortem', outcome: 'Failed', lesson: 'Early dependency mapping is critical.' },
                { title: 'Remote Transition Q1', outcome: 'Success', lesson: 'Async-first documentation improved clarity.' },
                { title: 'Series B Fundraising', outcome: 'Success', lesson: 'Data-driven storytelling outperformed metrics.' },
              ].map((lesson, i) => (
                <div key={i} className="space-y-1.5 p-3 bg-slate-50 border border-slate-100 rounded-lg group cursor-pointer hover:border-purple-500/30 transition-all">
                  <div className="flex justify-between items-center">
                    <div className="text-[10px] font-bold text-slate-900 group-hover:text-purple-600 transition-colors">{lesson.title}</div>
                    <span className={cn(
                      "text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest",
                      lesson.outcome === 'Success' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"
                    )}>
                      {lesson.outcome}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">"{lesson.lesson}"</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-600">
                <Star className="w-4 h-4 text-amber-500" />
                Best Practices
              </h2>
            </div>
            <div className="p-4 space-y-4">
              {[
                { title: 'Engineering Standards', icon: BookOpen },
                { title: 'Hiring Framework v4', icon: FileText },
                { title: 'Strategic Planning Cycle', icon: TrendingUp },
              ].map((bp, i) => (
                <div key={i} className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-amber-600 transition-colors border border-slate-100">
                    <bp.icon className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{bp.title}</div>
                  <ArrowRight className="w-3 h-3 text-slate-300 ml-auto group-hover:text-slate-600 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <AIResultModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Intelligence Synthesis"
        content={aiResult}
        loading={loading}
      />
    </div>
  );
}
