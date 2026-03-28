'use client'

import { useState } from 'react'
import { runBrain } from '@/brain/brainEngine'

const templates = [
  { id: 'executive-summary', label: 'Executive Summary' },
  { id: 'progress-report', label: 'Progress Report' },
  { id: 'milestone', label: 'Milestone Celebration' },
  { id: 'lessons', label: 'Lessons Learned' },
]

export default function StoryEngine() {
  const [selectedTemplate, setSelectedTemplate] = useState('executive-summary')
  const [projectFilter, setProjectFilter] = useState('all')
  const [generatedStory, setGeneratedStory] = useState(null)
  const [loading, setLoading] = useState(false)

  const generateStory = async () => {
    setLoading(true)
    setGeneratedStory(null)

    try {
      const output = await runBrain({
        appView: 'MIIDLE',
        context: `Generate a ${selectedTemplate.replace('-', ' ')} for project: ${projectFilter}. Include key metrics, achievements, and next steps.`,
      })
      setGeneratedStory(output)
    } catch (err) {
      console.error('Story generation error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Story Template
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
          >
            {templates.map(t => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Project
          </label>
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
          >
            <option value="all">All Projects</option>
            <option value="platform-migration">Platform Migration</option>
            <option value="customer-portal">Customer Portal</option>
            <option value="analytics-v2">Analytics v2</option>
          </select>
        </div>
      </div>

      <button
        onClick={generateStory}
        disabled={loading}
        className="mos-chip mos-chip-active px-6 py-2"
      >
        {loading ? 'Generating...' : 'Generate Story'}
      </button>

      {loading && (
        <div className="glass-panel p-8 text-center">
          <div 
            className="inline-block animate-spin w-6 h-6 border-2 rounded-full"
            style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
          />
          <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
            Crafting your story...
          </p>
        </div>
      )}

      {generatedStory && !loading && (
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Generated Story
            </h3>
            {generatedStory.mock && (
              <span className="mos-chip">Demo Mode</span>
            )}
          </div>

          {generatedStory.summary && (
            <div className="prose prose-sm max-w-none" style={{ color: 'var(--text-primary)' }}>
              <p className="text-sm leading-relaxed">{generatedStory.summary}</p>
            </div>
          )}

          {generatedStory.priorities && generatedStory.priorities.length > 0 && (
            <div className="mt-4 pt-4" style={{ borderTopColor: 'var(--border-subtle)', borderTopWidth: '1px', borderTopStyle: 'solid' }}>
              <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Key Highlights
              </h4>
              <ul className="space-y-1">
                {generatedStory.priorities.map((p, idx) => (
                  <li key={idx} className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    • {p.title}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <button className="mos-chip px-3 py-1 text-xs">
              Copy Text
            </button>
            <button className="mos-chip px-3 py-1 text-xs">
              Export PDF
            </button>
            <button className="mos-chip px-3 py-1 text-xs">
              Share
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
