import { useCallback, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/use-auth'
import { useProfile } from '@/hooks/use-profile'
import { bloodTestService } from '@/services/blood-test.service'
import { aiInsightsService, type AiInsightsInput } from '@/services/ai-insights.service'
import { toMarkerResult } from '@/utils/blood-test.utils'
import type { BloodTestResult } from '@/types/database.types'
import type { MarkerResult } from '@/types/blood-test.types'

const aiInsightsKey = (testId: string) => ['ai-insights', testId] as const

interface UseAiInsightsOptions {
  testId: string
  cachedSummary: string | null
  currentResults: BloodTestResult[]
  previousResults?: BloodTestResult[] | null
}

export function useAiInsights({
  testId,
  cachedSummary,
  currentResults,
  previousResults,
}: UseAiInsightsOptions) {
  const { user } = useAuth()
  const { data: profile } = useProfile()
  const queryClient = useQueryClient()
  const [isRegenerating, setIsRegenerating] = useState(false)

  const gender = profile?.gender ?? null
  const birthYear = profile?.birth_year ?? null
  const available = aiInsightsService.isAvailable()

  const buildInput = useCallback((): AiInsightsInput => {
    const results: MarkerResult[] = currentResults.map((r) => toMarkerResult(r, gender))
    const prev: MarkerResult[] | null = previousResults?.length
      ? previousResults.map((r) => toMarkerResult(r, gender))
      : null

    return { results, gender, birthYear, previousResults: prev }
  }, [currentResults, previousResults, gender, birthYear])

  const query = useQuery({
    queryKey: aiInsightsKey(testId),
    queryFn: async () => {
      if (cachedSummary) return cachedSummary

      const input = buildInput()
      const summary = await aiInsightsService.generate(input)

      try {
        await bloodTestService.updateAiSummary(testId, summary)
      } catch {
        // Cache save failed — non-critical, still return the summary
      }

      return summary
    },
    enabled: !!user && !!testId && available && currentResults.length > 0,
    staleTime: Infinity,
    retry: false,
  })

  const regenerate = useCallback(async () => {
    if (!available) return

    setIsRegenerating(true)
    try {
      const input = buildInput()
      const summary = await aiInsightsService.generate(input)

      try {
        await bloodTestService.updateAiSummary(testId, summary)
      } catch {
        // Cache save failed — non-critical
      }

      queryClient.setQueryData(aiInsightsKey(testId), summary)
    } finally {
      setIsRegenerating(false)
    }
  }, [available, buildInput, testId, queryClient])

  return {
    summary: query.data ?? null,
    isLoading: query.isLoading,
    isRegenerating,
    error: query.error as Error | null,
    available,
    regenerate,
  }
}
