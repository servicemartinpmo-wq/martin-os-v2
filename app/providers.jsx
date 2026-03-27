'use client'

import { MartinOsProvider } from '@/context/MartinOsProvider'
import { ToastProvider } from '@/context/ToastContext'
import KeyboardShortcuts from '@/components/shell/KeyboardShortcuts'
import OSNav from '@/components/shell/OSNav'
import ToastContainer from '@/components/shell/ToastContainer'

export function AppProviders({ children }) {
  return (
    <MartinOsProvider>
      <ToastProvider>
        <KeyboardShortcuts />
        <OSNav />
        {children}
        <ToastContainer />
      </ToastProvider>
    </MartinOsProvider>
  )
}
