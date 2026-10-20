import type { Weather } from '../api'
import { getCondition } from '../conditions'
import { CloudIcon, RainIcon, SunIcon } from '../icons'

type Props = {
  countryName: string
  weather: Weather | null // null while loading
}

// Top right: the live weather (dark card)
export function WeatherCard({ countryName, weather }: Props) {
  return (
    <section class="card weather-card rise" style={{ animationDelay: '.12s' }}>
      <div class="card-title-row">
        <h2>Weather now</h2>
        <span class="small weather-muted">
          {countryName}
          {weather && (weather.is_day === 1 ? ' · Day' : ' · Night')}
        </span>
      </div>

      {weather ? <WeatherDetails weather={weather} /> : <WeatherLoading />}
    </section>
  )
}

function WeatherDetails({ weather }: { weather: Weather }) {
  const condition = getCondition(weather)

  return (
    // key: changing the values replays the fade-in animation
    <div key={weather.temperature_2m} class="fade-swap weather-body">
      <div class="weather-main">
        <div>
          <div class="temperature">
            {Math.round(weather.temperature_2m)}
            <span class="temperature-unit">°C</span>
          </div>
          <div class="condition">{condition}</div>
        </div>
        <div class="weather-icon">
          {condition === 'Sunny' && <SunIcon size={120} class="spin thin" />}
          {condition === 'Cloudy' && <CloudIcon size={120} class="drift thin cloud" />}
          {condition === 'Rainy' && <RainIcon size={120} class="drift thin rain" />}
        </div>
      </div>

      <div class="weather-stats">
        <div class="weather-stat">
          <div class="small weather-muted">Wind</div>
          <div class="weather-stat-value">
            {weather.wind_speed_10m} <span class="weather-unit">km/h</span>
          </div>
        </div>
        <div class="weather-stat">
          <div class="small weather-muted">Clouds</div>
          <div class="weather-stat-value">
            {weather.cloud_cover} <span class="weather-unit">%</span>
          </div>
        </div>
        <div class="weather-stat">
          <div class="small weather-muted">Rain</div>
          <div class="weather-stat-value">
            {weather.precipitation} <span class="weather-unit">mm</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function WeatherLoading() {
  return (
    <div class="weather-body" aria-label="Loading weather">
      <div class="shimmer dark" style={{ width: '40%', height: '72px' }} />
      <div class="shimmer dark" style={{ width: '25%' }} />
      <div class="shimmer dark" style={{ width: '100%', height: '64px' }} />
    </div>
  )
}
