import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MarkerTrendChart } from './marker-trend-chart'
import type { TrendDataPoint } from './marker-trend-chart'

vi.mock('recharts', async () => {
  const OriginalModule = await vi.importActual<typeof import('recharts')>('recharts')
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
  }
})

const mockData: TrendDataPoint[] = [
  { date: '2024-06-15', value: 140 },
  { date: '2024-07-20', value: 155 },
  { date: '2024-08-10', value: 148 },
]

describe('MarkerTrendChart', () => {
  it('shows empty message when no data', () => {
    render(
      <MarkerTrendChart
        data={[]}
        unit="g/L"
        referenceMin={130}
        referenceMax={175}
        markerName="Hemoglobinas"
      />,
    )
    expect(screen.getByText('Nėra duomenų grafiko atvaizdavimui.')).toBeInTheDocument()
  })

  it('renders chart container when data provided', () => {
    render(
      <MarkerTrendChart
        data={mockData}
        unit="g/L"
        referenceMin={130}
        referenceMax={175}
        markerName="Hemoglobinas"
      />,
    )
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
  })

  it('renders marker name heading', () => {
    render(
      <MarkerTrendChart
        data={mockData}
        unit="g/L"
        referenceMin={130}
        referenceMax={175}
        markerName="Hemoglobinas"
      />,
    )
    expect(screen.getByText('Hemoglobinas')).toBeInTheDocument()
  })

  it('renders reference range text', () => {
    render(
      <MarkerTrendChart
        data={mockData}
        unit="g/L"
        referenceMin={130}
        referenceMax={175}
        markerName="Hemoglobinas"
      />,
    )
    expect(screen.getByText('Normos ribos: 130–175 g/L')).toBeInTheDocument()
  })
})
