'use client'

const nodes = [
  { id: 'n1', label: 'Platform Migration', type: 'project', left: '50%', top: '24%' },
  { id: 'n2', label: 'Customer Portal', type: 'project', left: '25%', top: '56%' },
  { id: 'n3', label: 'Quality Control v2', type: 'project', left: '76%', top: '56%' },
  { id: 'n4', label: 'Sarah K.', type: 'operator', left: '18%', top: '22%' },
  { id: 'n5', label: 'Mike R.', type: 'operator', left: '82%', top: '22%' },
  { id: 'n6', label: 'Lisa M.', type: 'operator', left: '50%', top: '80%' },
]

const links = [
  { id: 'l1', transform: 'translate(0,0) rotate(24deg)', width: '26%', left: '25%', top: '34%' },
  { id: 'l2', transform: 'translate(0,0) rotate(-24deg)', width: '26%', left: '50%', top: '34%' },
  { id: 'l3', transform: 'translate(0,0) rotate(-30deg)', width: '24%', left: '32%', top: '64%' },
  { id: 'l4', transform: 'translate(0,0) rotate(30deg)', width: '24%', left: '44%', top: '64%' },
  { id: 'l5', transform: 'translate(0,0) rotate(0deg)', width: '38%', left: '31%', top: '56%' },
]

export default function WorkGraph() {
  return (
    <div className="glass-panel p-4">
      <div
        className="relative mx-auto w-full overflow-hidden rounded-xl"
        style={{
          maxWidth: '760px',
          minHeight: '420px',
          background:
            'radial-gradient(circle at 20% 20%, color-mix(in oklab, var(--accent) 20%, transparent), transparent 40%), radial-gradient(circle at 80% 25%, color-mix(in oklab, var(--success) 14%, transparent), transparent 45%)',
        }}
      >
        {links.map((link) => (
          <span
            key={link.id}
            className="absolute block h-px"
            style={{
              left: link.left,
              top: link.top,
              width: link.width,
              transform: link.transform,
              transformOrigin: 'left center',
              background: 'linear-gradient(90deg, var(--border-subtle), transparent)',
            }}
          />
        ))}
        {nodes.map((node) => (
          <article
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-xl px-4 py-2 text-center"
            style={{
              left: node.left,
              top: node.top,
              border: '1px solid var(--border-subtle)',
              background:
                node.type === 'project'
                  ? 'color-mix(in oklab, var(--accent) 18%, var(--surface-elevated))'
                  : 'color-mix(in oklab, var(--success) 16%, var(--surface-elevated))',
              boxShadow: 'var(--shadow-inner-soft)',
            }}
          >
            <p className="text-xs uppercase tracking-[0.08em]" style={{ color: 'var(--text-muted)' }}>
              {node.type}
            </p>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {node.label}
            </p>
          </article>
        ))}
      </div>
      <p className="mt-4 text-xs text-center" style={{ color: 'var(--text-muted)' }}>
        Live relationship map between people, initiatives, and narrative artifacts.
      </p>
    </div>
  )
}
