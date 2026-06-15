import { GlassCard } from '../components/ui/GlassCard'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { cn } from '../lib/utils'
import { useQuery } from '@tanstack/react-query'
import { unwrap } from '../services/mockApi'
import { contentService } from '../services/contentService'
import { useCmsBlocks } from '../hooks/useCmsData'

function useCms() {
  const { data: blocks = [] } = useCmsBlocks('pg-sports')
  return (key: string, fallback: string) => blocks.find((b) => b.key === key)?.value || fallback
}

const statusStyles = {
  upcoming: 'bg-primary/20 text-primary dark:text-gold',
  live: 'bg-gold/30 text-dark animate-pulse',
  completed: 'bg-tint text-primary dark:bg-dark-card dark:text-gold',
}

const SPORTS_OFFERED = [
  { name: 'Football', icon: '⚽', desc: 'Two pitches, inter-house and inter-school leagues, dedicated coaching staff.' },
  { name: 'Basketball', icon: '🏀', desc: 'Full-size courts. Boys and girls teams competing regionally.' },
  { name: 'Volleyball', icon: '🏐', desc: 'Indoor and outdoor courts for both competitive and recreational play.' },
  { name: 'Athletics', icon: '🏃', desc: '400m track, field events, relay squads — training five days a week.' },
  { name: 'Swimming', icon: '🏊', desc: '25m heated pool with certified coaches and county-level competition.' },
  { name: 'Tennis', icon: '🎾', desc: 'Two courts for individual and doubles coaching from juniors upward.' },
]

const TROPHIES = [
  { year: '2025', title: 'Kirinyaga County Football Champions', category: 'Football' },
  { year: '2025', title: 'Regional Athletics — Gold (4×100m Relay)', category: 'Athletics' },
  { year: '2024', title: 'Inter-School Basketball — Boys Division', category: 'Basketball' },
  { year: '2024', title: 'Swimming Championships — 3 Gold Medals', category: 'Swimming' },
  { year: '2023', title: 'National Volleyball — Semi-finalists', category: 'Volleyball' },
  { year: '2023', title: 'County Cross Country Champions', category: 'Athletics' },
]

const PLAYER_OF_MONTH = {
  name: 'Brian Mutua',
  sport: 'Football',
  class: 'Form 3 Ruby',
  image: 'https://i.pravatar.cc/600?img=12',
  stats: '14 goals · 8 assists · Captain',
}

export function Sports() {
  const get = useCms()
  const { data: fixtures = [], isLoading } = useQuery({
    queryKey: ['public-sports-fixtures'],
    queryFn: () => contentService.listSportFixtures().then(unwrap),
  })
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <ScrollReveal className="mb-16 text-center">
        <h1 className="mb-4 text-5xl font-bold md:text-7xl">{get('hero.headline', 'Sports & Athletics')}</h1>
        <p className="mx-auto max-w-2xl text-muted">{get('hero.subheadline', 'Premium facilities · Professional coaching · County, regional and national competition.')}</p>
      </ScrollReveal>

      <ScrollReveal className="mt-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Sports Offered</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SPORTS_OFFERED.map((s, i) => (
            <ScrollReveal key={s.name} delay={i * 0.07}>
              <GlassCard className="p-6">
                <span className="mb-3 block text-4xl">{s.icon}</span>
                <h3 className="text-lg font-bold text-primary dark:text-gold">{s.name}</h3>
                <p className="mt-1 text-sm text-muted">{s.desc}</p>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal className="mt-16">
        <GlassCard className="overflow-hidden p-0 md:flex">
          <img src={PLAYER_OF_MONTH.image} alt={PLAYER_OF_MONTH.name} className="h-64 w-full object-cover md:h-auto md:w-80" />
          <div className="p-8">
            <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold text-dark">⭐ Player of the Month</span>
            <h2 className="mt-4 text-3xl font-bold">{PLAYER_OF_MONTH.name}</h2>
            <p className="text-primary dark:text-gold">{PLAYER_OF_MONTH.sport} · {PLAYER_OF_MONTH.class}</p>
            <p className="mt-2 text-muted">{PLAYER_OF_MONTH.stats}</p>
          </div>
        </GlassCard>
      </ScrollReveal>

      <ScrollReveal className="mt-16">
        <h2 className="mb-6 text-center text-2xl font-bold">Fixtures & Results</h2>
        {isLoading ? (
          <p className="text-center text-muted py-8">Loading fixtures…</p>
        ) : fixtures.length === 0 ? (
          <p className="text-center text-muted py-8">No fixtures yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-3xl glass glass-border text-foreground">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-theme">
                  <th className="p-4">Sport</th>
                  <th className="p-4">Opponent</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Venue</th>
                  <th className="p-4">Result</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {fixtures.map((f) => (
                  <tr key={f.id} className="border-b border-theme/50 transition hover:bg-tint/50 dark:hover:bg-dark-card">
                    <td className="p-4 font-medium">{f.sport}</td>
                    <td className="p-4">{f.opponent}</td>
                    <td className="p-4">{f.date}</td>
                    <td className="p-4">{f.venue}</td>
                    <td className="p-4">{f.result}</td>
                    <td className="p-4">
                      <span className={cn('rounded-full px-3 py-1 text-xs font-semibold capitalize', statusStyles[f.status])}>
                        {f.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ScrollReveal>

      <ScrollReveal className="mt-16">
        <h2 className="mb-8 text-3xl font-bold">Trophy Cabinet</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TROPHIES.map((t, i) => (
            <ScrollReveal key={t.title} delay={i * 0.07}>
              <GlassCard className="flex items-start gap-4 p-5">
                <span className="text-3xl">🏆</span>
                <div>
                  <p className="font-bold text-primary dark:text-gold">{t.title}</p>
                  <p className="text-xs text-muted">{t.category} · {t.year}</p>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </ScrollReveal>
    </div>
  )
}
