// The user's location is detected once and then fixed — there is no way to change it.
// First we ask the browser for a precise position; if that's denied or unavailable,
// we fall back to an approximate position from the visitor's IP address.

export type Coords = { lat: number; lng: number }

const CACHE_KEY = 'skylight.coords'

// Remember the last known position so repeat visits don't re-prompt.
function readCache(): Coords | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const c = JSON.parse(raw)
    if (typeof c?.lat === 'number' && typeof c?.lng === 'number') return c
  } catch {
    /* private mode / blocked storage — ignore */
  }
  return null
}

function writeCache(coords: Coords) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(coords))
  } catch {
    /* ignore */
  }
}

function fromBrowser(): Promise<Coords> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('no geolocation'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { timeout: 8000, maximumAge: 600000 },
    )
  })
}

async function fromIp(): Promise<Coords> {
  const res = await fetch('https://ipapi.co/json/')
  if (!res.ok) throw new Error('ip lookup failed')
  const data = await res.json()
  if (typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
    throw new Error('ip lookup returned no coordinates')
  }
  return { lat: data.latitude, lng: data.longitude }
}

// Resolve the fixed location: browser position first, IP fallback, cached last resort.
export async function detectLocation(): Promise<Coords> {
  try {
    const coords = await fromBrowser()
    writeCache(coords)
    return coords
  } catch {
    // denied, timed out, or unsupported → try IP
  }

  try {
    const coords = await fromIp()
    writeCache(coords)
    return coords
  } catch {
    // network/service issue → last known position if we have one
  }

  const cached = readCache()
  if (cached) return cached
  throw new Error("We couldn't detect your location.")
}
