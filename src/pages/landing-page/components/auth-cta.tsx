import { Link } from 'react-router-dom'

interface AuthCtaProps {
  onBeforeNavigate?: () => void
}

export function AuthCta({ onBeforeNavigate }: AuthCtaProps) {
  const handleClick = () => {
    onBeforeNavigate?.()
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <svg
            className="h-6 w-6 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <h3 className="mb-2 text-xl font-semibold text-dark">
          Išsaugokite savo rezultatus!
        </h3>

        <p className="mx-auto mb-6 max-w-md text-sm text-neutral-dark">
          Registruokitės, kad galėtumėte:
        </p>

        <ul className="mx-auto mb-8 max-w-sm space-y-3 text-left">
          <li className="flex items-center gap-3 text-sm text-dark">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-status-normal/10">
              <svg className="h-3.5 w-3.5 text-status-normal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            Išsaugoti tyrimo rezultatus
          </li>
          <li className="flex items-center gap-3 text-sm text-dark">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-status-normal/10">
              <svg className="h-3.5 w-3.5 text-status-normal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            Gauti personalizuotas įžvalgas
          </li>
          <li className="flex items-center gap-3 text-sm text-dark">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-status-normal/10">
              <svg className="h-3.5 w-3.5 text-status-normal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            Sekti rodiklių dinamiką laike
          </li>
        </ul>

        <div className="flex items-center justify-center gap-4">
          <Link
            to="/register"
            onClick={handleClick}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            Registruotis
          </Link>
          <Link
            to="/login"
            onClick={handleClick}
            className="inline-flex items-center justify-center rounded-lg border border-neutral bg-white px-6 py-2.5 text-sm font-medium text-dark transition-colors hover:bg-neutral-light"
          >
            Prisijungti
          </Link>
        </div>
      </div>
    </section>
  )
}
