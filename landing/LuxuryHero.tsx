import { motion, useScroll, useTransform } from 'motion/react';
import AppShowcase from './AppShowcase';
import DashboardAppShowcase from './DashboardAppShowcase';

export default function LuxuryHero({ onInitialize, onExplore }: { onInitialize: () => void, onExplore: () => void }) {
  const { scrollY } = useScroll();
  
  // Transformation for the "Journey" - elements scale and fade as you scroll
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);
  const gridRotate = useTransform(scrollY, [0, 500], [45, 20]);

  return (
    <section className="relative min-h-[150vh] bg-onyx overflow-hidden flex flex-col items-center">
      
      {/* 3D Perspective Grid Floor */}
      <motion.div 
        style={{ rotateX: gridRotate }}
        className="absolute bottom-0 w-[200%] h-[100vh] bg-grid-pattern opacity-40 pointer-events-none"
      />

      {/* Floating Specular Light (The Pulsing Core) */}
      <div className="absolute top-1/4 w-96 h-96 bg-status-blue/10 rounded-full blur-[120px] animate-pulse" />

      {/* Content Journey */}
      <motion.div 
        style={{ opacity, scale }}
        className="relative z-10 pt-40 flex flex-col items-center text-center px-6"
      >
        <div className="inline-block px-3 py-1 mb-6 border border-white/10 rounded-full bg-white/5 backdrop-blur-md">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-silver/60">
            System Status: Operational
          </span>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-6">
          Know What Matters. We Support Leaders Who Do It All.
        </h1>

        <p className="max-w-xl text-lg text-silver/60 leading-relaxed font-light mb-10">
          For overwhelmed executives, founders, and operators who need clarity, guidance, and structure across initiatives, tasks, and performance.
        </p>

        <div className="flex gap-4 mb-12">
          <button 
            onClick={onInitialize}
            className="relative group px-8 py-4 bg-white text-black font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-specular overflow-hidden"
          >
            <span className="relative z-10">Initialize System</span>
            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[45deg] group-hover:left-[150%] transition-all duration-700 ease-in-out" />
          </button>
          
          <button 
            onClick={onExplore}
            className="px-8 py-4 border border-white/10 text-white font-bold rounded-full backdrop-blur-xl hover:bg-white/5 transition-colors"
          >
            Explore Tiers 1-5
          </button>
        </div>
      </motion.div>

      {/* Preview of the Dashboard (The Laminated Reveal) */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 300, damping: 20 } }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-20 mt-16 w-full max-w-6xl px-4"
      >
        <div className="aspect-video rounded-2xl border border-white/20 bg-white/10 backdrop-blur-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),_inset_0_1px_1px_rgba(255,255,255,0.2)] overflow-hidden relative group">
          {/* Dashboard Header Simulation */}
          <div className="h-12 border-b border-white/10 flex items-center px-6 gap-2">
             <div className="h-2 w-2 rounded-full bg-red-500/50" />
             <div className="h-2 w-2 rounded-full bg-yellow-500/50" />
             <div className="h-2 w-2 rounded-full bg-green-500/50" />
             <div className="ml-auto text-[10px] text-white/20 font-mono tracking-widest">MARTIN OS v2.0</div>
          </div>
          
          {/* Inner Content Blur Mask */}
          <div className="p-8 opacity-40 group-hover:opacity-100 transition-opacity duration-1000">
            <DashboardAppShowcase />
          </div>

          {/* Luxury Overlay Shadow */}
          <div className="absolute inset-0 bg-gradient-to-t from-onyx via-transparent to-transparent" />
        </div>
        
        <AppShowcase />
      </motion.div>
    </section>
  );
}
