import { Link } from 'react-router-dom'
import { FileUpload } from '@/components/blood-test/file-upload'

interface HeroSectionProps {
  onFileSelect: (file: File) => void
  isProcessing: boolean
}

export function HeroSection({ onFileSelect, isProcessing }: HeroSectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-status-high/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-status-high">
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Saugus duomenų saugojimas
          </span>

          <h1 className="text-4xl font-bold leading-tight text-dark lg:text-5xl">
            Jūsų sveikatos duomenys,{' '}
            <span className="text-primary">apsaugoti</span>
          </h1>

          <p className="max-w-lg text-lg text-neutral-dark">
            Saugiai įkelkite ir valdykite savo medicininius dokumentus. Gaukite
            AI įžvalgas, sekite tendencijas ir lengvai dalinkitės su sveikatos
            priežiūros specialistais.
          </p>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-lg border border-neutral bg-white px-5 py-2.5 text-sm font-medium text-dark transition-colors hover:bg-neutral-light"
            >
              Prisijungti
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              Registruotis
            </Link>
          </div>

          <div className="flex items-center gap-2 text-sm text-neutral-dark">
            <div className="flex -space-x-2">
              <div className="h-7 w-7 rounded-full bg-primary/30 ring-2 ring-white" />
              <div className="h-7 w-7 rounded-full bg-primary/50 ring-2 ring-white" />
              <div className="h-7 w-7 rounded-full bg-primary/70 ring-2 ring-white" />
            </div>
            <span>Prisijungė 10k+ pacientų šį mėnesį</span>
          </div>
        </div>

        <div className="rounded-xl border border-neutral bg-white p-6 shadow-sm">
          <FileUpload
            onFileSelect={onFileSelect}
            isUploading={isProcessing}
            maxSizeMB={10}
          />
        </div>
      </div>
    </section>
  )
}
