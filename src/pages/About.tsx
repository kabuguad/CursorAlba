import { useQuery } from '@tanstack/react-query'
import { GlassCard } from '../components/ui/GlassCard'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { HistoryStepper } from '../components/about/HistoryStepper'
import { aboutApi } from '../services/aboutApi'

const LEADERSHIP = [
  {
    name: 'Dr. Wanjiku Mwangi',
    title: 'Head Teacher',
    img: 'https://i.pravatar.cc/400?img=47',
    bio: 'PhD in Educational Leadership, University of Nairobi. 25 years in education. Champion of CBC implementation in Kirinyaga.',
  },
  {
    name: 'Mr. Peter Kamau',
    title: 'Deputy Head Teacher',
    img: 'https://i.pravatar.cc/400?img=11',
    bio: 'M.Ed Kenyatta University. Specialises in curriculum development and teacher professional growth.',
  },
  {
    name: 'Ms. Eunice Achieng',
    title: 'Director of Academics',
    img: 'https://i.pravatar.cc/400?img=48',
    bio: 'Cambridge-certified IGCSE coordinator. Oversees all academic pathways from PP1 through Grade 12.',
  },
  {
    name: 'Mr. Francis Omondi',
    title: 'Director of Co-Curricular',
    img: 'https://i.pravatar.cc/400?img=15',
    bio: 'Former national athlete. Leads sports, music, drama, and all co-curricular programmes across the school.',
  },
]

export function About() {
  const { data: pageContents = [] } = useQuery({
    queryKey: ['about-page-content'],
    queryFn: () => aboutApi.getPageContent(),
    staleTime: 60_000,
  })

  const { data: coreValues = [] } = useQuery({
    queryKey: ['core-values'],
    queryFn: () => aboutApi.getCoreValues(),
    staleTime: 60_000,
  })

  const { data: milestones = [] } = useQuery({
    queryKey: ['history-milestones'],
    queryFn: () => aboutApi.getHistoryMilestones(),
    staleTime: 60_000,
  })

  const page = pageContents[0]

  const headline    = page?.headline    ?? 'About Us'
  const subheadline = page?.subheadline ?? "Adjacent to the Governor's Offices in Kutus, Kirinyaga County — redefining private education in Kenya since 2005."
  const mission     = page?.mission     ?? "To cultivate visionary leaders through innovative, competency-based education that honours Kenyan heritage while embracing global excellence. We nurture every learner's genius — academically, artistically, and athletically."
  const vision      = page?.vision      ?? "To be East Africa's most sought-after private institution — where every learner discovers their genius in world-class facilities, guided by expert educators who inspire curiosity and ambition in equal measure."
  const historyIntro = page?.historyIntro ?? "Two decades of excellence — from a single campus in Kutus to Kirinyaga's premier educational institution."

  const sortedValues = [...coreValues].sort((a, b) => a.sortOrder - b.sortOrder)

  const historySteps = [...milestones]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((m) => ({ year: m.year, title: m.title, desc: m.description }))

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Hero */}
      <ScrollReveal className="mb-16 text-center">
        <h1 className="mb-4 text-5xl font-bold text-primary dark:text-gold md:text-7xl">
          {headline}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted">{subheadline}</p>
      </ScrollReveal>

      {/* Mission & Vision */}
      <div className="relative mb-24 grid gap-8 lg:grid-cols-2">
        <ScrollReveal>
          <GlassCard className="relative z-10 -rotate-1 p-8 lg:mt-12">
            <h2 className="mb-4 text-3xl font-bold text-primary dark:text-gold">Our Mission</h2>
            <p className="leading-relaxed text-muted">{mission}</p>
          </GlassCard>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <GlassCard className="relative z-20 rotate-1 p-8 lg:-mt-8 lg:ml-12">
            <h2 className="mb-4 text-3xl font-bold text-primary dark:text-gold">Our Vision</h2>
            <p className="leading-relaxed text-muted">{vision}</p>
          </GlassCard>
        </ScrollReveal>
      </div>

      {/* Core Values */}
      {sortedValues.length > 0 && (
        <>
          <ScrollReveal className="text-center">
            <h2 className="mb-8 text-4xl font-bold">Core Values</h2>
          </ScrollReveal>
          <div className="mb-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedValues.map((v, i) => (
              <ScrollReveal key={v.id} delay={i * 0.08}>
                <GlassCard className="p-6">
                  <span className="mb-3 block text-4xl">{v.icon}</span>
                  <h3 className="mb-2 text-lg font-bold text-primary dark:text-gold">{v.title}</h3>
                  <p className="text-sm text-muted">{v.description}</p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </>
      )}

      {/* Leadership Team — static */}
      <ScrollReveal className="text-center">
        <h2 className="mb-8 text-4xl font-bold">Leadership Team</h2>
      </ScrollReveal>
      <div className="mb-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {LEADERSHIP.map((l, i) => (
          <ScrollReveal key={l.name} delay={i * 0.1}>
            <GlassCard className="overflow-hidden p-0 text-center">
              <img src={l.img} alt={l.name} className="h-48 w-full object-cover object-top" />
              <div className="p-5">
                <h3 className="font-bold">{l.name}</h3>
                <p className="text-xs font-semibold text-gold">{l.title}</p>
                <p className="mt-2 text-xs text-muted leading-relaxed">{l.bio}</p>
              </div>
            </GlassCard>
          </ScrollReveal>
        ))}
      </div>

      {/* History Milestones */}
      {historySteps.length > 0 && (
        <>
          <ScrollReveal className="text-center">
            <h2 className="mb-8 text-4xl font-bold">Our History</h2>
            <p className="mx-auto mb-10 max-w-xl text-muted">{historyIntro}</p>
          </ScrollReveal>
          <ScrollReveal delay={0.1} className="flex justify-center">
            <HistoryStepper steps={historySteps} />
          </ScrollReveal>
        </>
      )}
    </div>
  )
}
