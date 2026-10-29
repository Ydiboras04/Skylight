// The five moods. Each is a little character: its own colour + gradient, eyes, mouth and cheeks.

const EYES = {
  sleepy: 'M8 10.4c.6.6 1.5.7 2.1.2 M13.9 10.4c.6.6 1.5.7 2.1.2',
  flat: 'M8.3 10.5h1.7 M14 10.5h1.7',
  dot: 'M9.2 10.1v.6 M14.8 10.1v.6',
  happy: 'M8 10.9c.6-.9 1.6-.9 2.2 0 M13.8 10.9c.6-.9 1.6-.9 2.2 0',
}

// mood 1 → MOODS[0] … mood 5 → MOODS[4]
export const MOODS = [
  { label: 'Sluggish', c1: '#CBD5E1', c2: '#94A3B8', eyes: EYES.sleepy, mouth: 'M8.9 16.9c1-1.4 2.1-2 3.1-2s2.1.6 3.1 2', cheeks: false },
  { label: 'Low', c1: '#C7D2FE', c2: '#818CF8', eyes: EYES.flat, mouth: 'M9 16.2c.9-.8 1.9-1.1 3-1.1s2.1.3 3 1.1', cheeks: false },
  { label: 'Okay', c1: '#BFDBFE', c2: '#60A5FA', eyes: EYES.dot, mouth: 'M9 15.4h6', cheeks: false },
  { label: 'Good', c1: '#A7F3D0', c2: '#34D399', eyes: EYES.happy, mouth: 'M8.7 14.5c1 1.2 2.2 1.7 3.3 1.7s2.3-.5 3.3-1.7', cheeks: true },
  { label: 'Great', c1: '#FDE68A', c2: '#FBBF24', eyes: EYES.happy, mouth: 'M8 14c1.2 2 2.5 2.9 4 2.9s2.8-.9 4-2.9', cheeks: true },
]

// mood value (1–5) → its label, e.g. 3 → "Okay"
export function moodLabel(mood: number): string {
  return MOODS[mood - 1]?.label ?? 'Okay'
}

// mood value (1–5) → its accent colour (for the globe-pin glow)
export function moodColor(mood: number): string {
  return (MOODS[mood - 1] ?? MOODS[2]).c2
}

let gid = 0

// The mood face as a standalone SVG string. Used both on the globe pins (set via innerHTML
// on a plain DOM node) and in the share form (via dangerouslySetInnerHTML).
export function moodFaceSvg(mood: number): string {
  const m = MOODS[mood - 1] ?? MOODS[2]
  const id = 'mg' + gid++
  const cheeks = m.cheeks
    ? '<circle cx="7.3" cy="14" r="1.5" fill="rgba(244,114,182,.45)"/><circle cx="16.7" cy="14" r="1.5" fill="rgba(244,114,182,.45)"/>'
    : ''
  return `<svg viewBox="0 0 24 24" width="100%" height="100%">
    <defs>
      <radialGradient id="${id}" cx="35%" cy="28%" r="85%">
        <stop offset="0%" stop-color="${m.c1}"/>
        <stop offset="100%" stop-color="${m.c2}"/>
      </radialGradient>
    </defs>
    <circle cx="12" cy="12" r="10.5" fill="url(#${id})" stroke="rgba(10,15,30,.18)" stroke-width="0.7"/>
    <ellipse cx="8.6" cy="7.6" rx="3.1" ry="1.9" fill="rgba(255,255,255,.4)"/>
    ${cheeks}
    <g fill="none" stroke="#2b2742" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <path d="${m.eyes}"/>
      <path d="${m.mouth}"/>
    </g>
  </svg>`
}
