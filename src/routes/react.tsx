import { Link, createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'

export const Route = createFileRoute('/react')({
  head: () => ({
    meta: [{ title: 'React Setup | Martin OS' }],
  }),
  component: ReactSetupPage,
})

function ReactSetupPage() {
  const [count, setCount] = useState(0)
  const [step, setStep] = useState(1)
  const [draft, setDraft] = useState('')
  const [items, setItems] = useState<Array<string>>(['Hook demo ready'])

  const stats = useMemo(
    () => ({
      doubled: count * 2,
      tripled: count * 3,
      parity: count % 2 === 0 ? 'even' : 'odd',
    }),
    [count],
  )

  const addItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = draft.trim()
    if (!value) return
    setItems((current) => [value, ...current])
    setDraft('')
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            React application setup
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Root app is running React 19 with TanStack Start
          </h1>
          <p className="mt-2 text-slate-600">
            This page is a lightweight playground to verify hooks, typed events, route
            navigation, and Tailwind styling are all working in this repo.
          </p>
          <div className="mt-4">
            <Link
              to="/"
              className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Back to dashboard
            </Link>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Hook state demo</h2>
            <p className="mt-1 text-sm text-slate-600">
              Counter updates with configurable step size.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCount((current) => current - step)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                - Step
              </button>
              <span className="min-w-12 text-center text-2xl font-bold text-slate-900">
                {count}
              </span>
              <button
                type="button"
                onClick={() => setCount((current) => current + step)}
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                + Step
              </button>
            </div>
            <label className="mt-4 block text-sm font-medium text-slate-700">
              Step size
              <input
                type="number"
                min={1}
                value={step}
                onChange={(event) => setStep(Math.max(1, Number(event.target.value) || 1))}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <ul className="mt-4 space-y-1 text-sm text-slate-600">
              <li>Doubled: {stats.doubled}</li>
              <li>Tripled: {stats.tripled}</li>
              <li>Parity: {stats.parity}</li>
            </ul>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Typed form demo</h2>
            <p className="mt-1 text-sm text-slate-600">
              Add and remove items to confirm stateful rendering and events.
            </p>
            <form onSubmit={addItem} className="mt-4 flex gap-2">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Add an item"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                Add
              </button>
            </form>
            <ul className="mt-4 space-y-2">
              {items.map((item) => (
                <li
                  key={item}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setItems((current) => current.filter((candidate) => candidate !== item))
                    }
                    className="rounded border border-slate-300 px-2 py-1 text-xs font-medium hover:bg-slate-100"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </div>
    </main>
  )
}
