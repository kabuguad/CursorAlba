import { useMemo, useState } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { teachers, departments } from '../../data/teachers'
import type { Department, Teacher } from '../../data/types'
import { GlassCard } from '../ui/GlassCard'
import { TeacherModal } from './TeacherSheet'
import { ScrollReveal } from '../ui/ScrollReveal'
import { cn } from '../../lib/utils'

const PAGE_SIZE = 10

export function StaffDirectory() {
  const [search, setSearch] = useState('')
  const [dept, setDept] = useState<Department | 'All'>('All')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Teacher | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return teachers.filter((t) => {
      const matchDept = dept === 'All' || t.department === dept
      const matchSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q)
      return matchDept && matchSearch
    })
  }, [search, dept])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1
  const start = (page - 1) * PAGE_SIZE
  const visible = filtered.slice(start, start + PAGE_SIZE)

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <ScrollReveal className="mb-8 text-center">
        <h1 className="mb-2 text-5xl font-bold text-primary dark:text-gold md:text-6xl">
          Our Faculty
        </h1>
        <p className="mx-auto max-w-2xl text-muted">
          {teachers.length}+ world-class educators across every department.
        </p>
      </ScrollReveal>

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/50" />
          <input
            type="search"
            placeholder="Search by name, title, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              'field border-2 py-4 pl-12 pr-4',
              'focus:border-gold focus:shadow-[0_0_20px_rgba(234,179,8,0.3)]',
            )}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setDept('All')}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-105',
              dept === 'All' ? 'bg-primary text-white' : 'glass glass-border',
            )}
          >
            All
          </button>
          {departments.map((d) => (
            <button
              key={d}
              onClick={() => setDept(d)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-105',
                dept === d ? 'bg-gold text-dark' : 'glass glass-border',
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-6 text-sm text-muted">
        Showing {visible.length} of {filtered.length} staff
      </p>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {visible.map((t, i) => (
          <ScrollReveal key={t.id} delay={(i % 5) * 0.05}>
            <GlassCard onClick={() => setSelected(t)} className="overflow-hidden p-0">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={t.image}
                  alt={t.name}
                  className="h-full w-full object-cover transition duration-500 hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="p-2">
                <h3 className="font-bold text-xs">{t.name}</h3>
                <p className="text-[10px] text-primary dark:text-gold">{t.title}</p>
                <span className="mt-1 inline-block rounded-full bg-tint px-1.5 py-0.5 text-[8px] text-primary dark:bg-dark-card dark:text-gold">
                  {t.department}
                </span>
              </div>
            </GlassCard>
          </ScrollReveal>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/30 bg-surface-elevated text-gold transition hover:bg-primary hover:text-white disabled:opacity-40 disabled:hover:bg-surface-elevated disabled:hover:text-gold"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition',
                page === p
                  ? 'bg-primary text-white'
                  : 'border border-gold/30 bg-surface-elevated text-gold hover:bg-primary hover:text-white',
              )}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/30 bg-surface-elevated text-gold transition hover:bg-primary hover:text-white disabled:opacity-40 disabled:hover:bg-surface-elevated disabled:hover:text-gold"
            aria-label="Next page"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      <TeacherModal open={!!selected} teacher={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
