'use client'

/** Editorial bento-style grid for Creative mode. */
export default function BentoGrid({ children, className = '' }) {
  return (
    <div
      className={`grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-3 ${className}`}
    >
      {children}
    </div>
  )
}
