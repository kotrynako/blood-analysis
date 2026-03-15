import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthWrapper } from '@/test/helpers/auth-wrapper'
import { createMockUser } from '@/test/helpers/create-mock-user'
import { ProfileForm } from './profile-form'

vi.mock('@/services/profile.service', () => ({
  profileService: {
    get: vi.fn(),
    update: vi.fn(),
  },
}))

import { profileService } from '@/services/profile.service'

function renderProfileForm(
  defaultValues?: { gender: 'male' | 'female' | null; birth_year: number | null },
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const mockUser = createMockUser()

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthWrapper authValue={{ user: mockUser }}>
        <ProfileForm defaultValues={defaultValues} />
      </AuthWrapper>
    </QueryClientProvider>,
  )
}

describe('ProfileForm', () => {
  it('renders gender select and birth year input', () => {
    renderProfileForm()
    expect(screen.getByLabelText('Lytis')).toBeInTheDocument()
    expect(screen.getByLabelText('Gimimo metai')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Išsaugoti' })).toBeInTheDocument()
  })

  it('renders with default values', () => {
    renderProfileForm({ gender: 'female', birth_year: 1990 })
    expect(screen.getByLabelText('Lytis')).toHaveValue('female')
    expect(screen.getByLabelText('Gimimo metai')).toHaveValue(1990)
  })

  it('renders with null default values', () => {
    renderProfileForm({ gender: null, birth_year: null })
    expect(screen.getByLabelText('Lytis')).toHaveValue('')
    expect(screen.getByLabelText('Gimimo metai')).toHaveValue(null)
  })

  it('shows gender options: Nepasirinkta, Vyras, Moteris', () => {
    renderProfileForm()
    const select = screen.getByLabelText('Lytis')
    const options = select.querySelectorAll('option')
    expect(options).toHaveLength(3)
    expect(options[0]).toHaveTextContent('Nepasirinkta')
    expect(options[1]).toHaveTextContent('Vyras')
    expect(options[2]).toHaveTextContent('Moteris')
  })

  it('calls profileService.update on valid submission', async () => {
    const user = userEvent.setup()
    vi.mocked(profileService.update).mockResolvedValue({
      id: 'test-user-id',
      gender: 'male',
      birth_year: 1990,
      created_at: '2024-01-01',
    })
    renderProfileForm({ gender: null, birth_year: null })

    await user.selectOptions(screen.getByLabelText('Lytis'), 'male')
    await user.type(screen.getByLabelText('Gimimo metai'), '1990')
    await user.click(screen.getByRole('button', { name: 'Išsaugoti' }))

    await waitFor(() => {
      expect(profileService.update).toHaveBeenCalledWith('test-user-id', {
        gender: 'male',
        birth_year: 1990,
      })
    })
  })

  it('shows success message after update', async () => {
    const user = userEvent.setup()
    vi.mocked(profileService.update).mockResolvedValue({
      id: 'test-user-id',
      gender: 'male',
      birth_year: 1990,
      created_at: '2024-01-01',
    })
    renderProfileForm({ gender: null, birth_year: null })

    await user.selectOptions(screen.getByLabelText('Lytis'), 'male')
    await user.type(screen.getByLabelText('Gimimo metai'), '1990')
    await user.click(screen.getByRole('button', { name: 'Išsaugoti' }))

    await waitFor(() => {
      expect(screen.getByText('Profilis atnaujintas sėkmingai')).toBeInTheDocument()
    })
  })

  it('shows error message when update fails', async () => {
    const user = userEvent.setup()
    vi.mocked(profileService.update).mockRejectedValue(new Error('fail'))
    renderProfileForm({ gender: null, birth_year: null })

    await user.selectOptions(screen.getByLabelText('Lytis'), 'male')
    await user.type(screen.getByLabelText('Gimimo metai'), '1990')
    await user.click(screen.getByRole('button', { name: 'Išsaugoti' }))

    await waitFor(() => {
      expect(
        screen.getByText('Nepavyko atnaujinti profilio. Bandykite dar kartą.'),
      ).toBeInTheDocument()
    })
  })
})
