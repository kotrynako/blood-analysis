import type { MarkerResult } from '@/types/blood-test.types'
import { MARKER_MAP } from '@/data/marker-definitions'
import {
  getStatusColor,
  getStatusBgColor,
  getStatusLabel,
} from '@/utils/blood-test.utils'

interface MarkerCardProps {
  result: MarkerResult
  onClick?: () => void
}

export function MarkerCard({ result, onClick }: MarkerCardProps) {
  const definition = MARKER_MAP[result.key]
  const statusColor = getStatusColor(result.status)
  const statusBg = getStatusBgColor(result.status)
  const statusLabel = getStatusLabel(result.status)

  const percentage = Math.min(
    Math.max(
      ((result.value - result.referenceMin) /
        (result.referenceMax - result.referenceMin)) *
        100,
      0,
    ),
    100,
  )

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-lg border border-neutral p-4 text-left transition-colors hover:border-primary/30 hover:shadow-sm"
    >
      <div className="mb-2 flex items-start justify-between">
        <h4 className="text-sm font-medium text-dark">
          {definition?.name ?? result.key}
        </h4>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBg} ${statusColor}`}
        >
          {statusLabel}
        </span>
      </div>

      <div className="mb-3 flex items-baseline gap-1">
        <span className={`text-xl font-bold ${statusColor}`}>
          {result.value}
        </span>
        <span className="text-xs text-neutral-dark">{result.unit}</span>
      </div>

      <div className="space-y-1">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral">
          <div
            className={`h-full rounded-full transition-all ${
              result.status === 'normal'
                ? 'bg-status-normal'
                : result.status === 'low'
                  ? 'bg-status-low'
                  : 'bg-status-high'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-neutral-dark">
          <span>{result.referenceMin}</span>
          <span>{result.referenceMax} {result.unit}</span>
        </div>
      </div>
    </button>
  )
}
