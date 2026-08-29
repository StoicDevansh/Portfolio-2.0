<div align="center">
  <h1>Devansh Gupta — Portfolio</h1>
  <p><em>A kinetic single-page portfolio</em></p>
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

A single-page portfolio with **four content sections** (Work, Stack, Path, Contact) anchored to a left-side rail that doubles as a scroll-position readout.

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

## 🌐 Deploying

`npm run build` creates a static `dist/` folder — **no server needed**.

Deploy to any static host:
- **Vercel**, **Netlify**, **GitHub Pages**, **Cloudflare Pages**

The build uses `base: './'` in `vite.config.ts`, so it works from subdirectories **and** domain roots.

## ⚙️ Technical Notes
- three.js loads in its own chunk only when the lattice mounts, and is skipped entirely when
  WebGL is unavailable — the page is fully readable without it. Under
  `prefers-reduced-motion` the scene still renders, but only a frame at a time when something
  actually changes, instead of animating continuously.
- Fonts are self-hosted variable faces (Archivo, Instrument Sans, Martian Mono); the width
  axis is used for motion, so don't swap them for static weights without revisiting
  `base.css`.

<div align="center">


**[Fork on GitHub](https://github.com/StoicDevansh/Portfolio-2.0)** • **[View Live](https://devansh.dev)**

*Crafted with intention. Built for motion. Designed to move.*

</div> 


