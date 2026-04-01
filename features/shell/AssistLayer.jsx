'use client'

import { usePathname } from 'next/navigation'
import ExplainThis from '@/components/assist/ExplainThis'
import VoiceCommandsStub from '@/components/assist/VoiceCommandsStub'

export default function AssistLayer({ children }) {
  const pathname = usePathname() ?? '/'
  return (
    <>
      {children}
      <ExplainThis pathname={pathname} />
      <VoiceCommandsStub />
    </>
  )
}
