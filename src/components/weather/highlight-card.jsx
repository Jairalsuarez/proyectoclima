export function HighlightCard({ title, value, suffix, children }) {
  return (
    <article className="rounded-3xl border border-slate-700/50 bg-slate-800/20 p-6 transition-colors hover:bg-slate-800/40">
      <p className="text-sm font-medium text-slate-400">{title}</p>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-5xl font-semibold tracking-tight text-slate-50 md:text-6xl">{value}</span>
        {suffix ? <span className="text-2xl font-medium text-slate-500">{suffix}</span> : null}
      </div>
      {children ? <div className="mt-6">{children}</div> : null}
    </article>
  )
}
