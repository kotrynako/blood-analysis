import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { BloodTest } from '@/types/database.types'
import { TestHistoryList } from './test-history-list'

vi.mock('@/hooks/use-blood-tests', () => ({
  useDeleteBloodTest: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}))

const mockTests: BloodTest[] = [
  {
    id: '1',
    user_id: 'u1',
    test_date: '2024-06-15',
    notes: 'Pirmas tyrimas',
    file_url: null,
    created_at: '2024-06-15T10:00:00Z',
  },
  {
    id: '2',
    user_id: 'u1',
    test_date: '2024-07-20',
    notes: null,
    file_url: null,
    created_at: '2024-07-20T10:00:00Z',
  },
]

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('TestHistoryList', () => {
  it('renders empty state when no tests', () => {
    renderWithRouter(<TestHistoryList tests={[]} />)
    expect(screen.getByText('Dar nėra tyrimų.')).toBeInTheDocument()
    expect(screen.getByText('Pridėti pirmą tyrimą')).toBeInTheDocument()
  })

  it('renders test dates', () => {
    renderWithRouter(<TestHistoryList tests={mockTests} />)
    const dates = screen.getAllByText(/2024/)
    expect(dates).toHaveLength(2)
  })

  it('renders test notes when present', () => {
    renderWithRouter(<TestHistoryList tests={mockTests} />)
    expect(screen.getByText('Pirmas tyrimas')).toBeInTheDocument()
  })

  it('renders heading', () => {
    renderWithRouter(<TestHistoryList tests={mockTests} />)
    expect(screen.getByText('Tyrimų istorija')).toBeInTheDocument()
  })

  it('renders delete buttons for each test', () => {
    renderWithRouter(<TestHistoryList tests={mockTests} />)
    const deleteButtons = screen.getAllByText('Ištrinti')
    expect(deleteButtons).toHaveLength(2)
  })

  it('renders links to test detail pages', () => {
    renderWithRouter(<TestHistoryList tests={mockTests} />)
    const links = screen.getAllByRole('link')
    const testLinks = links.filter((l) => l.getAttribute('href')?.startsWith('/test/'))
    expect(testLinks).toHaveLength(2)
  })
})
