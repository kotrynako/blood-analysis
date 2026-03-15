import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { ErrorBoundary } from '@/components/error-boundary'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { PublicRoute } from '@/components/auth/public-route'
import { LoginPage } from '@/pages/login-page'
import { RegisterPage } from '@/pages/register-page'
import { DashboardPage } from '@/pages/dashboard-page'
import { NewTestPage } from '@/pages/new-test-page'
import { TestDetailPage } from '@/pages/test-detail-page'
import { MarkerHistoryPage } from '@/pages/marker-history-page'
import { ProfilePage } from '@/pages/profile-page'
import { NotFoundPage } from '@/pages/not-found-page'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <PublicRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/test/new', element: <NewTestPage /> },
      { path: '/test/:id', element: <TestDetailPage /> },
      { path: '/marker/:key/history', element: <MarkerHistoryPage /> },
      { path: '/profile', element: <ProfilePage /> },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  )
}

export default App
