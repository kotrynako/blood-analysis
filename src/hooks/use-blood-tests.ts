import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/use-auth'
import {
  bloodTestService,
  type CreateBloodTestInput,
  type CreateBloodTestResultInput,
} from '@/services/blood-test.service'

const BLOOD_TESTS_KEY = ['blood-tests'] as const
const bloodTestKey = (id: string) => ['blood-test', id] as const
const bloodTestResultsKey = (id: string) => ['blood-test-results', id] as const

export function useBloodTests() {
  const { user } = useAuth()

  return useQuery({
    queryKey: BLOOD_TESTS_KEY,
    queryFn: () => bloodTestService.getAll(user!.id),
    enabled: !!user,
  })
}

export function useBloodTest(testId: string) {
  return useQuery({
    queryKey: bloodTestKey(testId),
    queryFn: () => bloodTestService.getById(testId),
    enabled: !!testId,
  })
}

export function useBloodTestResults(testId: string) {
  return useQuery({
    queryKey: bloodTestResultsKey(testId),
    queryFn: () => bloodTestService.getResults(testId),
    enabled: !!testId,
  })
}

const markerHistoryKey = (key: string) => ['marker-history', key] as const

export function useMarkerHistory(markerKey: string) {
  const { user } = useAuth()

  return useQuery({
    queryKey: markerHistoryKey(markerKey),
    queryFn: () => bloodTestService.getMarkerHistory(user!.id, markerKey),
    enabled: !!user && !!markerKey,
  })
}

export function useCreateBloodTest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: {
      test: CreateBloodTestInput
      results: Omit<CreateBloodTestResultInput, 'test_id'>[]
    }) => bloodTestService.createWithResults(input.test, input.results),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BLOOD_TESTS_KEY })
    },
  })
}

export function useDeleteBloodTest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (testId: string) => bloodTestService.remove(testId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BLOOD_TESTS_KEY })
    },
  })
}
