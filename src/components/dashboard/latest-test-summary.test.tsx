import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { BloodTest } from '@/types/database.types'
import type { TestSummary } from '@/types/blood-test.types'
import { LatestTestSummary } from './latest-test-summary'

const mockTest: BloodTest = {
  id: 't1',
  user_id: 'u1',
  test_date: '2024-08-10',
  notes: 'Kontrolinis',
  file_url: null,
  created_at: '2024-08-10T10:00:00Z',
}

const mockSummary: TestSummary = {
  totalMarkers: 10,
  normalCount: 8,
  lowCount: 1,
  highCount: 1,
}

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('LatestTestSummary', () => {
  it('renders heading', () => {
    renderWithRouter(<LatestTestSummary test={mockTest} summary={mockSummary} />)
    expect(screen.getByText('Paskutinis tyrimas')).toBeInTheDocument()
  })

  it('renders test notes', () => {
    renderWithRouter(<LatestTestSummary test={mockTest} summary={mockSummary} />)
    expect(screen.getByText(/Kontrolinis/)).toBeInTheDocument()
  })

  it('renders link to test detail', () => {
    renderWithRouter(<LatestTestSummary test={mockTest} summary={mockSummary} />)
    const link = screen.getByText('Peržiūrėti →')
    expect(link).toBeInTheDocument()
    expect(link.closest('a')).toHaveAttribute('href', '/test/t1')
  })

  it('renders summary card with counts', () => {
    renderWithRouter(<LatestTestSummary test={mockTest} summary={mockSummary} />)
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('Norma')).toBeInTheDocument()
  })
})
