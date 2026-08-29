/**
 * The lattice — one object, five states.
 *
 *   signal   600 particles adrift: a corpus nobody has read
 *   work     the graph crystallises; the build in view holds focus
 *   stack    every node lit; hovering a technology lights its edges
 *   path     the structure settles into the background
 *   contact  the corpus returns and resolves into a letterform
 *
 * Three draw calls. The 29 graph nodes are transformed on the CPU (so the edges
 * can follow them exactly); the 600 corpus particles are morphed on the GPU.
 */

import * as THREE from 'three'
import { buildGraph, monogramPoints } from './graph'
import { builds } from '../data/profile'

export type Phase = 'signal' | 'work' | 'stack' | 'path' | 'contact'

export interface LatticeHandle {
  setPhase(p: Phase): void
  setFocus(buildId: string | null): void
  setHover(techId: string | null): void
  dispose(): void
}

const CORPUS = 600

interface PhaseSpec {
  form: number
  disperse: number
  glyph: number
  corpusAlpha: number
  graphAlpha: number
  camZ: number
  offX: number
  offY: number
  tilt: number
}

const PHASES: Record<Phase, PhaseSpec> = {
  signal: { form: 0.1, disperse: 1, glyph: 0, corpusAlpha: 1, graphAlpha: 0.3, camZ: 12.4, offX: 1.5, offY: 0.1, tilt: 0.1 },
  work: { form: 1, disperse: 0.5, glyph: 0, corpusAlpha: 0.22, graphAlpha: 1, camZ: 9.6, offX: 2.5, offY: 0, tilt: -0.06 },
  stack: { form: 1, disperse: 0.44, glyph: 0, corpusAlpha: 0.18, graphAlpha: 1, camZ: 11, offX: 2.7, offY: 0.15, tilt: 0.16 },
  path: { form: 0.94, disperse: 0.56, glyph: 0, corpusAlpha: 0.28, graphAlpha: 0.62, camZ: 13.2, offX: 2.2, offY: -0.1, tilt: 0.05 },
  contact: { form: 0.28, disperse: 0.5, glyph: 1, corpusAlpha: 1, graphAlpha: 0.3, camZ: 9.4, offX: 2, offY: 0.05, tilt: 0 },
}

const COL = {
  flare: new THREE.Color('#FFB86B'),
  xenonSoft: new THREE.Color('#9DB0FF'),
  xenon: new THREE.Color('#6C8AFF'),
  core: new THREE.Color('#5C6C8E'),
}

const corpusVert = /* glsl */ `
  attribute vec3 aGlyph;
  attribute float aSeed;
  attribute float aScale;
  uniform float uTime;
  uniform float uGlyph;
  uniform float uDisperse;
  uniform float uPR;
  varying float vFade;

  void main() {
    vec3 p = position * mix(0.58, 1.0, uDisperse);
    float s = aSeed * 6.2831;
    p.x += sin(uTime * 0.13 + s) * 0.26;
    p.y += cos(uTime * 0.105 + s * 1.31) * 0.26;
    p.z += sin(uTime * 0.083 + s * 0.77) * 0.2;

    // staggered so the letterform assembles rather than snaps
    float g = clamp(uGlyph * 1.7 - aSeed * 0.7, 0.0, 1.0);
    g = g * g * (3.0 - 2.0 * g);
    p = mix(p, aGlyph, g);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aScale * uPR * (62.0 / -mv.z) * mix(1.0, 1.45, g);
    vFade = mix(0.62, 1.0, g) * smoothstep(30.0, 6.0, -mv.z);
  }
`

const corpusFrag = /* glsl */ `
  precision mediump float;
  uniform float uOpacity;
  uniform vec3 uColor;
  varying float vFade;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.06, d);
    a *= a;
    gl_FragColor = vec4(uColor, a * uOpacity * vFade);
  }
`

const nodeVert = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  attribute vec3 aBuilds;
  attribute float aId;
  uniform float uPR;
  uniform vec3 uFocus;
  uniform float uFocused;
  uniform float uHoverId;
  uniform float uAlpha;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;

    float rel = clamp(dot(aBuilds, uFocus), 0.0, 1.0);
    float hov = 1.0 - min(1.0, abs(aId - uHoverId));
    float w = max(mix(1.0, mix(0.14, 1.0, rel), uFocused), hov);

    gl_PointSize = aSize * uPR * (58.0 / -mv.z) * mix(0.82, 1.28, w) * mix(1.0, 1.7, hov);
    vColor = mix(aColor, vec3(1.0), hov * 0.6 + rel * uFocused * 0.18);
    vAlpha = uAlpha * w * smoothstep(34.0, 4.0, -mv.z);
  }
`

const nodeFrag = /* glsl */ `
  precision mediump float;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.2, 0.0, d);
    float halo = smoothstep(0.5, 0.12, d);
    float a = clamp(core + halo * 0.5, 0.0, 1.0);
    gl_FragColor = vec4(vColor + core * 0.45, a * vAlpha);
  }
`

const edgeVert = /* glsl */ `
  attribute vec3 aBuilds;
  attribute float aEnd;
  attribute float aTechId;
  uniform vec3 uFocus;
  uniform float uFocused;
  uniform float uHoverId;
  uniform float uAlpha;
  varying float vA;
  varying vec3 vC;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    float rel = clamp(dot(aBuilds, uFocus), 0.0, 1.0);
    float hov = 1.0 - min(1.0, abs(aTechId - uHoverId));
    float w = max(mix(1.0, mix(0.07, 1.0, rel), uFocused), hov);
    vA = uAlpha * w * mix(0.09, 0.62, aEnd) * smoothstep(34.0, 4.0, -mv.z);
    vC = mix(vec3(0.42, 0.54, 1.0), vec3(1.0), hov * 0.65);
  }
`

const edgeFrag = /* glsl */ `
  precision mediump float;
  varying float vA;
  varying vec3 vC;
  void main() { gl_FragColor = vec4(vC, vA); }
`

const damp = (cur: number, to: number, lambda: number, dt: number) =>
  cur + (to - cur) * (1 - Math.exp(-lambda * dt))

export function createLattice(canvas: HTMLCanvasElement): LatticeHandle {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: 'high-performance',
  })
  renderer.setClearAlpha(0)
  const maxPR = window.innerWidth < 720 ? 1.5 : 1.75
  const pr = Math.min(window.devicePixelRatio || 1, maxPR)
  renderer.setPixelRatio(pr)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60)
  camera.position.set(0, 0, 12)
  const group = new THREE.Group()
  scene.add(group)

  const { nodes, edges, index } = buildGraph()
  const N = nodes.length

  // ---- graph nodes -------------------------------------------------------
  const homes = new Float32Array(N * 3)
  const clouds = new Float32Array(N * 3)
  const livePos = new Float32Array(N * 3)
  const seeds = new Float32Array(N)
  const nodeSize = new Float32Array(N)
  const nodeColor = new Float32Array(N * 3)
  const nodeBuilds = new Float32Array(N * 3)
  const nodeId = new Float32Array(N)

  nodes.forEach((n, i) => {
    homes[i * 3] = n.home[0]
    homes[i * 3 + 1] = n.home[1]
    homes[i * 3 + 2] = n.home[2]
    const jx = Math.sin(i * 12.9898) * 43758.5453
    const jy = Math.sin(i * 78.233) * 12345.6789
    const jz = Math.sin(i * 39.425) * 24634.6345
    clouds[i * 3] = n.home[0] * 2.6 + (jx - Math.floor(jx) - 0.5) * 4
    clouds[i * 3 + 1] = n.home[1] * 2.6 + (jy - Math.floor(jy) - 0.5) * 4
    clouds[i * 3 + 2] = n.home[2] * 2.6 + (jz - Math.floor(jz) - 0.5) * 4
    seeds[i] = (i * 0.618033) % 1
    nodeSize[i] = n.size
    nodeId[i] = i
    nodeBuilds[i * 3] = n.mask & 1 ? 1 : 0
    nodeBuilds[i * 3 + 1] = n.mask & 2 ? 1 : 0
    nodeBuilds[i * 3 + 2] = n.mask & 4 ? 1 : 0
    const c =
      n.kind === 'build'
        ? n.id === builds[0].id
          ? COL.flare
          : COL.xenonSoft
        : n.kind === 'shipped'
          ? COL.xenon
          : COL.core
    nodeColor[i * 3] = c.r
    nodeColor[i * 3 + 1] = c.g
    nodeColor[i * 3 + 2] = c.b
  })
  livePos.set(clouds)

  const nodeGeo = new THREE.BufferGeometry()
  const posAttr = new THREE.BufferAttribute(livePos, 3)
  posAttr.setUsage(THREE.DynamicDrawUsage)
  nodeGeo.setAttribute('position', posAttr)
  nodeGeo.setAttribute('aSize', new THREE.BufferAttribute(nodeSize, 1))
  nodeGeo.setAttribute('aColor', new THREE.BufferAttribute(nodeColor, 3))
  nodeGeo.setAttribute('aBuilds', new THREE.BufferAttribute(nodeBuilds, 3))
  nodeGeo.setAttribute('aId', new THREE.BufferAttribute(nodeId, 1))

  const nodeUni = {
    uPR: { value: pr },
    uFocus: { value: new THREE.Vector3(0, 0, 0) },
    uFocused: { value: 0 },
    uHoverId: { value: -1 },
    uAlpha: { value: 0.22 },
  }
  const nodeMat = new THREE.ShaderMaterial({
    vertexShader: nodeVert,
    fragmentShader: nodeFrag,
    uniforms: nodeUni,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  group.add(new THREE.Points(nodeGeo, nodeMat))

  // ---- edges -------------------------------------------------------------
  const E = edges.length
  const edgePos = new Float32Array(E * 6)
  const edgeBuilds = new Float32Array(E * 6)
  const edgeEnd = new Float32Array(E * 2)
  const edgeTech = new Float32Array(E * 2)

  edges.forEach((e, i) => {
    for (let k = 0; k < 2; k++) {
      const o = (i * 2 + k) * 3
      edgeBuilds[o] = e.mask & 1 ? 1 : 0
      edgeBuilds[o + 1] = e.mask & 2 ? 1 : 0
      edgeBuilds[o + 2] = e.mask & 4 ? 1 : 0
      edgeEnd[i * 2 + k] = k
      edgeTech[i * 2 + k] = e.a
    }
  })

  const edgeGeo = new THREE.BufferGeometry()
  const edgeAttr = new THREE.BufferAttribute(edgePos, 3)
  edgeAttr.setUsage(THREE.DynamicDrawUsage)
  edgeGeo.setAttribute('position', edgeAttr)
  edgeGeo.setAttribute('aBuilds', new THREE.BufferAttribute(edgeBuilds, 3))
  edgeGeo.setAttribute('aEnd', new THREE.BufferAttribute(edgeEnd, 1))
  edgeGeo.setAttribute('aTechId', new THREE.BufferAttribute(edgeTech, 1))

  const edgeUni = {
    uFocus: nodeUni.uFocus,
    uFocused: nodeUni.uFocused,
    uHoverId: nodeUni.uHoverId,
    uAlpha: { value: 0.22 },
  }
  const edgeMat = new THREE.ShaderMaterial({
    vertexShader: edgeVert,
    fragmentShader: edgeFrag,
    uniforms: edgeUni,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  group.add(new THREE.LineSegments(edgeGeo, edgeMat))

  // ---- corpus: 600 particles, one per paper in the knowledge graph -------
  const cloudPos = new Float32Array(CORPUS * 3)
  const glyphPos = monogramPoints(CORPUS)
  const cSeed = new Float32Array(CORPUS)
  const cScale = new Float32Array(CORPUS)
  let s = 1337
  const rnd = () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
  for (let i = 0; i < CORPUS; i++) {
    const u = rnd() * 2 - 1
    const th = rnd() * Math.PI * 2
    const r = 3.1 + Math.pow(rnd(), 0.72) * 6.3
    const sp = Math.sqrt(1 - u * u)
    cloudPos[i * 3] = r * sp * Math.cos(th)
    cloudPos[i * 3 + 1] = r * sp * Math.sin(th) * 0.66
    cloudPos[i * 3 + 2] = r * u * 0.5
    cSeed[i] = rnd()
    cScale[i] = 0.45 + rnd() * 0.95
  }

  const corpusGeo = new THREE.BufferGeometry()
  corpusGeo.setAttribute('position', new THREE.BufferAttribute(cloudPos, 3))
  corpusGeo.setAttribute('aGlyph', new THREE.BufferAttribute(glyphPos, 3))
  corpusGeo.setAttribute('aSeed', new THREE.BufferAttribute(cSeed, 1))
  corpusGeo.setAttribute('aScale', new THREE.BufferAttribute(cScale, 1))

  const corpusUni = {
    uTime: { value: 0 },
    uGlyph: { value: 0 },
    uDisperse: { value: 1 },
    uOpacity: { value: 0.9 },
    uPR: { value: pr },
    uColor: { value: new THREE.Color('#C3D0FF') },
  }
  const corpusMat = new THREE.ShaderMaterial({
    vertexShader: corpusVert,
    fragmentShader: corpusFrag,
    uniforms: corpusUni,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const corpus = new THREE.Points(corpusGeo, corpusMat)
  group.add(corpus)
  group.traverse((o) => {
    o.frustumCulled = false
  })

  // ---- state -------------------------------------------------------------
  let phase: Phase = 'signal'
  const cur = { ...PHASES.signal }
  const focus = new THREE.Vector3()
  const focusTarget = new THREE.Vector3()
  let focusedTarget = 0
  const ptr = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 }
  let spin = 0
  let t0 = performance.now()
  let raf = 0

  function tick(now: number) {
    const dt = Math.min((now - t0) / 1000, 0.05)
    t0 = now
    const P = PHASES[phase]
    const L = reduced ? 400 : 2.4
    const time = now * 0.001

    cur.form = damp(cur.form, P.form, L, dt)
    cur.disperse = damp(cur.disperse, P.disperse, L, dt)
    cur.glyph = damp(cur.glyph, P.glyph, L * 0.75, dt)
    cur.corpusAlpha = damp(cur.corpusAlpha, P.corpusAlpha, L, dt)
    cur.graphAlpha = damp(cur.graphAlpha, P.graphAlpha, L, dt)
    cur.camZ = damp(cur.camZ, P.camZ, L * 0.7, dt)
    cur.offX = damp(cur.offX, P.offX, L * 0.7, dt)
    cur.offY = damp(cur.offY, P.offY, L * 0.7, dt)
    cur.tilt = damp(cur.tilt, P.tilt, L * 0.7, dt)

    focus.x = damp(focus.x, focusTarget.x, 3.6, dt)
    focus.y = damp(focus.y, focusTarget.y, 3.6, dt)
    focus.z = damp(focus.z, focusTarget.z, 3.6, dt)
    nodeUni.uFocused.value = damp(nodeUni.uFocused.value, focusedTarget, 3.2, dt)
    nodeUni.uFocus.value.copy(focus)

    // graph nodes: cloud → home, with drift that quiets down once formed
    const dsp = 0.58 + 0.42 * cur.disperse
    const f = cur.form * cur.form * (3 - 2 * cur.form)
    const wob = reduced ? 0 : 0.085 * (1 - f * 0.62)
    for (let i = 0; i < N; i++) {
      const ix = i * 3
      const sd = seeds[i] * 6.2831
      livePos[ix] = clouds[ix] * dsp + (homes[ix] - clouds[ix] * dsp) * f + Math.sin(time * 0.23 + sd) * wob
      livePos[ix + 1] =
        clouds[ix + 1] * dsp + (homes[ix + 1] - clouds[ix + 1] * dsp) * f + Math.cos(time * 0.19 + sd * 1.7) * wob
      livePos[ix + 2] =
        clouds[ix + 2] * dsp + (homes[ix + 2] - clouds[ix + 2] * dsp) * f + Math.sin(time * 0.17 + sd * 2.3) * wob
    }
    posAttr.needsUpdate = true

    for (let i = 0; i < E; i++) {
      const e = edges[i]
      const o = i * 6
      const a = e.a * 3
      const b = e.b * 3
      edgePos[o] = livePos[a]
      edgePos[o + 1] = livePos[a + 1]
      edgePos[o + 2] = livePos[a + 2]
      edgePos[o + 3] = livePos[b]
      edgePos[o + 4] = livePos[b + 1]
      edgePos[o + 5] = livePos[b + 2]
    }
    edgeAttr.needsUpdate = true

    nodeUni.uAlpha.value = cur.graphAlpha
    edgeUni.uAlpha.value = cur.graphAlpha
    corpusUni.uTime.value = reduced ? 0 : time
    corpusUni.uGlyph.value = cur.glyph
    corpusUni.uDisperse.value = cur.disperse
    corpusUni.uOpacity.value = cur.corpusAlpha

    if (!reduced) {
      ptr.x = damp(ptr.x, ptr.tx, 2.2, dt)
      ptr.y = damp(ptr.y, ptr.ty, 2.2, dt)
      // a bounded sway, not an accumulating spin: left to accumulate, the scene
      // eventually turns edge-on and the letterform collapses to a line
      spin = Math.sin(time * 0.055) * 0.17
    }
    // as the corpus resolves into the letterform, the scene squares up to camera
    const settle = 1 - cur.glyph
    group.position.x = cur.offX
    group.position.y = cur.offY
    group.rotation.y = (cur.tilt + spin) * settle + (ptr.x - 0.5) * 0.3 * (0.3 + 0.7 * settle)
    group.rotation.x = (ptr.y - 0.5) * -0.18 * (0.3 + 0.7 * settle)
    camera.position.z = cur.camZ

    renderer.render(scene, camera)
  }

  function loop(now: number) {
    raf = requestAnimationFrame(loop)
    tick(now)
  }
  function start() {
    if (raf || reduced) return
    t0 = performance.now()
    raf = requestAnimationFrame(loop)
  }
  function stop() {
    if (raf) cancelAnimationFrame(raf)
    raf = 0
  }
  function once() {
    t0 = performance.now() - 16
    tick(performance.now())
  }

  function resize() {
    const w = canvas.clientWidth || window.innerWidth
    const h = canvas.clientHeight || window.innerHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    // keep the lattice in frame on narrow screens
    camera.fov = w < 720 ? 52 : w < 1100 ? 44 : 38
    camera.updateProjectionMatrix()
    if (reduced) once()
  }

  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  const onPointer = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return
    ptr.tx = e.clientX / window.innerWidth
    ptr.ty = e.clientY / window.innerHeight
  }
  const onVis = () => (document.hidden ? stop() : start())
  window.addEventListener('pointermove', onPointer, { passive: true })
  document.addEventListener('visibilitychange', onVis)

  if (reduced) once()
  else start()

  return {
    setPhase(p) {
      if (p === phase) return
      phase = p
      if (reduced) once()
    },
    setFocus(buildId) {
      const i = buildId ? builds.findIndex((b) => b.id === buildId) : -1
      focusTarget.set(i === 0 ? 1 : 0, i === 1 ? 1 : 0, i === 2 ? 1 : 0)
      focusedTarget = i >= 0 ? 1 : 0
      if (reduced) once()
    },
    setHover(techId) {
      const i = techId ? index.get(techId) : undefined
      nodeUni.uHoverId.value = i === undefined ? -1 : i
      if (reduced) once()
    },
    dispose() {
      stop()
      ro.disconnect()
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('visibilitychange', onVis)
      nodeGeo.dispose()
      edgeGeo.dispose()
      corpusGeo.dispose()
      nodeMat.dispose()
      edgeMat.dispose()
      corpusMat.dispose()
      renderer.dispose()
    },
  }
}

