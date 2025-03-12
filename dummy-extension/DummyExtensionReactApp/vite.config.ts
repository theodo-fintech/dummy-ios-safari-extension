import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
      plugins: [
        {
          name: "bundle-in-iife",
          generateBundle(_, bundle) {
            Object.keys(bundle).forEach((key) => {
              const file = bundle[key];
              if (key.slice(-3) === ".js" && "code" in file) {
                file.code = `(() => {\n${file.code}\n})()`;
              }
            });
          },
        },
      ],
    },
  },
});
