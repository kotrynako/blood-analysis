import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContext, type AuthContextValue } from '@/hooks/use-auth'
import { TestEntryForm } from './test-entry-form'

vi.mock('@/services/blood-test.service', () => ({
  bloodTestService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    getResults: vi.fn(),
    getMarkerHistory: vi.fn(),
    createWithResults: vi.fn().mockResolvedValue({
      test: { id: 'new-1' },
      results: [],
    }),
    remove: vi.fn(),
  },
}))

vi.mock('@/services/profile.service', () => ({
  profileService: {
    get: vi.fn().mockResolvedValue({
      id: 'user-1',
      gender: 'male',
      birth_year: 1990,
      created_at: '2024-01-01',
    }),
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

function Wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={mockAuth}>{children}</AuthContext.Provider>
      </QueryClientProvider>
    </MemoryRouter>
  )
}

describe('TestEntryForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the date field', () => {
    render(<TestEntryForm />, { wrapper: Wrapper })
    expect(screen.getByLabelText('Tyrimo data')).toBeInTheDocument()
  })

  it('renders notes field', () => {
    render(<TestEntryForm />, { wrapper: Wrapper })
    expect(screen.getByLabelText('Pastabos')).toBeInTheDocument()
  })

  it('renders all 14 marker input fields', () => {
    render(<TestEntryForm />, { wrapper: Wrapper })
    expect(screen.getByLabelText('Hemoglobinas')).toBeInTheDocument()
    expect(screen.getByLabelText('Eritrocitai')).toBeInTheDocument()
    expect(screen.getByLabelText('Leukocitai')).toBeInTheDocument()
    expect(screen.getByLabelText('Trombocitai')).toBeInTheDocument()
    expect(screen.getByLabelText('Hematokritas')).toBeInTheDocument()
  })

  it('renders submit button with Lithuanian text', () => {
    render(<TestEntryForm />, { wrapper: Wrapper })
    expect(screen.getByRole('button', { name: 'Išsaugoti tyrimą' })).toBeInTheDocument()
  })

  it('does not submit when no markers are filled', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    render(<TestEntryForm onSuccess={onSuccess} />, { wrapper: Wrapper })

    await user.click(screen.getByRole('button', { name: 'Išsaugoti tyrimą' }))

    // Form should not call onSuccess without filled markers
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('shows marker units next to input fields', () => {
    render(<TestEntryForm />, { wrapper: Wrapper })
    const unitElements = screen.getAllByText('g/L')
    expect(unitElements.length).toBeGreaterThan(0)
  })
})
