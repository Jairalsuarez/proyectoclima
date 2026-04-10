import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-12 sm:px-6">
      <section className="w-full rounded-[2rem] border border-white/8 bg-white/[0.04] p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-10">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">404</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Page not found</h1>
        <p className="mt-4 text-slate-300">
          The route you are trying to open does not exist in this weather experience.
        </p>
        <Link
          to="/dashboard"
          className="mt-8 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200"
        >
          Go to dashboard
        </Link>
      </section>
    </main>
  )
}
