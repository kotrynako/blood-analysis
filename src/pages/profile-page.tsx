import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useProfile } from '@/hooks/use-profile'
import { ProfileForm } from '@/components/profile/profile-form'

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { data: profile, isLoading, isError } = useProfile()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="mx-auto max-w-lg space-y-8 px-4 py-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-dark">Profilis</h1>
        <button
          type="button"
          onClick={handleSignOut}
          className="rounded-lg border border-neutral px-4 py-2 text-sm font-medium text-dark transition-colors hover:bg-neutral-light"
        >
          Atsijungti
        </button>
      </div>

      {user && (
        <p className="text-sm text-neutral-dark">{user.email}</p>
      )}

      {isLoading && (
        <p className="text-neutral-dark">Kraunama...</p>
      )}

      {isError && (
        <p className="text-sm text-status-high">Nepavyko užkrauti profilio duomenų.</p>
      )}

      {profile && (
        <ProfileForm
          defaultValues={{
            gender: profile.gender,
            birth_year: profile.birth_year,
          }}
        />
      )}
    </div>
  )
}
