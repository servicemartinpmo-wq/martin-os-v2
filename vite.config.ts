import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://tanstack.com/start/latest/docs/framework/react/build-from-scratch
// `resolve.tsconfigPaths` is not a Vite 7 API — use vite-tsconfig-paths for tsconfig `paths` (e.g. ~/* → ./src/*).
export default defineConfig({
  server: {
    port: Number(process.env.VITE_ROOT_PORT) || 3000,
    host: process.env.VITE_ROOT_DEV_HOST || "127.0.0.1",
    allowedHosts: true,
  },
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    // TanStack Start plugin must run before @vitejs/plugin-react
    tanstackStart(),
    viteReact(),
  ],
});
