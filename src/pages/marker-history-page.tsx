import { useParams, Link } from 'react-router-dom'
import { useMarkerHistory } from '@/hooks/use-blood-tests'
import { useProfile } from '@/hooks/use-profile'
import { MARKER_MAP } from '@/data/marker-definitions'
import { getReferenceRange, getMarkerStatus, getStatusColor, getStatusLabel } from '@/utils/blood-test.utils'
import { MarkerTrendChart } from '@/components/charts/marker-trend-chart'
import type { MarkerKey } from '@/types/blood-test.types'
import type { TrendDataPoint } from '@/components/charts/marker-trend-chart'

export function MarkerHistoryPage() {
  const { key } = useParams<{ key: string }>()
  const markerKey = key as MarkerKey
  const { data: history, isLoading } = useMarkerHistory(markerKey)
  const { data: profile } = useProfile()

  const definition = MARKER_MAP[markerKey]
  const gender = profile?.gender ?? null
  const range = definition ? getReferenceRange(markerKey, gender) : null

  const chartData: TrendDataPoint[] = (history ?? []).map((h) => ({
    date: h.test_date,
    value: h.value,
  }))

  if (isLoading) {
    return (
      <div className="p-8">
        <p className="text-sm text-neutral-dark">Kraunama...</p>
      </div>
    )
  }

  if (!definition) {
    return (
      <div className="p-8">
        <p className="text-status-high">Nežinomas rodiklis: {key}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 sm:p-8">
      <div>
        <Link to="/dashboard" className="text-xs text-primary hover:underline">
          ← Grįžti
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-dark">{definition.name}</h1>
        <p className="mt-1 text-sm text-neutral-dark">{definition.description}</p>
      </div>

      {range && (
        <MarkerTrendChart
          data={chartData}
          unit={definition.unit}
          referenceMin={range.min}
          referenceMax={range.max}
          markerName={definition.name}
        />
      )}

      {history && history.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-dark">Reikšmių lentelė</h3>
          <div className="overflow-x-auto rounded-lg border border-neutral">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral bg-neutral/30">
                  <th className="px-4 py-2 text-left font-medium text-dark">Data</th>
                  <th className="px-4 py-2 text-right font-medium text-dark">Reikšmė</th>
                  <th className="px-4 py-2 text-right font-medium text-dark">Būsena</th>
                </tr>
              </thead>
              <tbody>
                {[...history].reverse().map((row) => {
                  const status = getMarkerStatus(row.value, markerKey, gender)
                  return (
                    <tr key={row.id} className="border-b border-neutral last:border-0">
                      <td className="px-4 py-2 text-neutral-dark">
                        {new Date(row.test_date).toLocaleDateString('lt-LT')}
                      </td>
                      <td className="px-4 py-2 text-right font-medium text-dark">
                        {row.value} {row.unit}
                      </td>
                      <td className={`px-4 py-2 text-right font-medium ${getStatusColor(status)}`}>
                        {getStatusLabel(status)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
