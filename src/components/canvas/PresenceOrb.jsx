'use client'

import { useMartinStore } from '@/store/useMartinStore'

const STATE_CONFIG = {
  idle: {
    color: 'var(--accent)',
    animName: 'presenceBreath',
    animDur: '4s',
    shadow: '0 0 20px color-mix(in oklab, var(--accent) 25%, transparent)',
    label: 'Ready',
  },
  thinking: {
    color: 'var(--accent)',
    animName: 'presencePulse',
    animDur: '0.8s',
    shadow: '0 0 30px color-mix(in oklab, var(--accent) 40%, transparent)',
    label: 'Thinking…',
  },
  executing: {
    color: 'var(--success)',
    animName: 'presencePulse',
    animDur: '1s',
    shadow: '0 0 25px color-mix(in oklab, var(--success) 35%, transparent)',
    label: 'Executing',
  },
  alert: {
    color: 'var(--warning)',
    animName: 'presencePulse',
    animDur: '0.5s',
    shadow: '0 0 35px color-mix(in oklab, var(--warning) 40%, transparent)',
    label: 'Alert',
  },
}

export default function PresenceOrb({ size = 40 }) {
  const presenceState = useMartinStore((s) => s.presenceState)
  const config = STATE_CONFIG[presenceState] || STATE_CONFIG.idle

  return (
    <div className="flex items-center gap-2 presence-orb-wrap">
      <div
        className="relative rounded-full presence-orb-outer"
        style={{ width: size, height: size }}
      >
        <div
          className="absolute inset-0 rounded-full presence-orb-glow"
          style={{
            background: `radial-gradient(circle at 35% 32%, color-mix(in oklab, ${config.color} 60%, white 20%), ${config.color}, transparent)`,
            boxShadow: config.shadow,
            animation: `${config.animName} ${config.animDur} ease-in-out infinite`,
          }}
        />
        <div
          className="absolute inset-[3px] rounded-full"
          style={{
            background: `radial-gradient(circle at 40% 35%, color-mix(in oklab, ${config.color} 80%, white 30%), ${config.color})`,
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3)',
          }}
        />
      </div>
      {size >= 30 && (
        <span className="text-[10px] uppercase tracking-[0.1em]" style={{ color: 'var(--text-muted)' }}>
          {config.label}
        </span>
      )}
    </div>
  )
}
