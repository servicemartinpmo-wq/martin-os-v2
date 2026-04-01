import React, { useState } from 'react';
import { motion } from 'motion/react';
import { fetchWithLogging } from '../../lib/api';

interface AgenticCardProps {
  title: string;
  intent: string;
  initialData?: any;
}

export const AgenticCard: React.FC<AgenticCardProps> = ({ title, intent, initialData = {} }) => {
  const [data, setData] = useState(initialData);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async () => {
    setIsProcessing(true);
    try {
      const patch = await fetchWithLogging('/api/agent-dispatcher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ intent, context_data: data, current_page: window.location.pathname })
      });
      setData({ ...data, ...patch });
    } catch (error: any) {
      console.error("Dispatcher error:", error);
      setData({ ...data, status_message: "Error connecting to Apphia: " + error.message });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div 
      className="relative overflow-hidden rounded-xl border border-white/20 bg-slate-900/50 p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_10_20px_rgba(0,0,0,0.4)] backdrop-blur-md"
      whileHover={{ y: -2 }}
    >
      {/* Rim Lighting Effect */}
      <div className="absolute -inset-px rounded-xl border border-cyan-500/30 opacity-50 pointer-events-none" />
      
      <h3 className="mb-2 text-lg font-bold tracking-tight text-white uppercase relative z-10">{title}</h3>
      <div className="text-sm text-slate-300 mb-6 relative z-10 min-h-[40px]">
        {data.status_message || "Awaiting signal..."}
      </div>

      <button 
        onClick={handleAction}
        disabled={isProcessing}
        className="relative z-10 w-full rounded-md bg-cyan-600 px-4 py-2 text-xs font-bold text-white shadow-[0_2px_0_rgb(8,145,178),0_4px_6px_rgba(0,0,0,0.2)] active:translate-y-[2px] active:shadow-none disabled:opacity-50 transition-all"
      >
        {isProcessing ? "APPHIA THINKING..." : "EXECUTE DIAGNOSTIC"}
      </button>
    </motion.div>
  );
};
