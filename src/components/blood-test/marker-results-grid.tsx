import { useState } from 'react'
import type { MarkerResult } from '@/types/blood-test.types'
import { MarkerCard } from './marker-card'
import { MarkerExplanation } from './marker-explanation'

interface MarkerResultsGridProps {
  results: MarkerResult[]
}

export function MarkerResultsGrid({ results }: MarkerResultsGridProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  const selectedResult = results.find((r) => r.key === selectedKey)

  return (
    <div className="space-y-4">
      {selectedResult && (
        <MarkerExplanation
          result={selectedResult}
          onClose={() => setSelectedKey(null)}
        />
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {results.map((result) => (
          <MarkerCard
            key={result.key}
            result={result}
            onClick={() =>
              setSelectedKey(selectedKey === result.key ? null : result.key)
            }
          />
        ))}
      </div>
    </div>
  )
}
