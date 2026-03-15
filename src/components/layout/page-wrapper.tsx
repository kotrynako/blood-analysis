import type { ReactNode } from 'react'

interface PageWrapperProps {
  children: ReactNode
  className?: string
}

export function PageWrapper({ children, className = '' }: PageWrapperProps) {
  return (
    <main className={`mx-auto max-w-4xl px-4 py-6 ${className}`}>
      {children}
    </main>
  )
}
