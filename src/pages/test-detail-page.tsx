import { useParams, useNavigate } from 'react-router-dom'
import { useBloodTest, useBloodTestResults, useDeleteBloodTest } from '@/hooks/use-blood-tests'
import { useProfile } from '@/hooks/use-profile'
import { toMarkerResults, calculateSummary } from '@/utils/blood-test.utils'
import { TestSummaryCard } from '@/components/blood-test/test-summary'
import { MarkerResultsGrid } from '@/components/blood-test/marker-results-grid'

export function TestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: test, isLoading: testLoading } = useBloodTest(id ?? '')
  const { data: rawResults, isLoading: resultsLoading } = useBloodTestResults(id ?? '')
  const { data: profile } = useProfile()
  const deleteTest = useDeleteBloodTest()

  const isLoading = testLoading || resultsLoading
  const gender = profile?.gender ?? null
  const markerResults = rawResults ? toMarkerResults(rawResults, gender) : []
  const summary = markerResults.length > 0 ? calculateSummary(markerResults) : null

  const handleDelete = async () => {
    if (!id) return
    await deleteTest.mutateAsync(id)
    navigate('/dashboard')
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <p className="text-neutral-dark">Kraunama...</p>
      </div>
    )
  }

  if (!test) {
    return (
      <div className="p-8">
        <p className="text-status-high">Tyrimas nerastas.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-dark">Tyrimo detalės</h1>
          <p className="mt-1 text-sm text-neutral-dark">
            {new Date(test.test_date).toLocaleDateString('lt-LT')}
            {test.notes && <span> · {test.notes}</span>}
          </p>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteTest.isPending}
          className="rounded-lg border border-status-high px-3 py-1.5 text-sm font-medium text-status-high transition-colors hover:bg-status-high/10 disabled:opacity-50"
        >
          {deleteTest.isPending ? 'Trinama...' : 'Ištrinti'}
        </button>
      </div>

      {summary && <TestSummaryCard summary={summary} />}

      {markerResults.length > 0 ? (
        <MarkerResultsGrid results={markerResults} />
      ) : (
        <p className="text-sm text-neutral-dark">Šis tyrimas neturi rezultatų.</p>
      )}
    </div>
  )
}
