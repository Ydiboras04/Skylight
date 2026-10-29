// Date helpers. Dates are "YYYY-MM-DD" strings, in local time.

export function toDateString(date: Date): string {
  return date.toLocaleDateString('en-CA') // "2026-10-20"
}

export function today(): string {
  return toDateString(new Date())
}

// The last 7 days, oldest first, including today
export function lastSevenDays(): { date: string; label: string }[] {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push({ date: toDateString(d), label: d.toLocaleDateString('en-US', { weekday: 'short' }) })
  }
  return days
}

// "2026-10-20" → "Oct 20"
export function shortDate(date: string): string {
  return new Date(date + 'T00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// 1729425600 → "14:32" (empty for old entries saved without a time)
export function formatTime(createdAt: number): string {
  if (createdAt === 0) return ''
  return new Date(createdAt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night'

// The current hour (0–23) in the given IANA time zone; falls back to the browser's zone.
export function localHour(timezone: string): number {
  const text = new Date().toLocaleTimeString('en-GB', {
    timeZone: timezone || undefined,
    hour: '2-digit',
    hour12: false,
  })
  return parseInt(text, 10) % 24
}

// Maps the local hour to a theme. Night is dark mode.
export function timeOfDay(timezone: string): TimeOfDay {
  const h = localHour(timezone)
  if (h >= 5 && h < 11) return 'morning'
  if (h >= 11 && h < 17) return 'afternoon'
  if (h >= 17 && h < 20) return 'evening'
  return 'night'
}
