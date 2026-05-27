import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Quote } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { GlassCard } from '../components/ui/GlassCard'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { AnimatedCounter } from '../components/ui/AnimatedCounter'
import { events } from '../data/events'

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

      <section className="bg-tint/30 py-20 dark:bg-dark-card/30">
        <div className="mx-auto max-w-7xl px-4">
          <ScrollReveal className="text-center">
            <h2 className="mb-12 text-4xl font-bold">Upcoming Events</h2>
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

      <section className="py-20">
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

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4">
          <ScrollReveal className="text-center">
            <h2 className="mb-8 text-4xl font-bold">Life at Alber</h2>
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
