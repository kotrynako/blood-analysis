import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Alert } from './alert'

describe('Alert', () => {
  it('renders children', () => {
    render(<Alert>Pranešimas</Alert>)
    expect(screen.getByText('Pranešimas')).toBeInTheDocument()
  })

  it('has alert role', () => {
    render(<Alert>Testas</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders close button when onClose provided', () => {
    const onClose = vi.fn()
    render(<Alert onClose={onClose}>Su uždarymu</Alert>)
    expect(screen.getByLabelText('Uždaryti')).toBeInTheDocument()
  })

  it('calls onClose when close button clicked', async () => {
    const onClose = vi.fn()
    render(<Alert onClose={onClose}>Uždaryti mane</Alert>)
    await userEvent.click(screen.getByLabelText('Uždaryti'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('does not render close button without onClose', () => {
    render(<Alert>Be uždarymo</Alert>)
    expect(screen.queryByLabelText('Uždaryti')).not.toBeInTheDocument()
  })
})
