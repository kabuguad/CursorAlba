import { cn } from '../../lib/utils'
import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export function GlassCard({ children, className, hover = true, onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={cn(
        'glass glass-border rounded-3xl bg-surface text-foreground transition-all duration-300',
        hover && 'hover:scale-[1.02] hover:border-gold/40 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)]',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  )
}
