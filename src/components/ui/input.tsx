import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, className = '', ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-dark">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-lg border px-3 py-2 text-sm text-dark placeholder:text-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary/50 ${
            error ? 'border-status-high' : 'border-neutral'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-status-high">{error}</p>}
        {!error && helperText && <p className="text-xs text-neutral-dark">{helperText}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'
