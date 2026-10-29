import { useEffect, useRef } from 'preact/hooks'
import Globe, { type GlobeInstance } from 'globe.gl'
import type { Entry } from '../api'
import { moodColor, moodFaceSvg, moodLabel } from '../moods'

type Props = {
  entries: Entry[]
  atmosphere: string // limb-glow colour, set by the local time of day
}

// Crisp 2K daytime Earth (three.js planet texture) + terrain bump for relief.
const DAY = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/textures/planets/earth_atmos_2048.jpg'
const BUMP = 'https://unpkg.com/three-globe@2.45.6/example/img/earth-topology.png'

// A thought with the display position it's actually drawn at (may be fanned out).
type Placed = Entry & { _lat: number; _lng: number }

const GOLDEN = Math.PI * (3 - Math.sqrt(5)) // ~137.5°, for an even sunflower spread
const SPREAD = 1.3 // degrees between fanned-out pins

// Thoughts sharing a spot (same person, or people in the same place) would stack on top of
// each other. Group the co-located ones and fan all but the first out in a small spiral.
function spread(entries: Entry[]): Placed[] {
  const groups = new Map<string, Entry[]>()
  for (const e of entries) {
    const key = `${e.lat.toFixed(2)},${e.lng.toFixed(2)}`
    const g = groups.get(key)
    if (g) g.push(e)
    else groups.set(key, [e])
  }

  const placed: Placed[] = []
  for (const group of groups.values()) {
    group.forEach((e, i) => {
      if (i === 0) {
        placed.push({ ...e, _lat: e.lat, _lng: e.lng })
        return
      }
      const r = SPREAD * Math.sqrt(i)
      const a = i * GOLDEN
      const dLat = r * Math.cos(a)
      // keep the fan circular away from the equator (lng degrees shrink with latitude)
      const dLng = (r * Math.sin(a)) / Math.max(0.2, Math.cos((e.lat * Math.PI) / 180))
      placed.push({ ...e, _lat: e.lat + dLat, _lng: e.lng + dLng })
    })
  }
  return placed
}

// Builds one pin: the mood face, always visible, with the thought revealed on hover (CSS).
function makePin(entry: Entry): HTMLElement {
  const pin = document.createElement('div')
  pin.className = 'pin'
  pin.style.pointerEvents = 'auto'

  const face = document.createElement('div')
  face.className = 'pin-face'
  face.innerHTML = moodFaceSvg(entry.mood)
  face.setAttribute('aria-label', moodLabel(entry.mood))
  const glow = moodColor(entry.mood)
  face.style.boxShadow = `0 2px 8px rgba(0,0,0,.5), 0 0 0 2px rgba(255,255,255,.65), 0 0 18px ${glow}aa`

  const bubble = document.createElement('div')
  bubble.className = 'thought-bubble'
  const text = document.createElement('p')
  text.className = 'thought-text'
  text.textContent = entry.note // textContent, so a thought can't inject markup
  const where = document.createElement('span')
  where.className = 'thought-where'
  // Prefer the city from the time zone (accurate) over the coarse nearest-country label
  const zoneCity = entry.weather?.timezone?.split('/').pop()?.replace(/_/g, ' ')
  where.textContent = zoneCity || entry.country_name || `${entry.lat.toFixed(1)}, ${entry.lng.toFixed(1)}`
  bubble.appendChild(text)
  bubble.appendChild(where)

  pin.appendChild(face)
  pin.appendChild(bubble)
  return pin
}

export function GlobeView({ entries, atmosphere }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const globeRef = useRef<GlobeInstance | null>(null)

  // Create the globe once
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const world = new Globe(el)
      .backgroundColor('rgba(0,0,0,0)')
      .globeImageUrl(DAY)
      .bumpImageUrl(BUMP)
      .showAtmosphere(true)
      .atmosphereColor(atmosphere)
      .atmosphereAltitude(0.27)
      .htmlLat((d: object) => (d as Placed)._lat)
      .htmlLng((d: object) => (d as Placed)._lng)
      .htmlElement((d: object) => makePin(d as Entry))
    globeRef.current = world

    // Render at the screen's real pixel density so it isn't soft/blurry.
    world.renderer().setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    // A little more mountain/ocean relief.
    world.globeMaterial().bumpScale = 10

    // Gentle auto-rotation
    const controls = world.controls()
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.4
    controls.enablePan = false
    world.pointOfView({ lat: 12, lng: 30, altitude: 2.4 })

    const resize = () => world.width(el.clientWidth).height(el.clientHeight)
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    return () => {
      ro.disconnect()
      world._destructor()
      el.replaceChildren()
    }
  }, [])

  // Atmosphere limb glow follows the local time of day
  useEffect(() => {
    globeRef.current?.atmosphereColor(atmosphere)
  }, [atmosphere])

  // Re-plot whenever the thoughts change (co-located ones fanned out so they don't overlap)
  useEffect(() => {
    globeRef.current?.htmlElementsData(spread(entries) as unknown as object[])
  }, [entries])

  return <div class="globe" ref={containerRef} />
}
