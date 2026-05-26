import { GlassCard } from '../components/ui/GlassCard'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { HistoryStepper } from '../components/about/HistoryStepper'

const HISTORY = [
  { year: '2008', title: 'Foundation', desc: 'Alber School established in Kutus with a vision for premium education.' },
  { year: '2014', title: 'Arts Academy', desc: 'Music and performing arts facilities launched.' },
  { year: '2018', title: 'IGCSE Pathway', desc: 'Cambridge international curriculum introduced.' },
  { year: '2022', title: 'Campus Expansion', desc: 'New sports complex and science laboratories completed.' },
  { year: '2026', title: 'Future Forward', desc: '360° virtual tours and digital learning platforms.' },
]

export function About() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <ScrollReveal>
        <h1 className="mb-4 text-5xl font-bold text-primary dark:text-gold md:text-7xl">About Us</h1>
        <p className="mb-16 max-w-2xl text-lg text-muted">
          Adjacent to the Governor&apos;s Offices in Kutus, Kirinyaga County — redefining private education in Kenya.
        </p>
      </ScrollReveal>

      <div className="relative mb-24 grid gap-8 lg:grid-cols-2">
        <ScrollReveal>
          <GlassCard className="relative z-10 -rotate-1 p-8 lg:mt-12">
            <h2 className="mb-4 text-3xl font-bold text-primary dark:text-gold">Our Mission</h2>
            <p className="leading-relaxed text-muted">
              To cultivate visionary leaders through innovative, competency-based education
              that honors Kenyan heritage while embracing global excellence.
            </p>
          </GlassCard>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <GlassCard className="relative z-20 rotate-1 p-8 lg:-mt-8 lg:ml-12">
            <h2 className="mb-4 text-3xl font-bold text-primary dark:text-gold">Our Vision</h2>
            <p className="leading-relaxed text-muted">
              To be East Africa&apos;s most sought-after private institution — where every learner
              discovers their genius in state-of-the-art facilities.
            </p>
          </GlassCard>
        </ScrollReveal>
      </div>

      <ScrollReveal className="text-center">
        <h2 className="mb-8 text-4xl font-bold">Our History</h2>
        <p className="mx-auto mb-10 max-w-xl text-muted">
          Follow our journey from founding to the future — select a milestone or use the controls below.
        </p>
      </ScrollReveal>
      <ScrollReveal delay={0.1} className="flex justify-center">
        <HistoryStepper steps={HISTORY} />
      </ScrollReveal>
    </div>
  )
}
