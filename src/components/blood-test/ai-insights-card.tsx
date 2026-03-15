interface AiInsightsCardProps {
  summary: string | null
  isLoading: boolean
  isRegenerating: boolean
  error: Error | null
  available: boolean
  onRegenerate: () => void
}

export function AiInsightsCard({
  summary,
  isLoading,
  isRegenerating,
  error,
  available,
  onRegenerate,
}: AiInsightsCardProps) {
  if (!available) return null

  if (isLoading) {
    return (
      <div className="rounded-xl border-l-4 border-l-primary bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-dark">Generuojamos AI įžvalgos...</p>
        </div>
        <div className="mt-4 space-y-3">
          <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-light" />
          <div className="h-4 w-full animate-pulse rounded bg-neutral-light" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-neutral-light" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-light" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border-l-4 border-l-status-high bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-dark">AI Įžvalgos</p>
        <p className="mt-2 text-sm text-neutral-dark">
          Nepavyko sugeneruoti AI įžvalgų. Bandykite dar kartą.
        </p>
        <button
          type="button"
          onClick={onRegenerate}
          className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          Bandyti iš naujo
        </button>
      </div>
    )
  }

  if (!summary) return null

  return (
    <div className="rounded-xl border-l-4 border-l-primary bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-dark">AI Įžvalgos</p>
        <button
          type="button"
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="rounded px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10 disabled:opacity-50"
        >
          {isRegenerating ? 'Atnaujinama...' : 'Atnaujinti'}
        </button>
      </div>

      <div className="mt-3 space-y-3 text-sm leading-relaxed text-dark">
        <AiSummaryContent content={summary} />
      </div>

      <a
        href="https://www.manodaktaras.lt/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
      >
        Rasti gydytoją
        <span aria-hidden="true">→</span>
      </a>

      <p className="mt-4 rounded-lg bg-status-low-bg p-3 text-xs text-neutral-dark">
        ⚠️ Tai nėra medicininė diagnozė. Visada konsultuokitės su gydytoju dėl savo sveikatos būklės.
      </p>
    </div>
  )
}

function AiSummaryContent({ content }: { content: string }) {
  const sections = content.split(/^## /m).filter(Boolean)

  if (sections.length <= 1) {
    return <div className="whitespace-pre-line">{content}</div>
  }

  return (
    <>
      {sections.map((section, i) => {
        const newlineIndex = section.indexOf('\n')
        const title = newlineIndex > 0 ? section.slice(0, newlineIndex).trim() : ''
        const body = newlineIndex > 0 ? section.slice(newlineIndex + 1).trim() : section.trim()

        return (
          <div key={i}>
            {title && (
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-neutral-dark">
                {title}
              </p>
            )}
            <div className="whitespace-pre-line">{body}</div>
          </div>
        )
      })}
    </>
  )
}
