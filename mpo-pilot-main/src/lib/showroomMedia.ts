/**
 * Showroom-grade imagery via Pexels (CDN URLs) + optional video hooks.
 * Optional API (search/curated): use `PEXELS_API_KEY` on the server and `/api/pexels/*` — never embed the key in the client.
 * Attribution: https://www.pexels.com/api/documentation/#guidelines
 */

import {
  pexelsSrc,
  pexelsSrcSet,
  pexelsSrcSetCropped,
  creativeCardSrc,
  creativeCardSrcSet,
} from "@/lib/pexelsUrls";

export { creativeCardSrc, creativeCardSrcSet } from "@/lib/pexelsUrls";

/** Shared with Dashboard hero + Admin wallpaper picker (same localStorage index). */
export const SHOWROOM_HERO_BACKGROUNDS = [
  {
    id: "exec-suite",
    pexelsId: 3184292,
    label: "Executive suite",
    category: "Strategy",
    showroom: "Corner office · glass · city light",
  },
  {
    id: "car-atelier",
    pexelsId: 3802510,
    label: "Automotive gallery",
    category: "Showroom",
    showroom: "Vehicle atelier · lacquered floor · spot",
  },
  {
    id: "white-cube",
    pexelsId: 4440344,
    label: "Museum hall",
    category: "Gallery",
    showroom: "White cube · archival light · laminate bench",
  },
  {
    id: "tech-expo",
    pexelsId: 3861969,
    label: "Tech pavilion",
    category: "Showcase",
    showroom: "Expo hall · LED · product bays",
  },
  {
    id: "analytics-lab",
    pexelsId: 7433820,
    label: "Insight wall",
    category: "Insights",
    showroom: "Operations bridge · live boards",
  },
  {
    id: "sky-lobby",
    pexelsId: 323705,
    label: "Tower lobby",
    category: "Urban",
    showroom: "High-rise atrium · polished stone",
  },
  {
    id: "orbit-deck",
    pexelsId: 256264,
    label: "Mission control",
    category: "Cosmos",
    showroom: "Global ops · curved glass · depth",
  },
] as const;

export type ShowroomHeroItem = (typeof SHOWROOM_HERO_BACKGROUNDS)[number];

/** Ready for `<img src srcSet sizes>` — Dashboard + Admin share indices via `apphia_hero_photo`. */
export const SHOWROOM_HERO_UI = SHOWROOM_HERO_BACKGROUNDS.map((item) => ({
  id: item.id,
  src: pexelsSrc(item.pexelsId, 3840),
  srcSet: pexelsSrcSet(item.pexelsId),
  label: item.label,
  category: item.category,
  showroom: item.showroom,
}));

/** Creative portfolio cards — product / gallery / abstract stills */
export const SHOWROOM_CREATIVE_CARDS = [
  {
    id: "cp1",
    title: "Brand Refresh",
    client: "Meridian Co.",
    status: "Active",
    pexelsId: 2880507,
    accent: "#00ffe0",
    accentRgb: "0,255,224",
  },
  {
    id: "cp2",
    title: "Campaign Strategy",
    client: "Apex Studios",
    status: "Review",
    pexelsId: 7688336,
    accent: "#bf80ff",
    accentRgb: "191,128,255",
  },
  {
    id: "cp3",
    title: "Editorial Design",
    client: "Novo Press",
    status: "Active",
    pexelsId: 1570396,
    accent: "#ff6b35",
    accentRgb: "255,107,53",
  },
  {
    id: "cp4",
    title: "Social Content",
    client: "Solaris Health",
    status: "Draft",
    pexelsId: 1191710,
    accent: "#ffdd00",
    accentRgb: "255,221,0",
  },
  {
    id: "cp5",
    title: "Visual Identity",
    client: "Fleur Studio",
    status: "Active",
    pexelsId: 8360441,
    accent: "#ff80ab",
    accentRgb: "255,128,171",
  },
  {
    id: "cp6",
    title: "Motion Direction",
    client: "Neon Works",
    status: "In Progress",
    pexelsId: 2387793,
    accent: "#40c4ff",
    accentRgb: "64,196,255",
  },
] as const;

/** Reports rotating hero — ultrawide-friendly */
export const SHOWROOM_REPORT_HEROES = [
  { id: "r1", pexelsId: 3184292, label: "Executive gallery" },
  { id: "r2", pexelsId: 7433820, label: "Insight console" },
  { id: "r3", pexelsId: 3802510, label: "Precision showroom" },
  { id: "r4", pexelsId: 4440344, label: "Curatorial space" },
].map((r) => ({
  ...r,
  src: pexelsSrc(r.pexelsId, 3840, 1200),
  srcSet: pexelsSrcSetCropped(r.pexelsId, { h1920: 600, h3840: 1200 }),
}));

/**
 * Optional ambient loops — place files under `public/showroom/` or point to CDN.
 * Prefer WebM VP9 50–60fps or HEVC for 4K; `poster` is UHD still while video loads.
 */
export const SHOWROOM_VIDEO_LOOPS: Record<
  string,
  { src: string; poster: string; mime?: string }
> = {
  galleryShimmer: {
    src: "/showroom/gallery-shimmer.webm",
    poster: pexelsSrc(4440344, 3840),
    mime: "video/webm",
  },
  techFloor: {
    src: "/showroom/tech-floor.webm",
    poster: pexelsSrc(3861969, 3840),
    mime: "video/webm",
  },
};
