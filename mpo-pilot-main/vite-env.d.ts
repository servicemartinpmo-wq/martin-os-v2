/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_MIIDDLE?: string;
  readonly VITE_MIIDDLE_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
