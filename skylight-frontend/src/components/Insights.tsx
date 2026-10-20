import type { Entry } from '../api'
import { CONDITION_COLORS, CONDITIONS, getCondition } from '../conditions'

type Props = {
  entries: Entry[]
}

// Average mood and number of entries for each kind of weather
export function Insights({ entries }: Props) {
  return (
    <div class="insights">
      {CONDITIONS.map((condition, i) => {
        const matching = entries.filter((e) => getCondition(e.weather) === condition)
        const average =
          matching.length > 0 ? matching.reduce((sum, e) => sum + e.mood, 0) / matching.length : 0

        return (
          <div key={condition} class="insight-row">
            <span class="insight-label">{condition}</span>
            <div class="bar-track">
              <div
                class="bar grow-x"
                style={{
                  width: `${(average / 5) * 100}%`,
                  background: CONDITION_COLORS[condition],
                  animationDelay: `${0.3 + i * 0.1}s`,
                }}
              />
            </div>
            <span class="muted small insight-value">
              <strong>{matching.length > 0 ? average.toFixed(1) : '–'}</strong> · {matching.length}×
            </span>
          </div>
        )
      })}
    </div>
  )
}
