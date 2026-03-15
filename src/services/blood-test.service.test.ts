import { describe, it, expect, vi, beforeEach } from 'vitest'
import { supabase } from '@/lib/supabase'
import { bloodTestService } from './blood-test.service'

const mockSingle = vi.fn()
const mockSelect = vi.fn()
const mockEq = vi.fn()
const mockOrder = vi.fn()
const mockInsert = vi.fn()
const mockDelete = vi.fn()
const mockFrom = vi.fn()

function setupChain(finalResult: { data: unknown; error: unknown }) {
  mockSingle.mockResolvedValue(finalResult)
  mockSelect.mockReturnValue({ eq: mockEq, single: mockSingle })
  mockEq.mockReturnValue({ single: mockSingle, order: mockOrder, select: mockSelect })
  mockOrder.mockResolvedValue(finalResult)
  mockInsert.mockReturnValue({ select: mockSelect })
  mockDelete.mockReturnValue({ eq: mockEq })
  mockFrom.mockReturnValue({
    select: mockSelect,
    insert: mockInsert,
    delete: mockDelete,
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(supabase as any).from = mockFrom
}

describe('bloodTestService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAll', () => {
    it('fetches all tests for a user ordered by date desc', async () => {
      const tests = [{ id: '1' }, { id: '2' }]
      setupChain({ data: tests, error: null })
      mockEq.mockReturnValue({ order: mockOrder })
      mockOrder.mockResolvedValue({ data: tests, error: null })

      const result = await bloodTestService.getAll('user-1')

      expect(mockFrom).toHaveBeenCalledWith('blood_tests')
      expect(result).toEqual(tests)
    })

    it('throws on error', async () => {
      setupChain({ data: null, error: { message: 'fail' } })
      mockEq.mockReturnValue({ order: mockOrder })
      mockOrder.mockResolvedValue({ data: null, error: { message: 'fail' } })

      await expect(bloodTestService.getAll('user-1')).rejects.toEqual({ message: 'fail' })
    })
  })

  describe('getById', () => {
    it('fetches a single test', async () => {
      const test = { id: 'test-1' }
      setupChain({ data: test, error: null })

      const result = await bloodTestService.getById('test-1')

      expect(mockFrom).toHaveBeenCalledWith('blood_tests')
      expect(result).toEqual(test)
    })
  })

  describe('create', () => {
    it('creates a blood test', async () => {
      const created = { id: 'new-1', user_id: 'user-1', test_date: '2024-01-01' }
      setupChain({ data: created, error: null })

      const result = await bloodTestService.create({
        user_id: 'user-1',
        test_date: '2024-01-01',
      })

      expect(mockFrom).toHaveBeenCalledWith('blood_tests')
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: 'user-1',
        test_date: '2024-01-01',
      })
      expect(result).toEqual(created)
    })
  })

  describe('remove', () => {
    it('deletes a blood test', async () => {
      setupChain({ data: null, error: null })
      mockEq.mockResolvedValue({ error: null })

      await bloodTestService.remove('test-1')

      expect(mockFrom).toHaveBeenCalledWith('blood_tests')
      expect(mockDelete).toHaveBeenCalled()
    })
  })

  describe('getResults', () => {
    it('fetches results for a test', async () => {
      const results = [{ marker_key: 'hemoglobin', value: 140 }]
      setupChain({ data: results, error: null })
      mockEq.mockResolvedValue({ data: results, error: null })

      const result = await bloodTestService.getResults('test-1')

      expect(mockFrom).toHaveBeenCalledWith('blood_test_results')
      expect(result).toEqual(results)
    })
  })

  describe('createResults', () => {
    it('creates multiple results', async () => {
      const results = [{ marker_key: 'hemoglobin', value: 140, unit: 'g/L', test_id: 't1' }]
      setupChain({ data: results, error: null })
      mockInsert.mockReturnValue({ select: vi.fn().mockResolvedValue({ data: results, error: null }) })

      const result = await bloodTestService.createResults([
        { test_id: 't1', marker_key: 'hemoglobin', value: 140, unit: 'g/L' },
      ])

      expect(result).toEqual(results)
    })
  })
})
