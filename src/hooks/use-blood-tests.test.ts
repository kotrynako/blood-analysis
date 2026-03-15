import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createElement } from 'react'
import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContext, type AuthContextValue } from '@/hooks/use-auth'
import { bloodTestService } from '@/services/blood-test.service'

vi.mock('@/services/blood-test.service', () => ({
  bloodTestService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    getResults: vi.fn(),
    getMarkerHistory: vi.fn(),
    createWithResults: vi.fn(),
    remove: vi.fn(),
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

describe('useBloodTests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches all blood tests for the current user', async () => {
    const mockTests = [
      { id: '1', test_date: '2024-01-01' },
      { id: '2', test_date: '2024-02-01' },
    ]
    vi.mocked(bloodTestService.getAll).mockResolvedValue(mockTests as never)

    const { useBloodTests } = await import('./use-blood-tests')
    const { result } = renderHook(() => useBloodTests(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockTests)
    expect(bloodTestService.getAll).toHaveBeenCalledWith('user-1')
  })
})

describe('useBloodTest', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches a single blood test by id', async () => {
    const mockTest = { id: 'test-1', test_date: '2024-01-01' }
    vi.mocked(bloodTestService.getById).mockResolvedValue(mockTest as never)

    const { useBloodTest } = await import('./use-blood-tests')
    const { result } = renderHook(() => useBloodTest('test-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockTest)
    expect(bloodTestService.getById).toHaveBeenCalledWith('test-1')
  })
})

describe('useBloodTestResults', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches results for a test', async () => {
    const mockResults = [
      { id: 'r1', marker_key: 'hemoglobin', value: 140, unit: 'g/L' },
    ]
    vi.mocked(bloodTestService.getResults).mockResolvedValue(mockResults as never)

    const { useBloodTestResults } = await import('./use-blood-tests')
    const { result } = renderHook(() => useBloodTestResults('test-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockResults)
    expect(bloodTestService.getResults).toHaveBeenCalledWith('test-1')
  })
})

describe('useMarkerHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches marker history for the user', async () => {
    const mockHistory = [
      { id: 'r1', marker_key: 'hemoglobin', value: 140, test_date: '2024-01-01' },
      { id: 'r2', marker_key: 'hemoglobin', value: 145, test_date: '2024-02-01' },
    ]
    vi.mocked(bloodTestService.getMarkerHistory).mockResolvedValue(mockHistory as never)

    const { useMarkerHistory } = await import('./use-blood-tests')
    const { result } = renderHook(() => useMarkerHistory('hemoglobin'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockHistory)
    expect(bloodTestService.getMarkerHistory).toHaveBeenCalledWith('user-1', 'hemoglobin')
  })
})
