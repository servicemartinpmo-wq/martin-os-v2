import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    // Bind loopback only: avoids os.networkInterfaces() failures in sandboxes / some macOS
    // setups, and matches local URLs http://127.0.0.1:PORT and http://localhost:PORT.
    host: process.env.VITE_DEV_HOST || "127.0.0.1",
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
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("recharts") || id.includes("d3-")) return "vendor-charts";
          if (id.includes("@supabase") || id.includes("postgres")) return "vendor-supabase";
          if (id.includes("react-router") || id.includes("@tanstack")) return "vendor-routing-data";
          if (id.includes("@radix-ui") || id.includes("lucide-react")) return "vendor-ui";
          if (id.includes("react") || id.includes("scheduler")) return "vendor-react";
          return;
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
