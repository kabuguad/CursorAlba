import { Link } from 'react-router-dom'
import { Home, ArrowLeft, BookOpen, GraduationCap, PenTool } from 'lucide-react'
import { Button } from '../components/ui/Button'

export function NotFound() {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-white dark:bg-dark px-4 py-16">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
        style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '44px 44px' }}
      />
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-primary/10 blur-3xl -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gold/10 blur-3xl translate-x-1/4 translate-y-1/4" />

      {/* Floating icons */}
      <GraduationCap className="absolute top-[14%] left-[10%] h-10 w-10 text-primary/20 dark:text-gold/20 animate-bounce" style={{ animationDuration: '3.5s' }} />
      <PenTool className="absolute bottom-[18%] left-[14%] h-8 w-8 text-gold/30 -rotate-12 animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
      <BookOpen className="absolute top-[20%] right-[12%] h-9 w-9 text-primary/20 dark:text-gold/20 rotate-6 animate-bounce" style={{ animationDuration: '3.2s', animationDelay: '0.3s' }} />

      <div className="relative z-10 max-w-lg w-full text-center">
        <div className="mx-auto mb-6 w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shadow-lg">
          <span className="font-bold text-3xl text-gold">A</span>
        </div>

        <div className="relative mb-2">
          <h1 className="text-[7rem] sm:text-[9rem] font-bold leading-none tracking-tight text-primary/10 dark:text-gold/10 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-semibold tracking-[0.3em] uppercase text-gold bg-white dark:bg-dark px-4">
              Out of Class
            </span>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
          This page skipped school
        </h2>
        <p className="text-muted text-base leading-relaxed mb-8 max-w-md mx-auto">
          We looked everywhere — the library, the staffroom, even the science lab —
          but the page you're after isn't on the timetable. Let's get you back to class.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/">
            <Button variant="gold" className="gap-2 w-full sm:w-auto">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Button
            variant="outline"
            className="gap-2 w-full sm:w-auto"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>

        <p className="mt-10 text-xs text-muted tracking-wide">
          Demo School · Kutus, Kirinyaga County
        </p>
      </div>
    </div>
  )
}
