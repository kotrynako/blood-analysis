import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUpdateProfile } from '@/hooks/use-profile'
import type { ProfileFormData, ProfileFormProps } from './profile-form.types'

const currentYear = new Date().getFullYear()

const profileSchema = z.object({
  gender: z.enum(['male', 'female', ''], {
    error: 'Pasirinkite lytį',
  }),
  birth_year: z
    .string()
    .refine(
      (val) => val === '' || (/^\d{4}$/.test(val) && +val >= 1900 && +val <= currentYear),
      { message: `Įveskite metus tarp 1900 ir ${currentYear}` },
    ),
})

export function ProfileForm({ defaultValues, onSuccess }: ProfileFormProps) {
  const updateProfile = useUpdateProfile()
  const [serverError, setServerError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      gender: defaultValues?.gender ?? '',
      birth_year: defaultValues?.birth_year?.toString() ?? '',
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    setServerError(null)
    setSuccessMsg(null)

    try {
      await updateProfile.mutateAsync({
        gender: data.gender === '' ? null : data.gender,
        birth_year: data.birth_year === '' ? null : Number(data.birth_year),
      })
      setSuccessMsg('Profilis atnaujintas sėkmingai')
      onSuccess?.()
    } catch {
      setServerError('Nepavyko atnaujinti profilio. Bandykite dar kartą.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4">
      <div>
        <label htmlFor="gender" className="mb-1 block text-sm font-medium text-dark">
          Lytis
        </label>
        <select
          id="gender"
          {...register('gender')}
          className="w-full rounded-lg border border-neutral bg-white px-3 py-2 text-dark focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
        >
          <option value="">Nepasirinkta</option>
          <option value="male">Vyras</option>
          <option value="female">Moteris</option>
        </select>
        {errors.gender && (
          <p className="mt-1 text-sm text-status-high">{errors.gender.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="birth_year" className="mb-1 block text-sm font-medium text-dark">
          Gimimo metai
        </label>
        <input
          id="birth_year"
          type="number"
          min={1900}
          max={currentYear}
          placeholder="pvz. 1990"
          {...register('birth_year')}
          className="w-full rounded-lg border border-neutral bg-white px-3 py-2 text-dark placeholder:text-neutral-dark focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
        />
        {errors.birth_year && (
          <p className="mt-1 text-sm text-status-high">{errors.birth_year.message}</p>
        )}
      </div>

      {serverError && (
        <p className="text-sm text-status-high">{serverError}</p>
      )}

      {successMsg && (
        <p className="text-sm text-green-600">{successMsg}</p>
      )}

      <button
        type="submit"
        disabled={updateProfile.isPending}
        className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {updateProfile.isPending ? 'Saugoma...' : 'Išsaugoti'}
      </button>
    </form>
  )
}
