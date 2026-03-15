import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './button'

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Išsaugoti</Button>)
    expect(screen.getByText('Išsaugoti')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Spausti</Button>)
    await userEvent.click(screen.getByText('Spausti'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Išjungtas</Button>)
    expect(screen.getByText('Išjungtas')).toBeDisabled()
  })

  it('is disabled when isLoading is true', () => {
    render(<Button isLoading>Kraunama</Button>)
    expect(screen.getByText('Kraunama')).toBeDisabled()
  })

  it('shows spinner when isLoading', () => {
    const { container } = render(<Button isLoading>Kraunama</Button>)
    expect(container.querySelector('svg.animate-spin')).toBeInTheDocument()
  })

  it('applies variant classes', () => {
    render(<Button variant="danger">Ištrinti</Button>)
    const btn = screen.getByText('Ištrinti')
    expect(btn.className).toContain('border-status-high')
  })

  it('applies size classes', () => {
    render(<Button size="lg">Didelis</Button>)
    const btn = screen.getByText('Didelis')
    expect(btn.className).toContain('px-6')
  })
})
