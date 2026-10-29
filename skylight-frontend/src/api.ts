// The backend's address, from .env (VITE_API_URL=https://...).
// Empty in development: requests then go to /api/... and Vite forwards them to localhost:3000.
const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

// Types match what the Rust backend returns

export type Weather = {
  temperature_2m: number
  wind_speed_10m: number
  cloud_cover: number
  is_day: number // 1 = day, 0 = night
  timezone: string // e.g. "Asia/Tokyo" (empty for old entries)
  precipitation: number
}

// Current weather at a point, used to pick the time-of-day theme.
export async function getWeatherByCoords(lat: number, lng: number): Promise<Weather> {
  const res = await fetch(`${API_URL}/api/weather?lat=${lat}&lng=${lng}`)
  if (!res.ok) throw new Error('Could not load weather')
  return res.json()
}

// What the frontend sends when broadcasting a thought
export type NewEntry = {
  lat: number
  lng: number
  mood: number // 1 to 5, picks the face shown on the globe
  note: string // the thought itself
}

// A stored thought, as returned by the backend
export type Entry = NewEntry & {
  created_at: number // seconds since 1970 (0 for old entries)
  date: string
  country_code: string
  country_name: string
  weather: Weather
}

export async function getEntries(): Promise<Entry[]> {
  const res = await fetch(`${API_URL}/api/entries`)
  if (!res.ok) throw new Error('Could not load thoughts')
  return res.json()
}

export async function saveEntry(entry: NewEntry): Promise<Entry> {
  const res = await fetch(`${API_URL}/api/entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  })
  if (!res.ok) throw new Error('Could not send your thought')
  return res.json()
}
