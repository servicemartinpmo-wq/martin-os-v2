/**
 * Pexels CDN image URLs (no API key required to display).
 * @see https://www.pexels.com/api/documentation/#photos-search — use the API for search/curation; keep keys server-side via `/api/pexels/*`.
 */

function pexelsPhotoPath(pexelsId: number): string {
  return `https://images.pexels.com/photos/${pexelsId}/pexels-photo-${pexelsId}.jpeg`;
}

/** Resize & compress via Pexels image CDN query params. */
export function pexelsSrc(pexelsId: number, w: number, h?: number): string {
  const base = pexelsPhotoPath(pexelsId);
  const q = new URLSearchParams({ auto: "compress", cs: "tinysrgb", w: String(w) });
  if (h != null) {
    q.set("h", String(h));
    q.set("fit", "crop");
  }
  return `${base}?${q.toString()}`;
}

export function pexelsSrcSet(pexelsId: number): string {
  return `${pexelsSrc(pexelsId, 1920)} 1920w, ${pexelsSrc(pexelsId, 2560)} 2560w, ${pexelsSrc(pexelsId, 3840)} 3840w`;
}

export function pexelsSrcSetCropped(pexelsId: number, heights: { h1920: number; h3840: number }): string {
  const { h1920, h3840 } = heights;
  return `${pexelsSrc(pexelsId, 1920, h1920)} 1920w, ${pexelsSrc(pexelsId, 3840, h3840)} 3840w`;
}

export function creativeCardSrc(pexelsId: number): string {
  return pexelsSrc(pexelsId, 3840, 2400);
}

export function creativeCardSrcSet(pexelsId: number): string {
  return `${pexelsSrc(pexelsId, 1920, 1200)} 1920w, ${pexelsSrc(pexelsId, 2560, 1600)} 2560w, ${pexelsSrc(pexelsId, 3840, 2400)} 3840w`;
}

/** Onboarding / wizard full-bleed backgrounds — executive & abstract moods */
export const PEXELS_ONBOARD_SLIDE_BGS = [
  3184292, 3861969, 7433820, 256264, 323705,
] as const;

export const PEXELS_ONBOARD_WELCOME_HERO = 3184465;
export const PEXELS_ONBOARD_COLLAGE = 2880507;

export function onboardSlideBgSrc(pexelsId: number): string {
  return pexelsSrc(pexelsId, 2400, 1600);
}
