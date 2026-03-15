import { Link } from 'react-router-dom'
import type { BloodTest } from '@/types/database.types'
import { useDeleteBloodTest } from '@/hooks/use-blood-tests'

interface TestHistoryListProps {
  tests: BloodTest[]
}

export function TestHistoryList({ tests }: TestHistoryListProps) {
  const deleteTest = useDeleteBloodTest()

  if (tests.length === 0) {
    return (
      <div className="rounded-lg border border-neutral p-6 text-center">
        <p className="text-sm text-neutral-dark">Dar nėra tyrimų.</p>
        <Link
          to="/test/new"
          className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
        >
          Pridėti pirmą tyrimą
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-dark">Tyrimų istorija</h3>
      <div className="divide-y divide-neutral rounded-lg border border-neutral">
        {tests.map((test) => (
          <div key={test.id} className="flex items-center justify-between px-4 py-3">
            <Link
              to={`/test/${test.id}`}
              className="min-w-0 flex-1 hover:opacity-80"
            >
              <p className="text-sm font-medium text-dark">
                {new Date(test.test_date).toLocaleDateString('lt-LT', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              {test.notes && (
                <p className="mt-0.5 truncate text-xs text-neutral-dark">
                  {test.notes}
                </p>
              )}
            </Link>
            <button
              type="button"
              onClick={() => deleteTest.mutate(test.id)}
              disabled={deleteTest.isPending}
              className="ml-3 shrink-0 rounded px-2 py-1 text-xs text-status-high transition-colors hover:bg-status-high/10 disabled:opacity-50"
              aria-label="Ištrinti tyrimą"
            >
              Ištrinti
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
