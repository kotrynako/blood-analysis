import { Link } from 'react-router-dom'
import { RegisterForm } from '@/components/auth/register-form'

export function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-light px-4">
      <div className="w-full max-w-sm space-y-6 rounded-xl bg-white p-8 shadow-md">
        <h1 className="text-center text-2xl font-bold text-dark">Registracija</h1>

        <RegisterForm />

        <p className="text-center text-sm text-neutral-dark">
          Jau turite paskyrą?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
            Prisijungti
          </Link>
        </p>
      </div>
    </div>
  )
}
