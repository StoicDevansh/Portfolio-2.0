<div align="center">
  <h1>Devansh Gupta — Portfolio</h1>
  <p><em>A kinetic single-page portfolio with WebGL lattice visuals</em></p>
</div>

---

<div align="center">

### ⚡ Built With
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)

</div>

---

## 🎯 What It Does

A single-page portfolio with **four content sections** (Work, Stack, Path, Contact) anchored to a left-side rail that doubles as a scroll-position readout. Behind it all, a **WebGL lattice** responds to your scroll position, creating a dynamic visual experience that bridges aesthetics with interactivity.

### Key Features
- ⚙️ **Responsive WebGL lattice** that animates as you scroll
- 🎨 **Variable typography** with motion-aware font weights
- ♿ **Accessibility-first** — fully readable without WebGL; respects `prefers-reduced-motion`
- 📦 **Lazy-loaded three.js** — skipped entirely if WebGL unavailable
- 🚀 **Production-ready** — static build works anywhere

---

## 🚀 Getting Started

### Requirements
- **Node.js 20.19+** or **22.12+** (built on Node 24)  
  Check with: `node -v`
- **npm** (included with Node)

### Run in VS Code

1. **Open the folder**: File → Open Folder… → select this project
2. **Open terminal**: Terminal → New Terminal (`` Ctrl+` ``)
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start dev server**:
   ```bash
   npm run dev
   ```
5. **Open in browser**: Vite prints a local URL (usually `http://localhost:5173`). `Ctrl+Click` it to open.  
   Files save automatically and reload in your browser.

Stop with `Ctrl+C` in the terminal.

### Recommended VS Code Extensions
- **ESLint** — real-time lint feedback
- **Prettier** — code formatting
- *(Tailwind CSS IntelliSense not needed — styles use plain CSS with `@layer`)*

---

## 📜 Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server with hot reload |
| `npm run typecheck` | TypeScript check (no output files) |
| `npm run build` | Typecheck + build to `dist/` |
| `npm run preview` | Serve built `dist/` on port 4173 |

---

## 📁 Project Structure

```
index.html                    ← page shell, meta tags, pre-paint styles
public/                       ← fonts, portrait, résumé, grain texture, og.png
src/
  main.tsx                    ← entry point
  App.tsx                     ← section order and shared state
  components/                 ← Signal, Work, Stack, Path, Contact, Rail, Lattice
  three/lattice.ts            ← WebGL scene (lazy-loaded chunk)
  data/profile.ts             ← all copy and project data
  hooks/useStage.ts           ← scroll observer for active section
  styles/
    tokens.css                ← color, type scale, spacing
    base.css                  ← foundational styles + @layer
    [section].css             ← per-section styles
```

### Editing Content
- **Copy & data**: Update `src/data/profile.ts`
- **Colors & spacing**: Update `src/styles/tokens.css`
- **Type scale**: Modify `tokens.css` and `base.css` (fonts are variable — width axis drives motion)

---

## 🌐 Deploying

`npm run build` creates a static `dist/` folder — **no server needed**.

Deploy to any static host:
- **Vercel**, **Netlify**, **GitHub Pages**, **Cloudflare Pages**

The build uses `base: './'` in `vite.config.ts`, so it works from subdirectories **and** domain roots.

### Update These for Your Domain
- `canonical` link in `index.html`
- `og:*` meta tags in `index.html`

---

## ⚙️ Technical Notes

### Three.js Loading Strategy
- Loads in its own chunk **only when the lattice mounts**
- Skipped entirely if WebGL unavailable — page remains **fully readable**
- Under `prefers-reduced-motion`, scene renders frame-by-frame only when state changes (not animated continuously)

### Typography & Motion
Self-hosted variable font families: **Archivo**, **Instrument Sans**, **Martian Mono**

The **width axis** is used for motion effects — swapping for static weights requires revisiting `base.css`.

---

<div align="center">

**[Fork on GitHub](https://github.com/StoicDevansh/Portfolio-2.0)** • **[View Live](https://devansh.dev)**

*Crafted with intention. Built for motion. Designed to move.*

</div>
