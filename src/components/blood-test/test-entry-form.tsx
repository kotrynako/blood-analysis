import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/use-auth'
import { useProfile } from '@/hooks/use-profile'
import { useCreateBloodTest } from '@/hooks/use-blood-tests'
import { MARKER_DEFINITIONS, MARKER_KEYS } from '@/data/marker-definitions'
import { MarkerInput } from './components/marker-input'
import type { TestEntryFormProps } from './test-entry-form.types'

const optionalNumericString = z.string().refine(
  (val) => val === '' || (!isNaN(Number(val)) && Number(val) >= 0),
  { message: 'Įveskite teigiamą skaičių' },
)

const markersShape = Object.fromEntries(
  MARKER_KEYS.map((key) => [key, optionalNumericString]),
)

const testEntrySchema = z.object({
  test_date: z.string().min(1, 'Pasirinkite tyrimo datą'),
  notes: z.string(),
  markers: z.object(markersShape),
}).refine(
  (data) => {
    const filled = Object.values(data.markers).filter((v) => v !== '')
    return filled.length > 0
  },
  { message: 'Įveskite bent vieną rodiklį', path: ['markers'] },
)

type TestEntryFormData = z.infer<typeof testEntrySchema>

export function TestEntryForm({ onSuccess }: TestEntryFormProps) {
  const { user } = useAuth()
  const { data: profile } = useProfile()
  const createBloodTest = useCreateBloodTest()
  const [serverError, setServerError] = useState<string | null>(null)

  const defaultMarkers = Object.fromEntries(MARKER_KEYS.map((k) => [k, '']))

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TestEntryFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(testEntrySchema) as any,
    defaultValues: {
      test_date: new Date().toISOString().split('T')[0],
      notes: '',
      markers: defaultMarkers,
    },
  })

  const onSubmit = async (data: TestEntryFormData) => {
    if (!user) return
    setServerError(null)

    const results = Object.entries(data.markers)
      .filter(([, val]) => val !== '')
      .map(([key, val]) => {
        const def = MARKER_DEFINITIONS.find((m) => m.key === key)
        return {
          marker_key: key,
          value: Number(val),
          unit: def?.unit ?? '',
        }
      })

    try {
      await createBloodTest.mutateAsync({
        test: {
          user_id: user.id,
          test_date: data.test_date,
          notes: data.notes || null,
        },
        results,
      })
      onSuccess?.()
    } catch {
      setServerError('Nepavyko išsaugoti tyrimo. Bandykite dar kartą.')
    }
  }

  const gender = profile?.gender ?? null

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="test_date" className="mb-1 block text-sm font-medium text-dark">
            Tyrimo data
          </label>
          <input
            id="test_date"
            type="date"
            {...register('test_date')}
            className="w-full rounded-lg border border-neutral bg-white px-3 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          />
          {errors.test_date && (
            <p className="mt-1 text-sm text-status-high">{errors.test_date.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="notes" className="mb-1 block text-sm font-medium text-dark">
            Pastabos
          </label>
          <input
            id="notes"
            type="text"
            placeholder="Neprivaloma"
            {...register('notes')}
            className="w-full rounded-lg border border-neutral bg-white px-3 py-2 text-dark placeholder:text-neutral-dark focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-dark">Rodikliai</h3>
        {errors.markers?.root && (
          <p className="mb-2 text-sm text-status-high">{errors.markers.root.message}</p>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          {MARKER_DEFINITIONS.map((marker) => (
            <MarkerInput
              key={marker.key}
              marker={marker}
              gender={gender}
              registration={register(`markers.${marker.key}`)}
              errorMessage={
                (errors.markers as Record<string, { message?: string }> | undefined)?.[marker.key]
                  ?.message
              }
            />
          ))}
        </div>
      </div>

      {serverError && (
        <p className="text-sm text-status-high">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={createBloodTest.isPending}
        className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {createBloodTest.isPending ? 'Saugoma...' : 'Išsaugoti tyrimą'}
      </button>
    </form>
  )
}
