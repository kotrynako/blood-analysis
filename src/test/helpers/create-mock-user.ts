import type { AuthContextValue } from '@/hooks/use-auth'

export function createMockUser() {
  return {
    id: 'test-user-id',
    email: 'test@example.com',
    aud: 'authenticated',
    role: 'authenticated',
    app_metadata: {},
    user_metadata: {},
    created_at: '2024-01-01T00:00:00Z',
  } as unknown as AuthContextValue['user']
}
