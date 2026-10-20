import type { Weather } from './api'

// A simple weather "condition" from the numbers Open-Meteo gives us

export type Condition = 'Sunny' | 'Cloudy' | 'Rainy'

export const CONDITIONS: Condition[] = ['Sunny', 'Cloudy', 'Rainy']

export const CONDITION_COLORS = { Sunny: '#F59E0B', Cloudy: '#64748B', Rainy: '#2563EB' }

export function getCondition(weather: Weather): Condition {
  if (weather.precipitation > 0) return 'Rainy'
  if (weather.cloud_cover >= 60) return 'Cloudy'
  return 'Sunny'
}
