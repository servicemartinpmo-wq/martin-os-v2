'use client'

/** Floating HUD chrome region (Tech-Ops style). */
export default function HUDOverlay({ children, className = '' }) {
  return (
    <div
      className={`pointer-events-none fixed bottom-4 right-4 z-[400] max-w-md ${className}`}
      style={{ paddingRight: 'env(safe-area-inset-right)' }}
    >
      <div className="pointer-events-auto">{children}</div>
    </div>
  )
}
