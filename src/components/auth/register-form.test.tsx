import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthWrapper } from '@/test/helpers/auth-wrapper'
import { RegisterForm } from './register-form'

function renderRegisterForm(authOverrides = {}, onSuccess = vi.fn()) {
  return {
    onSuccess,
    ...render(
      <AuthWrapper authValue={authOverrides}>
        <RegisterForm onSuccess={onSuccess} />
      </AuthWrapper>,
    ),
  }
}

describe('RegisterForm', () => {
  it('renders email, password, and confirm password fields', () => {
    renderRegisterForm()
    expect(screen.getByLabelText('El. paštas')).toBeInTheDocument()
    expect(screen.getByLabelText('Slaptažodis')).toBeInTheDocument()
    expect(screen.getByLabelText('Pakartokite slaptažodį')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Registruotis' })).toBeInTheDocument()
  })

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup()
    renderRegisterForm()

    await user.click(screen.getByRole('button', { name: 'Registruotis' }))

    await waitFor(() => {
      expect(screen.getByText('Įveskite teisingą el. pašto adresą')).toBeInTheDocument()
    })
  })

  it('shows validation error for short password', async () => {
    const user = userEvent.setup()
    renderRegisterForm()

    await user.type(screen.getByLabelText('El. paštas'), 'test@test.com')
    await user.type(screen.getByLabelText('Slaptažodis'), '123')
    await user.type(screen.getByLabelText('Pakartokite slaptažodį'), '123')
    await user.click(screen.getByRole('button', { name: 'Registruotis' }))

    await waitFor(() => {
      expect(screen.getByText('Slaptažodis turi būti bent 6 simbolių')).toBeInTheDocument()
    })
  })

  it('shows error when passwords do not match', async () => {
    const user = userEvent.setup()
    renderRegisterForm()

    await user.type(screen.getByLabelText('El. paštas'), 'test@test.com')
    await user.type(screen.getByLabelText('Slaptažodis'), 'password123')
    await user.type(screen.getByLabelText('Pakartokite slaptažodį'), 'different')
    await user.click(screen.getByRole('button', { name: 'Registruotis' }))

    await waitFor(() => {
      expect(screen.getByText('Slaptažodžiai nesutampa')).toBeInTheDocument()
    })
  })

  it('calls signUp and onSuccess on valid submission', async () => {
    const user = userEvent.setup()
    const mockSignUp = vi.fn().mockResolvedValue({ error: null })
    const onSuccess = vi.fn()
    renderRegisterForm({ signUp: mockSignUp }, onSuccess)

    await user.type(screen.getByLabelText('El. paštas'), 'test@test.com')
    await user.type(screen.getByLabelText('Slaptažodis'), 'password123')
    await user.type(screen.getByLabelText('Pakartokite slaptažodį'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Registruotis' }))

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('test@test.com', 'password123')
      expect(onSuccess).toHaveBeenCalledOnce()
    })
  })

  it('shows server error when signUp fails', async () => {
    const user = userEvent.setup()
    const mockSignUp = vi.fn().mockResolvedValue({
      error: { message: 'User already exists' },
    })
    renderRegisterForm({ signUp: mockSignUp })

    await user.type(screen.getByLabelText('El. paštas'), 'test@test.com')
    await user.type(screen.getByLabelText('Slaptažodis'), 'password123')
    await user.type(screen.getByLabelText('Pakartokite slaptažodį'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Registruotis' }))

    await waitFor(() => {
      expect(
        screen.getByText('Registracija nepavyko. Bandykite kitą el. pašto adresą.'),
      ).toBeInTheDocument()
    })
  })

  it('disables button while submitting', async () => {
    const user = userEvent.setup()
    let resolveSignUp: (value: { error: null }) => void
    const mockSignUp = vi.fn().mockImplementation(
      () => new Promise((resolve) => { resolveSignUp = resolve }),
    )
    renderRegisterForm({ signUp: mockSignUp })

    await user.type(screen.getByLabelText('El. paštas'), 'test@test.com')
    await user.type(screen.getByLabelText('Slaptažodis'), 'password123')
    await user.type(screen.getByLabelText('Pakartokite slaptažodį'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Registruotis' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Registruojama...' })).toBeDisabled()
    })

    resolveSignUp!({ error: null })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Registruotis' })).toBeEnabled()
    })
  })
})
