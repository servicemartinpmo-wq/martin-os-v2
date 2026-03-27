import { motion } from 'framer-motion'

export default function AmbientLightLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ x: [0, 40, -30, 0], y: [0, -30, 20, 0], scale: [1, 1.02, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-10 -top-10 h-[120%] w-[120%]"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6), transparent 60%)',
          opacity: 0.4,
        }}
      />

      <motion.div
        animate={{ x: [0, -20, 30, 0], y: [0, 20, -20, 0], scale: [1, 1.015, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute h-[120%] w-[120%]"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(220,220,220,0.5), transparent 70%)',
          opacity: 0.3,
        }}
      />
    </div>
  )
}
