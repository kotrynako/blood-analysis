import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AiInsightsCard } from './ai-insights-card'

const defaultProps = {
  summary: null,
  isLoading: false,
  isRegenerating: false,
  error: null,
  available: true,
  onRegenerate: vi.fn(),
}

describe('AiInsightsCard', () => {
  it('renders nothing when not available', () => {
    const { container } = render(
      <AiInsightsCard {...defaultProps} available={false} />,
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders nothing when no summary and not loading/error', () => {
    const { container } = render(<AiInsightsCard {...defaultProps} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders loading state with skeleton', () => {
    render(<AiInsightsCard {...defaultProps} isLoading={true} />)
    expect(screen.getByText('Generuojamos AI įžvalgos...')).toBeInTheDocument()
  })

  it('renders error state with retry button', () => {
    render(
      <AiInsightsCard
        {...defaultProps}
        error={new Error('API klaida')}
      />,
    )
    expect(
      screen.getByText('Nepavyko sugeneruoti AI įžvalgų. Bandykite dar kartą.'),
    ).toBeInTheDocument()
    expect(screen.getByText('Bandyti iš naujo')).toBeInTheDocument()
  })

  it('calls onRegenerate when retry button is clicked in error state', async () => {
    const user = userEvent.setup()
    const onRegenerate = vi.fn()
    render(
      <AiInsightsCard
        {...defaultProps}
        error={new Error('fail')}
        onRegenerate={onRegenerate}
      />,
    )

    await user.click(screen.getByText('Bandyti iš naujo'))
    expect(onRegenerate).toHaveBeenCalledOnce()
  })

  it('renders summary with AI Įžvalgos title', () => {
    render(
      <AiInsightsCard
        {...defaultProps}
        summary="## Bendras įvertinimas\nViskas gerai."
      />,
    )
    expect(screen.getByText('AI Įžvalgos')).toBeInTheDocument()
  })

  it('renders structured sections from markdown', () => {
    const summary = '## Bendras įvertinimas\nViskas gerai.\n## Rekomendacijos\nDaugiau judėkite.'
    render(<AiInsightsCard {...defaultProps} summary={summary} />)
    expect(screen.getByText('Bendras įvertinimas')).toBeInTheDocument()
    expect(screen.getByText('Rekomendacijos')).toBeInTheDocument()
    expect(screen.getByText('Viskas gerai.')).toBeInTheDocument()
    expect(screen.getByText('Daugiau judėkite.')).toBeInTheDocument()
  })

  it('renders CTA link to manodaktaras.lt', () => {
    render(
      <AiInsightsCard {...defaultProps} summary="Viskas gerai" />,
    )
    const link = screen.getByText('Rasti gydytoją')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://www.manodaktaras.lt/')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('renders disclaimer text', () => {
    render(
      <AiInsightsCard {...defaultProps} summary="Viskas gerai" />,
    )
    expect(
      screen.getByText(/Tai nėra medicininė diagnozė/),
    ).toBeInTheDocument()
  })

  it('renders regenerate button', () => {
    render(
      <AiInsightsCard {...defaultProps} summary="Viskas gerai" />,
    )
    expect(screen.getByText('Atnaujinti')).toBeInTheDocument()
  })

  it('calls onRegenerate when regenerate button is clicked', async () => {
    const user = userEvent.setup()
    const onRegenerate = vi.fn()
    render(
      <AiInsightsCard
        {...defaultProps}
        summary="Viskas gerai"
        onRegenerate={onRegenerate}
      />,
    )

    await user.click(screen.getByText('Atnaujinti'))
    expect(onRegenerate).toHaveBeenCalledOnce()
  })

  it('disables regenerate button during regeneration', () => {
    render(
      <AiInsightsCard
        {...defaultProps}
        summary="Viskas gerai"
        isRegenerating={true}
      />,
    )
    expect(screen.getByText('Atnaujinama...')).toBeInTheDocument()
    expect(screen.getByText('Atnaujinama...').closest('button')).toBeDisabled()
  })
})
