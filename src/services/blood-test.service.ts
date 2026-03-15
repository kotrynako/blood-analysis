import { supabase } from '@/lib/supabase'
import type { BloodTest, BloodTestResult } from '@/types/database.types'

export interface CreateBloodTestInput {
  user_id: string
  test_date: string
  notes?: string | null
  file_url?: string | null
}

export interface CreateBloodTestResultInput {
  test_id: string
  marker_key: string
  value: number
  unit: string
}

export const bloodTestService = {
  async getAll(userId: string): Promise<BloodTest[]> {
    const { data, error } = await supabase
      .from('blood_tests')
      .select('*')
      .eq('user_id', userId)
      .order('test_date', { ascending: false })

    if (error) throw error
    return data as BloodTest[]
  },

  async getById(testId: string): Promise<BloodTest> {
    const { data, error } = await supabase
      .from('blood_tests')
      .select('*')
      .eq('id', testId)
      .single()

    if (error) throw error
    return data as BloodTest
  },

  async create(input: CreateBloodTestInput): Promise<BloodTest> {
    const { data, error } = await supabase
      .from('blood_tests')
      .insert(input)
      .select()
      .single()

    if (error) throw error
    return data as BloodTest
  },

  async remove(testId: string): Promise<void> {
    const { error } = await supabase
      .from('blood_tests')
      .delete()
      .eq('id', testId)

    if (error) throw error
  },

  async getResults(testId: string): Promise<BloodTestResult[]> {
    const { data, error } = await supabase
      .from('blood_test_results')
      .select('*')
      .eq('test_id', testId)

    if (error) throw error
    return data as BloodTestResult[]
  },

  async createResults(results: CreateBloodTestResultInput[]): Promise<BloodTestResult[]> {
    const { data, error } = await supabase
      .from('blood_test_results')
      .insert(results)
      .select()

    if (error) throw error
    return data as BloodTestResult[]
  },

  async getMarkerHistory(
    userId: string,
    markerKey: string,
  ): Promise<(BloodTestResult & { test_date: string })[]> {
    const { data, error } = await supabase
      .from('blood_test_results')
      .select('*, blood_tests!inner(test_date, user_id)')
      .eq('marker_key', markerKey)
      .eq('blood_tests.user_id', userId)
      .order('created_at', { ascending: true })

    if (error) throw error

    return (data as Array<BloodTestResult & { blood_tests: { test_date: string } }>).map(
      (row) => ({
        ...row,
        test_date: row.blood_tests.test_date,
      }),
    )
  },

  async updateAiSummary(testId: string, summary: string): Promise<void> {
    const { error } = await supabase
      .from('blood_tests')
      .update({ ai_summary: summary })
      .eq('id', testId)

    if (error) throw error
  },

  async createWithResults(
    input: CreateBloodTestInput,
    results: Omit<CreateBloodTestResultInput, 'test_id'>[],
  ): Promise<{ test: BloodTest; results: BloodTestResult[] }> {
    const test = await bloodTestService.create(input)

    const resultsWithTestId = results.map((r) => ({
      ...r,
      test_id: test.id,
    }))

    const createdResults = await bloodTestService.createResults(resultsWithTestId)

    return { test, results: createdResults }
  },
}
