/** localStorage + same-tab sync for dashboard lockscreen hero (preset gallery vs Pexels search). */

export const HERO_WALLPAPER_CHANGED = "apphia-hero-wallpaper";
export type HeroWallpaperScope = "lockscreen" | "creative" | "reports";

export type HeroVideoSelection = {
  id: number;
  src: string;
  poster?: string;
  fps?: number;
  width?: number;
  height?: number;
  photographer?: string;
  fileType?: string;
};

const LEGACY_PHOTO_KEY = "apphia_hero_pexels_id";
const LEGACY_VIDEO_KEY = "apphia_hero_pexels_video";
// Backward compatibility for older imports (e.g. ErrorBoundary cache clear).
export const LS_HERO_PEXELS_ID = LEGACY_PHOTO_KEY;
export const LS_HERO_PEXELS_VIDEO = LEGACY_VIDEO_KEY;

function photoKey(scope: HeroWallpaperScope): string {
  return `apphia_hero_pexels_id_${scope}`;
}

function videoKey(scope: HeroWallpaperScope): string {
  return `apphia_hero_pexels_video_${scope}`;
}

export function readCustomPexelsId(scope: HeroWallpaperScope = "lockscreen"): number | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(photoKey(scope))
    ?? (scope === "lockscreen" ? localStorage.getItem(LEGACY_PHOTO_KEY) : null);
  if (!raw) return null;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function setCustomPexelsHero(pexelsId: number, scope: HeroWallpaperScope = "lockscreen"): void {
  localStorage.setItem(photoKey(scope), String(pexelsId));
  localStorage.removeItem(videoKey(scope));
  if (scope === "lockscreen") {
    localStorage.removeItem(LEGACY_VIDEO_KEY);
  }
  localStorage.removeItem("apphia_hero_photo");
  window.dispatchEvent(new Event(HERO_WALLPAPER_CHANGED));
}

export function readCustomPexelsVideo(scope: HeroWallpaperScope = "lockscreen"): HeroVideoSelection | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(videoKey(scope))
    ?? (scope === "lockscreen" ? localStorage.getItem(LEGACY_VIDEO_KEY) : null);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<HeroVideoSelection>;
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.id || !parsed.src) return null;
    return {
      id: Number(parsed.id),
      src: String(parsed.src),
      poster: parsed.poster ? String(parsed.poster) : undefined,
      fps: parsed.fps == null ? undefined : Number(parsed.fps),
      width: parsed.width == null ? undefined : Number(parsed.width),
      height: parsed.height == null ? undefined : Number(parsed.height),
      photographer: parsed.photographer ? String(parsed.photographer) : undefined,
      fileType: parsed.fileType ? String(parsed.fileType) : undefined,
    };
  } catch {
    return null;
  }
}

export function setCustomPexelsVideo(selection: HeroVideoSelection, scope: HeroWallpaperScope = "lockscreen"): void {
  localStorage.setItem(videoKey(scope), JSON.stringify(selection));
  localStorage.removeItem(photoKey(scope));
  if (scope === "lockscreen") {
    localStorage.removeItem(LEGACY_PHOTO_KEY);
  }
  localStorage.removeItem("apphia_hero_photo");
  window.dispatchEvent(new Event(HERO_WALLPAPER_CHANGED));
}

export function clearCustomPexelsHero(scope: HeroWallpaperScope = "lockscreen"): void {
  localStorage.removeItem(photoKey(scope));
  localStorage.removeItem(videoKey(scope));
  if (scope === "lockscreen") {
    localStorage.removeItem(LEGACY_PHOTO_KEY);
    localStorage.removeItem(LEGACY_VIDEO_KEY);
  }
  window.dispatchEvent(new Event(HERO_WALLPAPER_CHANGED));
}
