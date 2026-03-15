import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthCta } from './auth-cta'

function renderAuthCta(props: Partial<Parameters<typeof AuthCta>[0]> = {}) {
  return render(
    <MemoryRouter>
      <AuthCta {...props} />
    </MemoryRouter>,
  )
}

describe('AuthCta', () => {
  it('should render title', () => {
    renderAuthCta()
    expect(screen.getByText('Išsaugokite savo rezultatus!')).toBeInTheDocument()
  })

  it('should render benefit list', () => {
    renderAuthCta()
    expect(screen.getByText('Išsaugoti tyrimo rezultatus')).toBeInTheDocument()
    expect(screen.getByText('Gauti personalizuotas įžvalgas')).toBeInTheDocument()
    expect(screen.getByText('Sekti rodiklių dinamiką laike')).toBeInTheDocument()
  })

  it('should render register and login links', () => {
    renderAuthCta()
    const registerLink = screen.getByText('Registruotis').closest('a')
    const loginLink = screen.getByText('Prisijungti').closest('a')
    expect(registerLink).toHaveAttribute('href', '/register')
    expect(loginLink).toHaveAttribute('href', '/login')
  })

  it('should call onBeforeNavigate when clicking register', () => {
    const onBeforeNavigate = vi.fn()
    renderAuthCta({ onBeforeNavigate })
    fireEvent.click(screen.getByText('Registruotis'))
    expect(onBeforeNavigate).toHaveBeenCalledOnce()
  })

  it('should call onBeforeNavigate when clicking login', () => {
    const onBeforeNavigate = vi.fn()
    renderAuthCta({ onBeforeNavigate })
    fireEvent.click(screen.getByText('Prisijungti'))
    expect(onBeforeNavigate).toHaveBeenCalledOnce()
  })
})
