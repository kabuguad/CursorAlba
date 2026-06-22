import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { GlassCard } from '../components/ui/GlassCard'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { whyChooseUsApi } from '../services/whyChooseUsApi'

const COLOR_MAP: Record<string, { bg: string; text: string; stat: string; border: string }> = {
  gold:   { bg: 'bg-yellow-500/10',  text: 'text-yellow-600 dark:text-yellow-400',  stat: 'text-yellow-500 dark:text-yellow-300',  border: 'border-yellow-400/30' },
  blue:   { bg: 'bg-blue-500/10',    text: 'text-blue-600 dark:text-blue-400',      stat: 'text-blue-500 dark:text-blue-300',      border: 'border-blue-400/30' },
  green:  { bg: 'bg-green-500/10',   text: 'text-green-600 dark:text-green-400',    stat: 'text-green-500 dark:text-green-300',    border: 'border-green-400/30' },
  purple: { bg: 'bg-purple-500/10',  text: 'text-purple-600 dark:text-purple-400',  stat: 'text-purple-500 dark:text-purple-300',  border: 'border-purple-400/30' },
  teal:   { bg: 'bg-teal-500/10',    text: 'text-teal-600 dark:text-teal-400',      stat: 'text-teal-500 dark:text-teal-300',      border: 'border-teal-400/30' },
  rose:   { bg: 'bg-rose-500/10',    text: 'text-rose-600 dark:text-rose-400',      stat: 'text-rose-500 dark:text-rose-300',      border: 'border-rose-400/30' },
  amber:  { bg: 'bg-amber-500/10',   text: 'text-amber-600 dark:text-amber-400',    stat: 'text-amber-500 dark:text-amber-300',    border: 'border-amber-400/30' },
}

export function WhyChooseUs() {
  const { data: page } = useQuery({
    queryKey: ['wcu-page-content'],
    queryFn: () => whyChooseUsApi.getPageContent(),
    staleTime: 60_000,
  })

  const published = (page?.items ?? [])
    .filter(i => i.isPublished)
    .sort((a, b) => a.sortOrder - b.sortOrder)

  const stats = [
    { value: page?.statStudents  ?? '2,000+', label: 'Students Enrolled' },
    { value: page?.statEducators ?? '120+',   label: 'Qualified Educators' },
    { value: page?.statPassRate  ?? '97%',    label: 'KCSE Pass Rate' },
    { value: page?.statActivities ?? '30+',   label: 'Co-Curricular Activities' },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">

      {/* Hero */}
      <ScrollReveal className="mb-6 text-center">
        <p className="mb-3 inline-block rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-gold">
          {page?.tagline ?? 'The Alber Difference'}
        </p>
        <h1 className="mb-5 text-5xl font-bold text-primary dark:text-gold md:text-7xl">
          {page?.headline ?? 'Why Choose Us?'}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted leading-relaxed">
          {page?.subheadline ?? 'Adjacent to the Governor\'s Offices in Kutus, Kirinyaga County — Alber School has been redefining private education in Kenya since 2005. Here\'s what makes us different.'}
        </p>
      </ScrollReveal>

      {/* Stats bar */}
      <ScrollReveal delay={0.1} className="mb-20">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i, duration: 0.5 }}
            >
              <GlassCard className="p-6 text-center" hover={false}>
                <p className="text-3xl font-black text-primary dark:text-gold md:text-4xl">{s.value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted">{s.label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>

      {/* Main difference cards */}
      {published.length > 0 && (
        <div className="mb-20 space-y-10">
          {published.map((item, i) => {
            const c = COLOR_MAP[item.color] ?? COLOR_MAP.gold
            const isEven = i % 2 === 0
            return (
              <ScrollReveal key={item.id} delay={0.05}>
                <div className={`flex flex-col gap-6 lg:flex-row lg:items-center ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
                  {/* Icon / stat side */}
                  <div className="flex-shrink-0 lg:w-64">
                    <GlassCard className={`p-8 text-center border ${c.border}`} hover={false}>
                      <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl text-4xl ${c.bg}`}>
                        {item.icon}
                      </div>
                      <p className={`text-4xl font-black ${c.stat}`}>{item.stat}</p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted">{item.statLabel}</p>
                    </GlassCard>
                  </div>

                  {/* Content side */}
                  <GlassCard className="flex-1 p-8" hover={false}>
                    <p className={`mb-2 text-xs font-bold uppercase tracking-widest ${c.text}`}>
                      {item.subtitle}
                    </p>
                    <h2 className="mb-4 text-2xl font-bold md:text-3xl">{item.title}</h2>
                    <p className="leading-relaxed text-muted">{item.description}</p>
                  </GlassCard>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      )}

      {/* Proof points / testimonial strip */}
      <ScrollReveal className="mb-20">
        <GlassCard className="overflow-hidden p-0" hover={false}>
          <div className="bg-gradient-to-r from-primary/90 to-primary/70 p-10 text-white dark:from-[#0d1b0d] dark:to-[#0d1b0d]/80">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gold">What Our Families Say</p>
            <blockquote className="mb-6 text-xl font-medium leading-relaxed md:text-2xl">
              "Alber School gave my daughter more than an education — it gave her confidence, discipline,
              and a love for learning that I know will carry her for the rest of her life."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-sm font-black text-dark">GN</div>
              <div>
                <p className="font-bold">Grace Njeri</p>
                <p className="text-sm text-white/70">Parent · Kutus, Kirinyaga</p>
              </div>
            </div>
          </div>
          <div className="grid gap-px bg-gray-200 dark:bg-white/10 sm:grid-cols-3">
            {[
              { icon: '✅', text: 'TSC-Registered Teachers' },
              { icon: '✅', text: 'KNEC & Cambridge Examinations' },
              { icon: '✅', text: 'CBC-Aligned Curriculum' },
              { icon: '✅', text: 'M-Pesa Fee Payments' },
              { icon: '✅', text: 'GPS-Tracked School Buses' },
              { icon: '✅', text: 'On-Campus ABRSM Music Exams' },
            ].map((p) => (
              <div key={p.text} className="flex items-center gap-2.5 bg-surface px-5 py-4">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                <span className="text-sm font-medium">{p.text}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal delay={0.1}>
        <div className="rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-10 text-center text-white dark:from-[#0d1b0d] dark:to-[#0d1b0d]/60">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            {page?.ctaHeadline ?? 'Ready to Give Your Child the Alber Advantage?'}
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-white/80">
            {page?.ctaSubtext ?? 'Applications for the 2027 academic year are now open. Spaces fill fast — secure your child\'s place at Kirinyaga\'s premier school today.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/admissions"
              className="flex items-center gap-2 rounded-2xl bg-gold px-8 py-3.5 font-bold text-dark transition hover:scale-105 hover:bg-yellow-400"
            >
              Apply Now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="flex items-center gap-2 rounded-2xl border-2 border-white/40 px-8 py-3.5 font-bold text-white transition hover:scale-105 hover:border-white hover:bg-white/10"
            >
              Book a Visit
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </div>
  )
}
