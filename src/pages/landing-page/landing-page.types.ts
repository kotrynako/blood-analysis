import type { OcrMarkerResult } from '@/services/ocr.service'

export type AnalysisStep = 'idle' | 'processing' | 'results' | 'error'

export interface AnonymousAnalysisState {
  step: AnalysisStep
  markers: OcrMarkerResult[]
  aiSummary: string | null
  error: string | null
}

export interface DemoResultItem {
  name: string
  category: string
  value: string
  unit: string
  status: 'optimal' | 'low' | 'high'
  trend: number
}
