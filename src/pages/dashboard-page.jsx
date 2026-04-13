import { useEffect, useState } from 'react'
import { ErrorState } from '../components/shared/error-state.jsx'
import { Loader } from '../components/shared/loader.jsx'
import { CurrentWeatherPanel } from '../components/weather/current-weather-panel.jsx'
import { ForecastCard } from '../components/weather/forecast-card.jsx'
import { HighlightsGrid } from '../components/weather/highlights-grid.jsx'
import { useWeather } from '../hooks/useWeather.js'
import { cn } from '../utils/formatters.js'

export function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const {
    error,
    loading,
    resetSearch,
    searchError,
    searchResults,
    searching,
    unit,
    warning,
    weather,
    refreshWeather,
    searchCitiesByQuery,
    selectCity,
    setUnit,
  } = useWeather()

  useEffect(() => {
    const trimmedQuery = searchQuery.trim()

    if (trimmedQuery.length < 2) {
      resetSearch()
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      searchCitiesByQuery(trimmedQuery)
    }, 450)

    return () => window.clearTimeout(timeoutId)
  }, [resetSearch, searchCitiesByQuery, searchQuery])

  const showSearchDropdown =
    searchFocused && (searchQuery.trim().length >= 2 || searching || Boolean(searchError))

  async function handleSelectCity(city) {
    setSearchQuery(city.name)
    setSearchFocused(false)
    await selectCity(city)
  }

  if (loading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-[1540px] items-center px-4 py-8 sm:px-6 lg:px-8">
        <Loader />
      </main>
    )
  }

  if (error || !weather) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-[1540px] items-center px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState
          title="Unable to load weather data"
          message={error || 'The weather information is not available right now.'}
          actionLabel="Try refreshing again"
          onAction={refreshWeather}
        />
      </main>
    )
  }

  return (
    <main className="relative mx-auto w-full max-w-[1540px] px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="grid min-h-[calc(100vh-3rem)] gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
        <div>
          <CurrentWeatherPanel
            weather={weather.current}
            unit={unit}
          />
        </div>

        <section className="rounded-[2rem] border border-white/6 bg-[#090d1d]/75 p-6 shadow-[0_26px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-8">
          {warning ? (
            <div className="mb-6 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
              {warning}
            </div>
          ) : null}

          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">Live forecast</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Climate overview for {weather.current.city}
              </h1>
            </div>

            <div className="flex w-full flex-col gap-3 xl:w-auto xl:min-w-[420px]">
              <div className="relative">
                <form
                  onSubmit={(event) => {
                    event.preventDefault()
                    searchCitiesByQuery(searchQuery)
                    setSearchFocused(true)
                  }}
                  className="flex items-center gap-3"
                >
                  <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-slate-400">
                      <path d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
                    </svg>
                    <input
                      value={searchQuery}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => {
                        window.setTimeout(() => setSearchFocused(false), 150)
                      }}
                      onChange={(event) => {
                        setSearchQuery(event.target.value)
                      }}
                      placeholder="Search places in real time"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="rounded-2xl bg-gradient-to-r from-indigo-400 to-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
                  >
                    Search
                  </button>
                </form>

                {showSearchDropdown ? (
                  <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-30 rounded-[1.5rem] border border-white/10 bg-[#141935] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                    {searching ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((item) => (
                          <div key={item} className="h-[72px] animate-pulse rounded-2xl border border-white/10 bg-white/5 p-5" />
                        ))}
                      </div>
                    ) : null}

                    {!searching && searchError ? (
                      <div className="rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm text-amber-100">
                        {searchError}
                      </div>
                    ) : null}

                    {!searching && !searchError ? (
                      <div className="max-h-[340px] space-y-3 overflow-y-auto pr-1">
                        {searchResults.map((city) => (
                          <button
                            key={city.id}
                            type="button"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => handleSelectCity(city)}
                            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-left transition hover:border-cyan-300/35 hover:bg-white/10"
                          >
                            <div>
                              <p className="font-medium text-white">{city.name}</p>
                              <p className="mt-1 text-sm text-slate-300">
                                {[city.state, city.country].filter(Boolean).join(', ')}
                              </p>
                            </div>

                            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-slate-400">
                              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="flex items-center gap-3 self-start xl:self-end">
                {['C', 'F'].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setUnit(value)}
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-full border text-lg font-semibold transition',
                      unit === value
                        ? 'border-white bg-white text-slate-950'
                        : 'border-white/10 bg-white/5 text-white hover:bg-white/10',
                    )}
                  >
                    {String.fromCharCode(176)}
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {weather.forecast.map((item) => (
              <ForecastCard key={item.id} item={item} unit={unit} />
            ))}
          </div>

          <HighlightsGrid weather={weather.current} unit={unit} />

          <footer className="mt-10 text-center text-sm text-slate-400">
            Powered by OpenWeather.
          </footer>
        </section>
      </div>
    </main>
  )
}
