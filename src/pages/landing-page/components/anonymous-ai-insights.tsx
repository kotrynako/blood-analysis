interface AnonymousAiInsightsProps {
  summary: string
}

export function AnonymousAiInsights({ summary }: AnonymousAiInsightsProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <svg
            className="h-4 w-4 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-dark">AI Apibendrinimas</h2>
      </div>

      <div className="rounded-lg border border-neutral bg-white p-6">
        <div className="prose prose-sm max-w-none text-dark">
          {summary.split('\n').map((line, i) => {
            if (line.startsWith('## ')) {
              return (
                <h3 key={i} className="mb-2 mt-4 text-base font-semibold text-dark first:mt-0">
                  {line.replace('## ', '')}
                </h3>
              )
            }
            if (line.startsWith('- ')) {
              return (
                <p key={i} className="mb-1 pl-4 text-sm text-dark">
                  <span className="mr-1 text-primary">•</span>
                  {line.replace('- ', '')}
                </p>
              )
            }
            if (line.trim() === '') {
              return <div key={i} className="h-2" />
            }
            return (
              <p key={i} className="mb-2 text-sm leading-relaxed text-dark">
                {line}
              </p>
            )
          })}
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-status-low/30 bg-status-low-bg p-4">
        <div className="flex gap-3">
          <svg
            className="mt-0.5 h-5 w-5 shrink-0 text-status-low"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <p className="text-xs leading-relaxed text-dark">
            <strong>Atkreipkite dėmesį:</strong> Ši analizė yra tik informacinio
            pobūdžio ir nėra medicininė diagnozė. Visada pasitarkite su savo
            gydytoju dėl tyrimo rezultatų interpretacijos ir gydymo rekomendacijų.
          </p>
        </div>
      </div>
    </section>
  )
}
