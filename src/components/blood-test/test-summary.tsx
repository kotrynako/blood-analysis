import type { TestSummary } from '@/types/blood-test.types'

interface TestSummaryCardProps {
  summary: TestSummary
}

export function TestSummaryCard({ summary }: TestSummaryCardProps) {
  const normalPercent =
    summary.totalMarkers > 0
      ? Math.round((summary.normalCount / summary.totalMarkers) * 100)
      : 0

  return (
    <div className="rounded-lg border border-neutral p-5">
      <h3 className="mb-4 text-sm font-medium text-dark">Tyrimo santrauka</h3>

      <div className="mb-4 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-status-normal/10 px-3 py-2">
          <p className="text-xl font-bold text-status-normal">{summary.normalCount}</p>
          <p className="text-xs text-neutral-dark">Norma</p>
        </div>
        <div className="rounded-lg bg-status-low/10 px-3 py-2">
          <p className="text-xl font-bold text-status-low">{summary.lowCount}</p>
          <p className="text-xs text-neutral-dark">Žemi</p>
        </div>
        <div className="rounded-lg bg-status-high/10 px-3 py-2">
          <p className="text-xl font-bold text-status-high">{summary.highCount}</p>
          <p className="text-xs text-neutral-dark">Aukšti</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-neutral-dark">
          <span>Normoje</span>
          <span>{normalPercent}%</span>
        </div>
        <div className="flex h-2.5 overflow-hidden rounded-full bg-neutral">
          {summary.normalCount > 0 && (
            <div
              className="bg-status-normal transition-all"
              style={{
                width: `${(summary.normalCount / summary.totalMarkers) * 100}%`,
              }}
            />
          )}
          {summary.lowCount > 0 && (
            <div
              className="bg-status-low transition-all"
              style={{
                width: `${(summary.lowCount / summary.totalMarkers) * 100}%`,
              }}
            />
          )}
          {summary.highCount > 0 && (
            <div
              className="bg-status-high transition-all"
              style={{
                width: `${(summary.highCount / summary.totalMarkers) * 100}%`,
              }}
            />
          )}
        </div>
        <p className="text-xs text-neutral-dark">
          Iš viso rodiklių: {summary.totalMarkers}
        </p>
      </div>
    </div>
  )
}
