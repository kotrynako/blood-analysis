import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg'
}

const paddingStyles = {
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
}

export function Card({ padding = 'md', className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-neutral bg-white ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
