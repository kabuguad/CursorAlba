import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { useToast } from '../contexts/ToastContext'
import { useState } from 'react'
import { useCoCurrSection } from '../hooks/useCoCurrSection'

const DANCE_STYLES = [
  { icon: '🩰', name: 'Ballet', desc: 'Classical technique, barre work and performance choreography.' },
  { icon: '💫', name: 'Contemporary', desc: 'Modern movement, improvisation and creative expression.' },
  { icon: '🌍', name: 'African Dance', desc: "Rooted in Kenya's rich cultural traditions and heritage." },
  { icon: '🎤', name: 'Hip-Hop', desc: 'Street dance, breaking and urban choreography.' },
  { icon: '🎭', name: 'Drama', desc: 'Script, stagecraft, voice and movement for theatre performance.' },
]

const PAST_PLAYS = [
  {
    year: '2024',
    title: "The Lion's Roar",
    desc: 'An original production exploring Kenyan folklore through dance, spoken word, and music. Cast of 60 students.',
    img: 'https://picsum.photos/seed/drama-2024/600/400',
  },
  {
    year: '2023',
    title: 'Echoes of Kirinyaga',
    desc: 'A celebration of Kirinyaga County heritage with traditional dance, acrobatics, and drama. Standing ovation.',
    img: 'https://picsum.photos/seed/drama-2023/600/400',
  },
  {
    year: '2022',
    title: "Tomorrow's Leaders",
    desc: 'A satirical play on modern education and youth ambition. Directed by Form 4 students.',
    img: 'https://picsum.photos/seed/drama-2022/600/400',
  },
]

const CHOREOGRAPHERS = [
  {
    name: 'Ms. Grace Achieng',
    role: 'Lead Choreographer · Ballet & Contemporary',
    img: '/images/avatar-36.jpg',
    bio: 'Trained in Nairobi and London. 15 years choreographing award-winning productions.',
  },
  {
    name: 'Mr. Oscar Njoroge',
    role: 'Drama Director · Playwright',
    img: '/images/avatar-52.jpg',
    bio: 'Graduate of Kenya National Theatre. Specialist in African contemporary drama.',
  },
]

const SCHEDULE = [
  { day: 'Monday', activity: 'Ballet — 4:00–5:30 PM' },
  { day: 'Tuesday', activity: 'Drama Workshop — 3:30–5:30 PM' },
  { day: 'Wednesday', activity: 'Contemporary Dance — 4:00–5:30 PM' },
  { day: 'Thursday', activity: 'African Dance & Hip-Hop — 3:30–5:00 PM' },
  { day: 'Friday', activity: 'Full Company Rehearsal — 3:30–6:00 PM' },
]

export function DramaDance() {
  // 'performing' matches "Creative & Performing Arts" — the API category covering Music, Dance & Drama
  const { category, activities, isLoading } = useCoCurrSection('performing')
  const { showToast } = useToast()

  const heroHeadline    = category?.heading ?? 'Drama & Dance'
  const heroSubheadline = category?.intro   ?? 'Mirror-walled studios · Professional lighting · Sprung floors · 4K capture for portfolio development.'

  const [form, setForm] = useState({ name: '', email: '', interest: DANCE_STYLES[0].name })

  return (
    <div className="overflow-hidden">
      <section
        className="relative flex min-h-[65vh] items-end overflow-hidden"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0 100%)' }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          poster="/images/unsplash-1508700929628-666bc8bd84ea.jpg"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-dancer-doing-pirouettes-in-a-dance-studio-429-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-rose-950/92 via-rose-900/65 to-rose-800/10" />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-gold via-gold/60 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-8 pb-24">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/30 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
            Dance · Drama · Performance
          </span>
          <h1 className="mt-3 text-5xl font-extrabold leading-tight text-white md:text-7xl [text-shadow:_0_4px_32px_rgba(0,0,0,0.7)]">{heroHeadline}</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">{heroSubheadline}</p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-12">

        {/* Creative Arts programmes from the API */}
        {(isLoading || activities.length > 0) && (
          <ScrollReveal className="mt-4">
            <h2 className="mb-6 text-center text-2xl font-bold">Creative Arts Programmes</h2>
            {isLoading ? (
              <div className="flex gap-4 justify-center">
                {[1, 2, 3].map(i => <div key={i} className="h-24 w-40 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)}
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-4">
                {activities.map((a, i) => (
                  <ScrollReveal key={a.id} delay={i * 0.08}>
                    <GlassCard className="flex items-center gap-3 px-5 py-3">
                      <span className="text-2xl">{a.icon}</span>
                      <div>
                        <p className="font-bold text-primary dark:text-gold">{a.name}</p>
                        <p className="text-xs text-muted max-w-[200px]">{a.description}</p>
                      </div>
                    </GlassCard>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </ScrollReveal>
        )}

        <ScrollReveal className="mt-16">
          <h2 className="mb-8 text-center text-3xl font-bold">Dance Styles Offered</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {DANCE_STYLES.map((d, i) => (
              <ScrollReveal key={d.name} delay={i * 0.08}>
                <GlassCard className="p-6 text-center">
                  <span className="mb-3 block text-5xl">{d.icon}</span>
                  <h3 className="text-lg font-bold text-primary dark:text-gold">{d.name}</h3>
                  <p className="mt-2 text-sm text-muted">{d.desc}</p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal className="mt-20">
          <h2 className="mb-8 text-center text-3xl font-bold">Annual Play Archives</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {PAST_PLAYS.map((p, i) => (
              <ScrollReveal key={p.year} delay={i * 0.1}>
                <GlassCard className="overflow-hidden p-0">
                  <div className="relative">
                    <img src={p.img} alt={p.title} className="h-48 w-full object-cover" />
                    <span className="absolute top-4 left-4 rounded-full bg-gold px-3 py-1 text-xs font-bold text-dark">{p.year}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-primary dark:text-gold">"{p.title}"</h3>
                    <p className="mt-2 text-sm text-muted">{p.desc}</p>
                  </div>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal className="mt-20">
          <h2 className="mb-8 text-center text-3xl font-bold">Our Faculty</h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {CHOREOGRAPHERS.map((c, i) => (
              <ScrollReveal key={c.name} delay={i * 0.1}>
                <GlassCard className="overflow-hidden p-0 md:flex">
                  <img src={c.img} alt={c.name} className="h-48 w-full object-cover object-top md:h-auto md:w-40" />
                  <div className="p-6">
                    <h3 className="font-bold">{c.name}</h3>
                    <p className="text-xs font-semibold text-gold">{c.role}</p>
                    <p className="mt-2 text-sm text-muted">{c.bio}</p>
                  </div>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal className="mt-20">
          <h2 className="mb-8 text-center text-3xl font-bold">Rehearsal Schedule</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {SCHEDULE.map((s, i) => (
              <ScrollReveal key={s.day} delay={i * 0.06}>
                <GlassCard className="p-5">
                  <p className="font-bold text-primary dark:text-gold">{s.day}</p>
                  <p className="mt-2 text-xs text-muted">{s.activity}</p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal className="mt-20">
          <GlassCard className="max-w-md p-8">
            <h2 className="mb-4 text-2xl font-bold">Book a Trial</h2>
            <p className="mb-6 text-sm text-muted">Experience drama or dance with our faculty — one free trial session.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                showToast(`Trial booking for ${form.interest} submitted! We will be in touch.`)
                setForm({ name: '', email: '', interest: DANCE_STYLES[0].name })
              }}
              className="space-y-3"
            >
              <input
                required
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="field"
              />
              <input
                required
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="field"
              />
              <select
                value={form.interest}
                onChange={(e) => setForm({ ...form, interest: e.target.value })}
                className="field"
              >
                {DANCE_STYLES.map(d => <option key={d.name}>{d.name}</option>)}
              </select>
              <Button type="submit" variant="primary" className="w-full">Book Free Trial</Button>
            </form>
          </GlassCard>
        </ScrollReveal>
      </div>
    </div>
  )
}
