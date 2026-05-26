import { galleryImages } from '../data/gallery'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { useToast } from '../contexts/ToastContext'

export function DramaDance() {
  const { showToast } = useToast()
  const images = galleryImages.filter((g) => ['Arts', 'Events', 'Students'].includes(g.category)).slice(0, 8)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    showToast('Drama & Dance trial booked successfully!')
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
          <p className="mt-4 text-muted">Mirror-walled studios · Professional lighting · Sprung floors</p>
        </ScrollReveal>

        <div className="mt-12 columns-2 gap-4 md:columns-3">
          {images.map((img, i) => (
            <ScrollReveal key={img.id} delay={i * 0.03}>
              <img src={img.url} alt={img.title} className="mb-4 w-full rounded-2xl object-cover" />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-12">
          <GlassCard className="max-w-md p-8">
            <h2 className="mb-4 text-xl font-bold">Trial Lesson Booking</h2>
            <form onSubmit={submit} className="space-y-3">
              <input required placeholder="Name" className="field" />
              <input required type="email" placeholder="Email" className="field" />
              <select className="field">
                <option>Drama</option>
                <option>Ballet</option>
                <option>Contemporary</option>
              </select>
              <Button type="submit" variant="primary" className="w-full">Book Trial</Button>
            </form>
          </GlassCard>
        </ScrollReveal>
      </div>
    </div>
  )
}
