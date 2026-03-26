import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    // macOS often binds port 5000 to AirPlay/Control Center — 5001 matches common local dev
    port: Number(process.env.VITE_PORT) || 5001,
    strictPort: false,
    allowedHosts: true,
    hmr: {
      overlay: true,
    },
    headers: mode !== "production" ? {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Pragma": "no-cache",
    } : {},
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
