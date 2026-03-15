import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { mockSupabaseAuth, mockUnsubscribe } from '@/test/mocks/supabase'
import { useAuthProvider, useAuth } from './use-auth'

describe('useAuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabaseAuth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    })
    mockSupabaseAuth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    })
  })

  it('starts with loading true and no user', () => {
    const { result } = renderHook(() => useAuthProvider())
    expect(result.current.loading).toBe(true)
    expect(result.current.user).toBeNull()
    expect(result.current.session).toBeNull()
  })

  it('sets loading to false after getSession resolves', async () => {
    const { result } = renderHook(() => useAuthProvider())
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })

  it('sets user and session from getSession', async () => {
    const mockSession = {
      user: { id: 'user-1', email: 'test@test.com' },
      access_token: 'token',
    }
    mockSupabaseAuth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    })

    const { result } = renderHook(() => useAuthProvider())
    await waitFor(() => {
      expect(result.current.user).toEqual(mockSession.user)
      expect(result.current.session).toEqual(mockSession)
    })
  })

  it('subscribes to auth state changes and cleans up', () => {
    const { unmount } = renderHook(() => useAuthProvider())
    expect(mockSupabaseAuth.onAuthStateChange).toHaveBeenCalledOnce()

    unmount()
    expect(mockUnsubscribe).toHaveBeenCalledOnce()
  })

  it('signUp calls supabase.auth.signUp', async () => {
    const { result } = renderHook(() => useAuthProvider())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.signUp('test@test.com', 'password123')
    })

    expect(mockSupabaseAuth.signUp).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password123',
    })
  })

  it('signIn calls supabase.auth.signInWithPassword', async () => {
    const { result } = renderHook(() => useAuthProvider())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.signIn('test@test.com', 'password123')
    })

    expect(mockSupabaseAuth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password123',
    })
  })

  it('signOut calls supabase.auth.signOut', async () => {
    const { result } = renderHook(() => useAuthProvider())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.signOut()
    })

    expect(mockSupabaseAuth.signOut).toHaveBeenCalledOnce()
  })

  it('resetPassword calls supabase.auth.resetPasswordForEmail', async () => {
    const { result } = renderHook(() => useAuthProvider())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.resetPassword('test@test.com')
    })

    expect(mockSupabaseAuth.resetPasswordForEmail).toHaveBeenCalledWith(
      'test@test.com',
    )
  })

  it('returns error from signIn when auth fails', async () => {
    const mockError = { message: 'Invalid credentials', status: 401 }
    mockSupabaseAuth.signInWithPassword.mockResolvedValue({
      data: {},
      error: mockError,
    })

    const { result } = renderHook(() => useAuthProvider())
    await waitFor(() => expect(result.current.loading).toBe(false))

    let response: { error: unknown }
    await act(async () => {
      response = await result.current.signIn('bad@test.com', 'wrong')
    })

    expect(response!.error).toEqual(mockError)
  })
})

describe('useAuth', () => {
  it('throws when used outside AuthProvider', () => {
    expect(() => {
      renderHook(() => useAuth())
    }).toThrow('useAuth must be used within an AuthProvider')
  })
})
