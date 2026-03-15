import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createElement } from 'react'
import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContext, type AuthContextValue } from '@/hooks/use-auth'
import { profileService } from '@/services/profile.service'

vi.mock('@/services/profile.service', () => ({
  profileService: {
    get: vi.fn(),
    update: vi.fn(),
  },
}))

const mockUser = {
  id: 'user-1',
  email: 'test@test.com',
  aud: 'authenticated',
  role: 'authenticated',
  app_metadata: {},
  user_metadata: {},
  created_at: '2024-01-01T00:00:00Z',
} as unknown as AuthContextValue['user']

const mockAuth: AuthContextValue = {
  session: null,
  user: mockUser,
  loading: false,
  signUp: vi.fn().mockResolvedValue({ error: null }),
  signIn: vi.fn().mockResolvedValue({ error: null }),
  signOut: vi.fn().mockResolvedValue({ error: null }),
  resetPassword: vi.fn().mockResolvedValue({ error: null }),
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(AuthContext.Provider, { value: mockAuth }, children),
    )
  }
}

describe('useProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches profile for the current user', async () => {
    const mockProfile = {
      id: 'user-1',
      gender: 'male',
      birth_year: 1990,
      created_at: '2024-01-01',
    }
    vi.mocked(profileService.get).mockResolvedValue(mockProfile as never)

    const { useProfile } = await import('./use-profile')
    const { result } = renderHook(() => useProfile(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockProfile)
    expect(profileService.get).toHaveBeenCalledWith('user-1')
  })

  it('does not fetch when user is null', async () => {
    const noUserAuth = { ...mockAuth, user: null }
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const wrapper = ({ children }: { children: ReactNode }) =>
      createElement(
        QueryClientProvider,
        { client: queryClient },
        createElement(AuthContext.Provider, { value: noUserAuth }, children),
      )

    const { useProfile } = await import('./use-profile')
    const { result } = renderHook(() => useProfile(), { wrapper })

    expect(result.current.fetchStatus).toBe('idle')
    expect(profileService.get).not.toHaveBeenCalled()
  })
})

describe('useUpdateProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls profileService.update with correct params', async () => {
    const updated = {
      id: 'user-1',
      gender: 'female',
      birth_year: 1995,
      created_at: '2024-01-01',
    }
    vi.mocked(profileService.update).mockResolvedValue(updated as never)

    const { useUpdateProfile } = await import('./use-profile')
    const { result } = renderHook(() => useUpdateProfile(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync({ gender: 'female', birth_year: 1995 })

    expect(profileService.update).toHaveBeenCalledWith('user-1', {
      gender: 'female',
      birth_year: 1995,
    })
  })
})
