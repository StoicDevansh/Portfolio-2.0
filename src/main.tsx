import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

import './styles/tokens.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/rail.css'
import './styles/signal.css'
import './styles/work.css'
import './styles/stack.css'
import './styles/path.css'
import './styles/contact.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Hold the boot screen until the faces are ready, so the display type never
// swaps width mid-entrance. Capped, in case the font promise never settles.
const reveal = () => document.documentElement.classList.add('booted')
const ready = document.fonts?.ready ?? Promise.resolve()
Promise.race([ready, new Promise((r) => setTimeout(r, 1400))]).then(() =>
  requestAnimationFrame(reveal),
)
