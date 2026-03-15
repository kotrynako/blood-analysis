import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthWrapper } from '@/test/helpers/auth-wrapper'
import { LoginPage } from '@/pages/login-page'

describe('App routing', () => {
  it('should render login page', () => {
    render(
      <AuthWrapper initialEntries={['/login']}>
        <LoginPage />
      </AuthWrapper>,
    )
    expect(screen.getByText('Prisijungimas')).toBeInTheDocument()
  })
})
