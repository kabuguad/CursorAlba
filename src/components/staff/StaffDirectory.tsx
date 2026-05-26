import { useMemo, useState, useCallback, useRef, useEffect } from 'react'
import { Search } from 'lucide-react'
import { teachers, departments } from '../../data/teachers'
import type { Department, Teacher } from '../../data/types'
import { GlassCard } from '../ui/GlassCard'
import { TeacherSheet } from './TeacherSheet'
import { ScrollReveal } from '../ui/ScrollReveal'
import { cn } from '../../lib/utils'

const PAGE_SIZE = 20

export function StaffDirectory() {
  const [search, setSearch] = useState('')
  const [dept, setDept] = useState<Department | 'All'>('All')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Teacher | null>(null)
  const loaderRef = useRef<HTMLDivElement>(null)

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

  const visible = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = visible.length < filtered.length

  const loadMore = useCallback(() => {
    if (hasMore) setPage((p) => p + 1)
  }, [hasMore])

  useEffect(() => {
    setPage(1)
  }, [search, dept])

  useEffect(() => {
    const el = loaderRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => entries[0]?.isIntersecting && loadMore(),
      { threshold: 0.1 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [loadMore])

  return (
    <section className="px-4 py-12">
      <ScrollReveal>
        <h1 className="mb-2 text-5xl font-bold text-primary dark:text-gold md:text-6xl">
          Our Faculty
        </h1>
        <p className="mb-8 max-w-2xl text-muted">
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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((t, i) => (
          <ScrollReveal key={t.id} delay={(i % 4) * 0.05}>
            <GlassCard onClick={() => setSelected(t)} className="overflow-hidden p-0">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={t.image}
                  alt={t.name}
                  className="h-full w-full object-cover transition duration-500 hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold">{t.name}</h3>
                <p className="text-sm text-primary dark:text-gold">{t.title}</p>
                <span className="mt-2 inline-block rounded-full bg-tint px-2 py-0.5 text-xs text-primary dark:bg-dark-card dark:text-gold">
                  {t.department}
                </span>
              </div>
            </GlassCard>
          </ScrollReveal>
        ))}
      </div>

      {hasMore && (
        <div ref={loaderRef} className="py-12 text-center text-sm text-muted">
          Loading more staff...
        </div>
      )}

      <TeacherSheet teacher={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
