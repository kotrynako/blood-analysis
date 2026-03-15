import { describe, it, expect } from 'vitest'
import { MARKER_DEFINITIONS, MARKER_MAP, MARKER_KEYS } from './marker-definitions'

describe('MARKER_DEFINITIONS', () => {
  it('contains exactly 14 markers', () => {
    expect(MARKER_DEFINITIONS).toHaveLength(14)
  })

  it('each marker has required fields', () => {
    for (const marker of MARKER_DEFINITIONS) {
      expect(marker.key).toBeTruthy()
      expect(marker.name).toBeTruthy()
      expect(marker.unit).toBeTruthy()
      expect(marker.description).toBeTruthy()
      expect(marker.highExplanation).toBeTruthy()
      expect(marker.lowExplanation).toBeTruthy()
      expect(marker.recommendations.length).toBeGreaterThan(0)
      expect(marker.referenceRanges.male.min).toBeDefined()
      expect(marker.referenceRanges.male.max).toBeDefined()
      expect(marker.referenceRanges.female.min).toBeDefined()
      expect(marker.referenceRanges.female.max).toBeDefined()
    }
  })

  it('male min is less than male max for all markers', () => {
    for (const marker of MARKER_DEFINITIONS) {
      expect(marker.referenceRanges.male.min).toBeLessThan(
        marker.referenceRanges.male.max,
      )
    }
  })

  it('female min is less than female max for all markers', () => {
    for (const marker of MARKER_DEFINITIONS) {
      expect(marker.referenceRanges.female.min).toBeLessThan(
        marker.referenceRanges.female.max,
      )
    }
  })

  it('has unique keys', () => {
    const keys = MARKER_DEFINITIONS.map((m) => m.key)
    expect(new Set(keys).size).toBe(keys.length)
  })
})

describe('MARKER_MAP', () => {
  it('maps all 14 keys', () => {
    expect(Object.keys(MARKER_MAP)).toHaveLength(14)
  })

  it('looks up hemoglobin correctly', () => {
    expect(MARKER_MAP.hemoglobin.name).toBe('Hemoglobinas')
    expect(MARKER_MAP.hemoglobin.unit).toBe('g/L')
  })
})

describe('MARKER_KEYS', () => {
  it('contains 14 keys', () => {
    expect(MARKER_KEYS).toHaveLength(14)
  })

  it('includes expected keys', () => {
    expect(MARKER_KEYS).toContain('hemoglobin')
    expect(MARKER_KEYS).toContain('wbc')
    expect(MARKER_KEYS).toContain('esr')
  })
})
