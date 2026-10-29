import { useEffect, useRef } from 'preact/hooks'

// The universe behind the globe: a nebula wash (CSS, per theme) plus three drifting,
// twinkling star layers rendered as box-shadow dots.
function fill(el: HTMLDivElement | null, count: number, maxSize: number) {
  if (!el) return
  const shadows: string[] = []
  const w = window.innerWidth
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * w)
    const y = Math.floor(Math.random() * 2000)
    const size = (Math.random() * maxSize).toFixed(1)
    const alpha = (0.4 + Math.random() * 0.6).toFixed(2)
    shadows.push(`${x}px ${y}px 0 ${size}px rgba(255,255,255,${alpha})`)
  }
  el.style.boxShadow = shadows.join(',')
}

export function Starfield() {
  const a = useRef<HTMLDivElement>(null)
  const b = useRef<HTMLDivElement>(null)
  const c = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const draw = () => {
      fill(a.current, 140, 0.8)
      fill(b.current, 90, 1.3)
      fill(c.current, 60, 1.0)
    }
    draw()
    window.addEventListener('resize', draw)
    return () => window.removeEventListener('resize', draw)
  }, [])

  return (
    <>
      <div class="space" />
      <div class="layer a" ref={a} />
      <div class="layer b" ref={b} />
      <div class="layer c" ref={c} />
    </>
  )
}
