import type { Country } from '../api'
import { MoonIcon, SunIcon } from '../icons'
import { Clock } from './Clock'
import { CountryPicker } from './CountryPicker'

type Props = {
  countries: Country[]
  selected: string
  onSelect: (code: string) => void
  isNight: boolean // night in the selected country → moon logo
  timezone: string // the selected country's time zone, for the clock
}

// Top bar: logo · country selection · today's date
export function Header({ countries, selected, onSelect, isNight, timezone }: Props) {
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
          <div class="muted small">Mood &amp; weather journal</div>
        </div>
      </div>

      <CountryPicker countries={countries} selected={selected} onSelect={onSelect} />

      <Clock timezone={timezone} />
    </header>
  )
}
