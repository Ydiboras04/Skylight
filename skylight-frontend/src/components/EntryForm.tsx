import { useState } from 'preact/hooks'
import type { NewEntry } from '../api'
import { today } from '../dates'
import { CheckIcon, MoodFace } from '../icons'
import { ACTIVITIES, MOODS } from '../moods'

type Props = {
  countryCode: string
  countryName: string
  saving: boolean
  onSave: (entry: NewEntry) => Promise<void>
}

// Bottom left: pick a mood, activities, write a note, save
export function EntryForm({ countryCode, countryName, saving, onSave }: Props) {
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
    onSave({ date: today(), country_code: countryCode, mood, note: note.trim(), activities })
      .then(() => {
        // Clear the form after a successful save
        setMood(0)
        setNote('')
        setActivities([])
      })
      .catch(() => {}) // the error is already shown by App; keep what the user typed
  }

  let buttonLabel = 'Save entry'
  if (mood === 0) buttonLabel = 'Pick a mood to save'
  if (saving) buttonLabel = 'Saving…'

  return (
    <form class="card form rise" style={{ animationDelay: '.18s' }} onSubmit={handleSubmit}>
      <div>
        <h2>How do you feel today?</h2>
        <p class="muted small" style={{ margin: '6px 0 0' }}>
          The current weather in {countryName} is saved with your entry.
        </p>
      </div>

      <div class="moods" role="group" aria-label="Mood">
        {MOODS.map((m, i) => (
          <button
            type="button"
            key={m.label}
            class={`mood ${mood === i + 1 ? 'on' : ''}`}
            aria-pressed={mood === i + 1}
            onClick={() => setMood(i + 1)}
          >
            <MoodFace mouth={m.mouth} size={34} />
            {m.label}
          </button>
        ))}
      </div>

      <div>
        <div class="label">Activities</div>
        <div class="chips" role="group" aria-label="Activities">
          {ACTIVITIES.map((activity) => (
            <button
              type="button"
              key={activity}
              class={`chip ${activities.includes(activity) ? 'on' : ''}`}
              aria-pressed={activities.includes(activity)}
              onClick={() => toggleActivity(activity)}
            >
              {activity}
            </button>
          ))}
        </div>
      </div>

      <label class="note-field">
        <span class="label">Note</span>
        <textarea
          class="note"
          placeholder="What made today what it was?"
          value={note}
          onInput={(e) => setNote(e.currentTarget.value)}
        />
      </label>

      <button type="submit" class="btn" disabled={mood === 0 || saving}>
        <CheckIcon size={20} />
        {buttonLabel}
      </button>
    </form>
  )
}
