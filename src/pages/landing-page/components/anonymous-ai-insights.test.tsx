import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AnonymousAiInsights } from './anonymous-ai-insights'

const mockSummary = `## Bendras įvertinimas
Jūsų tyrimo rezultatai rodo gerą bendrą sveikatos būklę.

## Svarbios pastabos
- Hemoglobinas normos ribose.
- Leukocitų kiekis šiek tiek padidėjęs.

## Rekomendacijos
- Rekomenduojama pakartoti tyrimą po 3 mėnesių.
- Pasikonsultuokite su šeimos gydytoju.`

describe('AnonymousAiInsights', () => {
  it('should render section title', () => {
    render(<AnonymousAiInsights summary={mockSummary} />)
    expect(screen.getByText('AI Apibendrinimas')).toBeInTheDocument()
  })

  it('should render markdown headings', () => {
    render(<AnonymousAiInsights summary={mockSummary} />)
    expect(screen.getByText('Bendras įvertinimas')).toBeInTheDocument()
    expect(screen.getByText('Svarbios pastabos')).toBeInTheDocument()
    expect(screen.getByText('Rekomendacijos')).toBeInTheDocument()
  })

  it('should render paragraph content', () => {
    render(<AnonymousAiInsights summary={mockSummary} />)
    expect(screen.getByText(/gerą bendrą sveikatos/)).toBeInTheDocument()
  })

  it('should render list items', () => {
    render(<AnonymousAiInsights summary={mockSummary} />)
    expect(screen.getByText(/Hemoglobinas normos ribose/)).toBeInTheDocument()
    expect(screen.getByText(/Leukocitų kiekis/)).toBeInTheDocument()
  })

  it('should render disclaimer', () => {
    render(<AnonymousAiInsights summary={mockSummary} />)
    expect(screen.getByText(/nėra medicininė diagnozė/)).toBeInTheDocument()
  })
})
