import { useEffect, useState } from 'react'
import { Search, ChevronRight } from 'lucide-react'
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

        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">
          {warning ? (
            <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              {warning}
            </div>
          ) : null}

          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-slate-400">Live forecast</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
                Overview for {weather.current.city}
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
                  <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950/50 px-4 py-3 transition-colors focus-within:border-slate-500">
                    <Search className="h-5 w-5 text-slate-400" />
                    <input
                      value={searchQuery}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => {
                        window.setTimeout(() => setSearchFocused(false), 150)
                      }}
                      onChange={(event) => {
                        setSearchQuery(event.target.value)
                      }}
                      placeholder="Search places..."
                      className="w-full bg-transparent text-sm text-slate-50 outline-none placeholder:text-slate-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="rounded-2xl bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 active:scale-95"
                  >
                    Search
                  </button>
                </form>

                {showSearchDropdown ? (
                  <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-30 rounded-2xl border border-slate-700 bg-slate-900 p-3 shadow-2xl">
                    {searching ? (
                      <div className="space-y-2">
                        {[1, 2, 3].map((item) => (
                          <div key={item} className="h-16 animate-pulse rounded-xl bg-slate-800" />
                        ))}
                      </div>
                    ) : null}

                    {!searching && searchError ? (
                      <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200">
                        {searchError}
                      </div>
                    ) : null}

                    {!searching && !searchError ? (
                      <div className="max-h-[340px] space-y-2 overflow-y-auto pr-1">
                        {searchResults.map((city) => (
                          <button
                            key={city.id}
                            type="button"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => handleSelectCity(city)}
                            className="flex w-full items-center justify-between rounded-xl p-4 text-left transition hover:bg-slate-800"
                          >
                            <div>
                              <p className="font-medium text-slate-50">{city.name}</p>
                              <p className="mt-1 text-xs text-slate-400">
                                {[city.state, city.country].filter(Boolean).join(', ')}
                              </p>
                            </div>

                            <ChevronRight className="h-5 w-5 text-slate-500" />
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="flex items-center gap-2 self-start xl:self-end bg-slate-800/50 p-1 rounded-full border border-slate-700/50">
                {['C', 'F'].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setUnit(value)}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition',
                      unit === value
                        ? 'bg-slate-50 text-slate-900 shadow'
                        : 'text-slate-400 hover:text-slate-200',
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

          <footer className="mt-10 text-center text-sm text-slate-500">
            Powered by OpenWeather.
          </footer>
        </section>
      </div>
    </main>
  )
}
