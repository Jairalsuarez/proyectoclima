import { formatTemperature } from '../../utils/formatters.js'

export function ForecastCard({ item, unit }) {
  return (
    <article className="group rounded-[1.75rem] border border-white/8 bg-white/[0.04] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition hover:-translate-y-1 hover:border-cyan-300/20 hover:bg-white/[0.07]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-white">{item.dayLabel}</p>
          <p className="mt-1 text-sm text-slate-400">{item.fullDate}</p>
        </div>
      </div>

      <img
        src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
        alt={item.description}
        className="mx-auto my-5 h-20 w-20 transition group-hover:scale-105"
      />

      <div className="flex items-center justify-center gap-3 text-sm">
        <span className="font-semibold text-white">{formatTemperature(item.max, unit)}</span>
        <span className="text-slate-400">{formatTemperature(item.min, unit)}</span>
      </div>
    </article>
  )
}
