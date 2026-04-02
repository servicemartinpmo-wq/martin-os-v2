import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

interface ExecutiveLoadMeterProps {
  userId: string;
}

export default function ExecutiveLoadMeter({ userId }: ExecutiveLoadMeterProps) {
  const [load, setLoad] = useState<number>(0);
  const [diagnostic, setDiagnostic] = useState<string>('Initializing diagnostic...');
  const [loading, setLoading] = useState(false);

  const calculateLoad = async () => {
    if (!supabase) {
      setDiagnostic('Demo Mode: Load calculation disabled.');
      return;
    }
    setLoading(true);
    try {
      const { data: allTasks } = await supabase.from('tasks').select('id, ownerId');
      if (allTasks) {
        const totalTasks = allTasks.length;
        const userTasks = allTasks.filter(t => t.ownerId === userId).length;
        const loadPercentage = totalTasks > 0 ? (userTasks / totalTasks) * 100 : 0;
        
        setLoad(loadPercentage);
        
        if (loadPercentage > 70) {
          setDiagnostic("High Risk: Critical Bottleneck. Suggesting Delegation Matrix: Move 'Administrative' tasks to Support Role.");
        } else if (loadPercentage > 40) {
          setDiagnostic("Moderate Load: Monitor distribution. Some delegation may be required soon.");
        } else {
          setDiagnostic("Optimal Distribution: Leadership bandwidth is available for strategic advisory.");
        }
      }
    } catch (error) {
      console.error('Failed to calculate executive load:', error);
      setDiagnostic('Diagnostic failed. Check system logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateLoad();
  }, [userId]);

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4">
        <button 
          onClick={calculateLoad}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <RefreshCw className={cn("w-4 h-4 text-blue-400", loading && "animate-spin")} />
        </button>
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-blue-400" />
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/60">Executive Load Meter</h3>
      </div>

      <div className="flex items-end gap-2 mb-4">
        <span className={cn(
          "text-6xl font-black tracking-tighter transition-colors",
          load > 70 ? "text-rose-500" : load > 40 ? "text-amber-500" : "text-white"
        )}>
          {load.toFixed(1)}
        </span>
        <span className="text-blue-500 font-bold mb-2">%</span>
      </div>

      <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-6">
        <div 
          className={cn(
            "h-full transition-all duration-1000",
            load > 70 ? "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]" : 
            load > 40 ? "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" : 
            "bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_15px_rgba(37,99,235,0.5)]"
          )} 
          style={{ width: `${load}%` }} 
        />
      </div>

      <div className={cn(
        "p-4 rounded-2xl border flex gap-3 items-start",
        load > 70 ? "bg-rose-500/10 border-rose-500/20 text-rose-200" : 
        load > 40 ? "bg-amber-500/10 border-amber-500/20 text-amber-200" : 
        "bg-emerald-500/10 border-emerald-500/20 text-emerald-200"
      )}>
        {load > 70 ? (
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
        ) : (
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
        )}
        <p className="text-xs font-medium leading-relaxed">
          {diagnostic}
        </p>
      </div>
    </div>
  );
}
