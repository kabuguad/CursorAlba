import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Quote, ShieldCheck, Trophy, Music, BookOpen,
  Globe, Baby, FlaskConical, GraduationCap, Loader2,
  Star, Heart, Lightbulb, Users, Target, Zap,
} from 'lucide-react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { GlassCard } from '../components/ui/GlassCard'
import { useQuery } from '@tanstack/react-query'
import { unwrap } from '../services/mockApi'
import { contentService } from '../services/contentService'
import { useCmsVal } from '../hooks/useCmsData'

const HERO_IMAGES = [
  'https://picsum.photos/seed/alber-campus/1400/900',
  'https://picsum.photos/seed/alber-class/1400/900',
  'https://picsum.photos/seed/alber-sports/1400/900',
  'https://picsum.photos/seed/alber-arts/1400/900',
]

const TESTIMONIALS = [
  { name: 'Grace Njeri', role: 'Parent · Grade 5', initials: 'GN', quote: 'Alber School has transformed my daughter completely. The teaching quality is unmatched anywhere in Kirinyaga County.' },
  { name: 'Brian Mutua', role: 'Student · Grade 9', initials: 'BM', quote: 'The sports facilities here are world-class. I have grown as both an athlete and a leader since joining Alber.' },
  { name: 'Dr. Samuel Kariuki', role: 'Parent · PP2 & Grade 7', initials: 'SK', quote: 'Both my children attend Alber. From Playgroup all the way to Senior School — the continuity and quality are simply unmatched.' },
  { name: 'Amina Ochieng', role: 'Student · Music Academy', initials: 'AO', quote: 'I performed my first piano recital here in Grade 5. The music teachers are genuinely world-class professionals.' },
]

const CORE_VALUES = [
  { icon: Star,       label: 'Excellence',   desc: 'We pursue the highest standards in everything — academic, co-curricular, and personal growth.',  color: 'from-yellow-500/20 to-yellow-500/5',  ring: 'ring-yellow-400/40',  text: 'text-yellow-500 dark:text-yellow-400' },
  { icon: Heart,      label: 'Integrity',    desc: 'Honesty, accountability, and respect form the moral backbone of every Alber learner and staff member.', color: 'from-rose-500/20 to-rose-500/5',     ring: 'ring-rose-400/40',    text: 'text-rose-500 dark:text-rose-400' },
  { icon: Lightbulb,  label: 'Innovation',   desc: 'Curiosity, creativity, and a growth mindset are nurtured so every learner becomes a lifelong problem-solver.', color: 'from-blue-500/20 to-blue-500/5',    ring: 'ring-blue-400/40',    text: 'text-blue-500 dark:text-blue-400' },
  { icon: Users,      label: 'Community',    desc: 'We are a family — parents, teachers, and learners united by a shared vision for Kirinyaga\'s future.', color: 'from-green-500/20 to-green-500/5',  ring: 'ring-green-400/40',   text: 'text-green-500 dark:text-green-400' },
  { icon: Target,     label: 'Purpose',      desc: 'Every programme, policy, and pedagogy is designed with a single aim: unlocking each child\'s unique genius.', color: 'from-purple-500/20 to-purple-500/5',ring: 'ring-purple-400/40',  text: 'text-purple-500 dark:text-purple-400' },
  { icon: Zap,        label: 'Resilience',   desc: 'We build children who rise — emotionally strong, adaptable, and ready for whatever tomorrow brings.',  color: 'from-orange-500/20 to-orange-500/5',ring: 'ring-orange-400/40',  text: 'text-orange-500 dark:text-orange-400' },
]

const WHY_ALBER = [
  { icon: Baby,         level: 'ECDE · PP1 & PP2',           title: 'Play-Based Early Years',            desc: 'ECD specialists guide children through structured play, sensory discovery, and social development — laying a confident foundation.',     color: 'bg-pink-500/10 text-pink-500' },
  { icon: BookOpen,     level: 'Primary · Grades 1–6',        title: 'CBC Literacy & Numeracy',           desc: 'Learner-centred, project-based CBC teaching builds strong literacy, numeracy, and critical thinking.',                                   color: 'bg-blue-500/10 text-blue-500' },
  { icon: FlaskConical, level: 'Junior Secondary · Gr. 7–9',  title: 'STEM, Careers & Community',         desc: 'Dedicated STEM labs, career pathway exploration, Community Service Learning, and Career & Technical Skills.',                            color: 'bg-emerald-500/10 text-emerald-500' },
  { icon: GraduationCap,level: 'Senior School · Gr. 10–12',   title: 'KCSE & IGCSE University Pathways',  desc: 'Rigorous KCSE preparation plus Cambridge IGCSE & A-Level tracks with dedicated university counselling from Grade 10.',                     color: 'bg-purple-500/10 text-purple-500' },
  { icon: Trophy,       level: 'All Levels',                  title: 'Holistic Co-Curricular Life',       desc: 'Every learner from PP1 to Grade 12 participates in sports, music, drama, or dance guided by professional coaches.',                     color: 'bg-gold/10 text-gold' },
  { icon: ShieldCheck,  level: 'All Levels',                  title: 'Safe, Certified & Fully Staffed',   desc: 'TSC-registered teachers, CCTV-monitored classrooms, a fully fenced campus, and max 30 learners per class.',                             color: 'bg-primary/10 text-primary dark:text-gold' },
]

const PROGRAM_ICONS: Record<string, string> = {
  daycare: '🌱', primary: '📚', junior: '🔬', senior: '🎓',
}

function AnimatedCounter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = Math.ceil(end / 60)
    const t = setInterval(() => {
      start = Math.min(start + step, end)
      setCount(start)
      if (start >= end) clearInterval(t)
    }, 24)
    return () => clearInterval(t)
  }, [inView, end])
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary dark:text-gold">
      <span className="h-1.5 w-1.5 rounded-full bg-gold" />
      {children}
    </span>
  )
}

export function Home() {
  const [slide, setSlide] = useState(0)
  const [testimonial, setTestimonial] = useState(0)
  const get = useCmsVal('pg-home')

  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['public-events'],
    queryFn: () => contentService.listEvents().then(unwrap),
  })
  const { data: programLevels = [], isLoading: programsLoading } = useQuery({
    queryKey: ['public-programs'],
    queryFn: () => contentService.listProgramLevels().then(unwrap),
  })
  const { data: galleryImages = [], isLoading: galleryLoading } = useQuery({
    queryKey: ['public-gallery'],
    queryFn: () => contentService.listGalleryImages().then(unwrap).then(imgs => imgs.filter(img => img.isPublic).slice(0, 9)),
  })

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % HERO_IMAGES.length), 5000)
    return () => clearInterval(t)
  }, [])
  useEffect(() => {
    const t = setInterval(() => setTestimonial(s => (s + 1) % TESTIMONIALS.length), 6000)
    return () => clearInterval(t)
  }, [])

  const upcomingEvents = events.filter(e => !e.isPast).slice(0, 4)
  const displayPrograms = programLevels.length > 0 ? programLevels : []

  return (
    <>
      {/* ══════════════════════════════════════════
          HERO — Full-bleed cinematic
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: 'min(100svh, 900px)' }}>
        {/* Background slideshow */}
        {HERO_IMAGES.map((img, i) => (
          <img
            key={img}
            src={img}
            alt="Alber School Campus"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}

        {/* Layered overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

        {/* Gold left accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gold via-gold/60 to-transparent" />

        {/* Slide dots — desktop right */}
        <div className="absolute bottom-32 right-8 z-10 hidden lg:flex flex-col gap-2">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`rounded-full transition-all ${i === slide ? 'h-8 w-2 bg-gold' : 'h-2 w-2 bg-white/30'}`}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 mx-auto flex min-h-[inherit] max-w-7xl flex-col justify-center gap-10 px-6 py-24 lg:flex-row lg:items-center lg:px-16">

          {/* LEFT: Headline */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px w-10 bg-gold" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Kutus · Kirinyaga County · Est. 2005</span>
            </div>

            <h1 className="mb-6 font-extrabold leading-[1.05] text-white" style={{ fontSize: 'clamp(2.6rem, 6vw, 5.5rem)' }}>
              {get('hero.tagline', 'Where Excellence')}
              <span className="block" style={{ WebkitTextStroke: '2px #E8B84B', color: 'transparent' }}>
                {get('hero.taglineGold', 'Meets Tomorrow')}
              </span>
            </h1>

            <div className="mb-8 flex items-center gap-4">
              <div className="h-px w-20 bg-gold/60" />
              <span className="text-xs uppercase tracking-widest text-white/50">Alber School</span>
              <div className="h-px w-20 bg-gold/60" />
            </div>

            <p className="mb-10 max-w-lg text-lg leading-relaxed text-white/80">
              {get('hero.subtitle', "Kenya's premier learning institution — where every learner discovers their genius in world-class facilities guided by expert educators.")}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/admissions">
                <Button variant="gold">Apply Now <ArrowRight className="h-4 w-4" /></Button>
              </Link>
              <Link to="/academics">
                <button className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20">
                  Explore Programs <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </motion.div>

          {/* RIGHT: Director card — redesigned */}
          <motion.div
            className="hidden lg:block lg:w-80 xl:w-96 shrink-0"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
          >
            {/* Photo */}
            <div className="relative mb-0 flex justify-center">
              {/* Outer glow rings */}
              <div className="absolute inset-0 flex items-end justify-center pb-6">
                <div className="h-52 w-52 animate-pulse rounded-full border-2 border-gold/15" style={{ animationDuration: '3s' }} />
              </div>
              <div className="absolute inset-0 flex items-end justify-center pb-6">
                <div className="h-44 w-44 animate-pulse rounded-full border border-gold/25" style={{ animationDuration: '2s' }} />
              </div>

              <div className="relative z-10">
                {/* Gold arch label above */}
                <div className="mb-2 flex items-center justify-center gap-2">
                  <div className="h-px w-8 bg-gold/60" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-gold/80">School Director</span>
                  <div className="h-px w-8 bg-gold/60" />
                </div>

                {/* Photo frame */}
                <div className="relative mx-auto w-fit">
                  {/* Corner brackets */}
                  <div className="absolute -top-2 -left-2 h-5 w-5 border-t-2 border-l-2 border-gold z-20" />
                  <div className="absolute -top-2 -right-2 h-5 w-5 border-t-2 border-r-2 border-gold z-20" />
                  <div className="absolute -bottom-2 -left-2 h-5 w-5 border-b-2 border-l-2 border-gold z-20" />
                  <div className="absolute -bottom-2 -right-2 h-5 w-5 border-b-2 border-r-2 border-gold z-20" />

                  <div className="relative h-44 w-44 overflow-hidden rounded-2xl border-2 border-gold/60 shadow-[0_0_40px_8px_rgba(232,184,75,0.3)]">
                    <img
                      src="https://picsum.photos/seed/director-alber/400/400"
                      alt={get('director.name', 'Dr. Alice Mwangi')}
                      className="h-full w-full object-cover object-top scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>

                  {/* Verified badge */}
                  <div className="absolute -bottom-3 -right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border-2 border-black/70 bg-gold text-black text-sm font-black shadow-lg">✓</div>
                </div>
              </div>
            </div>

            {/* Quote card */}
            <div className="relative mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black/65 backdrop-blur-xl">
              {/* Top gold line */}
              <div className="h-0.5 w-full bg-gradient-to-r from-gold/0 via-gold to-gold/0" />

              <div className="px-6 pt-5 pb-2 text-center">
                <p className="text-base font-extrabold uppercase tracking-wide text-white">{get('director.name', 'Dr. Alice Mwangi')}</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-gold">{get('director.title', 'School Director')}</p>
                <p className="mt-0.5 text-[10px] text-white/40">M.Ed., University of Nairobi</p>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div className="relative px-6 pt-4 pb-5">
                <span className="absolute -top-1 left-3 font-serif text-7xl leading-none text-gold/15 select-none pointer-events-none">"</span>
                <p className="relative z-10 text-sm italic leading-relaxed text-white/75">
                  {get('director.quote', 'Every child in Kirinyaga deserves an education that changes the trajectory of a family for generations. That is the promise we keep, every single day.')}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                  <span className="font-serif text-base italic text-gold/80">{get('director.name', 'Alice Mwangi')}</span>
                  <span className="text-[9px] uppercase tracking-widest text-white/30">M.Ed., UoN</span>
                </div>
              </div>

              <div className="h-0.5 w-full bg-gradient-to-r from-gold/0 via-gold/50 to-gold/0" />
            </div>

            <div className="mt-3 flex items-center justify-center gap-2">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[9px] uppercase tracking-[0.25em] text-white/30">A message from our Director</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <div className="relative z-10 border-t border-white/10 bg-black/60 backdrop-blur-md">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
            {[
              { end: 2000, suffix: '+', label: 'Students Enrolled' },
              { end: 120,  suffix: '+', label: 'Expert Educators' },
              { end: 2005, suffix: '',  label: 'Est.' },
              { end: 30,   suffix: '+', label: 'Co-Curricular Activities' },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col items-center py-5 px-4 text-center">
                <span className="text-2xl font-extrabold text-gold sm:text-3xl">
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                </span>
                <span className="mt-1 text-[10px] uppercase tracking-widest text-white/50">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile slide dots */}
        <div className="absolute bottom-20 left-0 right-0 z-10 flex items-center justify-center gap-2 lg:hidden">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`rounded-full transition-all ${i === slide ? 'w-6 h-2 bg-gold' : 'w-2 h-2 bg-white/40'}`}
            />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MISSION · VISION · MOTTO
      ══════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-b from-white via-white to-gray-50 dark:from-[#0a0a0a] dark:via-[#0a0a0a] dark:to-[#0d0d0d]">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionLabel>Our Foundation</SectionLabel>
            <h2 className="mt-2 text-4xl font-bold md:text-5xl">What We Stand For</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted">
              The beliefs and ambitions that guide every decision, every lesson, and every life shaped at Alber School.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              <div className="relative h-full overflow-hidden rounded-3xl border border-blue-400/20 bg-gradient-to-br from-blue-500/10 to-blue-500/3 p-8 dark:from-blue-500/15 dark:to-blue-500/5">
                <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-blue-400/10 blur-2xl -translate-y-8 translate-x-8" />
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-500 dark:text-blue-400 ring-1 ring-blue-400/30">
                  <Target className="h-7 w-7" />
                </div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-blue-500 dark:text-blue-400">Our Mission</p>
                <h3 className="mb-4 text-2xl font-bold">To Nurture Genius</h3>
                <p className="leading-relaxed text-muted">
                  To provide a world-class, holistic education that identifies and develops the unique genius in every child — equipping learners with the knowledge, skills, and values needed to thrive in a rapidly changing world.
                </p>
              </div>
            </motion.div>

            {/* Motto — center, elevated */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="relative h-full overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-[#E8B84B]/15 to-[#E8B84B]/3 p-8 dark:from-[#E8B84B]/20 dark:to-[#E8B84B]/5 shadow-[0_8px_40px_-8px_rgba(232,184,75,0.25)]">
                <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-gold/10 blur-3xl -translate-y-10 translate-x-10" />
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/20 text-gold ring-1 ring-gold/40">
                  <Star className="h-7 w-7" />
                </div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gold">Our Motto</p>
                <h3 className="mb-4 text-2xl font-bold">Excellence in All</h3>
                <div className="mb-5 h-px w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                <p className="font-serif text-3xl italic font-semibold text-gold leading-snug">
                  "Unlocking Every Child's Genius"
                </p>
                <p className="mt-4 leading-relaxed text-muted">
                  Not just academic excellence — but excellence in character, creativity, sport, and service. Every Alber learner is known, valued, and challenged to be their very best.
                </p>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              <div className="relative h-full overflow-hidden rounded-3xl border border-green-400/20 bg-gradient-to-br from-green-500/10 to-green-500/3 p-8 dark:from-green-500/15 dark:to-green-500/5">
                <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-green-400/10 blur-2xl -translate-y-8 translate-x-8" />
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/15 text-green-500 dark:text-green-400 ring-1 ring-green-400/30">
                  <Globe className="h-7 w-7" />
                </div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-green-500 dark:text-green-400">Our Vision</p>
                <h3 className="mb-4 text-2xl font-bold">Leaders for Tomorrow</h3>
                <p className="leading-relaxed text-muted">
                  To be the leading centre of learning excellence in East Africa — producing confident, compassionate, globally competitive graduates who transform their communities and lead with integrity.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CORE VALUES
      ══════════════════════════════════════════ */}
      <section className="py-24 bg-tint/30 dark:bg-dark-card/30">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionLabel>Core Values</SectionLabel>
            <h2 className="mt-2 text-4xl font-bold md:text-5xl">The Alber Character</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted">
              Six pillars that shape the Alber graduate — a whole person ready to lead, serve, and flourish.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CORE_VALUES.map((v, i) => (
              <motion.div
                key={v.label}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
              >
                <div className={`group relative h-full overflow-hidden rounded-2xl border bg-gradient-to-br p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${v.color} ${v.ring} ring-1`}>
                  <div className="mb-4 flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${v.text} bg-current/10 ring-1 ring-current/20`}>
                      <v.icon className="h-5 w-5" />
                    </div>
                    <h3 className={`text-lg font-bold ${v.text}`}>{v.label}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHY ALBER — programs by level
      ══════════════════════════════════════════ */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionLabel>Why Choose Us</SectionLabel>
            <h2 className="mt-2 text-4xl font-bold md:text-5xl">The Alber Difference</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted">
              Outstanding education at every stage — from first steps to university.
            </p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_ALBER.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
              >
                <GlassCard className="flex flex-col gap-4 p-6 h-full hover:ring-2 hover:ring-gold/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.color}`}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full border border-current/20 bg-current/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-muted">
                      {item.level}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.desc}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/why-choose-us">
              <Button variant="outline">See All Reasons <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          DIRECTOR'S MESSAGE — full section
      ══════════════════════════════════════════ */}
      <section className="py-24 bg-tint/30 dark:bg-dark-card/30 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionLabel>Leadership</SectionLabel>
            <h2 className="mt-2 text-4xl font-bold md:text-5xl">A Message From Our Director</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative overflow-hidden rounded-3xl border border-gold/20 bg-white dark:bg-[#111] shadow-2xl lg:flex">
              {/* Left panel — photo + identity */}
              <div className="relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-primary/90 to-primary/70 dark:from-[#0d1b0d] dark:to-[#0a120a] px-10 py-14 lg:w-80 shrink-0">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(232,184,75,0.3) 20px, rgba(232,184,75,0.3) 21px)' }} />

                {/* Outer glow ring */}
                <div className="relative z-10 mb-6">
                  <div className="absolute -inset-4 rounded-full border-2 border-gold/20 animate-pulse" style={{ animationDuration: '3s' }} />
                  <div className="absolute -inset-8 rounded-full border border-gold/10 animate-pulse" style={{ animationDuration: '4s' }} />

                  {/* Photo */}
                  <div className="relative h-48 w-48 overflow-hidden rounded-2xl border-4 border-gold/50 shadow-[0_0_50px_10px_rgba(232,184,75,0.3)]">
                    <img
                      src="https://picsum.photos/seed/director-alber/400/500"
                      alt={get('director.name', 'Dr. Alice Mwangi')}
                      className="h-full w-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>

                  {/* Verified badge */}
                  <div className="absolute -bottom-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/20 bg-gold text-black text-sm font-black shadow-xl">✓</div>
                </div>

                <div className="relative z-10 text-center">
                  <p className="text-xl font-extrabold uppercase tracking-wide text-white">{get('director.name', 'Dr. Alice Mwangi')}</p>
                  <div className="my-2 flex items-center justify-center gap-2">
                    <div className="h-px w-6 bg-gold" />
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-gold">{get('director.title', 'School Director')}</p>
                    <div className="h-px w-6 bg-gold" />
                  </div>
                  <p className="text-xs text-white/50">M.Ed., University of Nairobi</p>

                  <div className="mt-6 flex flex-col gap-2">
                    <Link to="/contact">
                      <button className="w-full rounded-xl bg-gold px-5 py-2.5 text-xs font-bold text-black transition hover:bg-yellow-400">
                        Book a Campus Tour
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right panel — full quote */}
              <div className="relative flex flex-1 flex-col justify-center p-10 lg:p-14">
                <Quote className="mb-6 h-12 w-12 text-gold opacity-40" />
                <p className="text-lg leading-relaxed text-muted whitespace-pre-line">
                  {get('director.quote', "When I founded Alber School, I had one conviction: that every child in Kirinyaga County deserves access to the kind of education that changes the trajectory of a family for generations. Not just academic excellence — but character, confidence, and the courage to dream beyond borders.\n\nToday, as I walk through our corridors and see 2,000 young minds at work — in our labs, on our pitches, on our stages — I know that conviction was right. Alber School is not just a school. It is a promise we keep, every single day, to every single family that trusts us with their most precious gift.\n\nWe warmly welcome you to come and see it for yourself.")}
                </p>
                <div className="mt-8 border-t border-gray-100 dark:border-white/10 pt-6 flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="font-serif text-xl italic text-gold">{get('director.name', 'Alice Mwangi')}</p>
                    <p className="text-sm text-muted">{get('director.title', 'School Director')}, Alber School</p>
                  </div>
                  <Link to="/admissions">
                    <Button variant="outline">Apply for 2026 <ArrowRight className="h-4 w-4" /></Button>
                  </Link>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute bottom-0 right-0 h-32 w-32 rounded-tl-3xl bg-gold/5" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PROGRAMS TEASER
      ══════════════════════════════════════════ */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionLabel>Our Programs</SectionLabel>
            <h2 className="mt-2 text-4xl font-bold md:text-5xl">A School for Every Stage</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted">
              From first steps to university readiness — a single, nurturing institution your child can grow with for 16 years.
            </p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {programsLoading ? (
              [1,2,3,4].map(n => <div key={n} className="h-64 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)
            ) : displayPrograms.length === 0 ? (
              <p className="col-span-full text-center text-muted py-8">No programs configured yet.</p>
            ) : (
              displayPrograms.map((prog, i) => {
                const icon = PROGRAM_ICONS[prog.slug] ?? '📖'
                const imgSrc = prog.imageUrl || `https://picsum.photos/seed/${prog.slug}/800/600`
                return (
                  <motion.div
                    key={prog.id}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  >
                    <Link to="/academics" className="group block h-full">
                      <GlassCard className="overflow-hidden p-0 h-full transition-all group-hover:ring-2 group-hover:ring-gold/60">
                        <div className="relative h-44 overflow-hidden">
                          <img src={imgSrc} alt={prog.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <span className="absolute bottom-3 left-3 text-3xl">{icon}</span>
                          <span className="absolute top-3 right-3 rounded-full bg-gold/90 px-2 py-0.5 text-xs font-bold text-black">{prog.ages}</span>
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-foreground">{prog.name}</h3>
                          <p className="mt-1 text-sm leading-relaxed text-muted">{prog.description}</p>
                          <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary dark:text-gold group-hover:gap-2 transition-all">
                            Learn more <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </GlassCard>
                    </Link>
                  </motion.div>
                )
              })
            )}
          </div>
          <div className="mt-10 text-center">
            <Link to="/academics">
              <Button variant="outline">View Full Curriculum <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-tint/30 dark:bg-dark-card/30">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionLabel>Testimonials</SectionLabel>
            <h2 className="mt-2 mb-12 text-4xl font-bold">What Our Community Says</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <GlassCard className="relative px-8 py-12">
              <Quote className="mx-auto mb-6 h-10 w-10 text-gold opacity-60" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonial}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="text-xl font-medium leading-relaxed text-foreground min-h-[80px]">
                    "{TESTIMONIALS[testimonial].quote}"
                  </p>
                  <div className="mt-8 flex items-center justify-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-xs font-black text-black">
                      {TESTIMONIALS[testimonial].initials}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-primary dark:text-gold">{TESTIMONIALS[testimonial].name}</p>
                      <p className="text-sm text-muted">{TESTIMONIALS[testimonial].role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="mt-6 flex justify-center gap-2">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonial(i)}
                    className={`h-2 rounded-full transition-all ${i === testimonial ? 'w-8 bg-gold' : 'w-2 bg-neutral-300 dark:bg-neutral-600'}`}
                  />
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          GALLERY
      ══════════════════════════════════════════ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            className="mb-8 flex items-end justify-between"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <SectionLabel>Campus Life</SectionLabel>
              <h2 className="mt-2 text-4xl font-bold">Life at Alber</h2>
            </div>
            <Link to="/gallery" className="text-sm font-semibold text-primary dark:text-gold hover:underline flex items-center gap-1">
              See all photos <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
          <div className="grid grid-cols-3 gap-3 lg:grid-cols-3">
            {galleryLoading ? (
              [1,2,3,4,5,6].map(n => <div key={n} className="aspect-square animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)
            ) : galleryImages.length === 0 ? (
              <p className="col-span-full text-center text-muted py-8">No gallery images yet.</p>
            ) : (
              galleryImages.map((img, i) => (
                <motion.div
                  key={img.id}
                  className="aspect-square overflow-hidden rounded-2xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                >
                  <img
                    src={img.url}
                    alt={img.caption ?? `Campus life ${i + 1}`}
                    className="h-full w-full object-cover transition duration-500 hover:scale-110"
                  />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          UPCOMING EVENTS
      ══════════════════════════════════════════ */}
      <section className="bg-tint/30 py-20 dark:bg-dark-card/30">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            className="mb-12 flex items-end justify-between"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <SectionLabel>Calendar</SectionLabel>
              <h2 className="mt-2 text-4xl font-bold">Upcoming Events</h2>
            </div>
            <Link to="/contact" className="text-sm font-semibold text-primary dark:text-gold hover:underline flex items-center gap-1">
              View calendar <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
          <div className="relative border-l-2 border-gold pl-8">
            {eventsLoading ? (
              [1,2,3].map(n => <div key={n} className="mb-6 h-20 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)
            ) : upcomingEvents.length === 0 ? (
              <p className="text-center text-muted py-8">No upcoming events.</p>
            ) : (
              upcomingEvents.map((e, i) => (
                <motion.div
                  key={e.id}
                  className="relative mb-8"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <div className="absolute -left-[41px] h-4 w-4 rounded-full bg-gold ring-4 ring-gold/20" />
                  <GlassCard className="p-6">
                    <span className="text-xs font-semibold text-gold">{e.startDate.slice(0, 10)}</span>
                    <h3 className="mt-1 text-xl font-bold">{e.title}</h3>
                    <p className="text-sm text-muted">{e.location ?? ''} {e.location && e.description ? '·' : ''} {e.description ?? ''}</p>
                  </GlassCard>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-primary py-20 dark:bg-[#0d1b0d]">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(232,184,75,0.5) 30px, rgba(232,184,75,0.5) 31px)' }} />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-3 inline-block rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-gold">
              Applications Open · 2026–2027
            </p>
            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">Ready to Join Alber School?</h2>
            <p className="mb-8 text-white/70">Applications are open for the 2026/2027 academic year. Limited spaces — secure your child's place today.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/admissions">
                <Button variant="gold">Apply Now <ArrowRight className="h-4 w-4" /></Button>
              </Link>
              <Link to="/contact">
                <button className="flex items-center gap-2 rounded-xl border-2 border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                  Contact Us
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
