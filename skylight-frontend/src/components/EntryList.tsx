import type { Entry } from '../api'
import { getCondition } from '../conditions'
import { formatTime, shortDate } from '../dates'
import { MoodFace } from '../icons'
import { MOODS } from '../moods'

type Props = {
  entries: Entry[]
  highlight: number | null // created_at of the entry just saved (animated)
}

export function EntryList({ entries, highlight }: Props) {
  if (entries.length === 0) {
    return <p class="muted small">No entries yet. Save your first one!</p>
  }

  return (
    <div class="scroll">
      {entries.map((entry) => {
        const mood = MOODS[entry.mood - 1]
        const time = formatTime(entry.created_at)

        return (
          <article
            key={`${entry.date}-${entry.created_at}`}
            class={`entry ${entry.created_at === highlight ? 'new' : ''}`}
          >
            <div class="entry-face" style={{ background: mood.tint }}>
              <MoodFace mouth={mood.mouth} size={26} />
            </div>
            <div class="entry-body">
              <div class="entry-head">
                <span class="entry-mood">{mood.label}</span>
                <span class="muted small">
                  {shortDate(entry.date)}
                  {time && ` · ${time}`} · {entry.country_name}
                </span>
              </div>
              <div class="small entry-weather">
                {getCondition(entry.weather)} · {entry.weather.temperature_2m}°C
              </div>
              {entry.note && <p class="entry-note">{entry.note}</p>}
              {entry.activities.length > 0 && (
                <div class="tags">
                  {entry.activities.map((a) => (
                    <span key={a} class="tag">
                      {a}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        )
      })}
    </div>
  )
}
