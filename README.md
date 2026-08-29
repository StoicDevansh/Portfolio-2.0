# Devansh Gupta — Portfolio

A single-page portfolio built with Vite, React 19, TypeScript and three.js. Four sections
(Work, Stack, Path, Contact) hang off a left rail that doubles as a scroll-position readout,
with a WebGL lattice behind the page that changes state as you move through it.

## Requirements

- **Node.js 20.19+ or 22.12+** (built on Node 24). Check with `node -v`.
- npm (ships with Node).

## Run it in VS Code

1. Open the folder: **File → Open Folder…** and pick `ddvn`.
2. Open a terminal inside VS Code: **Terminal → New Terminal** (`` Ctrl+` ``).
3. Install dependencies once:

```bash
npm install
```

4. Start the dev server:

```bash
npm run dev
```

5. Vite prints a local URL (`http://localhost:5173` by default). `Ctrl+Click` it to open in
   your browser. Saving a file reloads the page automatically.

Stop the server with `Ctrl+C` in the terminal.

### Recommended VS Code extensions

Optional, but they make the editing experience match the project's setup:

- **ESLint** and **Prettier** — formatting and lint feedback
- **Tailwind CSS IntelliSense** is *not* needed; the styles are plain CSS with `@layer`

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run typecheck` | TypeScript check, no output files |
| `npm run build` | Typecheck, then build to `dist/` |
| `npm run preview` | Serve the built `dist/` on port 4173 |

## Deploying

`npm run build` produces a static `dist/` folder — no server needed. Drop it on any static
host (Vercel, Netlify, GitHub Pages, Cloudflare Pages). `vite.config.ts` uses `base: './'`,
so the build works from a subdirectory as well as a domain root.

Two things reference the live domain and should be updated if it changes: the `canonical`
link and the `og:*` tags in `index.html`.

## Layout

```
index.html            page shell, meta tags, pre-paint styles
public/               fonts, portrait, résumé PDF, grain tile, og.png
src/
  main.tsx            entry
  App.tsx             section order and shared state
  components/         Signal, Work, Stack, Path, Contact, Rail, Lattice
  three/lattice.ts    the WebGL scene (lazy-loaded, not in the main bundle)
  data/profile.ts     all copy and project data in one place
  hooks/useStage.ts   the observer that decides which section is active
  styles/             tokens, base, layout, then one file per section
```

Content edits usually mean `src/data/profile.ts`. Colour, type scale and spacing live in
`src/styles/tokens.css`.

## Notes

- three.js loads in its own chunk only when the lattice mounts, and is skipped entirely when
  WebGL is unavailable — the page is fully readable without it. Under
  `prefers-reduced-motion` the scene still renders, but only a frame at a time when something
  actually changes, instead of animating continuously.
- Fonts are self-hosted variable faces (Archivo, Instrument Sans, Martian Mono); the width
  axis is used for motion, so don't swap them for static weights without revisiting
  `base.css`.
