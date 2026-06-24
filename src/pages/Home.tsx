import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Quote, ShieldCheck, Trophy, Music, BookOpen,
  Globe, Baby, FlaskConical, GraduationCap, Loader2,
  Star, Heart, Lightbulb, Users, Target, Zap, Briefcase,
} from 'lucide-react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { GlassCard } from '../components/ui/GlassCard'
import { useQuery } from '@tanstack/react-query'
import { unwrap } from '../services/mockApi'
import { contentService } from '../services/contentService'
import { useCmsVal } from '../hooks/useCmsData'
import { apiClient } from '../services/apiClient'

type HomePageContent = {
  homePageContentId: number
  heroImage1Url: string; heroImage2Url: string; heroImage3Url: string; heroImage4Url: string
  heroTagline: string; heroTaglineGold: string; heroLocationBadge: string; heroSubtitle: string
  heroPrimaryCtaLabel: string; heroPrimaryCtaUrl: string
  heroSecondaryCtaLabel: string; heroSecondaryCtaUrl: string
  statStudentsEnrolled: number; statEducators: number; statEstYear: number; statActivities: number
  foundationSectionLabel: string; foundationHeading: string
  missionLabel: string; missionTitle: string; missionBody: string
  mottoLabel: string; mottoTitle: string; mottoTagline: string; mottoBody: string
  visionLabel: string; visionTitle: string; visionBody: string
  ctaBadgeText: string; ctaHeading: string; ctaSubtext: string
  ctaPrimaryLabel: string; ctaPrimaryUrl: string
  ctaSecondaryLabel: string; ctaSecondaryUrl: string
}

const TESTIMONIALS = [
  { name: 'Grace Njeri', role: 'Parent · Grade 5', initials: 'GN', quote: 'Alber School has transformed my daughter completely. The teaching quality is unmatched anywhere in Kirinyaga County.' },
  { name: 'Brian Mutua', role: 'Student · Grade 9', initials: 'BM', quote: 'The sports facilities here are world-class. I have grown as both an athlete and a leader since joining Alber.' },
  { name: 'Dr. Samuel Kariuki', role: 'Parent · PP2 & Grade 7', initials: 'SK', quote: 'Both my children attend Alber. From Playgroup all the way to Senior School — the continuity and quality are simply unmatched.' },
  { name: 'Amina Ochieng', role: 'Student · Music Academy', initials: 'AO', quote: 'I performed my first piano recital here in Grade 5. The music teachers are genuinely world-class professionals.' },
]

const CV_COLORS = [
  { color: 'from-yellow-500/20 to-yellow-500/5', text: 'text-yellow-400' },
  { color: 'from-rose-500/20 to-rose-500/5',     text: 'text-rose-400'   },
  { color: 'from-blue-500/20 to-blue-500/5',     text: 'text-blue-400'   },
  { color: 'from-green-500/20 to-green-500/5',   text: 'text-green-400'  },
  { color: 'from-purple-500/20 to-purple-500/5', text: 'text-purple-400' },
  { color: 'from-orange-500/20 to-orange-500/5', text: 'text-orange-400' },
]

const CARD_COLORS = [
  'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  'bg-blue-500/10 text-blue-600 dark:text-blue-500',
  'bg-green-500/10 text-green-600 dark:text-green-500',
  'bg-rose-500/10 text-rose-600 dark:text-rose-500',
  'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  'bg-teal-500/10 text-teal-600 dark:text-teal-400',
  'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
]

const ICON_MAP: Record<string, React.ElementType> = {
  'academic-cap': GraduationCap,
  'beaker': FlaskConical,
  'users': Users,
  'heart': Heart,
  'trophy': Trophy,
  'globe': Globe,
  'shield': ShieldCheck,
  'briefcase': Briefcase,
  'book-open': BookOpen,
  'star': Star,
  'target': Target,
  'zap': Zap,
  'music': Music,
  'baby': Baby,
  'lightbulb': Lightbulb,
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

  const { data: hp } = useQuery({
    queryKey: ['public-homepage-content'],
    queryFn: () => apiClient.get('/homepage-content').then(r => (r.data.data as HomePageContent[])[0]),
  })

  const hpImages = [
    hp?.heroImage1Url, hp?.heroImage2Url, hp?.heroImage3Url, hp?.heroImage4Url,
  ].filter(Boolean) as string[]

  const slideImages = hpImages.length > 0 ? hpImages : [
    'https://picsum.photos/seed/alber-campus/1400/900',
    'https://picsum.photos/seed/alber-class/1400/900',
    'https://picsum.photos/seed/alber-sports/1400/900',
    'https://picsum.photos/seed/alber-arts/1400/900',
  ]

  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['public-events'],
    queryFn: () => contentService.listEvents().then(unwrap),
  })

  const { data: coreValues = [], isLoading: coreValuesLoading } = useQuery({
    queryKey: ['public-core-values'],
    queryFn: () => apiClient.get('/core-values').then(r => r.data.data as {
      coreValueId: number; icon: string; title: string; description: string; sortOrder: number
    }[]),
  })

  const { data: whyAlber = [], isLoading: whyAlberLoading } = useQuery({
    queryKey: ['public-alber-difference'],
    queryFn: () => apiClient.get('/alber-difference').then(r => r.data.data as {
      id: number; icon: string; badgeName: string; name: string; description: string; sortOrder: number
    }[]),
  })

  const { data: programLevels = [], isLoading: programsLoading } = useQuery({
    queryKey: ['public-programs'],
    queryFn: () => apiClient.get('/academics-page-content/school-levels').then(r =>
      (r.data.data as {
        schoolLevelId: number; slug: string; name: string; ages: string;
        icon: string; description: string; sortOrder: number
      }[]).map(l => ({ ...l, id: l.schoolLevelId, imageUrl: undefined }))
    ),
  })

  const { data: galleryImages = [], isLoading: galleryLoading } = useQuery({
    queryKey: ['public-gallery'],
    queryFn: () => apiClient.get('/gallery').then(r =>
      (r.data.data as {
        galleryImageId: number; url: string; caption: string; isPublic: boolean
      }[])
        .filter(img => img.isPublic)
        .slice(0, 9)
        .map(img => ({ ...img, id: img.galleryImageId }))
    ),
  })

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % slideImages.length), 5000)
    return () => clearInterval(t)
  }, [slideImages.length])
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
      <section className="relative overflow-hidden" style={{ minHeight: '100svh' }}>
        {/* Background slideshow — Ken Burns zoom-in per slide */}
        {slideImages.map((img, i) => (
          <motion.img
            key={`slide-${i}`}
            src={img}
            alt="Alber School Campus"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ transformOrigin: 'center center' }}
            initial={{ opacity: i === 0 ? 1 : 0, scale: 1.0 }}
            animate={{
              opacity: i === slide ? 1 : 0,
              scale:   i === slide ? 1.1 : 1.0,
            }}
            transition={{
              opacity: { duration: 1.0, ease: 'easeInOut' },
              scale:   { duration: i === slide ? 12 : 0.01, ease: 'easeOut' },
            }}
          />
        ))}

        {/* Layered overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

        {/* Gold left accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gold via-gold/60 to-transparent" />

        {/* Slide dots — desktop right */}
        <div className="absolute bottom-32 right-8 z-10 hidden lg:flex flex-col gap-2">
          {slideImages.map((img, i) => (
            <button
              key={`dot-desktop-${img}`}
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
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
                {hp?.heroLocationBadge ?? 'Kutus · Kirinyaga County · Est. 2005'}
              </span>
            </div>

            <h1 className="mb-6 font-extrabold leading-[1.05] text-white" style={{ fontSize: 'clamp(2.6rem, 6vw, 5.5rem)' }}>
              {hp?.heroTagline ?? 'Where Excellence'}
              <span className="block" style={{ WebkitTextStroke: '2px #E8B84B', color: 'transparent' }}>
                {hp?.heroTaglineGold ?? 'Meets Tomorrow'}
              </span>
            </h1>

            <div className="mb-8 flex items-center gap-4">
              <div className="h-px w-20 bg-gold/60" />
              <span className="text-xs uppercase tracking-widest text-white/50">Alber School</span>
              <div className="h-px w-20 bg-gold/60" />
            </div>

            <p className="mb-10 max-w-lg text-lg leading-relaxed text-white/80">
              {hp?.heroSubtitle ?? "Kenya's premier learning institution — where every learner discovers their genius in world-class facilities guided by expert educators."}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to={hp?.heroPrimaryCtaUrl ?? '/admissions'}>
                <Button variant="gold">{hp?.heroPrimaryCtaLabel ?? 'Apply Now'} <ArrowRight className="h-4 w-4" /></Button>
              </Link>
              <Link to={hp?.heroSecondaryCtaUrl ?? '/academics'}>
                <button className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20">
                  {hp?.heroSecondaryCtaLabel ?? 'Explore Programs'} <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>

            {/* Mobile director card — visible only on small screens */}
            <div className="lg:hidden mt-6">
              <div className="flex items-center gap-4 rounded-2xl border border-gold/25 bg-black/65 backdrop-blur-xl p-4">
                <div className="relative shrink-0">
                  <div className="h-16 w-16 overflow-hidden rounded-xl border-2 border-gold/60 shadow-[0_0_20px_4px_rgba(232,184,75,0.25)]">
                    <img
                      src="https://picsum.photos/seed/director-alber/400/400"
                      alt={get('director.name', 'Dr. Alice Mwangi')}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <div className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[9px] font-black text-black border border-black/40">✓</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="h-px w-4 bg-gold/60" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gold/80">A Message from our Director</span>
                  </div>
                  <p className="text-sm font-extrabold uppercase tracking-wide text-white leading-tight">{get('director.name', 'Dr. Alice Mwangi')}</p>
                  <p className="text-[10px] text-gold mb-1.5">{get('director.title', 'School Director')} · M.Ed., UoN</p>
                  <p className="text-xs italic text-white/65 line-clamp-2">"{get('director.quote', 'Every child in Kirinyaga deserves an education that changes the trajectory of a family for generations. That is the promise we keep.')}"</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Director card — desktop only */}
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
              { end: hp?.statStudentsEnrolled ?? 2000, suffix: '+', label: 'Students Enrolled' },
              { end: hp?.statEducators        ?? 120,  suffix: '+', label: 'Expert Educators' },
              { end: hp?.statEstYear          ?? 2005, suffix: '',  label: 'Est.' },
              { end: hp?.statActivities       ?? 30,   suffix: '+', label: 'Co-Curricular Activities' },
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
          {slideImages.map((img, i) => (
            <button
              key={`dot-mobile-${img}`}
              onClick={() => setSlide(i)}
              className={`rounded-full transition-all ${i === slide ? 'w-6 h-2 bg-gold' : 'w-2 h-2 bg-white/40'}`}
            />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MISSION · VISION · MOTTO
      ══════════════════════════════════════════ */}
      <section className="py-14 bg-gradient-to-b from-white via-white to-gray-50 dark:from-[#0a0a0a] dark:via-[#0a0a0a] dark:to-[#0d0d0d]">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionLabel>{hp?.foundationSectionLabel ?? 'Our Foundation'}</SectionLabel>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">{hp?.foundationHeading ?? 'What We Stand For'}</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="overflow-hidden rounded-3xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[#111] shadow-xl">
              <div className="grid divide-y divide-gray-100 dark:divide-white/8 lg:grid-cols-3 lg:divide-y-0 lg:divide-x">

                {/* Mission */}
                <div className="flex items-start gap-4 p-6 hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-colors">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400 ring-1 ring-blue-400/20 mt-0.5">
                    <Target className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-0.5">{hp?.missionLabel ?? 'Our Mission'}</p>
                    <h3 className="font-bold text-base text-foreground mb-1.5">{hp?.missionTitle ?? 'To Nurture Genius'}</h3>
                    <p className="text-sm leading-relaxed text-muted">
                      {hp?.missionBody ?? 'World-class, holistic education that unlocks the unique genius in every child — equipping learners with knowledge, skills, and values to thrive globally.'}
                    </p>
                  </div>
                </div>

                {/* Motto — centre highlight */}
                <div className="relative flex items-start gap-4 p-6 bg-gradient-to-br from-[#E8B84B]/8 to-[#E8B84B]/3 dark:from-[#E8B84B]/12 dark:to-[#E8B84B]/4">
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-gold/60 to-transparent lg:hidden" />
                  <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-gradient-to-b from-transparent via-gold/60 to-transparent hidden lg:block" />
                  <div className="absolute top-0 bottom-0 right-0 w-0.5 bg-gradient-to-b from-transparent via-gold/60 to-transparent hidden lg:block" />
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold ring-1 ring-gold/30 mt-0.5">
                    <Star className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gold mb-0.5">{hp?.mottoLabel ?? 'Our Motto'}</p>
                    <h3 className="font-bold text-base text-foreground mb-1.5">{hp?.mottoTitle ?? 'Excellence in All'}</h3>
                    <p className="font-serif text-base italic font-semibold text-gold leading-snug">
                      "{hp?.mottoTagline ?? "Unlocking Every Child's Genius"}"
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {hp?.mottoBody ?? 'Academic, character, creativity, sport, and service — every learner known, valued, and challenged.'}
                    </p>
                  </div>
                </div>

                {/* Vision */}
                <div className="flex items-start gap-4 p-6 hover:bg-green-50/50 dark:hover:bg-green-500/5 transition-colors">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-500 dark:text-green-400 ring-1 ring-green-400/20 mt-0.5">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-green-500 dark:text-green-400 mb-0.5">{hp?.visionLabel ?? 'Our Vision'}</p>
                    <h3 className="font-bold text-base text-foreground mb-1.5">{hp?.visionTitle ?? 'Leaders for Tomorrow'}</h3>
                    <p className="text-sm leading-relaxed text-muted">
                      {hp?.visionBody ?? "East Africa's leading centre of excellence — producing confident, compassionate, globally competitive graduates who lead with integrity."}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CORE VALUES — fixed parallax background
      ══════════════════════════════════════════ */}
      <section className="relative" style={{ clipPath: 'inset(0)' }}>
        {/* Background: direct sticky child — no overflow:hidden ancestor (that kills sticky).
            clipPath:'inset(0)' on the section clips the sticky bg to section bounds
            without creating a scroll container (which would break sticky).        */}
        <div
          aria-hidden="true"
          className="sticky top-0 h-screen w-full"
          style={{
            marginBottom: '-100vh',
            zIndex: 0,
            backgroundImage: `url('https://picsum.photos/seed/alber-campus-wide/1600/900')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/75" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none" />
          <div className="absolute left-0 inset-y-0 w-1 bg-gradient-to-b from-gold via-gold/40 to-transparent" />
        </div>

        <div className="relative z-10 py-28">
          <div className="mx-auto max-w-7xl px-4">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Core Values
            </span>
            <h2 className="mt-2 text-4xl font-bold text-white md:text-5xl">The Alber Character</h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/60">
              Six pillars that shape the Alber graduate — a whole person ready to lead, serve, and flourish.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {coreValuesLoading ? (
              [1,2,3,4,5,6].map(n => <div key={n} className="h-40 animate-pulse rounded-2xl bg-white/10" />)
            ) : (
              coreValues.map((v, i) => {
                const { color, text } = CV_COLORS[i % CV_COLORS.length]
                return (
                  <motion.div
                    key={v.coreValueId || `cv-${i}`}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.07 }}
                  >
                    <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-6 transition-all duration-300 hover:scale-[1.03] hover:border-white/25 hover:bg-black/60 hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl bg-gradient-to-br ${color}`} />
                      <div className="relative z-10">
                        <div className="mb-4 flex items-center gap-3">
                          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${text} bg-white/10 ring-1 ring-white/20 group-hover:ring-white/30 transition-all text-xl`}>
                            {v.icon}
                          </div>
                          <h3 className={`text-lg font-bold ${text}`}>{v.title}</h3>
                        </div>
                        <p className="text-sm leading-relaxed text-white/65 group-hover:text-white/80 transition-colors">{v.description}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
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
            {whyAlberLoading ? (
              [1,2,3,4,5,6].map(n => <div key={n} className="h-44 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)
            ) : (
              whyAlber.map((item, i) => {
                const IconComp = ICON_MAP[item.icon] ?? Star
                const cardColor = CARD_COLORS[i % CARD_COLORS.length]
                return (
                  <motion.div
                    key={item.id || `why-${i}`}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.07 }}
                  >
                    <GlassCard className="flex flex-col gap-4 p-6 h-full hover:ring-2 hover:ring-gold/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${cardColor}`}>
                          <IconComp className="h-6 w-6" />
                        </div>
                        <span className="rounded-full border border-current/20 bg-current/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-muted">
                          {item.badgeName}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{item.name}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.description}</p>
                      </div>
                    </GlassCard>
                  </motion.div>
                )
              })
            )}
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
                const icon = prog.icon ?? '📖'
                const imgSrc = prog.imageUrl || `https://picsum.photos/seed/${prog.slug}/800/600`
                return (
                  <motion.div
                    key={prog.id || `prog-${i}`}
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
                  key={img.id || `gal-${i}`}
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
              {hp?.ctaBadgeText ?? 'Applications Open · 2026–2027'}
            </p>
            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">{hp?.ctaHeading ?? 'Ready to Join Alber School?'}</h2>
            <p className="mb-8 text-white/70">{hp?.ctaSubtext ?? 'Applications are open for the 2026/2027 academic year. Limited spaces — secure your child\'s place today.'}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to={hp?.ctaPrimaryUrl ?? '/admissions'}>
                <Button variant="gold">{hp?.ctaPrimaryLabel ?? 'Apply Now'} <ArrowRight className="h-4 w-4" /></Button>
              </Link>
              <Link to={hp?.ctaSecondaryUrl ?? '/contact'}>
                <button className="flex items-center gap-2 rounded-xl border-2 border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                  {hp?.ctaSecondaryLabel ?? 'Contact Us'}
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
