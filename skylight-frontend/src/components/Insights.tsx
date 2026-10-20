import type { Entry } from '../api'
import { CONDITIONS, getCondition } from '../conditions'
import { MOODS } from '../moods'

type Props = {
  entries: Entry[]
}

export function Insights({ entries }: Props) {
  if (entries.length === 0) {
    return <p>Save a few days to see your patterns here.</p>
  }

  const overallMood = average(entries.map((e) => e.mood))

  return (
    <div class="card">
      <p>
        {entries.length} entries · average mood {MOODS[Math.round(overallMood) - 1].emoji}{' '}
        {overallMood.toFixed(1)} / 5
      </p>

      <table class="insights">
        <thead>
          <tr>
            <th>Weather</th>
            <th>Entries</th>
            <th>Average mood</th>
          </tr>
        </thead>
        <tbody>
          {CONDITIONS.map((condition) => {
            const matching = entries.filter((e) => getCondition(e.weather) === condition)
            const mood = average(matching.map((e) => e.mood))

            return (
              <tr key={condition}>
                <td>{condition}</td>
                <td>{matching.length}</td>
                <td>
                  {matching.length === 0 ? (
                    '-'
                  ) : (
                    <div class="bar-row">
                      <div class="bar" style={{ width: `${(mood / 5) * 100}%` }} />
                      <span>{mood.toFixed(1)}</span>
                    </div>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function average(numbers: number[]): number {
  if (numbers.length === 0) return 0
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length
}
