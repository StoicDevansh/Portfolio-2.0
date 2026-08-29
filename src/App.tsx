import { useState } from 'react'
import Lattice from './components/Lattice'
import { Rail, TopBar } from './components/Rail'
import Signal from './components/Signal'
import Work from './components/Work'
import Stack from './components/Stack'
import Path from './components/Path'
import Contact from './components/Contact'
import { useReveal, useStage } from './hooks/useStage'

/**
 * The whole page is one continuous stage. `useStage` decides what is being
 * looked at; the lattice, the rail and the focused build all read that single
 * answer, so they cannot disagree with each other.
 */
export default function App() {
  const { active, focus } = useStage()
  const [hover, setHover] = useState<string | null>(null)
  useReveal()

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <Lattice phase={active} focus={focus} hover={hover} />
      <div className="vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <TopBar />

      <div className="shell" id="top">
        <Rail active={active} />
        <main id="main">
          <Signal />
          <Work />
          <Stack onHover={setHover} />
          <Path />
          <Contact />
        </main>
      </div>
    </>
  )
}
