import { useEffect, useState } from 'preact/hooks'
import { getCountries, getEntries, getWeather, saveEntry } from './api'
import type { Country, Entry, NewEntry, Weather } from './api'
import { AiPanel } from './components/AiPanel'
import { Dashboard } from './components/Dashboard'
import { EntryForm } from './components/EntryForm'
import { EntryList } from './components/EntryList'
import { Header } from './components/Header'
import { Insights } from './components/Insights'
import { WeatherCard } from './components/WeatherCard'
import { CheckIcon } from './icons'

export function App() {
  const [countries, setCountries] = useState<Country[]>([])
  const [selected, setSelected] = useState('MG') // default: Madagascar
  const [weather, setWeather] = useState<Weather | null>(null)
  const [entries, setEntries] = useState<Entry[]>([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [justSaved, setJustSaved] = useState<number | null>(null) // created_at of the new entry
  const [toast, setToast] = useState(false)
  // Kept separately so it doesn't flash back to day while the next weather loads
  const [isNight, setIsNight] = useState(false)
  const [timezone, setTimezone] = useState('') // the selected country's time zone

  // Load the countries and past entries once, when the page opens
  useEffect(() => {
    getCountries()
      .then(setCountries)
      .catch((e) => setError(e.message))
    getEntries()
      .then(setEntries)
      .catch((e) => setError(e.message))
  }, [])

  // Load the weather every time the selected country changes
  useEffect(() => {
    setWeather(null)
    setError('')
    getWeather(selected)
      .then((w) => {
        setWeather(w)
        setIsNight(w.is_day === 0)
        setTimezone(w.timezone)
      })
      .catch((e) => setError(e.message))
  }, [selected])

  async function handleSave(newEntry: NewEntry) {
    setSaving(true)
    setError('')
    try {
      const saved = await saveEntry(newEntry)
      setEntries(await getEntries())
      setJustSaved(saved.created_at)
      setToast(true)
      setTimeout(() => setToast(false), 2600)
    } catch (e) {
      setError((e as Error).message)
      throw e // keeps the form filled in so nothing is lost
    } finally {
      setSaving(false)
    }
  }

  const countryName = countries.find((c) => c.code === selected)?.name ?? ''

  return (
    // Night in the selected country → dark mode (the gradient becomes a night sky)
    <div class={`page ${isNight ? 'night' : ''}`}>
      <div class="container">
        <Header
          countries={countries}
          selected={selected}
          onSelect={setSelected}
          isNight={isNight}
          timezone={timezone}
        />

        {error && (
          <p class="error-banner" role="alert">
            {error}
          </p>
        )}

        <div class="grid">
          <Dashboard entries={entries} />
          <WeatherCard countryName={countryName} weather={weather} />
          <EntryForm
            countryCode={selected}
            countryName={countryName}
            saving={saving}
            onSave={handleSave}
          />

          <section class="card rise" style={{ animationDelay: '.24s' }}>
            <h2>Mood by weather</h2>
            <Insights entries={entries} />

            <div class="journal">
              <div class="card-title-row">
                <h3>Journal</h3>
                <span class="muted small">{entries.length} entries</span>
              </div>
              <EntryList entries={entries} highlight={justSaved} />
            </div>
          </section>
        </div>
      </div>

      <AiPanel countryCode={selected} countryName={countryName} />

      {toast && (
        <div class="toast" role="status">
          <CheckIcon size={18} class="toast-icon" />
          Entry saved with today's weather
        </div>
      )}
    </div>
  )
}
