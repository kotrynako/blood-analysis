import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import {
  savePendingResults,
  getPendingResults,
  clearPendingResults,
  usePendingResults,
} from './use-pending-results'
import type { OcrMarkerResult } from '@/services/ocr.service'

const mockMarkers: OcrMarkerResult[] = [
  { marker_key: 'hemoglobin' as const, value: 140, unit: 'g/L' },
  { marker_key: 'wbc' as const, value: 7.5, unit: '×10⁹/L' },
]

describe('pending results (standalone functions)', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('should save and retrieve pending results', () => {
    savePendingResults(mockMarkers, 'AI summary text')
    const result = getPendingResults()

    expect(result).not.toBeNull()
    expect(result!.markers).toEqual(mockMarkers)
    expect(result!.aiSummary).toBe('AI summary text')
    expect(result!.savedAt).toBeDefined()
  })

  it('should save with null aiSummary', () => {
    savePendingResults(mockMarkers, null)
    const result = getPendingResults()

    expect(result).not.toBeNull()
    expect(result!.aiSummary).toBeNull()
  })

  it('should return null when no pending results', () => {
    const result = getPendingResults()
    expect(result).toBeNull()
  })

  it('should return null for invalid JSON', () => {
    sessionStorage.setItem('pending_anonymous_results', 'invalid-json')
    const result = getPendingResults()
    expect(result).toBeNull()
  })

  it('should clear pending results', () => {
    savePendingResults(mockMarkers, 'Summary')
    clearPendingResults()
    const result = getPendingResults()
    expect(result).toBeNull()
  })
})

describe('usePendingResults hook', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('should save via hook', () => {
    const { result } = renderHook(() => usePendingResults())

    act(() => {
      result.current.save(mockMarkers, 'Hook summary')
    })

    const pending = result.current.get()
    expect(pending).not.toBeNull()
    expect(pending!.markers).toEqual(mockMarkers)
    expect(pending!.aiSummary).toBe('Hook summary')
  })

  it('should clear via hook', () => {
    const { result } = renderHook(() => usePendingResults())

    act(() => {
      result.current.save(mockMarkers, 'Summary')
    })
    expect(result.current.get()).not.toBeNull()

    act(() => {
      result.current.clear()
    })
    expect(result.current.get()).toBeNull()
  })

  it('should return null when nothing saved', () => {
    const { result } = renderHook(() => usePendingResults())
    expect(result.current.get()).toBeNull()
  })
})
