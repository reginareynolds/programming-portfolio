import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Served at the custom domain root (art.reginareynolds.com)
  base: "/",
});
