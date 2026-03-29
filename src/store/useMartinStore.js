import { create } from 'zustand'

/** @typedef {'martin' | 'quickit'} HomeDashboardSkin */

export const useMartinStore = create((set) => ({
  currentDomain: 'global',
  activeMode: 'founder_operator_smb',
  activeTheme: 'founder-command',
  presenceState: 'idle',
  commandOpen: false,
  signals: [],
  /** Home `/` dashboard visual: laminated enterprise vs dark trading-style skin */
  homeDashboardSkin: /** @type {HomeDashboardSkin} */ ('martin'),

  setDomain: (domain) => set({ currentDomain: domain }),
  setMode: (mode) => set({ activeMode: mode }),
  setTheme: (theme) => set({ activeTheme: theme }),
  setPresenceState: (state) => set({ presenceState: state }),
  setCommandOpen: (open) => set({ commandOpen: open }),
  setHomeDashboardSkin: (skin) =>
    set({ homeDashboardSkin: skin === 'quickit' ? 'quickit' : 'martin' }),

  addSignal: (signal) =>
    set((s) => ({ signals: [signal, ...s.signals].slice(0, 20) })),
  removeSignal: (id) =>
    set((s) => ({ signals: s.signals.filter((sig) => sig.id !== id) })),
  clearSignals: () => set({ signals: [] }),
}))
