'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, Loader2, Zap } from 'lucide-react'
import { getAIPresenceStateById } from '@/lib/themePresetsV2'
import { cn } from '@/lib/cn'

const AI_STATES = ['idle', 'active', 'processing', 'typing']

/**
 * AI Status Indicator Component
 * Shows the current state of AI presence with animated indicator
 *
 * @param {Object} props
 * @param {string} props.state - Current AI state ('idle' | 'active' | 'processing' | 'typing')
 * @param {string} props.message - Optional message to display
 * @param {boolean} props.showGlow - Enable glow effect
 * @param {string} props.className - Additional classes
 * @param {function} props.onClick - Optional click handler
 */
export default function AIStatusIndicator({
  state = 'idle',
  message,
  showGlow = true,
  className = '',
  onClick,
}) {
  const [currentState, setCurrentState] = useState(state)
  const stateConfig = getAIPresenceStateById(state)

  useEffect(() => {
    setCurrentState(state)
  }, [state])

  const getStatusIcon = () => {
    switch (currentState) {
      case 'processing':
      case 'typing':
        return <Loader2 className="w-3 h-3 animate-spin" />
      case 'active':
        return <Zap className="w-3 h-3" />
      default:
        return <Brain className="w-3 h-3" />
    }
  }

  const getStatusMessage = () => {
    if (message) return message
    return stateConfig?.label || 'AI Ready'
  }

  return (
    <motion.div
      className={cn(
        'ai-status ai-status--' + currentState,
        'cursor-pointer select-none',
        'transition-all duration-300 ease-out',
        onClick && 'hover:scale-105 active:scale-95',
        className
      )}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="relative">
        {showGlow && <div className="ai-glow" />}
        <div className="ai-status__indicator">
          {getStatusIcon()}
        </div>
      </div>
      <span className="text-sm font-medium">{getStatusMessage()}</span>
    </motion.div>
  )
}

/**
 * Typing Indicator Component
 * Shows animated dots to indicate AI is typing
 *
 * @param {Object} props
 * @param {string} props.className - Additional classes
 */
export function AITypingIndicator({ className = '' }) {
  return (
    <div className={cn('ai-typing', className)}>
      <div className="ai-typing__dot" />
      <div className="ai-typing__dot" />
      <div className="ai-typing__dot" />
    </div>
  )
}

/**
 * AI Pulse Ring Component
 * Shows expanding ring animation for active AI state
 *
 * @param {Object} props
 * @param {boolean} props.active - Is AI active
 * @param {string} props.className - Additional classes
 */
export function AIPulseRing({ active = false, className = '' }) {
  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center',
        className
      )}
    >
      <div
        className={cn(
          'absolute inset-0 rounded-full transition-opacity duration-500',
          active ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          background: 'var(--ai-active)',
          animation: active ? 'pulseRing 2s ease-out infinite' : 'none',
        }}
      />
    </div>
  )
}
