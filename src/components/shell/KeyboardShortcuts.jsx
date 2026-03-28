'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMartinOs } from '@/context/MartinOsProvider'
import { useToast } from '@/context/ToastContext'

function isTypingTarget(el) {
  if (!el || !(el instanceof HTMLElement)) return false
  const t = el.tagName
  if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') return true
  if (el.isContentEditable) return true
  return false
}

const ROUTES = {
  PMO: '/pmo-ops',
  TECH_OPS: '/tech-ops',
  MIIDLE: '/miidle',
}

export default function KeyboardShortcuts() {
  const router = useRouter()
  const { applyPerspective } = useMartinOs()
  const { pushToast } = useToast()

  useEffect(() => {
    const onKey = (e) => {
      if (!e.metaKey && !e.ctrlKey) return
      const target = /** @type {HTMLElement | null} */ (e.target)
      if (isTypingTarget(target)) return

      const key = e.key
      if (key === '1') {
        e.preventDefault()
        applyPerspective('PMO')
        router.push(ROUTES.PMO)
        pushToast({ title: 'Perspective', message: 'Switched to PMO Ops' })
      } else if (key === '2') {
        e.preventDefault()
        applyPerspective('TECH_OPS')
        router.push(ROUTES.TECH_OPS)
        pushToast({ title: 'Perspective', message: 'Switched to Tech-Ops' })
      } else if (key === '3') {
        e.preventDefault()
        applyPerspective('MIIDLE')
        router.push(ROUTES.MIIDLE)
        pushToast({ title: 'Perspective', message: 'Switched to Miiddle' })
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [router, applyPerspective, pushToast])

  return null
}
