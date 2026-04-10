import { useContext } from 'react'
import { WeatherContext } from '../contexts/weather-context-instance.js'

export function useWeather() {
  const context = useContext(WeatherContext)

  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider')
  }

  return context
}
