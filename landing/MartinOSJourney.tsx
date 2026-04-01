import { useRef } from "react";
import { useScroll, useTransform, motion } from "motion/react";
import { LogicWidget } from "./LogicWidget";
import ThreeBackground from "./three/ThreeBackground";

export default function MartinOSJourney() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Camera Zoom & Perspective shifts
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6], [0.8, 1, 1.2, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]); // Fade out the initial title
  const consoleOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]); // Fade in the console
  const heartTextOpacity = useTransform(scrollYProgress, [0.25, 0.4], [1, 0]); // Fade out "Processing Intelligence"
  const widgetOpacity = useTransform(scrollYProgress, [0.35, 0.5], [0, 1]); // Fade in widgets
  const rotation = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 2]);

  return (
    <div ref={containerRef} style={{ position: 'relative' }} className="h-[500vh] bg-onyx pt-32">
      <ThreeBackground progress={scrollYProgress} />
      {/* Sticky Container - This holds the "Journey" in place */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Phase 1: The Initial Hook */}
        <motion.h1 style={{ opacity }} className="absolute text-5xl font-black text-silver z-20">
          One Command. Total Control.
        </motion.h1>

        {/* Phase 2: The Core Console (Fixed) */}
        <motion.div 
          style={{ opacity: consoleOpacity, scale }}
          className="relative z-10 w-full max-w-4xl aspect-video rounded-3xl border border-white/20 bg-white/5 backdrop-blur-2xl shadow-2xl flex flex-col items-center justify-center"
        >
          {/* Phase 3: The Widgets (They fly in based on scroll position) */}
          <motion.div style={{ opacity: widgetOpacity }} className="absolute -left-20 top-20">
            <LogicWidget 
              systemNumber="06" 
              title="Bottleneck Detection" 
              signal="Resource utilization > 85% in HR Dept."
              diagnosis="Reallocate 2 staff members to IT Support."
            />
          </motion.div>

          <motion.div style={{ opacity: widgetOpacity }} className="absolute -right-20 bottom-20">
            <LogicWidget 
              systemNumber="02" 
              title="Initiative Health" 
              signal="Milestone 'Backend Alpha' delayed 3 days."
              diagnosis="Critical Path shift. Recommend 48hr sprint."
            />
          </motion.div>

          {/* Center Content: The "Heart" of Martin */}
          <div className="text-center p-12">
            <div className="w-24 h-24 rounded-full border-2 border-status-blue shadow-specular mx-auto mb-6 flex items-center justify-center">
              <div className="w-12 h-12 bg-status-blue rounded-full animate-pulse" />
            </div>
            <motion.h2 style={{ opacity: heartTextOpacity }} className="text-2xl font-bold text-white uppercase tracking-widest">Processing Intelligence</motion.h2>
          </div>
        </motion.div>

        {/* Phase 4: Background Grid Floor */}
        <div className="absolute bottom-0 w-[200%] h-1/2 bg-grid-pattern opacity-10 rotateX-45 pointer-events-none" />
      </div>

      {/* Spacer for scroll depth */}
      <div className="h-[400vh]" />
    </div>
  );
}
