import { Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <Outlet />
    </div>
  )
}
