export type MarkerStatus = 'normal' | 'low' | 'high'

export type MarkerKey =
  | 'hemoglobin'
  | 'rbc'
  | 'wbc'
  | 'plt'
  | 'hematocrit'
  | 'mcv'
  | 'mch'
  | 'mchc'
  | 'neutrophils'
  | 'lymphocytes'
  | 'monocytes'
  | 'eosinophils'
  | 'basophils'
  | 'esr'

export interface MarkerDefinition {
  key: MarkerKey
  name: string
  unit: string
  description: string
  highExplanation: string
  lowExplanation: string
  recommendations: string[]
  referenceRanges: {
    male: { min: number; max: number }
    female: { min: number; max: number }
  }
}

export interface MarkerResult {
  key: MarkerKey
  value: number
  unit: string
  status: MarkerStatus
  referenceMin: number
  referenceMax: number
}

export interface TestSummary {
  totalMarkers: number
  normalCount: number
  lowCount: number
  highCount: number
}

export interface BloodTestWithResults {
  id: string
  testDate: string
  notes: string | null
  fileUrl: string | null
  createdAt: string
  results: MarkerResult[]
  summary: TestSummary
}

export interface MarkerTrendPoint {
  date: string
  value: number
  status: MarkerStatus
}
