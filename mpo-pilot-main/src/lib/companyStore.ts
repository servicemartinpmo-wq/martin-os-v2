// Company profile store — persisted to localStorage

export interface CompanyProfile {
  // Identity
  userName: string;
  orgName: string;
  orgType: string;
  industry: string;
  // Scale
  teamSize: string;
  revenueRange: string;
  // Direction
  currentState: string;
  futureState: string;
  // Structure
  departments: string[];
  hasSops: boolean;
  // App settings (kept for theme continuity)
  accentHue: number;
  font: "inter" | "mono" | "rounded";
  density: "compact" | "comfortable" | "spacious";
  fontSize: "small" | "medium" | "large";
  analyticsEnabled: boolean;
  onboardingComplete: boolean;
}

const STORAGE_KEY = "martin_company_profile";
const DEMO_KEY = "martin_demo_mode";

const defaults: CompanyProfile = {
  userName: "",
  orgName: "",
  orgType: "",
  industry: "",
  teamSize: "",
  revenueRange: "",
  currentState: "",
  futureState: "",
  departments: [],
  hasSops: false,
  accentHue: 210,
  font: "inter",
  density: "comfortable",
  fontSize: "medium",
  analyticsEnabled: true,
  onboardingComplete: false,
};

const FONT_SET = new Set<CompanyProfile["font"]>(["inter", "mono", "rounded"]);
const DENSITY_SET = new Set<CompanyProfile["density"]>(["compact", "comfortable", "spacious"]);
const FONTSIZE_SET = new Set<CompanyProfile["fontSize"]>(["small", "medium", "large"]);

function coerceStr(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  return String(v);
}

/** Merge + strip null/number/invalid types from localStorage or API-shaped JSON. */
export function normalizeProfile(p: Partial<CompanyProfile> & Record<string, unknown>): CompanyProfile {
  const merged = { ...defaults, ...p } as Record<string, unknown>;
  return {
    userName: coerceStr(merged.userName),
    orgName: coerceStr(merged.orgName),
    orgType: coerceStr(merged.orgType),
    industry: coerceStr(merged.industry),
    teamSize: coerceStr(merged.teamSize),
    revenueRange: coerceStr(merged.revenueRange),
    currentState: coerceStr(merged.currentState),
    futureState: coerceStr(merged.futureState),
    departments: Array.isArray(merged.departments)
      ? merged.departments.map((d) => coerceStr(d))
      : [],
    hasSops: Boolean(merged.hasSops),
    accentHue:
      typeof merged.accentHue === "number" && !Number.isNaN(merged.accentHue)
        ? merged.accentHue
        : defaults.accentHue,
    font: FONT_SET.has(merged.font as CompanyProfile["font"])
      ? (merged.font as CompanyProfile["font"])
      : "inter",
    density: DENSITY_SET.has(merged.density as CompanyProfile["density"])
      ? (merged.density as CompanyProfile["density"])
      : "comfortable",
    fontSize: FONTSIZE_SET.has(merged.fontSize as CompanyProfile["fontSize"])
      ? (merged.fontSize as CompanyProfile["fontSize"])
      : "medium",
    analyticsEnabled: merged.analyticsEnabled !== false,
    onboardingComplete: Boolean(merged.onboardingComplete),
  };
}

export const DEMO_PROFILE: CompanyProfile = {
  userName: "Alex Rivera",
  orgName: "Apex Operations Group",
  orgType: "Private company",
  industry: "Technology",
  teamSize: "45",
  revenueRange: "$2M–$10M",
  currentState: "Scaling fast but processes haven't kept up. Cross-department coordination is breaking down and we're missing execution on key initiatives.",
  futureState: "Become a structured, scalable operator. Clear ownership, predictable execution, and data-driven decisions by end of year.",
  departments: ["Executive", "Operations", "Finance", "HR", "Product", "Engineering", "Sales", "Marketing"],
  hasSops: true,
  accentHue: 215,
  font: "inter",
  density: "comfortable",
  fontSize: "medium",
  analyticsEnabled: true,
  onboardingComplete: true,
};

export function loadProfile(): CompanyProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return normalizeProfile(JSON.parse(raw) as Partial<CompanyProfile> & Record<string, unknown>);
  } catch {}
  return { ...defaults };
}

export function saveProfile(p: CompanyProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeProfile(p)));
}

export function resetOnboarding(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// ── Demo mode ─────────────────────────────────────────────────────────────────

export function isDemoMode(): boolean {
  try { return localStorage.getItem(DEMO_KEY) === "1"; } catch { return false; }
}

export function activateDemo(): void {
  try {
    localStorage.setItem(DEMO_KEY, "1");
    saveProfile(DEMO_PROFILE);
  } catch {}
}

export function clearDemo(): void {
  try {
    localStorage.removeItem(DEMO_KEY);
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

// ── Theme helpers ─────────────────────────────────────────────────────────────

export function applyAccentColor(hue: number) {
  const root = document.documentElement;
  root.style.setProperty("--electric-blue", `${hue} 100% 50%`);
  root.style.setProperty("--sidebar-primary", `${hue} 100% 60%`);
  root.style.setProperty("--ring", `${hue} 100% 50%`);
  root.style.setProperty("--accent", `${hue} 100% 50%`);
}

export function applyFont(font: CompanyProfile["font"]) {
  const body = document.body;
  body.classList.remove("font-inter", "font-mono", "font-rounded");
  if (font === "mono") {
    body.style.fontFamily = "'JetBrains Mono', monospace";
  } else if (font === "rounded") {
    body.style.fontFamily = "'DM Sans', 'Inter', sans-serif";
  } else {
    body.style.fontFamily = "'Inter', system-ui, sans-serif";
  }
}

export function applyDensity(density: CompanyProfile["density"]) {
  const root = document.documentElement;
  if (density === "compact") {
    root.style.setProperty("--spacing-base", "0.5rem");
    root.style.setProperty("--card-padding", "0.75rem");
    root.style.setProperty("--row-gap", "0.5rem");
    root.classList.remove("density-comfortable", "density-spacious");
    root.classList.add("density-compact");
  } else if (density === "spacious") {
    root.style.setProperty("--spacing-base", "1.25rem");
    root.style.setProperty("--card-padding", "1.75rem");
    root.style.setProperty("--row-gap", "1.25rem");
    root.classList.remove("density-compact", "density-comfortable");
    root.classList.add("density-spacious");
  } else {
    root.style.setProperty("--spacing-base", "0.875rem");
    root.style.setProperty("--card-padding", "1.25rem");
    root.style.setProperty("--row-gap", "0.875rem");
    root.classList.remove("density-compact", "density-spacious");
    root.classList.add("density-comfortable");
  }
}

export function applyFontSize(size: CompanyProfile["fontSize"]) {
  const root = document.documentElement;
  if (size === "small") {
    root.style.fontSize = "13px";
  } else if (size === "large") {
    root.style.fontSize = "17px";
  } else {
    root.style.fontSize = "15px";
  }
}
