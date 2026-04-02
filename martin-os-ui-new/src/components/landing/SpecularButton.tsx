import { motion, useMotionValue, useTransform } from 'motion/react';

export const SpecularButton = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Translate mouse position into a specular glint
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);
  const specularOpacity = useTransform(x, [-100, 100], [0, 0.8]);

  const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  };

  return (
    <motion.button
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className="relative px-8 py-3 bg-slate-900 border border-slate-700 rounded-full text-white font-bold group shadow-embossed"
    >
      {/* The Glint / Specular Highlight */}
      <motion.div
        style={{ x, y, opacity: specularOpacity }}
        className="absolute -inset-0.5 bg-white rounded-full blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
      />
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};
