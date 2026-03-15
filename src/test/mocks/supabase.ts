import { vi } from 'vitest'

export const mockUnsubscribe = vi.fn()

export const mockSupabaseAuth = {
  getSession: vi.fn().mockResolvedValue({
    data: { session: null },
    error: null,
  }),
  onAuthStateChange: vi.fn().mockReturnValue({
    data: { subscription: { unsubscribe: mockUnsubscribe } },
  }),
  signUp: vi.fn().mockResolvedValue({ data: {}, error: null }),
  signInWithPassword: vi.fn().mockResolvedValue({ data: {}, error: null }),
  signOut: vi.fn().mockResolvedValue({ error: null }),
  resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
}

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: mockSupabaseAuth,
  },
}))
