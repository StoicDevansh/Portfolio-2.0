/**
 * Turns the profile data into a graph with meaningful geometry.
 *
 * Position encodes relationship: a build sits at a vertex, a technology sits at
 * the centroid of the builds it shipped in. So Python — used in all three —
 * lands at the core, Neo4j sits out by the knowledge engine, and the tools that
 * have not shipped in anything yet occupy an outer shell. Nothing is decorative.
 */

import { builds, tech } from '../data/profile'

export interface Node {
  id: string
  kind: 'build' | 'shipped' | 'core'
  /** bitmask over build index: 1 | 2 | 4 */
  mask: number
  home: [number, number, number]
  size: number
}

export interface Edge {
  a: number
  b: number
  mask: number
}

/** deterministic PRNG so the layout is identical on every load */
function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

const BUILD_ANCHORS: [number, number, number][] = [
  [0, 2.5, 0.55],
  [-2.32, -1.35, -0.5],
  [2.32, -1.35, 0.2],
]

export function buildGraph() {
  const rand = rng(20280514)
  const nodes: Node[] = []
  const index = new Map<string, number>()

  builds.forEach((b, i) => {
    index.set(b.id, nodes.length)
    nodes.push({ id: b.id, kind: 'build', mask: 1 << i, home: BUILD_ANCHORS[i], size: 3.1 })
  })

  const buildIndex = new Map(builds.map((b, i) => [b.id, i]))

  for (const t of tech) {
    const mask = t.builds.reduce((m, id) => m | (1 << (buildIndex.get(id) ?? 0)), 0)
    let home: [number, number, number]

    if (t.builds.length > 0) {
      // centroid of the builds it shipped in, nudged outward so shared tools
      // pull toward the core and specialised ones sit near their build
      let x = 0
      let y = 0
      let z = 0
      for (const id of t.builds) {
        const a = BUILD_ANCHORS[buildIndex.get(id) ?? 0]
        x += a[0]
        y += a[1]
        z += a[2]
      }
      const n = t.builds.length
      x /= n
      y /= n
      z /= n
      const spread = n === 1 ? 0.95 : n === 2 ? 0.7 : 0.5
      home = [
        x + (rand() - 0.5) * spread * 2.1,
        y + (rand() - 0.5) * spread * 2.1,
        z + (rand() - 0.5) * 1.5,
      ]
    } else {
      // outer shell, evenly distributed
      const i = nodes.length
      const phi = Math.acos(1 - (2 * (i + 0.5)) / (tech.length + builds.length))
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const r = 4.35 + rand() * 0.55
      home = [
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta) * 0.72,
        r * Math.cos(phi) * 0.55 - 0.6,
      ]
    }

    index.set(t.id, nodes.length)
    nodes.push({
      id: t.id,
      kind: t.tier === 'shipped' ? 'shipped' : 'core',
      mask,
      home,
      size: t.tier === 'shipped' ? 1.55 + t.builds.length * 0.22 : 1.0,
    })
  }

  const edges: Edge[] = []
  for (const t of tech) {
    const a = index.get(t.id)
    if (a === undefined) continue
    for (const id of t.builds) {
      const b = index.get(id)
      if (b === undefined) continue
      edges.push({ a, b, mask: 1 << (buildIndex.get(id) ?? 0) })
    }
  }

  return { nodes, edges, index }
}

/**
 * Points sampled along a parametric "D" — the stem and the bowl.
 * The corpus cloud lands here at the end of the page: the same six hundred
 * particles that opened as unreadable noise close as a letterform.
 */
export function monogramPoints(count: number): Float32Array {
  const rand = rng(994)
  const out = new Float32Array(count * 3)
  const H = 2.15
  const stemX = -0.92
  const stemShare = 0.34

  for (let i = 0; i < count; i++) {
    let x: number
    let y: number
    if (rand() < stemShare) {
      x = stemX + (rand() - 0.5) * 0.17
      y = (rand() * 2 - 1) * H
    } else {
      const t = rand() * Math.PI
      const r = H + (rand() - 0.5) * 0.17
      x = stemX + Math.sin(t) * r * 0.92
      y = Math.cos(t) * r
    }
    out[i * 3] = x
    out[i * 3 + 1] = y
    out[i * 3 + 2] = (rand() - 0.5) * 0.24
  }
  return out
}
