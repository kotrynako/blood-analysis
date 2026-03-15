import type { MarkerResult } from '@/types/blood-test.types'
import { MARKER_MAP } from '@/data/marker-definitions'
import {
  getStatusColor,
  getStatusBgColor,
  getStatusLabel,
} from '@/utils/blood-test.utils'

interface AnonymousResultsProps {
  markers: MarkerResult[]
}

export function AnonymousResults({ markers }: AnonymousResultsProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <svg
            className="h-4 w-4 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-dark">
          Atpažinti rodikliai ({markers.length})
        </h2>
      </div>

      <div className="overflow-x-auto rounded-lg border border-neutral bg-white">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-neutral bg-neutral-light/50">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-dark">
                Rodiklis
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-dark">
                Reikšmė
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-dark">
                Norma
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-dark">
                Būsena
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral">
            {markers.map((marker) => {
              const definition = MARKER_MAP[marker.key]
              const name = definition?.name ?? marker.key
              const statusColor = getStatusColor(marker.status)
              const statusBg = getStatusBgColor(marker.status)
              const statusLabel = getStatusLabel(marker.status)

              return (
                <tr
                  key={marker.key}
                  className="transition-colors hover:bg-neutral-light/30"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-dark">{name}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-dark">
                    {marker.value} {marker.unit}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-dark">
                    {marker.referenceMin}–{marker.referenceMax} {marker.unit}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBg} ${statusColor}`}
                    >
                      {statusLabel}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
