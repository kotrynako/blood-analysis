import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="mt-4 text-lg font-medium text-dark">Puslapis nerastas</p>
      <p className="mt-2 text-sm text-neutral-dark">
        Ieškomas puslapis neegzistuoja arba buvo perkeltas.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
      >
        Grįžti į pagrindinį
      </Link>
    </div>
  )
}
