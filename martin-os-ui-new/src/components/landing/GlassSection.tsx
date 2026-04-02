import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

type GlassSectionProps = {
  background: string;
  title: string;
  content: string;
};

export default function GlassSection({ background, title, content }: GlassSectionProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Subtle parallax effect: move background slightly slower than scroll
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={ref} style={{ position: 'relative' }} className="w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Cinematic Background */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <img
          src={background}
          alt={title}
          className="object-cover w-full h-full scale-[1.2]"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      {/* Liquid Glass Panel */}
      <div className="relative z-10 bg-white/20 backdrop-blur-[14px] backdrop-saturate-150 border border-white/30 rounded-3xl p-12 max-w-3xl text-center shadow-xl">
        <h2 className="text-4xl font-bold text-white drop-shadow-lg">{title}</h2>
        <p className="mt-4 text-white/80">{content}</p>
      </div>
    </section>
  );
}
