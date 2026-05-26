import { useState } from 'react'
import { programLevels, cbcFramework, igcseFramework } from '../data/programs'
import { GlassCard } from '../components/ui/GlassCard'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { cn } from '../lib/utils'

export function Programs() {
  const [framework, setFramework] = useState<'cbc' | 'igcse'>('cbc')
  const items = framework === 'cbc' ? cbcFramework : igcseFramework

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <ScrollReveal>
        <h1 className="mb-4 text-5xl font-bold md:text-7xl">Academic Programs</h1>
        <p className="mb-12 max-w-2xl text-muted">Daycare through Senior School — dual pathway excellence.</p>
      </ScrollReveal>

      <div className="mb-12 grid gap-8 md:grid-cols-2">
        {programLevels.map((p, i) => (
          <ScrollReveal key={p.id} delay={i * 0.1}>
            <GlassCard className="overflow-hidden p-0">
              <img src={p.image} alt={p.name} className="h-48 w-full object-cover" />
              <div className="p-6">
                <span className="text-xs font-semibold text-gold">{p.ages}</span>
                <h3 className="text-2xl font-bold">{p.name}</h3>
                <p className="mt-2 text-sm text-muted">{p.description}</p>
              </div>
            </GlassCard>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal>
        <div className="mb-6 flex gap-2">
          {(['cbc', 'igcse'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFramework(f)}
              className={cn(
                'rounded-2xl px-6 py-3 font-semibold transition-all hover:scale-105',
                framework === f ? 'bg-primary text-white' : 'glass glass-border',
              )}
            >
              {f === 'cbc' ? 'CBC Framework' : 'IGCSE Framework'}
            </button>
          ))}
        </div>
        <GlassCard className="p-8">
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-gold" />
                {item}
              </li>
            ))}
          </ul>
        </GlassCard>
      </ScrollReveal>
    </div>
  )
}
