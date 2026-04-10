export function HighlightCard({ title, value, suffix, children }) {
  return (
    <article className="rounded-[1.8rem] border border-white/8 bg-[#171c36]/92 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.2)] transition hover:-translate-y-1 hover:border-indigo-300/20">
      <p className="text-center text-sm text-slate-300">{title}</p>
      <div className="mt-5 text-center">
        <span className="text-5xl font-semibold text-white md:text-6xl">{value}</span>
        {suffix ? <span className="ml-2 text-2xl text-slate-300">{suffix}</span> : null}
      </div>
      {children ? <div className="mt-5">{children}</div> : null}
    </article>
  )
}
