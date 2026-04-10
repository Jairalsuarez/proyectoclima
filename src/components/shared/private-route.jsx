import { Navigate } from 'react-router-dom'
import { useWeather } from '../../hooks/useWeather.js'

export function PrivateRoute({ children }) {
  const { hasApiKey } = useWeather()

  if (!hasApiKey) {
    return <Navigate replace to="/setup" />
  }

  return children
}
