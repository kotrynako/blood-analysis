import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import type { MarkerResult } from '@/types/blood-test.types'
import { MarkerExplanation } from './marker-explanation'

function Wrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>
}

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

describe('MarkerExplanation', () => {
  it('renders marker name and value', () => {
    render(<MarkerExplanation result={normalResult} />, { wrapper: Wrapper })
    expect(screen.getByText('Hemoglobinas')).toBeInTheDocument()
    expect(screen.getByText('150')).toBeInTheDocument()
  })

  it('displays "Ką matuoja" section with description', () => {
    render(<MarkerExplanation result={normalResult} />, { wrapper: Wrapper })
    expect(screen.getByText('Ką matuoja')).toBeInTheDocument()
    expect(
      screen.getByText('Baltymas eritrocituose, pernešantis deguonį į audinius.'),
    ).toBeInTheDocument()
  })

  it('displays reference range', () => {
    render(<MarkerExplanation result={normalResult} />, { wrapper: Wrapper })
    expect(screen.getByText('Normos ribos')).toBeInTheDocument()
    expect(screen.getByText('130–175 g/L')).toBeInTheDocument()
  })

  it('displays recommendations', () => {
    render(<MarkerExplanation result={normalResult} />, { wrapper: Wrapper })
    expect(screen.getByText('Rekomendacijos')).toBeInTheDocument()
    expect(
      screen.getByText('Vartokite geležį turinčius maisto produktus'),
    ).toBeInTheDocument()
  })

  it('shows low explanation for low status', () => {
    render(<MarkerExplanation result={lowResult} />, { wrapper: Wrapper })
    expect(screen.getByText('Žema reikšmė')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Gali rodyti susilpnėjusią imuninę sistemą ar kaulų čiulpų problemas.',
      ),
    ).toBeInTheDocument()
  })

  it('shows high explanation for high status', () => {
    render(<MarkerExplanation result={highResult} />, { wrapper: Wrapper })
    expect(screen.getByText('Aukšta reikšmė')).toBeInTheDocument()
    expect(
      screen.getByText('Gali rodyti dehidrataciją, širdies ar plaučių ligas.'),
    ).toBeInTheDocument()
  })

  it('does not show high/low explanation for normal status', () => {
    render(<MarkerExplanation result={normalResult} />, { wrapper: Wrapper })
    expect(screen.queryByText('Aukšta reikšmė')).not.toBeInTheDocument()
    expect(screen.queryByText('Žema reikšmė')).not.toBeInTheDocument()
  })

  it('renders link to marker history page', () => {
    render(<MarkerExplanation result={normalResult} />, { wrapper: Wrapper })
    const link = screen.getByText('Peržiūrėti istoriją →')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/marker/hemoglobin/history')
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<MarkerExplanation result={normalResult} onClose={onClose} />, {
      wrapper: Wrapper,
    })

    await user.click(screen.getByRole('button', { name: 'Uždaryti' }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('does not render close button when onClose is not provided', () => {
    render(<MarkerExplanation result={normalResult} />, { wrapper: Wrapper })
    expect(screen.queryByRole('button', { name: 'Uždaryti' })).not.toBeInTheDocument()
  })
})
