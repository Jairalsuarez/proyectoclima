import { cn } from '../../utils/formatters.js'

export function SearchPanel({
  isOpen,
  isLoading,
  error,
  query,
  results,
  onClose,
  onSearch,
  onQueryChange,
  onSelectCity,
}) {
  function handleSubmit(event) {
    event.preventDefault()
    onSearch(query)
  }

  const filteredResults = results.filter((city) => {
    const searchableText = [city.name, city.state, city.country]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return searchableText.includes(query.trim().toLowerCase())
  })

  return (
    <>
      <div
        className={cn(
          'pointer-events-none fixed inset-0 z-30 bg-slate-950/65 opacity-0 transition duration-300 lg:absolute lg:bg-slate-950/35',
          isOpen && 'pointer-events-auto opacity-100',
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          'pointer-events-none invisible fixed inset-y-0 left-0 z-40 flex w-full max-w-md -translate-x-[calc(100%+2.5rem)] flex-col bg-[#0f142e]/95 p-6 opacity-0 shadow-[0_20px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl transition duration-300 lg:absolute',
          isOpen && 'pointer-events-auto visible translate-x-0 opacity-100',
        )}
      >
        <div className="mb-7 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Search for places</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 p-3 text-white transition hover:bg-white/10"
            aria-label="Close search panel"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
              <path d="M18.3 5.71L12 12l6.3 6.29-1.41 1.41L10.59 13.4 4.29 19.7 2.88 18.29 9.17 12 2.88 5.71 4.29 4.3l6.3 6.29 6.29-6.3z" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-slate-400">
              <path d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
            </svg>
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search city"
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

        <div className="mt-6 flex-1 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-[72px] animate-pulse rounded-2xl border border-white/10 bg-white/5 p-5" />
              ))}
            </div>
          ) : null}

          {!isLoading && error ? (
            <div className="rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm text-amber-100">
              {error}
            </div>
          ) : null}

          {!isLoading && !error && query.trim().length < 2 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
              Type at least 2 characters to search places.
            </div>
          ) : null}

          {!isLoading && !error && query.trim().length >= 2 ? (
            <div className="space-y-3">
              {filteredResults.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => onSelectCity({ lat: city.lat, lon: city.lon })}
                  className="group flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-left transition hover:border-cyan-300/35 hover:bg-white/10"
                >
                  <div>
                    <p className="font-medium text-white">{city.name}</p>
                    <p className="mt-1 text-sm text-slate-300">
                      {[city.state, city.country].filter(Boolean).join(', ')}
                    </p>
                  </div>

                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-slate-400 transition group-hover:translate-x-1 group-hover:fill-white">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
                  </svg>
                </button>
              ))}

              {!filteredResults.length ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
                  No places match the current filter.
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </aside>
    </>
  )
}
