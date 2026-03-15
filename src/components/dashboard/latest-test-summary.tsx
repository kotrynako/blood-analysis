import { Link } from 'react-router-dom'
import type { BloodTest } from '@/types/database.types'
import type { TestSummary } from '@/types/blood-test.types'
import { TestSummaryCard } from '@/components/blood-test/test-summary'

interface LatestTestSummaryProps {
  test: BloodTest
  summary: TestSummary
}

export function LatestTestSummary({ test, summary }: LatestTestSummaryProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-dark">Paskutinis tyrimas</h3>
        <Link
          to={`/test/${test.id}`}
          className="text-xs font-medium text-primary hover:underline"
        >
          Peržiūrėti →
        </Link>
      </div>

      <p className="text-xs text-neutral-dark">
        {new Date(test.test_date).toLocaleDateString('lt-LT', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
        {test.notes && <span> · {test.notes}</span>}
      </p>

      <TestSummaryCard summary={summary} />
    </div>
  )
}
