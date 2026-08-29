/**
 * Single source of truth for every piece of content on the site.
 * Edit here; the layout, the navigation rail and the 3D lattice all read from this.
 */

export type Tier = 'shipped' | 'core'

export interface Tech {
  id: string
  name: string
  /** ids of the builds this technology actually shipped in */
  builds: string[]
  tier: Tier
  group: 'language' | 'framework' | 'data' | 'platform'
}

export interface Build {
  id: string
  index: string
  name: string
  /** short label used in the rail and on tech rows */
  short: string
  context: string
  /** the one-line answer to "what is it" */
  premise: string
  /** the three beats every one of these systems has */
  ingest: string
  extract: string
  explain: string
  /** what Devansh specifically built, stated plainly */
  contribution: string
  /** hardest engineering problem in the build */
  hard: string
  facts: { value: string; label: string }[]
  stack: string[]
  status: string
}

export const profile = {
  name: 'Devansh Gupta',
  first: 'Devansh',
  last: 'Gupta',
  initials: 'DG',
  role: 'Software Engineer',
  location: 'Gurugram, Haryana',
  locationShort: 'Gurugram, IN',

  /** hero thesis — the pattern that runs through all three builds */
  thesis:
    'I build systems that read what a person cannot — six hundred research papers, a stack of policy documents, a database nobody has audited — and hand back something you can act on.',

  /** shorter version for meta tags and the closing panel */
  thesisShort:
    'I build systems that turn unreadable amounts of information into something a person can act on.',

  availability: {
    now: 'Available now for software engineering internships.',
    later: 'Open to full-time roles from 2028.',
  },

  banner: {
    prize: '5th',
    of: '150+ teams',
    event: 'NASA Space Apps Challenge 2025',
    qualifier: 'Bhimtal local round · 48-hour global hackathon',
  },

  links: {
    email: 'deepdive.devansh@gmail.com',
    phone: '+91 6307506684',
    phoneHref: 'tel:+916307506684',
    github: 'https://github.com/StoicDevansh',
    githubHandle: 'StoicDevansh',
    linkedin: 'https://www.linkedin.com/in/stoic-devansh',
    linkedinHandle: 'stoic-devansh',
    resume: 'Devansh-Gupta-Resume.pdf',
  },

  education: {
    degree: 'B.Tech, Computer Science & Engineering',
    school: 'WCTM College',
    place: 'Gurugram, Haryana',
    finish: 'Expected 2028',
  },
} as const

export const builds: Build[] = [
  {
    id: 'ske',
    index: '01',
    name: 'Space Biology Knowledge Engine',
    short: 'Knowledge Engine',
    context: 'NASA Space Apps Challenge 2025',
    premise:
      'A knowledge graph built over NASA’s bioscience library, so a researcher can ask how the human body adapts to microgravity and see the evidence behind the answer.',
    ingest:
      '600+ NASA bioscience research papers on human adaptation to microgravity, plus a parallel pipeline keeping the corpus in sync.',
    extract:
      'A Neo4j knowledge graph linking papers, findings and biological systems, queried through Django REST APIs wired into an AI engine that resolves questions into explainable insights.',
    explain:
      'A React interface where the graph is navigable in 3D — you move through the research ecosystem instead of reading a result list, and every insight traces back to the papers it came from.',
    contribution:
      'I built the Django REST API layer and its integration with the AI engine, then the React, Vite and Three.js frontend, including the interactive 3D view of the knowledge ecosystem.',
    hard:
      'Turning 600 unstructured papers into a graph that could answer a question and still show its evidence. An answer nobody can verify is worthless in research, so every insight had to carry its citations back through the API and into the 3D view.',
    facts: [
      { value: '600+', label: 'papers in the graph' },
      { value: '5th', label: 'of 150+ teams' },
      { value: '48h', label: 'to build it' },
    ],
    stack: ['Python', 'Django', 'Neo4j', 'REST APIs', 'React', 'Vite', 'Three.js'],
    status: 'Team build · 48-hour hackathon',
  },
  {
    id: 'dpca',
    index: '02',
    name: 'Data Policy Compliance Agent',
    short: 'Compliance Agent',
    context: 'GDG Hackfest',
    premise:
      'Reads a written data policy, turns it into machine-checkable rules, scans real databases for violations, and explains how to fix each one.',
    ingest:
      'Policy documents in the form organisations actually keep them — prose, not configuration.',
    extract:
      'A modular FastAPI backend: policy ingestion, rule extraction, agent orchestration, violation detection, monitoring and reporting, scanning across SQLite, PostgreSQL, MySQL and MongoDB.',
    explain:
      'A Next.js dashboard over the API showing compliance metrics, every violation found and the remediation it recommends — with a human-in-the-loop review step before anything is treated as settled.',
    contribution:
      'I built the FastAPI backend and its six modules, the multi-database scanning layer, the human-in-the-loop review workflow, and the Next.js dashboard on top of it.',
    hard:
      'A compliance tool that is confidently wrong is worse than no tool at all. Every violation had to be traceable to the clause that produced it, and a reviewer had to be able to reject it — which is why the review step is part of the architecture rather than a screen bolted on at the end.',
    facts: [
      { value: '4', label: 'database engines scanned' },
      { value: '6', label: 'backend modules' },
      { value: '1', label: 'human in the loop' },
    ],
    stack: ['Python', 'FastAPI', 'Next.js', 'PostgreSQL', 'MySQL', 'MongoDB', 'SQLite'],
    status: 'Hackathon build',
  },
  {
    id: 'csec',
    index: '03',
    name: 'Cybersecurity Awareness & Defense Platform',
    short: 'Security Platform',
    context: 'College tech fest',
    premise:
      'Four security threats and their defences, running side by side in one interface, so a non-technical audience can watch the attack and the countermeasure at the same time.',
    ingest:
      'A weak password, an unprotected credential store, a convincing email and an ordinary-looking image.',
    extract:
      'A Python suite behind each one: generation with the secrets module, an encrypted password manager using Fernet symmetric encryption, a phishing simulation, and image steganography.',
    explain:
      'A Flask console unifying all four demonstrations under one controllable UI, including simulated phishing warnings — the point is that the audience sees the mechanism, not just the warning.',
    contribution:
      'Built solo: the four demonstration modules, the cryptography, and the Flask interface that ties them together for a live audience.',
    hard:
      'Making a threat visible without making it usable. The phishing flow and steganography had to be convincing enough to land as a lesson while staying inert — demonstrations, contained by design.',
    facts: [
      { value: '4', label: 'threats demonstrated' },
      { value: 'Fernet', label: 'symmetric encryption' },
      { value: 'LSB', label: 'image steganography' },
    ],
    stack: ['Python', 'Flask', 'Cryptography'],
    status: 'Solo build',
  },
]

export const tech: Tech[] = [
  { id: 'python', name: 'Python', builds: ['ske', 'dpca', 'csec'], tier: 'shipped', group: 'language' },
  { id: 'js', name: 'JavaScript', builds: ['ske', 'dpca'], tier: 'shipped', group: 'language' },
  { id: 'react', name: 'React', builds: ['ske'], tier: 'shipped', group: 'framework' },
  { id: 'next', name: 'Next.js', builds: ['dpca'], tier: 'shipped', group: 'framework' },
  { id: 'three', name: 'Three.js', builds: ['ske'], tier: 'shipped', group: 'framework' },
  { id: 'django', name: 'Django', builds: ['ske'], tier: 'shipped', group: 'framework' },
  { id: 'fastapi', name: 'FastAPI', builds: ['dpca'], tier: 'shipped', group: 'framework' },
  { id: 'flask', name: 'Flask', builds: ['csec'], tier: 'shipped', group: 'framework' },
  { id: 'rest', name: 'REST APIs', builds: ['ske', 'dpca'], tier: 'shipped', group: 'platform' },
  { id: 'neo4j', name: 'Neo4j', builds: ['ske'], tier: 'shipped', group: 'data' },
  { id: 'postgres', name: 'PostgreSQL', builds: ['dpca'], tier: 'shipped', group: 'data' },
  { id: 'mongo', name: 'MongoDB', builds: ['dpca'], tier: 'shipped', group: 'data' },
  { id: 'mysql', name: 'MySQL', builds: ['dpca'], tier: 'shipped', group: 'data' },
  { id: 'sqlite', name: 'SQLite', builds: ['dpca'], tier: 'shipped', group: 'data' },
  { id: 'html', name: 'HTML & CSS', builds: ['ske', 'dpca', 'csec'], tier: 'shipped', group: 'language' },
  { id: 'vite', name: 'Vite', builds: ['ske'], tier: 'shipped', group: 'platform' },
  { id: 'crypto', name: 'Cryptography', builds: ['csec'], tier: 'shipped', group: 'platform' },

  { id: 'c', name: 'C', builds: [], tier: 'core', group: 'language' },
  { id: 'cpp', name: 'C++', builds: [], tier: 'core', group: 'language' },
  { id: 'java', name: 'Java', builds: [], tier: 'core', group: 'language' },
  { id: 'php', name: 'PHP', builds: [], tier: 'core', group: 'language' },
  { id: 'oauth', name: 'OAuth · Supabase', builds: [], tier: 'core', group: 'platform' },
  { id: 'docker', name: 'Docker', builds: [], tier: 'core', group: 'platform' },
  { id: 'git', name: 'Git & GitHub', builds: [], tier: 'core', group: 'platform' },
  { id: 'postman', name: 'Postman', builds: [], tier: 'core', group: 'platform' },
  { id: 'linux', name: 'Linux', builds: [], tier: 'core', group: 'platform' },
]

export const sections = [
  { id: 'signal', label: 'Start', nav: false },
  { id: 'work', label: 'Work', nav: true },
  { id: 'stack', label: 'Stack', nav: true },
  { id: 'path', label: 'Path', nav: true },
  { id: 'contact', label: 'Contact', nav: true },
] as const

export type SectionId = (typeof sections)[number]['id']
