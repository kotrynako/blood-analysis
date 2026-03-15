import type { ReactNode } from 'react'

type AlertVariant = 'info' | 'success' | 'warning' | 'error'

interface AlertProps {
  variant?: AlertVariant
  children: ReactNode
  onClose?: () => void
  className?: string
}

const variantStyles: Record<AlertVariant, string> = {
  info: 'border-primary/30 bg-primary/5 text-dark',
  success: 'border-status-normal/30 bg-status-normal-bg text-dark',
  warning: 'border-status-low/30 bg-status-low-bg text-dark',
  error: 'border-status-high/30 bg-status-high-bg text-dark',
}

export function Alert({ variant = 'info', children, onClose, className = '' }: AlertProps) {
  return (
    <div
      role="alert"
      className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${variantStyles[variant]} ${className}`}
    >
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-neutral-dark transition-colors hover:text-dark"
          aria-label="Uždaryti"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
