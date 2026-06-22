import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Edit2, Trash2, X, Check, Star } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '../../../contexts/ToastContext'
import { contentService } from '../../../services/contentService'
import type { DramaPlay, DramaFaculty, DramaScheduleSlot } from '../../../services/contentService'
import { unwrap } from '../../../services/mockApi'
import { coCurrApi, coCurrApiError } from '../../../services/coCurrApi'
import type { CoCurrActivity, CoCurrActivityDto } from '../../../services/coCurrApi'
import { cn } from '../../../lib/utils'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'
const BTN_GOLD = 'flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-3 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60'

type Tab = 'styles' | 'productions' | 'faculty' | 'schedule'
const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'styles',      label: 'Dance Styles',   icon: '💃' },
  { id: 'productions', label: 'Productions',    icon: '🎭' },
  { id: 'faculty',     label: 'Faculty',        icon: '👩‍🎨' },
  { id: 'schedule',    label: 'Schedule',       icon: '📅' },
]

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body,
  )
}

// ── Dance Styles Panel (real API) ─────────────────────────────────────────────

function DanceStylesPanel() {
  const { showToast } = useToast()
  const qc = useQueryClient()
  const [editing, setEditing] = useState<CoCurrActivity | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [draft, setDraft] = useState<CoCurrActivityDto>({ icon: '💃', name: '', description: '', sortOrder: 1, cocurrCategoryId: 0 })
  const [delConfirm, setDelConfirm] = useState<number | null>(null)

  const { data: categories = [] } = useQuery({
    queryKey: ['cocurr-categories'],
    queryFn: () => coCurrApi.getCategories(),
    staleTime: 60_000,
  })
  const dramaCategory = categories.find(c =>
    c.title.toLowerCase().includes('drama') || c.heading.toLowerCase().includes('drama') ||
    c.title.toLowerCase().includes('dance') || c.heading.toLowerCase().includes('dance'),
  )

  const { data: allActivities = [], isLoading } = useQuery({
    queryKey: ['cocurr-activities'],
    queryFn: () => coCurrApi.getActivities(),
    staleTime: 30_000,
  })
  const items = dramaCategory
    ? [...allActivities].filter(a => a.cocurrCategoryId === dramaCategory.id).sort((a, b) => a.sortOrder - b.sortOrder)
    : []

  const createMut = useMutation({
    mutationFn: (dto: CoCurrActivityDto) => coCurrApi.createActivity(dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cocurr-activities'] }); showToast('Dance style added ✓'); closeForm() },
    onError: (err) => showToast(`Failed: ${coCurrApiError(err)}`),
  })
  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: Partial<CoCurrActivityDto> }) => coCurrApi.updateActivity(id, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cocurr-activities'] }); showToast('Dance style updated ✓'); closeForm() },
    onError: (err) => showToast(`Failed: ${coCurrApiError(err)}`),
  })
  const deleteMut = useMutation({
    mutationFn: (id: number) => coCurrApi.deleteActivity(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cocurr-activities'] }); showToast('Dance style deleted'); setDelConfirm(null) },
    onError: (err) => showToast(`Delete failed: ${coCurrApiError(err)}`),
  })

  const openNew = () => {
    setDraft({ icon: '💃', name: '', description: '', sortOrder: items.length + 1, cocurrCategoryId: dramaCategory?.id ?? 0 })
    setIsNew(true); setEditing(null)
  }
  const openEdit = (d: CoCurrActivity) => {
    setDraft({ icon: d.icon, name: d.name, description: d.description, sortOrder: d.sortOrder, cocurrCategoryId: d.cocurrCategoryId })
    setEditing(d); setIsNew(false)
  }
  const closeForm = () => { setEditing(null); setIsNew(false) }
  const handleSave = () => {
    if (!draft.name.trim()) return
    if (!dramaCategory) return showToast('Drama & Dance category not found in API. Add it via Co-Curricular manager first.')
    if (isNew) createMut.mutate({ ...draft, cocurrCategoryId: dramaCategory.id })
    else if (editing) updateMut.mutate({ id: editing.id, dto: draft })
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">Dance styles shown as feature cards on the Drama & Dance page.</p>
        <button onClick={openNew} disabled={!dramaCategory} className={BTN_GOLD}><Plus className="h-4 w-4" /> Add Style</button>
      </div>
      {!dramaCategory && !isLoading && (
        <div className="mb-4 rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-4 py-3 text-xs text-amber-700 dark:text-amber-400">
          No "Drama & Dance" category found. Create one in the Co-Curricular manager first, then come back here to add styles.
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-36 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)
          : items.length === 0
            ? (
              <div className="col-span-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-10 text-center text-sm text-gray-400">
                No dance styles yet.
              </div>
            )
            : items.map(d => (
              <div key={d.id} className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 text-center">
                <span className="mb-3 block text-5xl">{d.icon}</span>
                <p className="font-bold text-gray-900 dark:text-white">{d.name}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-3">{d.description}</p>
                <div className="absolute top-3 right-3 flex gap-1">
                  <button onClick={() => openEdit(d)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition"><Edit2 className="h-3.5 w-3.5" /></button>
                  {delConfirm === d.id ? (
                    <div className="absolute right-0 top-8 z-10 flex items-center gap-2 rounded-lg bg-white dark:bg-gray-800 border border-red-200 dark:border-red-500/30 shadow-lg px-3 py-2">
                      <span className="text-xs text-red-600 dark:text-red-400">Delete?</span>
                      <button onClick={() => deleteMut.mutate(d.id)} className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline">Yes</button>
                      <button onClick={() => setDelConfirm(null)} className="text-xs text-gray-400">No</button>
                    </div>
                  ) : (
                    <button onClick={() => setDelConfirm(d.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition"><Trash2 className="h-3.5 w-3.5" /></button>
                  )}
                </div>
              </div>
            ))
        }
      </div>
      <Modal open={isNew || !!editing} onClose={closeForm} title={isNew ? 'Add Dance Style' : 'Edit Dance Style'}>
        <div className="space-y-4">
          <div className="grid grid-cols-[72px_1fr] gap-3">
            <div>
              <label className={LABEL}>Icon</label>
              <input className={INP + ' text-center text-xl'} value={draft.icon} onChange={e => setDraft(d => ({ ...d, icon: e.target.value }))} />
            </div>
            <div>
              <label className={LABEL}>Style Name <span className="text-[#E8B84B]">*</span></label>
              <input className={INP} value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} placeholder="e.g. Salsa" autoFocus />
            </div>
          </div>
          <div>
            <label className={LABEL}>Description</label>
            <textarea rows={3} className={INP + ' resize-none'} value={draft.description} onChange={e => setDraft(d => ({ ...d, description: e.target.value }))} placeholder="Brief description of the style…" />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            <button onClick={closeForm} className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
            <button onClick={handleSave} disabled={!draft.name.trim() || createMut.isPending || updateMut.isPending} className="flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-4 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60">
              <Check className="h-4 w-4" />{createMut.isPending || updateMut.isPending ? 'Saving…' : isNew ? 'Add Style' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

// ── Productions Panel ─────────────────────────────────────────────────────────
type PlayDraft = Omit<DramaPlay, 'id'>

function ProductionsPanel() {
  const { showToast } = useToast()
  const qc = useQueryClient()
  const [editing, setEditing] = useState<DramaPlay | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [draft, setDraft] = useState<PlayDraft>({ year: String(new Date().getFullYear()), title: '', desc: '', img: '', sortOrder: 1 })
  const [delConfirm, setDelConfirm] = useState<string | null>(null)

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-drama-plays'],
    queryFn: () => contentService.listDramaPlays().then(unwrap),
    staleTime: 30_000,
  })

  const createMut = useMutation({
    mutationFn: (dto: PlayDraft) => contentService.createDramaPlay(dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-drama-plays'] }); qc.invalidateQueries({ queryKey: ['drama-plays'] }); showToast('Production added ✓'); closeForm() },
  })
  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<PlayDraft> }) => contentService.updateDramaPlay(id, dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-drama-plays'] }); qc.invalidateQueries({ queryKey: ['drama-plays'] }); showToast('Production updated ✓'); closeForm() },
  })
  const deleteMut = useMutation({
    mutationFn: (id: string) => contentService.deleteDramaPlay(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-drama-plays'] }); qc.invalidateQueries({ queryKey: ['drama-plays'] }); showToast('Production deleted'); setDelConfirm(null) },
  })

  const openNew = () => { setDraft({ year: String(new Date().getFullYear()), title: '', desc: '', img: '', sortOrder: items.length + 1 }); setIsNew(true); setEditing(null) }
  const openEdit = (p: DramaPlay) => { setDraft({ year: p.year, title: p.title, desc: p.desc, img: p.img, sortOrder: p.sortOrder }); setEditing(p); setIsNew(false) }
  const closeForm = () => { setEditing(null); setIsNew(false) }
  const handleSave = () => {
    if (!draft.title.trim()) return
    if (isNew) createMut.mutate(draft)
    else if (editing) updateMut.mutate({ id: editing.id, dto: draft })
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">Annual productions shown in the Play Archives gallery.</p>
        <button onClick={openNew} className={BTN_GOLD}><Plus className="h-4 w-4" /> Add Production</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-64 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)
          : items.length === 0
            ? (
              <div className="col-span-3 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-10 text-center text-sm text-gray-400">
                No productions yet.
              </div>
            )
            : items.map(p => (
              <div key={p.id} className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                {p.img
                  ? <img src={p.img} alt={p.title} className="h-40 w-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  : <div className="h-40 w-full bg-gradient-to-br from-purple-500/20 to-pink-500/10 flex items-center justify-center text-5xl">🎭</div>
                }
                <div className="absolute top-3 left-3">
                  <span className="rounded-full bg-[#E8B84B] px-2.5 py-1 text-xs font-bold text-[#0d1b0d]">{p.year}</span>
                </div>
                <div className="p-4">
                  <p className="font-bold text-gray-900 dark:text-white">"{p.title}"</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-3">{p.desc}</p>
                </div>
                <div className="absolute top-3 right-3 flex gap-1">
                  <button onClick={() => openEdit(p)} className="rounded-lg p-1.5 bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition shadow-sm"><Edit2 className="h-3.5 w-3.5" /></button>
                  {delConfirm === p.id ? (
                    <div className="absolute right-0 top-8 z-10 flex items-center gap-2 rounded-lg bg-white dark:bg-gray-800 border border-red-200 dark:border-red-500/30 shadow-lg px-3 py-2">
                      <span className="text-xs text-red-600 dark:text-red-400">Delete?</span>
                      <button onClick={() => deleteMut.mutate(p.id)} className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline">Yes</button>
                      <button onClick={() => setDelConfirm(null)} className="text-xs text-gray-400">No</button>
                    </div>
                  ) : (
                    <button onClick={() => setDelConfirm(p.id)} className="rounded-lg p-1.5 bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-500/20 hover:text-red-500 transition shadow-sm"><Trash2 className="h-3.5 w-3.5" /></button>
                  )}
                </div>
              </div>
            ))
        }
      </div>
      <Modal open={isNew || !!editing} onClose={closeForm} title={isNew ? 'Add Production' : 'Edit Production'}>
        <div className="space-y-4">
          <div className="grid grid-cols-[100px_1fr] gap-3">
            <div>
              <label className={LABEL}>Year <span className="text-[#E8B84B]">*</span></label>
              <input className={INP} value={draft.year} onChange={e => setDraft(d => ({ ...d, year: e.target.value }))} placeholder="2025" autoFocus />
            </div>
            <div>
              <label className={LABEL}>Production Title <span className="text-[#E8B84B]">*</span></label>
              <input className={INP} value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} placeholder="e.g. The Lion's Roar" />
            </div>
          </div>
          <div>
            <label className={LABEL}>Description</label>
            <textarea rows={3} className={INP + ' resize-none'} value={draft.desc} onChange={e => setDraft(d => ({ ...d, desc: e.target.value }))} placeholder="Synopsis, cast size, awards received…" />
          </div>
          <div>
            <label className={LABEL}>Cover Image URL</label>
            <input type="url" className={INP} value={draft.img} onChange={e => setDraft(d => ({ ...d, img: e.target.value }))} placeholder="https://example.com/poster.jpg" />
            {draft.img && <img src={draft.img} alt="preview" className="mt-2 h-28 w-full rounded-xl object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            <button onClick={closeForm} className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
            <button onClick={handleSave} disabled={!draft.title.trim() || createMut.isPending || updateMut.isPending} className="flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-4 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60">
              <Check className="h-4 w-4" />{createMut.isPending || updateMut.isPending ? 'Saving…' : isNew ? 'Add Production' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

// ── Faculty Panel ─────────────────────────────────────────────────────────────
type FacultyDraft = Omit<DramaFaculty, 'id'>

function FacultyPanel() {
  const { showToast } = useToast()
  const qc = useQueryClient()
  const [editing, setEditing] = useState<DramaFaculty | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [draft, setDraft] = useState<FacultyDraft>({ name: '', role: '', img: '', bio: '', sortOrder: 1 })
  const [delConfirm, setDelConfirm] = useState<string | null>(null)

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-drama-faculty'],
    queryFn: () => contentService.listDramaFaculty().then(unwrap),
    staleTime: 30_000,
  })

  const createMut = useMutation({
    mutationFn: (dto: FacultyDraft) => contentService.createDramaFaculty(dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-drama-faculty'] }); qc.invalidateQueries({ queryKey: ['drama-faculty'] }); showToast('Faculty added ✓'); closeForm() },
  })
  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<FacultyDraft> }) => contentService.updateDramaFaculty(id, dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-drama-faculty'] }); qc.invalidateQueries({ queryKey: ['drama-faculty'] }); showToast('Faculty updated ✓'); closeForm() },
  })
  const deleteMut = useMutation({
    mutationFn: (id: string) => contentService.deleteDramaFaculty(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-drama-faculty'] }); qc.invalidateQueries({ queryKey: ['drama-faculty'] }); showToast('Faculty deleted'); setDelConfirm(null) },
  })

  const openNew = () => { setDraft({ name: '', role: '', img: '', bio: '', sortOrder: items.length + 1 }); setIsNew(true); setEditing(null) }
  const openEdit = (f: DramaFaculty) => { setDraft({ name: f.name, role: f.role, img: f.img, bio: f.bio, sortOrder: f.sortOrder }); setEditing(f); setIsNew(false) }
  const closeForm = () => { setEditing(null); setIsNew(false) }
  const handleSave = () => {
    if (!draft.name.trim()) return
    if (isNew) createMut.mutate(draft)
    else if (editing) updateMut.mutate({ id: editing.id, dto: draft })
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">Choreographers and directors shown on the Drama & Dance page.</p>
        <button onClick={openNew} className={BTN_GOLD}><Plus className="h-4 w-4" /> Add Faculty</button>
      </div>
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)
        ) : items.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-10 text-center text-sm text-gray-400">
            No faculty added yet.
          </div>
        ) : items.map(f => (
          <div key={f.id} className="flex items-center gap-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            {f.img
              ? <img src={f.img} alt={f.name} className="h-16 w-16 rounded-2xl object-cover object-top flex-shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
              : <div className="h-16 w-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 text-3xl">👤</div>
            }
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 dark:text-white">{f.name}</p>
              <p className="text-xs font-semibold text-[#E8B84B]">{f.role}</p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{f.bio}</p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={() => openEdit(f)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition"><Edit2 className="h-3.5 w-3.5" /></button>
              {delConfirm === f.id ? (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 px-2 py-1">
                  <span className="text-xs text-red-600 dark:text-red-400">Delete?</span>
                  <button onClick={() => deleteMut.mutate(f.id)} className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline">Yes</button>
                  <button onClick={() => setDelConfirm(null)} className="text-xs text-gray-400">No</button>
                </div>
              ) : (
                <button onClick={() => setDelConfirm(f.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition"><Trash2 className="h-3.5 w-3.5" /></button>
              )}
            </div>
          </div>
        ))}
      </div>
      <Modal open={isNew || !!editing} onClose={closeForm} title={isNew ? 'Add Faculty Member' : 'Edit Faculty Member'}>
        <div className="space-y-4">
          <div>
            <label className={LABEL}>Full Name <span className="text-[#E8B84B]">*</span></label>
            <input className={INP} value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} placeholder="Ms. Grace Achieng" autoFocus />
          </div>
          <div>
            <label className={LABEL}>Role / Title</label>
            <input className={INP} value={draft.role} onChange={e => setDraft(d => ({ ...d, role: e.target.value }))} placeholder="Lead Choreographer · Ballet & Contemporary" />
          </div>
          <div>
            <label className={LABEL}>Photo URL</label>
            <input type="url" className={INP} value={draft.img} onChange={e => setDraft(d => ({ ...d, img: e.target.value }))} placeholder="https://example.com/photo.jpg" />
            {draft.img && <img src={draft.img} alt="preview" className="mt-2 h-16 w-16 rounded-2xl object-cover object-top" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
          </div>
          <div>
            <label className={LABEL}>Bio</label>
            <textarea rows={3} className={INP + ' resize-none'} value={draft.bio} onChange={e => setDraft(d => ({ ...d, bio: e.target.value }))} placeholder="Training, career highlights, speciality…" />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            <button onClick={closeForm} className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
            <button onClick={handleSave} disabled={!draft.name.trim() || createMut.isPending || updateMut.isPending} className="flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-4 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60">
              <Check className="h-4 w-4" />{createMut.isPending || updateMut.isPending ? 'Saving…' : isNew ? 'Add Faculty' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

// ── Schedule Panel ────────────────────────────────────────────────────────────
type DramaSlotDraft = Omit<DramaScheduleSlot, 'id'>

function SchedulePanel() {
  const { showToast } = useToast()
  const qc = useQueryClient()
  const [editing, setEditing] = useState<DramaScheduleSlot | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [draft, setDraft] = useState<DramaSlotDraft>({ day: '', activity: '', sortOrder: 1 })
  const [delConfirm, setDelConfirm] = useState<string | null>(null)

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-drama-schedule'],
    queryFn: () => contentService.listDramaScheduleSlots().then(unwrap),
    staleTime: 30_000,
  })

  const createMut = useMutation({
    mutationFn: (dto: DramaSlotDraft) => contentService.createDramaScheduleSlot(dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-drama-schedule'] }); qc.invalidateQueries({ queryKey: ['drama-schedule'] }); showToast('Session added ✓'); closeForm() },
  })
  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<DramaSlotDraft> }) => contentService.updateDramaScheduleSlot(id, dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-drama-schedule'] }); qc.invalidateQueries({ queryKey: ['drama-schedule'] }); showToast('Session updated ✓'); closeForm() },
  })
  const deleteMut = useMutation({
    mutationFn: (id: string) => contentService.deleteDramaScheduleSlot(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-drama-schedule'] }); qc.invalidateQueries({ queryKey: ['drama-schedule'] }); showToast('Session removed'); setDelConfirm(null) },
  })

  const openNew = () => { setDraft({ day: '', activity: '', sortOrder: items.length + 1 }); setIsNew(true); setEditing(null) }
  const openEdit = (s: DramaScheduleSlot) => { setDraft({ day: s.day, activity: s.activity, sortOrder: s.sortOrder }); setEditing(s); setIsNew(false) }
  const closeForm = () => { setEditing(null); setIsNew(false) }
  const handleSave = () => {
    if (!draft.day.trim()) return
    if (isNew) createMut.mutate(draft)
    else if (editing) updateMut.mutate({ id: editing.id, dto: draft })
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">Weekly rehearsal schedule shown on the Drama & Dance page.</p>
        <button onClick={openNew} className={BTN_GOLD}><Plus className="h-4 w-4" /> Add Session</button>
      </div>
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-gray-400">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-400">No schedule entries yet.</div>
        ) : (
          <table className="w-full min-w-[400px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                {['Day', 'Activity', 'Order', ''].map((h, i) => (
                  <th key={i} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {items.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                  <td className="px-4 py-3 font-bold text-[#E8B84B] whitespace-nowrap">{s.day}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{s.activity}</td>
                  <td className="px-4 py-3 text-center text-xs text-gray-400">{s.sortOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(s)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition"><Edit2 className="h-3.5 w-3.5" /></button>
                      {delConfirm === s.id ? (
                        <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 px-2 py-1">
                          <span className="text-xs text-red-600 dark:text-red-400">Delete?</span>
                          <button onClick={() => deleteMut.mutate(s.id)} className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline">Yes</button>
                          <button onClick={() => setDelConfirm(null)} className="text-xs text-gray-400">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setDelConfirm(s.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition"><Trash2 className="h-3.5 w-3.5" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Modal open={isNew || !!editing} onClose={closeForm} title={isNew ? 'Add Session' : 'Edit Session'}>
        <div className="space-y-4">
          <div>
            <label className={LABEL}>Day <span className="text-[#E8B84B]">*</span></label>
            <input className={INP} value={draft.day} onChange={e => setDraft(d => ({ ...d, day: e.target.value }))} placeholder="e.g. Monday" autoFocus />
          </div>
          <div>
            <label className={LABEL}>Activity</label>
            <input className={INP} value={draft.activity} onChange={e => setDraft(d => ({ ...d, activity: e.target.value }))} placeholder="e.g. Ballet — 4:00–5:30 PM" />
          </div>
          <div>
            <label className={LABEL}>Sort Order</label>
            <input type="number" min={1} className={INP + ' w-24'} value={draft.sortOrder} onChange={e => setDraft(d => ({ ...d, sortOrder: Number(e.target.value) }))} />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            <button onClick={closeForm} className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
            <button onClick={handleSave} disabled={!draft.day.trim() || createMut.isPending || updateMut.isPending} className="flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-4 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60">
              <Check className="h-4 w-4" />{createMut.isPending || updateMut.isPending ? 'Saving…' : isNew ? 'Add Session' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export function DramaDanceManager() {
  const [tab, setTab] = useState<Tab>('styles')

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/15">
          <Star className="h-5 w-5 text-pink-500 dark:text-pink-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Drama & Dance</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage dance styles, annual productions, faculty, and the rehearsal schedule.</p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-1 w-fit">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn('flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all', tab === t.id
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            )}
          >
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {tab === 'styles'      && <DanceStylesPanel />}
      {tab === 'productions' && <ProductionsPanel />}
      {tab === 'faculty'     && <FacultyPanel />}
      {tab === 'schedule'    && <SchedulePanel />}
    </div>
  )
}
