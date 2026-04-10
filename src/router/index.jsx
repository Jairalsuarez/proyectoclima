import { Navigate, Route, Routes } from 'react-router-dom'
import { PrivateRoute } from '../components/shared/private-route.jsx'
import { AppLayout } from '../layouts/app-layout.jsx'
import { DashboardPage } from '../pages/dashboard-page.jsx'
import { NotFoundPage } from '../pages/not-found-page.jsx'
import { SetupPage } from '../pages/setup-page.jsx'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate replace to="/dashboard" />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
