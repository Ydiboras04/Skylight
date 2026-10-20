import type { Entry } from '../api'
import { getCondition } from '../conditions'
import { MOODS } from '../moods'

type Props = {
  entries: Entry[]
}

export function EntryList({ entries }: Props) {
  if (entries.length === 0) {
    return <p>No entries yet.</p>
  }

  return (
    <ul class="entries">
      {entries.map((entry) => (
        <li key={`${entry.date}-${entry.created_at}`} class="card">
          <p>
            <strong>{entry.date}</strong> {formatTime(entry.created_at)} {MOODS[entry.mood - 1].emoji}{' '}
            {MOODS[entry.mood - 1].label} · {entry.country_name}
          </p>
          <p>
            {getCondition(entry.weather)} · {entry.weather.temperature_2m} °C · clouds {entry.weather.cloud_cover} % · rain{' '}
            {entry.weather.precipitation} mm
          </p>
          {entry.activities.length > 0 && <p>{entry.activities.join(', ')}</p>}
          {entry.note && <p>{entry.note}</p>}
        </li>
      ))}
    </ul>
  )
}

// 1729425600 → "14:32" (empty for old entries saved without a time)
function formatTime(createdAt: number): string {
  if (createdAt === 0) return ''
  return new Date(createdAt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
