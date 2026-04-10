const WEEKDAY_FORMATTER = new Intl.DateTimeFormat('en-US', { weekday: 'short' })
const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
})

export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function toFahrenheit(value) {
  return (value * 9) / 5 + 32
}

export function toMilesPerHour(value) {
  return value * 2.23694
}

export function toMiles(value) {
  return value * 0.621371
}

export function formatTemperature(value, unit = 'C', digits = 0) {
  const normalized = unit === 'F' ? toFahrenheit(value) : value
  return `${normalized.toFixed(digits)}${String.fromCharCode(176)}${unit}`
}

export function formatWind(value, unit = 'C') {
  const normalized = unit === 'F' ? toMilesPerHour(value) : value
  const suffix = unit === 'F' ? 'mph' : 'm/s'
  return `${normalized.toFixed(1)} ${suffix}`
}

export function formatVisibility(valueInMeters, unit = 'C') {
  const valueInKm = valueInMeters / 1000
  const normalized = unit === 'F' ? toMiles(valueInKm) : valueInKm
  const suffix = unit === 'F' ? 'mi' : 'km'
  return `${normalized.toFixed(1)} ${suffix}`
}

export function formatDayLabel(date, index) {
  if (index === 0) {
    return 'Tomorrow'
  }

  return WEEKDAY_FORMATTER.format(date)
}

export function formatLongDate(date) {
  return DATE_FORMATTER.format(date)
}

export function formatLocation(city, region, country) {
  return [city, region, country].filter(Boolean).join(', ')
}

export function capitalizeWords(value = '') {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase())
}
