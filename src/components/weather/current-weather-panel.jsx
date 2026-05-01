import { MapPin, Calendar } from 'lucide-react'
import { formatLongDate } from '../../utils/formatters.js'

export function CurrentWeatherPanel({ weather, unit }) {
  const mainTemp = Math.round(unit === 'F' ? (weather.temp * 9) / 5 + 32 : weather.temp)

  return (
    <section className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl xl:min-h-[700px]">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="rounded-full bg-slate-800/50 p-4 ring-1 ring-slate-700/50">
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
            alt={weather.description}
            className="h-32 w-32 drop-shadow-lg"
          />
        </div>

        <div className="mt-8 flex items-start gap-1">
          <span className="text-8xl font-bold tracking-tighter text-slate-50 md:text-9xl">
            {mainTemp}
          </span>
          <span className="pt-4 text-4xl font-light text-slate-400 md:text-5xl">
            {String.fromCharCode(176)}{unit}
          </span>
        </div>

        <p className="mt-6 text-2xl font-medium tracking-tight text-slate-200 capitalize">
          {weather.description}
        </p>

        <div className="mt-8 h-px w-16 bg-slate-800" />

        <div className="mt-8 flex flex-col items-center gap-4 text-slate-400">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">Today</span>
            <span>&bull;</span>
            <span className="text-sm">{formatLongDate(weather.date)}</span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl bg-slate-800/50 px-4 py-2 ring-1 ring-slate-700/50">
            <MapPin className="h-4 w-4 text-slate-300" />
            <span className="text-sm font-medium text-slate-200">{weather.locationLabel}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
