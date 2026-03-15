import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext, type AuthContextValue } from '@/hooks/use-auth'
import { savePendingResults, clearPendingResults } from '@/hooks/use-pending-results'

vi.mock('@/services/blood-test.service', () => ({
  bloodTestService: {
    createWithResults: vi.fn(),
    updateAiSummary: vi.fn(),
  },
}))

import { bloodTestService } from '@/services/blood-test.service'
import { useAutoSavePending } from './use-auto-save-pending'

const mockBloodTestService = vi.mocked(bloodTestService)

const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  aud: 'authenticated',
  role: 'authenticated',
  app_metadata: {},
  user_metadata: {},
  created_at: '2024-01-01T00:00:00Z',
} as unknown as AuthContextValue['user']

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

function createWrapper(user: AuthContextValue['user'] | null) {
  const authValue: AuthContextValue = {
    session: null,
    user,
    loading: false,
    signUp: vi.fn().mockResolvedValue({ error: null }),
    signIn: vi.fn().mockResolvedValue({ error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    resetPassword: vi.fn().mockResolvedValue({ error: null }),
  }

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter>
        <AuthContext.Provider value={authValue}>
          {children}
        </AuthContext.Provider>
      </MemoryRouter>
    )
  }
}

describe('useAutoSavePending', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  it('should do nothing when no user', () => {
    renderHook(() => useAutoSavePending(), {
      wrapper: createWrapper(null),
    })
    expect(mockBloodTestService.createWithResults).not.toHaveBeenCalled()
  })

  it('should do nothing when no pending results', () => {
    renderHook(() => useAutoSavePending(), {
      wrapper: createWrapper(mockUser),
    })
    expect(mockBloodTestService.createWithResults).not.toHaveBeenCalled()
  })

  it('should save pending results after auth', async () => {
    savePendingResults(
      [{ marker_key: 'hemoglobin' as const, value: 140, unit: 'g/L' }],
      'AI summary',
    )

    mockBloodTestService.createWithResults.mockResolvedValue({
      test: { id: 'new-test-id' } as any,
      results: [],
    })
    mockBloodTestService.updateAiSummary.mockResolvedValue(undefined)

    renderHook(() => useAutoSavePending(), {
      wrapper: createWrapper(mockUser),
    })

    await vi.waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/test/new-test-id', { replace: true })
    })

    expect(mockBloodTestService.createWithResults).toHaveBeenCalledOnce()
    expect(mockBloodTestService.updateAiSummary).toHaveBeenCalledWith(
      'new-test-id',
      'AI summary',
    )
    expect(sessionStorage.getItem('pending_anonymous_results')).toBeNull()
  })

  it('should skip updateAiSummary when no AI summary', async () => {
    savePendingResults(
      [{ marker_key: 'hemoglobin' as const, value: 140, unit: 'g/L' }],
      null,
    )

    mockBloodTestService.createWithResults.mockResolvedValue({
      test: { id: 'new-test-id' } as any,
      results: [],
    })

    renderHook(() => useAutoSavePending(), {
      wrapper: createWrapper(mockUser),
    })

    await vi.waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/test/new-test-id', { replace: true })
    })

    expect(mockBloodTestService.updateAiSummary).not.toHaveBeenCalled()
  })

  it('should redirect to dashboard on save error', async () => {
    savePendingResults(
      [{ marker_key: 'hemoglobin' as const, value: 140, unit: 'g/L' }],
      null,
    )

    mockBloodTestService.createWithResults.mockRejectedValue(new Error('DB error'))

    renderHook(() => useAutoSavePending(), {
      wrapper: createWrapper(mockUser),
    })

    await vi.waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true })
    })

    expect(sessionStorage.getItem('pending_anonymous_results')).toBeNull()
  })
})
