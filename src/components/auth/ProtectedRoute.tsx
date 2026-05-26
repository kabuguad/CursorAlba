import { Navigate } from 'react-router-dom'
import { useAuth, type UserRole } from '../../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  role: UserRole
}

export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== role) return <Navigate to={`/dashboard/${user.role}`} replace />

  return <>{children}</>
}
