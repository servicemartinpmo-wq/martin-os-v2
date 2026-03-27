'use client'

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-100">
      <p className="text-xs uppercase tracking-[0.2em] text-red-300">Runtime error</p>
      <h1 className="mt-3 text-2xl font-semibold">Something broke while rendering this view</h1>
      <p className="mt-2 max-w-xl text-sm text-zinc-400">
        The error below is shown so the screen does not go blank. Fix the underlying issue or try again.
      </p>
      <pre className="mt-6 max-w-3xl overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900/80 p-4 text-xs text-red-200">
        {error?.digest ? `${error.message} (${error.digest})` : error?.message ?? String(error)}
      </pre>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-500"
      >
        Try again
      </button>
    </div>
  )
}
