import type { UseFormRegisterReturn } from 'react-hook-form'
import type { MarkerDefinition } from '@/types/blood-test.types'

interface MarkerInputProps {
  marker: MarkerDefinition
  gender: 'male' | 'female' | null
  registration: UseFormRegisterReturn
  errorMessage?: string
}

export function MarkerInput({ marker, gender, registration, errorMessage }: MarkerInputProps) {
  const range = gender ? marker.referenceRanges[gender] : null

  return (
    <div className="flex items-start gap-3 rounded-lg border border-neutral p-3">
      <div className="min-w-0 flex-1">
        <label
          htmlFor={`marker-${marker.key}`}
          className="mb-1 block text-sm font-medium text-dark"
        >
          {marker.name}
        </label>
        <div className="flex items-center gap-2">
          <input
            id={`marker-${marker.key}`}
            type="number"
            step="any"
            placeholder="—"
            {...registration}
            className="w-28 rounded-lg border border-neutral bg-white px-3 py-1.5 text-sm text-dark placeholder:text-neutral-dark focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          />
          <span className="text-xs text-neutral-dark">{marker.unit}</span>
        </div>
        {range && (
          <p className="mt-1 text-xs text-neutral-dark">
            Norma: {range.min}–{range.max} {marker.unit}
          </p>
        )}
        {errorMessage && (
          <p className="mt-1 text-xs text-status-high">{errorMessage}</p>
        )}
      </div>
    </div>
  )
}
