import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAnonymousAnalysis } from './use-anonymous-analysis'

vi.mock('@/services/ocr.service', () => ({
  ocrService: {
    extractMarkers: vi.fn(),
  },
}))

vi.mock('@/services/ai-insights.service', () => ({
  aiInsightsService: {
    isAvailable: vi.fn().mockReturnValue(true),
    generate: vi.fn(),
  },
}))

import { ocrService } from '@/services/ocr.service'
import { aiInsightsService } from '@/services/ai-insights.service'

const mockOcrService = vi.mocked(ocrService)
const mockAiService = vi.mocked(aiInsightsService)

const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' })

const mockOcrResult = {
  markers: [
    { marker_key: 'hemoglobin' as const, value: 140, unit: 'g/L' },
    { marker_key: 'wbc' as const, value: 7.5, unit: '×10⁹/L' },
  ],
  rawText: 'test raw text',
}

describe('useAnonymousAnalysis', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAiService.isAvailable.mockReturnValue(true)
  })

  it('should start in idle state', () => {
    const { result } = renderHook(() => useAnonymousAnalysis())
    expect(result.current.step).toBe('idle')
    expect(result.current.ocrMarkers).toEqual([])
    expect(result.current.markerResults).toEqual([])
    expect(result.current.aiSummary).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('should process file and return results', async () => {
    mockOcrService.extractMarkers.mockResolvedValue(mockOcrResult)
    mockAiService.generate.mockResolvedValue('## Bendras įvertinimas\nViskas gerai.')

    const { result } = renderHook(() => useAnonymousAnalysis())

    await act(async () => {
      await result.current.analyze(mockFile)
    })

    expect(result.current.step).toBe('results')
    expect(result.current.ocrMarkers).toHaveLength(2)
    expect(result.current.markerResults).toHaveLength(2)
    expect(result.current.aiSummary).toBe('## Bendras įvertinimas\nViskas gerai.')
    expect(result.current.error).toBeNull()
  })

  it('should call AI service with null gender, birthYear, previousResults', async () => {
    mockOcrService.extractMarkers.mockResolvedValue(mockOcrResult)
    mockAiService.generate.mockResolvedValue('Summary')

    const { result } = renderHook(() => useAnonymousAnalysis())

    await act(async () => {
      await result.current.analyze(mockFile)
    })

    expect(mockAiService.generate).toHaveBeenCalledWith(
      expect.objectContaining({
        gender: null,
        birthYear: null,
        previousResults: null,
      }),
    )
  })

  it('should handle OCR returning no markers', async () => {
    mockOcrService.extractMarkers.mockResolvedValue({ markers: [] })

    const { result } = renderHook(() => useAnonymousAnalysis())

    await act(async () => {
      await result.current.analyze(mockFile)
    })

    expect(result.current.step).toBe('error')
    expect(result.current.error).toContain('Nepavyko atpažinti')
  })

  it('should handle OCR error', async () => {
    mockOcrService.extractMarkers.mockRejectedValue(new Error('OCR failed'))

    const { result } = renderHook(() => useAnonymousAnalysis())

    await act(async () => {
      await result.current.analyze(mockFile)
    })

    expect(result.current.step).toBe('error')
    expect(result.current.error).toBe('OCR failed')
  })

  it('should handle AI service error gracefully', async () => {
    mockOcrService.extractMarkers.mockResolvedValue(mockOcrResult)
    mockAiService.generate.mockRejectedValue(new Error('AI error'))

    const { result } = renderHook(() => useAnonymousAnalysis())

    await act(async () => {
      await result.current.analyze(mockFile)
    })

    expect(result.current.step).toBe('error')
    expect(result.current.error).toBe('AI error')
  })

  it('should skip AI when not available', async () => {
    mockOcrService.extractMarkers.mockResolvedValue(mockOcrResult)
    mockAiService.isAvailable.mockReturnValue(false)

    const { result } = renderHook(() => useAnonymousAnalysis())

    await act(async () => {
      await result.current.analyze(mockFile)
    })

    expect(result.current.step).toBe('results')
    expect(result.current.aiSummary).toBeNull()
    expect(mockAiService.generate).not.toHaveBeenCalled()
  })

  it('should retry with last file', async () => {
    mockOcrService.extractMarkers.mockRejectedValueOnce(new Error('fail'))
    mockOcrService.extractMarkers.mockResolvedValueOnce(mockOcrResult)
    mockAiService.generate.mockResolvedValue('Summary')

    const { result } = renderHook(() => useAnonymousAnalysis())

    await act(async () => {
      await result.current.analyze(mockFile)
    })
    expect(result.current.step).toBe('error')

    await act(async () => {
      result.current.retry()
    })
    expect(result.current.step).toBe('results')
  })

  it('should reset to idle state', async () => {
    mockOcrService.extractMarkers.mockResolvedValue(mockOcrResult)
    mockAiService.generate.mockResolvedValue('Summary')

    const { result } = renderHook(() => useAnonymousAnalysis())

    await act(async () => {
      await result.current.analyze(mockFile)
    })
    expect(result.current.step).toBe('results')

    act(() => {
      result.current.reset()
    })
    expect(result.current.step).toBe('idle')
    expect(result.current.ocrMarkers).toEqual([])
    expect(result.current.markerResults).toEqual([])
    expect(result.current.aiSummary).toBeNull()
  })
})
