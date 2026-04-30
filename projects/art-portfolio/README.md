# 3D Art Portfolio

A portfolio site showcasing 3D modeling, sculpting, animation, and visualization work. Features interactive 3D model viewers, process breakdowns, and case study pages for each piece.

## Features

- **Interactive 3D viewer** — orbit, zoom, and inspect models directly in the browser
- **Case study pages** — hero renders, process breakdowns, tool and role metadata
- **8 portfolio slots** — industrial, character, game art, environment, animation, AR/VR
- **Responsive design** — works on desktop, tablet, and mobile
- **GitHub Pages deployment** — free hosting, auto-deploys on push

## Tech Stack

| Layer   | Technology                              |
|---------|-----------------------------------------|
| UI      | React, React Router (hash-based)        |
| 3D      | Three.js, React Three Fiber, Drei       |
| Build   | Vite                                    |
| Deploy  | GitHub Pages via GitHub Actions          |

## Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`.

## Adding Art Assets

See [ASSET_GUIDE.md](./ASSET_GUIDE.md) for detailed instructions on preparing 3D models, renders, and videos for each portfolio piece.

Quick version:
1. Drop `.glb` files into `public/models/`
2. Drop images into `public/images/pieces/<piece-id>/`
3. Drop videos into `public/videos/`
4. Update `src/data/portfolio.js` with descriptions and file paths
5. Commit and push

## Deployment

Pushes to `main` that modify `projects/art-portfolio/` trigger a GitHub Actions workflow that builds the site and deploys to GitHub Pages.

To deploy manually: Settings > Pages > enable GitHub Pages, or run `npm run build` and host the `dist/` folder anywhere.
