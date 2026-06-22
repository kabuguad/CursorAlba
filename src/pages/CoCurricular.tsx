import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { GlassCard } from '../components/ui/GlassCard'
import { PageHero } from '../components/layout/PageHero'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { Button } from '../components/ui/Button'
import { cn } from '../lib/utils'
import { useQuery } from '@tanstack/react-query'
import { coCurrApi } from '../services/coCurrApi'

const PALETTE = [
  { color: 'from-green-500/20 to-emerald-500/10',  border: 'border-green-500/30'  },
  { color: 'from-purple-500/20 to-pink-500/10',    border: 'border-purple-500/30' },
  { color: 'from-blue-500/20 to-cyan-500/10',      border: 'border-blue-500/30'   },
  { color: 'from-amber-500/20 to-orange-500/10',   border: 'border-amber-500/30'  },
]

function paletteFor(sortOrder: number) {
  return PALETTE[(sortOrder - 1) % PALETTE.length]
}

export function CoCurricular() {
  const location = useLocation()

  const { data: pageContentList = [] } = useQuery({
    queryKey: ['cocurr-page-content'],
    queryFn: () => coCurrApi.getPageContent(),
    staleTime: 60_000,
  })
  const { data: categories = [], isLoading: catsLoading } = useQuery({
    queryKey: ['cocurr-categories'],
    queryFn: () => coCurrApi.getCategories(),
    staleTime: 60_000,
  })
  const { data: allActivities = [] } = useQuery({
    queryKey: ['cocurr-activities'],
    queryFn: () => coCurrApi.getActivities(),
    staleTime: 60_000,
  })

  const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder)
  const pageContent = pageContentList[0]

  const headline    = pageContent?.headline    ?? 'Co-Curricular'
  const subheadline = pageContent?.subheadline ?? "Beyond the classroom — four pillars of holistic development aligned to Kenya's CBC framework and Alber School's vision of whole-learner excellence."
  const ctaHeadline = pageContent?.ctaHeadline ?? "Enrich Your Child's Journey"
  const ctaSubtext  = pageContent?.ctaSubtext  ?? "Every learner at Alber participates in co-curricular activities as part of their holistic CBC assessment. Talk to us about pathways that match your child's passions."

  const [activeId, setActiveId] = useState<number | null>(null)

  useEffect(() => {
    if (sorted.length && activeId === null) {
      const hashSlug = location.hash.slice(1)
      const fromHash = sorted.find(c => c.title.toLowerCase().replace(/\s+/g, '-') === hashSlug || String(c.id) === hashSlug)
      setActiveId(fromHash?.id ?? sorted[0].id)
    }
  }, [sorted, activeId, location.hash])

  useEffect(() => {
    const hashSlug = location.hash.slice(1)
    if (!hashSlug || !sorted.length) return
    const fromHash = sorted.find(c => c.title.toLowerCase().replace(/\s+/g, '-') === hashSlug || String(c.id) === hashSlug)
    if (fromHash) setActiveId(fromHash.id)
  }, [location.hash, sorted])

  const current = sorted.find(c => c.id === activeId) ?? sorted[0]
  const currentActivities = allActivities
    .filter(a => a.cocurrCategoryId === current?.id)
    .sort((a, b) => a.sortOrder - b.sortOrder)

  const setTab = (id: number) => {
    setActiveId(id)
    const cat = sorted.find(c => c.id === id)
    if (cat) window.history.replaceState(null, '', `#${cat.title.toLowerCase().replace(/\s+/g, '-')}`)
  }

  return (
    <div className="overflow-hidden">
      <PageHero
        title={headline}
        subtitle={subheadline}
        badge="Beyond the Classroom"
        image="https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1920&q=80"
        variant="cinematic"
        overlay="teal"
      />
      <div className="mx-auto max-w-7xl px-4 py-12">

      <ScrollReveal>
        <div className="mb-10 flex overflow-x-auto pb-2 scrollbar-hide justify-start md:justify-center gap-3">
          {catsLoading
            ? [1,2,3,4].map(i => <div key={i} className="h-11 w-40 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700 flex-shrink-0" />)
            : sorted.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setTab(cat.id)}
                className={cn(
                  'flex items-center flex-shrink-0 gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all hover:scale-105 whitespace-nowrap',
                  activeId === cat.id
                    ? 'bg-primary text-white dark:bg-gold dark:text-dark'
                    : 'glass glass-border',
                )}
              >
                <span>{cat.icon}</span>
                {cat.title}
              </button>
            ))
          }
        </div>
      </ScrollReveal>

      {current && (
        <ScrollReveal key={current.id} delay={0.05}>
          <div className={cn('mb-10 rounded-3xl border bg-gradient-to-br p-8', paletteFor(current.sortOrder).color, paletteFor(current.sortOrder).border)}>
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="text-5xl">{current.icon}</span>
              <div>
                <h2 className="text-3xl font-bold">{current.heading}</h2>
                <p className="mx-auto mt-2 max-w-3xl text-muted">{current.intro}</p>
              </div>
            </div>
          </div>

          {currentActivities.length === 0 && !catsLoading && (
            <p className="py-12 text-center text-muted text-sm">No activities listed for this category yet.</p>
          )}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {currentActivities.map((act, i) => (
              <ScrollReveal key={act.id} delay={i * 0.05}>
                <GlassCard className="h-full p-5">
                  <span className="mb-3 block text-4xl">{act.icon}</span>
                  <h3 className="mb-1 font-bold text-primary dark:text-gold">{act.name}</h3>
                  <p className="text-xs text-muted leading-relaxed">{act.description}</p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      )}

      <ScrollReveal className="mt-20">
        <GlassCard className="p-8 text-center">
          <h2 className="mb-4 text-3xl font-bold">{ctaHeadline}</h2>
          <p className="mb-8 text-muted max-w-2xl mx-auto">{ctaSubtext}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/admissions"><Button variant="primary">Apply for Admission</Button></Link>
            <Link to="/contact"><Button variant="outline">Speak to an Advisor</Button></Link>
          </div>
        </GlassCard>
      </ScrollReveal>
      </div>
    </div>
  )
}
