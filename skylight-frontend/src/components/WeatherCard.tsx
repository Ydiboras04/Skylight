import type { Weather } from '../api'

type Props = {
  weather: Weather
}

export function WeatherCard({ weather }: Props) {
  return (
    <div class="card">
      <p class="temperature">{weather.temperature_2m} °C</p>
      <p>{weather.is_day === 1 ? 'Day' : 'Night'}</p>
      <p>Wind: {weather.wind_speed_10m} km/h</p>
      <p>Clouds: {weather.cloud_cover} %</p>
      <p>Rain: {weather.precipitation} mm</p>
    </div>
  )
}
