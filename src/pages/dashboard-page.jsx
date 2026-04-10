import { useDeferredValue, useEffect, useState } from 'react'
import { ErrorState } from '../components/shared/error-state.jsx'
import { Loader } from '../components/shared/loader.jsx'
import { CurrentWeatherPanel } from '../components/weather/current-weather-panel.jsx'
import { ForecastCard } from '../components/weather/forecast-card.jsx'
import { HighlightsGrid } from '../components/weather/highlights-grid.jsx'
import { SearchPanel } from '../components/weather/search-panel.jsx'
import { useWeather } from '../hooks/useWeather.js'
import { cn } from '../utils/formatters.js'

export function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const deferredSearchQuery = useDeferredValue(searchQuery)
  const {
    error,
    loading,
    searchError,
    searchPanelOpen,
    searchResults,
    searching,
    unit,
    weather,
    closeSearchPanel,
    openSearchPanel,
    refreshByCurrentLocation,
    searchCitiesByQuery,
    selectCity,
    setUnit,
  } = useWeather()

  useEffect(() => {
    if (deferredSearchQuery.trim().length < 2) {
      return
    }

    searchCitiesByQuery(deferredSearchQuery)
  }, [deferredSearchQuery, searchCitiesByQuery])

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
          actionLabel="Try current location again"
          onAction={refreshByCurrentLocation}
        />
      </main>
    )
  }

  return (
    <main className="relative mx-auto w-full max-w-[1540px] px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="grid min-h-[calc(100vh-3rem)] gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
        <div className="relative">
          <SearchPanel
            isOpen={searchPanelOpen}
            isLoading={searching}
            error={searchError}
            query={searchQuery}
            results={searchResults}
            onClose={closeSearchPanel}
            onSearch={searchCitiesByQuery}
            onQueryChange={setSearchQuery}
            onSelectCity={selectCity}
          />

          <CurrentWeatherPanel
            weather={weather.current}
            unit={unit}
            onOpenSearch={openSearchPanel}
            onRefreshLocation={refreshByCurrentLocation}
          />
        </div>

        <section className="rounded-[2rem] border border-white/6 bg-[#090d1d]/75 p-6 shadow-[0_26px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">Live forecast</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Climate overview for {weather.current.city}
              </h1>
            </div>

            <div className="flex w-full flex-col gap-3 xl:w-auto xl:min-w-[420px]">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-slate-400">
                  <path d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
                </svg>
                <input
                  value={searchQuery}
                  onFocus={openSearchPanel}
                  onChange={(event) => {
                    setSearchQuery(event.target.value)
                    if (!searchPanelOpen) {
                      openSearchPanel()
                    }
                  }}
                  placeholder="Search places and filter results"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
                />
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
            Built with React, Vite, TailwindCSS and OpenWeather.
          </footer>
        </section>
      </div>
    </main>
  )
}
