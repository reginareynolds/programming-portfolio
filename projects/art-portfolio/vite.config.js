import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Must match the GitHub Pages URL path: <user>.github.io/<repo-name>/
  // Change to "/" if a custom domain is configured (see notes/TODO.md)
  base: "/programming-portfolio/",
});
