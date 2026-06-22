import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, X, Check, ExternalLink, FileText, Star, Layers, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  academicsApi,
  apiErrorMessage,
  type AcademicsPageContent,
  type AcademicsPageContentCreateDto,
  type CbcCompetency,
  type CbcCompetencyCreateDto,
  type TeachingPillar,
  type TeachingPillarCreateDto,
  type SchoolLevel,
  type SchoolLevelCreateDto,
} from '../../../services/academicsApi'
import { GRADIENT_MAP } from '../../../data/pillars'
import { LEVEL_COLOR_MAP } from '../../../lib/academicsColors'
import { useToast } from '../../../contexts/ToastContext'
import { cn } from '../../../lib/utils'

const INP   = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'
const BTN_GOLD  = 'flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-3 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60'
const BTN_GHOST = 'flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition'

const INNER_TABS = [
  { id: 'content',       label: 'Page Content',      icon: FileText  },
  { id: 'competencies',  label: 'CBC Competencies',   icon: Star      },
  { id: 'pillars',       label: 'Teaching Pillars',   icon: Layers    },
  { id: 'levels',        label: 'School Levels',      icon: BookOpen  },
] as const
type InnerTab = typeof INNER_TABS[number]['id']

// ── Shared modal ──────────────────────────────────────────────────────────────

function Modal({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode
}) {
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

const BLANK_CONTENT: AcademicsPageContentCreateDto = {
  headline: '',
  subheadline: '',
  ctaHeadline: '',
  ctaSubtext: '',
}

function PageContentTab() {
  const qc = useQueryClient()
  const { showToast } = useToast()

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['academics-page-content'],
    queryFn: () => academicsApi.getPageContent(),
    staleTime: 30_000,
  })

  const createMut = useMutation({
    mutationFn: (dto: AcademicsPageContentCreateDto) => academicsApi.createPageContent(dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['academics-page-content'] }); showToast('Page content created ✓'); closeModal() },
    onError: (err) => showToast(`Create failed: ${apiErrorMessage(err)}`),
  })
  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: AcademicsPageContentCreateDto }) => academicsApi.updatePageContent(id, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['academics-page-content'] }); showToast('Updated ✓'); closeModal() },
    onError: (err) => showToast(`Update failed: ${apiErrorMessage(err)}`),
  })
  const deleteMut = useMutation({
    mutationFn: (id: number) => academicsApi.deletePageContent(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['academics-page-content'] }); showToast('Deleted'); setDelConfirm(null) },
    onError: (err) => showToast(`Delete failed: ${apiErrorMessage(err)}`),
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<AcademicsPageContent | null>(null)
  const [draft, setDraft] = useState<AcademicsPageContentCreateDto>(BLANK_CONTENT)
  const [delConfirm, setDelConfirm] = useState<number | null>(null)

  const set = <K extends keyof AcademicsPageContentCreateDto>(k: K, v: AcademicsPageContentCreateDto[K]) =>
    setDraft(d => ({ ...d, [k]: v }))

  const openNew  = () => { setDraft(BLANK_CONTENT); setEditing(null); setModalOpen(true) }
  const openEdit = (item: AcademicsPageContent) => {
    setDraft({ headline: item.headline ?? '', subheadline: item.subheadline ?? '', ctaHeadline: item.ctaHeadline ?? '', ctaSubtext: item.ctaSubtext ?? '' })
    setEditing(item); setModalOpen(true)
  }
  const closeModal = () => { setModalOpen(false); setEditing(null) }

  const handleSave = () => {
    if (!draft.headline.trim()) return showToast('Headline is required')
    if (editing) updateMut.mutate({ id: editing.id, dto: draft })
    else createMut.mutate(draft)
  }

  const isPending = createMut.isPending || updateMut.isPending

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Academics Page Content</h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Hero headline, subheadline, and CTA text shown on the public Academics page.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/academics" target="_blank" className={BTN_GHOST}><ExternalLink className="h-3.5 w-3.5" /> View Page</Link>
          <button onClick={openNew} className={BTN_GOLD}><Plus className="h-4 w-4" /> Add Record</button>
        </div>
      </div>

      {isLoading && <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)}</div>}

      {!isLoading && items.length === 0 && (
        <button onClick={openNew} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 py-16 text-sm text-gray-400 hover:border-[#E8B84B]/50 hover:text-[#E8B84B] transition">
          <Plus className="h-5 w-5" /> Add your first academics page content record
        </button>
      )}

      {!isLoading && items.length > 0 && (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E8B84B]/15">
                    <FileText className="h-4 w-4 text-[#E8B84B]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{item.headline || '(No headline)'}</p>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.subheadline || '—'}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.ctaHeadline && <span className="rounded-full bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">CTA Headline ✓</span>}
                      {item.ctaSubtext  && <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">CTA Subtext ✓</span>}
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button onClick={() => openEdit(item)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition" title="Edit"><Edit2 className="h-3.5 w-3.5" /></button>
                  {delConfirm === item.id ? (
                    <div className="flex items-center gap-1">
                      <button onClick={() => deleteMut.mutate(item.id)} disabled={deleteMut.isPending} className="rounded-lg bg-red-500 px-2.5 py-1 text-xs font-bold text-white hover:bg-red-600 transition disabled:opacity-60">{deleteMut.isPending ? '…' : 'Delete'}</button>
                      <button onClick={() => setDelConfirm(null)} className="rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setDelConfirm(item.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={closeModal} title={editing ? 'Edit Page Content' : 'New Page Content'}>
        <div className="space-y-4">
          <div>
            <label className={LABEL}>Headline <span className="text-[#E8B84B]">*</span></label>
            <input className={INP} value={draft.headline} onChange={e => set('headline', e.target.value)} placeholder="Programs & Academics" autoFocus />
          </div>
          <div>
            <label className={LABEL}>Subheadline</label>
            <textarea rows={2} className={cn(INP,'resize-none')} value={draft.subheadline} onChange={e => set('subheadline', e.target.value)} placeholder="From Playgroup through Senior School…" />
          </div>
          <div>
            <label className={LABEL}>CTA Headline</label>
            <input className={INP} value={draft.ctaHeadline} onChange={e => set('ctaHeadline', e.target.value)} placeholder="Ready to Enrol?" />
          </div>
          <div>
            <label className={LABEL}>CTA Subtext</label>
            <textarea rows={2} className={cn(INP,'resize-none')} value={draft.ctaSubtext} onChange={e => set('ctaSubtext', e.target.value)} placeholder="Applications are open for the 2026 intake…" />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={handleSave} disabled={isPending || !draft.headline.trim()} className={BTN_GOLD}>
              <Check className="h-3.5 w-3.5" />{isPending ? 'Saving…' : editing ? 'Save Changes' : 'Create'}
            </button>
            <button onClick={closeModal} className={BTN_GHOST}><X className="h-3.5 w-3.5" /> Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ── 2. CBC Competencies tab ───────────────────────────────────────────────────

const BLANK_COMPETENCY: CbcCompetencyCreateDto = {
  icon: '🎯',
  title: '',
  description: '',
  isFeatured: false,
  sortOrder: 1,
}

function CompetenciesTab() {
  const qc = useQueryClient()
  const { showToast } = useToast()

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['cbc-competencies'],
    queryFn: () => academicsApi.getCompetencies(),
    staleTime: 30_000,
  })

  const createMut = useMutation({
    mutationFn: (dto: CbcCompetencyCreateDto) => academicsApi.createCompetency(dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cbc-competencies'] }); showToast('Competency added ✓'); closeModal() },
    onError: (err) => showToast(`Failed: ${apiErrorMessage(err)}`),
  })
  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: CbcCompetencyCreateDto }) => academicsApi.updateCompetency(id, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cbc-competencies'] }); showToast('Updated ✓'); closeModal() },
    onError: (err) => showToast(`Update failed: ${apiErrorMessage(err)}`),
  })
  const deleteMut = useMutation({
    mutationFn: (id: number) => academicsApi.deleteCompetency(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cbc-competencies'] }); showToast('Deleted') },
    onError: (err) => showToast(`Delete failed: ${apiErrorMessage(err)}`),
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CbcCompetency | null>(null)
  const [draft, setDraft] = useState<CbcCompetencyCreateDto>(BLANK_COMPETENCY)
  const [delConfirm, setDelConfirm] = useState<number | null>(null)

  const set = <K extends keyof CbcCompetencyCreateDto>(k: K, v: CbcCompetencyCreateDto[K]) =>
    setDraft(d => ({ ...d, [k]: v }))

  const openNew  = () => { setDraft({ ...BLANK_COMPETENCY, sortOrder: items.length + 1 }); setEditing(null); setModalOpen(true) }
  const openEdit = (item: CbcCompetency) => {
    setDraft({ icon: item.icon, title: item.title, description: item.description, isFeatured: item.isFeatured, sortOrder: item.sortOrder })
    setEditing(item); setModalOpen(true)
  }
  const closeModal = () => { setModalOpen(false); setEditing(null) }

  const handleSave = () => {
    if (!draft.title.trim()) return showToast('Title is required')
    if (editing) updateMut.mutate({ id: editing.id, dto: draft })
    else createMut.mutate(draft)
  }

  const isPending = createMut.isPending || updateMut.isPending
  const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">CBC Competencies</h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Cards shown in the "Our Approach" section on the public Academics page.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/academics" target="_blank" className={BTN_GHOST}><ExternalLink className="h-3.5 w-3.5" /> View Page</Link>
          <button onClick={openNew} className={BTN_GOLD}><Plus className="h-4 w-4" /> Add Competency</button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: items.length },
          { label: 'Featured', value: items.filter(i => i.isFeatured).length },
          { label: 'Standard', value: items.filter(i => !i.isFeatured).length },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-center">
            <p className="text-2xl font-bold text-[#E8B84B]">{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {isLoading && <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)}</div>}

      {!isLoading && items.length === 0 && (
        <button onClick={openNew} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 py-16 text-sm text-gray-400 hover:border-[#E8B84B]/50 hover:text-[#E8B84B] transition">
          <Plus className="h-5 w-5" /> Add your first CBC competency
        </button>
      )}

      {!isLoading && items.length > 0 && (
        <div className="space-y-3">
          {sorted.map(item => (
            <div key={item.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
              <div className="flex items-center gap-4">
                <span className="text-3xl w-10 text-center flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{item.title}</p>
                    {item.isFeatured && (
                      <span className="shrink-0 rounded-full bg-[#E8B84B]/20 px-2 py-0.5 text-[10px] font-bold text-[#b8892b]">Featured</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">{item.description}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button onClick={() => openEdit(item)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition" title="Edit"><Edit2 className="h-3.5 w-3.5" /></button>
                  {delConfirm === item.id ? (
                    <div className="flex items-center gap-1">
                      <button onClick={() => deleteMut.mutate(item.id)} disabled={deleteMut.isPending} className="rounded-lg bg-red-500 px-2.5 py-1 text-xs font-bold text-white hover:bg-red-600 transition disabled:opacity-60">{deleteMut.isPending ? '…' : 'Delete'}</button>
                      <button onClick={() => setDelConfirm(null)} className="rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setDelConfirm(item.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={closeModal} title={editing ? 'Edit Competency' : 'New Competency'}>
        <div className="space-y-4">
          <div className="grid grid-cols-[80px_1fr] gap-3">
            <div>
              <label className={LABEL}>Icon</label>
              <input className={INP} value={draft.icon} onChange={e => set('icon', e.target.value)} placeholder="🎯" style={{ fontSize: 20 }} />
            </div>
            <div>
              <label className={LABEL}>Title <span className="text-[#E8B84B]">*</span></label>
              <input className={INP} value={draft.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Critical Thinking" autoFocus />
            </div>
          </div>
          <div>
            <label className={LABEL}>Description</label>
            <textarea rows={3} className={cn(INP,'resize-none')} value={draft.description} onChange={e => set('description', e.target.value)} placeholder="What this competency develops in learners…" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Sort Order</label>
              <input type="number" min={1} className={INP} value={draft.sortOrder} onChange={e => set('sortOrder', Number(e.target.value))} />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={draft.isFeatured} onChange={e => set('isFeatured', e.target.checked)} className="h-4 w-4 accent-[#E8B84B]" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Featured (wider card)</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={handleSave} disabled={isPending || !draft.title.trim()} className={BTN_GOLD}>
              <Check className="h-3.5 w-3.5" />{isPending ? 'Saving…' : editing ? 'Save Changes' : 'Create'}
            </button>
            <button onClick={closeModal} className={BTN_GHOST}><X className="h-3.5 w-3.5" /> Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ── 3. Teaching Pillars tab ───────────────────────────────────────────────────

const BLANK_PILLAR: TeachingPillarCreateDto = {
  icon: '📌',
  title: '',
  description: '',
  gradient: 'green',
  sortOrder: 1,
}

function PillarsTab() {
  const qc = useQueryClient()
  const { showToast } = useToast()

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['teaching-pillars'],
    queryFn: () => academicsApi.getPillars(),
    staleTime: 30_000,
  })

  const createMut = useMutation({
    mutationFn: (dto: TeachingPillarCreateDto) => academicsApi.createPillar(dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['teaching-pillars'] }); showToast('Pillar added ✓'); closeModal() },
    onError: (err) => showToast(`Failed: ${apiErrorMessage(err)}`),
  })
  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: TeachingPillarCreateDto }) => academicsApi.updatePillar(id, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['teaching-pillars'] }); showToast('Updated ✓'); closeModal() },
    onError: (err) => showToast(`Update failed: ${apiErrorMessage(err)}`),
  })
  const deleteMut = useMutation({
    mutationFn: (id: number) => academicsApi.deletePillar(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['teaching-pillars'] }); showToast('Deleted') },
    onError: (err) => showToast(`Delete failed: ${apiErrorMessage(err)}`),
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<TeachingPillar | null>(null)
  const [draft, setDraft] = useState<TeachingPillarCreateDto>(BLANK_PILLAR)
  const [delConfirm, setDelConfirm] = useState<number | null>(null)

  const set = <K extends keyof TeachingPillarCreateDto>(k: K, v: TeachingPillarCreateDto[K]) =>
    setDraft(d => ({ ...d, [k]: v }))

  const openNew  = () => { setDraft({ ...BLANK_PILLAR, sortOrder: items.length + 1 }); setEditing(null); setModalOpen(true) }
  const openEdit = (item: TeachingPillar) => {
    setDraft({ icon: item.icon, title: item.title, description: item.description, gradient: item.gradient, sortOrder: item.sortOrder })
    setEditing(item); setModalOpen(true)
  }
  const closeModal = () => { setModalOpen(false); setEditing(null) }

  const handleSave = () => {
    if (!draft.title.trim()) return showToast('Title is required')
    if (editing) updateMut.mutate({ id: editing.id, dto: draft })
    else createMut.mutate(draft)
  }

  const isPending = createMut.isPending || updateMut.isPending
  const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder)
  const previewG = GRADIENT_MAP[draft.gradient] ?? GRADIENT_MAP.green

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Teaching Pillars</h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Cards shown in the "How We Teach" section on the public Academics page.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/academics" target="_blank" className={BTN_GHOST}><ExternalLink className="h-3.5 w-3.5" /> View Page</Link>
          <button onClick={openNew} className={BTN_GOLD}><Plus className="h-4 w-4" /> Add Pillar</button>
        </div>
      </div>

      {isLoading && <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-16 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)}</div>}

      {!isLoading && items.length === 0 && (
        <button onClick={openNew} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 py-16 text-sm text-gray-400 hover:border-[#E8B84B]/50 hover:text-[#E8B84B] transition">
          <Plus className="h-5 w-5" /> Add your first teaching pillar
        </button>
      )}

      {!isLoading && items.length > 0 && (
        <div className="space-y-3">
          {sorted.map(item => {
            const g = GRADIENT_MAP[item.gradient] ?? GRADIENT_MAP.green
            return (
              <div key={item.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                <div className="flex items-center gap-4">
                  <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br text-2xl', g.color, g.border)}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{item.title}</p>
                      <span className="shrink-0 h-2.5 w-2.5 rounded-full ring-1 ring-black/10" style={{ backgroundColor: g.preview }} title={g.label} />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">{item.description}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button onClick={() => openEdit(item)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition" title="Edit"><Edit2 className="h-3.5 w-3.5" /></button>
                    {delConfirm === item.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => deleteMut.mutate(item.id)} disabled={deleteMut.isPending} className="rounded-lg bg-red-500 px-2.5 py-1 text-xs font-bold text-white hover:bg-red-600 transition disabled:opacity-60">{deleteMut.isPending ? '…' : 'Delete'}</button>
                        <button onClick={() => setDelConfirm(null)} className="rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setDelConfirm(item.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={closeModal} title={editing ? 'Edit Pillar' : 'New Teaching Pillar'}>
        <div className="space-y-4">
          <div className="grid grid-cols-[80px_1fr] gap-3">
            <div>
              <label className={LABEL}>Icon</label>
              <input className={INP} value={draft.icon} onChange={e => set('icon', e.target.value)} placeholder="🌱" style={{ fontSize: 20 }} />
            </div>
            <div>
              <label className={LABEL}>Title <span className="text-[#E8B84B]">*</span></label>
              <input className={INP} value={draft.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Holistic Development" autoFocus />
            </div>
          </div>
          <div>
            <label className={LABEL}>Description</label>
            <textarea rows={3} className={cn(INP,'resize-none')} value={draft.description} onChange={e => set('description', e.target.value)} placeholder="How this pillar shapes the learning experience…" />
          </div>
          <div>
            <label className={LABEL}>Card Gradient Colour</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {Object.entries(GRADIENT_MAP).map(([key, g]) => (
                <button key={key} type="button" onClick={() => set('gradient', key)} title={g.label}
                  className={cn('flex items-center gap-1.5 rounded-lg border-2 px-3 py-1.5 text-xs font-semibold transition', draft.gradient === key ? 'border-gray-800 dark:border-white scale-105 shadow-sm' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-500')}>
                  <span className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10" style={{ backgroundColor: g.preview }} />
                  {g.label}
                </button>
              ))}
            </div>
            <div className={cn('mt-3 flex items-start gap-4 rounded-2xl border bg-gradient-to-br p-4', previewG.color, previewG.border)}>
              <span className="text-3xl">{draft.icon || '📌'}</span>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">{draft.title || 'Pillar Title'}</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{draft.description || 'Description will appear here.'}</p>
              </div>
            </div>
          </div>
          <div>
            <label className={LABEL}>Sort Order</label>
            <input type="number" min={1} className={INP} value={draft.sortOrder} onChange={e => set('sortOrder', Number(e.target.value))} />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={handleSave} disabled={isPending || !draft.title.trim()} className={BTN_GOLD}>
              <Check className="h-3.5 w-3.5" />{isPending ? 'Saving…' : editing ? 'Save Changes' : 'Create'}
            </button>
            <button onClick={closeModal} className={BTN_GHOST}><X className="h-3.5 w-3.5" /> Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ── 4. School Levels tab ──────────────────────────────────────────────────────

const COLOR_KEYS = ['pink','green','blue','violet','amber','teal','rose','indigo'] as const

const BLANK_LEVEL: SchoolLevelCreateDto = {
  slug: '',
  name: '',
  ages: '',
  icon: '🎓',
  colorKey: 'blue',
  desc: '',
  highlights: '',
  sortOrder: 1,
}

function SchoolLevelsTab() {
  const qc = useQueryClient()
  const { showToast } = useToast()

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['school-levels'],
    queryFn: () => academicsApi.getSchoolLevels(),
    staleTime: 30_000,
  })

  const createMut = useMutation({
    mutationFn: (dto: SchoolLevelCreateDto) => academicsApi.createSchoolLevel(dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['school-levels'] }); showToast('School level added ✓'); closeModal() },
    onError: (err) => showToast(`Failed: ${apiErrorMessage(err)}`),
  })
  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: SchoolLevelCreateDto }) => academicsApi.updateSchoolLevel(id, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['school-levels'] }); showToast('Updated ✓'); closeModal() },
    onError: (err) => showToast(`Update failed: ${apiErrorMessage(err)}`),
  })
  const deleteMut = useMutation({
    mutationFn: (id: number) => academicsApi.deleteSchoolLevel(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['school-levels'] }); showToast('Deleted') },
    onError: (err) => showToast(`Delete failed: ${apiErrorMessage(err)}`),
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing]     = useState<SchoolLevel | null>(null)
  const [draft, setDraft]         = useState<SchoolLevelCreateDto>(BLANK_LEVEL)
  const [delConfirm, setDelConfirm] = useState<number | null>(null)

  const set = <K extends keyof SchoolLevelCreateDto>(k: K, v: SchoolLevelCreateDto[K]) =>
    setDraft(d => ({ ...d, [k]: v }))

  const openNew  = () => { setDraft({ ...BLANK_LEVEL, sortOrder: items.length + 1 }); setEditing(null); setModalOpen(true) }
  const openEdit = (item: SchoolLevel) => {
    setDraft({ slug: item.slug, name: item.name, ages: item.ages, icon: item.icon, colorKey: item.colorKey, desc: item.desc, highlights: item.highlights, sortOrder: item.sortOrder })
    setEditing(item); setModalOpen(true)
  }
  const closeModal = () => { setModalOpen(false); setEditing(null) }

  const handleSave = () => {
    if (!draft.name.trim()) return showToast('Name is required')
    if (!draft.slug.trim()) return showToast('Slug is required')
    if (editing) updateMut.mutate({ id: editing.id, dto: draft })
    else createMut.mutate(draft)
  }

  const isPending = createMut.isPending || updateMut.isPending
  const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder)
  const previewColors = LEVEL_COLOR_MAP[draft.colorKey] ?? LEVEL_COLOR_MAP.blue

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">School Levels</h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">The tab cards shown in the "School Structure" section on the public Academics page.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/academics" target="_blank" className={BTN_GHOST}><ExternalLink className="h-3.5 w-3.5" /> View Page</Link>
          <button onClick={openNew} className={BTN_GOLD}><Plus className="h-4 w-4" /> Add Level</button>
        </div>
      </div>

      {isLoading && <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)}</div>}

      {!isLoading && items.length === 0 && (
        <button onClick={openNew} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 py-16 text-sm text-gray-400 hover:border-[#E8B84B]/50 hover:text-[#E8B84B] transition">
          <Plus className="h-5 w-5" /> Add your first school level
        </button>
      )}

      {!isLoading && items.length > 0 && (
        <div className="space-y-3">
          {sorted.map(item => {
            const colors = LEVEL_COLOR_MAP[item.colorKey] ?? LEVEL_COLOR_MAP.blue
            return (
              <div key={item.id} className={cn('rounded-2xl border bg-gradient-to-br p-4', colors.color, colors.border)}>
                <div className="flex items-center gap-4">
                  <span className="text-3xl w-10 text-center flex-shrink-0">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
                      <span className="rounded-full bg-white/60 dark:bg-black/20 px-2 py-0.5 text-[10px] font-mono text-gray-600 dark:text-gray-300">{item.slug}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{item.ages}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">{item.desc}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button onClick={() => openEdit(item)} className="rounded-lg p-1.5 text-gray-500 hover:bg-white/50 dark:hover:bg-black/20 transition" title="Edit"><Edit2 className="h-3.5 w-3.5" /></button>
                    {delConfirm === item.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => deleteMut.mutate(item.id)} disabled={deleteMut.isPending} className="rounded-lg bg-red-500 px-2.5 py-1 text-xs font-bold text-white hover:bg-red-600 transition disabled:opacity-60">{deleteMut.isPending ? '…' : 'Delete'}</button>
                        <button onClick={() => setDelConfirm(null)} className="rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-white/50 transition">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setDelConfirm(item.id)} className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={closeModal} title={editing ? `Edit: ${editing.name}` : 'New School Level'}>
        <div className="space-y-4">
          {/* Row 1: icon + name */}
          <div className="grid grid-cols-[80px_1fr] gap-3">
            <div>
              <label className={LABEL}>Icon</label>
              <input className={INP} value={draft.icon} onChange={e => set('icon', e.target.value)} placeholder="🎓" style={{ fontSize: 20 }} />
            </div>
            <div>
              <label className={LABEL}>Name <span className="text-[#E8B84B]">*</span></label>
              <input className={INP} value={draft.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Junior School" autoFocus />
            </div>
          </div>

          {/* Row 2: slug + ages */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Slug <span className="text-[#E8B84B]">*</span></label>
              <input className={INP} value={draft.slug} onChange={e => set('slug', e.target.value.toLowerCase().replace(/\s+/g,'-'))} placeholder="junior-school" />
            </div>
            <div>
              <label className={LABEL}>Age Range</label>
              <input className={INP} value={draft.ages} onChange={e => set('ages', e.target.value)} placeholder="Ages 6–10" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={LABEL}>Description</label>
            <textarea rows={3} className={cn(INP,'resize-none')} value={draft.desc} onChange={e => set('desc', e.target.value)} placeholder="What learners experience at this level…" />
          </div>

          {/* Highlights */}
          <div>
            <label className={LABEL}>Learning Areas <span className="font-normal text-gray-400">(one per line — shown as tags)</span></label>
            <textarea rows={4} className={cn(INP,'resize-none font-mono text-xs')} value={draft.highlights} onChange={e => set('highlights', e.target.value)} placeholder={'Mathematics\nEnglish\nKiswahili\nScience & Technology'} />
          </div>

          {/* Colour key */}
          <div>
            <label className={LABEL}>Card Colour</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {COLOR_KEYS.map(key => {
                const c = LEVEL_COLOR_MAP[key]
                return (
                  <button key={key} type="button" onClick={() => set('colorKey', key)}
                    className={cn('rounded-lg border-2 px-3 py-1.5 text-xs font-semibold capitalize transition',
                      draft.colorKey === key ? 'border-gray-800 dark:border-white scale-105 shadow-sm' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-500')}>
                    <span className={cn('mr-1.5 inline-block h-3 w-3 rounded-full bg-gradient-to-br', c.color)} />
                    {key}
                  </button>
                )
              })}
            </div>
            {/* Live preview */}
            <div className={cn('mt-3 flex items-center gap-4 rounded-2xl border bg-gradient-to-br p-4', previewColors.color, previewColors.border)}>
              <span className="text-3xl">{draft.icon || '🎓'}</span>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">{draft.name || 'Level Name'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{draft.ages || 'Age range'}</p>
              </div>
            </div>
          </div>

          {/* Sort order */}
          <div>
            <label className={LABEL}>Sort Order</label>
            <input type="number" min={1} className={INP} value={draft.sortOrder} onChange={e => set('sortOrder', Number(e.target.value))} />
          </div>

          <div className="flex gap-2 pt-1">
            <button onClick={handleSave} disabled={isPending || !draft.name.trim() || !draft.slug.trim()} className={BTN_GOLD}>
              <Check className="h-3.5 w-3.5" />{isPending ? 'Saving…' : editing ? 'Save Changes' : 'Create'}
            </button>
            <button onClick={closeModal} className={BTN_GHOST}><X className="h-3.5 w-3.5" /> Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export function AcademicsContentManager() {
  const [tab, setTab] = useState<InnerTab>('content')

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 pt-4 pb-0">
        <div className="mb-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Academics</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Manage content for the public Academics page via live API.</p>
        </div>
        <nav className="flex gap-0.5 -mb-px overflow-x-auto scrollbar-none">
          {INNER_TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap shrink-0',
                tab === t.id
                  ? 'border-[#E8B84B] text-[#E8B84B]'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300',
              )}
            >
              <t.icon className="h-3.5 w-3.5 shrink-0" />
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {tab === 'content'      && <PageContentTab />}
        {tab === 'competencies' && <CompetenciesTab />}
        {tab === 'pillars'      && <PillarsTab />}
        {tab === 'levels'       && <SchoolLevelsTab />}
      </div>
    </div>
  )
}
