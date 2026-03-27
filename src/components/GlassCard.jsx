export default function GlassCard({ children, className = '' }) {
  return (
    <div
      className={`group relative rounded-2xl p-[1px] transition duration-1000 ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(228,228,225,0.7))',
        boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
      }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/60" />
      <div
        className="relative rounded-2xl p-6 transition duration-1000 group-hover:bg-white/72"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.85), rgba(255,255,255,0.35))',
          backdropFilter: 'blur(30px) saturate(180%)',
          boxShadow:
            'inset 0 1px 1px rgba(255,255,255,0.9), inset 0 -3px 10px rgba(0,0,0,0.05), 0 40px 80px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.6)',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background: 'linear-gradient(120deg, rgba(255,255,255,0.6), transparent 40%)',
            opacity: 0.6,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            border: '1px solid rgba(255,255,255,0.8)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
          }}
        />
        {children}
      </div>
    </div>
  )
}
