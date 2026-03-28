'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fadeIn, slideIn } from '@/lib/motionEnhanced'
import {
  THEME_PRESETS_V2,
  LAYOUT_MODES,
  getThemePresetById,
  getLayoutModeById,
  isValidThemePresetV2,
  isValidLayoutMode,
} from '@/lib/themePresetsV2'
import { DOMAIN_DASHBOARDS } from '@/lib/domainDashboards'
import { Palette, Layout, Zap, Moon, Sun, Accessibility, Info } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * Settings Page
 * Theme and layout configuration with live preview
 */
export default function SettingsPage() {
  const [selectedTheme, setSelectedTheme] = useState('enterprise-light')
  const [selectedLayout, setSelectedLayout] = useState('SIDEBAR_ADMIN')
  const [reducedMotion, setReducedMotion] = useState(false)
  const [activeTab, setActiveTab] = useState('theme')

  const themeConfig = getThemePresetById(selectedTheme)
  const layoutConfig = getLayoutModeById(selectedLayout)

  useEffect(() => {
    if (typeof document === 'undefined') return
    if (isValidThemePresetV2(selectedTheme)) {
      document.documentElement.dataset.theme = selectedTheme
    }
  }, [selectedTheme])

  useEffect(() => {
    if (typeof document === 'undefined') return
    if (isValidLayoutMode(selectedLayout)) {
      document.documentElement.dataset.layoutMode = selectedLayout
    }
  }, [selectedLayout])

  const handleThemeChange = (themeId) => {
    if (isValidThemePresetV2(themeId)) {
      setSelectedTheme(themeId)
    }
  }

  const handleLayoutChange = (layoutId) => {
    if (isValidLayoutMode(layoutId)) {
      setSelectedLayout(layoutId)
    }
  }

  const toggleReducedMotion = () => {
    setReducedMotion(!reducedMotion)
  }

  return (
    <div className="min-h-screen p-8">
      <motion.div {...fadeIn(0.1)} className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-4xl mb-2">Settings</h1>
          <p className="text-[var(--text-muted)]">
            Customize your experience with themes and layouts
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-[var(--border-subtle)]">
          <button
            onClick={() => setActiveTab('theme')}
            className={cn(
              'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'theme'
                ? 'border-[var(--accent)] text-[var(--text-primary)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            )}
          >
            Appearance
          </button>
          <button
            onClick={() => setActiveTab('layout')}
            className={cn(
              'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'layout'
                ? 'border-[var(--accent)] text-[var(--text-primary)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            )}
          >
            Layout
          </button>
          <button
            onClick={() => setActiveTab('accessibility')}
            className={cn(
              'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'accessibility'
                ? 'border-[var(--accent)] text-[var(--text-primary)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            )}
          >
            Accessibility
          </button>
        </div>

        {/* Theme Tab */}
        {activeTab === 'theme' && (
          <motion.div
            {...slideIn('up', 20, 0.1)}
            className="space-y-8"
          >
            {/* Theme Presets */}
            <div>
              <h2 className="font-semibold text-xl mb-4">Theme Presets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {THEME_PRESETS_V2.map((theme) => (
                  <motion.button
                    key={theme.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleThemeChange(theme.id)}
                    className={cn(
                      'p-6 rounded-xl border-2 transition-all text-left',
                      selectedTheme === theme.id
                        ? 'border-[var(--accent)] bg-[var(--accent-muted)]'
                        : 'border-[var(--border-subtle)] hover:border-[var(--border-default)]'
                    )}
                  >
                    <div className="flex items-start gap-4 mb-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ background: `var(--${theme.category === 'dark' ? 'bg-subtle' : 'accent-muted'})` }}
                      >
                        {theme.category === 'dark' ? (
                          <Moon className="w-5 h-5" />
                        ) : (
                          <Sun className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{theme.label}</h3>
                        <p className="text-sm text-[var(--text-muted)]">
                          {theme.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {theme.features.map((feature) => (
                        <span
                          key={feature}
                          className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-subtle)]"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Theme Preview */}
            <div className="glass-panel p-6 rounded-xl">
              <h2 className="font-semibold text-xl mb-4">Theme Preview</h2>
              <p className="mb-4 text-sm text-[var(--text-muted)]">
                Active preset: <span className="font-medium text-[var(--text-primary)]">{themeConfig?.label ?? selectedTheme}</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Colors */}
                <div>
                  <h3 className="font-medium mb-3">Color Palette</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {['bg-base', 'bg-elevated', 'bg-subtle', 'surface-glass'].map((color) => (
                      <div key={color} className="space-y-1">
                        <div
                          className="w-full aspect-square rounded-lg border border-[var(--border-subtle)]"
                          style={{ background: `var(--${color})` }}
                        />
                        <p className="text-xs text-[var(--text-muted)] text-center">
                          {color.replace('-', ' ')}
                        </p>
                      </div>
                    ))}
                    {['accent', 'success', 'warning', 'error'].map((color) => (
                      <div key={color} className="space-y-1">
                        <div
                          className="w-full aspect-square rounded-lg border border-[var(--border-subtle)]"
                          style={{ background: `var(--${color})` }}
                        />
                        <p className="text-xs text-[var(--text-muted)] text-center">
                          {color}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Text Hierarchy */}
                <div>
                  <h3 className="font-medium mb-3">Text Hierarchy</h3>
                  <div className="space-y-2">
                    <p style={{ fontSize: '2rem', fontWeight: 700 }}>
                      Heading 1
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                      Heading 2
                    </p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 500 }}>
                      Heading 3
                    </p>
                    <p className="text-[var(--text-primary)]">
                      Primary text
                    </p>
                    <p className="text-[var(--text-secondary)]">
                      Secondary text
                    </p>
                    <p className="text-[var(--text-muted)]">
                      Muted text
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Layout Tab */}
        {activeTab === 'layout' && (
          <motion.div
            {...slideIn('up', 20, 0.1)}
            className="space-y-8"
          >
            {/* Layout Modes */}
            <div>
              <h2 className="font-semibold text-xl mb-4">Layout Mode</h2>
              <p className="mb-4 text-sm text-[var(--text-muted)]">
                Active layout:{' '}
                <span className="font-medium text-[var(--text-primary)]">{layoutConfig?.label ?? selectedLayout}</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {LAYOUT_MODES.map((layout) => (
                  <motion.button
                    key={layout.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLayoutChange(layout.id)}
                    className={cn(
                      'p-6 rounded-xl border-2 transition-all text-left',
                      selectedLayout === layout.id
                        ? 'border-[var(--accent)] bg-[var(--accent-muted)]'
                        : 'border-[var(--border-subtle)] hover:border-[var(--border-default)]'
                    )}
                  >
                    <div className="p-3 rounded-lg mb-3 bg-[var(--bg-subtle)] w-fit">
                      <Layout className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold mb-1">{layout.label}</h3>
                    <p className="text-sm text-[var(--text-muted)] mb-3">
                      {layout.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {layout.features.map((feature) => (
                        <span
                          key={feature}
                          className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-subtle)]"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Domain-Specific Recommendations */}
            <div className="glass-panel p-6 rounded-xl">
              <h2 className="font-semibold text-xl mb-4">Domain-Specific Recommendations</h2>
              <div className="space-y-4">
                {Object.values(DOMAIN_DASHBOARDS).map((domain) => (
                  <div
                    key={domain.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-[var(--border-subtle)]"
                  >
                    <div>
                      <h3 className="font-semibold mb-1">{domain.name}</h3>
                      <p className="text-sm text-[var(--text-muted)]">
                        {domain.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {getLayoutModeById(domain.defaultLayout)?.label}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        with {getThemePresetById(domain.defaultTheme)?.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Accessibility Tab */}
        {activeTab === 'accessibility' && (
          <motion.div
            {...slideIn('up', 20, 0.1)}
            className="space-y-8"
          >
            {/* Motion Preferences */}
            <div className="glass-panel p-6 rounded-xl">
              <h2 className="font-semibold text-xl mb-4">Motion Preferences</h2>

              <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--border-subtle)]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[var(--bg-subtle)]">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Reduced Motion</h3>
                    <p className="text-sm text-[var(--text-muted)]">
                      Minimize animations for better performance and accessibility
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleReducedMotion}
                  className={cn(
                    'relative w-14 h-8 rounded-full transition-colors',
                    reducedMotion ? 'bg-[var(--accent)]' : 'bg-[var(--bg-subtle)]'
                  )}
                >
                  <motion.div
                    className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-sm"
                    animate={{ x: reducedMotion ? 6 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {reducedMotion && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-lg bg-[var(--bg-subtle)] flex items-start gap-3"
                >
                  <Info className="w-5 h-5 text-[var(--accent)] mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Reduced Motion Enabled</p>
                    <p className="text-sm text-[var(--text-muted)]">
                      All animations will be simplified or disabled for a more comfortable experience.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Accessibility Tips */}
            <div className="glass-panel p-6 rounded-xl">
              <h2 className="font-semibold text-xl mb-4">Accessibility Tips</h2>
              <div className="space-y-4">
                {accessibilityTips.map((tip, index) => (
                  <motion.div
                    key={index}
                    {...slideIn('up', 20, index * 0.05)}
                    className="flex items-start gap-3 p-4 rounded-lg border border-[var(--border-subtle)]"
                  >
                    <Accessibility className="w-5 h-5 text-[var(--accent)] mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">{tip.title}</h3>
                      <p className="text-sm text-[var(--text-muted)]">
                        {tip.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

const accessibilityTips = [
  {
    title: 'Keyboard Navigation',
    description: 'Use Tab to navigate between interactive elements, Enter to activate buttons and links.',
  },
  {
    title: 'Screen Reader Support',
    description: 'All components include proper ARIA labels and semantic HTML for screen readers.',
  },
  {
    title: 'Color Contrast',
    description: 'All themes meet WCAG AA contrast requirements for text readability.',
  },
  {
    title: 'Focus Indicators',
    description: 'Clear focus indicators show which element is currently keyboard-focused.',
  },
]
