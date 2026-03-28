'use client'

import { Suspense } from 'react'
import { MartinOsProvider } from '@/context/MartinOsProvider'
import { ToastProvider } from '@/context/ToastContext'
import KeyboardShortcuts from '@/components/shell/KeyboardShortcuts'
import OSNav from '@/components/shell/OSNav'
import ToastContainer from '@/components/shell/ToastContainer'
import CommandCenter from '@/components/command/CommandCenter'
import SignalFeed from '@/components/signals/SignalFeed'

export function AppProviders({ children }) {
  return (
    <MartinOsProvider>
      <ToastProvider>
        <KeyboardShortcuts />
        <Suspense
          fallback={
            <div
              className="sticky top-0 z-[500] min-h-[56px] w-full glass-panel border-b-0 rounded-none"
              style={{ borderBottom: '1px solid var(--border-subtle)' }}
              aria-hidden
            />
          }
        >
          <OSNav />
        </Suspense>
        {children}
        <ToastContainer />
        <CommandCenter />
        <SignalFeed />
      </ToastProvider>
    </MartinOsProvider>
  )
}
