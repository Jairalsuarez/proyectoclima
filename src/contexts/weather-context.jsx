import { useCallback, useEffect, useRef, useState } from 'react'
import { getIpLocation } from '../services/ip-location.service.js'
import {
  getWeatherByCity,
  getWeatherByCoords,
  hasWeatherApiKey,
  searchCities,
} from '../services/open-weather.service.js'
import { mapWeatherPayload } from '../utils/weather.js'
import { WeatherContext } from './weather-context-instance.js'

const DEFAULT_CITY = 'Guayaquil'
const WEATHER_STORAGE_KEY = 'weather-dashboard:last-weather'

function normalizeWeatherError(requestError, fallbackMessage) {
  if (requestError?.response?.status === 429) {
    return 'OpenWeather reached its request limit. Wait a moment and try again.'
  }

  return requestError?.message || fallbackMessage
}

function restoreStoredWeather() {
  if (typeof window === 'undefined') {
    return null
  }

  const storedWeather = window.localStorage.getItem(WEATHER_STORAGE_KEY)

  if (!storedWeather) {
    return null
  }

  try {
    const parsedWeather = JSON.parse(storedWeather)

    return {
      ...parsedWeather,
      current: {
        ...parsedWeather.current,
        date: new Date(parsedWeather.current.date),
      },
      forecast: parsedWeather.forecast.map((entry) => ({
        ...entry,
        date: new Date(entry.date),
      })),
    }
  } catch {
    window.localStorage.removeItem(WEATHER_STORAGE_KEY)
    return null
  }
}

function persistWeather(weather) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(WEATHER_STORAGE_KEY, JSON.stringify(weather))
}

export function WeatherProvider({ children }) {
  const [unit, setUnit] = useState('C')
  const [weather, setWeather] = useState(() => restoreStoredWeather())
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [error, setError] = useState('')
  const [warning, setWarning] = useState('')
  const [searchError, setSearchError] = useState('')
  const searchRequestId = useRef(0)
  const weatherRef = useRef(weather)

  useEffect(() => {
    weatherRef.current = weather
  }, [weather])

  function storeWeather(nextWeather) {
    setWeather(nextWeather)
    persistWeather(nextWeather)
  }

  const handleWeatherFailure = useCallback((requestError, fallbackMessage) => {
    const normalizedError = normalizeWeatherError(requestError, fallbackMessage)

    if (weatherRef.current) {
      setWarning(normalizedError)
      return
    }

    setError(normalizedError)
  }, [])

  async function hydrateWeather(request) {
    setLoading(true)
    setError('')
    setWarning('')

    const isCoordinatesRequest = request && typeof request === 'object' && 'lat' in request && 'lon' in request
    const locationPayload = isCoordinatesRequest ? request : location

    try {
      const payload = isCoordinatesRequest
        ? await getWeatherByCoords(request.lat, request.lon)
        : await getWeatherByCity(request.city)

      const nextWeather = mapWeatherPayload(payload, locationPayload)
      storeWeather(nextWeather)

      if (isCoordinatesRequest) {
        setLocation(request)
      }

      setSearchResults([])
      setSearchError('')
    } catch (requestError) {
      handleWeatherFailure(requestError, 'Unable to load weather data.')
    } finally {
      setLoading(false)
    }
  }

  const loadInitialWeather = useCallback(async () => {
    if (!hasWeatherApiKey) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    setWarning('')

    try {
      const ipLocation = await getIpLocation()
      setLocation(ipLocation)

      const payload = await getWeatherByCoords(ipLocation.lat, ipLocation.lon)
      storeWeather(mapWeatherPayload(payload, ipLocation))
    } catch {
      try {
        const fallbackPayload = await getWeatherByCity(DEFAULT_CITY)
        storeWeather(mapWeatherPayload(fallbackPayload, { city: DEFAULT_CITY }))
      } catch (fallbackError) {
        handleWeatherFailure(fallbackError, 'Unable to load the default city.')
      }
    } finally {
      setLoading(false)
    }
  }, [handleWeatherFailure])

  const handleSearch = useCallback(async (query) => {
    const normalizedQuery = query.trim()

    if (normalizedQuery.length < 2) {
      setSearchResults([])
      setSearchError('')
      setSearching(false)
      return
    }

    const currentRequestId = searchRequestId.current + 1
    searchRequestId.current = currentRequestId
    setSearching(true)
    setSearchError('')

    try {
      const results = await searchCities(normalizedQuery)

      if (searchRequestId.current !== currentRequestId) {
        return
      }

      setSearchResults(results)

      if (!results.length) {
        setSearchError('No matching cities were found.')
      }
    } catch (searchRequestError) {
      if (searchRequestId.current !== currentRequestId) {
        return
      }

      setSearchError(
        normalizeWeatherError(searchRequestError, 'Unable to search cities right now.'),
      )
    } finally {
      if (searchRequestId.current === currentRequestId) {
        setSearching(false)
      }
    }
  }, [])

  const resetSearch = useCallback(() => {
    searchRequestId.current += 1
    setSearching(false)
    setSearchResults([])
    setSearchError('')
  }, [])

  async function refreshWeather() {
    setWarning('')
    setRefreshing(true)

    try {
      if (location?.lat && location?.lon) {
        const payload = await getWeatherByCoords(location.lat, location.lon)
        storeWeather(mapWeatherPayload(payload, location))
      } else {
        const ipLocation = await getIpLocation()
        setLocation(ipLocation)

        const payload = await getWeatherByCoords(ipLocation.lat, ipLocation.lon)
        storeWeather(mapWeatherPayload(payload, ipLocation))
      }
    } catch (requestError) {
      handleWeatherFailure(requestError, 'Unable to refresh weather data.')
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadInitialWeather()
  }, [loadInitialWeather])

  const value = {
    error,
    hasApiKey: hasWeatherApiKey,
    loading,
    location,
    refreshing,
    resetSearch,
    searchError,
    searchResults,
    searching,
    unit,
    warning,
    weather,
    refreshWeather,
    searchCitiesByQuery: handleSearch,
    selectCity: hydrateWeather,
    setUnit,
  }

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
}
