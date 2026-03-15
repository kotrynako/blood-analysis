import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { MarkerResult } from '@/types/blood-test.types'
import { MarkerCard } from './marker-card'

const normalResult: MarkerResult = {
  key: 'hemoglobin',
  value: 150,
  unit: 'g/L',
  status: 'normal',
  referenceMin: 130,
  referenceMax: 175,
}

const lowResult: MarkerResult = {
  key: 'wbc',
  value: 2,
  unit: '×10⁹/L',
  status: 'low',
  referenceMin: 4,
  referenceMax: 10,
}

const highResult: MarkerResult = {
  key: 'rbc',
  value: 7,
  unit: '×10¹²/L',
  status: 'high',
  referenceMin: 4.5,
  referenceMax: 5.9,
}

describe('MarkerCard', () => {
  it('renders marker name and value', () => {
    render(<MarkerCard result={normalResult} />)
    expect(screen.getByText('Hemoglobinas')).toBeInTheDocument()
    expect(screen.getByText('150')).toBeInTheDocument()
  })

  it('shows "Norma" badge for normal status', () => {
    render(<MarkerCard result={normalResult} />)
    expect(screen.getByText('Norma')).toBeInTheDocument()
  })

  it('shows "Žemas" badge for low status', () => {
    render(<MarkerCard result={lowResult} />)
    expect(screen.getByText('Žemas')).toBeInTheDocument()
  })

  it('shows "Aukštas" badge for high status', () => {
    render(<MarkerCard result={highResult} />)
    expect(screen.getByText('Aukštas')).toBeInTheDocument()
  })

  it('displays reference range', () => {
    render(<MarkerCard result={normalResult} />)
    expect(screen.getByText('130')).toBeInTheDocument()
    expect(screen.getByText('175 g/L')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<MarkerCard result={normalResult} onClick={onClick} />)

    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
