export type AppUserMode =
  | "founder"
  | "executive"
  | "startup"
  | "creative"
  | "freelance"
  | "simple"
  | "healthcare";

export type ExperiencePresetId =
  | "soft-ops"
  | "neon-control"
  | "clean-hr"
  | "orbital-analytics"
  | "city-command"
  | "frosted-dark"
  | "story-grid"
  | "clinical-network"
  | "planet-console"
  | "project-bureau";

export type ExperiencePreset = {
  id: ExperiencePresetId;
  label: string;
  summary: string;
  tone: "dark" | "light";
};

const STORAGE_PRESET_KEY = "apphia_experience_preset";
const STORAGE_AUTO_BY_MODE_KEY = "apphia_experience_auto_by_mode";
const STORAGE_MODE_MAP_KEY = "apphia_experience_mode_map";

export const EXPERIENCE_PRESETS: ExperiencePreset[] = [
  { id: "soft-ops", label: "Soft Ops", summary: "Rounded SaaS cards and soft gradients.", tone: "light" },
  { id: "neon-control", label: "Neon Control", summary: "Deep navy glass with electric blue telemetry.", tone: "dark" },
  { id: "clean-hr", label: "Clean HR", summary: "Cream-white productivity surfaces with focused contrast.", tone: "light" },
  { id: "orbital-analytics", label: "Orbital Analytics", summary: "Dark analyst console with vivid chart lines.", tone: "dark" },
  { id: "city-command", label: "City Command", summary: "Smart-city operation center aesthetic.", tone: "dark" },
  { id: "frosted-dark", label: "Frosted Dark", summary: "Muted dark dashboard with polished card glow.", tone: "dark" },
  { id: "story-grid", label: "Story Grid", summary: "Editorial tile-based boards for creative review.", tone: "dark" },
  { id: "clinical-network", label: "Clinical Network", summary: "Hospital operations HUD with blue diagnostics.", tone: "dark" },
  { id: "planet-console", label: "Planet Console", summary: "Sci-fi module cards and orbital widgets.", tone: "dark" },
  { id: "project-bureau", label: "Project Bureau", summary: "Task-first workbench inspired by PM UIs.", tone: "light" },
];

const DEFAULT_MODE_MAP: Record<AppUserMode, ExperiencePresetId> = {
  founder: "soft-ops",
  executive: "neon-control",
  startup: "project-bureau",
  creative: "story-grid",
  freelance: "frosted-dark",
  simple: "clean-hr",
  healthcare: "clinical-network",
};

export function getExperiencePresetById(id: string | null | undefined): ExperiencePreset {
  return EXPERIENCE_PRESETS.find((p) => p.id === id) ?? EXPERIENCE_PRESETS[0];
}

export function getStoredExperiencePresetId(): ExperiencePresetId {
  try {
    const raw = localStorage.getItem(STORAGE_PRESET_KEY);
    return getExperiencePresetById(raw).id;
  } catch {
    return EXPERIENCE_PRESETS[0].id;
  }
}

export function setStoredExperiencePresetId(id: ExperiencePresetId): void {
  try {
    localStorage.setItem(STORAGE_PRESET_KEY, id);
  } catch {
    /* ignore */
  }
}

export function getAutoByModeEnabled(): boolean {
  try {
    return localStorage.getItem(STORAGE_AUTO_BY_MODE_KEY) !== "0";
  } catch {
    return true;
  }
}

export function setAutoByModeEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(STORAGE_AUTO_BY_MODE_KEY, enabled ? "1" : "0");
  } catch {
    /* ignore */
  }
}

export function getModePresetMap(): Record<AppUserMode, ExperiencePresetId> {
  try {
    const raw = localStorage.getItem(STORAGE_MODE_MAP_KEY);
    if (!raw) return { ...DEFAULT_MODE_MAP };
    const parsed = JSON.parse(raw) as Partial<Record<AppUserMode, string>>;
    return {
      founder: getExperiencePresetById(parsed.founder).id,
      executive: getExperiencePresetById(parsed.executive).id,
      startup: getExperiencePresetById(parsed.startup).id,
      creative: getExperiencePresetById(parsed.creative).id,
      freelance: getExperiencePresetById(parsed.freelance).id,
      simple: getExperiencePresetById(parsed.simple).id,
      healthcare: getExperiencePresetById(parsed.healthcare).id,
    };
  } catch {
    return { ...DEFAULT_MODE_MAP };
  }
}

export function setModePresetMap(next: Record<AppUserMode, ExperiencePresetId>): void {
  try {
    localStorage.setItem(STORAGE_MODE_MAP_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function resolvePresetForMode(mode: AppUserMode): ExperiencePresetId {
  if (!getAutoByModeEnabled()) return getStoredExperiencePresetId();
  return getModePresetMap()[mode];
}

export function applyExperiencePreset(presetId: ExperiencePresetId): void {
  if (typeof document === "undefined") return;
  const preset = getExperiencePresetById(presetId);
  const root = document.documentElement;
  root.setAttribute("data-experience-preset", preset.id);
  root.setAttribute("data-experience-tone", preset.tone);
}
