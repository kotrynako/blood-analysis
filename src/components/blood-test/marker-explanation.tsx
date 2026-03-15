import { Link } from 'react-router-dom'
import type { MarkerResult } from '@/types/blood-test.types'
import { MARKER_MAP } from '@/data/marker-definitions'
import { getStatusColor, getStatusLabel } from '@/utils/blood-test.utils'

interface MarkerExplanationProps {
  result: MarkerResult
  onClose?: () => void
}

export function MarkerExplanation({ result, onClose }: MarkerExplanationProps) {
  const definition = MARKER_MAP[result.key]
  if (!definition) return null

  const statusColor = getStatusColor(result.status)
  const statusLabel = getStatusLabel(result.status)

  const explanation =
    result.status === 'high'
      ? definition.highExplanation
      : result.status === 'low'
        ? definition.lowExplanation
        : null

  return (
    <div className="space-y-4 rounded-lg border border-neutral bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-dark">{definition.name}</h3>
          <p className="mt-0.5 text-xs text-neutral-dark">{definition.unit}</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-dark transition-colors hover:text-dark"
            aria-label="Uždaryti"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className={`text-2xl font-bold ${statusColor}`}>{result.value}</span>
        <span className="text-sm text-neutral-dark">{result.unit}</span>
        <span className={`ml-auto text-sm font-medium ${statusColor}`}>{statusLabel}</span>
      </div>

      <div className="text-sm text-neutral-dark">
        <p className="font-medium text-dark">Ką matuoja</p>
        <p className="mt-1">{definition.description}</p>
      </div>

      {explanation && (
        <div className="text-sm text-neutral-dark">
          <p className="font-medium text-dark">
            {result.status === 'high' ? 'Aukšta reikšmė' : 'Žema reikšmė'}
          </p>
          <p className="mt-1">{explanation}</p>
        </div>
      )}

      <div className="text-sm text-neutral-dark">
        <p className="font-medium text-dark">Normos ribos</p>
        <p className="mt-1">
          {result.referenceMin}–{result.referenceMax} {result.unit}
        </p>
      </div>

      {definition.recommendations.length > 0 && (
        <div className="text-sm text-neutral-dark">
          <p className="font-medium text-dark">Rekomendacijos</p>
          <ul className="mt-1 list-inside list-disc space-y-0.5">
            {definition.recommendations.map((rec) => (
              <li key={rec}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      <Link
        to={`/marker/${result.key}/history`}
        className="inline-block text-xs font-medium text-primary hover:underline"
      >
        Peržiūrėti istoriją →
      </Link>
    </div>
  )
}
