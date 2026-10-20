import { useEffect, useState } from 'preact/hooks'
import { getCountries, getEntries, getWeather, saveEntry } from './api'
import type { Country, Entry, NewEntry, Weather } from './api'
import { CountrySelect } from './components/CountrySelect'
import { EntryForm } from './components/EntryForm'
import { EntryList } from './components/EntryList'
import { Insights } from './components/Insights'
import { WeatherCard } from './components/WeatherCard'

export function App() {
  const [countries, setCountries] = useState<Country[]>([])
  const [selected, setSelected] = useState('MG') // default: Madagascar
  const [weather, setWeather] = useState<Weather | null>(null)
  const [entries, setEntries] = useState<Entry[]>([])
  const [error, setError] = useState('')

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
    if (selected === '') return

    getWeather(selected)
      .then(setWeather)
      .catch((e) => setError(e.message))
  }, [selected])

  function handleSave(newEntry: NewEntry) {
    saveEntry(newEntry)
      .then(() => getEntries())
      .then(setEntries)
      .catch((e) => setError(e.message))
  }

  return (
    <main>
      <h1>Skylight</h1>
      <CountrySelect countries={countries} value={selected} onChange={setSelected} />

      {error && <p class="error">{error}</p>}
      {selected && !weather && !error && <p>Loading...</p>}
      {weather && <WeatherCard weather={weather} />}
      {weather && <EntryForm countryCode={selected} onSave={handleSave} />}

      <h2>Insights</h2>
      <Insights entries={entries} />

      <h2>Journal</h2>
      <EntryList entries={entries} />
    </main>
  )
}
