import { create } from 'zustand'

export const useMartinStore = create((set) => ({
  currentDomain: 'global',
  activeMode: 'founder_operator_smb',
  activeTheme: 'founder-command',
  presenceState: 'idle',
  commandOpen: false,
  signals: [],

  setDomain: (domain) => set({ currentDomain: domain }),
  setMode: (mode) => set({ activeMode: mode }),
  setTheme: (theme) => set({ activeTheme: theme }),
  setPresenceState: (state) => set({ presenceState: state }),
  setCommandOpen: (open) => set({ commandOpen: open }),

  addSignal: (signal) =>
    set((s) => ({ signals: [signal, ...s.signals].slice(0, 20) })),
  removeSignal: (id) =>
    set((s) => ({ signals: s.signals.filter((sig) => sig.id !== id) })),
  clearSignals: () => set({ signals: [] }),
}))
