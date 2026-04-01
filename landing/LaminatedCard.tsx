import { motion } from 'motion/react';

export const LaminatedCard = ({ title, subtitle, onClick }: { title: string, subtitle: string, onClick?: () => void }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="relative group cursor-pointer"
      onClick={onClick}
    >
      {/* The Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-50 transition duration-1000"></div>
      
      {/* The Glass Container */}
      <div className="relative px-7 py-6 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-xl leading-none flex items-start space-x-6">
        <div className="flex-1 space-y-2">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{title}</p>
          <p className="text-white text-lg font-bold">{subtitle}</p>
          <button className="text-blue-400 text-sm font-medium group-hover:text-white transition duration-200">
            View System Logic →
          </button>
        </div>
      </div>
    </motion.div>
  );
};
