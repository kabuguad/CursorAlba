import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GlassCard } from '../components/ui/GlassCard'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { Button } from '../components/ui/Button'
import { cn } from '../lib/utils'
import { useQuery } from '@tanstack/react-query'
import { academicsApi } from '../services/academicsApi'
import { LEVEL_COLOR_MAP } from '../lib/academicsColors'
import { GRADIENT_MAP, DEFAULT_PILLARS } from '../data/pillars'

const VALUES = [
  { value: 'Responsibility', icon: '⚖️' },
  { value: 'Respect', icon: '🙏' },
  { value: 'Unity', icon: '🤝' },
  { value: 'Integrity', icon: '🌟' },
  { value: 'Patriotism', icon: '🇰🇪' },
  { value: 'Care', icon: '❤️' },
  { value: 'Compassion', icon: '🌸' },
]

const GRADING = [
  { grade: 'A+', range: '90–100%', desc: 'Exceptional — exceeds all expectations' },
  { grade: 'A',  range: '80–89%',  desc: 'Excellent — meets all learning outcomes' },
  { grade: 'B+', range: '70–79%',  desc: 'Very Good — exceeds most expectations' },
  { grade: 'B',  range: '60–69%',  desc: 'Good — meets most learning outcomes' },
  { grade: 'C+', range: '50–59%',  desc: 'Above Average — meets core outcomes' },
  { grade: 'C',  range: '40–49%',  desc: 'Average — meets minimum outcomes' },
  { grade: 'D',  range: '30–39%',  desc: 'Below Average — needs improvement' },
  { grade: 'E',  range: '0–29%',   desc: 'Fail — does not meet outcomes' },
]

const CALENDAR = [
  { term: 'Term 1', start: '8 January 2026',  end: '28 March 2026',    exams: '16–27 March 2026',         holiday: '28 March – 26 April 2026' },
  { term: 'Term 2', start: '27 April 2026',   end: '3 July 2026',      exams: '22 June – 3 July 2026',    holiday: '4 July – 2 August 2026' },
  { term: 'Term 3', start: '3 August 2026',   end: '6 November 2026',  exams: '19 Oct – 6 November 2026', holiday: 'December – January' },
]

const KEY_ASSESSMENTS = [
  { level: 'PP1 & PP2',    exam: 'Continuous Portfolio Assessment',                 body: 'Internal',        note: 'Play-based formative assessment each term' },
  { level: 'Grades 1 – 6', exam: 'Continuous Assessment Tests (CATs)',              body: 'Internal / KNEC', note: '3 CATs per term + end-of-year school exams' },
  { level: 'Grade 9',      exam: 'Kenya Junior School Education Assessment (KJSEA)', body: 'KNEC',            note: 'National exam — gateway to Senior School' },
  { level: 'Grade 12',     exam: 'Kenya Certificate of Secondary Education (KCSE)',  body: 'KNEC',            note: 'National final examination — university entry' },
]

export function Academics() {
  // ── Page content (hero + CTA) from API ──────────────────────────────────
  const { data: pageContentList = [] } = useQuery({
    queryKey: ['academics-page-content'],
    queryFn: () => academicsApi.getPageContent(),
    staleTime: 60_000,
  })
  const pageContent = pageContentList[0]

  // ── School levels from real API ──────────────────────────────────────────
  const { data: schoolLevels = [] } = useQuery({
    queryKey: ['school-levels'],
    queryFn: () => academicsApi.getSchoolLevels(),
    staleTime: 60_000,
  })

  // ── CBC Competencies from real API ("/api/cbc-competencies") ─────────────
  const { data: apiCompetencies = [] } = useQuery({
    queryKey: ['cbc-competencies'],
    queryFn: () => academicsApi.getCompetencies(),
    staleTime: 60_000,
  })

  // ── Teaching Pillars from real API ("/api/teaching-pillars") ────────────
  const { data: apiPillars = [] } = useQuery({
    queryKey: ['teaching-pillars'],
    queryFn: () => academicsApi.getPillars(),
    staleTime: 60_000,
  })

  // Fall back to default pillars when API hasn't returned data yet
  const pillars = apiPillars.length > 0 ? apiPillars : DEFAULT_PILLARS

  const sorted = [...schoolLevels].sort((a, b) => a.sortOrder - b.sortOrder)
  const [activeSlug, setActiveSlug] = useState<string>('')
  const activeId = activeSlug || sorted[0]?.slug || ''
  const current = sorted.find((l) => l.slug === activeId) ?? sorted[0]

  const heroHeadline    = pageContent?.headline    ?? 'Programs & Academics'
  const heroSubheadline = pageContent?.subheadline ?? 'From Playgroup through Senior School — a seamless CBC journey that develops the whole learner across six structured levels.'
  const ctaHeadline     = pageContent?.ctaHeadline ?? 'Ready to Enrol?'
  const ctaSubtext      = pageContent?.ctaSubtext  ?? 'Applications are open for the 2026 intake across all levels — from Playgroup to Grade 12. Limited spaces remain.'

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">

      {/* ── Hero ── */}
      <ScrollReveal className="mb-16 text-center">
        <h1 className="mb-4 text-5xl font-bold md:text-7xl">{heroHeadline}</h1>
        <p className="mx-auto max-w-2xl text-muted">{heroSubheadline}</p>
      </ScrollReveal>

      {/* ── School Structure tabs ── */}
      {sorted.length > 0 && (
        <>
          <ScrollReveal className="mb-16">
            <div className="rounded-3xl glass glass-border p-6 text-center">
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-muted">School Structure</p>
              <div className="flex overflow-x-auto pb-2 scrollbar-hide justify-start md:justify-center gap-2">
                {sorted.map((lv) => (
                  <button
                    key={lv.slug}
                    onClick={() => setActiveSlug(lv.slug)}
                    className={cn(
                      'flex flex-col flex-shrink-0 rounded-2xl px-4 py-3 text-center transition-all hover:scale-105 min-w-[100px]',
                      activeId === lv.slug
                        ? 'bg-primary text-white dark:bg-gold dark:text-dark'
                        : 'glass glass-border',
                    )}
                  >
                    <span className="text-lg">{lv.icon}</span>
                    <span className="mt-1 text-sm font-bold leading-tight">{lv.name}</span>
                    <span className={cn('text-[10px]', activeId === lv.slug ? 'text-white/70 dark:text-dark/70' : 'text-muted')}>{lv.ages}</span>
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {current && (() => {
            const colors = LEVEL_COLOR_MAP[current.colorKey] ?? LEVEL_COLOR_MAP['blue']
            const highlights = current.highlights.split('\n').map((h) => h.trim()).filter(Boolean)
            return (
              <ScrollReveal key={current.slug} delay={0.05} className="mb-16">
                <div className={cn('rounded-3xl border bg-gradient-to-br p-8', colors.color, colors.border)}>
                  <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <span className="text-5xl">{current.icon}</span>
                        <div>
                          <h2 className="text-3xl font-bold">{current.name}</h2>
                          <p className="text-sm text-muted">{current.ages}</p>
                        </div>
                      </div>
                      <p className="mt-4 max-w-xl text-muted leading-relaxed">{current.desc}</p>
                    </div>
                    <div className="md:w-80">
                      <p className="mb-3 text-sm font-bold uppercase tracking-wider">Learning Areas</p>
                      <div className="flex flex-wrap gap-2">
                        {highlights.map((h) => (
                          <span key={h} className="rounded-xl border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-medium">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )
          })()}
        </>
      )}

      {/* ── Our Approach — CBC Competencies from /api/cbc-competencies ── */}
      {apiCompetencies.length > 0 && (
        <ScrollReveal className="mb-16">
          <div className="mb-10 text-center">
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-gold">Our Approach</p>
            <h2 className="text-4xl font-bold">The CBC Difference</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted">
              Kenya's Competency-Based Curriculum moves beyond exams to develop core competencies that equip every learner for life, work, and active citizenship.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {apiCompetencies.filter((c) => !c.isFeatured).map((c, i) => (
              <ScrollReveal key={c.id} delay={i * 0.07}>
                <GlassCard className="flex h-full flex-col gap-3 p-6">
                  <span className="text-4xl">{c.icon}</span>
                  <h3 className="font-bold leading-snug">{c.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{c.description}</p>
                </GlassCard>
              </ScrollReveal>
            ))}
            {apiCompetencies.filter((c) => c.isFeatured).map((c, i) => (
              <ScrollReveal
                key={c.id}
                delay={(apiCompetencies.filter((x) => !x.isFeatured).length + i) * 0.07}
                className="sm:col-span-2 lg:col-span-1 xl:col-span-2"
              >
                <GlassCard className="flex h-full flex-col gap-3 bg-gradient-to-br from-primary/10 to-gold/10 p-6">
                  <span className="text-4xl">{c.icon}</span>
                  <h3 className="font-bold leading-snug">{c.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{c.description}</p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      )}

      {/* ── How We Teach — Teaching Pillars from /api/teaching-pillars ── */}
      <ScrollReveal className="mb-16">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-gold">How We Teach</p>
          <h2 className="text-4xl font-bold">Our Four Pillars</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {pillars.map((p, i) => {
            const g = GRADIENT_MAP[p.gradient] ?? GRADIENT_MAP.green
            return (
              <ScrollReveal key={p.id} delay={i * 0.1}>
                <div className={cn('h-full rounded-3xl border bg-gradient-to-br p-7', g.color, g.border)}>
                  <span className="mb-4 block text-4xl">{p.icon}</span>
                  <h3 className="mb-2 text-xl font-bold">{p.title}</h3>
                  <p className="leading-relaxed text-muted">{p.description ?? (p as any).desc}</p>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </ScrollReveal>

      {/* ── Values ── */}
      <ScrollReveal className="mb-16">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-gold">Character Formation</p>
          <h2 className="text-4xl font-bold">Values We Instil</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            CBC integrates core societal values into every lesson and interaction — shaping citizens of character alongside scholars of merit.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {VALUES.map((v, i) => (
            <ScrollReveal key={v.value} delay={i * 0.06}>
              <GlassCard className="flex items-center gap-3 px-6 py-4">
                <span className="text-2xl">{v.icon}</span>
                <span className="text-base font-semibold">{v.value}</span>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </ScrollReveal>

      {/* ── Key Assessments ── */}
      <ScrollReveal className="mb-16">
        <h2 className="mb-6 text-center text-3xl font-bold">Key National Assessments</h2>
        <GlassCard className="overflow-x-auto p-0">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-4">Level</th>
                <th className="p-4">Assessment</th>
                <th className="p-4">Body</th>
                <th className="p-4">Note</th>
              </tr>
            </thead>
            <tbody>
              {KEY_ASSESSMENTS.map((a) => (
                <tr key={a.level} className="border-b border-theme/50 transition hover:bg-tint/40 dark:hover:bg-dark-card">
                  <td className="p-4 font-semibold text-primary dark:text-gold">{a.level}</td>
                  <td className="p-4 font-medium">{a.exam}</td>
                  <td className="p-4">
                    <span className="rounded-full bg-gold/20 px-2 py-1 text-xs font-bold text-primary dark:text-gold">{a.body}</span>
                  </td>
                  <td className="p-4 text-muted">{a.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </ScrollReveal>

      {/* ── Grading ── */}
      <ScrollReveal className="mb-16">
        <h2 className="mb-6 text-center text-3xl font-bold">Grading System</h2>
        <GlassCard className="overflow-x-auto p-0">
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-4">Grade</th>
                <th className="p-4">Score Range</th>
                <th className="p-4">Description</th>
              </tr>
            </thead>
            <tbody>
              {GRADING.map((g) => (
                <tr key={g.grade} className="border-b border-theme/50 transition hover:bg-tint/40 dark:hover:bg-dark-card">
                  <td className="p-4 font-bold text-primary dark:text-gold">{g.grade}</td>
                  <td className="p-4">{g.range}</td>
                  <td className="p-4 text-muted">{g.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </ScrollReveal>

      {/* ── Academic Calendar ── */}
      <ScrollReveal className="mb-16">
        <h2 className="mb-6 text-center text-3xl font-bold">Academic Calendar 2026</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {CALENDAR.map((t, i) => (
            <ScrollReveal key={t.term} delay={i * 0.1}>
              <GlassCard className="p-6">
                <h3 className="mb-4 text-lg font-bold text-primary dark:text-gold">{t.term}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Opens</span>
                    <span className="font-medium">{t.start}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Closes</span>
                    <span className="font-medium">{t.end}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Exams</span>
                    <span className="font-medium text-gold">{t.exams}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Holiday</span>
                    <span className="font-medium">{t.holiday}</span>
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </ScrollReveal>

      {/* ── CTA ── */}
      <ScrollReveal>
        <GlassCard className="p-8 text-center">
          <h2 className="mb-4 text-3xl font-bold">{ctaHeadline}</h2>
          <p className="mb-8 max-w-xl mx-auto text-muted">{ctaSubtext}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/admissions"><Button variant="primary">Apply Now</Button></Link>
            <Link to="/contact"><Button variant="outline">Speak to an Advisor</Button></Link>
          </div>
        </GlassCard>
      </ScrollReveal>

    </div>
  )
}
