import React from 'react';
import { 
  Play, 
  Share2, 
  Heart, 
  MessageCircle, 
  Eye,
  Clock,
  ChevronRight,
  Lightbulb,
  Construction,
  Rocket,
  TrendingUp,
  Target,
  Users,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Zap,
  AlertCircle,
  X
} from 'lucide-react';
import { buildStories } from '../../data/mockData';
import { cn } from '../../lib/utils';
import { AppMode } from '../../types';

interface MiidleFeedProps {
  mode: AppMode;
}

export default function MiidleFeed({ mode }: MiidleFeedProps) {
  const isAssisted = mode === 'Assisted';
  const [showDisclaimer, setShowDisclaimer] = React.useState(true);

  const getTitle = () => {
    switch (mode) {
      case 'Founder/SMB': return 'ROI Stories';
      case 'Executive': return 'Strategic Build Stories';
      case 'Creative': return 'Portfolio Feed';
      case 'Healthcare': return 'Patient Outcomes';
      case 'Assisted': return 'My Stories';
      default: return 'Build Stories';
    }
  };

  const getSubTitle = () => {
    switch (mode) {
      case 'Founder/SMB': return 'Tracking the value generated from idea to execution.';
      case 'Executive': return 'High-level overview of organizational progress and milestones.';
      case 'Creative': return 'A curated view of artistic process and final outputs.';
      case 'Healthcare': return 'Documenting care paths and successful health interventions.';
      case 'Assisted': return 'A simple view of what we have built together.';
      default: return 'The messy middle from idea to execution.';
    }
  };

  const renderFounderLayout = () => (
    <div className="space-y-12">
      {buildStories.map((story) => (
        <div key={story.id} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{story.title}</h3>
              <p className="text-slate-500 mt-1">{story.summary}</p>
            </div>
            <div className="bg-green-50 px-4 py-2 rounded-2xl border border-green-100 text-right">
              <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Estimated ROI</p>
              <p className="text-xl font-bold text-green-700">+$12.5k / yr</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <TrendingUp className="w-5 h-5 text-blue-500 mb-2" />
              <p className="text-xs font-bold text-slate-400 uppercase">Efficiency</p>
              <p className="text-lg font-bold text-slate-900">+24%</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <Target className="w-5 h-5 text-purple-500 mb-2" />
              <p className="text-xs font-bold text-slate-400 uppercase">Goal Met</p>
              <p className="text-lg font-bold text-slate-900">100%</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <Users className="w-5 h-5 text-orange-500 mb-2" />
              <p className="text-xs font-bold text-slate-400 uppercase">Adoption</p>
              <p className="text-lg font-bold text-slate-900">85%</p>
            </div>
          </div>
          <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
            View Full ROI Report
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );

  const renderCreativeLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {buildStories.map((story) => (
        <div key={story.id} className="group cursor-pointer">
          <div className="aspect-square bg-slate-100 rounded-[2.5rem] overflow-hidden relative mb-4 border border-slate-200">
            <img 
              src={`https://picsum.photos/seed/${story.id}/800/800`} 
              alt={story.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30">
                <Eye className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-900 px-2">{story.title}</h3>
          <div className="flex gap-2 mt-2 px-2">
            {story.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">#{tag}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderAssistedLayout = () => (
    <div className="space-y-12 max-w-2xl mx-auto">
      {buildStories.map((story) => (
        <div key={story.id} className="bg-white border-4 border-slate-200 rounded-[3rem] p-10 shadow-xl">
          <h3 className="text-4xl font-black text-slate-900 mb-4">{story.title}</h3>
          <p className="text-2xl text-slate-600 mb-8">{story.summary}</p>
          <div className="aspect-video bg-slate-100 rounded-[2rem] overflow-hidden mb-8 border-4 border-slate-200">
            <img 
              src={`https://picsum.photos/seed/${story.id}/1280/720`} 
              alt={story.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <button className="w-full py-8 bg-cyan-600 text-white rounded-[2rem] text-3xl font-black shadow-lg hover:bg-cyan-700 transition-all flex items-center justify-center gap-4">
            <Play className="w-12 h-12 fill-white" />
            Watch Story
          </button>
        </div>
      ))}
    </div>
  );

  const renderStartupLayout = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Rocket className="w-5 h-5 text-blue-500" />
          Build Milestones
        </h3>
        <div className="space-y-6">
          {buildStories.map((story) => (
            <div key={story.id} className="relative pl-8 border-l-2 border-slate-100 pb-6 last:pb-0">
              <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-500" />
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-slate-900">{story.title}</h4>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">#{story.id}</span>
              </div>
              <p className="text-sm text-slate-500 mb-3">{story.summary}</p>
              <div className="flex gap-2">
                {story.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase tracking-tighter">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Product Velocity
        </h3>
        <div className="h-64 flex items-end gap-4 px-4">
          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
            <div key={i} className="flex-1 bg-blue-50 rounded-t-xl relative group">
              <div 
                className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-xl transition-all duration-1000" 
                style={{ height: `${h}%` }} 
              />
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-12 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-sm font-medium text-slate-600">
            "Apphia Engine: Product velocity is up 15% this week. The new CI/CD pipeline is significantly reducing deployment friction."
          </p>
        </div>
      </div>
    </div>
  );

  const renderDefaultLayout = () => (
    <div className="space-y-16">
      {buildStories.map((story) => (
        <div key={story.id} className="group relative">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
            <div className="p-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 border border-slate-200">
                  {story.id.slice(-2)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Build #{story.id.split('-')[1]}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1 font-medium uppercase tracking-widest">
                    <Clock className="w-3 h-3" />
                    Updated 2h ago
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-colors border border-blue-100">
                  Networking
                </button>
                <button className="px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-purple-100 transition-colors border border-purple-100">
                  Learning
                </button>
                <button className="px-4 py-2 bg-cyan-50 text-cyan-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-cyan-100 transition-colors border border-cyan-100">
                  Promotion
                </button>
              </div>
            </div>

            <div className="px-8">
              <div className="aspect-[16/9] bg-slate-100 relative rounded-3xl overflow-hidden group/media cursor-pointer border border-slate-200">
                <img 
                  src={`https://picsum.photos/seed/${story.id}-miidle/1280/720`} 
                  alt={story.title}
                  className="w-full h-full object-cover opacity-90 group-hover/media:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl border border-white/30 group-hover/media:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <div className="flex gap-2">
                    {story.tags.map(tag => (
                      <span key={tag} className="px-4 py-1.5 bg-white/10 backdrop-blur-xl text-white text-[10px] font-bold rounded-full uppercase tracking-widest border border-white/20">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-white/80 text-[10px] font-bold uppercase tracking-widest bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    <Users className="w-3 h-3" />
                    42 Connections
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{story.title}</h3>
                <p className="text-slate-600 leading-relaxed text-lg">{story.summary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                <div className="hidden md:block absolute top-10 left-0 right-0 h-px bg-slate-100 -z-10" />
                {story.phases.map((phase, idx) => {
                  const Icon = phase.title === 'Idea' ? Lightbulb : phase.title === 'Middle' ? Construction : Rocket;
                  return (
                    <div key={phase.id} className="space-y-4 relative">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-300",
                        phase.status === 'Completed' ? "bg-green-50 border-green-200 text-green-600" :
                        phase.status === 'In Progress' ? "bg-cyan-50 border-cyan-200 text-cyan-600 animate-pulse" :
                        "bg-slate-50 border-slate-100 text-slate-400"
                      )}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900 flex items-center gap-2">
                          {phase.title}
                          {phase.status === 'Completed' && <div className="w-1.5 h-1.5 rounded-full bg-green-500" />}
                        </h5>
                        <p className="text-sm text-slate-500 leading-snug mt-1">{phase.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <button className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors group/btn">
                    <div className="p-2 rounded-full group-hover/btn:bg-red-50 transition-colors">
                      <Heart className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold">1.2k</span>
                  </button>
                  <button className="flex items-center gap-2 text-slate-500 hover:text-cyan-500 transition-colors group/btn">
                    <div className="p-2 rounded-full group-hover/btn:bg-cyan-50 transition-colors">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold">48</span>
                  </button>
                  <button className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group/btn">
                    <div className="p-2 rounded-full group-hover/btn:bg-slate-100 transition-colors">
                      <Share2 className="w-6 h-6" />
                    </div>
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">4.5k Views</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderLayout = () => {
    switch (mode) {
      case 'Founder/SMB': return renderFounderLayout();
      case 'Creative': return renderCreativeLayout();
      case 'Assisted': return renderAssistedLayout();
      case 'Startup/Project': return renderStartupLayout();
      default: return renderDefaultLayout();
    }
  };

  return (
    <div className={cn(
      "p-8 space-y-8 max-w-4xl mx-auto transition-all duration-500",
      isAssisted && "p-12 space-y-12 max-w-6xl"
    )}>
      {mode === 'Healthcare' && showDisclaimer && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm relative group">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-black uppercase tracking-widest text-amber-900 mb-1">Healthcare Regulatory Disclaimer</h4>
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              This system is for informational and operational support only. All patient data is handled in accordance with HIPAA guidelines. This intelligence does not provide medical advice or diagnoses. Please consult a qualified healthcare professional for medical decisions.
            </p>
          </div>
          <button 
            onClick={() => setShowDisclaimer(false)}
            className="absolute top-4 right-4 p-1 text-amber-400 hover:text-amber-600 transition-colors opacity-0 group-hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <header className="flex justify-between items-center">
        <div>
          <h2 className={cn(
            "font-bold text-slate-900 tracking-tight",
            isAssisted ? "text-6xl" : "text-3xl"
          )}>{getTitle()}</h2>
          <p className={cn(
            "text-slate-500 mt-1",
            isAssisted ? "text-2xl mt-4" : "text-base"
          )}>{getSubTitle()}</p>
        </div>
        {!isAssisted && (
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-800 transition-colors">
              For You
            </button>
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-full text-sm font-bold hover:bg-slate-50 transition-colors">
              Following
            </button>
          </div>
        )}
      </header>

      {renderLayout()}
    </div>
  );
}
