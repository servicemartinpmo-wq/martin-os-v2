import Link from 'next/link'

export function PageHeader({ kicker, title, subtitle, children, className = '' }) {
  return (
    <header className={`glass-panel p-6 ${className}`}>
      {kicker ? (
        <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--accent)' }}>
          {kicker}
        </p>
      ) : null}
      <h2
        className="font-display mt-2 text-2xl font-semibold md:text-3xl"
        style={{ color: 'var(--text-primary)' }}
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 max-w-3xl text-sm" style={{ color: 'var(--text-muted)' }}>
          {subtitle}
        </p>
      ) : null}
      {children}
    </header>
  )
}

export function PageSection({ title, children, className = '', contentClassName = '' }) {
  return (
    <section className={`glass-panel p-6 ${className}`}>
      {title ? (
        <h3 className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h3>
      ) : null}
      <div className={title ? `mt-4 ${contentClassName}` : contentClassName}>{children}</div>
    </section>
  )
}

export function PageCard({ title, subtitle, children, className = '' }) {
  return (
    <article className={`glass-panel p-5 ${className}`}>
      {title ? (
        <h3 className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h3>
      ) : null}
      {subtitle ? (
        <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          {subtitle}
        </p>
      ) : null}
      {children ? <div className="mt-3">{children}</div> : null}
    </article>
  )
}

/** @param {{ active?: boolean, children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>} props */
export function FilterChip({ active, children, className = '', disabled, style, ...rest }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`mos-chip ${active ? 'mos-chip-active' : ''} ${className}`}
      style={{
        ...(disabled ? { opacity: 0.45, cursor: 'not-allowed' } : {}),
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  )
}

/** @param {{ href: string, children: React.ReactNode, className?: string }} props */
export function TileLink({ href, children, className = '' }) {
  return (
    <Link href={href} className={`mos-link-tile ${className}`}>
      {children}
    </Link>
  )
}
