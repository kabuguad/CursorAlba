import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Edit2, Trash2, X, Check, Activity, Tag, FileText, ExternalLink } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useToast } from '../../../contexts/ToastContext'
import { cn } from '../../../lib/utils'
import {
  coCurrApi,
  coCurrApiError,
  type CoCurrPageContent,
  type CoCurrCategory,
  type CoCurrActivity,
  type CoCurrPageContentDto,
  type CoCurrCategoryDto,
  type CoCurrActivityDto,
} from '../../../services/coCurrApi'

const INP   = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'
const BTN_GOLD  = 'flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-3 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60'
const BTN_GHOST = 'flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition'

const PALETTE = [
  { color: 'from-green-500/20 to-emerald-500/10',  border: 'border-green-500/30'  },
  { color: 'from-purple-500/20 to-pink-500/10',    border: 'border-purple-500/30' },
  { color: 'from-blue-500/20 to-cyan-500/10',      border: 'border-blue-500/30'   },
  { color: 'from-amber-500/20 to-orange-500/10',   border: 'border-amber-500/30'  },
]
const palette = (sortOrder: number) => PALETTE[(sortOrder - 1) % PALETTE.length]

const INNER_TABS = [
  { id: 'content',     label: 'Page Content',  icon: FileText  },
  { id: 'categories',  label: 'Categories',    icon: Tag       },
  { id: 'activities',  label: 'Activities',    icon: Activity  },
] as const
type InnerTab = typeof INNER_TABS[number]['id']

// ── Modal ─────────────────────────────────────────────────────────────────────

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-xl rounded-2xl bg-white dark:bg-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4">
          <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body,
  )
}

// ── 1. Page Content tab ───────────────────────────────────────────────────────

function PageContentTab() {
  const qc = useQueryClient()
  const { showToast } = useToast()

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['cocurr-page-content'],
    queryFn: () => coCurrApi.getPageContent(),
    staleTime: 30_000,
  })

  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: Partial<CoCurrPageContentDto> }) => coCurrApi.updatePageContent(id, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cocurr-page-content'] }); showToast('Saved ✓'); setEditing(null) },
    onError: (err) => showToast(`Failed: ${coCurrApiError(err)}`),
  })

  const [editing, setEditing] = useState<CoCurrPageContent | null>(null)
  const [draft, setDraft] = useState<Partial<CoCurrPageContentDto>>({})

  const openEdit = (item: CoCurrPageContent) => {
    setDraft({ headline: item.headline ?? '', subheadline: item.subheadline ?? '', ctaHeadline: item.ctaHeadline ?? '', ctaSubtext: item.ctaSubtext ?? '' })
    setEditing(item)
  }
  const set = <K extends keyof CoCurrPageContentDto>(k: K, v: string) => setDraft(d => ({ ...d, [k]: v }))

  const handleSave = () => {
    if (!editing) return
    if (!draft.headline?.trim()) return showToast('Headline is required')
    updateMut.mutate({ id: editing.id, dto: draft })
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Page Content</h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Hero headline, subheadline and CTA on the public Co-Curricular page.</p>
        </div>
        <Link to="/co-curricular" target="_blank" className={BTN_GHOST}><ExternalLink className="h-3.5 w-3.5" /> View Page</Link>
      </div>

      {isLoading && <div className="h-20 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />}

      {!isLoading && items.map(item => (
        <div key={item.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white">{item.headline}</p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{item.subheadline}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {item.ctaHeadline && <span className="rounded-full bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">CTA Headline ✓</span>}
                {item.ctaSubtext  && <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">CTA Subtext ✓</span>}
              </div>
            </div>
            <button onClick={() => openEdit(item)} className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition">
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit Page Content">
        <div className="space-y-4">
          <div>
            <label className={LABEL}>Headline <span className="text-[#E8B84B]">*</span></label>
            <input className={INP} value={draft.headline ?? ''} onChange={e => set('headline', e.target.value)} autoFocus />
          </div>
          <div>
            <label className={LABEL}>Subheadline</label>
            <textarea rows={3} className={cn(INP, 'resize-none')} value={draft.subheadline ?? ''} onChange={e => set('subheadline', e.target.value)} />
          </div>
          <div>
            <label className={LABEL}>CTA Headline</label>
            <input className={INP} value={draft.ctaHeadline ?? ''} onChange={e => set('ctaHeadline', e.target.value)} />
          </div>
          <div>
            <label className={LABEL}>CTA Subtext</label>
            <textarea rows={3} className={cn(INP, 'resize-none')} value={draft.ctaSubtext ?? ''} onChange={e => set('ctaSubtext', e.target.value)} />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={handleSave} disabled={updateMut.isPending || !draft.headline?.trim()} className={BTN_GOLD}>
              <Check className="h-3.5 w-3.5" />{updateMut.isPending ? 'Saving…' : 'Save Changes'}
            </button>
            <button onClick={() => setEditing(null)} className={BTN_GHOST}><X className="h-3.5 w-3.5" /> Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ── 2. Categories tab ─────────────────────────────────────────────────────────

const BLANK_CAT: CoCurrCategoryDto = {
  icon: '🏫',
  title: '',
  heading: '',
  intro: '',
  sortOrder: 1,
  cocurrPageContentId: 1,
}

function CategoriesTab() {
  const qc = useQueryClient()
  const { showToast } = useToast()

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['cocurr-categories'],
    queryFn: () => coCurrApi.getCategories(),
    staleTime: 30_000,
  })

  const createMut = useMutation({
    mutationFn: (dto: CoCurrCategoryDto) => coCurrApi.createCategory(dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cocurr-categories'] }); showToast('Category added ✓'); closeModal() },
    onError: (err) => showToast(`Failed: ${coCurrApiError(err)}`),
  })
  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: Partial<CoCurrCategoryDto> }) => coCurrApi.updateCategory(id, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cocurr-categories'] }); showToast('Updated ✓'); closeModal() },
    onError: (err) => showToast(`Failed: ${coCurrApiError(err)}`),
  })
  const deleteMut = useMutation({
    mutationFn: (id: number) => coCurrApi.deleteCategory(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cocurr-categories'] }); qc.invalidateQueries({ queryKey: ['cocurr-activities'] }); showToast('Deleted') },
    onError: (err) => showToast(`Delete failed: ${coCurrApiError(err)}`),
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CoCurrCategory | null>(null)
  const [draft, setDraft] = useState<CoCurrCategoryDto>(BLANK_CAT)
  const [delConfirm, setDelConfirm] = useState<number | null>(null)

  const set = <K extends keyof CoCurrCategoryDto>(k: K, v: CoCurrCategoryDto[K]) => setDraft(d => ({ ...d, [k]: v }))

  const openNew = () => {
    setDraft({ ...BLANK_CAT, sortOrder: items.length + 1 })
    setEditing(null); setModalOpen(true)
  }
  const openEdit = (item: CoCurrCategory) => {
    setDraft({ icon: item.icon, title: item.title, heading: item.heading, intro: item.intro ?? '', sortOrder: item.sortOrder, cocurrPageContentId: item.cocurrPageContentId })
    setEditing(item); setModalOpen(true)
  }
  const closeModal = () => { setModalOpen(false); setEditing(null) }

  const handleSave = () => {
    if (!draft.title.trim()) return showToast('Title is required')
    if (!draft.heading.trim()) return showToast('Heading is required')
    if (editing) updateMut.mutate({ id: editing.id, dto: draft })
    else createMut.mutate(draft)
  }

  const isPending = createMut.isPending || updateMut.isPending
  const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Categories</h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">The four pillar tabs shown on the Co-Curricular overview page.</p>
        </div>
        <button onClick={openNew} className={BTN_GOLD}><Plus className="h-4 w-4" /> Add Category</button>
      </div>

      {isLoading && <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)}</div>}

      {!isLoading && items.length === 0 && (
        <button onClick={openNew} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 py-16 text-sm text-gray-400 hover:border-[#E8B84B]/50 hover:text-[#E8B84B] transition">
          <Plus className="h-5 w-5" /> Add your first category
        </button>
      )}

      <div className="space-y-3">
        {sorted.map(item => {
          const p = palette(item.sortOrder)
          return (
            <div key={item.id} className={cn('rounded-2xl border bg-gradient-to-br p-4', p.color, p.border)}>
              <div className="flex items-start gap-4">
                <span className="text-3xl w-10 text-center flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 dark:text-white">{item.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 italic line-clamp-1">{item.heading}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{item.intro}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button onClick={() => openEdit(item)} className="rounded-lg p-1.5 text-gray-500 hover:bg-white/50 dark:hover:bg-black/20 transition"><Edit2 className="h-3.5 w-3.5" /></button>
                  {delConfirm === item.id ? (
                    <div className="flex items-center gap-1">
                      <button onClick={() => { deleteMut.mutate(item.id); setDelConfirm(null) }} disabled={deleteMut.isPending} className="rounded-lg bg-red-500 px-2.5 py-1 text-xs font-bold text-white hover:bg-red-600 transition disabled:opacity-60">Delete</button>
                      <button onClick={() => setDelConfirm(null)} className="rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-white/50 transition">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setDelConfirm(item.id)} className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition"><Trash2 className="h-3.5 w-3.5" /></button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Modal open={modalOpen} onClose={closeModal} title={editing ? `Edit: ${editing.title}` : 'New Category'}>
        <div className="space-y-4">
          <div className="grid grid-cols-[72px_1fr] gap-3">
            <div>
              <label className={LABEL}>Icon</label>
              <input className={cn(INP, 'text-center')} value={draft.icon} onChange={e => set('icon', e.target.value)} placeholder="🏆" style={{ fontSize: 20 }} />
            </div>
            <div>
              <label className={LABEL}>Tab Title <span className="text-[#E8B84B]">*</span></label>
              <input className={INP} value={draft.title} onChange={e => set('title', e.target.value)} placeholder="Sports & Physical" autoFocus />
            </div>
          </div>
          <div>
            <label className={LABEL}>Section Heading <span className="text-[#E8B84B]">*</span></label>
            <input className={INP} value={draft.heading} onChange={e => set('heading', e.target.value)} placeholder="Sports & Physical Activities" />
          </div>
          <div>
            <label className={LABEL}>Intro Text</label>
            <textarea rows={4} className={cn(INP, 'resize-none')} value={draft.intro} onChange={e => set('intro', e.target.value)} placeholder="Describe this category…" />
          </div>
          <div>
            <label className={LABEL}>Sort Order</label>
            <input type="number" min={1} className={INP} value={draft.sortOrder} onChange={e => set('sortOrder', Number(e.target.value))} />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={handleSave} disabled={isPending || !draft.title.trim() || !draft.heading.trim()} className={BTN_GOLD}>
              <Check className="h-3.5 w-3.5" />{isPending ? 'Saving…' : editing ? 'Save Changes' : 'Create'}
            </button>
            <button onClick={closeModal} className={BTN_GHOST}><X className="h-3.5 w-3.5" /> Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ── 3. Activities tab ─────────────────────────────────────────────────────────

const BLANK_ACT = (catId: number, count: number): CoCurrActivityDto => ({
  icon: '⭐',
  name: '',
  description: '',
  sortOrder: count + 1,
  cocurrCategoryId: catId,
})

function ActivitiesTab() {
  const qc = useQueryClient()
  const { showToast } = useToast()

  const { data: categories = [], isLoading: catsLoading } = useQuery({
    queryKey: ['cocurr-categories'],
    queryFn: () => coCurrApi.getCategories(),
    staleTime: 30_000,
  })
  const { data: allActivities = [], isLoading: actsLoading } = useQuery({
    queryKey: ['cocurr-activities'],
    queryFn: () => coCurrApi.getActivities(),
    staleTime: 30_000,
  })

  const sortedCats = [...categories].sort((a, b) => a.sortOrder - b.sortOrder)
  const [activeCatId, setActiveCatId] = useState<number | null>(null)
  const currentCatId = activeCatId ?? sortedCats[0]?.id ?? null

  const createMut = useMutation({
    mutationFn: (dto: CoCurrActivityDto) => coCurrApi.createActivity(dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cocurr-activities'] }); showToast('Activity added ✓'); closeModal() },
    onError: (err) => showToast(`Failed: ${coCurrApiError(err)}`),
  })
  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: Partial<CoCurrActivityDto> }) => coCurrApi.updateActivity(id, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cocurr-activities'] }); showToast('Updated ✓'); closeModal() },
    onError: (err) => showToast(`Failed: ${coCurrApiError(err)}`),
  })
  const deleteMut = useMutation({
    mutationFn: (id: number) => coCurrApi.deleteActivity(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cocurr-activities'] }); showToast('Deleted') },
    onError: (err) => showToast(`Delete failed: ${coCurrApiError(err)}`),
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CoCurrActivity | null>(null)
  const [draft, setDraft] = useState<CoCurrActivityDto>({ icon: '⭐', name: '', description: '', sortOrder: 1, cocurrCategoryId: 1 })
  const [delConfirm, setDelConfirm] = useState<number | null>(null)

  const set = <K extends keyof CoCurrActivityDto>(k: K, v: CoCurrActivityDto[K]) => setDraft(d => ({ ...d, [k]: v }))

  const items = allActivities
    .filter(a => a.cocurrCategoryId === currentCatId)
    .sort((a, b) => a.sortOrder - b.sortOrder)

  const openNew = () => {
    setDraft(BLANK_ACT(currentCatId ?? sortedCats[0]?.id ?? 1, items.length))
    setEditing(null); setModalOpen(true)
  }
  const openEdit = (item: CoCurrActivity) => {
    setDraft({ icon: item.icon, name: item.name, description: item.description ?? '', sortOrder: item.sortOrder, cocurrCategoryId: item.cocurrCategoryId })
    setEditing(item); setModalOpen(true)
  }
  const closeModal = () => { setModalOpen(false); setEditing(null) }

  const handleSave = () => {
    if (!draft.name.trim()) return showToast('Activity name is required')
    if (editing) updateMut.mutate({ id: editing.id, dto: draft })
    else createMut.mutate(draft)
  }

  const isPending = createMut.isPending || updateMut.isPending
  const isLoading = catsLoading || actsLoading
  const currentCat = sortedCats.find(c => c.id === currentCatId)

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Activities</h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Individual activity cards shown under each category tab on the public page.</p>
        </div>
        <button onClick={openNew} disabled={!currentCatId} className={BTN_GOLD}><Plus className="h-4 w-4" /> Add Activity</button>
      </div>

      {/* Category filter tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {catsLoading
          ? [1,2,3,4].map(i => <div key={i} className="h-9 w-36 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />)
          : sortedCats.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCatId(cat.id)}
              className={cn(
                'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all',
                currentCatId === cat.id
                  ? 'bg-[#E8B84B] text-[#0d1b0d] shadow-sm'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#E8B84B]/50',
              )}
            >
              <span>{cat.icon}</span>
              <span>{cat.title}</span>
              <span className={cn('rounded-full px-2 py-0.5 text-xs font-bold',
                currentCatId === cat.id ? 'bg-[#0d1b0d]/20 text-[#0d1b0d]' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
              )}>
                {allActivities.filter(a => a.cocurrCategoryId === cat.id).length}
              </span>
            </button>
          ))
        }
      </div>

      {/* Context card */}
      {currentCat && (
        <div className={cn('mb-5 rounded-2xl border bg-gradient-to-br p-4', palette(currentCat.sortOrder).color, palette(currentCat.sortOrder).border)}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{currentCat.icon}</span>
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-sm">{currentCat.heading}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{items.length} activit{items.length === 1 ? 'y' : 'ies'} in this category</p>
            </div>
          </div>
        </div>
      )}

      {/* Activity list */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-gray-400">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl">{currentCat?.icon ?? '⭐'}</span>
            <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">No activities yet in {currentCat?.title}</p>
            <button onClick={openNew} className="mt-4 text-xs font-semibold text-[#E8B84B] hover:underline">Add the first one →</button>
          </div>
        ) : (
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Icon</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Description</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">Order</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                  <td className="px-4 py-3 text-2xl">{item.icon}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white whitespace-nowrap">{item.name}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 max-w-xs">
                    <p className="line-clamp-2 text-xs">{item.description}</p>
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-gray-400">{item.sortOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(item)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition">
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      {delConfirm === item.id ? (
                        <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 px-3 py-1.5">
                          <span className="text-xs text-red-600 dark:text-red-400">Delete?</span>
                          <button onClick={() => { deleteMut.mutate(item.id); setDelConfirm(null) }} disabled={deleteMut.isPending} className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline disabled:opacity-60">Yes</button>
                          <button onClick={() => setDelConfirm(null)} className="text-xs text-gray-400 hover:text-gray-600">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setDelConfirm(item.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modalOpen} onClose={closeModal} title={editing ? `Edit: ${editing.name}` : 'New Activity'}>
        <div className="space-y-4">
          <div className="grid grid-cols-[72px_1fr] gap-3">
            <div>
              <label className={LABEL}>Icon</label>
              <input className={cn(INP, 'text-center')} value={draft.icon} onChange={e => set('icon', e.target.value)} placeholder="⭐" style={{ fontSize: 20 }} />
            </div>
            <div>
              <label className={LABEL}>Name <span className="text-[#E8B84B]">*</span></label>
              <input className={INP} value={draft.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Table Tennis" autoFocus />
            </div>
          </div>
          <div>
            <label className={LABEL}>Description</label>
            <textarea rows={3} className={cn(INP, 'resize-none')} value={draft.description} onChange={e => set('description', e.target.value)} placeholder="Brief description shown on the activity card…" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Category</label>
              <select className={INP} value={draft.cocurrCategoryId} onChange={e => set('cocurrCategoryId', Number(e.target.value))}>
                {sortedCats.map(c => <option key={c.id} value={c.id}>{c.icon} {c.title}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Sort Order</label>
              <input type="number" min={1} className={INP} value={draft.sortOrder} onChange={e => set('sortOrder', Number(e.target.value))} />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={handleSave} disabled={isPending || !draft.name.trim()} className={BTN_GOLD}>
              <Check className="h-3.5 w-3.5" />{isPending ? 'Saving…' : editing ? 'Save Changes' : 'Add Activity'}
            </button>
            <button onClick={closeModal} className={BTN_GHOST}><X className="h-3.5 w-3.5" /> Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export function CoCurrManager() {
  const [tab, setTab] = useState<InnerTab>('content')

  return (
    <div className="flex flex-col h-full">
      {/* Inner tab bar */}
      <div className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 pt-4">
        <nav className="flex gap-0.5 -mb-px overflow-x-auto">
          {INNER_TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                tab === t.id
                  ? 'border-[#E8B84B] text-[#E8B84B]'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600',
              )}
            >
              <t.icon className="h-3.5 w-3.5 shrink-0" />
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {tab === 'content'    && <PageContentTab />}
        {tab === 'categories' && <CategoriesTab />}
        {tab === 'activities' && <ActivitiesTab />}
      </div>
    </div>
  )
}
