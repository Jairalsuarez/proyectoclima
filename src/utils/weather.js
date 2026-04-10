import {
  capitalizeWords,
  formatDayLabel,
  formatLongDate,
  formatLocation,
} from './formatters.js'

function directionFromDegrees(degrees = 0) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

function selectDailyEntries(list = []) {
  const grouped = new Map()

  list.forEach((entry) => {
    const [dateKey, time] = entry.dt_txt.split(' ')
    const hour = Number(time.slice(0, 2))

    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, entry)
      return
    }

    const currentEntry = grouped.get(dateKey)
    const currentHour = Number(currentEntry.dt_txt.split(' ')[1].slice(0, 2))

    if (Math.abs(hour - 12) < Math.abs(currentHour - 12)) {
      grouped.set(dateKey, entry)
    }
  })

  return Array.from(grouped.values()).slice(1, 6)
}

export function mapWeatherPayload(payload, fallbackLocation) {
  const { current, forecast, searchedCity } = payload
  const forecastEntries = selectDailyEntries(forecast.list)
  const location = searchedCity ?? fallbackLocation
  const currentWeather = current.weather?.[0] ?? {}

  return {
    current: {
      city: current.name,
      country: current.sys?.country,
      region: location?.state ?? location?.region,
      date: new Date(current.dt * 1000),
      description: capitalizeWords(currentWeather.description ?? 'Unknown'),
      icon: currentWeather.icon,
      temp: current.main?.temp ?? 0,
      feelsLike: current.main?.feels_like ?? 0,
      humidity: current.main?.humidity ?? 0,
      pressure: current.main?.pressure ?? 0,
      visibility: current.visibility ?? 0,
      windSpeed: current.wind?.speed ?? 0,
      windDeg: current.wind?.deg ?? 0,
      windDirection: directionFromDegrees(current.wind?.deg),
      locationLabel: formatLocation(current.name, location?.state ?? location?.region, current.sys?.country),
    },
    forecast: forecastEntries.map((entry, index) => ({
      id: entry.dt,
      date: new Date(entry.dt * 1000),
      dayLabel: formatDayLabel(new Date(entry.dt * 1000), index),
      fullDate: formatLongDate(new Date(entry.dt * 1000)),
      icon: entry.weather?.[0]?.icon,
      description: capitalizeWords(entry.weather?.[0]?.description ?? 'Forecast'),
      max: entry.main?.temp_max ?? 0,
      min: entry.main?.temp_min ?? 0,
    })),
    location,
  }
}
