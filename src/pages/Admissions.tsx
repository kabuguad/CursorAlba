import { useState } from 'react'
import { feeStructure } from '../data/programs'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { useToast } from '../contexts/ToastContext'
import { formatKES } from '../lib/utils'
import { cn } from '../lib/utils'
import { ChevronDown } from 'lucide-react'

const STEPS = ['Child Info', 'Parent Info', 'Documents', 'Payment']

export function Admissions() {
  const { showToast } = useToast()
  const [step, setStep] = useState(0)
  const [openFee, setOpenFee] = useState<number | null>(0)

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1)
    else showToast('Application submitted! Reference: ALB-2026-' + Math.floor(Math.random() * 9000 + 1000))
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <ScrollReveal>
        <h1 className="text-5xl font-bold md:text-7xl">Admissions</h1>
        <p className="mt-4 text-muted">Join Alber School — applications open for 2026 intake.</p>
      </ScrollReveal>

      <div className="mt-8 mb-8">
        <div className="flex justify-between text-xs font-semibold uppercase">
          {STEPS.map((s, i) => (
            <span key={s} className={cn(i <= step ? 'text-primary dark:text-gold' : 'text-muted')}>{s}</span>
          ))}
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-tint dark:bg-dark-card">
          <div
            className="h-full bg-primary transition-all duration-500 dark:bg-gold"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <ScrollReveal>
        <GlassCard className="p-8">
          {step === 0 && (
            <div className="space-y-4">
              <input required placeholder="Child Full Name" className="field" />
              <input required type="date" placeholder="Date of Birth" className="field" />
              <select className="field">
                <option>Daycare</option>
                <option>Primary</option>
                <option>Junior Secondary</option>
                <option>Senior / IGCSE</option>
              </select>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <input required placeholder="Parent/Guardian Name" className="field" />
              <input required type="email" placeholder="Email" className="field" />
              <input required placeholder="Phone (+254)" className="field" />
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <label className="block text-sm text-muted">Birth Certificate (PDF)</label>
              <input type="file" className="field" />
              <label className="block text-sm text-muted">Previous School Report</label>
              <input type="file" className="field" />
            </div>
          )}
          {step === 3 && (
            <div className="text-center">
              <p className="mb-4 text-muted">Mock payment — M-Pesa Paybill 522522</p>
              <p className="text-3xl font-bold text-primary dark:text-gold">Account: ALBER2026</p>
              <p className="mt-2 text-sm">Amount will be confirmed upon review</p>
            </div>
          )}
          <div className="mt-8 flex gap-4">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
            )}
            <Button variant="primary" onClick={next} className="flex-1">
              {step === STEPS.length - 1 ? 'Submit Application' : 'Continue'}
            </Button>
          </div>
        </GlassCard>
      </ScrollReveal>

      <ScrollReveal className="mt-12">
        <h2 className="mb-4 text-2xl font-bold">Fee Structure (KES)</h2>
        {feeStructure.map((f, i) => (
          <div key={f.level} className="mb-2">
            <button
              onClick={() => setOpenFee(openFee === i ? null : i)}
              className="flex w-full items-center justify-between rounded-2xl glass glass-border p-4 transition hover:border-gold/50"
            >
              <span className="font-semibold">{f.level}</span>
              <ChevronDown className={cn('h-5 w-5 transition', openFee === i && 'rotate-180')} />
            </button>
            {openFee === i && (
              <div className="mt-2 rounded-2xl bg-tint/50 p-4 text-sm text-foreground dark:bg-dark-card">
                <p>Tuition: {formatKES(f.tuition)}</p>
                <p>Transport: {formatKES(f.transport)}</p>
                <p>Activities: {formatKES(f.activities)}</p>
              </div>
            )}
          </div>
        ))}
      </ScrollReveal>

    </div>
  )
}
