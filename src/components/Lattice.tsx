import { useEffect, useRef, useState } from 'react'
import type { Phase } from '../three/lattice'

interface Props {
  phase: Phase
  focus: string | null
  hover: string | null
}

function supported() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/**
 * Mounts the lattice. three.js is imported lazily so it never blocks first
 * paint, and the whole layer is skipped on devices without WebGL — the page is
 * designed to read correctly without it.
 */
export default function Lattice({ phase, focus, hover }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const handleRef = useRef<Awaited<ReturnType<typeof load>> | null>(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    if (!canvasRef.current || !supported()) return
    let cancelled = false
    let handle: { dispose(): void } | null = null

    load(canvasRef.current)
      .then((h) => {
        if (cancelled) {
          h?.dispose()
          return
        }
        handle = h
        handleRef.current = h
        setLive(true)
      })
      .catch(() => setLive(false))

    return () => {
      cancelled = true
      handle?.dispose()
      handleRef.current = null
    }
  }, [])

  useEffect(() => {
    handleRef.current?.setPhase(phase)
  }, [phase, live])
  useEffect(() => {
    handleRef.current?.setFocus(focus)
  }, [focus, live])
  useEffect(() => {
    handleRef.current?.setHover(hover)
  }, [hover, live])

  return (
    <div className="canvas-layer" aria-hidden="true">
      <div className="nebula" />
      <canvas ref={canvasRef} />
    </div>
  )
}

async function load(canvas: HTMLCanvasElement) {
  const mod = await import('../three/lattice')
  return mod.createLattice(canvas)
}
