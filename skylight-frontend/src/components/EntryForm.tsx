import { useState } from 'preact/hooks'
import type { NewEntry } from '../api'
import { ACTIVITIES, MOODS } from '../moods'

type Props = {
  countryCode: string
  onSave: (entry: NewEntry) => void
}

export function EntryForm({ countryCode, onSave }: Props) {
  const [mood, setMood] = useState(0) // 0 = not chosen yet
  const [note, setNote] = useState('')
  const [activities, setActivities] = useState<string[]>([])

  function toggleActivity(activity: string) {
    if (activities.includes(activity)) {
      setActivities(activities.filter((a) => a !== activity))
    } else {
      setActivities([...activities, activity])
    }
  }

  function handleSubmit(e: Event) {
    e.preventDefault()
    onSave({
      date: new Date().toLocaleDateString('en-CA'), // "YYYY-MM-DD" in local time
      country_code: countryCode,
      mood,
      note,
      activities,
    })
  }

  return (
    <form class="card" onSubmit={handleSubmit}>
      <h2>How do you feel today?</h2>

      <div class="moods">
        {MOODS.map((m, i) => (
          <button
            type="button"
            key={m.label}
            class={mood === i + 1 ? 'selected' : ''}
            onClick={() => setMood(i + 1)}
          >
            {m.emoji}
            <small>{m.label}</small>
          </button>
        ))}
      </div>

      <div class="activities">
        {ACTIVITIES.map((activity) => (
          <label key={activity}>
            <input
              type="checkbox"
              checked={activities.includes(activity)}
              onChange={() => toggleActivity(activity)}
            />
            {activity}
          </label>
        ))}
      </div>

      <textarea
        placeholder="Notes about your day..."
        value={note}
        onInput={(e) => setNote(e.currentTarget.value)}
      />

      <button type="submit" disabled={mood === 0}>
        Save entry
      </button>
    </form>
  )
}
