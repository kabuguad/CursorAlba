import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { useToast } from '../contexts/ToastContext'
import { useState } from 'react'

const DANCE_STYLES = [
  { style: 'Ballet', icon: '🩰', desc: 'Classical technique from foundational positions to pointe work.' },
  { style: 'Contemporary', icon: '💫', desc: 'Fluid movement, floor work, and creative improvisation.' },
  { style: 'African Dance', icon: '🥁', desc: 'Traditional rhythms from across East and West Africa.' },
  { style: 'Hip-Hop', icon: '🎤', desc: 'Street styles, breaking, and performance choreography.' },
]

const PAST_PLAYS = [
  {
    year: '2024',
    title: "The Lion's Roar",
    desc: 'An original production exploring Kenyan folklore through dance, spoken word, and music. Cast of 60 students.',
    img: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=600&h=400&fit=crop',
  },
  {
    year: '2023',
    title: 'Echoes of Kirinyaga',
    desc: 'A celebration of Kirinyaga County heritage with traditional dance, acrobatics, and drama. Standing ovation.',
    img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&h=400&fit=crop',
  },
  {
    year: '2022',
    title: "Tomorrow's Leaders",
    desc: 'A satirical play on modern education and youth ambition. Directed by Form 4 students.',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
  },
]

const CHOREOGRAPHERS = [
  {
    name: 'Ms. Grace Achieng',
    role: 'Lead Choreographer · Ballet & Contemporary',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    bio: 'Trained in Nairobi and London. 15 years choreographing award-winning productions.',
  },
  {
    name: 'Mr. Oscar Njoroge',
    role: 'Drama Director · Playwright',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
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
  const { showToast } = useToast()
  const [form, setForm] = useState({ name: '', email: '', interest: 'Drama' })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    showToast(`Trial booking for ${form.interest} submitted! We will be in touch.`)
    setForm({ name: '', email: '', interest: 'Drama' })
  }

  return (
    <div className="relative">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="pointer-events-none fixed inset-0 -z-10 h-full w-full object-cover opacity-10"
        poster="https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=1600"
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-dancer-doing-pirouettes-in-a-dance-studio-429-large.mp4" type="video/mp4" />
      </video>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <ScrollReveal>
          <h1 className="text-5xl font-bold md:text-7xl">Drama & Dance</h1>
          <p className="mt-4 max-w-2xl text-muted">Mirror-walled studios · Professional lighting · Sprung floors · 4K capture for portfolio development.</p>
        </ScrollReveal>

        <ScrollReveal className="mt-16">
          <h2 className="mb-8 text-3xl font-bold">Dance Styles Offered</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DANCE_STYLES.map((d, i) => (
              <ScrollReveal key={d.style} delay={i * 0.08}>
                <GlassCard className="p-6 text-center">
                  <span className="mb-3 block text-5xl">{d.icon}</span>
                  <h3 className="text-lg font-bold text-primary dark:text-gold">{d.style}</h3>
                  <p className="mt-2 text-sm text-muted">{d.desc}</p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal className="mt-20">
          <h2 className="mb-8 text-3xl font-bold">Annual Play Archives</h2>
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
          <h2 className="mb-8 text-3xl font-bold">Our Faculty</h2>
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
          <h2 className="mb-8 text-3xl font-bold">Rehearsal Schedule</h2>
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
            <form onSubmit={submit} className="space-y-3">
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
                <option>Drama</option>
                <option>Ballet</option>
                <option>Contemporary</option>
                <option>African Dance</option>
                <option>Hip-Hop</option>
              </select>
              <Button type="submit" variant="primary" className="w-full">Book Free Trial</Button>
            </form>
          </GlassCard>
        </ScrollReveal>
      </div>
    </div>
  )
}
