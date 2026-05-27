import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Quote, ShieldCheck, Trophy, Music, BookOpen, Globe, Users } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { GlassCard } from '../components/ui/GlassCard'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { AnimatedCounter } from '../components/ui/AnimatedCounter'
import { events } from '../data/events'
import { programLevels } from '../data/programs'

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
    icon: BookOpen,
    title: 'Dual Curriculum',
    desc: 'The only school in Kirinyaga offering both the CBC national framework and Cambridge IGCSE & A-Level pathways under one roof.',
  },
  {
    icon: Music,
    title: 'Professional Music Academy',
    desc: 'Steinway-ready studios, ABRSM examination centre, and ensemble halls — nurturing musicians from Grade 1 to A-Level.',
  },
  {
    icon: Trophy,
    title: 'Elite Sports Complex',
    desc: '25m pool, 400m athletics track, football pitches, and a fully equipped gym — developing county and national champions.',
  },
  {
    icon: Globe,
    title: 'Global University Ready',
    desc: 'Dedicated university counselling from Grade 10, with graduates placed in universities across Kenya, UK, USA, and Canada.',
  },
  {
    icon: ShieldCheck,
    title: 'Safe & Nurturing Campus',
    desc: "CCTV-monitored, fully fenced campus adjacent to the Governor's Offices — giving parents total peace of mind.",
  },
  {
    icon: Users,
    title: 'Small Class Sizes',
    desc: 'A maximum of 30 learners per class ensures every child receives individualised attention from our expert educators.',
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

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_IMAGES.length), 5000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setTestimonial((s) => (s + 1) % TESTIMONIALS.length), 6000)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center gap-12 px-4 lg:flex-row lg:items-center">
        <ScrollReveal className="flex-1 lg:pr-8">
          <span className="mb-4 inline-block rounded-full border border-gold/50 bg-gold/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary dark:text-gold">
            Kutus · Kirinyaga County · Adjacent to Governor's Offices
          </span>
          <h1 className="mb-6 text-5xl font-extrabold leading-[1.1] text-foreground md:text-6xl lg:text-7xl">
            Where Excellence
            <span className="block text-gold">Meets Tomorrow</span>
          </h1>
          <p className="mb-8 max-w-xl text-lg text-muted">
            Alber School — premium private education in the heart of Kirinyaga. 2,000+ learners. 120+ expert educators. Academics, sports, music, and performing arts under one roof.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/admissions">
              <Button variant="primary">Apply Now <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <Link to="/academics">
              <Button variant="outline">Explore Programs</Button>
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2} className="relative flex-1 w-full">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl glass glass-border">
            {HERO_IMAGES.map((img, i) => (
              <img
                key={img}
                src={img}
                alt="Alber School Campus"
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {HERO_IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  className={`h-2 rounded-full transition-all ${i === slide ? 'w-8 bg-gold' : 'w-2 bg-white/50'}`}
                />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Stats ── */}
      <section className="bg-tint/50 py-16 dark:bg-dark-card/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { end: 2000, suffix: '+', label: 'Students Enrolled' },
            { end: 120, suffix: '+', label: 'Expert Staff' },
            { end: 8, suffix: '', label: 'Modern School Buses' },
            { end: 6, suffix: '', label: 'Sports Disciplines' },
          ].map((stat) => (
            <ScrollReveal key={stat.label}>
              <GlassCard className="p-8 text-center">
                <p className="text-5xl font-bold text-primary dark:text-gold">
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-muted">{stat.label}</p>
              </GlassCard>
            </ScrollReveal>
          ))}
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
              Six pillars that set Alber School apart from every other institution in Kirinyaga County.
            </p>
          </ScrollReveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_ALBER.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.07}>
                <GlassCard className="flex gap-5 p-6 h-full">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 dark:bg-gold/10">
                    <item.icon className="h-6 w-6 text-primary dark:text-gold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{item.desc}</p>
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
            {programLevels.map((prog, i) => (
              <ScrollReveal key={prog.id} delay={i * 0.08}>
                <Link to="/academics" className="group block h-full">
                  <GlassCard className="overflow-hidden p-0 h-full transition-all group-hover:ring-2 group-hover:ring-gold/60">
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={prog.image}
                        alt={prog.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className="absolute bottom-3 left-3 text-3xl">{PROGRAM_ICONS[prog.id]}</span>
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
            ))}
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
            {GALLERY.map((url, i) => (
              <ScrollReveal key={url} delay={i * 0.04}>
                <div className="aspect-square overflow-hidden rounded-2xl">
                  <img
                    src={url}
                    alt={`Campus life ${i + 1}`}
                    className="h-full w-full object-cover transition duration-500 hover:scale-110"
                  />
                </div>
              </ScrollReveal>
            ))}
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
            {events.filter((e) => !e.isPast).slice(0, 6).map((e, i) => (
              <ScrollReveal key={e.id} delay={i * 0.08}>
                <div className="relative mb-10">
                  <div className="absolute -left-[41px] h-4 w-4 rounded-full bg-gold ring-4 ring-gold/20" />
                  <GlassCard className="p-6">
                    <span className="text-xs font-semibold text-gold">{e.date}</span>
                    <h3 className="mt-1 text-xl font-bold">{e.title}</h3>
                    <p className="text-sm text-muted">{e.location} · {e.description}</p>
                  </GlassCard>
                </div>
              </ScrollReveal>
            ))}
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
