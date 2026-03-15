import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QuickActions } from './quick-actions'

describe('QuickActions', () => {
  it('should render section title', () => {
    render(<QuickActions />)
    expect(screen.getByText('Greiti veiksmai')).toBeInTheDocument()
  })

  it('should render clinic visit card', () => {
    render(<QuickActions />)
    expect(screen.getByText('Apsilankymas pas gydytoją')).toBeInTheDocument()
    expect(screen.getByText(/Užsiregistruokite vizitui/)).toBeInTheDocument()
  })

  it('should render virtual consultation card', () => {
    render(<QuickActions />)
    expect(screen.getByText('Virtuali konsultacija')).toBeInTheDocument()
    expect(screen.getByText(/Pasikalbėkite su gydytoju/)).toBeInTheDocument()
  })

  it('should link clinic visit to manodaktaras.lt', () => {
    render(<QuickActions />)
    const link = screen.getByText('Apsilankymas pas gydytoją').closest('a')
    expect(link).toHaveAttribute('href', 'https://www.manodaktaras.lt/')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('should link virtual consultation to manodaktaras.lt remote search', () => {
    render(<QuickActions />)
    const link = screen.getByText('Virtuali konsultacija').closest('a')
    expect(link).toHaveAttribute(
      'href',
      'https://www.manodaktaras.lt/paieska/seimos-gydytojas?selectedRemote=1',
    )
    expect(link).toHaveAttribute('target', '_blank')
  })
})
