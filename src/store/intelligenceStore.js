import { create } from 'zustand'

export const useIntelligenceStore = create((set) => ({
  proof: {
    execution: 42,
    efficiency: 46,
    impact: 40,
    proofOfWork: 43,
    systemIQ: 44,
  },
  curiosityFragments: [],
  outcomes: [],
  recommendation: null,
  lastSignal: null,
  spectatorContract: {
    spotlight: null,
    fragments: [],
    updatedAt: null,
  },
  applySignal: (signal) =>
    set({
      proof: signal.proof,
      curiosityFragments: signal.curiosityFragments,
      outcomes: signal.outcomes,
      recommendation: signal.recommendation,
      lastSignal: signal.lastSignal,
    }),
  setSpectatorContract: (spectatorContract) => set({ spectatorContract }),
}))
