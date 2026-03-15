import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import { AuthWrapper } from '@/test/helpers/auth-wrapper'
import { createMockUser } from '@/test/helpers/create-mock-user'
import { PublicRoute } from '@/components/auth/public-route'
import { LoginPage } from '@/pages/login-page'

vi.mock('@/services/ocr.service', () => ({
  ocrService: { extractMarkers: vi.fn() },
}))

vi.mock('@/services/ai-insights.service', () => ({
  aiInsightsService: { isAvailable: vi.fn().mockReturnValue(false), generate: vi.fn() },
}))

import { LandingPage } from '@/pages/landing-page'

describe('App routing', () => {
  it('should render login page', () => {
    render(
      <AuthWrapper initialEntries={['/login']}>
        <LoginPage />
      </AuthWrapper>,
    )
    expect(screen.getByText('Prisijungimas')).toBeInTheDocument()
  })

  it('should render landing page for anonymous user at /', () => {
    render(
      <AuthWrapper initialEntries={['/']}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route index element={<LandingPage />} />
          </Route>
        </Routes>
      </AuthWrapper>,
    )
    expect(screen.getByText(/Jūsų sveikatos duomenys/)).toBeInTheDocument()
  })

  it('should redirect authenticated user from / to /dashboard', () => {
    const mockUser = createMockUser()
    render(
      <AuthWrapper
        initialEntries={['/']}
        authValue={{ user: mockUser, loading: false }}
      >
        <Routes>
          <Route
            element={<PublicRoute fallback={<p>Redirected to dashboard</p>} />}
          >
            <Route index element={<LandingPage />} />
          </Route>
        </Routes>
      </AuthWrapper>,
    )
    expect(screen.queryByText(/Jūsų sveikatos duomenys/)).not.toBeInTheDocument()
    expect(screen.getByText('Redirected to dashboard')).toBeInTheDocument()
  })

  it('should show landing page with static demo for anonymous user', () => {
    render(
      <AuthWrapper initialEntries={['/']}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route index element={<LandingPage />} />
          </Route>
        </Routes>
      </AuthWrapper>,
    )
    expect(screen.getByText('Naujausi rezultatai')).toBeInTheDocument()
    expect(screen.getByText('Hemoglobinas')).toBeInTheDocument()
  })

  it('should render login page for anonymous user at /login', () => {
    render(
      <AuthWrapper initialEntries={['/login']}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
        </Routes>
      </AuthWrapper>,
    )
    expect(screen.getByText('Prisijungimas')).toBeInTheDocument()
  })
})
