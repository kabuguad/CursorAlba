import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { GlassCard } from '../components/ui/GlassCard'
import { HistoryStepper } from '../components/about/HistoryStepper'
import { aboutApi } from '../services/aboutApi'
import { Link } from 'react-router-dom'
import { ArrowRight, Award, Users, Globe, BookOpen } from 'lucide-react'

const LEADERSHIP = [
  { name: 'Mrs. Wanjiku Muthoni', title: 'Head Teacher',              img: '/images/avatar-47.jpg', bio: 'M.Ed Kenyatta University. Over 20 years in SDA education. Passionate about holistic, faith-centred learning from primary through secondary.' },
  { name: 'Mr. Peter Kamau',      title: 'Deputy Head Teacher',       img: '/images/avatar-11.jpg', bio: 'B.Ed University of Nairobi. Specialises in CBC curriculum implementation and spiritual formation for primary school learners.' },
  { name: 'Ms. Grace Njeri',      title: 'Head of Secondary',         img: '/images/avatar-48.jpg', bio: 'M.Sc. Education, Daystar University. Oversees Form 1–4 KCSE programmes and boarding academic support for secondary students.' },
  { name: 'Mr. David Omondi',     title: 'Chaplain & Student Life',   img: '/images/avatar-15.jpg', bio: 'SDA-ordained pastor and educator. Leads chapel, devotions, Sabbath programmes, and the spiritual wellbeing of every learner and staff member.' },
]

const MILESTONES_STATS = [
  { icon: Award,    value: '96%',  label: 'KCSE Pass Rate' },
  { icon: Users,    value: '800+', label: 'Students Enrolled' },
  { icon: Globe,    value: '2',    label: 'Levels: Primary & Secondary' },
  { icon: BookOpen, value: '60+',  label: 'Dedicated Educators' },
]

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  )
}

export function About() {
  const { data: pageContents = [] } = useQuery({ queryKey: ['about-page-content'], queryFn: () => aboutApi.getPageContent(), staleTime: 60_000 })
  const { data: coreValues = [] }   = useQuery({ queryKey: ['core-values'],         queryFn: () => aboutApi.getCoreValues(),      staleTime: 60_000 })
  const { data: milestones = [] }   = useQuery({ queryKey: ['history-milestones'],  queryFn: () => aboutApi.getHistoryMilestones(), staleTime: 60_000 })

  const page        = pageContents[0]
  const headline    = page?.headline    ?? 'About Gatumbi SDA School'
  const subheadline = page?.subheadline ?? "Nestled at the foot of Mount Kenya in Gatumbi, Kirinyaga County — a Seventh-day Adventist institution nurturing faith, knowledge, and character since our founding."
  const mission     = page?.mission     ?? "To provide holistic, Christ-centred education that develops the whole child — intellectually, spiritually, physically, and socially — for service to God, family, and nation."
  const vision      = page?.vision      ?? "To be Kirinyaga County's leading faith-based institution — where learners from primary through secondary grow in wisdom, godly character, and academic excellence."
  const historyIntro = page?.historyIntro ?? "From humble beginnings rooted in SDA values to a thriving primary and secondary school — our journey is one of faith, perseverance, and God's faithfulness."

  const sortedValues = [...coreValues].sort((a, b) => a.sortOrder - b.sortOrder)
  const historySteps = [...milestones].sort((a, b) => a.sortOrder - b.sortOrder).map(m => ({ year: m.year, title: m.title, desc: m.description }))

  return (
    <div className="overflow-hidden">

      {/* ── Hero Banner ── */}
      <section
        className="relative flex min-h-[68vh] items-end justify-center overflow-hidden"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0 100%)' }}
      >
        <img
          src="/images/unsplash-1577896851231-70ef18881754.jpg"
          alt=""
          aria-hidden
          className="ken-burns absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/60 to-black/20" />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-gold via-gold/60 to-transparent" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 pb-20 pt-40 text-center">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/30 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
              Est. 2005 · Kutus, Kirinyaga
            </span>
            <h1 className="mt-4 text-5xl font-extrabold leading-tight text-white md:text-7xl [text-shadow:_0_4px_32px_rgba(0,0,0,0.6)]">{headline}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/75">{subheadline}</p>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <div className="bg-primary dark:bg-[#0d1b0d] border-b border-white/10">
        <div className="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
          {MILESTONES_STATS.map((s, i) => (
            <motion.div
              key={s.label}
              className="flex flex-col items-center py-6 px-4 text-center"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <s.icon className="mb-2 h-5 w-5 text-gold/70" />
              <span className="text-2xl font-extrabold text-gold sm:text-3xl">{s.value}</span>
              <span className="mt-1 text-[10px] uppercase tracking-widest text-white/50">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20">

        {/* ── Mission & Vision ── */}
        <FadeIn className="mb-6 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary dark:text-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />Our Foundation
          </span>
          <h2 className="mt-2 text-4xl font-bold">Mission &amp; Vision</h2>
        </FadeIn>

        <div className="mb-24 grid gap-8 lg:grid-cols-2">
          <FadeIn delay={0.05}>
            <div className="group relative h-full overflow-hidden rounded-3xl border border-blue-400/20 bg-gradient-to-br from-blue-500/10 to-blue-500/3 p-8 transition-all hover:shadow-xl hover:border-blue-400/40 dark:from-blue-500/15">
              <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-blue-400/10 blur-2xl -translate-y-8 translate-x-8" />
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-blue-500 dark:text-blue-400">Our Mission</p>
              <h3 className="mb-4 text-2xl font-bold">To Nurture Genius</h3>
              <p className="leading-relaxed text-muted">{mission}</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="group relative h-full overflow-hidden rounded-3xl border border-green-400/20 bg-gradient-to-br from-green-500/10 to-green-500/3 p-8 transition-all hover:shadow-xl hover:border-green-400/40 dark:from-green-500/15">
              <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-green-400/10 blur-2xl -translate-y-8 translate-x-8" />
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-green-500 dark:text-green-400">Our Vision</p>
              <h3 className="mb-4 text-2xl font-bold">Leaders for Tomorrow</h3>
              <p className="leading-relaxed text-muted">{vision}</p>
            </div>
          </FadeIn>
        </div>

        {/* ── Core Values ── */}
        {sortedValues.length > 0 && (
          <>
            <FadeIn className="mb-12 text-center">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary dark:text-gold">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />Core Values
              </span>
              <h2 className="mt-2 text-4xl font-bold">What We Stand For</h2>
            </FadeIn>
            <div className="mb-24 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sortedValues.map((v, i) => (
                <FadeIn key={v.id} delay={i * 0.07}>
                  <GlassCard className="group h-full p-6 transition-all hover:scale-[1.02] hover:ring-2 hover:ring-gold/30">
                    <span className="mb-3 block text-4xl group-hover:scale-110 transition-transform">{v.icon}</span>
                    <h3 className="mb-2 text-lg font-bold text-primary dark:text-gold">{v.title}</h3>
                    <p className="text-sm leading-relaxed text-muted">{v.description}</p>
                  </GlassCard>
                </FadeIn>
              ))}
            </div>
          </>
        )}

        {/* ── Leadership ── */}
        <FadeIn className="mb-12 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary dark:text-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />Leadership Team
          </span>
          <h2 className="mt-2 text-4xl font-bold">Meet Our Leaders</h2>
        </FadeIn>
        <div className="mb-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {LEADERSHIP.map((l, i) => (
            <FadeIn key={l.name} delay={i * 0.1}>
              <GlassCard className="group overflow-hidden p-0 text-center transition-all hover:shadow-xl hover:scale-[1.02]">
                <div className="relative overflow-hidden">
                  <img src={l.img} alt={l.name} className="h-52 w-full object-cover object-top transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-foreground">{l.name}</h3>
                  <p className="mt-0.5 text-xs font-semibold text-gold">{l.title}</p>
                  <div className="my-3 h-px w-8 bg-gold/40 mx-auto" />
                  <p className="text-xs text-muted leading-relaxed">{l.bio}</p>
                </div>
              </GlassCard>
            </FadeIn>
          ))}
        </div>

        {/* ── History ── */}
        {historySteps.length > 0 && (
          <>
            <FadeIn className="mb-4 text-center">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary dark:text-gold">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />Our Journey
              </span>
              <h2 className="mt-2 text-4xl font-bold">Our History</h2>
              <p className="mx-auto mt-4 max-w-xl text-muted">{historyIntro}</p>
            </FadeIn>
            <FadeIn delay={0.1} className="flex justify-center">
              <HistoryStepper steps={historySteps} />
            </FadeIn>
          </>
        )}
      </div>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-primary py-16 dark:bg-[#0d1b0d]">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(232,184,75,0.5) 30px, rgba(232,184,75,0.5) 31px)' }} />
        <FadeIn className="relative z-10 mx-auto max-w-2xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Come See Gatumbi SDA School For Yourself</h2>
          <p className="mb-8 text-white/70">Visit our campus beneath Mount Kenya and experience the faith, nature, and excellence that make Gatumbi SDA School truly special.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="flex items-center gap-2 rounded-2xl bg-gold px-8 py-3.5 font-bold text-black transition hover:scale-105 hover:bg-yellow-400">
              Book a Tour <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/admissions" className="flex items-center gap-2 rounded-2xl border-2 border-white/30 px-8 py-3.5 font-bold text-white transition hover:scale-105 hover:bg-white/10">
              Apply Now
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>
  )
}
