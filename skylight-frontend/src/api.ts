// Types match what the Rust backend returns

export type Country = {
  code: string
  name: string
  latitude: number
  longitude: number
}

export type Weather = {
  temperature_2m: number
  wind_speed_10m: number
  cloud_cover: number
  is_day: number // 1 = day, 0 = night
  precipitation: number
}

export async function getCountries(): Promise<Country[]> {
  const res = await fetch('/api/countries')
  if (!res.ok) throw new Error('Could not load countries')
  return res.json()
}

export async function getWeather(code: string): Promise<Weather> {
  const res = await fetch(`/api/countries/${code}/weather`)
  if (!res.ok) throw new Error('Could not load weather')
  return res.json()
}

export type NewEntry = {
  date: string // "2026-10-20"
  country_code: string
  mood: number // 1 to 5
  note: string
  activities: string[]
}

export type Entry = NewEntry & {
  created_at: number // seconds since 1970 (0 for old entries)
  country_name: string
  weather: Weather
}

export async function getEntries(): Promise<Entry[]> {
  const res = await fetch('/api/entries')
  if (!res.ok) throw new Error('Could not load entries')
  return res.json()
}

export async function saveEntry(entry: NewEntry): Promise<Entry> {
  const res = await fetch('/api/entries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  })
  if (!res.ok) throw new Error('Could not save entry')
  return res.json()
}
