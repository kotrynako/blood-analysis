import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StaticDemoResults } from './static-demo-results'

describe('StaticDemoResults', () => {
  it('should render section title', () => {
    render(<StaticDemoResults />)
    expect(screen.getByText('Naujausi rezultatai')).toBeInTheDocument()
  })

  it('should render demo label', () => {
    render(<StaticDemoResults />)
    expect(screen.getByText('Demo')).toBeInTheDocument()
  })

  it('should render table headers', () => {
    render(<StaticDemoResults />)
    expect(screen.getByText('Rodiklis')).toBeInTheDocument()
    expect(screen.getByText('Reikšmė')).toBeInTheDocument()
    expect(screen.getByText('Būsena')).toBeInTheDocument()
    expect(screen.getByText('Tendencija')).toBeInTheDocument()
  })

  it('should render all 3 demo markers', () => {
    render(<StaticDemoResults />)
    expect(screen.getByText('Hemoglobinas')).toBeInTheDocument()
    expect(screen.getByText('Vitaminas D')).toBeInTheDocument()
    expect(screen.getByText(/Gliukozė/)).toBeInTheDocument()
  })

  it('should render marker values', () => {
    render(<StaticDemoResults />)
    expect(screen.getByText('14.2 g/dL')).toBeInTheDocument()
    expect(screen.getByText('22 ng/mL')).toBeInTheDocument()
    expect(screen.getByText('95 mg/dL')).toBeInTheDocument()
  })

  it('should render status badges', () => {
    render(<StaticDemoResults />)
    const normaBadges = screen.getAllByText('Norma')
    expect(normaBadges).toHaveLength(2)
    expect(screen.getByText('Žemas')).toBeInTheDocument()
  })

  it('should render trend percentages', () => {
    render(<StaticDemoResults />)
    expect(screen.getByText('80%')).toBeInTheDocument()
    expect(screen.getByText('30%')).toBeInTheDocument()
    expect(screen.getByText('65%')).toBeInTheDocument()
  })

  it('should render categories', () => {
    render(<StaticDemoResults />)
    expect(screen.getByText('Bendras kraujo tyrimas')).toBeInTheDocument()
    expect(screen.getByText('Mitybos skydelis')).toBeInTheDocument()
    expect(screen.getByText('Metabolinis skydelis')).toBeInTheDocument()
  })
})
