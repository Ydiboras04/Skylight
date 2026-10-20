import { useEffect, useState } from 'preact/hooks'
import { getRecommendations, getWeeklyReflection } from '../api'
import { lastSevenDays } from '../dates'
import { CloseIcon, SparkleIcon } from '../icons'

type Props = {
  countryCode: string
  countryName: string
}

type Tab = 'today' | 'week'

// Floating "Ask Skylight AI" button + the popup it opens
export function AiPanel({ countryCode, countryName }: Props) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('today')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // One answer per tab, so switching tabs keeps them
  const [answers, setAnswers] = useState({ today: '', week: '' })

  // A new country makes the old recommendations wrong: clear them
  useEffect(() => {
    setAnswers((a) => ({ ...a, today: '' }))
  }, [countryCode])

  function generate() {
    setLoading(true)
    setError('')
    const request =
      tab === 'today' ? getRecommendations(countryCode) : getWeeklyReflection(lastSevenDays()[0].date)

    request
      .then((text) => setAnswers((a) => ({ ...a, [tab]: text })))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  // Split the AI text into blocks: one per line for "today", one per paragraph for "week"
  const answer = answers[tab]
  const blocks = answer
    .split(tab === 'today' ? '\n' : /\n\s*\n/)
    .map((b) => b.trim())
    .filter((b) => b !== '')

  let buttonLabel = tab === 'today' ? 'Get recommendations' : 'Summarize my week'
  if (answer) buttonLabel = 'Regenerate'
  if (loading) buttonLabel = 'Thinking…'

  return (
    <>
      {open && (
        <div class="popup" role="dialog" aria-label="Skylight AI">
          <div class="popup-head">
            <div class="popup-title">
              <div class="popup-logo">
                <SparkleIcon size={20} />
              </div>
              <div>
                <div class="popup-name">Skylight AI</div>
                <div class="muted tiny">Powered by Gemini</div>
              </div>
            </div>
            <button type="button" class="icon-btn" aria-label="Close" onClick={() => setOpen(false)}>
              <CloseIcon size={20} />
            </button>
          </div>

          <div class="tabs" role="tablist">
            <button
              type="button"
              role="tab"
              class={`tab ${tab === 'today' ? 'on' : ''}`}
              aria-selected={tab === 'today'}
              onClick={() => setTab('today')}
            >
              For today
            </button>
            <button
              type="button"
              role="tab"
              class={`tab ${tab === 'week' ? 'on' : ''}`}
              aria-selected={tab === 'week'}
              onClick={() => setTab('week')}
            >
              Weekly reflection
            </button>
          </div>

          <div class="popup-body">
            <p class="muted small" style={{ margin: 0 }}>
              {tab === 'today'
                ? `Ideas based on the weather in ${countryName} and what lifts your mood.`
                : 'A summary of your last 7 days and how the weather played into them.'}
            </p>

            {loading && (
              <div class="loading-lines" aria-label="Loading">
                <div class="shimmer" style={{ width: '92%' }} />
                <div class="shimmer" style={{ width: '78%' }} />
                <div class="shimmer" style={{ width: '85%' }} />
                <div class="shimmer" style={{ width: '60%' }} />
              </div>
            )}

            {error && <p class="error">{error}</p>}

            {!loading &&
              blocks.map((block, i) => (
                <div key={`${tab}-${i}-${block.length}`} class="ai-block" style={{ animationDelay: `${i * 0.08}s` }}>
                  {block}
                </div>
              ))}

            <button type="button" class="btn" disabled={loading} onClick={generate}>
              <SparkleIcon size={18} />
              {buttonLabel}
            </button>
          </div>
        </div>
      )}

      <button type="button" class={`fab ${open ? 'open' : ''}`} aria-expanded={open} onClick={() => setOpen(!open)}>
        <SparkleIcon size={22} class="fab-icon" />
        {open ? 'Close AI' : 'Ask Skylight AI'}
      </button>
    </>
  )
}
