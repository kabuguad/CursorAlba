import { GlassCard } from '../components/ui/GlassCard'
import { PageHero } from '../components/layout/PageHero'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { cn } from '../lib/utils'
import { useQuery } from '@tanstack/react-query'
import { unwrap } from '../services/mockApi'
import { contentService } from '../services/contentService'
import { useCoCurrSection } from '../hooks/useCoCurrSection'

const statusStyles = {
  upcoming: 'bg-primary/20 text-primary dark:text-gold',
  live: 'bg-gold/30 text-dark animate-pulse',
  completed: 'bg-tint text-primary dark:bg-dark-card dark:text-gold',
}

const PLAYER_OF_MONTH = {
  name: 'Brian Mutua',
  sport: 'Football',
  class: 'Form 3 Ruby',
  image: '/images/avatar-12.jpg',
  stats: '14 goals · 8 assists · Captain',
}

export function Sports() {
  const { category, activities, isLoading: activitiesLoading } = useCoCurrSection('sport')

  const heroHeadline    = category?.heading    ?? 'Sports & Athletics'
  const heroSubheadline = category?.intro      ?? 'Premium facilities · Professional coaching · County, regional and national competition.'

  const { data: fixtures = [], isLoading: fixturesLoading } = useQuery({
    queryKey: ['public-sports-fixtures'],
    queryFn: () => contentService.listSportFixtures().then(unwrap),
  })

  const { data: trophies = [] } = useQuery({
    queryKey: ['sport-trophies'],
    queryFn: () => contentService.listSportTrophies().then(unwrap),
  })

  return (
    <div className="overflow-hidden">
      <PageHero
        title={heroHeadline}
        subtitle={heroSubheadline}
        badge="Sports & Athletics"
        image="/images/unsplash-1571019614242-c5c5dee9f50b.jpg"
        variant="cinematic"
        overlay="amber"
      />
      <div className="mx-auto max-w-7xl px-4 py-12">

      <ScrollReveal className="mt-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Sports Offered</h2>
        {activitiesLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-36 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)}
          </div>
        ) : activities.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((s, i) => (
              <ScrollReveal key={s.id} delay={i * 0.07}>
                <GlassCard className="p-6">
                  <span className="mb-3 block text-4xl">{s.icon}</span>
                  <h3 className="text-lg font-bold text-primary dark:text-gold">{s.name}</h3>
                  <p className="mt-1 text-sm text-muted">{s.description}</p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted py-8">No sports listed yet.</p>
        )}
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
        {fixturesLoading ? (
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
        {trophies.length === 0 ? (
          <p className="text-center text-muted py-8">No trophies yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trophies.map((t, i) => (
              <ScrollReveal key={t.id} delay={i * 0.07}>
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
        )}
      </ScrollReveal>
      </div>
    </div>
  )
}
