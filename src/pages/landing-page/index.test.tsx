import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('@/services/ocr.service', () => ({
  ocrService: { extractMarkers: vi.fn() },
}))

vi.mock('@/services/ai-insights.service', () => ({
  aiInsightsService: { isAvailable: vi.fn().mockReturnValue(false), generate: vi.fn() },
}))

import { LandingPage } from './index'

function renderLandingPage() {
  return render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>,
  )
}

describe('LandingPage', () => {
  it('should render hero section', () => {
    renderLandingPage()
    expect(screen.getByText(/Jūsų sveikatos duomenys/)).toBeInTheDocument()
  })

  it('should render static demo results in idle state', () => {
    renderLandingPage()
    expect(screen.getByText('Naujausi rezultatai')).toBeInTheDocument()
    expect(screen.getByText('Hemoglobinas')).toBeInTheDocument()
  })

  it('should render quick actions', () => {
    renderLandingPage()
    expect(screen.getByText('Greiti veiksmai')).toBeInTheDocument()
  })

  it('should render footer', () => {
    renderLandingPage()
    expect(screen.getByText('Kraujo Analizė')).toBeInTheDocument()
    expect(screen.getByText('Privatumo politika')).toBeInTheDocument()
  })

  it('should render file upload zone', () => {
    renderLandingPage()
    expect(screen.getByText(/Vilkite failą čia/)).toBeInTheDocument()
  })

  it('should render auth links', () => {
    renderLandingPage()
    expect(screen.getByText('Prisijungti')).toBeInTheDocument()
    expect(screen.getByText('Registruotis')).toBeInTheDocument()
  })
})
