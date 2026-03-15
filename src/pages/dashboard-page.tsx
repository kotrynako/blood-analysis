import { Link } from 'react-router-dom'
import { useBloodTests, useBloodTestResults } from '@/hooks/use-blood-tests'
import { useProfile } from '@/hooks/use-profile'
import { toMarkerResults, calculateSummary } from '@/utils/blood-test.utils'
import { LatestTestSummary } from '@/components/dashboard/latest-test-summary'
import { TestHistoryList } from '@/components/dashboard/test-history-list'

export function DashboardPage() {
  const { data: tests, isLoading: testsLoading } = useBloodTests()
  const { data: profile } = useProfile()

  const sortedTests = tests
    ? [...tests].sort(
        (a, b) => new Date(b.test_date).getTime() - new Date(a.test_date).getTime(),
      )
    : []

  const latestTest = sortedTests[0] ?? null

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-dark">Pagrindinis puslapis</h1>
        <Link
          to="/test/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
        >
          + Naujas tyrimas
        </Link>
      </div>

      {testsLoading ? (
        <p className="text-sm text-neutral-dark">Kraunama...</p>
      ) : (
        <>
          {latestTest && (
            <LatestTestSummaryWrapper
              testId={latestTest.id}
              test={latestTest}
              gender={profile?.gender ?? null}
            />
          )}
          <TestHistoryList tests={sortedTests} />
        </>
      )}
    </div>
  )
}

function LatestTestSummaryWrapper({
  testId,
  test,
  gender,
}: {
  testId: string
  test: import('@/types/database.types').BloodTest
  gender: 'male' | 'female' | null
}) {
  const { data: results } = useBloodTestResults(testId)
  const markerResults = results ? toMarkerResults(results, gender) : []
  const summary = markerResults.length > 0 ? calculateSummary(markerResults) : null

  if (!summary) return null

  return <LatestTestSummary test={test} summary={summary} />
}
