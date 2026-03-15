const ACTIONS = [
  {
    title: 'Apsilankymas pas gydytoją',
    description: 'Užsiregistruokite vizitui pas specialistą',
    href: 'https://www.manodaktaras.lt/',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: 'Virtuali konsultacija',
    description: 'Pasikalbėkite su gydytoju internetu',
    href: 'https://www.manodaktaras.lt/paieska/seimos-gydytojas?selectedRemote=1',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
  },
] as const

export function QuickActions() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="mb-6 text-lg font-semibold text-dark">
        Greiti veiksmai
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {ACTIONS.map((action) => (
          <a
            key={action.title}
            href={action.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg border border-neutral bg-white p-5 transition-colors hover:bg-neutral-light/30"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {action.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-dark">{action.title}</p>
                <p className="text-xs text-neutral-dark">{action.description}</p>
              </div>
            </div>
            <svg
              className="h-4 w-4 text-neutral-dark"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        ))}
      </div>
    </section>
  )
}
