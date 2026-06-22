import { useState } from 'react'
import { feeStructure } from '../data/programs'
import { GlassCard } from '../components/ui/GlassCard'
import { useToast } from '../contexts/ToastContext'
import { formatKES } from '../lib/utils'
import { cn } from '../lib/utils'
import { ChevronDown, ArrowRight, CheckCircle2, User, Users, FileText, CreditCard } from 'lucide-react'
import { useCmsBlocks } from '../hooks/useCmsData'
import { motion, AnimatePresence } from 'framer-motion'

function useCms() {
  const { data: blocks = [] } = useCmsBlocks('pg-admissions')
  return (key: string, fallback: string) => blocks.find(b => b.key === key)?.value || fallback
}

const STEPS = [
  { label: 'Child Info',   icon: User },
  { label: 'Parent Info',  icon: Users },
  { label: 'Documents',    icon: FileText },
  { label: 'Payment',      icon: CreditCard },
]

const FIELD = 'w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-sm text-foreground placeholder-muted outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20'

const WHY_APPLY = [
  '97% KCSE pass rate',
  'CBC & Cambridge IGCSE pathways',
  '120+ qualified educators',
  'Full co-curricular programme',
  'GPS-tracked transport',
  'M-Pesa fee payments',
]

export function Admissions() {
  const get = useCms()
  const { showToast } = useToast()
  const [step, setStep] = useState(0)
  const [openFee, setOpenFee] = useState<number | null>(0)

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1)
    else {
      showToast('Application submitted! Reference: ALB-2026-' + Math.floor(Math.random() * 9000 + 1000))
      setStep(0)
    }
  }

  return (
    <div className="overflow-hidden">

      {/* ── Hero ── */}
      <section
        className="relative flex min-h-[68vh] items-end justify-center overflow-hidden"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0 100%)' }}
      >
        <img
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80"
          alt=""
          aria-hidden
          className="ken-burns absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/60 to-black/20" />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-gold via-gold/60 to-transparent" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 pb-20 pt-40 text-center">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/30 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />2026 · 2027 Intake Open
            </span>
            <h1 className="mt-4 text-5xl font-extrabold leading-tight text-white md:text-7xl [text-shadow:_0_4px_32px_rgba(0,0,0,0.6)]">{get('hero.headline', 'Admissions')}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/75">{get('hero.subheadline', 'Join Alber School — applications open for 2026/2027 intake. Limited spaces available.')}</p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-20">

        <div className="grid gap-12 lg:grid-cols-[1fr_340px]">

          {/* ── Application Form ── */}
          <div>
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="mb-6 text-2xl font-bold">Apply Online</h2>

              {/* Step indicators */}
              <div className="mb-8 flex items-center gap-0">
                {STEPS.map((s, i) => {
                  const done = i < step
                  const active = i === step
                  return (
                    <div key={s.label} className="flex flex-1 items-center">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300',
                          done   ? 'border-primary bg-primary dark:border-gold dark:bg-gold text-white dark:text-black' : '',
                          active ? 'border-gold bg-gold/10 text-gold' : '',
                          !done && !active ? 'border-gray-200 dark:border-white/20 text-muted' : '',
                        )}>
                          {done ? <CheckCircle2 className="h-5 w-5" /> : <s.icon className="h-4 w-4" />}
                        </div>
                        <span className={cn('mt-1.5 text-[10px] font-semibold uppercase tracking-widest hidden sm:block', active ? 'text-gold' : done ? 'text-primary dark:text-gold' : 'text-muted')}>
                          {s.label}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={cn('h-0.5 flex-1 mx-1 transition-all duration-500', done ? 'bg-primary dark:bg-gold' : 'bg-gray-200 dark:bg-white/10')} />
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Progress bar */}
              <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-gold dark:from-gold dark:to-yellow-400"
                  initial={false}
                  animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>

            <GlassCard className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {step === 0 && (
                    <div className="space-y-4">
                      <h3 className="mb-4 font-bold text-foreground">Child Information</h3>
                      <input required placeholder="Child Full Name" className={FIELD} />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <input required type="date" placeholder="Date of Birth" className={FIELD} />
                        <select className={FIELD}>
                          <option value="">Select Level</option>
                          <option>Daycare / PP1-PP2</option>
                          <option>Primary (Gr. 1–6)</option>
                          <option>Junior Secondary (Gr. 7–9)</option>
                          <option>Senior School / IGCSE</option>
                        </select>
                      </div>
                      <input placeholder="Previous School (if any)" className={FIELD} />
                    </div>
                  )}
                  {step === 1 && (
                    <div className="space-y-4">
                      <h3 className="mb-4 font-bold text-foreground">Parent / Guardian Information</h3>
                      <input required placeholder="Parent/Guardian Full Name" className={FIELD} />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <input required type="email" placeholder="Email Address" className={FIELD} />
                        <input required placeholder="Phone / WhatsApp (+254)" className={FIELD} />
                      </div>
                      <input placeholder="ID / Passport Number" className={FIELD} />
                      <input placeholder="Relationship to Child" className={FIELD} />
                    </div>
                  )}
                  {step === 2 && (
                    <div className="space-y-5">
                      <h3 className="mb-4 font-bold text-foreground">Supporting Documents</h3>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-foreground">Birth Certificate (PDF or image)</label>
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" className={`${FIELD} file:mr-3 file:rounded-lg file:border-0 file:bg-gold/10 file:px-3 file:py-1 file:text-xs file:font-bold file:text-gold cursor-pointer`} />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-foreground">Previous School Report (most recent)</label>
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" className={`${FIELD} file:mr-3 file:rounded-lg file:border-0 file:bg-gold/10 file:px-3 file:py-1 file:text-xs file:font-bold file:text-gold cursor-pointer`} />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-foreground">Parent ID / Passport (optional)</label>
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" className={`${FIELD} file:mr-3 file:rounded-lg file:border-0 file:bg-gold/10 file:px-3 file:py-1 file:text-xs file:font-bold file:text-gold cursor-pointer`} />
                      </div>
                    </div>
                  )}
                  {step === 3 && (
                    <div className="text-center">
                      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold/10 text-gold">
                        <CreditCard className="h-10 w-10" />
                      </div>
                      <h3 className="mb-2 text-xl font-bold">Registration Fee Payment</h3>
                      <p className="mb-6 text-muted">Pay via M-Pesa to complete your application</p>
                      <div className="rounded-2xl border border-gold/30 bg-gold/5 p-6 space-y-3 text-left">
                        <div className="flex justify-between text-sm"><span className="text-muted">Paybill Number</span><span className="font-bold text-gold">{get('payment.paybill', '522522')}</span></div>
                        <div className="h-px bg-gold/20" />
                        <div className="flex justify-between text-sm"><span className="text-muted">Account Number</span><span className="font-bold text-gold">{get('payment.account', 'ALBER2026')}</span></div>
                        <div className="h-px bg-gold/20" />
                        <div className="flex justify-between text-sm"><span className="text-muted">Amount</span><span className="font-bold">{get('payment.note', 'As advised by admissions office')}</span></div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex gap-4">
                {step > 0 && (
                  <button onClick={() => setStep(step - 1)} className="rounded-xl border-2 border-gray-200 dark:border-white/20 px-6 py-3 font-semibold text-foreground transition hover:border-gold/50">
                    Back
                  </button>
                )}
                <button onClick={next} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white transition hover:bg-primary/90 hover:scale-[1.01] dark:bg-gold dark:text-black dark:hover:bg-yellow-400">
                  {step === STEPS.length - 1 ? 'Submit Application' : 'Continue'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </GlassCard>
          </div>

          {/* ── Sidebar: Why Apply + Fees ── */}
          <div className="space-y-6">
            {/* Why Apply */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-2xl border border-gold/20 bg-gradient-to-br from-primary/5 to-gold/5 p-6 dark:from-primary/10 dark:to-gold/10">
                <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-gold">Why Alber?</p>
                <ul className="space-y-2.5">
                  {WHY_APPLY.map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Fee Structure */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="mb-3 text-lg font-bold">Fee Structure (KES)</h3>
              <div className="space-y-2">
                {feeStructure.map((f, i) => (
                  <div key={f.level} className="overflow-hidden rounded-xl border border-gray-200 dark:border-white/10">
                    <button
                      onClick={() => setOpenFee(openFee === i ? null : i)}
                      className="flex w-full items-center justify-between bg-white dark:bg-[#111] px-4 py-3 text-sm font-semibold transition hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                      <span>{f.level}</span>
                      <ChevronDown className={cn('h-4 w-4 text-gold transition-transform', openFee === i && 'rotate-180')} />
                    </button>
                    <AnimatePresence initial={false}>
                      {openFee === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 py-3 space-y-1.5 text-sm">
                            <div className="flex justify-between"><span className="text-muted">Tuition</span><span className="font-semibold">{formatKES(f.tuition)}</span></div>
                            <div className="flex justify-between"><span className="text-muted">Transport</span><span className="font-semibold">{formatKES(f.transport)}</span></div>
                            <div className="flex justify-between"><span className="text-muted">Activities</span><span className="font-semibold">{formatKES(f.activities)}</span></div>
                            <div className="mt-2 flex justify-between border-t border-gray-200 dark:border-white/10 pt-2">
                              <span className="font-bold">Total</span>
                              <span className="font-bold text-gold">{formatKES(f.tuition + f.transport + f.activities)}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
