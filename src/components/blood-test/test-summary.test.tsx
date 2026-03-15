import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { TestSummary } from '@/types/blood-test.types'
import { TestSummaryCard } from './test-summary'

const mockSummary: TestSummary = {
  totalMarkers: 10,
  normalCount: 7,
  lowCount: 2,
  highCount: 1,
}

describe('TestSummaryCard', () => {
  it('renders heading', () => {
    render(<TestSummaryCard summary={mockSummary} />)
    expect(screen.getByText('Tyrimo santrauka')).toBeInTheDocument()
  })

  it('displays normal count', () => {
    render(<TestSummaryCard summary={mockSummary} />)
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('Norma')).toBeInTheDocument()
  })

  it('displays low count', () => {
    render(<TestSummaryCard summary={mockSummary} />)
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('Žemi')).toBeInTheDocument()
  })

  it('displays high count', () => {
    render(<TestSummaryCard summary={mockSummary} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('Aukšti')).toBeInTheDocument()
  })

  it('displays total markers count', () => {
    render(<TestSummaryCard summary={mockSummary} />)
    expect(screen.getByText('Iš viso rodiklių: 10')).toBeInTheDocument()
  })

  it('displays percentage normoje', () => {
    render(<TestSummaryCard summary={mockSummary} />)
    expect(screen.getByText('70%')).toBeInTheDocument()
  })

  it('handles zero total markers', () => {
    const empty: TestSummary = { totalMarkers: 0, normalCount: 0, lowCount: 0, highCount: 0 }
    render(<TestSummaryCard summary={empty} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
    expect(screen.getByText('Iš viso rodiklių: 0')).toBeInTheDocument()
  })
})
