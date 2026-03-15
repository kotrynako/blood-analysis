import type { MarkerKey } from '@/types/blood-test.types'

export type MarkerValues = Record<MarkerKey, string>

export interface TestEntryFormData {
  test_date: string
  notes: string
  markers: MarkerValues
}

export interface TestEntryFormProps {
  onSuccess?: () => void
}
