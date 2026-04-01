import React, { useEffect, useState } from 'react';
import { 
  Share2, 
  Heart, 
  MessageCircle, 
  Eye,
  Calendar,
  Users,
  TrendingUp,
  Globe,
  Instagram,
  Twitter,
  Youtube,
  Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

export default function CreativePortfolio() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const handleAction = async (actionName: string, payload: any = {}) => {
    try {
      setActionLoading(true);
      const res = await fetch(`/api/pmo/${actionName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Action failed');
      toast.success(`Action ${actionName} completed`);
      return data;
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'An error occurred');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const fetchStories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('build_stories')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setStories(data || []);
    } catch (err) {
      console.error('Error fetching stories:', err);
      toast.error('Failed to load portfolio stories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleLike = async (e: React.MouseEvent, storyId: string) => {
    e.stopPropagation();
    await handleAction('like_story', { id: storyId });
  };

  const handleShare = async (e: React.MouseEvent, storyId: string) => {
    e.stopPropagation();
    await handleAction('share_story', { id: storyId });
  };

  return (
    <div className="p-8 space-y-12 max-w-7xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-serif text-slate-900">Creative Studio</h2>
          <p className="text-slate-500 mt-2 font-medium tracking-wide">Editorial Portfolio & Audience Intelligence</p>
        </div>
        <div className="flex gap-4">
          <div className="flex -space-x-2">
            {[Globe, Share2, Youtube].map((Icon, i) => (
              <div 
                key={i} 
                className="w-10 h-10 rounded-full bg-white border-2 border-slate-50 flex items-center justify-center shadow-sm text-slate-400 hover:text-cyan-500 transition-colors cursor-pointer"
                onClick={() => handleAction('view_social_stats', { platform: i === 0 ? 'web' : i === 1 ? 'share' : 'youtube' })}
              >
                <Icon className="w-5 h-5" />
              </div>
            ))}
          </div>
          <button 
            onClick={() => handleAction('publish_story')}
            disabled={actionLoading}
            className="px-6 py-2 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-50"
          >
            Publish New
          </button>
        </div>
      </header>

      {/* Audience Intelligence */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { id: 'total_reach', label: 'Total Reach', value: '1.2M', trend: '+12%', icon: Globe },
          { id: 'engagement_rate', label: 'Engagement Rate', value: '4.8%', trend: '+0.5%', icon: Heart },
          { id: 'conversion', label: 'Conversion', value: '2.4%', trend: '-0.2%', icon: TrendingUp },
          { id: 'active_leads', label: 'Active Leads', value: '842', trend: '+48', icon: Users },
        ].map((stat, i) => (
          <div 
            key={i} 
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-cyan-200"
            onClick={() => handleAction('view_metric_detail', { id: stat.id })}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={cn(
                "text-xs font-bold px-2 py-1 rounded-full",
                stat.trend.startsWith('+') ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
              )}>{stat.trend}</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Editorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-cyan-500 mb-4" />
            <p className="text-slate-500">Loading portfolio...</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-slate-50 rounded-[3rem] border border-slate-100">
            <p className="text-slate-500">No stories found in the portfolio.</p>
          </div>
        ) : stories.map((story) => (
          <div 
            key={story.id} 
            className="group cursor-pointer"
            onClick={() => handleAction('view_story_detail', { id: story.id })}
          >
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-cyan-100/50">
              <img 
                src={story.image_url || `https://picsum.photos/seed/${story.id}/800/1000`} 
                alt={story.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              {/* Laminated Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="flex gap-2 mb-4">
                  {(story.tags || []).slice(0, 2).map((tag: string) => (
                    <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-md text-[10px] font-bold rounded-full uppercase tracking-widest border border-white/20">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl font-bold leading-tight mb-2">{story.title}</h3>
                <p className="text-sm text-white/70 line-clamp-2 font-medium">{story.summary || story.content}</p>
                
                <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      className="flex items-center gap-1.5 hover:text-pink-400 transition-colors"
                      onClick={(e) => handleLike(e, story.id)}
                    >
                      <Heart className="w-4 h-4" />
                      <span className="text-xs font-bold">1.2k</span>
                    </button>
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4" />
                      <span className="text-xs font-bold">4.5k</span>
                    </div>
                  </div>
                  <button 
                    className="hover:text-cyan-400 transition-colors"
                    onClick={(e) => handleShare(e, story.id)}
                  >
                    <Share2 className="w-4 h-4 text-white/50 hover:text-white transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Marketing Insights */}
      <div 
        className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden cursor-pointer hover:bg-slate-800 transition-all"
        onClick={() => handleAction('view_marketing_insights')}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[100px] -mr-48 -mt-48" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-4">Audience Sentiment & Projections</h3>
            <p className="text-slate-400 leading-relaxed mb-8">
              Your latest post on "Automating the Messy Middle" is trending in the top 5% of creative tech circles. 
              The algorithm suggests a follow-up video focusing on the "Middle" phase to maximize retention.
            </p>
            <div className="space-y-4">
              {[
                { label: 'Positive Sentiment', value: 92 },
                { label: 'Viral Potential', value: 78 },
                { label: 'Audience Retention', value: 85 },
              ].map((metric, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span>{metric.label}</span>
                    <span className="text-cyan-400">{metric.value}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${metric.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square bg-white/5 rounded-[2rem] border border-white/10 p-6 flex flex-col justify-between">
              <Share2 className="w-8 h-8 text-cyan-400" />
              <div>
                <p className="text-2xl font-bold">+2.4k</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">New Followers</p>
              </div>
            </div>
            <div className="aspect-square bg-white/5 rounded-[2rem] border border-white/10 p-6 flex flex-col justify-between">
              <Globe className="w-8 h-8 text-pink-400" />
              <div>
                <p className="text-2xl font-bold">+1.8k</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Engagements</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
