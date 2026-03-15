import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthWrapper } from '@/test/helpers/auth-wrapper'
import { ResetPasswordForm } from './reset-password-form'

function renderResetForm(authOverrides = {}, onSuccess = vi.fn()) {
  return {
    onSuccess,
    ...render(
      <AuthWrapper authValue={authOverrides}>
        <ResetPasswordForm onSuccess={onSuccess} />
      </AuthWrapper>,
    ),
  }
}

describe('ResetPasswordForm', () => {
  it('renders email field and submit button', () => {
    renderResetForm()
    expect(screen.getByLabelText('El. paštas')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Atstatyti slaptažodį' })).toBeInTheDocument()
  })

  it('renders instruction text', () => {
    renderResetForm()
    expect(
      screen.getByText(/Įveskite savo el. pašto adresą ir mes atsiųsime/),
    ).toBeInTheDocument()
  })

  it('shows validation error for empty email', async () => {
    const user = userEvent.setup()
    renderResetForm()

    await user.click(screen.getByRole('button', { name: 'Atstatyti slaptažodį' }))

    await waitFor(() => {
      expect(screen.getByText('Įveskite teisingą el. pašto adresą')).toBeInTheDocument()
    })
  })

  it('calls resetPassword and shows success message', async () => {
    const user = userEvent.setup()
    const mockReset = vi.fn().mockResolvedValue({ error: null })
    const onSuccess = vi.fn()
    renderResetForm({ resetPassword: mockReset }, onSuccess)

    await user.type(screen.getByLabelText('El. paštas'), 'test@test.com')
    await user.click(screen.getByRole('button', { name: 'Atstatyti slaptažodį' }))

    await waitFor(() => {
      expect(mockReset).toHaveBeenCalledWith('test@test.com')
      expect(onSuccess).toHaveBeenCalledOnce()
      expect(
        screen.getByText(/Slaptažodžio atstatymo nuoroda išsiųsta/),
      ).toBeInTheDocument()
    })
  })

  it('shows server error when resetPassword fails', async () => {
    const user = userEvent.setup()
    const mockReset = vi.fn().mockResolvedValue({
      error: { message: 'Rate limit' },
    })
    renderResetForm({ resetPassword: mockReset })

    await user.type(screen.getByLabelText('El. paštas'), 'test@test.com')
    await user.click(screen.getByRole('button', { name: 'Atstatyti slaptažodį' }))

    await waitFor(() => {
      expect(
        screen.getByText(/Nepavyko išsiųsti slaptažodžio atstatymo nuorodos/),
      ).toBeInTheDocument()
    })
  })

  it('disables button while submitting', async () => {
    const user = userEvent.setup()
    let resolveReset: (value: { error: null }) => void
    const mockReset = vi.fn().mockImplementation(
      () => new Promise((resolve) => { resolveReset = resolve }),
    )
    renderResetForm({ resetPassword: mockReset })

    await user.type(screen.getByLabelText('El. paštas'), 'test@test.com')
    await user.click(screen.getByRole('button', { name: 'Atstatyti slaptažodį' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Siunčiama...' })).toBeDisabled()
    })

    resolveReset!({ error: null })

    await waitFor(() => {
      expect(screen.getByText(/Slaptažodžio atstatymo nuoroda išsiųsta/)).toBeInTheDocument()
    })
  })
})
