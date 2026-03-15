import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HeroSection } from './hero-section'

function renderHeroSection(props: Partial<Parameters<typeof HeroSection>[0]> = {}) {
  const defaultProps = {
    onFileSelect: vi.fn(),
    isProcessing: false,
    ...props,
  }
  return render(
    <MemoryRouter>
      <HeroSection {...defaultProps} />
    </MemoryRouter>,
  )
}

describe('HeroSection', () => {
  it('should render badge text', () => {
    renderHeroSection()
    expect(screen.getByText('Saugus duomenų saugojimas')).toBeInTheDocument()
  })

  it('should render hero title', () => {
    renderHeroSection()
    expect(screen.getByText(/Jūsų sveikatos duomenys/)).toBeInTheDocument()
    expect(screen.getByText('apsaugoti')).toBeInTheDocument()
  })

  it('should render description', () => {
    renderHeroSection()
    expect(screen.getByText(/Saugiai įkelkite ir valdykite/)).toBeInTheDocument()
  })

  it('should render login and register links', () => {
    renderHeroSection()
    const loginLink = screen.getByText('Prisijungti')
    const registerLink = screen.getByText('Registruotis')
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login')
    expect(registerLink.closest('a')).toHaveAttribute('href', '/register')
  })

  it('should render social proof text', () => {
    renderHeroSection()
    expect(screen.getByText(/10k\+ pacientų/)).toBeInTheDocument()
  })

  it('should render file upload zone', () => {
    renderHeroSection()
    expect(screen.getByText(/Vilkite failą čia/)).toBeInTheDocument()
  })

  it('should pass isProcessing to FileUpload', () => {
    renderHeroSection({ isProcessing: true })
    expect(screen.getByText('Įkeliama...')).toBeInTheDocument()
  })
})
