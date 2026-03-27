const PEXELS_API_BASE = 'https://api.pexels.com/v1/search'
const PEXELS_VIDEO_API_BASE = 'https://api.pexels.com/videos/search'
const CACHE_TTL_MS = 1000 * 60 * 30
let hasWarnedMissingPexelsKey = false

function getPexelsApiKey() {
  const key = globalThis.process?.env?.NEXT_PUBLIC_PEXELS_API_KEY
  if (!key && !hasWarnedMissingPexelsKey && globalThis.process?.env?.NODE_ENV !== 'production') {
    hasWarnedMissingPexelsKey = true
    console.warn(
      '[martin-os] NEXT_PUBLIC_PEXELS_API_KEY is missing; using local curated fallback media.'
    )
  }
  return key
}

function mapPhotoToMedia(photo) {
  return {
    title: photo.alt || `Pexels Photo ${photo.id}`,
    src: photo.src?.large2x || photo.src?.large || photo.src?.medium || '',
    kind: 'image',
  }
}

function mapVideoToMedia(video) {
  const file =
    (video.video_files || []).find((entry) => entry.quality === 'hd') || (video.video_files || [])[0]
  return {
    title: video.user?.name ? `${video.user.name} Motion` : `Pexels Video ${video.id}`,
    src: video.image || '',
    videoSrc: file?.link || '',
    kind: 'video',
  }
}

function getCacheKey(key) {
  return `martin-os-pexels-${key}`
}

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readCache(key) {
  if (!canUseLocalStorage()) return null
  try {
    const raw = localStorage.getItem(getCacheKey(key))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed.timestamp || Date.now() - parsed.timestamp > CACHE_TTL_MS) return null
    return parsed.data
  } catch {
    return null
  }
}

function writeCache(key, data) {
  if (!canUseLocalStorage()) return
  try {
    localStorage.setItem(getCacheKey(key), JSON.stringify({ timestamp: Date.now(), data }))
  } catch {
    // ignore cache failures
  }
}

export async function fetchPexelsMedia({ query = 'business dashboard', perPage = 6 } = {}) {
  const apiKey = getPexelsApiKey()
  if (!apiKey) return []
  const cacheKey = `images-${query}-${perPage}`
  const cached = readCache(cacheKey)
  if (cached) return cached

  const url = new URL(PEXELS_API_BASE)
  url.searchParams.set('query', query)
  url.searchParams.set('per_page', String(perPage))
  url.searchParams.set('orientation', 'landscape')

  const response = await fetch(url.toString(), {
    headers: { Authorization: apiKey },
  })

  if (!response.ok) throw new Error(`Pexels request failed with status ${response.status}`)

  const payload = await response.json()
  const media = (payload.photos || []).map(mapPhotoToMedia).filter((item) => item.src)
  writeCache(cacheKey, media)
  return media
}

export async function fetchPexelsVideoMedia({ query = 'luxury technology', perPage = 3 } = {}) {
  const apiKey = getPexelsApiKey()
  if (!apiKey) return []
  const cacheKey = `videos-${query}-${perPage}`
  const cached = readCache(cacheKey)
  if (cached) return cached

  const url = new URL(PEXELS_VIDEO_API_BASE)
  url.searchParams.set('query', query)
  url.searchParams.set('per_page', String(perPage))
  url.searchParams.set('orientation', 'landscape')

  const response = await fetch(url.toString(), {
    headers: { Authorization: apiKey },
  })
  if (!response.ok) throw new Error(`Pexels video request failed with status ${response.status}`)

  const payload = await response.json()
  const media = (payload.videos || []).map(mapVideoToMedia).filter((item) => item.videoSrc && item.src)
  writeCache(cacheKey, media)
  return media
}
