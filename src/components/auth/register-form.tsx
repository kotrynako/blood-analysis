import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/use-auth'
import type { RegisterFormData, RegisterFormProps } from './register-form.types'

const registerSchema = z
  .object({
    email: z.email({ error: 'Įveskite teisingą el. pašto adresą' }),
    password: z.string().min(6, 'Slaptažodis turi būti bent 6 simbolių'),
    confirmPassword: z.string().min(1, 'Pakartokite slaptažodį'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Slaptažodžiai nesutampa',
    path: ['confirmPassword'],
  })

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { signUp } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null)
    setIsSubmitting(true)

    const { error } = await signUp(data.email, data.password)

    setIsSubmitting(false)

    if (error) {
      setServerError('Registracija nepavyko. Bandykite kitą el. pašto adresą.')
      return
    }

    setSuccessMessage(
      `Registracija sėkminga! Patvirtinimo nuoroda išsiųsta adresu ${data.email}. Patikrinkite savo el. paštą (ir šiukšlių aplanką).`
    )
    onSuccess?.()
  }

  if (successMessage) {
    return (
      <div className="w-full max-w-sm space-y-4 text-center">
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-800">{successMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4">
      <div>
        <label htmlFor="reg-email" className="mb-1 block text-sm font-medium text-dark">
          El. paštas
        </label>
        <input
          id="reg-email"
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

      <div>
        <label htmlFor="reg-password" className="mb-1 block text-sm font-medium text-dark">
          Slaptažodis
        </label>
        <input
          id="reg-password"
          type="password"
          autoComplete="new-password"
          placeholder="Bent 6 simboliai"
          {...register('password')}
          className="w-full rounded-lg border border-neutral bg-white px-3 py-2 text-dark placeholder:text-neutral-dark focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-status-high">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="reg-confirm" className="mb-1 block text-sm font-medium text-dark">
          Pakartokite slaptažodį
        </label>
        <input
          id="reg-confirm"
          type="password"
          autoComplete="new-password"
          placeholder="••••••"
          {...register('confirmPassword')}
          className="w-full rounded-lg border border-neutral bg-white px-3 py-2 text-dark placeholder:text-neutral-dark focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-status-high">{errors.confirmPassword.message}</p>
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
        {isSubmitting ? 'Registruojama...' : 'Registruotis'}
      </button>
    </form>
  )
}
