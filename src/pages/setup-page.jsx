import { Link } from 'react-router-dom'

export function SetupPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-12 sm:px-6">
      <section className="w-full rounded-[2rem] border border-white/8 bg-white/[0.04] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-10">
        <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100">
          Setup required
        </span>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white">Add your OpenWeather API key</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
          Create a local <code className="rounded bg-white/8 px-2 py-1 text-sm">.env</code> file and add
          <code className="ml-2 rounded bg-white/8 px-2 py-1 text-sm">VITE_OPENWEATHER_API_KEY=your_key_here</code>.
          Once the variable is available, the private dashboard route will unlock automatically.
        </p>

        <div className="mt-8 rounded-2xl border border-white/8 bg-slate-950/35 p-5">
          <p className="text-sm font-medium text-white">Recommended local file</p>
          <pre className="mt-3 overflow-auto rounded-xl bg-black/30 p-4 text-sm text-cyan-200">
{`VITE_OPENWEATHER_API_KEY=your_key_here`}
          </pre>
        </div>

        <Link
          to="/dashboard"
          className="mt-8 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200"
        >
          Retry dashboard
        </Link>
      </section>
    </main>
  )
}
