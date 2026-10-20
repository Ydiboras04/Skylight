import type { Entry } from '../api'
import { lastSevenDays, shortDate } from '../dates'

type Props = {
  entries: Entry[]
}

// Top left: this week's numbers + a mood bar per day
export function Dashboard({ entries }: Props) {
  const days = lastSevenDays()
  const weekEntries = entries.filter((e) => e.date >= days[0].date)

  const average =
    weekEntries.length > 0
      ? (weekEntries.reduce((sum, e) => sum + e.mood, 0) / weekEntries.length).toFixed(1)
      : '–'

  // Average mood for each of the 7 days (0 = no entry that day)
  const chart = days.map((day) => {
    const dayEntries = entries.filter((e) => e.date === day.date)
    const mood =
      dayEntries.length > 0 ? dayEntries.reduce((sum, e) => sum + e.mood, 0) / dayEntries.length : 0
    return { ...day, mood }
  })

  return (
    <section class="card rise" style={{ animationDelay: '.06s' }}>
      <div class="card-title-row">
        <h2>This week</h2>
        <span class="muted small">
          {shortDate(days[0].date)} – {shortDate(days[6].date)}
        </span>
      </div>

      <div class="stats">
        <div class="stat">
          <div class="muted small">Entries</div>
          <div class="stat-value">{weekEntries.length}</div>
        </div>
        <div class="stat">
          <div class="muted small">Average mood</div>
          <div class="stat-value">
            {average} <span class="stat-unit">/ 5</span>
          </div>
        </div>
        <div class="stat">
          <div class="muted small">Streak</div>
          <div class="stat-value">
            {streak(entries)} <span class="stat-unit">days</span>
          </div>
        </div>
      </div>

      <div>
        <div class="label">Mood, day by day</div>
        <div class="chart">
          {chart.map((day, i) => (
            <div key={day.date} class="chart-col">
              <span class="chart-value">{day.mood ? day.mood.toFixed(1) : '–'}</span>
              <div
                class={`chart-bar grow-y ${i === 6 ? 'today' : ''}`}
                style={{
                  height: day.mood ? `${(day.mood / 5) * 75}%` : '4%',
                  animationDelay: `${0.25 + i * 0.06}s`,
                }}
              />
              <span class="muted small">{day.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// How many days in a row (ending today or yesterday) have at least one entry
function streak(entries: Entry[]): number {
  const dates = new Set(entries.map((e) => e.date))
  const day = new Date()
  // Today not logged yet? Start counting from yesterday.
  if (!dates.has(day.toLocaleDateString('en-CA'))) day.setDate(day.getDate() - 1)

  let count = 0
  while (dates.has(day.toLocaleDateString('en-CA'))) {
    count++
    day.setDate(day.getDate() - 1)
  }
  return count
}
