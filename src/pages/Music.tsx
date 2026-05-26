import { useState } from 'react'
import { galleryImages } from '../data/gallery'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { useToast } from '../contexts/ToastContext'

const musicImages = galleryImages.filter((g) => g.category === 'Arts' || g.category === 'Campus').slice(0, 6)

export function Music() {
  const { showToast } = useToast()
  const [form, setForm] = useState({ name: '', email: '', instrument: '' })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    showToast('Trial lesson request submitted! We will contact you shortly.')
    setForm({ name: '', email: '', instrument: '' })
  }

  return (
    <div className="relative">
      <div
        className="absolute inset-0 h-64 bg-cover bg-center opacity-20"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1511379938549-c1f69419868d?w=1600)' }}
      />
      <div className="relative mx-auto max-w-7xl px-4 py-12">
        <ScrollReveal>
          <h1 className="text-5xl font-bold md:text-7xl">Music Academy</h1>
          <p className="mt-4 max-w-2xl text-muted">Piano studios, ensemble rooms, and recording suites.</p>
        </ScrollReveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {musicImages.map((img, i) => (
            <ScrollReveal key={img.id} delay={i * 0.05}>
              <GlassCard className="overflow-hidden p-0">
                <img src={img.url} alt={img.title} className="aspect-video w-full object-cover" />
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-16">
          <GlassCard className="max-w-lg p-8">
            <h2 className="mb-6 text-2xl font-bold">Book a Trial Lesson</h2>
            <form onSubmit={submit} className="space-y-4">
              <input
                required
                placeholder="Parent/Student Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="field"
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="field"
              />
              <input
                required
                placeholder="Preferred Instrument"
                value={form.instrument}
                onChange={(e) => setForm({ ...form, instrument: e.target.value })}
                className="field"
              />
              <Button type="submit" variant="gold" className="w-full">Request Trial</Button>
            </form>
          </GlassCard>
        </ScrollReveal>
      </div>
    </div>
  )
}
