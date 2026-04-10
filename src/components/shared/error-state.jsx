export function ErrorState({ title = 'Something went wrong', message, actionLabel, onAction }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-5 rounded-[2rem] border border-rose-300/15 bg-rose-400/10 p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-300/20 text-xl text-rose-100">
        !
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        <p className="max-w-md text-sm leading-6 text-rose-50/90">{message}</p>
      </div>
      {onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}
