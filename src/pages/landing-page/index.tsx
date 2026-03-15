import { useCallback } from 'react'

import { useAnonymousAnalysis } from '@/hooks/use-anonymous-analysis'
import { usePendingResults } from '@/hooks/use-pending-results'
import { HeroSection } from './components/hero-section'
import { StaticDemoResults } from './components/static-demo-results'
import { AnonymousResults } from './components/anonymous-results'
import { AnonymousAiInsights } from './components/anonymous-ai-insights'
import { AuthCta } from './components/auth-cta'
import { QuickActions } from './components/quick-actions'
import { LandingFooter } from './components/landing-footer'

export function LandingPage() {
  const analysis = useAnonymousAnalysis()
  const pendingResults = usePendingResults()

  const handleFileSelect = useCallback(
    (file: File) => {
      analysis.analyze(file)
    },
    [analysis],
  )

  const handleBeforeNavigate = useCallback(() => {
    if (analysis.step === 'results' && analysis.ocrMarkers.length > 0) {
      pendingResults.save(analysis.ocrMarkers, analysis.aiSummary)
    }
  }, [analysis, pendingResults])

  const isProcessing = analysis.step === 'processing'

  return (
    <div className="min-h-screen bg-neutral-light/30">
      <HeroSection
        onFileSelect={handleFileSelect}
        isProcessing={isProcessing}
      />

      {isProcessing && (
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-neutral border-t-primary" />
          <p className="mt-4 text-sm text-neutral-dark">
            Analizuojame jūsų tyrimo rezultatus...
          </p>
        </div>
      )}

      {analysis.step === 'error' && (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-status-high/30 bg-status-high-bg p-6 text-center">
            <p className="mb-4 text-sm text-dark">{analysis.error}</p>
            <button
              type="button"
              onClick={analysis.retry}
              className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              Bandyti dar kartą
            </button>
          </div>
        </div>
      )}

      {analysis.step === 'idle' && <StaticDemoResults />}

      {analysis.step === 'results' && (
        <>
          <AnonymousResults markers={analysis.markerResults} />
          {analysis.aiSummary && (
            <AnonymousAiInsights summary={analysis.aiSummary} />
          )}
          <AuthCta onBeforeNavigate={handleBeforeNavigate} />
        </>
      )}

      <QuickActions />
      <LandingFooter />
    </div>
  )
}
