'use client'

export default function Error({ error, reset }) {
  return (
    <div
      className="min-h-screen px-6 py-16"
      style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
      <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--error)' }}>
        Runtime error
      </p>
      <h1 className="mt-3 text-2xl font-semibold">Something broke while rendering this view</h1>
      <p className="mt-2 max-w-xl text-sm" style={{ color: 'var(--text-muted)' }}>
        The error below is shown so the screen does not go blank. Fix the underlying issue or try again.
      </p>
      <pre
        className="mt-6 max-w-3xl overflow-x-auto rounded-lg border p-4 text-xs"
        style={{
          borderColor: 'var(--border-subtle)',
          background: 'var(--bg-elevated)',
          color: 'var(--error)',
        }}
      >
        {error?.digest ? `${error.message} (${error.digest})` : error?.message ?? String(error)}
      </pre>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-lg border px-4 py-2 text-sm"
        style={{
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-primary)',
          background: 'transparent',
        }}
      >
        Try again
      </button>
    </div>
  )
}
