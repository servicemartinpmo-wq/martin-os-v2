'use client'

import { useToast } from '@/context/ToastContext'

export default function ToastContainer() {
  const { toasts, dismissToast } = useToast()

  return (
    <div
      className="fixed right-4 top-4 z-[10000] flex max-w-sm flex-col gap-2"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
      aria-live="polite"
    >
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => dismissToast(t.id)}
          className="toast-enter glass-panel text-left shadow-lg"
          style={{
            borderLeft: '3px solid var(--accent)',
            color: 'var(--text-primary)',
            padding: '0.75rem 1rem',
          }}
        >
          {t.title ? (
            <p className="font-display text-sm font-semibold">{t.title}</p>
          ) : null}
          <p className="mt-0.5 text-sm" style={{ color: 'var(--text-muted)' }}>
            {t.message}
          </p>
        </button>
      ))}
    </div>
  )
}
