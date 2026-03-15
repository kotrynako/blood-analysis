import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useBloodTest, useBloodTests, useBloodTestResults, useDeleteBloodTest } from '@/hooks/use-blood-tests'
import { useProfile } from '@/hooks/use-profile'
import { useAiInsights } from '@/hooks/use-ai-insights'
import { toMarkerResults, calculateSummary } from '@/utils/blood-test.utils'
import { TestSummaryCard } from '@/components/blood-test/test-summary'
import { MarkerResultsGrid } from '@/components/blood-test/marker-results-grid'
import { AiInsightsCard } from '@/components/blood-test/ai-insights-card'

export function TestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: test, isLoading: testLoading } = useBloodTest(id ?? '')
  const { data: rawResults, isLoading: resultsLoading } = useBloodTestResults(id ?? '')
  const { data: profile } = useProfile()
  const deleteTest = useDeleteBloodTest()

  const { data: allTests } = useBloodTests()

  const previousTestId = useMemo(() => {
    if (!allTests || !test) return null
    const sorted = [...allTests].sort(
      (a, b) => new Date(b.test_date).getTime() - new Date(a.test_date).getTime(),
    )
    const currentIndex = sorted.findIndex((t) => t.id === id)
    return currentIndex >= 0 && currentIndex < sorted.length - 1
      ? sorted[currentIndex + 1].id
      : null
  }, [allTests, test, id])

  const { data: prevRawResults } = useBloodTestResults(previousTestId ?? '')

  const isLoading = testLoading || resultsLoading
  const gender = profile?.gender ?? null
  const markerResults = rawResults ? toMarkerResults(rawResults, gender) : []
  const summary = markerResults.length > 0 ? calculateSummary(markerResults) : null

  const aiInsights = useAiInsights({
    testId: id ?? '',
    cachedSummary: test?.ai_summary ?? null,
    currentResults: rawResults ?? [],
    previousResults: prevRawResults ?? null,
  })

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

      <AiInsightsCard
        summary={aiInsights.summary}
        isLoading={aiInsights.isLoading}
        isRegenerating={aiInsights.isRegenerating}
        error={aiInsights.error}
        available={aiInsights.available}
        onRegenerate={aiInsights.regenerate}
      />

      {markerResults.length > 0 ? (
        <MarkerResultsGrid results={markerResults} />
      ) : (
        <p className="text-sm text-neutral-dark">Šis tyrimas neturi rezultatų.</p>
      )}
    </div>
  )
}
