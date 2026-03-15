import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { createElement } from 'react'
import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContext, type AuthContextValue } from '@/hooks/use-auth'
import { bloodTestService } from '@/services/blood-test.service'
import { aiInsightsService } from '@/services/ai-insights.service'

vi.mock('@/services/blood-test.service', () => ({
  bloodTestService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    getResults: vi.fn(),
    getMarkerHistory: vi.fn(),
    createWithResults: vi.fn(),
    remove: vi.fn(),
    updateAiSummary: vi.fn(),
  },
}))

vi.mock('@/services/ai-insights.service', () => ({
  aiInsightsService: {
    isAvailable: vi.fn().mockReturnValue(true),
    generate: vi.fn(),
  },
}))

vi.mock('@/hooks/use-profile', () => ({
  useProfile: () => ({
    data: { id: 'user-1', gender: 'male', birth_year: 1990, created_at: '2024-01-01' },
    isSuccess: true,
  }),
}))

vi.mock('@/utils/blood-test.utils', () => ({
  toMarkerResult: vi.fn((r: { marker_key: string; value: number; unit: string }) => ({
    key: r.marker_key,
    value: r.value,
    unit: r.unit,
    status: 'normal',
    referenceMin: 0,
    referenceMax: 999,
  })),
  toMarkerResults: vi.fn(),
  calculateSummary: vi.fn(),
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

const mockResults = [
  { id: 'r1', test_id: 't1', marker_key: 'hemoglobin', value: 150, unit: 'g/L', created_at: '' },
]

describe('useAiInsights', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(aiInsightsService.isAvailable).mockReturnValue(true)
  })

  it('returns cached summary without calling generate', async () => {
    const { useAiInsights } = await import('./use-ai-insights')
    const { result } = renderHook(
      () =>
        useAiInsights({
          testId: 't1',
          cachedSummary: 'Cached AI summary',
          currentResults: mockResults,
          previousResults: null,
        }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.summary).toBe('Cached AI summary'))
    expect(aiInsightsService.generate).not.toHaveBeenCalled()
  })

  it('generates and caches summary when no cache exists', async () => {
    vi.mocked(aiInsightsService.generate).mockResolvedValue('New AI summary')
    vi.mocked(bloodTestService.updateAiSummary).mockResolvedValue(undefined)

    const { useAiInsights } = await import('./use-ai-insights')
    const { result } = renderHook(
      () =>
        useAiInsights({
          testId: 't1',
          cachedSummary: null,
          currentResults: mockResults,
          previousResults: null,
        }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.summary).toBe('New AI summary'))
    expect(aiInsightsService.generate).toHaveBeenCalledOnce()
    expect(bloodTestService.updateAiSummary).toHaveBeenCalledWith('t1', 'New AI summary')
  })

  it('exposes error when generate fails', async () => {
    vi.mocked(aiInsightsService.generate).mockRejectedValue(new Error('API klaida'))

    const { useAiInsights } = await import('./use-ai-insights')
    const { result } = renderHook(
      () =>
        useAiInsights({
          testId: 't1',
          cachedSummary: null,
          currentResults: mockResults,
          previousResults: null,
        }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.error).toBeTruthy())
    expect(result.current.error?.message).toBe('API klaida')
  })

  it('returns available=false when service is not available', async () => {
    vi.mocked(aiInsightsService.isAvailable).mockReturnValue(false)

    const { useAiInsights } = await import('./use-ai-insights')
    const { result } = renderHook(
      () =>
        useAiInsights({
          testId: 't1',
          cachedSummary: null,
          currentResults: mockResults,
          previousResults: null,
        }),
      { wrapper: createWrapper() },
    )

    expect(result.current.available).toBe(false)
    expect(result.current.summary).toBeNull()
  })

  it('regenerate generates new summary and updates cache', async () => {
    vi.mocked(aiInsightsService.generate).mockResolvedValue('Regenerated summary')
    vi.mocked(bloodTestService.updateAiSummary).mockResolvedValue(undefined)

    const { useAiInsights } = await import('./use-ai-insights')
    const { result } = renderHook(
      () =>
        useAiInsights({
          testId: 't1',
          cachedSummary: 'Old cached',
          currentResults: mockResults,
          previousResults: null,
        }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.summary).toBe('Old cached'))

    await act(async () => {
      await result.current.regenerate()
    })

    expect(result.current.summary).toBe('Regenerated summary')
    expect(bloodTestService.updateAiSummary).toHaveBeenCalledWith('t1', 'Regenerated summary')
  })
})
