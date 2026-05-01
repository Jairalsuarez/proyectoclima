import { Navigation } from 'lucide-react'
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
      <h2 className="text-xl font-semibold tracking-tight text-slate-200">Today&apos;s Highlights</h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <HighlightCard title="Wind Status" value={windParts[0]} suffix={windParts[1]}>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700/50 text-slate-300">
              <Navigation
                className="h-4 w-4"
                style={{ transform: `rotate(${weather.windDeg}deg)` }}
              />
            </span>
            <span className="font-medium">{weather.windDirection}</span>
          </div>
        </HighlightCard>

        <HighlightCard title="Humidity" value={weather.humidity} suffix="%">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-500">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-700/50">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{ width: `${humidityLevel}%` }}
              />
            </div>
            <p className="text-right text-xs font-medium text-slate-500">%</p>
          </div>
        </HighlightCard>

        <HighlightCard title="Visibility" value={visibilityParts[0]} suffix={visibilityParts[1]} />

        <HighlightCard title="Air Pressure" value={weather.pressure} suffix="mb">
          <p className="text-sm font-medium text-slate-400">
            Feels like <span className="text-slate-300">{formatTemperature(weather.feelsLike, unit)}</span>
          </p>
        </HighlightCard>
      </div>
    </section>
  )
}
