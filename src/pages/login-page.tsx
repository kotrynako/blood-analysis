import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LoginForm } from '@/components/auth/login-form'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'

export function LoginPage() {
  const navigate = useNavigate()
  const [showReset, setShowReset] = useState(false)

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-light px-4">
      <div className="w-full max-w-sm space-y-6 rounded-xl bg-white p-8 shadow-md">
        <h1 className="text-center text-2xl font-bold text-dark">
          {showReset ? 'Slaptažodžio atstatymas' : 'Prisijungimas'}
        </h1>

        {showReset ? (
          <>
            <ResetPasswordForm />
            <p className="text-center text-sm text-neutral-dark">
              <button
                type="button"
                onClick={() => setShowReset(false)}
                className="font-medium text-primary hover:text-primary-dark"
              >
                Grįžti į prisijungimą
              </button>
            </p>
          </>
        ) : (
          <>
            <LoginForm onSuccess={() => navigate('/dashboard')} />
            <div className="space-y-2 text-center text-sm text-neutral-dark">
              <p>
                <button
                  type="button"
                  onClick={() => setShowReset(true)}
                  className="font-medium text-primary hover:text-primary-dark"
                >
                  Pamiršote slaptažodį?
                </button>
              </p>
              <p>
                Neturite paskyros?{' '}
                <Link to="/register" className="font-medium text-primary hover:text-primary-dark">
                  Registruotis
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
