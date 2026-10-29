import { useEffect, useState } from 'preact/hooks'
import { getEntries, getWeatherByCoords, saveEntry } from './api'
import type { Entry, NewEntry } from './api'
import { timeOfDay, type TimeOfDay } from './dates'
import { EntryForm } from './components/EntryForm'
import { GlobeView } from './components/Globe'
import { Header } from './components/Header'
import { Starfield } from './components/Starfield'
import { detectLocation, type Coords } from './location'
import { CheckIcon, CloseIcon, SparkleIcon } from './icons'

// Limb-glow colour of the globe, by the user's local time of day
const ATMOSPHERE: Record<TimeOfDay, string> = {
  morning: '#ffc08a',
  afternoon: '#8fc0ff',
  evening: '#ff9e7a',
  night: '#7a8cff',
}

export function App() {
  const [coords, setCoords] = useState<Coords | null>(null)
  const [entries, setEntries] = useState<Entry[]>([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  // Theme + time zone, derived from the weather at the user's location
  const [theme, setTheme] = useState<TimeOfDay>('afternoon')
  const [timezone, setTimezone] = useState('')

  // Detect the fixed location, and load every broadcast thought, once on open
  useEffect(() => {
    detectLocation()
      .then(setCoords)
      .catch((e) => setError(e.message))
    getEntries()
      .then(setEntries)
      .catch((e) => setError(e.message))
  }, [])

  // Once we know where the user is, fetch their weather → time zone → theme
  useEffect(() => {
    if (!coords) return
    getWeatherByCoords(coords.lat, coords.lng)
      .then((w) => {
        setTimezone(w.timezone)
        setTheme(timeOfDay(w.timezone))
      })
      .catch((e) => setError(e.message))
  }, [coords])

  // Keep the theme in step with the clock while the app stays open
  useEffect(() => {
    if (!timezone) return
    const timer = setInterval(() => setTheme(timeOfDay(timezone)), 60_000)
    return () => clearInterval(timer)
  }, [timezone])

  // Esc closes the share popup
  useEffect(() => {
    if (!shareOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setShareOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [shareOpen])

  async function handleSave(newEntry: NewEntry) {
    setSaving(true)
    setError('')
    try {
      await saveEntry(newEntry)
      setEntries(await getEntries())
      setShareOpen(false)
      setToast(true)
      setTimeout(() => setToast(false), 2600)
    } catch (e) {
      setError((e as Error).message)
      throw e // keeps the form filled in so nothing is lost
    } finally {
      setSaving(false)
    }
  }

  const isNight = theme === 'night'

  return (
    // The user's local time of day tints the universe + globe (night = deepest)
    <div class={`page ${theme}`}>
      <Starfield />
      <GlobeView entries={entries} atmosphere={ATMOSPHERE[theme]} />

      <Header isNight={isNight} timezone={timezone} />

      {error && (
        <p class="error-banner" role="alert">
          {error}
        </p>
      )}

      <div class="caption">
        <b>{entries.length}</b> thoughts around the world · hover a face to read it
      </div>

      <button class="fab" aria-label="Share a thought" onClick={() => setShareOpen(true)}>
        <SparkleIcon size={26} />
      </button>
      <div class="fab-label">Share a thought</div>

      <div
        class={`backdrop ${shareOpen ? 'open' : ''}`}
        onClick={(e) => e.target === e.currentTarget && setShareOpen(false)}
      >
        <div class="sheet" role="dialog" aria-modal="true" aria-label="Share a thought">
          <div class="sheet-head">
            <div>
              <h2>Share a thought</h2>
              <p class="muted small">It appears on the globe, pinned to where you are now.</p>
            </div>
            <button class="close" aria-label="Close" onClick={() => setShareOpen(false)}>
              <CloseIcon size={20} />
            </button>
          </div>
          <EntryForm coords={coords} saving={saving} onSave={handleSave} />
        </div>
      </div>

      {toast && (
        <div class="toast" role="status">
          <CheckIcon size={18} class="toast-icon" />
          Your thought is on the globe
        </div>
      )}
    </div>
  )
}
