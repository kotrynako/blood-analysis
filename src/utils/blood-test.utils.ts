import type { MarkerStatus, MarkerResult, TestSummary, MarkerKey } from '@/types/blood-test.types'
import type { BloodTestResult } from '@/types/database.types'
import { MARKER_MAP } from '@/data/marker-definitions'

export function getMarkerStatus(
  value: number,
  markerKey: MarkerKey,
  gender: 'male' | 'female' | null,
): MarkerStatus {
  const definition = MARKER_MAP[markerKey]
  if (!definition) return 'normal'

  const effectiveGender = gender ?? 'male'
  const range = definition.referenceRanges[effectiveGender]

  if (value < range.min) return 'low'
  if (value > range.max) return 'high'
  return 'normal'
}

export function getReferenceRange(
  markerKey: MarkerKey,
  gender: 'male' | 'female' | null,
): { min: number; max: number } {
  const definition = MARKER_MAP[markerKey]
  const effectiveGender = gender ?? 'male'
  return definition.referenceRanges[effectiveGender]
}

export function toMarkerResult(
  result: BloodTestResult,
  gender: 'male' | 'female' | null,
): MarkerResult {
  const key = result.marker_key as MarkerKey
  const range = getReferenceRange(key, gender)

  return {
    key,
    value: result.value,
    unit: result.unit,
    status: getMarkerStatus(result.value, key, gender),
    referenceMin: range.min,
    referenceMax: range.max,
  }
}

export function toMarkerResults(
  results: BloodTestResult[],
  gender: 'male' | 'female' | null,
): MarkerResult[] {
  return results.map((r) => toMarkerResult(r, gender))
}

export function calculateSummary(results: MarkerResult[]): TestSummary {
  let normalCount = 0
  let lowCount = 0
  let highCount = 0

  for (const r of results) {
    if (r.status === 'normal') normalCount++
    else if (r.status === 'low') lowCount++
    else highCount++
  }

  return {
    totalMarkers: results.length,
    normalCount,
    lowCount,
    highCount,
  }
}

export function getStatusColor(status: MarkerStatus): string {
  switch (status) {
    case 'normal':
      return 'text-status-normal'
    case 'low':
      return 'text-status-low'
    case 'high':
      return 'text-status-high'
  }
}

export function getStatusBgColor(status: MarkerStatus): string {
  switch (status) {
    case 'normal':
      return 'bg-status-normal/10'
    case 'low':
      return 'bg-status-low/10'
    case 'high':
      return 'bg-status-high/10'
  }
}

export function getStatusLabel(status: MarkerStatus): string {
  switch (status) {
    case 'normal':
      return 'Norma'
    case 'low':
      return 'Žemas'
    case 'high':
      return 'Aukštas'
  }
}
