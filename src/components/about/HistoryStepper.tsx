import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { cn } from '../../lib/utils'

export interface HistoryStep {
  year: string
  title: string
  desc: string
}

interface HistoryStepperProps {
  steps: HistoryStep[]
}

export function HistoryStepper({ steps }: HistoryStepperProps) {
  const [active, setActive] = useState(0)
  const current = steps[active]

  const go = (index: number) => {
    if (index >= 0 && index < steps.length) setActive(index)
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Desktop: horizontal stepper */}
      <div className="hidden md:block">
        <div className="relative flex items-start justify-between">
          <div
            className="absolute left-0 right-0 top-5 h-0.5 bg-[var(--color-border)]"
            aria-hidden
          />
          <div
            className="absolute left-0 top-5 h-0.5 bg-gold transition-all duration-500"
            style={{ width: `${(active / (steps.length - 1)) * 100}%` }}
            aria-hidden
          />
          {steps.map((step, i) => (
            <button
              key={step.year}
              type="button"
              onClick={() => setActive(i)}
              className="relative z-10 flex flex-1 flex-col items-center gap-3 px-2 transition-transform hover:scale-105"
            >
              <span
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300',
                  i <= active
                    ? 'border-gold bg-gold text-dark shadow-[0_0_20px_rgba(234,179,8,0.4)]'
                    : 'border-theme bg-surface-solid text-muted',
                )}
              >
                {i + 1}
              </span>
              <span
                className={cn(
                  'text-sm font-semibold transition-colors',
                  i === active ? 'text-primary dark:text-gold' : 'text-muted',
                )}
              >
                {step.year}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: compact horizontal steps */}
      <div className="flex flex-wrap justify-center gap-2 md:hidden">
        {steps.map((step, i) => (
          <button
            key={step.year}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-semibold transition-all hover:scale-105',
              i === active
                ? 'bg-gold text-dark shadow-[0_0_15px_rgba(234,179,8,0.4)]'
                : 'glass glass-border text-muted',
            )}
          >
            {step.year}
          </button>
        ))}
      </div>

      {/* Active step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="mt-10"
        >
          <GlassCard className="p-8 text-center md:p-10">
            <span className="text-5xl font-bold text-gold md:text-6xl">{current.year}</span>
            <h3 className="mt-3 text-2xl font-bold text-foreground md:text-3xl">{current.title}</h3>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted">{current.desc}</p>
            <p className="mt-6 text-sm text-muted">
              Milestone {active + 1} of {steps.length}
            </p>
          </GlassCard>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-6 flex flex-col items-center gap-4">
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Go to step ${i + 1}`}
              className={cn(
                'h-2 rounded-full transition-all',
                i === active ? 'w-6 bg-gold' : 'w-2 bg-[var(--color-border)]',
              )}
            />
          ))}
        </div>
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(active - 1)}
            disabled={active === 0}
            className={cn(
              'flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all',
              'glass glass-border hover:scale-105 disabled:opacity-40 disabled:hover:scale-100',
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <button
            type="button"
            onClick={() => go(active + 1)}
            disabled={active === steps.length - 1}
            className={cn(
              'flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all',
              'bg-primary text-white hover:scale-105 hover:bg-primary-light disabled:opacity-40 disabled:hover:scale-100 dark:bg-gold dark:text-dark',
            )}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
