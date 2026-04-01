'use client'

/** Narrow-viewport stack: sidebar above content. */
export default function MobileStack({ sidebar, main, className = '' }) {
  return (
    <div className={`flex min-h-[60vh] flex-col gap-4 lg:flex-row ${className}`}>
      {sidebar}
      <div className="min-w-0 flex-1">{main}</div>
    </div>
  )
}
