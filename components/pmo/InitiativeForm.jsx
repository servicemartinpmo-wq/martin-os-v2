'use client'

import { useState } from 'react'

export default function InitiativeForm({ onClose, initialData = null }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    owner: initialData?.owner || '',
    status: initialData?.status || 'planning',
    priority: initialData?.priority || 'medium',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    budget: initialData?.budget || '',
    riskLevel: initialData?.riskLevel || 'low',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Submitting initiative:', formData)
    onClose?.()
  }

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
          Initiative Title *
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
          placeholder="e.g., Q2 Platform Migration"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={handleChange('description')}
          rows={3}
          className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
          style={{ 
            borderColor: 'var(--border-subtle)', 
            color: 'var(--text-primary)' 
          }}
          placeholder="Brief description of the initiative..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
            Owner *
          </label>
          <input
            type="text"
            required
            value={formData.owner}
            onChange={handleChange('owner')}
            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
            style={{ 
              borderColor: 'var(--border-subtle)', 
              color: 'var(--text-primary)' 
            }}
            placeholder="e.g., Sarah K."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
            Status
          </label>
          <select
            value={formData.status}
            onChange={handleChange('status')}
            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
            style={{ 
              borderColor: 'var(--border-subtle)', 
              color: 'var(--text-primary)' 
            }}
          >
            <option value="planning">Planning</option>
            <option value="running">Running</option>
            <option value="at-risk">At Risk</option>
            <option value="completed">Completed</option>
          </select>
        </div>
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
            Risk Level
          </label>
          <select
            value={formData.riskLevel}
            onChange={handleChange('riskLevel')}
            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
            style={{ 
              borderColor: 'var(--border-subtle)', 
              color: 'var(--text-primary)' 
            }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
            Start Date
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={handleChange('startDate')}
            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
            style={{ 
              borderColor: 'var(--border-subtle)', 
              color: 'var(--text-primary)' 
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
            End Date
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={handleChange('endDate')}
            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
            style={{ 
              borderColor: 'var(--border-subtle)', 
              color: 'var(--text-primary)' 
            }}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
          Budget (optional)
        </label>
        <input
          type="text"
          value={formData.budget}
          onChange={handleChange('budget')}
          className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
          style={{ 
            borderColor: 'var(--border-subtle)', 
            color: 'var(--text-primary)' 
          }}
          placeholder="e.g., $50,000"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="mos-chip mos-chip-active px-4 py-2"
        >
          Save Initiative
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
