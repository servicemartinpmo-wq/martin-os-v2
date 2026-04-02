import React, { useState, useEffect } from 'react';
import { Activity, Shield, Zap, Target, BarChart3, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { Signal } from '../services/escalationEngine';
import { toast } from 'sonner';

export default function DiagnosticCommandCenter() {
  const [signals, setSignals] = useState<Signal[]>([]);
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
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'An error occurred');
    } finally {
      setActionLoading(false);
    }
  };

  // In a real app, use Supabase real-time subscription here
  useEffect(() => {
    // Mock data for demonstration
    setSignals([
      { id: '1', description: 'API Latency High', tier_level: 2 },
      { id: '2', description: 'VPN Access Issue', tier_level: 1 },
    ]);
  }, []);

  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
      <h2 className="text-xl font-black text-white uppercase tracking-widest mb-6">Diagnostic Command Center</h2>
      <div className="space-y-4">
        {signals.map((signal) => (
          <div key={signal.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
            <div>
              <p className="text-sm font-bold text-white">{signal.description}</p>
              <p className="text-[10px] text-blue-400 uppercase tracking-widest">Tier {signal.tier_level}</p>
            </div>
            <button 
              onClick={() => handleAction('execute_diagnostic_action', { signal })}
              disabled={actionLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-50"
            >
              Execute
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
