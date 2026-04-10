import { formatLongDate } from '../../utils/formatters.js'

function LocationPinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z" />
    </svg>
  )
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M12 8a4 4 0 100 8 4 4 0 000-8zm9-1h-2.07A7.971 7.971 0 0017 5.07V3h-2v2.07A7.971 7.971 0 0013 3V1h-2v2.07A7.971 7.971 0 009.07 5H7v2.07A7.971 7.971 0 005.07 9H3v2h2.07A7.971 7.971 0 003 13v2h2.07A7.971 7.971 0 007 17v2h2v-2.07A7.971 7.971 0 0011 21v2h2v-2.07A7.971 7.971 0 0015 19v2h2v-2.07A7.971 7.971 0 0019 15H21v-2h-2.07A7.971 7.971 0 0021 11V9zm-9 10a6 6 0 110-12 6 6 0 010 12z" />
    </svg>
  )
}

export function CurrentWeatherPanel({ weather, unit, onOpenSearch, onRefreshLocation }) {
  const mainTemp = Math.round(unit === 'F' ? (weather.temp * 9) / 5 + 32 : weather.temp)

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-gradient-to-b from-[#1d2240] via-[#161b34] to-[#12162d] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] lg:min-h-[820px]">
      <div className="absolute -left-8 top-[4.5rem] h-28 w-28 rounded-full bg-white/6 blur-sm" />
      <div className="absolute right-[-40px] top-28 h-24 w-24 rounded-full bg-white/5 blur-sm" />
      <div className="absolute -bottom-4 left-0 h-36 w-36 rounded-full bg-white/6 blur-sm" />
      <div className="absolute right-6 bottom-40 h-16 w-16 rounded-full bg-white/5 blur-sm" />

      <div className="relative z-10 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onOpenSearch}
          className="rounded-2xl bg-white/14 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-white/20"
        >
          Search for Places
        </button>

        <button
          type="button"
          onClick={onRefreshLocation}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/14 text-white transition hover:-translate-y-0.5 hover:bg-white/20"
          aria-label="Use current location"
        >
          <TargetIcon />
        </button>
      </div>

      <div className="relative z-10 mt-10 flex flex-col items-center text-center">
        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
          alt={weather.description}
          className="h-[168px] w-[168px] drop-shadow-[0_30px_40px_rgba(0,0,0,0.35)]"
        />

        <div className="mt-7 flex items-start gap-2">
          <span className="text-7xl font-semibold text-white md:text-8xl">{mainTemp}</span>
          <span className="pt-3 text-4xl font-light text-slate-300">
            {String.fromCharCode(176)}
            {unit}
          </span>
        </div>

        <p className="mt-8 text-3xl font-semibold tracking-tight text-slate-200">
          {weather.description}
        </p>

        <div className="mt-8 flex items-center gap-3 text-sm text-slate-300">
          <span>Today</span>
          <span className="text-slate-500">.</span>
          <span>{formatLongDate(weather.date)}</span>
        </div>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-slate-200">
          <LocationPinIcon />
          <span>{weather.locationLabel}</span>
        </div>
      </div>
    </section>
  )
}
