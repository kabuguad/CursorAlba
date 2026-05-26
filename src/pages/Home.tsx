import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { GlassCard } from '../components/ui/GlassCard'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { AnimatedCounter } from '../components/ui/AnimatedCounter'
import { events } from '../data/events'

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1523050854898-fb9d7d4f9c0e?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1541339907198-e08756dedfbf?w=1200&h=800&fit=crop',
]

const PROGRAMS = [
  { title: 'CBC Excellence', desc: 'Kenya\'s competency-based curriculum', img: 'https://images.unsplash.com/photo-1580582938317-6572b825d3f9?w=600&h=400&fit=crop' },
  { title: 'IGCSE Pathway', desc: 'Cambridge international standards', img: 'https://images.unsplash.com/photo-1497633762263-9fc9e4a76534?w=600&h=400&fit=crop' },
  { title: 'Arts Academy', desc: 'Music, drama & dance studios', img: 'https://images.unsplash.com/photo-1511379938549-c1f69419868d?w=600&h=400&fit=crop' },
  { title: 'Elite Athletics', desc: 'Premium sports complex', img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop' },
]

export function Home() {
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_IMAGES.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      <section className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center gap-12 px-4 lg:flex-row lg:items-center">
        <ScrollReveal className="flex-1 lg:pr-8">
          <span className="mb-4 inline-block rounded-full border border-gold/50 bg-gold/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary dark:text-gold">
            Kutus · Kirinyaga County
          </span>
          <h1 className="mb-6 text-5xl font-extrabold leading-[1.1] text-foreground md:text-6xl lg:text-7xl">
            Where Excellence
            <span className="block text-gold">Meets Tomorrow</span>
          </h1>
          <p className="mb-8 max-w-xl text-lg text-muted">
            Alber School — luxury private education adjacent to the Governor&apos;s Offices.
            Futuristic learning. World-class faculty. Unmatched opportunity.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/admissions">
              <Button variant="primary">Apply Now <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <Link to="/programs">
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
                alt="Campus"
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
        <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-3">
          {[
            { end: 2000, suffix: '+', label: 'Students' },
            { end: 120, suffix: '+', label: 'Expert Staff' },
            { end: 4, suffix: '+', label: 'Modern Buses' },
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

      <section className="snap-container py-20">
        <div className="mx-auto max-w-7xl px-4">
          <ScrollReveal>
            <h2 className="mb-12 text-4xl font-bold md:text-5xl">Featured Programs</h2>
          </ScrollReveal>
          <div className="grid gap-8 md:grid-cols-2">
            {PROGRAMS.map((p, i) => (
              <ScrollReveal key={p.title} delay={i * 0.1}>
                <GlassCard className="snap-section group overflow-hidden p-0">
                  <div className="relative h-48 overflow-hidden">
                    <img src={p.img} alt={p.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                  </div>
                  <div className="flex items-center justify-between p-6">
                    <div>
                      <h3 className="text-xl font-bold">{p.title}</h3>
                      <p className="text-sm text-muted">{p.desc}</p>
                    </div>
                    <ChevronRight className="h-6 w-6 text-gold transition group-hover:translate-x-1" />
                  </div>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <ScrollReveal>
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
    </>
  )
}
