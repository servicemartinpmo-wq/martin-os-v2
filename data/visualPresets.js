export const appVisualProfiles = {
  dashboard: {
    key: 'dashboard',
    label: 'PMO-Ops',
    shellTheme: 'pmo',
    accent: 'gold',
    lockscreen: [
      {
        id: 'pmo-atelier',
        label: 'Executive Atelier',
        image:
          'https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=1800',
      },
      {
        id: 'pmo-orbit',
        label: 'Orbit Briefing',
        image:
          'https://images.pexels.com/photos/7130560/pexels-photo-7130560.jpeg?auto=compress&cs=tinysrgb&w=1800',
      },
    ],
  },
  'tech-ops': {
    key: 'tech-ops',
    label: 'Tech-Ops',
    shellTheme: 'tech',
    accent: 'cyan',
    lockscreen: [
      {
        id: 'tech-grid',
        label: 'Telemetry Grid',
        image:
          'https://images.pexels.com/photos/8728381/pexels-photo-8728381.jpeg?auto=compress&cs=tinysrgb&w=1800',
      },
      {
        id: 'tech-pulse',
        label: 'Pulse Diagnostics',
        image:
          'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1800',
      },
    ],
  },
  miidle: {
    key: 'miidle',
    label: 'Miidle',
    shellTheme: 'miidle',
    accent: 'starlight',
    lockscreen: [
      {
        id: 'miidle-showroom',
        label: 'Chrome Showroom',
        image:
          'https://images.pexels.com/photos/310452/pexels-photo-310452.jpeg?auto=compress&cs=tinysrgb&w=1800',
      },
      {
        id: 'miidle-stage',
        label: 'Starlight Stage',
        image:
          'https://images.pexels.com/photos/2681319/pexels-photo-2681319.jpeg?auto=compress&cs=tinysrgb&w=1800',
      },
    ],
  },
}

export const uiPresetThemes = [
  { id: 'chrome-luxe', label: 'Chrome Luxe' },
  { id: 'glass-noir', label: 'Glass Noir' },
  { id: 'gold-signature', label: 'Gold Signature' },
]

export const densityPresets = [
  { id: 'comfortable', label: 'Comfortable' },
  { id: 'compact', label: 'Compact' },
]

export const pagePresets = [
  { id: 'executive-grid', label: 'Executive Grid' },
  { id: 'ops-hud', label: 'Ops HUD' },
  { id: 'cinematic-cards', label: 'Cinematic Cards' },
]

export const cornerPresets = [
  { id: 'rounded', label: 'Rounded' },
  { id: 'sharp', label: 'Sharp' },
]

export const animationPresets = [
  { id: 'reduced', label: 'Reduced' },
  { id: 'standard', label: 'Standard' },
  { id: 'immersive', label: 'Immersive' },
]
