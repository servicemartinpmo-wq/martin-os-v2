import React, { createContext, useContext } from 'react'

type NavigateFn = (tab: string) => void

type V3NavContextValue = {
  navigate: NavigateFn
}

const V3NavContext = createContext<V3NavContextValue | null>(null)

export function V3NavProvider({
  navigate,
  children,
}: {
  navigate: NavigateFn
  children: React.ReactNode
}) {
  return <V3NavContext.Provider value={{ navigate }}>{children}</V3NavContext.Provider>
}

export function useV3Nav() {
  const ctx = useContext(V3NavContext)
  if (!ctx) throw new Error('useV3Nav must be used within V3NavProvider')
  return ctx
}

