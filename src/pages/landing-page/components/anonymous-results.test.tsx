import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AnonymousResults } from './anonymous-results'
import type { MarkerResult } from '@/types/blood-test.types'

const mockMarkers: MarkerResult[] = [
  {
    key: 'hemoglobin',
    value: 140,
    unit: 'g/L',
    status: 'normal',
    referenceMin: 130,
    referenceMax: 175,
  },
  {
    key: 'wbc',
    value: 12.5,
    unit: '×10⁹/L',
    status: 'high',
    referenceMin: 4,
    referenceMax: 10,
  },
]

describe('AnonymousResults', () => {
  it('should render marker count in title', () => {
    render(<AnonymousResults markers={mockMarkers} />)
    expect(screen.getByText('Atpažinti rodikliai (2)')).toBeInTheDocument()
  })

  it('should render table headers', () => {
    render(<AnonymousResults markers={mockMarkers} />)
    expect(screen.getByText('Rodiklis')).toBeInTheDocument()
    expect(screen.getByText('Reikšmė')).toBeInTheDocument()
    expect(screen.getAllByText('Norma').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Būsena')).toBeInTheDocument()
  })

  it('should render marker names from MARKER_MAP', () => {
    render(<AnonymousResults markers={mockMarkers} />)
    expect(screen.getByText('Hemoglobinas')).toBeInTheDocument()
    expect(screen.getByText('Leukocitai')).toBeInTheDocument()
  })

  it('should render marker values with units', () => {
    render(<AnonymousResults markers={mockMarkers} />)
    expect(screen.getByText('140 g/L')).toBeInTheDocument()
    expect(screen.getByText('12.5 ×10⁹/L')).toBeInTheDocument()
  })

  it('should render reference ranges', () => {
    render(<AnonymousResults markers={mockMarkers} />)
    expect(screen.getByText('130–175 g/L')).toBeInTheDocument()
    expect(screen.getByText('4–10 ×10⁹/L')).toBeInTheDocument()
  })

  it('should render status badges', () => {
    render(<AnonymousResults markers={mockMarkers} />)
    const badges = screen.getAllByText('Norma')
    expect(badges.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Aukštas')).toBeInTheDocument()
  })
})
