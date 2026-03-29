'use client'

import { MartinOsProvider } from '@/context/MartinOsProvider'
import { ToastProvider } from '@/context/ToastContext'
import KeyboardShortcuts from '@/components/shell/KeyboardShortcuts'
import ToastContainer from '@/components/shell/ToastContainer'
import CommandCenter from '@/components/command/CommandCenter'
import SignalFeed from '@/components/signals/SignalFeed'
import { AppShell } from '@/components/shell/AppShell'

export function AppProviders({ children }) {
  return (
    <MartinOsProvider>
      <ToastProvider>
        <KeyboardShortcuts />
        <AppShell>{children}</AppShell>
        <ToastContainer />
        <CommandCenter />
        <SignalFeed />
      </ToastProvider>
    </MartinOsProvider>
  )
}
