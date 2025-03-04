import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "../Resources",
    rollupOptions: {
      input: {
        background: resolve(__dirname, "src/scripts/background.ts"),
        content: resolve(__dirname, "src/scripts/content.tsx"),
      },
      output: {
        entryFileNames: "[name].bundle.js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.names.some((name) => name.endsWith(".css"))) {
            return "content.bundle.css";
          }
          return "assets/[name][extname]";
        },
      },
    },
  },
});
