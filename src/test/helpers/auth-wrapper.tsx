import type { ReactNode } from 'react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext, type AuthContextValue } from '@/hooks/use-auth'

const defaultAuthValue: AuthContextValue = {
  session: null,
  user: null,
  loading: false,
  signUp: vi.fn().mockResolvedValue({ error: null }),
  signIn: vi.fn().mockResolvedValue({ error: null }),
  signOut: vi.fn().mockResolvedValue({ error: null }),
  resetPassword: vi.fn().mockResolvedValue({ error: null }),
}

interface AuthWrapperProps {
  children: ReactNode
  authValue?: Partial<AuthContextValue>
  initialEntries?: string[]
}

export function AuthWrapper({
  children,
  authValue = {},
  initialEntries = ['/'],
}: AuthWrapperProps) {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <AuthContext.Provider value={{ ...defaultAuthValue, ...authValue }}>
        {children}
      </AuthContext.Provider>
    </MemoryRouter>
  )
}

