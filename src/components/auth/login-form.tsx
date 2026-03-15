import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/use-auth'
import type { LoginFormData, LoginFormProps } from './login-form.types'

const loginSchema = z.object({
  email: z.email({ error: 'Įveskite teisingą el. pašto adresą' }),
  password: z.string().min(6, 'Slaptažodis turi būti bent 6 simbolių'),
})

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { signIn } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null)
    setIsSubmitting(true)

    const { error } = await signIn(data.email, data.password)

    setIsSubmitting(false)

    if (error) {
      setServerError('Neteisingas el. paštas arba slaptažodis')
      return
    }

    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-dark">
          El. paštas
        </label>
        <input
          id="email"
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
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-dark">
          Slaptažodis
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••"
          {...register('password')}
          className="w-full rounded-lg border border-neutral bg-white px-3 py-2 text-dark placeholder:text-neutral-dark focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-status-high">{errors.password.message}</p>
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
        {isSubmitting ? 'Jungiamasi...' : 'Prisijungti'}
      </button>
    </form>
  )
}
