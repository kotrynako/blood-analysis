const PRODUCT_LINKS = [
  { label: 'Apžvalga', href: '#' },
  { label: 'Saugumas', href: '#' },
]

const SUPPORT_LINKS = [
  { label: 'Pagalbos centras', href: '#' },
  { label: 'Susisiekti', href: '#' },
]

export function LandingFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-neutral bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <span className="text-sm font-semibold text-dark">Kraujo Analizė</span>
            </div>
            <p className="max-w-xs text-xs text-neutral-dark">
              Suteikiame pacientams saugią duomenų kontrolę ir išmanias sveikatos
              įžvalgas. Jūsų privatumas — mūsų prioritetas.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-dark">Produktas</h3>
            <ul className="space-y-2">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-neutral-dark transition-colors hover:text-dark"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-dark">Pagalba</h3>
            <ul className="space-y-2">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-neutral-dark transition-colors hover:text-dark"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-neutral pt-6 sm:flex-row">
          <p className="text-xs text-neutral-dark">
            &copy; {currentYear} Kraujo Analizė. Visos teisės saugomos.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-neutral-dark transition-colors hover:text-dark">
              Privatumo politika
            </a>
            <a href="#" className="text-xs text-neutral-dark transition-colors hover:text-dark">
              Naudojimo sąlygos
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
