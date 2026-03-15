import { describe, it, expect, vi, beforeEach } from 'vitest'
import { supabase } from '@/lib/supabase'
import { profileService } from './profile.service'

const mockFrom = vi.fn()
const mockSelect = vi.fn()
const mockEq = vi.fn()
const mockSingle = vi.fn()
const mockUpdate = vi.fn()

function setupChain(finalResult: { data: unknown; error: unknown }) {
  mockSingle.mockResolvedValue(finalResult)
  mockEq.mockReturnValue({ single: mockSingle, select: mockSelect })
  mockSelect.mockReturnValue({ eq: mockEq, single: mockSingle })
  mockUpdate.mockReturnValue({ eq: mockEq })
  mockFrom.mockReturnValue({
    select: mockSelect,
    update: mockUpdate,
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(supabase as any).from = mockFrom
}

describe('profileService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('get', () => {
    it('returns profile data on success', async () => {
      const mockProfile = { id: 'user-1', gender: 'male', birth_year: 1990, created_at: '2024-01-01' }
      setupChain({ data: mockProfile, error: null })

      const result = await profileService.get('user-1')

      expect(mockFrom).toHaveBeenCalledWith('profiles')
      expect(result).toEqual(mockProfile)
    })

    it('throws on error', async () => {
      setupChain({ data: null, error: { message: 'Not found' } })

      await expect(profileService.get('user-1')).rejects.toEqual({ message: 'Not found' })
    })
  })

  describe('update', () => {
    it('returns updated profile on success', async () => {
      const updated = { id: 'user-1', gender: 'female', birth_year: 1995, created_at: '2024-01-01' }
      setupChain({ data: updated, error: null })

      const result = await profileService.update('user-1', { gender: 'female' })

      expect(mockFrom).toHaveBeenCalledWith('profiles')
      expect(mockUpdate).toHaveBeenCalledWith({ gender: 'female' })
      expect(result).toEqual(updated)
    })

    it('throws on error', async () => {
      setupChain({ data: null, error: { message: 'Update failed' } })

      await expect(
        profileService.update('user-1', { gender: 'male' }),
      ).rejects.toEqual({ message: 'Update failed' })
    })
  })
})
