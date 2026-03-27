'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

/** @typedef {{ id: string, message: string, title?: string }} ToastItem */

/** @type {React.Context<null | ToastContextValue>} */
const ToastContext = createContext(null)

/**
 * @typedef {{
 *   toasts: ToastItem[],
 *   pushToast: (item: Omit<ToastItem, 'id'> & { id?: string }) => string,
 *   dismissToast: (id: string) => void,
 * }} ToastContextValue
 */

export function ToastProvider({ children }) {
  /** @type {[ToastItem[], React.Dispatch<React.SetStateAction<ToastItem[]>>]} */
  const [toasts, setToasts] = useState([])
  const timers = useRef(/** @type {Map<string, ReturnType<typeof setTimeout>>} */ (new Map()))

  const dismissToast = useCallback((id) => {
    const t = timers.current.get(id)
    if (t) clearTimeout(t)
    timers.current.delete(id)
    setToasts((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const pushToast = useCallback(
    (item) => {
      const id =
        item.id ?? `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      const entry = { ...item, id }
      setToasts((prev) => [...prev, entry])
      let ms = 12000
      if (typeof window !== 'undefined') {
        const raw = getComputedStyle(document.documentElement)
          .getPropertyValue('--toast-duration')
          .trim()
        const sec = parseFloat(raw.replace(/s$/i, '')) || 12
        ms = Math.round(sec * 1000)
      }
      const handle = setTimeout(() => dismissToast(id), ms)
      timers.current.set(id, handle)
      return id
    },
    [dismissToast],
  )

  useEffect(() => {
    return () => {
      timers.current.forEach((t) => clearTimeout(t))
    }
  }, [])

  const value = useMemo(
    () => ({ toasts, pushToast, dismissToast }),
    [toasts, pushToast, dismissToast],
  )

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return ctx
}
