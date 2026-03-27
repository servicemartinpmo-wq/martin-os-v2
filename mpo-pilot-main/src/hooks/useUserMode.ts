import { useState, useEffect } from "react";

export type UserMode =
  | "founder"
  | "executive"
  | "startup"
  | "techops"
  | "creative"
  | "freelance"
  | "simple"
  | "healthcare";

export type ToneMode = "executive" | "smb" | "simple";

export function toToneMode(mode: UserMode): ToneMode {
  if (mode === "executive") return "executive";
  if (mode === "simple") return "simple";
  return "smb";
}

const MODE_LABELS: Record<UserMode, string> = {
  founder: "Founder / SMB / Office",
  executive: "Executive",
  startup: "Startup / Project delivery",
  techops: "Tech-Ops Command",
  creative: "Creative Studio",
  freelance: "Freelance",
  simple: "Assisted",
  healthcare: "Healthcare",
};

const MODE_DESCRIPTIONS: Record<UserMode, string> = {
  founder:
    "Oversight across the business: finances, day-to-day operations, and what is due — fewer dropped balls, fewer surprises.",
  executive:
    "Org-level visibility with reporting and team signals. Feels like a COO and an executive assistant: color-coded, light on noise.",
  startup:
    "Ship fast with engineering speed while staying PMBOK- and compliance-aware: boards, work packages, programs, automations, and stakeholder CRM in one flow.",
  techops:
    "Technical operations cockpit for support tiers 1-5: triage, escalation, autonomous workflows, remote handoff, and internal app-building.",
  creative:
    "Portfolio-style work: appointments, CRM, marketing, and social — polished visuals without looking like generic project software.",
  freelance:
    "Kanban-first: clients, pipeline, and marketing from one place — organized without enterprise stack cost.",
  simple:
    "Largest type, plain language, and hover descriptions. Three main colors for status: calm and accessible.",
  healthcare:
    "Operations and finance visibility similar to SMB mode. Designed for HIPAA-aware workflows; connect practice management and accounting.",
};

const MODE_GREETING: Record<UserMode, string> = {
  founder: "Here is what is moving money and operations today",
  executive: "Here is what deserves your attention — summaries first",
  startup: "Here is delivery health, velocity, and compliance touchpoints",
  techops: "Here is technical risk, escalation state, and guided remediation",
  creative: "Here is your studio pipeline and client momentum",
  freelance: "Here is your client work and pipeline at a glance",
  simple: "Welcome — hover any menu item for a short explanation",
  healthcare: "Here is your practice operations snapshot",
};

const STORAGE_KEY = "apphia_user_mode";

const VALID_MODES = new Set<string>([
  "founder",
  "executive",
  "startup",
  "techops",
  "creative",
  "freelance",
  "simple",
  "healthcare",
]);

/** Legacy `project` mode is merged into `startup`. */
function normalizeStoredMode(raw: string | null): UserMode {
  if (!raw) return "founder";
  if (raw === "project") return "startup";
  if (!VALID_MODES.has(raw)) return "founder";
  return raw as UserMode;
}

export function useUserMode() {
  const [mode, setModeState] = useState<UserMode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return normalizeStoredMode(stored);
    } catch {
      return "founder";
    }
  });

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "project") {
        localStorage.setItem(STORAGE_KEY, "startup");
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setMode = (newMode: UserMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(STORAGE_KEY, newMode);
    } catch {
      /* ignore */
    }
  };

  return {
    mode,
    setMode,
    tone: toToneMode(mode),
    label: MODE_LABELS[mode],
    description: MODE_DESCRIPTIONS[mode],
    greeting: MODE_GREETING[mode],
    isSimpleMode: mode === "simple",
    isExecutiveMode: mode === "executive",
    isStartupProjectMode: mode === "startup",
    allModes: (
      [
        "founder",
        "executive",
        "startup",
        "techops",
        "freelance",
        "creative",
        "healthcare",
        "simple",
      ] as UserMode[]
    ).map((key) => ({
      key,
      label: MODE_LABELS[key],
      description: MODE_DESCRIPTIONS[key],
    })),
  };
}
