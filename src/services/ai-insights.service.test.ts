import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { MarkerResult } from '@/types/blood-test.types'

vi.mock('@/data/marker-definitions', () => ({
  MARKER_MAP: {
    hemoglobin: { name: 'Hemoglobinas', unit: 'g/L', referenceRanges: { male: { min: 130, max: 175 } } },
    wbc: { name: 'Leukocitai', unit: '×10⁹/L', referenceRanges: { male: { min: 4, max: 10 } } },
  },
}))

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

const normalResult: MarkerResult = {
  key: 'hemoglobin',
  value: 150,
  unit: 'g/L',
  status: 'normal',
  referenceMin: 130,
  referenceMax: 175,
}

const lowResult: MarkerResult = {
  key: 'wbc',
  value: 2,
  unit: '×10⁹/L',
  status: 'low',
  referenceMin: 4,
  referenceMax: 10,
}

describe('buildInsightsPrompt', () => {
  it('includes marker data and gender in the prompt', async () => {
    vi.stubEnv('VITE_OPENAI_API_KEY', 'test-key')
    vi.resetModules()
    const { buildInsightsPrompt } = await import('./ai-insights.service')

    const prompt = buildInsightsPrompt({
      results: [normalResult, lowResult],
      gender: 'male',
      birthYear: 1990,
      previousResults: null,
    })

    expect(prompt).toContain('Hemoglobinas')
    expect(prompt).toContain('150')
    expect(prompt).toContain('Leukocitai')
    expect(prompt).toContain('vyras')
    expect(prompt).toContain('Nukrypę rodikliai')
  })

  it('includes comparison block when previous results exist', async () => {
    vi.stubEnv('VITE_OPENAI_API_KEY', 'test-key')
    vi.resetModules()
    const { buildInsightsPrompt } = await import('./ai-insights.service')

    const prevResult: MarkerResult = { ...normalResult, value: 140 }

    const prompt = buildInsightsPrompt({
      results: [normalResult],
      gender: 'male',
      birthYear: 1990,
      previousResults: [prevResult],
    })

    expect(prompt).toContain('Ankstesnio tyrimo palyginimas')
    expect(prompt).toContain('140')
    expect(prompt).toContain('150')
  })

  it('handles null gender and birth year', async () => {
    vi.stubEnv('VITE_OPENAI_API_KEY', 'test-key')
    vi.resetModules()
    const { buildInsightsPrompt } = await import('./ai-insights.service')

    const prompt = buildInsightsPrompt({
      results: [normalResult],
      gender: null,
      birthYear: null,
    })

    expect(prompt).toContain('nenurodyta')
  })
})

describe('aiInsightsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('isAvailable returns false when API key is missing', async () => {
    vi.stubEnv('VITE_OPENAI_API_KEY', '')
    vi.resetModules()
    const { aiInsightsService } = await import('./ai-insights.service')

    expect(aiInsightsService.isAvailable()).toBe(false)
  })

  it('isAvailable returns true when API key is set', async () => {
    vi.stubEnv('VITE_OPENAI_API_KEY', 'test-key')
    vi.resetModules()
    const { aiInsightsService } = await import('./ai-insights.service')

    expect(aiInsightsService.isAvailable()).toBe(true)
  })

  it('throws when API key is missing on generate', async () => {
    vi.stubEnv('VITE_OPENAI_API_KEY', '')
    vi.resetModules()
    const { aiInsightsService } = await import('./ai-insights.service')

    await expect(
      aiInsightsService.generate({
        results: [normalResult],
        gender: 'male',
        birthYear: 1990,
      }),
    ).rejects.toThrow('VITE_OPENAI_API_KEY')
  })

  it('returns AI-generated summary on success', async () => {
    vi.stubEnv('VITE_OPENAI_API_KEY', 'test-key')
    vi.resetModules()
    const { aiInsightsService } = await import('./ai-insights.service')

    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          choices: [{ message: { content: '## Bendras įvertinimas\nViskas gerai.' } }],
        }),
    })

    const result = await aiInsightsService.generate({
      results: [normalResult],
      gender: 'male',
      birthYear: 1990,
    })

    expect(result).toContain('Bendras įvertinimas')
    expect(result).toContain('Viskas gerai.')
  })

  it('throws on 401 response', async () => {
    vi.stubEnv('VITE_OPENAI_API_KEY', 'bad-key')
    vi.resetModules()
    const { aiInsightsService } = await import('./ai-insights.service')

    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    })

    await expect(
      aiInsightsService.generate({
        results: [normalResult],
        gender: 'male',
        birthYear: 1990,
      }),
    ).rejects.toThrow('Neteisingas OpenAI API raktas')
  })

  it('throws on 429 response after retries', async () => {
    vi.stubEnv('VITE_OPENAI_API_KEY', 'test-key')
    vi.resetModules()
    const { aiInsightsService } = await import('./ai-insights.service')

    mockFetch.mockResolvedValue({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
    })

    await expect(
      aiInsightsService.generate({
        results: [normalResult],
        gender: 'male',
        birthYear: 1990,
      }),
    ).rejects.toThrow('limitas viršytas')
  }, 30000)

  it('throws on empty AI response', async () => {
    vi.stubEnv('VITE_OPENAI_API_KEY', 'test-key')
    vi.resetModules()
    const { aiInsightsService } = await import('./ai-insights.service')

    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          choices: [{ message: { content: '   ' } }],
        }),
    })

    await expect(
      aiInsightsService.generate({
        results: [normalResult],
        gender: 'male',
        birthYear: 1990,
      }),
    ).rejects.toThrow('tuščią atsakymą')
  })
})
