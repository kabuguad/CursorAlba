import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { cn } from '../../lib/utils'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={cn(
        'relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-300',
        'glass glass-border bg-surface hover:scale-110 hover:border-gold/50',
      )}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-primary" />
      ) : (
        <Sun className="h-5 w-5 text-gold" />
      )}
    </button>
  )
}
