'use client'

import { useMartinOs } from '@/context/MartinOsProvider'

/**
 * Web Speech API stub — push-to-list UX; does not submit commands until wired to router.
 */
export default function VoiceCommandsStub() {
  const { operatingMode } = useMartinOs()
  if (operatingMode !== 'assisted') return null

  return (
    <div
      className="mt-4 rounded-md border p-3 text-xs"
      style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
    >
      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
        Voice commands (demo)
      </p>
      <p className="mt-1">
        Future: “show tasks”, “add reminder” → SpeechRecognition + intent router. Microphone permission required in
        browser.
      </p>
    </div>
  )
}
