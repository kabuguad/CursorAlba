import { useState } from 'react'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { useToast } from '../contexts/ToastContext'

const INSTRUMENTS = [
  { name: 'Piano', icon: '🎹', desc: 'Steinway-ready studios. Lessons from beginner to Grade 8 ABRSM.' },
  { name: 'Violin', icon: '🎻', desc: 'Classical strings with ensemble and solo performance training.' },
  { name: 'Guitar', icon: '🎸', desc: 'Acoustic, classical and electric — across all skill levels.' },
  { name: 'Brass', icon: '🎺', desc: 'Trumpet, trombone, French horn — full brass section ensemble.' },
  { name: 'Woodwind', icon: '🎷', desc: 'Flute, clarinet, saxophone — individual and band sessions.' },
  { name: 'Drums & Percussion', icon: '🥁', desc: 'Full kit, djembe, marimba and orchestral percussion.' },
]

const TEACHERS = [
  {
    name: 'Ms. Ruth Kamau',
    subject: 'Piano & Theory',
    img: 'https://i.pravatar.cc/400?img=44',
    credentials: 'B.Mus (University of Nairobi) · ABRSM Grade 8',
  },
  {
    name: 'Mr. Victor Omondi',
    subject: 'Strings & Ensemble',
    img: 'https://i.pravatar.cc/400?img=57',
    credentials: 'Conservatoire-trained · 12 years teaching',
  },
  {
    name: 'Ms. Nancy Wanjiru',
    subject: 'Vocals & Choir',
    img: 'https://i.pravatar.cc/400?img=32',
    credentials: 'Dip. Music Ed. · Former KBC choir director',
  },
]

const SCHEDULE = [
  { day: 'Monday', slots: ['Piano — 3:30–5:00 PM', 'Choir Rehearsal — 4:00–5:30 PM'] },
  { day: 'Tuesday', slots: ['Strings Ensemble — 3:30–5:00 PM', 'Guitar — 4:00–5:00 PM'] },
  { day: 'Wednesday', slots: ['Brass & Woodwind — 3:30–5:00 PM', 'Theory of Music — 4:00–5:00 PM'] },
  { day: 'Thursday', slots: ['Drums & Percussion — 3:30–5:00 PM', 'Full Orchestra — 4:00–6:00 PM'] },
  { day: 'Friday', slots: ['Open Studio — 3:30–5:30 PM', 'Solo Coaching (by appointment)'] },
]

export function Music() {
  const { showToast } = useToast()
  const [form, setForm] = useState({ name: '', email: '', phone: '', instrument: 'Piano', level: 'Beginner' })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    showToast(`Trial lesson request for ${form.instrument} submitted! We will contact you shortly.`)
    setForm({ name: '', email: '', phone: '', instrument: 'Piano', level: 'Beginner' })
  }

  return (
    <div className="relative">
      <div
        className="absolute inset-0 h-64 bg-cover bg-center opacity-20"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1511379938549-c1f69419868d?w=1600)' }}
      />
      <div className="relative mx-auto max-w-7xl px-4 py-12">
        <ScrollReveal className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold md:text-7xl">Music Academy</h1>
          <p className="mx-auto max-w-2xl text-muted">Piano studios · Recording suites · Full orchestra ensemble · ABRSM examination centre.</p>
        </ScrollReveal>

        <ScrollReveal className="mt-16">
          <h2 className="mb-8 text-center text-3xl font-bold">Instruments Offered</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {INSTRUMENTS.map((inst, i) => (
              <ScrollReveal key={inst.name} delay={i * 0.07}>
                <GlassCard className="p-6">
                  <span className="mb-3 block text-5xl">{inst.icon}</span>
                  <h3 className="text-lg font-bold text-primary dark:text-gold">{inst.name}</h3>
                  <p className="mt-1 text-sm text-muted">{inst.desc}</p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal className="mt-20">
          <h2 className="mb-8 text-center text-3xl font-bold">Our Music Faculty</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {TEACHERS.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 0.1}>
                <GlassCard className="overflow-hidden p-0 text-center">
                  <img src={t.img} alt={t.name} className="h-52 w-full object-cover object-top" />
                  <div className="p-5">
                    <h3 className="font-bold">{t.name}</h3>
                    <p className="text-xs font-semibold text-gold">{t.subject}</p>
                    <p className="mt-2 text-xs text-muted">{t.credentials}</p>
                  </div>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal className="mt-20">
          <h2 className="mb-8 text-center text-3xl font-bold">Weekly Rehearsal Schedule</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {SCHEDULE.map((s, i) => (
              <ScrollReveal key={s.day} delay={i * 0.06}>
                <GlassCard className="p-5">
                  <p className="mb-3 font-bold text-primary dark:text-gold">{s.day}</p>
                  <ul className="space-y-2">
                    {s.slots.map((slot) => (
                      <li key={slot} className="text-xs text-muted leading-snug">{slot}</li>
                    ))}
                  </ul>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal className="mt-20">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold">Book a Trial Lesson</h2>
              <p className="mb-6 text-muted">Try any instrument with one of our specialist teachers — no commitment required.</p>
              <GlassCard className="p-8">
                <form onSubmit={submit} className="space-y-4">
                  <input
                    required
                    placeholder="Parent / Student Name"
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
                  <input
                    placeholder="Phone (optional)"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="field"
                  />
                  <select
                    value={form.instrument}
                    onChange={(e) => setForm({ ...form, instrument: e.target.value })}
                    className="field"
                  >
                    {INSTRUMENTS.map((i) => <option key={i.name}>{i.name}</option>)}
                  </select>
                  <select
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                    className="field"
                  >
                    {['Beginner', 'Intermediate', 'Advanced'].map((l) => <option key={l}>{l}</option>)}
                  </select>
                  <Button type="submit" variant="gold" className="w-full">Request Trial Lesson</Button>
                </form>
              </GlassCard>
            </div>
            <div className="flex flex-col gap-4">
              <img
                src="https://images.unsplash.com/photo-1511379938549-c1f69419868d?w=800&h=500&fit=crop"
                alt="Music Academy"
                className="h-64 w-full rounded-3xl object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&h=400&fit=crop"
                alt="Orchestra rehearsal"
                className="h-40 w-full rounded-3xl object-cover"
              />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
