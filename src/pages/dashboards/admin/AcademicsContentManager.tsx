import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Save, Plus, Pencil, Trash2, Loader2, WifiOff, X, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  academicsApi,
  type AcademicsPageContent,
  type CbcCompetency,
  type TeachingPillar,
  type SchoolLevel,
  type CbcCompetencyCreateDto,
  type TeachingPillarCreateDto,
  type SchoolLevelCreateDto,
} from '../../../services/academicsApi'
import { LEVEL_COLOR_MAP } from '../../../lib/academicsColors'
import { useToast } from '../../../contexts/ToastContext'

const FIELD = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'
const BTN_GOLD = 'flex items-center gap-1.5 rounded-xl bg-[#E8B84B] px-4 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60'
const BTN_GHOST = 'flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition'

type Tab = 'content' | 'competencies' | 'pillars' | 'levels'
const TABS: { id: Tab; label: string }[] = [
  { id: 'content',      label: 'Page Content' },
  { id: 'levels',       label: 'School Levels' },
  { id: 'competencies', label: 'CBC Competencies' },
  { id: 'pillars',      label: 'Teaching Pillars' },
]

const COLOR_KEYS = Object.keys(LEVEL_COLOR_MAP)

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-4 text-center px-6">
      <WifiOff className="h-8 w-8 text-gray-400" />
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">{message}</p>
      <button onClick={onRetry} className={BTN_GOLD}><Loader2 className="h-3.5 w-3.5" /> Retry</button>
    </div>
  )
}

// ── Page Content ───────────────────────────────────────────────────────────
function PageContentSection({ item }: { item: AcademicsPageContent }) {
  const qc = useQueryClient()
  const { showToast } = useToast()
  const [form, setForm] = useState({
    headline:     item.headline,
    subheadline:  item.subheadline,
    ctaHeadline:  item.ctaHeadline,
    ctaSubtext:   item.ctaSubtext,
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setForm({
      headline:    item.headline,
      subheadline: item.subheadline,
      ctaHeadline: item.ctaHeadline,
      ctaSubtext:  item.ctaSubtext,
    })
  }, [item.id])

  const mut = useMutation({
    mutationFn: () => academicsApi.updatePageContent(item.id, form),
    onSuccess: (updated) => {
      qc.setQueryData<AcademicsPageContent[]>(['admin-academics-content'], (old) =>
        old ? old.map((x) => (x.id === updated.id ? updated : x)) : [updated],
      )
      // also invalidate public page cache so the public Academics page refreshes
      qc.invalidateQueries({ queryKey: ['academics-page-content'] })
      showToast('Academics page content saved ✓')
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    },
    onError: () => showToast('Failed to save — check API connection'),
  })

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#E8B84B]">Hero Text</p>
        <div>
          <label className={LABEL}>Headline</label>
          <input className={FIELD} value={form.headline} onChange={(e) => set('headline', e.target.value)} placeholder="Programs & Academics" />
        </div>
        <div>
          <label className={LABEL}>Subheadline</label>
          <textarea rows={3} className={FIELD} value={form.subheadline} onChange={(e) => set('subheadline', e.target.value)} />
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#E8B84B]">CTA Section</p>
        <div>
          <label className={LABEL}>CTA Headline</label>
          <input className={FIELD} value={form.ctaHeadline} onChange={(e) => set('ctaHeadline', e.target.value)} placeholder="Ready to Enrol?" />
        </div>
        <div>
          <label className={LABEL}>CTA Subtext</label>
          <textarea rows={2} className={FIELD} value={form.ctaSubtext} onChange={(e) => set('ctaSubtext', e.target.value)} />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button onClick={() => mut.mutate()} disabled={mut.isPending} className={BTN_GOLD}>
          {mut.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          {mut.isPending ? 'Saving…' : 'Save Changes'}
        </button>
        {saved && <span className="text-xs text-green-600 dark:text-green-400 font-medium">Saved ✓</span>}
      </div>
    </div>
  )
}

// ── CBC Competencies ────────────────────────────────────────────────────────
const BLANK_COMPETENCY: CbcCompetencyCreateDto = {
  icon: '', title: '', description: '', isFeatured: false, sortOrder: 1,
}

function CompetenciesSection() {
  const qc = useQueryClient()
  const { showToast } = useToast()
  const [modal, setModal] = useState<{ open: boolean; editing: CbcCompetency | null }>({ open: false, editing: null })
  const [draft, setDraft] = useState<CbcCompetencyCreateDto>(BLANK_COMPETENCY)
  const [delId, setDelId] = useState<number | null>(null)

  const { data: items = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-academics-competencies'],
    queryFn: academicsApi.getCompetencies,
    staleTime: 30_000,
  })

  const invalidateCompetencies = () => {
    qc.invalidateQueries({ queryKey: ['admin-academics-competencies'] })
    qc.invalidateQueries({ queryKey: ['cbc-competencies'] })
  }

  const createMut = useMutation({
    mutationFn: (dto: CbcCompetencyCreateDto) => academicsApi.createCompetency(dto),
    onSuccess: () => { invalidateCompetencies(); showToast('Competency added ✓'); setModal({ open: false, editing: null }) },
    onError: () => showToast('Failed to create competency'),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: CbcCompetencyCreateDto }) => academicsApi.updateCompetency(id, dto),
    onSuccess: () => { invalidateCompetencies(); showToast('Competency updated ✓'); setModal({ open: false, editing: null }) },
    onError: () => showToast('Failed to update competency'),
  })

  const deleteMut = useMutation({
    mutationFn: (id: number) => academicsApi.deleteCompetency(id),
    onSuccess: () => { invalidateCompetencies(); showToast('Deleted'); setDelId(null) },
    onError: () => showToast('Failed to delete'),
  })

  const openNew = () => { setDraft({ ...BLANK_COMPETENCY, sortOrder: items.length + 1 }); setModal({ open: true, editing: null }) }
  const openEdit = (item: CbcCompetency) => {
    setDraft({ icon: item.icon, title: item.title, description: item.description, isFeatured: item.isFeatured, sortOrder: item.sortOrder })
    setModal({ open: true, editing: item })
  }
  const save = () => {
    if (!draft.title.trim()) return showToast('Title is required')
    if (modal.editing) updateMut.mutate({ id: modal.editing.id, dto: draft })
    else createMut.mutate(draft)
  }

  const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder)

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-gray-400" /></div>
  if (isError) return <ErrorState message="Could not load competencies." onRetry={refetch} />

  return (
    <div className="space-y-3 max-w-2xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{items.length} competenc{items.length !== 1 ? 'ies' : 'y'}</p>
        <button onClick={openNew} className={BTN_GOLD}><Plus className="h-3.5 w-3.5" /> Add Competency</button>
      </div>

      {sorted.map((item) => (
        <div key={item.id} className="flex items-start gap-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3">
          <span className="text-2xl shrink-0 mt-0.5">{item.icon || '📚'}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</p>
              {item.isFeatured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                  <Star className="h-2.5 w-2.5" /> Featured
                </span>
              )}
              <span className="text-xs text-gray-400">#{item.sortOrder}</span>
            </div>
            {item.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{item.description}</p>}
          </div>
          <div className="flex gap-1 shrink-0">
            <button onClick={() => openEdit(item)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition"><Pencil className="h-3.5 w-3.5" /></button>
            {delId === item.id ? (
              <div className="flex items-center gap-1 rounded-lg bg-red-50 dark:bg-red-900/20 px-2 py-1">
                <span className="text-xs text-red-600 dark:text-red-400">Delete?</span>
                <button onClick={() => deleteMut.mutate(item.id)} className="text-xs font-bold text-red-600 hover:underline">Yes</button>
                <button onClick={() => setDelId(null)} className="text-xs text-gray-400 hover:text-gray-600">No</button>
              </div>
            ) : (
              <button onClick={() => setDelId(item.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition"><Trash2 className="h-3.5 w-3.5" /></button>
            )}
          </div>
        </div>
      ))}

      {items.length === 0 && (
        <button onClick={openNew} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 py-10 text-sm text-gray-400 hover:border-[#E8B84B]/50 hover:text-[#E8B84B] transition">
          <Plus className="h-4 w-4" /> Add your first competency
        </button>
      )}

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setModal({ open: false, editing: null })}>
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4 shrink-0">
              <h3 className="font-bold text-gray-900 dark:text-white">{modal.editing ? 'Edit Competency' : 'New Competency'}</h3>
              <button onClick={() => setModal({ open: false, editing: null })} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-4 w-4" /></button>
            </div>
            <div className="overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>Icon (emoji)</label>
                  <input className={FIELD} value={draft.icon} onChange={(e) => setDraft((d) => ({ ...d, icon: e.target.value }))} placeholder="🎯" autoFocus />
                </div>
                <div>
                  <label className={LABEL}>Sort Order</label>
                  <input type="number" min={1} className={FIELD} value={draft.sortOrder} onChange={(e) => setDraft((d) => ({ ...d, sortOrder: Number(e.target.value) }))} />
                </div>
              </div>
              <div>
                <label className={LABEL}>Title *</label>
                <input className={FIELD} value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} placeholder="Critical Thinking" />
              </div>
              <div>
                <label className={LABEL}>Description</label>
                <textarea rows={3} className={FIELD} value={draft.description} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  className={`relative h-5 w-9 rounded-full transition ${draft.isFeatured ? 'bg-[#E8B84B]' : 'bg-gray-300 dark:bg-gray-600'}`}
                  onClick={() => setDraft((d) => ({ ...d, isFeatured: !d.isFeatured }))}
                >
                  <div className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${draft.isFeatured ? 'translate-x-4' : ''}`} />
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Featured</span>
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setModal({ open: false, editing: null })} className={BTN_GHOST}>Cancel</button>
                <button onClick={save} disabled={createMut.isPending || updateMut.isPending} className={BTN_GOLD}>
                  {(createMut.isPending || updateMut.isPending) ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Teaching Pillars ────────────────────────────────────────────────────────
const BLANK_PILLAR: TeachingPillarCreateDto = {
  icon: '', title: '', description: '', gradient: 'from-amber-500 to-orange-600', sortOrder: 1,
}

function PillarsSection() {
  const qc = useQueryClient()
  const { showToast } = useToast()
  const [modal, setModal] = useState<{ open: boolean; editing: TeachingPillar | null }>({ open: false, editing: null })
  const [draft, setDraft] = useState<TeachingPillarCreateDto>(BLANK_PILLAR)
  const [delId, setDelId] = useState<number | null>(null)

  const { data: items = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-academics-pillars'],
    queryFn: academicsApi.getPillars,
    staleTime: 30_000,
  })

  const invalidatePillars = () => {
    qc.invalidateQueries({ queryKey: ['admin-academics-pillars'] })
    qc.invalidateQueries({ queryKey: ['teaching-pillars'] })
  }

  const createMut = useMutation({
    mutationFn: (dto: TeachingPillarCreateDto) => academicsApi.createPillar(dto),
    onSuccess: () => { invalidatePillars(); showToast('Pillar added ✓'); setModal({ open: false, editing: null }) },
    onError: () => showToast('Failed to create pillar'),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: TeachingPillarCreateDto }) => academicsApi.updatePillar(id, dto),
    onSuccess: () => { invalidatePillars(); showToast('Pillar updated ✓'); setModal({ open: false, editing: null }) },
    onError: () => showToast('Failed to update pillar'),
  })

  const deleteMut = useMutation({
    mutationFn: (id: number) => academicsApi.deletePillar(id),
    onSuccess: () => { invalidatePillars(); showToast('Deleted'); setDelId(null) },
    onError: () => showToast('Failed to delete'),
  })

  const openNew = () => { setDraft({ ...BLANK_PILLAR, sortOrder: items.length + 1 }); setModal({ open: true, editing: null }) }
  const openEdit = (item: TeachingPillar) => {
    setDraft({ icon: item.icon, title: item.title, description: item.description, gradient: item.gradient, sortOrder: item.sortOrder })
    setModal({ open: true, editing: item })
  }
  const save = () => {
    if (!draft.title.trim()) return showToast('Title is required')
    if (modal.editing) updateMut.mutate({ id: modal.editing.id, dto: draft })
    else createMut.mutate(draft)
  }

  const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder)

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-gray-400" /></div>
  if (isError) return <ErrorState message="Could not load teaching pillars." onRetry={refetch} />

  return (
    <div className="space-y-3 max-w-2xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{items.length} pillar{items.length !== 1 ? 's' : ''}</p>
        <button onClick={openNew} className={BTN_GOLD}><Plus className="h-3.5 w-3.5" /> Add Pillar</button>
      </div>

      {sorted.map((item) => (
        <div key={item.id} className="flex items-start gap-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3">
          <span className="text-2xl shrink-0 mt-0.5">{item.icon || '🏛️'}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</p>
              <span className="text-xs text-gray-400">#{item.sortOrder}</span>
            </div>
            {item.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{item.description}</p>}
            {item.gradient && <p className="mt-1 font-mono text-[10px] text-gray-400 truncate">{item.gradient}</p>}
          </div>
          <div className="flex gap-1 shrink-0">
            <button onClick={() => openEdit(item)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition"><Pencil className="h-3.5 w-3.5" /></button>
            {delId === item.id ? (
              <div className="flex items-center gap-1 rounded-lg bg-red-50 dark:bg-red-900/20 px-2 py-1">
                <span className="text-xs text-red-600 dark:text-red-400">Delete?</span>
                <button onClick={() => deleteMut.mutate(item.id)} className="text-xs font-bold text-red-600 hover:underline">Yes</button>
                <button onClick={() => setDelId(null)} className="text-xs text-gray-400 hover:text-gray-600">No</button>
              </div>
            ) : (
              <button onClick={() => setDelId(item.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition"><Trash2 className="h-3.5 w-3.5" /></button>
            )}
          </div>
        </div>
      ))}

      {items.length === 0 && (
        <button onClick={openNew} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 py-10 text-sm text-gray-400 hover:border-[#E8B84B]/50 hover:text-[#E8B84B] transition">
          <Plus className="h-4 w-4" /> Add your first pillar
        </button>
      )}

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setModal({ open: false, editing: null })}>
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4 shrink-0">
              <h3 className="font-bold text-gray-900 dark:text-white">{modal.editing ? 'Edit Pillar' : 'New Pillar'}</h3>
              <button onClick={() => setModal({ open: false, editing: null })} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-4 w-4" /></button>
            </div>
            <div className="overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>Icon (emoji)</label>
                  <input className={FIELD} value={draft.icon} onChange={(e) => setDraft((d) => ({ ...d, icon: e.target.value }))} placeholder="📖" autoFocus />
                </div>
                <div>
                  <label className={LABEL}>Sort Order</label>
                  <input type="number" min={1} className={FIELD} value={draft.sortOrder} onChange={(e) => setDraft((d) => ({ ...d, sortOrder: Number(e.target.value) }))} />
                </div>
              </div>
              <div>
                <label className={LABEL}>Title *</label>
                <input className={FIELD} value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} placeholder="Inquiry-Based Learning" />
              </div>
              <div>
                <label className={LABEL}>Description</label>
                <textarea rows={3} className={FIELD} value={draft.description} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
              </div>
              <div>
                <label className={LABEL}>Gradient (Tailwind classes)</label>
                <input className={FIELD + ' font-mono text-xs'} value={draft.gradient} onChange={(e) => setDraft((d) => ({ ...d, gradient: e.target.value }))} placeholder="from-amber-500 to-orange-600" />
                <p className="mt-1 text-[11px] text-gray-400">e.g. from-blue-500 to-indigo-600</p>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setModal({ open: false, editing: null })} className={BTN_GHOST}>Cancel</button>
                <button onClick={save} disabled={createMut.isPending || updateMut.isPending} className={BTN_GOLD}>
                  {(createMut.isPending || updateMut.isPending) ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── School Levels ───────────────────────────────────────────────────────────
const BLANK_LEVEL: SchoolLevelCreateDto = {
  slug: '', name: '', ages: '', icon: '', colorKey: 'blue', description: '', highlights: '', sortOrder: 1,
}

function SchoolLevelsSection() {
  const qc = useQueryClient()
  const { showToast } = useToast()
  const [modal, setModal] = useState<{ open: boolean; editing: SchoolLevel | null }>({ open: false, editing: null })
  const [draft, setDraft] = useState<SchoolLevelCreateDto>(BLANK_LEVEL)
  const [delId, setDelId] = useState<number | null>(null)

  const { data: items = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-academics-levels'],
    queryFn: academicsApi.getSchoolLevels,
    staleTime: 30_000,
  })

  const invalidateLevels = () => {
    qc.invalidateQueries({ queryKey: ['admin-academics-levels'] })
    qc.invalidateQueries({ queryKey: ['school-levels'] })
  }

  const createMut = useMutation({
    mutationFn: (dto: SchoolLevelCreateDto) => academicsApi.createSchoolLevel(dto),
    onSuccess: () => { invalidateLevels(); showToast('Level added ✓'); setModal({ open: false, editing: null }) },
    onError: () => showToast('Failed to create level'),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: SchoolLevelCreateDto }) => academicsApi.updateSchoolLevel(id, dto),
    onSuccess: () => { invalidateLevels(); showToast('Level updated ✓'); setModal({ open: false, editing: null }) },
    onError: () => showToast('Failed to update level'),
  })

  const deleteMut = useMutation({
    mutationFn: (id: number) => academicsApi.deleteSchoolLevel(id),
    onSuccess: () => { invalidateLevels(); showToast('Deleted'); setDelId(null) },
    onError: () => showToast('Failed to delete'),
  })

  const openNew = () => { setDraft({ ...BLANK_LEVEL, sortOrder: items.length + 1 }); setModal({ open: true, editing: null }) }
  const openEdit = (item: SchoolLevel) => {
    setDraft({ slug: item.slug, name: item.name, ages: item.ages, icon: item.icon, colorKey: item.colorKey, description: item.description, highlights: item.highlights, sortOrder: item.sortOrder })
    setModal({ open: true, editing: item })
  }
  const save = () => {
    if (!draft.name.trim()) return showToast('Name is required')
    if (!draft.slug.trim()) return showToast('Slug is required')
    if (modal.editing) updateMut.mutate({ id: modal.editing.id, dto: draft })
    else createMut.mutate(draft)
  }

  const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder)

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-gray-400" /></div>
  if (isError) return <ErrorState message="Could not load school levels." onRetry={refetch} />

  return (
    <div className="space-y-3 max-w-2xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{items.length} level{items.length !== 1 ? 's' : ''}</p>
        <button onClick={openNew} className={BTN_GOLD}><Plus className="h-3.5 w-3.5" /> Add Level</button>
      </div>

      {sorted.map((item) => {
        const colors = LEVEL_COLOR_MAP[item.colorKey] ?? LEVEL_COLOR_MAP['blue']
        return (
          <div key={item.id} className={`flex items-start gap-3 rounded-2xl border bg-gradient-to-br px-4 py-3 ${colors.color} ${colors.border}`}>
            <span className="text-2xl shrink-0 mt-0.5">{item.icon || '🏫'}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</p>
                <span className="rounded-full bg-black/10 dark:bg-white/10 px-2 py-0.5 font-mono text-[10px]">{item.slug}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{item.ages}</span>
                <span className="text-xs text-gray-400">#{item.sortOrder}</span>
              </div>
              {item.description && <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 line-clamp-1">{item.description}</p>}
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => openEdit(item)} className="rounded-lg p-1.5 text-gray-500 hover:bg-white/40 dark:hover:bg-white/10 transition"><Pencil className="h-3.5 w-3.5" /></button>
              {delId === item.id ? (
                <div className="flex items-center gap-1 rounded-lg bg-red-50 dark:bg-red-900/20 px-2 py-1">
                  <span className="text-xs text-red-600 dark:text-red-400">Delete?</span>
                  <button onClick={() => deleteMut.mutate(item.id)} className="text-xs font-bold text-red-600 hover:underline">Yes</button>
                  <button onClick={() => setDelId(null)} className="text-xs text-gray-400 hover:text-gray-600">No</button>
                </div>
              ) : (
                <button onClick={() => setDelId(item.id)} className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition"><Trash2 className="h-3.5 w-3.5" /></button>
              )}
            </div>
          </div>
        )
      })}

      {items.length === 0 && (
        <button onClick={openNew} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 py-10 text-sm text-gray-400 hover:border-[#E8B84B]/50 hover:text-[#E8B84B] transition">
          <Plus className="h-4 w-4" /> Add your first school level
        </button>
      )}

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setModal({ open: false, editing: null })}>
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4 shrink-0">
              <h3 className="font-bold text-gray-900 dark:text-white">{modal.editing ? 'Edit School Level' : 'New School Level'}</h3>
              <button onClick={() => setModal({ open: false, editing: null })} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-4 w-4" /></button>
            </div>
            <div className="overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>Icon (emoji)</label>
                  <input className={FIELD} value={draft.icon} onChange={(e) => setDraft((d) => ({ ...d, icon: e.target.value }))} placeholder="🏫" autoFocus />
                </div>
                <div>
                  <label className={LABEL}>Sort Order</label>
                  <input type="number" min={1} className={FIELD} value={draft.sortOrder} onChange={(e) => setDraft((d) => ({ ...d, sortOrder: Number(e.target.value) }))} />
                </div>
              </div>
              <div>
                <label className={LABEL}>Name *</label>
                <input className={FIELD} value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} placeholder="Junior School" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>Slug *</label>
                  <input className={FIELD + ' font-mono text-xs'} value={draft.slug} onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))} placeholder="junior-school" />
                  <p className="mt-1 text-[11px] text-gray-400">URL-safe identifier, lowercase with hyphens</p>
                </div>
                <div>
                  <label className={LABEL}>Age Range</label>
                  <input className={FIELD} value={draft.ages} onChange={(e) => setDraft((d) => ({ ...d, ages: e.target.value }))} placeholder="Ages 10–13" />
                </div>
              </div>
              <div>
                <label className={LABEL}>Color Key</label>
                <select className={FIELD} value={draft.colorKey} onChange={(e) => setDraft((d) => ({ ...d, colorKey: e.target.value }))}>
                  {COLOR_KEYS.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={LABEL}>Description</label>
                <textarea rows={3} className={FIELD} value={draft.description} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
              </div>
              <div>
                <label className={LABEL}>Highlights (one per line)</label>
                <textarea rows={4} className={FIELD + ' font-mono text-xs'} value={draft.highlights} onChange={(e) => setDraft((d) => ({ ...d, highlights: e.target.value }))} placeholder="CBC curriculum&#10;English & Swahili medium&#10;Weekly clubs & societies" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setModal({ open: false, editing: null })} className={BTN_GHOST}>Cancel</button>
                <button onClick={save} disabled={createMut.isPending || updateMut.isPending} className={BTN_GOLD}>
                  {(createMut.isPending || updateMut.isPending) ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────
export function AcademicsContentManager() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('content')

  const { data: contentList = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-academics-content'],
    queryFn: academicsApi.getPageContent,
    staleTime: 30_000,
  })

  const content = contentList[0] ?? null

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/admin/site-content')}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Site Content
          </button>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <div>
            <h1 className="text-sm font-bold text-gray-900 dark:text-white">Academics</h1>
            <p className="text-[11px] text-gray-400 font-mono">/academics</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6">
        <div className="mx-auto max-w-4xl flex gap-0 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition whitespace-nowrap ${
                tab === t.id
                  ? 'border-[#E8B84B] text-[#E8B84B]'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl p-6 lg:p-8">
        {tab === 'content' && (
          isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-gray-400" /></div>
          ) : isError || !content ? (
            <ErrorState message="Could not load page content." onRetry={refetch} />
          ) : (
            <PageContentSection item={content} />
          )
        )}
        {tab === 'levels'       && <SchoolLevelsSection />}
        {tab === 'competencies' && <CompetenciesSection />}
        {tab === 'pillars'      && <PillarsSection />}
      </div>
    </div>
  )
}
