import { useCallback } from 'react'
import type { OcrMarkerResult } from '@/services/ocr.service'

const STORAGE_KEY = 'pending_anonymous_results'

export interface PendingResults {
  markers: OcrMarkerResult[]
  aiSummary: string | null
  savedAt: string
}

export function savePendingResults(
  markers: OcrMarkerResult[],
  aiSummary: string | null,
): void {
  const data: PendingResults = {
    markers,
    aiSummary,
    savedAt: new Date().toISOString(),
  }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getPendingResults(): PendingResults | null {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as PendingResults
  } catch {
    return null
  }
}

export function clearPendingResults(): void {
  sessionStorage.removeItem(STORAGE_KEY)
}

export function usePendingResults() {
  const save = useCallback(
    (markers: OcrMarkerResult[], aiSummary: string | null) => {
      savePendingResults(markers, aiSummary)
    },
    [],
  )

  const get = useCallback(() => {
    return getPendingResults()
  }, [])

  const clear = useCallback(() => {
    clearPendingResults()
  }, [])

  return { save, get, clear }
}
