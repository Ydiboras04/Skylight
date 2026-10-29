import { MoonIcon, PinIcon, SunIcon } from '../icons'
import { Clock } from './Clock'

type Props = {
  isNight: boolean // night where the user is → moon logo
  timezone: string // the user's time zone, for the clock and location label
}

// A readable place from an IANA zone: "Europe/Paris" → "Paris"
function placeFromZone(timezone: string): string {
  if (!timezone) return 'Locating…'
  return timezone.split('/').pop()?.replace(/_/g, ' ') ?? timezone
}

// Top bar: logo · your (fixed) location · local date & time
export function Header({ isNight, timezone }: Props) {
  return (
    <header class="header rise">
      <div class="brand">
        <div class={`brand-logo ${isNight ? 'night' : 'day'}`} title={isNight ? 'Night' : 'Day'}>
          {/* key: switching day/night replays the swap animation */}
          <span key={isNight ? 'night' : 'day'} class="logo-swap">
            {isNight ? <MoonIcon /> : <SunIcon class="spin" />}
          </span>
        </div>
        <div>
          <div class="brand-name">Skylight</div>
          <div class="muted small">Thoughts from around the world</div>
        </div>
      </div>

      <div class="location-pill" title="Your location is detected automatically">
        <PinIcon size={18} class="picker-pin" />
        <span>{placeFromZone(timezone)}</span>
      </div>

      <Clock timezone={timezone} />
    </header>
  )
}
