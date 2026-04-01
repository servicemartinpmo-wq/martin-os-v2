/**
 * Curated Pexels assets. Production entries must meet:
 * - Still: longest edge ≥ 3840px (record width/height)
 * - Video: frameRate ≥ 50 (verify before adding)
 *
 * URLs use Pexels CDN; configure next.config remotePatterns.
 */

/** @typedef {{ id: string, type: 'image', src: string, width: number, height: number, alt: string, photographer?: string }} PexelsImage */
/** @typedef {{ id: string, type: 'video', src: string, poster: string, frameRate: number, alt: string }} PexelsVideo */

/** @type {(PexelsImage | PexelsVideo)[]} */
export const PEXELS_PRESETS = [
  {
    id: 'hero-office-4k',
    type: 'image',
    src: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=3840',
    width: 3840,
    height: 2160,
    alt: 'Team collaboration in a modern office',
    photographer: 'fauxels',
  },
  {
    id: 'abstract-lights-4k',
    type: 'image',
    src: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=3840',
    width: 3840,
    height: 2400,
    alt: 'Abstract city bokeh lights',
  },
]

/** @param {string} id */
export function getPexelsPreset(id) {
  return PEXELS_PRESETS.find((p) => p.id === id)
}
