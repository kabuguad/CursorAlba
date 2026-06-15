import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Quote, ShieldCheck, Trophy, Music, BookOpen, Globe, Users, Baby, FlaskConical, GraduationCap, Sprout, Loader2 } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { GlassCard } from '../components/ui/GlassCard'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { AnimatedCounter } from '../components/ui/AnimatedCounter'
import { useQuery } from '@tanstack/react-query'
import { unwrap } from '../services/mockApi'
import { contentService } from '../services/contentService'
import type { PublicEvent, PublicProgramLevel } from '../services/db'
import { useCmsBlocks } from '../hooks/useCmsData'

const HERO_IMAGES = [
  'https://picsum.photos/seed/alber-campus/1200/800',
  'https://picsum.photos/seed/alber-class/1200/800',
  'https://picsum.photos/seed/alber-sports/1200/800',
  'https://picsum.photos/seed/alber-arts/1200/800',
]

const TESTIMONIALS = [
  { name: 'Grace Njeri', role: 'Parent · Grade 5', quote: 'Alber School has transformed my daughter completely. The teaching quality is unmatched anywhere in Kirinyaga County.' },
  { name: 'Brian Mutua', role: 'Student · Grade 9', quote: 'The sports facilities here are world-class. I have grown as both an athlete and a leader since joining Alber.' },
  { name: 'Dr. Samuel Kariuki', role: 'Parent · PP2 & Grade 7', quote: 'Both my children attend Alber. From Playgroup all the way to Senior School — the continuity and quality are simply unmatched in Kirinyaga.' },
  { name: 'Amina Ochieng', role: 'Student · Music Academy', quote: 'I performed my first piano recital here in Grade 5. The music teachers are genuinely world-class professionals.' },
]

const GALLERY = [
  'https://picsum.photos/seed/alber-g1/400/400',
  'https://picsum.photos/seed/alber-g2/400/400',
  'https://picsum.photos/seed/alber-g3/400/400',
  'https://picsum.photos/seed/alber-g4/400/400',
  'https://picsum.photos/seed/alber-g5/400/400',
  'https://picsum.photos/seed/alber-g6/400/400',
  'https://picsum.photos/seed/alber-g7/400/400',
  'https://picsum.photos/seed/alber-g8/400/400',
  'https://picsum.photos/seed/alber-g9/400/400',
]

const WHY_ALBER = [
  {
    icon: Baby,
    level: 'ECDE · PP1 & PP2',
    title: 'Play-Based Early Years',
    desc: 'Our trained ECD specialists guide children aged 2–5 through structured play, sensory discovery, and social development — laying a confident foundation before formal schooling begins.',
    color: 'bg-pink-500/10 text-pink-500 dark:bg-pink-400/10 dark:text-pink-400',
  },
  {
    icon: BookOpen,
    level: 'Primary · Grades 1–6',
    title: 'CBC Literacy & Numeracy Excellence',
    desc: 'Learner-centred, project-based CBC teaching builds strong literacy, numeracy, and critical thinking. Continuous assessment replaces high-stakes exams — every child progresses at their own pace.',
    color: 'bg-blue-500/10 text-blue-500 dark:bg-blue-400/10 dark:text-blue-400',
  },
  {
    icon: FlaskConical,
    level: 'Junior Secondary · Grades 7–9',
    title: 'STEM, Careers & Community',
    desc: "Kenya's CBC Junior Secondary curriculum with dedicated STEM labs, career pathway exploration, Community Service Learning (CSL), and Career & Technical Skills — preparing learners for a modern economy.",
    color: 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-400/10 dark:text-emerald-400',
  },
  {
    icon: GraduationCap,
    level: 'Senior School · Grades 10–12',
    title: 'KCSE & IGCSE University Pathways',
    desc: 'Rigorous KCSE preparation alongside optional Cambridge IGCSE & A-Level tracks. Dedicated university counselling from Grade 10 — graduates placed in Kenyan and international universities.',
    color: 'bg-purple-500/10 text-purple-500 dark:bg-purple-400/10 dark:text-purple-400',
  },
  {
    icon: Trophy,
    level: 'All Levels',
    title: 'Holistic Co-Curricular Life',
    desc: 'Every learner — from PP1 to Grade 12 — participates in sports, music, drama, or dance. Our professional coaches and ABRSM-registered music teachers develop talent alongside academics.',
    color: 'bg-gold/10 text-gold dark:bg-gold/10 dark:text-gold',
  },
  {
    icon: ShieldCheck,
    level: 'All Levels',
    title: 'Safe, Certified & Fully Staffed',
    desc: 'TSC-registered teachers, CCTV-monitored classrooms, a fully fenced campus, and a maximum of 30 learners per class — a structured, safe environment where every child is known by name.',
    color: 'bg-primary/10 text-primary dark:bg-primary/10 dark:text-gold',
  },
]

const PROGRAM_ICONS: Record<string, string> = {
  daycare: '🌱',
  primary: '📚',
  junior: '🔬',
  senior: '🎓',
}

export function Home() {
  const [slide, setSlide] = useState(0)
  const [testimonial, setTestimonial] = useState(0)
  const { data: homeBlocks = [] } = useCmsBlocks('pg-home')
  const get = (key: string, fallback: string) => homeBlocks.find((b) => b.key === key)?.value || fallback

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
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_IMAGES.length), 5000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setTestimonial((s) => (s + 1) % TESTIMONIALS.length), 6000)
    return () => clearInterval(t)
  }, [])

  const upcomingEvents = events.filter((e) => !e.isPast).slice(0, 6)
  const displayPrograms = programLevels.length > 0 ? programLevels : []

  return (
    <>
      {/* ── Hero ── */}
      <section className="flex flex-col">

        {/* ════════════════════════════════════════
            MOBILE / TABLET  (< lg)
            Image in a proper aspect-ratio box so
            the full landscape photo is visible,
            then content stacked below.
        ════════════════════════════════════════ */}
        <div className="lg:hidden flex flex-col">

          {/* Image carousel — 3:2 ratio matches the 1200×800 source images */}
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/2' }}>

            {/* Left gold accent */}
            <div className="absolute left-0 top-0 bottom-0 z-10 w-1 bg-gradient-to-b from-gold via-gold/60 to-transparent" />

            {HERO_IMAGES.map((img, i) => (
              <img
                key={img}
                src={img}
                alt="Alber School Campus"
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />

            {/* School name badge — top left */}
            <div className="absolute top-4 left-5 z-10 flex items-center gap-2">
              <div className="h-px w-6 bg-gold" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold drop-shadow">
                Kutus · Kirinyaga County
              </span>
            </div>

            {/* ── Director card — centered on small, right-aligned + larger on md ── */}
            <div className="absolute inset-0 z-10 flex items-center justify-end pr-6 md:pr-10">
              <div className="flex flex-col items-center gap-3 px-4 text-center">

                {/* Circular photo */}
                <div className="relative">
                  <div className="absolute -inset-2 animate-pulse rounded-full border border-gold/30" />
                  <div className="absolute -inset-0.5 animate-ping rounded-full border border-gold/20" style={{ animationDuration: '2.8s' }} />
                  <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-gold shadow-[0_0_20px_4px_rgba(232,184,75,0.4)] md:h-32 md:w-32 md:border-[3px] md:shadow-[0_0_32px_6px_rgba(232,184,75,0.4)]">
                    <img
                      src="https://picsum.photos/seed/director-alber/400/400"
                      alt="Mr. Albert Njeru"
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <div className="absolute bottom-0.5 right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-black/80 bg-gold text-[9px] font-bold text-black md:h-7 md:w-7 md:text-[11px]">✓</div>
                </div>

                {/* Glass card: name + quote */}
                <div className="relative max-w-[220px] overflow-hidden rounded-2xl border border-white/20 bg-black/50 px-4 py-3 backdrop-blur-md md:max-w-[320px] md:px-6 md:py-5">
                  {/* Corner accents */}
                  <div className="absolute -top-1 -left-1 h-4 w-4 border-t border-l border-gold md:h-5 md:w-5" />
                  <div className="absolute -top-1 -right-1 h-4 w-4 border-t border-r border-gold md:h-5 md:w-5" />
                  <div className="absolute -bottom-1 -left-1 h-4 w-4 border-b border-l border-gold md:h-5 md:w-5" />
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 border-b border-r border-gold md:h-5 md:w-5" />

                  <p className="text-sm font-extrabold uppercase tracking-wide text-white md:text-lg">{get('director.name', 'Mr. Albert Njeru')}</p>
                  <div className="my-1.5 flex items-center justify-center gap-2">
                    <div className="h-px w-4 bg-gold md:w-6" />
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-gold md:text-[11px]">{get('director.title', 'Founder & Director')}</p>
                    <div className="h-px w-4 bg-gold md:w-6" />
                  </div>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                  <p className="mt-2 text-[10px] italic leading-relaxed text-white/70 md:mt-3 md:text-sm">
                    "{get('director.quote', 'Every child in Kirinyaga deserves an education that changes the trajectory of a family.')}"
                  </p>
                </div>

              </div>
            </div>

            {/* Horizontal slide dots — bottom centre */}
            <div className="absolute bottom-4 left-0 right-0 z-10 flex items-center justify-center gap-2">
              {HERO_IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === slide ? 'w-6 h-2 bg-gold' : 'w-2 h-2 bg-white/50'
                  }`}
                />
              ))}
            </div>

            {/* Slide counter — bottom right */}
            <div className="absolute bottom-3.5 right-4 z-10 text-[10px] font-bold tabular-nums text-white/50">
              {slide + 1} / {HERO_IMAGES.length}
            </div>
          </div>

          {/* Content block */}
          <div className="bg-[#0a0a0a] px-6 pt-8 pb-6 sm:px-10 sm:pt-10">

            {/* Est. badge */}
            <div className="mb-5 flex items-center gap-3">
              <div className="h-px w-8 bg-gold" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">Est. 2005</span>
            </div>

            {/* Headline */}
            <h1 className="mb-4 font-extrabold leading-[1.05] text-white" style={{ fontSize: 'clamp(2.2rem, 8vw, 3.4rem)' }}>
              {get('hero.tagline', 'Where Excellence')}
              <span className="block" style={{ WebkitTextStroke: '2px #E8B84B', color: 'transparent' }}>
                {get('hero.taglineGold', 'Meets Tomorrow')}
              </span>
            </h1>

            {/* Divider */}
            <div className="mb-5 flex items-center gap-3">
              <div className="h-px w-14 bg-gold/60" />
              <span className="text-[10px] uppercase tracking-widest text-white/40">Alber School</span>
              <div className="h-px w-14 bg-gold/60" />
            </div>

            {/* Tagline */}
            <p className="mb-7 text-base leading-relaxed text-white/70">
              {get('hero.subtitle', "Premium private education in the heart of Kirinyaga. 2,000+ learners, 120+ expert educators — academics, sports, music, and performing arts under one roof.")}
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/admissions" className="flex-1 sm:flex-none">
                <Button variant="gold" className="w-full sm:w-auto">
                  Apply Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/academics" className="flex-1 sm:flex-none">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20">
                  Explore Programs <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>

          {/* Stats bar — mobile */}
          <div className="border-t border-white/10 bg-black/90">
            <div className="grid grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
              <div className="flex flex-col items-center py-4 px-2 text-center">
                <span className="text-2xl font-extrabold text-gold">{get('stats.students', '2,000+')}</span>
                <span className="mt-0.5 text-[10px] uppercase tracking-widest text-white/50 leading-tight">Students Enrolled</span>
              </div>
              <div className="flex flex-col items-center py-4 px-2 text-center">
                <span className="text-2xl font-extrabold text-gold">{get('stats.teachers', '120+')}</span>
                <span className="mt-0.5 text-[10px] uppercase tracking-widest text-white/50 leading-tight">Expert Educators</span>
              </div>
              <div className="flex flex-col items-center py-4 px-2 text-center">
                <span className="text-2xl font-extrabold text-gold"><AnimatedCounter end={8} suffix="" /></span>
                <span className="mt-0.5 text-[10px] uppercase tracking-widest text-white/50 leading-tight">School Buses</span>
              </div>
              <div className="flex flex-col items-center py-4 px-2 text-center">
                <span className="text-2xl font-extrabold text-gold"><AnimatedCounter end={6} suffix="" /></span>
                <span className="mt-0.5 text-[10px] uppercase tracking-widest text-white/50 leading-tight">Sports Disciplines</span>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════
            DESKTOP  (lg+)
            Original full-bleed magazine layout
        ════════════════════════════════════════ */}
        <div className="hidden lg:flex lg:min-h-screen lg:flex-col lg:overflow-hidden lg:relative">

          {/* Background slideshow */}
          {HERO_IMAGES.map((img, i) => (
            <img
              key={img}
              src={img}
              alt="Alber School Campus"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}

          {/* Rich gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

          {/* Gold accent bar — left edge */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gold via-gold/60 to-transparent" />

          {/* Slide dots — bottom right, vertical */}
          <div className="absolute bottom-28 right-8 z-10 flex flex-col gap-2">
            {HERO_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`rounded-full transition-all ${i === slide ? 'h-8 w-2 bg-gold' : 'h-2 w-2 bg-white/40'}`}
              />
            ))}
          </div>

          {/* Main content — two-column */}
          <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center gap-8 px-8 py-24 lg:px-16">

            {/* Left: headline + CTAs */}
            <div className="flex-1">
              <div className="mb-8 flex items-center gap-3">
                <div className="h-px w-10 bg-gold" />
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
                  Kutus · Kirinyaga County · Est. 2005
                </span>
              </div>

              <h1 className="mb-6 font-extrabold leading-[1.05] text-white" style={{ fontSize: 'clamp(2.8rem, 6vw, 5.5rem)' }}>
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
                {get('hero.subtitle', "Premium private education in the heart of Kirinyaga. 2,000+ learners, 120+ expert educators — academics, sports, music, and performing arts under one roof.")}
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
            </div>

            {/* Right: Director's fancy card */}
            <div className="hidden lg:flex lg:w-80 xl:w-96 shrink-0 flex-col">
              <div className="relative pt-[108px]">
                <div className="absolute top-0 left-1/2 z-20 -translate-x-1/2">
                  <div className="absolute -inset-3 animate-pulse rounded-full border border-gold/20" />
                  <div className="absolute -inset-1 animate-ping rounded-full border border-gold/30" style={{ animationDuration: '2.5s' }} />
                  <div className="relative h-36 w-36 overflow-hidden rounded-full border-[3px] border-gold shadow-[0_0_32px_6px_rgba(232,184,75,0.35)]">
                    <img
                      src="https://picsum.photos/seed/director-alber/400/400"
                      alt="Mr. Albert Njeru"
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <div className="absolute bottom-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-black/80 bg-gold text-black text-[10px] font-bold">✓</div>
                </div>

                <div className="relative">
                  <div className="absolute -top-2 -left-2 h-6 w-6 border-t-2 border-l-2 border-gold" />
                  <div className="absolute -top-2 -right-2 h-6 w-6 border-t-2 border-r-2 border-gold" />
                  <div className="absolute -bottom-2 -left-2 h-6 w-6 border-b-2 border-l-2 border-gold" />
                  <div className="absolute -bottom-2 -right-2 h-6 w-6 border-b-2 border-r-2 border-gold" />

                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl">
                    <div className="flex flex-col items-center pt-12 pb-5 px-6 bg-gradient-to-b from-white/5 to-transparent">
                      <p className="text-base font-extrabold uppercase tracking-wide text-white">{get('director.name', 'Mr. Albert Njeru')}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="h-px w-6 bg-gold" />
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-gold">{get('director.title', 'Founder & Director')}</p>
                        <div className="h-px w-6 bg-gold" />
                      </div>
                    </div>

                    <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

                    <div className="relative px-6 pt-5 pb-6">
                      <span className="absolute top-1 left-4 font-serif text-7xl leading-none text-gold/20 select-none">"</span>
                      <p className="relative z-10 text-sm italic leading-relaxed text-white/75">
                        {get('director.quote', 'Every child in Kirinyaga deserves an education that changes the trajectory of a family for generations. That is the promise we keep, every single day.')}
                      </p>
                      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                        <span className="font-serif text-lg italic text-gold/80">{get('director.name', 'Albert Njeru').split(' ').slice(-1)[0]}</span>
                        <span className="text-[10px] uppercase tracking-widest text-white/30">M.Ed., UoN</span>
                      </div>
                    </div>

                    <div className="h-1 w-full bg-gradient-to-r from-gold/0 via-gold to-gold/0" />
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-center gap-2">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/30">A message from our Director</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
            </div>
          </div>

          {/* Stats bar — desktop */}
          <div className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-md">
            <div className="mx-auto grid max-w-7xl grid-cols-4 divide-x divide-white/10">
              <div className="flex flex-col items-center py-5 px-4 text-center">
                <span className="text-3xl font-extrabold text-gold">{get('stats.students', '2,000+')}</span>
                <span className="mt-1 text-xs uppercase tracking-widest text-white/60">Students Enrolled</span>
              </div>
              <div className="flex flex-col items-center py-5 px-4 text-center">
                <span className="text-3xl font-extrabold text-gold">{get('stats.teachers', '120+')}</span>
                <span className="mt-1 text-xs uppercase tracking-widest text-white/60">Expert Educators</span>
              </div>
              <div className="flex flex-col items-center py-5 px-4 text-center">
                <span className="text-3xl font-extrabold text-gold"><AnimatedCounter end={8} suffix="" /></span>
                <span className="mt-1 text-xs uppercase tracking-widest text-white/60">School Buses</span>
              </div>
              <div className="flex flex-col items-center py-5 px-4 text-center">
                <span className="text-3xl font-extrabold text-gold"><AnimatedCounter end={6} suffix="" /></span>
                <span className="mt-1 text-xs uppercase tracking-widest text-white/60">Sports Disciplines</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ── Why Alber ── */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <ScrollReveal className="mb-16 text-center">
            <span className="mb-3 inline-block rounded-full border border-gold/50 bg-gold/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary dark:text-gold">
              Why Choose Us
            </span>
            <h2 className="text-4xl font-bold md:text-5xl">The Alber Difference</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted">
              What outstanding education looks like at every stage — from first steps to university.
            </p>
          </ScrollReveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_ALBER.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.07}>
                <GlassCard className="flex flex-col gap-4 p-6 h-full">
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
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Programs Teaser ── */}
      <section className="bg-tint/30 py-24 dark:bg-dark-card/30">
        <div className="mx-auto max-w-7xl px-4">
          <ScrollReveal className="mb-16 text-center">
            <span className="mb-3 inline-block rounded-full border border-gold/50 bg-gold/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary dark:text-gold">
              Our Programs
            </span>
            <h2 className="text-4xl font-bold md:text-5xl">A School for Every Stage</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted">
              From first steps to university readiness — a single, nurturing institution your child can grow with for 16 years.
            </p>
          </ScrollReveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {programsLoading ? (
              <p className="col-span-full text-center text-muted py-8">Loading programs…</p>
            ) : displayPrograms.length === 0 ? (
              <p className="col-span-full text-center text-muted py-8">No programs configured yet.</p>
            ) : (
              displayPrograms.map((prog, i) => {
                const icon = PROGRAM_ICONS[prog.slug] ?? '📖'
                const imgSrc = prog.imageUrl || `https://picsum.photos/seed/${prog.slug}/800/600`
                return (
                  <ScrollReveal key={prog.id} delay={i * 0.08}>
                    <Link to="/academics" className="group block h-full">
                      <GlassCard className="overflow-hidden p-0 h-full transition-all group-hover:ring-2 group-hover:ring-gold/60">
                        <div className="relative h-44 overflow-hidden">
                          <img
                            src={imgSrc}
                            alt={prog.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <span className="absolute bottom-3 left-3 text-3xl">{icon}</span>
                          <span className="absolute top-3 right-3 rounded-full bg-gold/90 px-2 py-0.5 text-xs font-bold text-black">
                            {prog.ages}
                          </span>
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
                  </ScrollReveal>
                )
              })
            )}
          </div>
          <ScrollReveal className="mt-10 text-center">
            <Link to="/academics">
              <Button variant="outline">View Full Curriculum <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Director's Welcome ── */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <ScrollReveal className="mb-16 text-center">
            <span className="mb-3 inline-block rounded-full border border-gold/50 bg-gold/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary dark:text-gold">
              A Message From Our Director
            </span>
          </ScrollReveal>
          <ScrollReveal>
            <GlassCard className="overflow-hidden lg:flex">
              <div className="flex flex-col items-center justify-center bg-primary/5 p-10 lg:w-80 lg:shrink-0 dark:bg-gold/5">
                <div className="h-36 w-36 overflow-hidden rounded-full border-4 border-gold/40">
                  <img
                    src="https://picsum.photos/seed/director-alber/400/400"
                    alt="School Director"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mt-5 text-xl font-bold text-primary dark:text-gold">Mr. Albert Njeru</h3>
                <p className="mt-1 text-sm text-muted">Founder & School Director</p>
                <p className="mt-1 text-xs text-muted">M.Ed., University of Nairobi</p>
                <div className="mt-4 h-1 w-12 rounded-full bg-gold/60" />
              </div>
              <div className="flex flex-1 flex-col justify-center p-10">
                <Quote className="mb-6 h-10 w-10 text-gold opacity-50" />
                <p className="text-lg leading-relaxed text-muted">
                  When I founded Alber School, I had one conviction: that every child in Kirinyaga County deserves access to the kind of education that changes the trajectory of a family for generations. Not just academic excellence — but character, confidence, and the courage to dream beyond borders.
                </p>
                <p className="mt-5 text-lg leading-relaxed text-muted">
                  Today, as I walk through our corridors and see 2,000 young minds at work — in our labs, on our pitches, on our stages — I know that conviction was right. Alber School is not just a school. It is a promise we keep, every single day, to every single family that trusts us with their most precious gift.
                </p>
                <p className="mt-5 text-lg leading-relaxed text-muted">
                  We warmly welcome you to come and see it for yourself.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link to="/contact">
                    <Button variant="primary">Book a Campus Tour</Button>
                  </Link>
                  <Link to="/admissions">
                    <Button variant="outline">Apply for 2026 <ArrowRight className="h-4 w-4" /></Button>
                  </Link>
                </div>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-tint/30 py-20 dark:bg-dark-card/30">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <ScrollReveal>
            <h2 className="mb-12 text-4xl font-bold">What Our Community Says</h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <GlassCard className="relative px-8 py-12">
              <Quote className="mx-auto mb-6 h-10 w-10 text-gold opacity-60" />
              <p className="text-xl font-medium leading-relaxed text-foreground min-h-[80px] transition-all">
                "{TESTIMONIALS[testimonial].quote}"
              </p>
              <div className="mt-8">
                <p className="font-bold text-primary dark:text-gold">{TESTIMONIALS[testimonial].name}</p>
                <p className="text-sm text-muted">{TESTIMONIALS[testimonial].role}</p>
              </div>
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
          </ScrollReveal>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <ScrollReveal className="mb-8 flex items-end justify-between">
            <h2 className="text-4xl font-bold">Life at Alber</h2>
            <Link to="/gallery" className="text-sm font-semibold text-primary dark:text-gold hover:underline flex items-center gap-1">
              See all photos <ArrowRight className="h-4 w-4" />
            </Link>
          </ScrollReveal>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-3">
            {galleryLoading ? (
              <p className="col-span-full text-center text-muted py-8">Loading gallery…</p>
            ) : galleryImages.length === 0 ? (
              <p className="col-span-full text-center text-muted py-8">No gallery images yet.</p>
            ) : (
              galleryImages.map((img, i) => (
                <ScrollReveal key={img.id} delay={i * 0.04}>
                  <div className="aspect-square overflow-hidden rounded-2xl">
                    <img
                      src={img.url}
                      alt={img.caption ?? `Campus life ${i + 1}`}
                      className="h-full w-full object-cover transition duration-500 hover:scale-110"
                    />
                  </div>
                </ScrollReveal>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── Upcoming Events ── */}
      <section className="bg-tint/30 py-20 dark:bg-dark-card/30">
        <div className="mx-auto max-w-7xl px-4">
          <ScrollReveal className="mb-12 flex items-end justify-between">
            <h2 className="text-4xl font-bold">Upcoming Events</h2>
            <Link to="/contact" className="text-sm font-semibold text-primary dark:text-gold hover:underline flex items-center gap-1">
              View calendar <ArrowRight className="h-4 w-4" />
            </Link>
          </ScrollReveal>
          <div className="relative border-l-2 border-gold pl-8">
            {eventsLoading ? (
              <p className="text-center text-muted py-8">Loading events…</p>
            ) : upcomingEvents.length === 0 ? (
              <p className="text-center text-muted py-8">No upcoming events.</p>
            ) : (
              upcomingEvents.map((e, i) => (
                <ScrollReveal key={e.id} delay={i * 0.08}>
                  <div className="relative mb-10">
                    <div className="absolute -left-[41px] h-4 w-4 rounded-full bg-gold ring-4 ring-gold/20" />
                    <GlassCard className="p-6">
                      <span className="text-xs font-semibold text-gold">{e.startDate.slice(0, 10)}</span>
                      <h3 className="mt-1 text-xl font-bold">{e.title}</h3>
                      <p className="text-sm text-muted">{e.location ?? ''} {e.location && e.description ? '·' : ''} {e.description ?? ''}</p>
                    </GlassCard>
                  </div>
                </ScrollReveal>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-primary py-16 dark:bg-gold/20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <ScrollReveal>
            <h2 className="mb-4 text-4xl font-bold text-white dark:text-gold">Ready to Join Alber School?</h2>
            <p className="mb-8 text-white/80 dark:text-foreground">Applications are open for the 2026 intake. Limited spaces available.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/admissions">
                <Button variant="gold">Apply Now <ArrowRight className="h-4 w-4" /></Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 dark:border-gold dark:text-gold">Contact Us</Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
