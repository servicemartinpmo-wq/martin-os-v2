/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MIIDDLE_BASE_URL?: string;
  /** Optional override for Tech-Ops iframe origin (e.g. https://tech-ops.replit.app) */
  readonly VITE_TECH_OPS_BASE_URL?: string;
  /** Override Vite dev server port (default 5001 in vite.config.ts) */
  readonly VITE_PORT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
