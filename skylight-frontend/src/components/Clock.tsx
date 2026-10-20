import { useEffect, useState } from 'preact/hooks'

type Props = {
  timezone: string // e.g. "Asia/Tokyo"; empty = the user's own time zone
}

// The date and the live time in the selected country's time zone
export function Clock({ timezone }: Props) {
  const [now, setNow] = useState(new Date())

  // Update every second so the minutes change on time
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // undefined → the browser's own time zone
  const timeZone = timezone || undefined

  const date = now.toLocaleDateString('en-US', {
    timeZone,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const time = now.toLocaleTimeString('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
  })

  // "GMT+9", "GMT+3"…
  const zone =
    now
      .toLocaleTimeString('en-US', { timeZone, timeZoneName: 'short' })
      .split(' ')
      .pop() ?? ''

  return (
    <div class="clock">
      <div class="clock-date">{date}</div>
      <div class="clock-time">
        <span key={time} class="clock-digits">
          {time}
        </span>
        <span class="muted small">{zone}</span>
      </div>
    </div>
  )
}
