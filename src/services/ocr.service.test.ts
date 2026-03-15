import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/data/marker-definitions', () => ({
  MARKER_DEFINITIONS: [
    { key: 'hemoglobin', name: 'Hemoglobinas', unit: 'g/L' },
    { key: 'wbc', name: 'Leukocitai', unit: '×10⁹/L' },
  ],
}))

vi.mock('@/utils/pdf-to-image', () => ({
  isPdf: vi.fn((file: File) => file.type === 'application/pdf'),
  pdfToImageBase64: vi.fn().mockResolvedValue('bW9ja2VkYmFzZTY0'),
}))

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('ocrService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('VITE_OPENAI_API_KEY', 'test-key')
  })

  it('throws when API key is missing', async () => {
    vi.stubEnv('VITE_OPENAI_API_KEY', '')

    const { ocrService } = await import('./ocr.service')

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    await expect(ocrService.extractMarkers(file)).rejects.toThrow('VITE_OPENAI_API_KEY')
  })

  it('returns parsed markers from OpenAI response', async () => {
    vi.stubEnv('VITE_OPENAI_API_KEY', 'test-key')

    vi.resetModules()
    const { ocrService } = await import('./ocr.service')

    const responseJson = [
      { marker_key: 'hemoglobin', value: 140, unit: 'g/L' },
      { marker_key: 'wbc', value: 6.5, unit: '×10⁹/L' },
    ]

    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          choices: [{ message: { content: JSON.stringify(responseJson) } }],
        }),
    })

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const result = await ocrService.extractMarkers(file)

    expect(result.markers).toHaveLength(2)
    expect(result.markers[0].marker_key).toBe('hemoglobin')
    expect(result.markers[0].value).toBe(140)
    expect(result.markers[1].marker_key).toBe('wbc')
  })

  it('returns empty markers when response has no JSON array', async () => {
    vi.stubEnv('VITE_OPENAI_API_KEY', 'test-key')

    vi.resetModules()
    const { ocrService } = await import('./ocr.service')

    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          choices: [{ message: { content: 'No markers found in image.' } }],
        }),
    })

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const result = await ocrService.extractMarkers(file)

    expect(result.markers).toHaveLength(0)
    expect(result.rawText).toBe('No markers found in image.')
  })

  it('filters out invalid marker keys', async () => {
    vi.stubEnv('VITE_OPENAI_API_KEY', 'test-key')

    vi.resetModules()
    const { ocrService } = await import('./ocr.service')

    const responseJson = [
      { marker_key: 'hemoglobin', value: 140, unit: 'g/L' },
      { marker_key: 'unknown_marker', value: 99, unit: 'x' },
    ]

    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          choices: [{ message: { content: JSON.stringify(responseJson) } }],
        }),
    })

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const result = await ocrService.extractMarkers(file)

    expect(result.markers).toHaveLength(1)
    expect(result.markers[0].marker_key).toBe('hemoglobin')
  })

  it('throws descriptive error on 401 response', async () => {
    vi.stubEnv('VITE_OPENAI_API_KEY', 'bad-key')

    vi.resetModules()
    const { ocrService } = await import('./ocr.service')

    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    })

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    await expect(ocrService.extractMarkers(file)).rejects.toThrow('Neteisingas OpenAI API raktas')
  })
})
