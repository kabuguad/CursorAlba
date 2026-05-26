import { fixtures, playerOfMonth } from '../data/sports'
import { GlassCard } from '../components/ui/GlassCard'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { cn } from '../lib/utils'

const statusStyles = {
  upcoming: 'bg-primary/20 text-primary dark:text-gold',
  live: 'bg-gold/30 text-dark animate-pulse',
  completed: 'bg-tint text-primary dark:bg-dark-card dark:text-gold',
}

export function Sports() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <ScrollReveal>
        <h1 className="text-5xl font-bold md:text-7xl">Sports & Athletics</h1>
      </ScrollReveal>

      <ScrollReveal className="mt-12">
        <GlassCard className="overflow-hidden p-0 md:flex">
          <img src={playerOfMonth.image} alt={playerOfMonth.name} className="h-64 w-full object-cover md:h-auto md:w-80" />
          <div className="p-8">
            <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold text-dark">Player of the Month</span>
            <h2 className="mt-4 text-3xl font-bold">{playerOfMonth.name}</h2>
            <p className="text-primary dark:text-gold">{playerOfMonth.sport} · {playerOfMonth.class}</p>
            <p className="mt-2 text-muted">{playerOfMonth.stats}</p>
          </div>
        </GlassCard>
      </ScrollReveal>

      <ScrollReveal className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">Fixtures & Results</h2>
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
      </ScrollReveal>
    </div>
  )
}
