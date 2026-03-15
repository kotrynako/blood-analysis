import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useAutoSavePending } from '@/hooks/use-auto-save-pending'
import { Header } from '@/components/layout/header'
import { LoadingScreen } from '@/components/ui/spinner'

export function ProtectedRoute() {
  const { user, loading } = useAuth()
  useAutoSavePending()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingScreen />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-neutral-light/30">
      <Header />
      <Outlet />
    </div>
  )
}
