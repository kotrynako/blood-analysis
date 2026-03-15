import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Spinner, LoadingScreen } from './spinner'

describe('Spinner', () => {
  it('renders with status role', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('has aria-label', () => {
    render(<Spinner />)
    expect(screen.getByLabelText('Kraunama')).toBeInTheDocument()
  })

  it('applies size class', () => {
    const { container } = render(<Spinner size="lg" />)
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('h-10')
  })
})

describe('LoadingScreen', () => {
  it('renders spinner', () => {
    render(<LoadingScreen />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
