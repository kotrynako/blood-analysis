import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { supabase } from '@/lib/supabase'
import { useFileUpload } from './use-file-upload'

vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    user: { id: 'user-1' },
    session: null,
    loading: false,
    signUp: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    resetPassword: vi.fn(),
  }),
}))

const mockUpload = vi.fn()
const mockGetPublicUrl = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()

  mockUpload.mockResolvedValue({ data: {}, error: null })
  mockGetPublicUrl.mockReturnValue({
    data: { publicUrl: 'https://storage.test/file.jpg' },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(supabase as any).storage = {
    from: vi.fn().mockReturnValue({
      upload: mockUpload,
      getPublicUrl: mockGetPublicUrl,
    }),
  }
})

describe('useFileUpload', () => {
  it('starts with isUploading false and no error', () => {
    const { result } = renderHook(() => useFileUpload())

    expect(result.current.isUploading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('uploads a file and returns public URL', async () => {
    const { result } = renderHook(() => useFileUpload())
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

    let url: string | undefined
    await act(async () => {
      url = await result.current.upload(file)
    })

    expect(url).toBe('https://storage.test/file.jpg')
    expect(result.current.isUploading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('sets error when upload fails', async () => {
    mockUpload.mockResolvedValue({
      data: null,
      error: { message: 'Storage error' },
    })

    const { result } = renderHook(() => useFileUpload())
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

    await act(async () => {
      try {
        await result.current.upload(file)
      } catch {
        // expected to throw
      }
    })

    expect(result.current.error).toBe('Nepavyko įkelti failo')
  })
})
