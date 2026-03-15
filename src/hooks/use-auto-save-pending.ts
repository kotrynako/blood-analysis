import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/hooks/use-auth'
import { getPendingResults, clearPendingResults } from '@/hooks/use-pending-results'
import { bloodTestService } from '@/services/blood-test.service'

export function useAutoSavePending() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const processedRef = useRef(false)

  useEffect(() => {
    if (!user || processedRef.current) return

    const pending = getPendingResults()
    if (!pending || pending.markers.length === 0) return

    processedRef.current = true

    const save = async () => {
      try {
        const { test } = await bloodTestService.createWithResults(
          {
            user_id: user.id,
            test_date: new Date().toISOString().split('T')[0],
          },
          pending.markers.map((m) => ({
            marker_key: m.marker_key,
            value: m.value,
            unit: m.unit,
          })),
        )

        if (pending.aiSummary) {
          await bloodTestService.updateAiSummary(test.id, pending.aiSummary)
        }

        clearPendingResults()
        navigate(`/test/${test.id}`, { replace: true })
      } catch (err) {
        console.error('Nepavyko išsaugoti anoniminių rezultatų:', err)
        clearPendingResults()
        navigate('/dashboard', { replace: true })
      }
    }

    save()
  }, [user, navigate])
}
