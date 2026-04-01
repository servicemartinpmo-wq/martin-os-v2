import { motion } from 'motion/react';

export const LogicWidget = ({ systemNumber, title, signal, diagnosis }: { systemNumber: string, title: string, signal: string, diagnosis: string }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    className="relative w-80 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-3xl shadow-embossed group"
  >
    <div className="absolute top-4 right-4 text-[10px] font-mono text-status-blue opacity-50">
      SYS-{systemNumber}
    </div>
    <h3 className="text-silver font-bold mb-3 tracking-tight">{title}</h3>
    
    <div className="space-y-4">
      <div className="p-2 rounded bg-red-500/10 border border-red-500/20">
        <p className="text-[9px] uppercase text-red-400 font-black mb-1">Signal Detected</p>
        <p className="text-xs text-silver/80">{signal}</p>
      </div>
      
      <div className="p-2 rounded bg-green-500/10 border border-green-500/20">
        <p className="text-[9px] uppercase text-green-400 font-black mb-1">AI Diagnosis</p>
        <p className="text-xs text-silver/80">{diagnosis}</p>
      </div>
    </div>
    
    {/* Specular highlight on hover */}
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
  </motion.div>
);
