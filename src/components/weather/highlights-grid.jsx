import {
  formatTemperature,
  formatVisibility,
  formatWind,
} from '../../utils/formatters.js'
import { HighlightCard } from './highlight-card.jsx'

export function HighlightsGrid({ weather, unit }) {
  const humidityLevel = Math.min(weather.humidity, 100)
  const windParts = formatWind(weather.windSpeed, unit).split(' ')
  const visibilityParts = formatVisibility(weather.visibility, unit).split(' ')

  return (
    <section className="mt-10">
      <h2 className="text-3xl font-semibold tracking-tight text-white">Today&apos;s Highlights</h2>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <HighlightCard title="Wind status" value={windParts[0]} suffix={windParts[1]}>
          <div className="flex items-center justify-center gap-3 text-sm text-slate-300">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-white"
                style={{ transform: `rotate(${weather.windDeg}deg)` }}
              >
                <path d="M12 2l7 18-7-4-7 4z" />
              </svg>
            </span>
            <span>{weather.windDirection}</span>
          </div>
        </HighlightCard>

        <HighlightCard title="Humidity" value={weather.humidity} suffix="%">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-400">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-300 via-yellow-300 to-cyan-300"
                style={{ width: `${humidityLevel}%` }}
              />
            </div>
            <p className="text-right text-xs font-semibold text-slate-400">%</p>
          </div>
        </HighlightCard>

        <HighlightCard title="Visibility" value={visibilityParts[0]} suffix={visibilityParts[1]} />

        <HighlightCard title="Air Pressure" value={weather.pressure} suffix="mb">
          <p className="text-center text-sm text-slate-400">
            Feels like {formatTemperature(weather.feelsLike, unit)}
          </p>
        </HighlightCard>
      </div>
    </section>
  )
}
