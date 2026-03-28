'use client'

import { useState } from 'react'

export default function TicketForm({ onClose, initialData = null }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'medium',
    source: initialData?.source || 'customer',
    category: initialData?.category || 'technical',
    assignee: initialData?.assignee || '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Submitting ticket:', formData)
    onClose?.()
  }

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
          Issue Title *
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={handleChange('title')}
          className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
          style={{ 
            borderColor: 'var(--border-subtle)', 
            color: 'var(--text-primary)' 
          }}
          placeholder="Brief description of the issue..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={handleChange('description')}
          rows={4}
          className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
          style={{ 
            borderColor: 'var(--border-subtle)', 
            color: 'var(--text-primary)' 
          }}
          placeholder="Detailed description of the issue, steps to reproduce, etc."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={handleChange('priority')}
            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
            style={{ 
              borderColor: 'var(--border-subtle)', 
              color: 'var(--text-primary)' 
            }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
            Source
          </label>
          <select
            value={formData.source}
            onChange={handleChange('source')}
            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
            style={{ 
              borderColor: 'var(--border-subtle)', 
              color: 'var(--text-primary)' 
            }}
          >
            <option value="customer">Customer</option>
            <option value="internal">Internal</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
            Category
          </label>
          <select
            value={formData.category}
            onChange={handleChange('category')}
            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
            style={{ 
              borderColor: 'var(--border-subtle)', 
              color: 'var(--text-primary)' 
            }}
          >
            <option value="technical">Technical</option>
            <option value="billing">Billing</option>
            <option value="feature">Feature Request</option>
            <option value="bug">Bug Report</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
            Assignee
          </label>
          <input
            type="text"
            value={formData.assignee}
            onChange={handleChange('assignee')}
            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
            style={{ 
              borderColor: 'var(--border-subtle)', 
              color: 'var(--text-primary)' 
            }}
            placeholder="Leave empty for auto-assignment"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="mos-chip mos-chip-active px-4 py-2"
        >
          Create Ticket
        </button>
        <button
          type="button"
          onClick={onClose}
          className="mos-chip px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
