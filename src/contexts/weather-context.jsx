import { startTransition, useEffect, useState } from 'react'
import { getIpLocation } from '../services/ip-location.service.js'
import {
  getWeatherByCity,
  getWeatherByCoords,
  hasWeatherApiKey,
  searchCities,
} from '../services/open-weather.service.js'
import { WeatherContext } from './weather-context-instance.js'
import { mapWeatherPayload } from '../utils/weather.js'

const DEFAULT_CITY = 'Guayaquil'

export function WeatherProvider({ children }) {
  const [unit, setUnit] = useState('C')
  const [weather, setWeather] = useState(null)
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [error, setError] = useState('')
  const [searchError, setSearchError] = useState('')
  const [searchPanelOpen, setSearchPanelOpen] = useState(false)

  async function hydrateWeather(request) {
    setLoading(true)
    setError('')

    try {
      const payload = 'city' in request
        ? await getWeatherByCity(request.city)
        : await getWeatherByCoords(request.lat, request.lon)

      setWeather(mapWeatherPayload(payload, location))
      startTransition(() => setSearchPanelOpen(false))
    } catch (requestError) {
      setError(requestError.message || 'Unable to load weather data.')
    } finally {
      setLoading(false)
    }
  }

  async function loadInitialWeather() {
    if (!hasWeatherApiKey) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    try {
      const ipLocation = await getIpLocation()
      setLocation(ipLocation)

      const payload = await getWeatherByCoords(ipLocation.lat, ipLocation.lon)
      setWeather(mapWeatherPayload(payload, ipLocation))
    } catch {
      try {
        const fallbackPayload = await getWeatherByCity(DEFAULT_CITY)
        setWeather(mapWeatherPayload(fallbackPayload, { city: DEFAULT_CITY }))
      } catch (fallbackError) {
        setError(fallbackError.message || 'Unable to load the default city.')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleSearch(query) {
    if (!query.trim()) {
      setSearchResults([])
      setSearchError('Type a city to search.')
      return
    }

    setSearching(true)
    setSearchError('')

    try {
      const results = await searchCities(query.trim())
      setSearchResults(results)

      if (!results.length) {
        setSearchError('No matching cities were found.')
      }
    } catch (searchRequestError) {
      setSearchError(searchRequestError.message || 'Unable to search cities right now.')
    } finally {
      setSearching(false)
    }
  }

  async function refreshByCurrentLocation() {
    try {
      const ipLocation = await getIpLocation()
      setLocation(ipLocation)
      await hydrateWeather({ lat: ipLocation.lat, lon: ipLocation.lon })
    } catch (requestError) {
      setError(requestError.message || 'Unable to refresh your location.')
    }
  }

  useEffect(() => {
    loadInitialWeather()
  }, [])

  const value = {
    error,
    hasApiKey: hasWeatherApiKey,
    loading,
    location,
    searchError,
    searchPanelOpen,
    searchResults,
    searching,
    unit,
    weather,
    closeSearchPanel: () => setSearchPanelOpen(false),
    openSearchPanel: () => setSearchPanelOpen(true),
    refreshByCurrentLocation,
    searchCitiesByQuery: handleSearch,
    selectCity: hydrateWeather,
    setUnit,
  }

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
}
