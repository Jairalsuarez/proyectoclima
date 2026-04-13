import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const WEATHER_BASE_URL = 'https://api.openweathermap.org'
const SEARCH_CACHE = new Map()
const WEATHER_CACHE = new Map()
const WEATHER_CACHE_TTL = 10 * 60 * 1000
const DEFAULT_PARAMS = {
  appid: API_KEY,
  units: 'metric',
  lang: 'en',
}

const weatherClient = axios.create({
  baseURL: WEATHER_BASE_URL,
})

export const hasWeatherApiKey = Boolean(API_KEY)

async function request(url, params) {
  const response = await weatherClient.get(url, {
    params: {
      ...DEFAULT_PARAMS,
      ...params,
    },
  })

  return response.data
}

function getWeatherCacheKey(lat, lon) {
  return `${Number(lat).toFixed(3)}:${Number(lon).toFixed(3)}`
}

export async function searchCities(query) {
  const normalizedQuery = query.trim().toLowerCase()

  if (SEARCH_CACHE.has(normalizedQuery)) {
    return SEARCH_CACHE.get(normalizedQuery)
  }

  const data = await request('/geo/1.0/direct', {
    q: normalizedQuery,
    limit: 6,
  })

  const results = data.map((city) => ({
    id: `${city.lat}-${city.lon}`,
    name: city.name,
    state: city.state,
    country: city.country,
    lat: city.lat,
    lon: city.lon,
  }))

  SEARCH_CACHE.set(normalizedQuery, results)

  return results
}

export async function getWeatherByCoords(lat, lon) {
  const cacheKey = getWeatherCacheKey(lat, lon)
  const cachedWeather = WEATHER_CACHE.get(cacheKey)

  if (cachedWeather && Date.now() - cachedWeather.timestamp < WEATHER_CACHE_TTL) {
    return cachedWeather.data
  }

  const [current, forecast] = await Promise.all([
    request('/data/2.5/weather', { lat, lon }),
    request('/data/2.5/forecast', { lat, lon }),
  ])

  const payload = {
    current,
    forecast,
  }

  WEATHER_CACHE.set(cacheKey, {
    data: payload,
    timestamp: Date.now(),
  })

  return payload
}

export async function getWeatherByCity(cityName) {
  const [city] = await searchCities(cityName)

  if (!city) {
    throw new Error('No results found for that city.')
  }

  const weather = await getWeatherByCoords(city.lat, city.lon)

  return {
    ...weather,
    searchedCity: city,
  }
}
