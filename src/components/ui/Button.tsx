import { cn } from '../../lib/utils'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'gold' | 'ghost' | 'outline'
  children: ReactNode
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-300',
        'hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        variant === 'primary' && 'bg-primary text-white hover:bg-primary-light hover:shadow-[0_0_25px_rgba(21,128,61,0.4)]',
        variant === 'gold' && 'bg-gold text-dark hover:shadow-[0_0_25px_rgba(234,179,8,0.5)]',
        variant === 'ghost' && 'bg-transparent hover:bg-primary/10 text-primary dark:text-gold',
        variant === 'outline' && 'border-2 border-primary text-primary dark:border-gold dark:text-gold hover:bg-primary/10',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
