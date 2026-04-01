/** @param {string | undefined | null} status */
export function initiativeStatusLabel(status) {
  const s = String(status ?? '')
  if (s === 'At Risk') return 'Needs attention'
  return s || '—'
}

/** @param {string | undefined | null} status */
export function initiativeStatusBadgeClass(status) {
  const s = String(status ?? '')
  const base = 'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold'
  switch (s) {
    case 'Delayed':
      return `${base} bg-purple-100 text-purple-800`
    case 'At Risk':
      return `${base} bg-orange-100 text-orange-800`
    case 'On Track':
      return `${base} bg-yellow-100 text-yellow-900`
    case 'Abandoned':
      return `${base} bg-red-100 text-red-800`
    case 'Completed':
      return `${base} bg-slate-100 text-slate-700`
    default:
      return `${base} bg-slate-50 text-slate-600`
  }
}
