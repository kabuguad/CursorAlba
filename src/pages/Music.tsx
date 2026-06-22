import { useState } from 'react'
import { GlassCard } from '../components/ui/GlassCard'
import { PageHero } from '../components/layout/PageHero'
import { Button } from '../components/ui/Button'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { useToast } from '../contexts/ToastContext'
import { useCoCurrSection } from '../hooks/useCoCurrSection'

const INSTRUMENTS = [
  { icon: '🎹', name: 'Piano', desc: 'Classical & contemporary. Individual lessons and ensemble playing.' },
  { icon: '🎻', name: 'Violin', desc: 'Strings programme. ABRSM examination pathways available.' },
  { icon: '🎸', name: 'Guitar', desc: 'Classical, acoustic and electric guitar for all levels.' },
  { icon: '🎺', name: 'Brass', desc: 'Trumpet, trombone and French horn — full orchestra integration.' },
  { icon: '🪗', name: 'Woodwind', desc: 'Flute, clarinet and saxophone. Grade examinations supported.' },
  { icon: '🥁', name: 'Drums & Percussion', desc: 'Kit drumming, marimba and full percussion ensemble.' },
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
  // 'performing' matches "Creative & Performing Arts" — the API category that covers Music, Dance & Drama
  const { category, activities, isLoading } = useCoCurrSection('performing')
  const { showToast } = useToast()

  const heroHeadline    = category?.heading ?? 'Music Academy'
  const heroSubheadline = category?.intro   ?? 'Piano studios · Recording suites · Full orchestra ensemble · ABRSM examination centre.'

  const [form, setForm] = useState({ name: '', email: '', phone: '', instrument: INSTRUMENTS[0].name, level: 'Beginner' })

  return (
    <div className="overflow-hidden">
      <PageHero
        title={heroHeadline}
        subtitle={heroSubheadline}
        badge="Music Academy"
        image="https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=1920&q=80"
        variant="cinematic"
        overlay="purple"
      />
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
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    showToast(`Trial lesson request for ${form.instrument} submitted! We will contact you shortly.`)
                    setForm({ name: '', email: '', phone: '', instrument: INSTRUMENTS[0].name, level: 'Beginner' })
                  }}
                  className="space-y-4"
                >
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
                    {INSTRUMENTS.map((inst) => <option key={inst.name}>{inst.name}</option>)}
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
