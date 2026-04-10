import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const WEATHER_BASE_URL = 'https://api.openweathermap.org'
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

export async function searchCities(query) {
  const data = await request('/geo/1.0/direct', {
    q: query,
    limit: 6,
  })

  return data.map((city) => ({
    id: `${city.lat}-${city.lon}`,
    name: city.name,
    state: city.state,
    country: city.country,
    lat: city.lat,
    lon: city.lon,
  }))
}

export async function getWeatherByCoords(lat, lon) {
  const [current, forecast] = await Promise.all([
    request('/data/2.5/weather', { lat, lon }),
    request('/data/2.5/forecast', { lat, lon }),
  ])

  return {
    current,
    forecast,
  }
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
