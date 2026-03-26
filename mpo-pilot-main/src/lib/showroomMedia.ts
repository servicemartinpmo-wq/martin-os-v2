/**
 * Showroom-grade imagery: UHD stills (4K-class WebP from Unsplash) + optional video hooks.
 * Swap `SHOWROOM_VIDEO_LOOPS` paths to your own 4K / 50–60fps WebM or ProRes on a CDN for motion.
 */

const IX = "ixlib=rb-4.0.3";

/** ~4K / QHD / FHD WebP crops — sharp on retina and ultrawide heroes */
export function uhdSrc(photoPath: string, width: 3840 | 2560 | 1920 = 3840, height?: number) {
  let q = `${IX}&auto=format&fm=webp&q=95&w=${width}&fit=crop`;
  if (height != null) q += `&h=${height}`;
  return `https://images.unsplash.com/${photoPath}?${q}`;
}

export function uhdSrcSet(photoPath: string) {
  return `${uhdSrc(photoPath, 1920)} 1920w, ${uhdSrc(photoPath, 2560)} 2560w, ${uhdSrc(photoPath, 3840)} 3840w`;
}

/** Shared with Dashboard hero + Admin wallpaper picker (same localStorage index). */
export const SHOWROOM_HERO_BACKGROUNDS = [
  {
    id: "exec-suite",
    photo: "photo-1497366216548-37526070297c",
    label: "Executive suite",
    category: "Strategy",
    showroom: "Corner office · glass · city light",
  },
  {
    id: "car-atelier",
    photo: "photo-1617814076367-b759c7d7e738",
    label: "Automotive gallery",
    category: "Showroom",
    showroom: "Vehicle atelier · lacquered floor · spot",
  },
  {
    id: "white-cube",
    photo: "photo-1544967082-d9d25d867d66",
    label: "Museum hall",
    category: "Gallery",
    showroom: "White cube · archival light · laminate bench",
  },
  {
    id: "tech-expo",
    photo: "photo-1540575467063-27a0d4c30ce6",
    label: "Tech pavilion",
    category: "Showcase",
    showroom: "Expo hall · LED · product bays",
  },
  {
    id: "analytics-lab",
    photo: "photo-1551288049-bebda4e38f71",
    label: "Insight wall",
    category: "Insights",
    showroom: "Operations bridge · live boards",
  },
  {
    id: "sky-lobby",
    photo: "photo-1486406146926-c627a92ad1ab",
    label: "Tower lobby",
    category: "Urban",
    showroom: "High-rise atrium · polished stone",
  },
  {
    id: "orbit-deck",
    photo: "photo-1451187580459-43490279c0fa",
    label: "Mission control",
    category: "Cosmos",
    showroom: "Global ops · curved glass · depth",
  },
] as const;

export type ShowroomHeroItem = (typeof SHOWROOM_HERO_BACKGROUNDS)[number];

/** Ready for `<img src srcSet sizes>` — Dashboard + Admin share indices via `apphia_hero_photo`. */
export const SHOWROOM_HERO_UI = SHOWROOM_HERO_BACKGROUNDS.map((item) => ({
  id: item.id,
  src: uhdSrc(item.photo, 3840),
  srcSet: uhdSrcSet(item.photo),
  label: item.label,
  category: item.category,
  showroom: item.showroom,
}));

/** Creative portfolio cards — product / gallery / 3D-leaning stills, UHD */
export const SHOWROOM_CREATIVE_CARDS = [
  {
    id: "cp1",
    title: "Brand Refresh",
    client: "Meridian Co.",
    status: "Active",
    photo: "photo-1618005182384-a83a8bd57f68",
    accent: "#00ffe0",
    accentRgb: "0,255,224",
  },
  {
    id: "cp2",
    title: "Campaign Strategy",
    client: "Apex Studios",
    status: "Review",
    photo: "photo-1634017830976-f492dcf42689",
    accent: "#bf80ff",
    accentRgb: "191,128,255",
  },
  {
    id: "cp3",
    title: "Editorial Design",
    client: "Novo Press",
    status: "Active",
    photo: "photo-1541961017774-22349e4a1262",
    accent: "#ff6b35",
    accentRgb: "255,107,53",
  },
  {
    id: "cp4",
    title: "Social Content",
    client: "Solaris Health",
    status: "Draft",
    photo: "photo-1558618666-fcd25c85cd64",
    accent: "#ffdd00",
    accentRgb: "255,221,0",
  },
  {
    id: "cp5",
    title: "Visual Identity",
    client: "Fleur Studio",
    status: "Active",
    photo: "photo-1561070791-2526d30994b5",
    accent: "#ff80ab",
    accentRgb: "255,128,171",
  },
  {
    id: "cp6",
    title: "Motion Direction",
    client: "Neon Works",
    status: "In Progress",
    photo: "photo-1550745165-9bc0b252726f",
    accent: "#40c4ff",
    accentRgb: "64,196,255",
  },
] as const;

export function creativeCardSrc(photo: string) {
  return uhdSrc(photo, 3840, 2400);
}

export function creativeCardSrcSet(photo: string) {
  return `${uhdSrc(photo, 1920, 1200)} 1920w, ${uhdSrc(photo, 2560, 1600)} 2560w, ${uhdSrc(photo, 3840, 2400)} 3840w`;
}

/** Reports rotating hero — ultrawide-friendly */
export const SHOWROOM_REPORT_HEROES = [
  { id: "r1", photo: "photo-1497366216548-37526070297c", label: "Executive gallery" },
  { id: "r2", photo: "photo-1551288049-bebda4e38f71", label: "Insight console" },
  { id: "r3", photo: "photo-1617814076367-b759c7d7e738", label: "Precision showroom" },
  { id: "r4", photo: "photo-1544967082-d9d25d867d66", label: "Curatorial space" },
].map((r) => ({
  ...r,
  src: uhdSrc(r.photo, 3840, 1200),
  srcSet: `${uhdSrc(r.photo, 1920, 600)} 1920w, ${uhdSrc(r.photo, 3840, 1200)} 3840w`,
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
    poster: uhdSrc("photo-1544967082-d9d25d867d66", 3840),
    mime: "video/webm",
  },
  techFloor: {
    src: "/showroom/tech-floor.webm",
    poster: uhdSrc("photo-1540575467063-27a0d4c30ce6", 3840),
    mime: "video/webm",
  },
};
