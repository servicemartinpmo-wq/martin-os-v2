'use client'

import { useEffect, useRef } from 'react'

const nodeData = {
  nodes: [
    { id: 'p1', label: 'Platform Migration', type: 'project', x: 0, y: 0 },
    { id: 'p2', label: 'Customer Portal', type: 'project', x: 200, y: 100 },
    { id: 'p3', label: 'Analytics v2', type: 'project', x: -200, y: 100 },
    { id: 's1', label: 'Sarah K.', type: 'person', x: 100, y: -150 },
    { id: 's2', label: 'Mike R.', type: 'person', x: -100, y: -150 },
    { id: 's3', label: 'Lisa M.', type: 'person', x: 0, y: -250 },
    { id: 's4', label: 'Tom H.', type: 'person', x: 200, y: -100 },
  ],
  links: [
    { source: 's1', target: 'p1' },
    { source: 's2', target: 'p1' },
    { source: 's2', target: 'p2' },
    { source: 's3', target: 'p3' },
    { source: 's4', target: 'p2' },
    { source: 's1', target: 'p2' },
  ]
}

const colors = {
  project: 'var(--accent)',
  person: 'var(--success)',
}

export default function WorkGraph() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = 600
    canvas.height = 400

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw links
    ctx.strokeStyle = 'var(--border-subtle)'
    ctx.lineWidth = 1

    nodeData.links.forEach(link => {
      const source = nodeData.nodes.find(n => n.id === link.source)
      const target = nodeData.nodes.find(n => n.id === link.target)
      
      if (source && target) {
        ctx.beginPath()
        ctx.moveTo(source.x + 300, source.y + 200)
        ctx.lineTo(target.x + 300, target.y + 200)
        ctx.stroke()
      }
    })

    // Draw nodes
    nodeData.nodes.forEach(node => {
      const x = node.x + 300
      const y = node.y + 200
      const radius = node.type === 'project' ? 30 : 25

      // Node circle
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, 2 * Math.PI)
      ctx.fillStyle = 'color-mix(in oklab, var(--bg-elevated) 80%, transparent)'
      ctx.fill()
      ctx.strokeStyle = colors[node.type] || 'var(--accent)'
      ctx.lineWidth = 2
      ctx.stroke()

      // Label
      ctx.fillStyle = 'var(--text-primary)'
      ctx.font = '12px Manrope, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(node.label, x, y + radius + 15)
    })

  }, [])

  return (
    <div className="glass-panel p-4">
      <canvas 
        ref={canvasRef}
        className="w-full"
        style={{ maxWidth: '600px', margin: '0 auto' }}
      />
      <p className="mt-4 text-xs text-center" style={{ color: 'var(--text-muted)' }}>
        Interactive work graph showing contributor-project relationships
      </p>
    </div>
  )
}
