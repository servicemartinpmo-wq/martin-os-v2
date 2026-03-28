'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Maximize2, Minimize2, Sparkles, MessageSquare } from 'lucide-react'
import { getDashboardByDomain, getAIIntegrationForDomain } from '@/lib/domainDashboards'
import AIStatusIndicator, { AITypingIndicator } from './AIStatusIndicator'
import { cn } from '@/lib/cn'
import { fadeScaleFast } from '@/motion/presets'

/**
 * AI Presence Layer Component
 * Provides AI interaction interface with state management and animations
 *
 * @param {Object} props
 * @param {string} props.domain - Domain (PMO | TECH_OPS | MIIDLE)
 * @param {string} props.appView - App view
 * @param {string} props.initialState - Initial AI state
 * @param {function} props.onStateChange - Callback when AI state changes
 * @param {function} props.onMessage - Callback when user sends message
 */
export default function AIPresenceLayer({
  domain,
  appView,
  initialState = 'idle',
  onStateChange,
  onMessage,
}) {
  const [aiState, setAIState] = useState(initialState)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const dashboard = getDashboardByDomain(appView)
  const aiConfig = getAIIntegrationForDomain(appView)
  const isEnabled = aiConfig?.enabled

  const updateState = useCallback(
    (newState) => {
      setAIState(newState)
      onStateChange?.(newState)
    },
    [onStateChange]
  )

  const handleExpand = () => {
    setIsExpanded(true)
  }

  const handleCollapse = () => {
    setIsExpanded(false)
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    updateState('processing')
    setIsProcessing(true)

    // Simulate AI processing
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `I'm processing your request about: "${userMessage.content}"`,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, aiMessage])
      updateState('idle')
      setIsProcessing(false)

      onMessage?.(userMessage, aiMessage)
    }, 1500)
  }

  const getCapabilities = () => {
    return aiConfig?.capabilities || []
  }

  if (!isEnabled) return null

  // Render collapsed state
  if (!isExpanded) {
    return (
      <motion.div
        className={cn(
          'fixed bottom-4 left-4 z-50',
          aiConfig?.position === 'floating' ? 'bottom-4 right-4 left-auto' : ''
        )}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={fadeScaleFast}
      >
        <AIStatusIndicator
          state={aiState}
          showGlow
          onClick={handleExpand}
        />
      </motion.div>
    )
  }

  // Render expanded state
  return (
    <motion.div
      className={cn(
        'fixed bottom-4 left-4 z-50 w-96 max-w-[calc(100vw-2rem)]',
        aiConfig?.position === 'floating' ? 'bottom-4 right-4 left-auto' : '',
        'glass-panel glass-panel--elevated chrome-edge'
      )}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={fadeScaleFast}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--ai-active)]" />
          <span className="font-semibold text-sm">AI Assistant</span>
          <AIStatusIndicator state={aiState} className="ml-2" />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCollapse}
            className="p-1 rounded hover:bg-[var(--bg-subtle)] transition-colors"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Capabilities */}
      {getCapabilities().length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 border-b border-[var(--border-subtle)]">
          {getCapabilities().map((capability) => (
            <button
              key={capability}
              className="px-3 py-1 text-xs font-medium rounded-full border border-[var(--border-subtle)] hover:border-[var(--accent)] hover:bg-[var(--accent-muted)] transition-all"
              onClick={() => {
                setInputValue(`Help me with ${capability.replace('-', ' ')}`)
                handleSendMessage()
              }}
            >
              {capability}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-[var(--text-muted)] py-8"
            >
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">How can I help you today?</p>
            </motion.div>
          ) : (
            messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'flex',
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-lg px-4 py-2',
                    msg.role === 'user'
                      ? 'bg-[var(--accent)] text-[var(--text-on-accent)]'
                      : 'bg-[var(--surface-elevated)] border border-[var(--border-subtle)]'
                  )}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {/* Processing indicator */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-lg px-4 py-2">
              <AITypingIndicator />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[var(--border-subtle)]">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything..."
            disabled={isProcessing}
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] focus:outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={isProcessing || !inputValue.trim()}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--accent)] text-[var(--text-on-accent)] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </motion.div>
  )
}
