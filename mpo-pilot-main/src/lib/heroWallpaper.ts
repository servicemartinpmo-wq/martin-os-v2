/** localStorage + same-tab sync for dashboard lockscreen hero (preset gallery vs Pexels search). */

export const LS_HERO_PEXELS_ID = "apphia_hero_pexels_id";
export const HERO_WALLPAPER_CHANGED = "apphia-hero-wallpaper";

export function readCustomPexelsId(): number | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(LS_HERO_PEXELS_ID);
  if (!raw) return null;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function setCustomPexelsHero(pexelsId: number): void {
  localStorage.setItem(LS_HERO_PEXELS_ID, String(pexelsId));
  localStorage.removeItem("apphia_hero_photo");
  window.dispatchEvent(new Event(HERO_WALLPAPER_CHANGED));
}

export function clearCustomPexelsHero(): void {
  localStorage.removeItem(LS_HERO_PEXELS_ID);
  window.dispatchEvent(new Event(HERO_WALLPAPER_CHANGED));
}
