import type { ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'

interface PublicRouteProps {
  fallback?: ReactNode
}

export function PublicRoute({ fallback }: PublicRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-neutral-dark">Kraunama...</p>
      </div>
    )
  }

  if (user) {
    return <>{fallback ?? <Navigate to="/dashboard" replace />}</>
  }

  return <Outlet />
}
