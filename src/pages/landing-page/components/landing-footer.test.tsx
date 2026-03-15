import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LandingFooter } from './landing-footer'

describe('LandingFooter', () => {
  it('should render brand name', () => {
    render(<LandingFooter />)
    expect(screen.getByText('Kraujo Analizė')).toBeInTheDocument()
  })

  it('should render brand description', () => {
    render(<LandingFooter />)
    expect(screen.getByText(/Suteikiame pacientams saugią/)).toBeInTheDocument()
  })

  it('should render product links', () => {
    render(<LandingFooter />)
    expect(screen.getByText('Produktas')).toBeInTheDocument()
    expect(screen.getByText('Apžvalga')).toBeInTheDocument()
    expect(screen.getByText('Saugumas')).toBeInTheDocument()
  })

  it('should render support links', () => {
    render(<LandingFooter />)
    expect(screen.getByText('Pagalba')).toBeInTheDocument()
    expect(screen.getByText('Pagalbos centras')).toBeInTheDocument()
    expect(screen.getByText('Susisiekti')).toBeInTheDocument()
  })

  it('should render copyright with current year', () => {
    render(<LandingFooter />)
    const year = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`${year}`))).toBeInTheDocument()
  })

  it('should render legal links', () => {
    render(<LandingFooter />)
    expect(screen.getByText('Privatumo politika')).toBeInTheDocument()
    expect(screen.getByText('Naudojimo sąlygos')).toBeInTheDocument()
  })
})
