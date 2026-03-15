import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthWrapper } from '@/test/helpers/auth-wrapper'
import { LoginForm } from './login-form'

function renderLoginForm(authOverrides = {}, onSuccess = vi.fn()) {
  return {
    onSuccess,
    ...render(
      <AuthWrapper authValue={authOverrides}>
        <LoginForm onSuccess={onSuccess} />
      </AuthWrapper>,
    ),
  }
}

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    renderLoginForm()
    expect(screen.getByLabelText('El. paštas')).toBeInTheDocument()
    expect(screen.getByLabelText('Slaptažodis')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Prisijungti' })).toBeInTheDocument()
  })

  it('shows validation error for empty email', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    await user.click(screen.getByRole('button', { name: 'Prisijungti' }))

    await waitFor(() => {
      expect(screen.getByText('Įveskite teisingą el. pašto adresą')).toBeInTheDocument()
    })
  })

  it('shows validation error for short password', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    await user.type(screen.getByLabelText('El. paštas'), 'test@test.com')
    await user.type(screen.getByLabelText('Slaptažodis'), '123')
    await user.click(screen.getByRole('button', { name: 'Prisijungti' }))

    await waitFor(() => {
      expect(screen.getByText('Slaptažodis turi būti bent 6 simbolių')).toBeInTheDocument()
    })
  })

  it('calls signIn and onSuccess on valid submission', async () => {
    const user = userEvent.setup()
    const mockSignIn = vi.fn().mockResolvedValue({ error: null })
    const onSuccess = vi.fn()
    renderLoginForm({ signIn: mockSignIn }, onSuccess)

    await user.type(screen.getByLabelText('El. paštas'), 'test@test.com')
    await user.type(screen.getByLabelText('Slaptažodis'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Prisijungti' }))

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@test.com', 'password123')
      expect(onSuccess).toHaveBeenCalledOnce()
    })
  })

  it('shows server error when signIn fails', async () => {
    const user = userEvent.setup()
    const mockSignIn = vi.fn().mockResolvedValue({
      error: { message: 'Invalid credentials' },
    })
    renderLoginForm({ signIn: mockSignIn })

    await user.type(screen.getByLabelText('El. paštas'), 'test@test.com')
    await user.type(screen.getByLabelText('Slaptažodis'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Prisijungti' }))

    await waitFor(() => {
      expect(screen.getByText('Neteisingas el. paštas arba slaptažodis')).toBeInTheDocument()
    })
  })

  it('disables button while submitting', async () => {
    const user = userEvent.setup()
    let resolveSignIn: (value: { error: null }) => void
    const mockSignIn = vi.fn().mockImplementation(
      () => new Promise((resolve) => { resolveSignIn = resolve }),
    )
    renderLoginForm({ signIn: mockSignIn })

    await user.type(screen.getByLabelText('El. paštas'), 'test@test.com')
    await user.type(screen.getByLabelText('Slaptažodis'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Prisijungti' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Jungiamasi...' })).toBeDisabled()
    })

    resolveSignIn!({ error: null })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Prisijungti' })).toBeEnabled()
    })
  })
})
