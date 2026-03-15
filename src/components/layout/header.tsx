import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'

const navItems = [
  { path: '/dashboard', label: 'Pagrindinis' },
  { path: '/test/new', label: 'Naujas tyrimas' },
  { path: '/profile', label: 'Profilis' },
]

export function Header() {
  const { signOut } = useAuth()
  const location = useLocation()

  return (
    <header className="border-b border-neutral bg-white">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link to="/dashboard" className="text-lg font-bold text-primary">
          Kraujo analizė
        </Link>

        <nav className="flex items-center gap-0.5 sm:gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-lg px-2 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-neutral-dark hover:text-dark'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
          <button
            type="button"
            onClick={() => signOut()}
            className="ml-1 rounded-lg px-2 py-1.5 text-xs font-medium text-neutral-dark transition-colors hover:bg-neutral-light hover:text-dark sm:ml-2 sm:px-3 sm:text-sm"
          >
            Atsijungti
          </button>
        </nav>
      </div>
    </header>
  )
}
