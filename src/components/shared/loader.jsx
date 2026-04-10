export function Loader({ label = 'Loading weather...' }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-[2rem] border border-white/8 bg-white/5 p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="relative h-16 w-16">
        <span className="absolute inset-0 rounded-full border-4 border-white/10" />
        <span className="absolute inset-0 animate-spin rounded-full border-4 border-cyan-300 border-t-transparent" />
      </div>
      <div>
        <p className="text-lg font-semibold text-white">{label}</p>
        <p className="mt-1 text-sm text-slate-300">Preparing your live climate dashboard.</p>
      </div>
    </div>
  )
}
