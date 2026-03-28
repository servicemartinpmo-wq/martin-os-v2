'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { pluginContent } from '../data/contentRegistry'
import { fetchPexelsMedia, fetchPexelsVideoMedia } from '../services/pexelsAdapter'
import SectionHeader from './shell/SectionHeader'

function copyLocalMedia() {
  return [...(pluginContent.miidle.media ?? [])]
}

function Miidle({ pagePreset, animationPreset }) {
  const [remoteMedia, setRemoteMedia] = useState(() => copyLocalMedia())
  const [mediaSource, setMediaSource] = useState('Local fallback')
  const [activeIndex, setActiveIndex] = useState(0)

  const mediaItems = remoteMedia
  const normalizedIndex = mediaItems.length > 0 ? Math.min(activeIndex, mediaItems.length - 1) : -1
  const activeMedia = normalizedIndex >= 0 ? mediaItems[normalizedIndex] : null

  useEffect(() => {
    let isMounted = true
    const loadRemoteMedia = async () => {
      try {
        const [videoMedia, imageMedia] = await Promise.all([
          fetchPexelsVideoMedia({ query: 'luxury fashion showroom', perPage: 2 }),
          fetchPexelsMedia({ query: 'creative technology studio', perPage: 6 }),
        ])
        const media = [...videoMedia, ...imageMedia]
        if (!isMounted) return
        if (media.length > 0) {
          setRemoteMedia(media)
          setMediaSource('Pexels API')
        } else {
          setRemoteMedia(copyLocalMedia())
          setMediaSource('Local fallback')
        }
      } catch {
        if (!isMounted) return
        setRemoteMedia(copyLocalMedia())
        setMediaSource('Local fallback')
      }
    }
    loadRemoteMedia()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className={pagePreset === 'cinematic-cards' ? 'miidle-layout cinematic' : 'miidle-layout'}>
      <SectionHeader
        title="Creative Plugin Layer"
        subtitle="Miidle delivers visual storytelling and media sequencing inside PMO-Ops."
      />
      <p className="media-source">Media source: {mediaSource}</p>

      {activeMedia ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={normalizedIndex}
            className={`carousel miidle-hero laminated ${animationPreset === 'immersive' ? 'cinematic-motion' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: animationPreset === 'reduced' ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeMedia.videoSrc ? (
              <video src={activeMedia.videoSrc} poster={activeMedia.src} autoPlay muted loop playsInline preload="metadata" />
            ) : (
              <img src={activeMedia.src} alt={activeMedia.title} loading="lazy" />
            )}
            <div className="carousel-caption">
              <h3>{activeMedia.title}</h3>
              <p>4K-ready visual feed with smooth, focused transitions and 50fps intent.</p>
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="media-fallback laminated">No media items available. Content state is preserved.</div>
      )}

      <div className="carousel-controls console-dots">
        {mediaItems.map((item, index) => (
          <button
            key={item.title ?? index}
            type="button"
            className={index === normalizedIndex ? 'dot active' : 'dot'}
            onClick={() => setActiveIndex(index)}
            aria-label={`Show ${item.title}`}
          />
        ))}
      </div>

      <ul className="highlight-list">
        {pluginContent.miidle.highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

export default Miidle
