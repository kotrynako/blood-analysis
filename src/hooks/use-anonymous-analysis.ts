import { useState, useCallback, useRef } from 'react'

import type { MarkerResult } from '@/types/blood-test.types'
import type { OcrMarkerResult } from '@/services/ocr.service'
import { ocrService } from '@/services/ocr.service'
import { aiInsightsService } from '@/services/ai-insights.service'
import { toMarkerResults } from '@/utils/blood-test.utils'
import type { AnalysisStep } from '@/pages/landing-page/landing-page.types'

export interface AnonymousAnalysisResult {
  step: AnalysisStep
  ocrMarkers: OcrMarkerResult[]
  markerResults: MarkerResult[]
  aiSummary: string | null
  error: string | null
  analyze: (file: File) => Promise<void>
  retry: () => void
  reset: () => void
}

export function useAnonymousAnalysis(): AnonymousAnalysisResult {
  const [step, setStep] = useState<AnalysisStep>('idle')
  const [ocrMarkers, setOcrMarkers] = useState<OcrMarkerResult[]>([])
  const [markerResults, setMarkerResults] = useState<MarkerResult[]>([])
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const lastFileRef = useRef<File | null>(null)

  const runAnalysis = useCallback(async (file: File) => {
    lastFileRef.current = file
    setStep('processing')
    setError(null)
    setOcrMarkers([])
    setMarkerResults([])
    setAiSummary(null)

    try {
      const ocrResult = await ocrService.extractMarkers(file)

      if (ocrResult.markers.length === 0) {
        setStep('error')
        setError('Nepavyko atpažinti jokių rodiklių. Bandykite įkelti aiškesnę nuotrauką arba PDF.')
        return
      }

      setOcrMarkers(ocrResult.markers)

      const dbResults = ocrResult.markers.map((m) => ({
        id: crypto.randomUUID(),
        test_id: 'anonymous',
        marker_key: m.marker_key,
        value: m.value,
        unit: m.unit,
        created_at: new Date().toISOString(),
      }))
      const converted = toMarkerResults(dbResults, null)
      setMarkerResults(converted)

      const aiInput = {
        results: converted,
        gender: null as 'male' | 'female' | null,
        birthYear: null as number | null,
        previousResults: null,
      }

      if (aiInsightsService.isAvailable()) {
        const summary = await aiInsightsService.generate(aiInput)
        setAiSummary(summary)
      }

      setStep('results')
    } catch (err) {
      setStep('error')
      setError(
        err instanceof Error
          ? err.message
          : 'Įvyko nenumatyta klaida. Bandykite dar kartą.',
      )
    }
  }, [])

  const retry = useCallback(() => {
    if (lastFileRef.current) {
      runAnalysis(lastFileRef.current)
    }
  }, [runAnalysis])

  const reset = useCallback(() => {
    setStep('idle')
    setOcrMarkers([])
    setMarkerResults([])
    setAiSummary(null)
    setError(null)
    lastFileRef.current = null
  }, [])

  return {
    step,
    ocrMarkers,
    markerResults,
    aiSummary,
    error,
    analyze: runAnalysis,
    retry,
    reset,
  }
}
