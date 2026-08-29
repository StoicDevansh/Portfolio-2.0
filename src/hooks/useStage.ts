import { useEffect, useState } from 'react'
import type { SectionId } from '../data/profile'

const MID = '-46% 0px -46% 0px'

/**
 * One observer band across the middle of the viewport decides what you are
 * looking at. Everything downstream — the rail, the lattice phase, the focused
 * build — reads from that single answer, so they can never disagree.
 */
export function useStage() {
  const [active, setActive] = useState<SectionId>('signal')
  const [focus, setFocus] = useState<string | null>(null)

  useEffect(() => {
    const order = [...document.querySelectorAll<HTMLElement>('[data-section]')]
    const seen = new Set<HTMLElement>()

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement
          if (e.isIntersecting) seen.add(el)
          else seen.delete(el)
        }
        const hit = order.find((el) => seen.has(el))
        if (hit?.dataset.section) setActive(hit.dataset.section as SectionId)
      },
      { rootMargin: MID },
    )
    order.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const order = [...document.querySelectorAll<HTMLElement>('[data-build]')]
    const seen = new Set<HTMLElement>()

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement
          if (e.isIntersecting) seen.add(el)
          else seen.delete(el)
        }
        const hit = order.find((el) => seen.has(el))
        setFocus(hit?.dataset.build ?? null)
      },
      { rootMargin: MID },
    )
    order.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    let queued = false
    const write = () => {
      queued = false
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      document.documentElement.style.setProperty('--progress', p.toFixed(4))
      document.documentElement.style.setProperty('--pct', String(Math.round(p * 100)))
    }
    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(write)
    }
    write()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    let queued = false
    let x = 0.5
    let y = 0.5
    const write = () => {
      queued = false
      const r = document.documentElement.style
      r.setProperty('--pointer-x', x.toFixed(3))
      r.setProperty('--pointer-y', y.toFixed(3))
    }
    const onMove = (e: PointerEvent) => {
      x = e.clientX / window.innerWidth
      y = e.clientY / window.innerHeight
      if (queued) return
      queued = true
      requestAnimationFrame(write)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return { active, focus }
}

/**
 * Adds `.in` to every `[data-reveal]` block the first time it enters view, then
 * stops watching it. One observer for the whole document, no state, no renders.
 */
export function useReveal() {
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>('[data-reveal]')]
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.classList.add('in')
          io.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}
