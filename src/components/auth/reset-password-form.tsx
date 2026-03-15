import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/use-auth'
import type { ResetPasswordFormData, ResetPasswordFormProps } from './reset-password-form.types'

const resetPasswordSchema = z.object({
  email: z.email({ error: 'Įveskite teisingą el. pašto adresą' }),
})

export function ResetPasswordForm({ onSuccess }: ResetPasswordFormProps) {
  const { resetPassword } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    setServerError(null)
    setIsSubmitting(true)

    const { error } = await resetPassword(data.email)

    setIsSubmitting(false)

    if (error) {
      setServerError('Nepavyko išsiųsti slaptažodžio atstatymo nuorodos. Bandykite dar kartą.')
      return
    }

    setIsSent(true)
    onSuccess?.()
  }

  if (isSent) {
    return (
      <div className="w-full max-w-sm space-y-4 text-center">
        <p className="text-sm text-dark">
          Slaptažodžio atstatymo nuoroda išsiųsta į jūsų el. paštą. Patikrinkite pašto dėžutę.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4">
      <p className="text-sm text-neutral-dark">
        Įveskite savo el. pašto adresą ir mes atsiųsime slaptažodžio atstatymo nuorodą.
      </p>

      <div>
        <label htmlFor="reset-email" className="mb-1 block text-sm font-medium text-dark">
          El. paštas
        </label>
        <input
          id="reset-email"
          type="email"
          autoComplete="email"
          placeholder="jusu@pastas.lt"
          {...register('email')}
          className="w-full rounded-lg border border-neutral bg-white px-3 py-2 text-dark placeholder:text-neutral-dark focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-status-high">{errors.email.message}</p>
        )}
      </div>

      {serverError && (
        <p className="text-sm text-status-high">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Siunčiama...' : 'Atstatyti slaptažodį'}
      </button>
    </form>
  )
}
