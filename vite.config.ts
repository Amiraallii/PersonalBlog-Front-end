import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "prompt",
      filename: "sw.js",
      includeAssets: [
        "favicon.ico",
        "favicon.svg",
        "favicon-96x96.png",
        "apple-touch-icon.png",
      ],
      manifestFilename: "manifest.json",
      manifest: {
        name: "Amirali's personal blog",
        short_name: "Amirali",
        description: "Here I share my expriences about life and work",
        theme_color: "#111827",
        background_color: "#0f172a",
        display: "standalone",
        orientation: "portrait",
        dir: "rtl",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        navigateFallbackDenylist: [
          /^\/api/,
          /^\/Comment/,
          /^\/Post/,
          /^\/projectService/,
        ],
      },
    }),
  ],
});
