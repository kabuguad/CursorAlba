import { useMemo, useState } from 'react'
import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { useApiTeachers, useApiDepartments } from '../../hooks/useAdminData'
import type { ApiTeacher } from '../../services/staffApi'
import { GlassCard } from '../ui/GlassCard'
import { TeacherModal } from './TeacherSheet'
import { ScrollReveal } from '../ui/ScrollReveal'
import { cn } from '../../lib/utils'

const PAGE_SIZE = 10

export function StaffDirectory() {
  const { data: teachers = [], isLoading: loadingTeachers } = useApiTeachers()
  const { data: departments = [], isLoading: loadingDepts } = useApiDepartments()

  const [search, setSearch] = useState('')
  const [deptId, setDeptId] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<ApiTeacher | null>(null)

  const isLoading = loadingTeachers || loadingDepts

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return teachers.filter((t) => {
      const matchDept = deptId === null || t.departmentId === deptId
      const matchSearch =
        !q ||
        t.fullName.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.departmentName.toLowerCase().includes(q)
      return matchDept && matchSearch
    })
  }, [search, deptId, teachers])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1
  const start = (page - 1) * PAGE_SIZE
  const visible = filtered.slice(start, start + PAGE_SIZE)

  const changeDept = (id: number | null) => { setDeptId(id); setPage(1) }

  const DeptButtons = () => (
    <>
      <button
        onClick={() => changeDept(null)}
        className={cn(
          'rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-105',
          deptId === null ? 'bg-primary text-white' : 'glass glass-border',
        )}
      >
        All
      </button>
      {departments.map((d, i) => (
        <button
          key={`dept-${d.id}-${i}`}
          onClick={() => changeDept(d.id)}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-105',
            deptId === d.id ? 'bg-gold text-dark' : 'glass glass-border',
          )}
        >
          {d.name}
        </button>
      ))}
    </>
  )

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/50" />
          <input
            type="search"
            placeholder="Search by name, title, or department..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className={cn(
              'field border-2 py-4 pl-12 pr-4',
              'focus:border-gold focus:shadow-[0_0_20px_rgba(234,179,8,0.3)]',
            )}
          />
        </div>

        <div className="relative lg:hidden">
          <ChevronLeft className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted/30 pointer-events-none" />
          <div className="flex gap-2 overflow-x-auto px-6 scrollbar-hide">
            <DeptButtons />
          </div>
          <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted/30 pointer-events-none" />
        </div>

        <div className="hidden lg:flex flex-wrap gap-2">
          <DeptButtons />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 gap-2 text-muted">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading faculty…</span>
        </div>
      ) : (
        <>
          <p className="mb-6 text-sm text-muted">
            Showing {visible.length} of {filtered.length} staff
          </p>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visible.map((t, i) => (
              <ScrollReveal key={`t-${t.id}-${i}`} delay={(i % 5) * 0.05}>
                <GlassCard onClick={() => setSelected(t)} className="overflow-hidden p-0">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={t.profilePhoto ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(t.fullName)}&background=0d4a1f&color=E8B84B&size=400`}
                      alt={t.fullName}
                      className="h-full w-full object-cover transition duration-500 hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="font-bold text-xs">{t.fullName}</h3>
                    <p className="text-[10px] text-primary dark:text-gold">{t.title}</p>
                    <span className="mt-1 inline-block rounded-full bg-tint px-1.5 py-0.5 text-[8px] text-primary dark:bg-dark-card dark:text-gold">
                      {t.departmentName}
                    </span>
                  </div>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="py-16 text-center text-muted">No staff found matching your search.</p>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/30 bg-surface-elevated text-gold transition hover:bg-primary hover:text-white disabled:opacity-40"
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
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/30 bg-surface-elevated text-gold transition hover:bg-primary hover:text-white disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </>
      )}

      <TeacherModal open={!!selected} teacher={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
