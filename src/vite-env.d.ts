/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ROOT_PORT?: string;
  readonly VITE_ROOT_DEV_HOST?: string;
  readonly VITE_CONVEX_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
