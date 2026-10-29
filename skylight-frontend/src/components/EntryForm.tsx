import { useState } from 'preact/hooks'
import type { Coords } from '../location'
import type { NewEntry } from '../api'
import { CheckIcon } from '../icons'
import { MOODS, moodFaceSvg } from '../moods'

type Props = {
  coords: Coords | null // null until the location is detected
  saving: boolean
  onSave: (entry: NewEntry) => Promise<void>
}

// Pick a mood face, write a thought, broadcast it from your location to the globe.
// Rendered inside the share popup (the heading lives in the popup header).
export function EntryForm({ coords, saving, onSave }: Props) {
  const [mood, setMood] = useState(0) // 0 = not chosen yet
  const [note, setNote] = useState('')

  function handleSubmit(e: Event) {
    e.preventDefault()
    if (!coords || mood === 0 || note.trim() === '') return
    onSave({ lat: coords.lat, lng: coords.lng, mood, note: note.trim() })
      .then(() => {
        setMood(0)
        setNote('')
      })
      .catch(() => {}) // the error is already shown by App; keep what the user typed
  }

  const ready = coords !== null
  let buttonLabel = 'Broadcast thought'
  if (!ready) buttonLabel = 'Finding your location…'
  else if (mood === 0) buttonLabel = 'Pick a mood to broadcast'
  else if (saving) buttonLabel = 'Broadcasting…'

  return (
    <form class="share-form" onSubmit={handleSubmit}>
      <div class="moods" role="group" aria-label="Mood">
        {MOODS.map((m, i) => (
          <button
            type="button"
            key={m.label}
            class={`mood ${mood === i + 1 ? 'on' : ''}`}
            aria-pressed={mood === i + 1}
            onClick={() => setMood(i + 1)}
          >
            <span class="mood-face" dangerouslySetInnerHTML={{ __html: moodFaceSvg(i + 1) }} />
            {m.label}
          </button>
        ))}
      </div>

      <label>
        <span class="label">Your thought</span>
        <textarea
          class="note"
          placeholder="What's on your mind right now?"
          value={note}
          onInput={(e) => setNote(e.currentTarget.value)}
        />
      </label>

      <button type="submit" class="btn" disabled={!ready || mood === 0 || note.trim() === '' || saving}>
        <CheckIcon size={20} />
        {buttonLabel}
      </button>
    </form>
  )
}
