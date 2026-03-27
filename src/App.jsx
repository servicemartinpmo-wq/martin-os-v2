"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { captureEvent } from './brain/capture/captureBus'
import AmbientLightLayer from './components/AmbientLightLayer'
import GlassCard from './components/GlassCard'
import LightGuide from './components/LightGuide'
import PresenceScene from './components/PresenceScene'
import { useCursorPosition } from './hooks/useCursorPosition'
import { useIntelligenceBridge } from './hooks/useIntelligenceBridge'
import { useIntelligenceStore } from './store/intelligenceStore'
import { usePresenceStore } from './store/presenceStore'
import './App.css'

const modules = [
  'Welcome Hall',
  'Services Gallery',
  'Planning',
  'Organization',
  'Execution',
  'Optimization',
  'Assistant Panel',
  'Memory Layer',
]

function App() {
  const activeModule = usePresenceStore((state) => state.activeModule)
  const setActiveModule = usePresenceStore((state) => state.setActiveModule)
  const setPointer = usePresenceStore((state) => state.setPointer)
  const { x, y, vw, vh } = useCursorPosition()
  const [awakened, setAwakened] = useState(false)
  const [intent, setIntent] = useState(null)
  const [isOrbFocused, setIsOrbFocused] = useState(false)
  const [focusedModule, setFocusedModule] = useState(null)
  const [intensity, setIntensity] = useState(0)
  const prevXRef = useRef(0)
  const signalTickRef = useRef(0)
  const hoverTimersRef = useRef({})
  const rotateY = (x - vw / 2) / 40
  const rotateX = -(y - vh / 2) / 40
  const cursorX = vw ? x / vw : 0.5
  const cursorY = vh ? y / vh : 0.5
  const hour = new Date().getHours()
  const mode = hour < 12 ? 'morning' : hour < 18 ? 'day' : 'evening'
  const isIntentVisible = awakened || isOrbFocused || intent === 'interested' || activeModule !== null
  const whisperLabel = focusedModule || activeModule
  const proof = useIntelligenceStore((state) => state.proof)
  const outcomes = useIntelligenceStore((state) => state.outcomes)
  const recommendation = useIntelligenceStore((state) => state.recommendation)
  const curiosityFragments = useIntelligenceStore((state) => state.curiosityFragments)
  const spectatorContract = useIntelligenceStore((state) => state.spectatorContract)

  useIntelligenceBridge(activeModule)

  useEffect(() => {
    const speed = Math.abs(x - prevXRef.current)
    const nextIntensity = Math.min(speed / 50, 1)
    setIntensity(nextIntensity)
    signalTickRef.current += 1
    if (signalTickRef.current % 7 === 0) {
      captureEvent('cursor_energy', { intensity: nextIntensity })
    }
    prevXRef.current = x
  }, [x])

  useEffect(() => {
    if (!isOrbFocused) return
    const timer = setTimeout(() => setIntent('interested'), 850)
    return () => clearTimeout(timer)
  }, [isOrbFocused])

  useEffect(() => {
    const timers = hoverTimersRef.current
    return () => {
      Object.values(timers).forEach((timer) => clearTimeout(timer))
    }
  }, [])

  const moodBackground = useMemo(() => {
    const backgrounds = {
      morning: 'linear-gradient(#FFFDF8, #F3F1EC)',
      day: 'linear-gradient(#F8F8F6, #ECEBE7)',
      evening: 'linear-gradient(#F4F1EA, #E8E6E1)',
    }
    return backgrounds[mode]
  }, [mode])

  return (
    <div
      className={`presence-shell mode-${mode}`}
      style={{ background: moodBackground }}
      onMouseMove={(event) => {
        const x = event.clientX / window.innerWidth
        const y = event.clientY / window.innerHeight
        setPointer(x, y)
      }}
    >
      <PresenceScene mode={mode} awakened={awakened} intensity={intensity} />
      <AmbientLightLayer />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,1),rgba(240,240,238,1))]" />
      <div className="noise-overlay" />

      <motion.main
        animate={{
          x: awakened ? [0, 8, -6, 0] : [0, 10, -10, 0],
          y: awakened ? [0, -4, 4, 0] : [0, -8, 8, 0],
          scale: awakened ? 1.01 : 1,
        }}
        transition={{
          duration: awakened ? 16 : 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`relative z-10 mx-auto flex min-h-screen w-full max-w-[1400px] flex-col justify-between px-8 py-8 ${awakened ? 'awakened' : ''}`}
      >
        <div className="flex items-center justify-between">
          <motion.p
            animate={{ opacity: isIntentVisible ? 0.28 : 0.12 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[10px] tracking-[0.35em] text-[#777]"
          >
            MARTIN OS
          </motion.p>
        </div>

        <section className="relative flex flex-1 items-center justify-center">
          {isIntentVisible && <LightGuide className="left-[16%] top-[26%]" />}
          {(awakened || intent === 'interested') && <LightGuide className="right-[18%] top-[42%]" />}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: awakened ? [1, 1.06, 1.02] : [1, 1.02, 1],
              opacity: 1,
              rotateY,
              rotateX,
              filter: awakened ? 'blur(2px)' : 'blur(0px)',
            }}
            transition={{
              scale: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 1.2, ease: 'easeOut' },
              rotateY: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
              rotateX: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
              filter: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
            }}
            className="presence-orb"
            onClick={() => {
              setAwakened((prev) => !prev)
              captureEvent('signature_awaken', { mode, intensity })
            }}
            onMouseEnter={() => setIsOrbFocused(true)}
            onMouseLeave={() => {
              setIsOrbFocused(false)
              setIntent(null)
            }}
            role="button"
            aria-label="Toggle awakened perspective"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                setAwakened((prev) => !prev)
              }
            }}
          />

          <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{
              opacity: isIntentVisible ? 1 : 0,
              filter: isIntentVisible ? 'blur(0px)' : 'blur(10px)',
              x: awakened ? 8 : 0,
              y: awakened ? -6 : 0,
              scale: isIntentVisible ? 1 : 0.985,
            }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="module-grid"
          >
            {modules.map((module, index) => (
              <motion.div
                key={module}
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 + index * 0.08 }}
                whileHover={{ y: -4 }}
                className={`module-item module-item-${index + 1}`}
                style={{
                  opacity: 0.78 + intensity * 0.14,
                  filter: `brightness(${1 + Math.max(0, 1 - Math.hypot(cursorX - ((index % 4) + 1) / 5, cursorY - (index < 4 ? 0.42 : 0.62)) * 1.5) * (0.04 + intensity * 0.04)}) blur(${Math.max(0, Math.min(1.4, Math.hypot(cursorX - ((index % 4) + 1) / 5, cursorY - (index < 4 ? 0.42 : 0.62)) * (0.9 - intensity * 0.22)))}px)`,
                }}
                onMouseEnter={() => {
                  setFocusedModule(module)
                  captureEvent('module_focus', { module })
                  hoverTimersRef.current[module] = setTimeout(() => {
                    setActiveModule(module)
                    captureEvent('intent_hover_commit', { module })
                  }, 650)
                }}
                onMouseLeave={() => {
                  setFocusedModule((prev) => (prev === module ? null : prev))
                  clearTimeout(hoverTimersRef.current[module])
                  hoverTimersRef.current[module] = null
                }}
              >
                <GlassCard className="module-surface">
                  <motion.h3
                    animate={{
                      opacity: focusedModule === module || activeModule === module ? 0.88 : 0.06,
                      y: focusedModule === module || activeModule === module ? 0 : 4,
                    }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="pointer-events-none text-lg font-medium text-[#111]"
                  >
                    {module}
                  </motion.h3>
                  <motion.p
                    animate={{
                      height: activeModule === module ? 'auto' : 0,
                      opacity: activeModule === module ? 0.8 : 0,
                      filter: activeModule === module ? 'blur(0px)' : 'blur(6px)',
                    }}
                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                    className="pointer-events-none overflow-hidden text-sm leading-relaxed text-[#666]"
                  >
                    {recommendation?.message || 'A curated surface appears only when your attention settles.'}
                  </motion.p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: isIntentVisible ? 0.55 : 0.08, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
          className="pb-4 text-center"
        >
          <h1 className="text-4xl font-light tracking-wide text-[#111] md:text-5xl">
            Your Private Intelligence
          </h1>
          <motion.p
            animate={{ opacity: isIntentVisible ? 0.6 : 0.18 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 text-xs tracking-[0.2em] text-[#666]"
          >
            PROOF {proof.proofOfWork} | IQ {proof.systemIQ}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          animate={{
            opacity: whisperLabel ? 0.66 : 0,
            filter: whisperLabel ? 'blur(0px)' : 'blur(8px)',
            y: whisperLabel ? 0 : 10,
          }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="whisper-layer"
        >
          <span>{whisperLabel || spectatorContract.fragments[0] || curiosityFragments[0] || ''}</span>
          {!!outcomes[0] && <small>{`${outcomes[0].label}: ${outcomes[0].value}`}</small>}
        </motion.div>
      </motion.main>
    </div>
  )
}

export default App
