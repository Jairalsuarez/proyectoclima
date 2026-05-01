import { formatTemperature } from '../../utils/formatters.js'

export function ForecastCard({ item, unit }) {
  return (
    <article className="group flex flex-col items-center justify-between rounded-2xl border border-slate-700/50 bg-slate-800/20 p-5 transition-all hover:bg-slate-800/50">
      <div className="text-center">
        <p className="font-medium text-slate-200">{item.dayLabel}</p>
        <p className="mt-1 text-xs text-slate-500">{item.fullDate}</p>
      </div>

      <img
        src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
        alt={item.description}
        className="my-3 h-16 w-16 drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
      />

      <div className="flex items-center gap-3 text-sm">
        <span className="font-semibold text-slate-50">{formatTemperature(item.max, unit)}</span>
        <span className="font-medium text-slate-400">{formatTemperature(item.min, unit)}</span>
      </div>
    </article>
  )
}
