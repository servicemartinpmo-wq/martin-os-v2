import { useEffect } from 'react'
import { getCapturedEvents, subscribeToCapture } from '../brain/capture/captureBus'
import { buildCuriosityFragments, buildOutcomeSignals } from '../brain/engines/narrativeEngine'
import {
  fetchSpectatorContract,
  persistBrainSnapshot,
  startBrainSyncWorker,
  stopBrainSyncWorker,
} from '../brain/persistence/brainPersistence'
import { recommendNext } from '../brain/engines/recommendationEngine'
import { scoreFromEvents } from '../brain/engines/scoringEngine'
import { useIntelligenceStore } from '../store/intelligenceStore'

export function useIntelligenceBridge(activeModule) {
  const applySignal = useIntelligenceStore((state) => state.applySignal)
  const setSpectatorContract = useIntelligenceStore((state) => state.setSpectatorContract)

  useEffect(() => {
    startBrainSyncWorker()
    let count = 0
    const recompute = async (lastSignal) => {
      const events = getCapturedEvents()
      const proof = scoreFromEvents(events)
      const curiosityFragments = buildCuriosityFragments(proof, events)
      const outcomes = buildOutcomeSignals(proof)
      const recommendation = recommendNext(proof, activeModule)

      applySignal({
        proof,
        curiosityFragments,
        outcomes,
        recommendation,
        lastSignal,
      })

      const payload = {
        proof,
        outcomes,
        curiosityFragments,
        recommendation,
        lastSignal,
        activeModule,
        events,
      }

      if (count % 6 === 0 || lastSignal === 'signature_awaken') {
        await persistBrainSnapshot(payload)
        const spectatorContract = await fetchSpectatorContract(proof)
        setSpectatorContract(spectatorContract)
      }
    }

    void recompute(null)
    const unsubscribe = subscribeToCapture((event) => {
      count += 1
      if (count % 3 === 0 || event.type === 'signature_awaken') {
        void recompute(event.type)
      }
    })

    return unsubscribe
  }, [activeModule, applySignal, setSpectatorContract])

  useEffect(() => {
    return () => {
      stopBrainSyncWorker()
    }
  }, [])
}
