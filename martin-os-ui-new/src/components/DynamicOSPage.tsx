import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  Sparkles, 
  AlertCircle, 
  ChevronLeft,
  RefreshCw
} from 'lucide-react';
import DynamicUIRenderer from './DynamicUIRenderer';
import { toast } from 'sonner';
import { fetchWithLogging } from '../lib/api';

interface DynamicOSPageProps {
  path: string;
  onBack: () => void;
}

export default function DynamicOSPage({ path, onBack }: DynamicOSPageProps) {
  const [blueprint, setBlueprint] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHallucinating, setIsHallucinating] = useState(false);

  const fetchBlueprint = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithLogging('/api/os/blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      });

      setBlueprint(data);
      
      // If it's a new generation, show a special toast
      if (!data.id) {
        setIsHallucinating(true);
        setTimeout(() => setIsHallucinating(false), 3000);
      }
    } catch (err: any) {
      console.error('Hydration Error:', err);
      setError(err.message);
      toast.error('Hydration Failed', {
        description: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlueprint();
  }, [path]);

  return (
    <div className="min-h-screen bg-[#020202] text-slate-100 p-8 space-y-8 relative overflow-hidden">
      {/* Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-900/5 rounded-full blur-[150px] pointer-events-none" />

      <header className="flex justify-between items-center relative z-10">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors border border-white/5"
          >
            <ChevronLeft className="w-6 h-6 text-slate-400" />
          </button>
          <div className="space-y-1">
            <h1 className="text-4xl font-light tracking-tighter text-white/90">
              {blueprint?.title || `${path.toUpperCase()} Interface`}
              <span className="text-blue-500/50 mx-2">/</span>
              <span className="text-slate-500 text-2xl">{path}</span>
            </h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                {loading ? 'Initializing Hydrator...' : 'AI-Generated View Active'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={fetchBlueprint}
            disabled={loading}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} />
            Re-Sync
          </button>
          <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            Thinking Engine v2.0
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {loading ? (
          <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-2 border-blue-500/20 rounded-full animate-ping absolute inset-0" />
              <div className="w-20 h-20 border-2 border-blue-500 border-t-transparent rounded-full animate-spin relative z-10" />
              <Sparkles className="w-8 h-8 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-xl font-light tracking-widest uppercase text-white animate-pulse">Hallucinating UI...</p>
              <p className="text-xs text-slate-500 font-mono">Mapping Supabase schemas to glass-morphic components</p>
            </div>
          </div>
        ) : error ? (
          <div className="h-[60vh] flex flex-col items-center justify-center space-y-4 text-rose-400">
            <AlertCircle className="w-12 h-12" />
            <h2 className="text-xl font-bold uppercase tracking-widest">Hydration Error</h2>
            <p className="text-slate-400 max-w-md text-center">{error}</p>
            <button 
              onClick={fetchBlueprint}
              className="mt-4 px-6 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-rose-500/20 transition-all"
            >
              Retry Connection
            </button>
          </div>
        ) : blueprint ? (
          <div className={cn(
            "animate-in fade-in slide-in-from-bottom-4 duration-1000",
            isHallucinating && "brightness-150 scale-[1.01] transition-all"
          )}>
            <DynamicUIRenderer blueprint={blueprint} />
          </div>
        ) : null}
      </main>

      {/* Footer Status */}
      <footer className="fixed bottom-8 left-8 right-8 flex justify-between items-center text-[10px] font-mono text-slate-600 pointer-events-none">
        <div className="flex gap-6">
          <span>LATENCY: 142ms</span>
          <span>BLUEPRINT_ID: {blueprint?.id?.slice(0, 8) || 'TEMP'}</span>
          <span>ENGINE: GPT-4o</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 bg-emerald-500 rounded-full" />
          <span>HYDRATOR_READY</span>
        </div>
      </footer>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
