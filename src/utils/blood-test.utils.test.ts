import { describe, it, expect } from 'vitest'
import {
  getMarkerStatus,
  getReferenceRange,
  toMarkerResult,
  calculateSummary,
  getStatusColor,
  getStatusBgColor,
  getStatusLabel,
} from './blood-test.utils'
import type { BloodTestResult } from '@/types/database.types'
import type { MarkerResult } from '@/types/blood-test.types'

describe('getMarkerStatus', () => {
  it('returns normal when value is within range', () => {
    expect(getMarkerStatus(150, 'hemoglobin', 'male')).toBe('normal')
  })

  it('returns low when value is below min', () => {
    expect(getMarkerStatus(100, 'hemoglobin', 'male')).toBe('low')
  })

  it('returns high when value is above max', () => {
    expect(getMarkerStatus(200, 'hemoglobin', 'male')).toBe('high')
  })

  it('uses female ranges when gender is female', () => {
    expect(getMarkerStatus(125, 'hemoglobin', 'female')).toBe('normal')
    expect(getMarkerStatus(125, 'hemoglobin', 'male')).toBe('low')
  })

  it('defaults to male ranges when gender is null', () => {
    expect(getMarkerStatus(150, 'hemoglobin', null)).toBe('normal')
    expect(getMarkerStatus(100, 'hemoglobin', null)).toBe('low')
  })

  it('returns normal at boundary values (min)', () => {
    expect(getMarkerStatus(130, 'hemoglobin', 'male')).toBe('normal')
  })

  it('returns normal at boundary values (max)', () => {
    expect(getMarkerStatus(175, 'hemoglobin', 'male')).toBe('normal')
  })
})

describe('getReferenceRange', () => {
  it('returns male range', () => {
    const range = getReferenceRange('hemoglobin', 'male')
    expect(range).toEqual({ min: 130, max: 175 })
  })

  it('returns female range', () => {
    const range = getReferenceRange('hemoglobin', 'female')
    expect(range).toEqual({ min: 120, max: 160 })
  })

  it('defaults to male when null', () => {
    const range = getReferenceRange('hemoglobin', null)
    expect(range).toEqual({ min: 130, max: 175 })
  })
})

describe('toMarkerResult', () => {
  it('converts BloodTestResult to MarkerResult', () => {
    const dbResult: BloodTestResult = {
      id: '1',
      test_id: 't1',
      marker_key: 'hemoglobin',
      value: 140,
      unit: 'g/L',
      created_at: '2024-01-01',
    }

    const result = toMarkerResult(dbResult, 'male')

    expect(result.key).toBe('hemoglobin')
    expect(result.value).toBe(140)
    expect(result.unit).toBe('g/L')
    expect(result.status).toBe('normal')
    expect(result.referenceMin).toBe(130)
    expect(result.referenceMax).toBe(175)
  })
})

describe('calculateSummary', () => {
  it('counts statuses correctly', () => {
    const results: MarkerResult[] = [
      { key: 'hemoglobin', value: 150, unit: 'g/L', status: 'normal', referenceMin: 130, referenceMax: 175 },
      { key: 'wbc', value: 2, unit: '×10⁹/L', status: 'low', referenceMin: 4, referenceMax: 10 },
      { key: 'rbc', value: 7, unit: '×10¹²/L', status: 'high', referenceMin: 4.5, referenceMax: 5.9 },
      { key: 'plt', value: 250, unit: '×10⁹/L', status: 'normal', referenceMin: 150, referenceMax: 400 },
    ]

    const summary = calculateSummary(results)

    expect(summary.totalMarkers).toBe(4)
    expect(summary.normalCount).toBe(2)
    expect(summary.lowCount).toBe(1)
    expect(summary.highCount).toBe(1)
  })

  it('handles empty results', () => {
    const summary = calculateSummary([])
    expect(summary.totalMarkers).toBe(0)
    expect(summary.normalCount).toBe(0)
  })
})

describe('getStatusColor', () => {
  it('returns correct color for each status', () => {
    expect(getStatusColor('normal')).toBe('text-status-normal')
    expect(getStatusColor('low')).toBe('text-status-low')
    expect(getStatusColor('high')).toBe('text-status-high')
  })
})

describe('getStatusBgColor', () => {
  it('returns correct bg color for each status', () => {
    expect(getStatusBgColor('normal')).toBe('bg-status-normal/10')
    expect(getStatusBgColor('low')).toBe('bg-status-low/10')
    expect(getStatusBgColor('high')).toBe('bg-status-high/10')
  })
})

describe('getStatusLabel', () => {
  it('returns Lithuanian labels', () => {
    expect(getStatusLabel('normal')).toBe('Norma')
    expect(getStatusLabel('low')).toBe('Žemas')
    expect(getStatusLabel('high')).toBe('Aukštas')
  })
})
