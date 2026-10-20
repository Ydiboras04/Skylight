import type { Weather } from './api'

// A simple weather "condition" from the numbers Open-Meteo gives us

export const CONDITIONS = ['☀️ Sunny', '☁️ Cloudy', '🌧️ Rainy']

export function getCondition(weather: Weather): string {
  if (weather.precipitation > 0) return '🌧️ Rainy'
  if (weather.cloud_cover >= 60) return '☁️ Cloudy'
  return '☀️ Sunny'
}
