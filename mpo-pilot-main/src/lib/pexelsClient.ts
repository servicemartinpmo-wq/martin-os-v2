/**
 * Browser client — calls same-origin `/api/pexels/*` (Express proxy + PEXELS_API_KEY).
 */

export type PexelsPhotoSrc = {
  original: string;
  large2x: string;
  large: string;
  medium: string;
  small: string;
  portrait: string;
  landscape: string;
  tiny: string;
};

export type PexelsPhoto = {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  alt?: string;
  src: PexelsPhotoSrc;
};

export type PexelsSearchResponse = {
  photos: PexelsPhoto[];
  page: number;
  per_page: number;
  total_results: number;
  next_page?: string;
  prev_page?: string;
};

export type PexelsVideoFile = {
  id: number;
  quality: string;
  file_type: string;
  width: number;
  height: number;
  fps: number;
  link: string;
};

export type PexelsVideoPicture = {
  id: number;
  picture: string;
  nr: number;
};

export type PexelsVideo = {
  id: number;
  width: number;
  height: number;
  duration: number;
  image: string;
  url: string;
  user: { id: number; name: string; url: string };
  video_files: PexelsVideoFile[];
  video_pictures: PexelsVideoPicture[];
};

export type PexelsVideoResponse = {
  videos: PexelsVideo[];
  page: number;
  per_page: number;
  total_results: number;
  next_page?: string;
  prev_page?: string;
};

function apiUrl(path: string, params: Record<string, string | number>): string {
  const u = new URL(path, window.location.origin);
  Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, String(v)));
  return u.toString();
}

export async function pexelsSearch(query: string, page = 1, perPage = 15): Promise<PexelsSearchResponse> {
  const url = apiUrl("/api/pexels/search", {
    query: query.trim() || "office",
    page,
    per_page: Math.min(80, Math.max(1, perPage)),
  });
  const r = await fetch(url);
  const text = await r.text();
  if (!r.ok) {
    let msg = text;
    try {
      const j = JSON.parse(text) as { error?: string };
      if (j.error) msg = j.error;
    } catch {
      /* use raw */
    }
    throw new Error(msg || `Pexels search failed (${r.status})`);
  }
  return JSON.parse(text) as PexelsSearchResponse;
}

export async function pexelsCurated(page = 1, perPage = 15): Promise<PexelsSearchResponse> {
  const url = apiUrl("/api/pexels/curated", {
    page,
    per_page: Math.min(80, Math.max(1, perPage)),
  });
  const r = await fetch(url);
  const text = await r.text();
  if (!r.ok) {
    let msg = text;
    try {
      const j = JSON.parse(text) as { error?: string };
      if (j.error) msg = j.error;
    } catch {
      /* use raw */
    }
    throw new Error(msg || `Pexels curated failed (${r.status})`);
  }
  return JSON.parse(text) as PexelsSearchResponse;
}

export async function pexelsVideoSearch(query: string, page = 1, perPage = 12): Promise<PexelsVideoResponse> {
  const url = apiUrl("/api/pexels/videos/search", {
    query: query.trim() || "business",
    page,
    per_page: Math.min(80, Math.max(1, perPage)),
  });
  const r = await fetch(url);
  const text = await r.text();
  if (!r.ok) {
    let msg = text;
    try {
      const j = JSON.parse(text) as { error?: string };
      if (j.error) msg = j.error;
    } catch {
      /* use raw */
    }
    throw new Error(msg || `Pexels video search failed (${r.status})`);
  }
  return JSON.parse(text) as PexelsVideoResponse;
}

export async function pexelsVideoPopular(page = 1, perPage = 12): Promise<PexelsVideoResponse> {
  const url = apiUrl("/api/pexels/videos/popular", {
    page,
    per_page: Math.min(80, Math.max(1, perPage)),
  });
  const r = await fetch(url);
  const text = await r.text();
  if (!r.ok) {
    let msg = text;
    try {
      const j = JSON.parse(text) as { error?: string };
      if (j.error) msg = j.error;
    } catch {
      /* use raw */
    }
    throw new Error(msg || `Pexels video popular failed (${r.status})`);
  }
  return JSON.parse(text) as PexelsVideoResponse;
}
