import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ExternalLink, ChevronRight, Save, Globe, Eye, EyeOff, CheckCircle, Plus, X, Trash2, Edit2, Check, ChevronUp, ChevronDown, Layers } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { contentService } from '../../../services/contentService'
import type { CmsPage, CmsBlock, CmsBlockType, PublicFeeRow } from '../../../services/contentService'
import { AboutContentManager } from './AboutContentManager'
import { CoreValuesManager } from './CoreValuesManager'
import { HistoryMilestonesManager } from './HistoryMilestonesManager'
import { WhyChooseUsManager } from './WhyChooseUsManager'
import { AcademicsContentManager } from './AcademicsContentManager'
import { unwrap } from '../../../services/mockApi'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Button } from '../../../components/ui/Button'
import { useToast } from '../../../contexts/ToastContext'
import { cn } from '../../../lib/utils'
import { useCreateCmsBlock, useDeleteCmsBlock } from '../../../hooks/useCmsData'
import { LEVEL_COLOR_MAP } from '../../../lib/academicsColors'
import type { Facility } from '../../../services/contentService'

const BLOCK_TYPES: { value: CmsBlockType; label: string; hint: string }[] = [
  { value: 'text',     label: 'Text',     hint: 'Single-line text (headline, name, phone…)' },
  { value: 'textarea', label: 'Paragraph',hint: 'Multi-line text (body copy, quote…)' },
  { value: 'image',    label: 'Image URL', hint: 'Paste a URL — a preview will appear below' },
  { value: 'list',     label: 'List',      hint: 'One item per line (bullet lists, FAQs…)' },
]

const EMPTY_NEW: Omit<CmsBlock, 'id' | 'pageId' | 'sortOrder'> = {
  key: '',
  label: '',
  type: 'text',
  value: '',
  helpText: '',
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '')
}

function ManagerRedirectCard({ icon, title, description, to }: { icon: string; title: string; description: string; to: string }) {
  return (
    <div className="mx-4 my-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6 text-center">
      <span className="text-4xl">{icon}</span>
      <h3 className="mt-3 text-base font-bold text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">{description}</p>
      <Link to={to} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-4 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition">
        Open Manager →
      </Link>
    </div>
  )
}

function BlockField({
  block,
  value,
  onChange,
}: {
  block: CmsBlock
  value: string
  onChange: (v: string) => void
}) {
  if (block.type === 'textarea') {
    return (
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field resize-none"
        placeholder={block.label}
      />
    )
  }
  if (block.type === 'image') {
    return (
      <div className="space-y-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="field"
          placeholder="https://example.com/image.jpg"
        />
        {value && (
          <img
            src={value}
            alt="Preview"
            className="h-28 w-full rounded-xl object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        )}
      </div>
    )
  }
  if (block.type === 'list') {
    return (
      <textarea
        rows={6}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field resize-none font-mono text-xs"
        placeholder="One item per line"
      />
    )
  }
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="field"
      placeholder={block.label}
    />
  )
}

function AddBlockModal({
  pageId,
  pageTitle,
  existingSortMax,
  onClose,
}: {
  pageId: string
  pageTitle: string
  existingSortMax: number
  onClose: () => void
}) {
  const { showToast } = useToast()
  const createBlock = useCreateCmsBlock()
  const [form, setForm] = useState({ ...EMPTY_NEW })
  const [keyTouched, setKeyTouched] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (field: string, val: string) =>
    setForm((prev) => ({ ...prev, [field]: val }))

  const handleLabelChange = (val: string) => {
    set('label', val)
    if (!keyTouched) set('key', slugify(val))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.label.trim()) e.label = 'Label is required'
    if (!form.key.trim()) e.key = 'Key is required'
    if (!/^[a-z0-9.]+$/.test(form.key)) e.key = 'Key can only contain lowercase letters, numbers and dots'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    await createBlock.mutateAsync({
      pageId,
      key: form.key,
      label: form.label,
      type: form.type as CmsBlockType,
      value: form.value,
      helpText: form.helpText || undefined,
      sortOrder: existingSortMax + 10,
    })
    showToast(`Block "${form.label}" added to ${pageTitle}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <GlassCard
        className="w-full max-w-lg p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Add Content Block</h2>
            <p className="text-xs text-muted">Adding to: <span className="font-semibold">{pageTitle}</span></p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 hover:bg-tint/60 dark:hover:bg-dark-card transition"
          >
            <X className="h-4 w-4 text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Label */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted uppercase tracking-widest">
              Label <span className="text-gold">*</span>
            </label>
            <input
              className="field"
              placeholder="e.g. Section Headline"
              value={form.label}
              onChange={(e) => handleLabelChange(e.target.value)}
              autoFocus
            />
            {errors.label && <p className="mt-1 text-xs text-gold">{errors.label}</p>}
          </div>

          {/* Key */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted uppercase tracking-widest">
              Key <span className="text-gold">*</span>
            </label>
            <input
              className="field font-mono text-sm"
              placeholder="e.g. section.headline"
              value={form.key}
              onChange={(e) => { setKeyTouched(true); set('key', e.target.value) }}
            />
            <p className="mt-1 text-[11px] text-muted">
              Used in code to look up this block. Auto-filled from label — edit if needed.
            </p>
            {errors.key && <p className="mt-1 text-xs text-gold">{errors.key}</p>}
          </div>

          {/* Type */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted uppercase tracking-widest">Type</label>
            <div className="grid grid-cols-2 gap-2">
              {BLOCK_TYPES.map((bt) => (
                <button
                  key={bt.value}
                  type="button"
                  onClick={() => set('type', bt.value)}
                  className={cn(
                    'rounded-xl border px-3 py-2.5 text-left transition',
                    form.type === bt.value
                      ? 'border-gold/60 bg-gold/10 text-foreground'
                      : 'border-theme bg-tint/40 dark:bg-dark-card/60 text-muted hover:border-theme/80',
                  )}
                >
                  <p className="text-xs font-bold">{bt.label}</p>
                  <p className="mt-0.5 text-[10px] leading-snug opacity-70">{bt.hint}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Initial value */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted uppercase tracking-widest">
              Initial Value <span className="text-muted font-normal">(optional)</span>
            </label>
            {form.type === 'textarea' || form.type === 'list' ? (
              <textarea
                rows={3}
                className="field resize-none"
                placeholder={form.type === 'list' ? 'One item per line' : 'Enter text…'}
                value={form.value}
                onChange={(e) => set('value', e.target.value)}
              />
            ) : (
              <input
                className="field"
                placeholder={form.type === 'image' ? 'https://example.com/image.jpg' : 'Enter text…'}
                value={form.value}
                onChange={(e) => set('value', e.target.value)}
              />
            )}
          </div>

          {/* Help text */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted uppercase tracking-widest">
              Help Text <span className="text-muted font-normal">(optional)</span>
            </label>
            <input
              className="field"
              placeholder="Shown below the label to guide editors"
              value={form.helpText}
              onChange={(e) => set('helpText', e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button
              type="submit"
              variant="primary"
              disabled={createBlock.isPending}
              className="flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              {createBlock.isPending ? 'Adding…' : 'Add Block'}
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  )
}

const COLOR_OPTIONS = Object.keys(LEVEL_COLOR_MAP)

// ── Shared styles ─────────────────────────────────────────────────────────
const FIELD = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const BTN_GOLD = 'flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-3 py-1.5 text-xs font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60'
const BTN_GHOST = 'rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition'

// ── Public Fee Rows Panel ──────────────────────────────────────────────────
type FeeRowDraft = { level: string; tuition: number; transport: number; activities: number; sortOrder: number }
const BLANK_FEE: FeeRowDraft = { level: '', tuition: 0, transport: 0, activities: 0, sortOrder: 1 }

function FeeRowsPanel({ qc }: { qc: ReturnType<typeof useQueryClient> }) {
  const { showToast } = useToast()
  const [editing, setEditing] = useState<string | 'new' | null>(null)
  const [draft, setDraft] = useState<FeeRowDraft>(BLANK_FEE)

  const { data: rows = [] } = useQuery({
    queryKey: ['admin-fee-rows'],
    queryFn: () => contentService.listPublicFeeRows().then(unwrap),
    staleTime: 30_000,
  })

  const createMut = useMutation({
    mutationFn: (dto: FeeRowDraft) => contentService.createPublicFeeRow(dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-fee-rows'] }); showToast('Fee row added ✓'); setEditing(null) },
  })

  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<FeeRowDraft> }) => contentService.updatePublicFeeRow(id, dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-fee-rows'] }); showToast('Fee row updated ✓'); setEditing(null) },
  })

  const deleteMut = useMutation({
    mutationFn: (id: string) => contentService.deletePublicFeeRow(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-fee-rows'] }); showToast('Fee row deleted'); setEditing(null) },
  })

  const openNew = () => { setDraft({ ...BLANK_FEE, sortOrder: rows.length + 1 }); setEditing('new') }
  const openEdit = (r: PublicFeeRow) => { setDraft({ level: r.level, tuition: r.tuition, transport: r.transport, activities: r.activities, sortOrder: r.sortOrder }); setEditing(r.id) }
  const close = () => setEditing(null)
  const save = () => {
    if (!draft.level.trim()) return showToast('Level name is required')
    if (editing === 'new') createMut.mutate(draft)
    else if (editing) updateMut.mutate({ id: editing, dto: draft })
  }

  const fmt = (n: number) => `KSh ${n.toLocaleString()}`

  function FeeForm() {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Level Name <span className="text-gold">*</span></label>
            <input className={FIELD} value={draft.level} onChange={e => setDraft(d => ({ ...d, level: e.target.value }))} placeholder="e.g. Primary School" autoFocus />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Tuition (KSh / year)</label>
            <input type="number" min={0} className={FIELD} value={draft.tuition} onChange={e => setDraft(d => ({ ...d, tuition: Number(e.target.value) }))} />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Transport (KSh / year)</label>
            <input type="number" min={0} className={FIELD} value={draft.transport} onChange={e => setDraft(d => ({ ...d, transport: Number(e.target.value) }))} />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Activities (KSh / year)</label>
            <input type="number" min={0} className={FIELD} value={draft.activities} onChange={e => setDraft(d => ({ ...d, activities: Number(e.target.value) }))} />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Total (auto-calculated)</label>
            <div className="flex h-9 items-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900 px-3 text-sm font-semibold text-gold">
              {fmt(draft.tuition + draft.transport + draft.activities)}
            </div>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Sort Order</label>
          <input type="number" min={1} className={FIELD} value={draft.sortOrder} onChange={e => setDraft(d => ({ ...d, sortOrder: Number(e.target.value) }))} />
        </div>
        <div className="flex gap-2 pt-1">
          <button onClick={save} disabled={!draft.level.trim()} className={BTN_GOLD}><Check className="h-3.5 w-3.5" /> Save</button>
          <button onClick={close} className={BTN_GHOST}><X className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 max-w-3xl space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted flex items-center gap-2">
            💰 Fee Structure Table
          </h2>
          <p className="text-xs text-muted mt-0.5">Annual fee rows displayed in the Fee Structure section of the Admissions page.</p>
        </div>
        <button onClick={openNew} className={BTN_GOLD}><Plus className="h-3.5 w-3.5" /> Add Fee Row</button>
      </div>

      {editing === 'new' && (
        <GlassCard className="p-5 border-gold/40">
          <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-3">New Fee Row</p>
          <FeeForm />
        </GlassCard>
      )}

      <div className="space-y-2">
        {[...rows].sort((a, b) => a.sortOrder - b.sortOrder).map(r => (
          <div key={r.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            {editing === r.id ? (
              <div className="p-5"><FeeForm /></div>
            ) : (
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{r.level}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                    <span className="text-xs text-muted">Tuition: <span className="font-medium text-foreground">{fmt(r.tuition)}</span></span>
                    <span className="text-xs text-muted">Transport: <span className="font-medium text-foreground">{fmt(r.transport)}</span></span>
                    <span className="text-xs text-muted">Activities: <span className="font-medium text-foreground">{fmt(r.activities)}</span></span>
                    <span className="text-xs font-semibold text-gold">Total: {fmt(r.total)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(r)} className="rounded-lg p-1.5 text-muted hover:bg-tint/60 dark:hover:bg-dark-card transition" title="Edit">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => deleteMut.mutate(r.id)} className="rounded-lg p-1.5 text-muted hover:bg-red-500/10 hover:text-red-500 transition" title="Delete">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {rows.length === 0 && editing === null && (
        <button onClick={openNew}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-theme py-8 text-sm text-muted transition hover:border-gold/50 hover:text-gold">
          <Plus className="h-4 w-4" /> Add your first fee row
        </button>
      )}
    </div>
  )
}

export function PagesManager() {
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [selectedPageId, setSelectedPageId] = useState<string | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['pg-cocurr']))
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [showAddModal, setShowAddModal] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const { data: pages = [] } = useQuery({
    queryKey: ['cms-pages'],
    queryFn: () => contentService.listCmsPages().then(unwrap),
    staleTime: 60_000,
  })

  const { data: blocks = [], isFetching: blocksLoading } = useQuery({
    queryKey: ['cms-blocks', selectedPageId],
    queryFn: () => contentService.getCmsBlocks(selectedPageId!).then(unwrap),
    enabled: !!selectedPageId,
    staleTime: 30_000,
  })

  const togglePublish = useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      contentService.updateCmsPage(id, { isPublished }).then(unwrap),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-pages'] })
      showToast('Page visibility updated')
    },
  })

  const saveBlock = useMutation({
    mutationFn: ({ id, value }: { id: string; value: string }) =>
      contentService.updateCmsBlock(id, value).then(unwrap),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['cms-blocks', updated.pageId] })
      setSavedIds((prev) => new Set([...prev, updated.id]))
      setTimeout(() => setSavedIds((prev) => { const n = new Set(prev); n.delete(updated.id); return n }), 2000)
    },
  })

  const deleteBlock = useDeleteCmsBlock()

  useEffect(() => {
    setDrafts({})
    setSavedIds(new Set())
    setShowAddModal(false)
    setConfirmDeleteId(null)
  }, [selectedPageId])

  const topLevel = pages.filter((p) => p.parentId === null).sort((a, b) => a.sortOrder - b.sortOrder)
  const children = (parentId: string) =>
    pages.filter((p) => p.parentId === parentId).sort((a, b) => a.sortOrder - b.sortOrder)
  const hasChildren = (id: string) => pages.some((p) => p.parentId === id)

  const selectedPage = pages.find((p) => p.id === selectedPageId) ?? null
  const getDraft = (block: CmsBlock) => (block.id in drafts ? drafts[block.id] : block.value)
  const isDirty = blocks.some((b) => b.id in drafts && drafts[b.id] !== b.value)
  const maxSortOrder = blocks.reduce((m, b) => Math.max(m, b.sortOrder), 0)

  // Pages whose content is 100% managed in a dedicated sidebar manager —
  // no CMS blocks to add, so hide the "Add Block" controls entirely.
  const PURE_REDIRECT_PAGES = new Set(['pg-cocurr', 'pg-sports', 'pg-music', 'pg-drama', 'pg-staff'])
  const API_MANAGED_PAGES = new Set(['pg-about', 'pg-why', 'pg-academics'])
  const canAddBlocks = selectedPageId ? !PURE_REDIRECT_PAGES.has(selectedPageId) && !API_MANAGED_PAGES.has(selectedPageId) : false

  const saveAll = async () => {
    const changed = blocks.filter((b) => b.id in drafts && drafts[b.id] !== b.value)
    if (changed.length === 0) { showToast('No changes to save'); return }
    await Promise.all(changed.map((b) => saveBlock.mutateAsync({ id: b.id, value: drafts[b.id] })))
    showToast(`Saved ${changed.length} field${changed.length > 1 ? 's' : ''} on ${selectedPage?.title}`)
  }

  const handleDelete = async (block: CmsBlock) => {
    await deleteBlock.mutateAsync({ id: block.id, pageId: block.pageId })
    setDrafts((prev) => { const n = { ...prev }; delete n[block.id]; return n })
    setSavedIds((prev) => { const n = new Set(prev); n.delete(block.id); return n })
    setConfirmDeleteId(null)
    showToast(`Block "${block.label}" deleted`)
  }

  // Direct-navigate pages — clicking the card goes straight to their sub-route
  const DIRECT_NAV: Record<string, string> = {
    'pg-home':        '/dashboard/admin/site-content/home',
    'pg-contact':     '/dashboard/admin/site-content/contact',
    'pg-cocurr':      '/dashboard/admin/site-content/co-curricular',
    'pg-facilities':  '/dashboard/admin/site-content/facilities',
  }

  // ── Page Card (replaces the old sidebar tree item) ──────────────────────
  function PageCard({ page }: { page: CmsPage }) {
    const subs = children(page.id)
    return (
      <div
        onClick={() => {
          if (DIRECT_NAV[page.id]) { navigate(DIRECT_NAV[page.id]); return }
          setSelectedPageId(page.id)
        }}
        className="group flex cursor-pointer flex-col rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm transition-all hover:border-[#E8B84B]/60 hover:shadow-md dark:hover:border-[#E8B84B]/40"
      >
        {/* Icon + publish badge */}
        <div className="mb-4 flex items-start justify-between gap-2">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-2xl">
            {page.icon}
          </div>
          <span className={cn(
            'mt-0.5 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold flex-shrink-0',
            page.isPublished
              ? 'bg-green-50 text-green-700 dark:bg-green-900/25 dark:text-green-400'
              : 'bg-amber-50 text-amber-700 dark:bg-amber-900/25 dark:text-amber-400',
          )}>
            <span className={cn('h-1.5 w-1.5 rounded-full', page.isPublished ? 'bg-green-500' : 'bg-amber-500')} />
            {page.isPublished ? 'Published' : 'Draft'}
          </span>
        </div>

        {/* Title + URL */}
        <h3 className="text-sm font-bold leading-tight">{page.title}</h3>
        <p className="mt-0.5 font-mono text-[11px] text-muted">{page.path}</p>

        {/* Sub-page chips */}
        {subs.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {subs.map((sub) => (
              <button
                key={sub.id}
                onClick={(e) => { e.stopPropagation(); setSelectedPageId(sub.id) }}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-2 py-1 text-[11px] font-medium text-muted transition hover:border-[#E8B84B]/50 hover:text-foreground"
              >
                <span>{sub.icon}</span>
                <span>{sub.title}</span>
              </button>
            ))}
          </div>
        )}

        {/* Footer: preview + hover cue */}
        <div className="mt-auto flex items-center justify-between pt-4">
          <Link
            to={page.path}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-[11px] text-muted transition hover:text-foreground"
          >
            <ExternalLink className="h-3 w-3" />
            Preview
          </Link>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#c49830] opacity-0 transition-opacity group-hover:opacity-100">
            Edit content <ChevronRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    )
  }

  return (
    <>
      {!selectedPage ? (
        /* ── Card Grid View ── */
        <div className="min-h-full overflow-y-auto bg-gray-50 dark:bg-gray-950 p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8B84B]/15 dark:bg-[#E8B84B]/10">
                  <Globe className="h-4.5 w-4.5 text-[#c49830]" />
                </div>
                <h1 className="text-xl font-bold tracking-tight">Page Builder</h1>
              </div>
              <p className="mt-2 text-sm text-muted max-w-md">
                Click any page card to edit its hero copy, CTA text, and structured content blocks.
                Sub-pages appear as chips inside each card.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-500" /> Published</span>
              <span className="mx-1 text-gray-300 dark:text-gray-600">·</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /> Draft</span>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {topLevel.map((page) => (
              <PageCard key={page.id} page={page} />
            ))}
          </div>

          {topLevel.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Globe className="mb-4 h-10 w-10 text-muted opacity-30" />
              <p className="text-sm text-muted">No pages yet. Pages appear here once seeded.</p>
            </div>
          )}
          </div>
        </div>
      ) : (
        /* ── Block Editor View ── */
        <div className="flex h-[calc(100vh-56px)] flex-col overflow-hidden">
          {/* Header with breadcrumb */}
          <div className="flex items-center justify-between gap-4 border-b border-theme px-5 py-3 bg-white dark:bg-gray-900">
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => setSelectedPageId(null)}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-muted transition hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-foreground flex-shrink-0"
              >
                <ChevronRight className="h-3.5 w-3.5 rotate-180" />
                All Pages
              </button>
              <span className="text-gray-300 dark:text-gray-600 flex-shrink-0">/</span>
              <span className="text-base flex-shrink-0">{selectedPage.icon}</span>
              <div className="min-w-0">
                <h1 className="text-sm font-bold truncate">{selectedPage.title}</h1>
                <p className="text-[11px] text-muted font-mono truncate leading-none">{selectedPage.path}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => togglePublish.mutate({ id: selectedPage.id, isPublished: !selectedPage.isPublished })}
                className={cn(
                  'flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition',
                  selectedPage.isPublished
                    ? 'bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/25'
                    : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-500/25',
                )}
              >
                {selectedPage.isPublished ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                {selectedPage.isPublished ? 'Published' : 'Draft'}
              </button>
              <Link
                to={selectedPage.path}
                target="_blank"
                className="flex items-center gap-1.5 rounded-xl border border-theme px-3 py-1.5 text-xs font-semibold transition hover:border-gold/50"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Preview
              </Link>
              {canAddBlocks && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-theme px-3 py-1.5 text-xs font-semibold transition hover:border-primary/50 hover:bg-primary/5 dark:hover:border-gold/50 dark:hover:bg-gold/5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Block
                </button>
              )}
              {canAddBlocks && (
                <Button
                  variant={isDirty ? 'primary' : 'outline'}
                  onClick={saveAll}
                  disabled={saveBlock.isPending}
                  className="flex items-center gap-1.5 text-xs px-4 py-1.5"
                >
                  <Save className="h-3.5 w-3.5" />
                  {saveBlock.isPending ? 'Saving…' : 'Save Changes'}
                </Button>
              )}
            </div>
          </div>

          {/* Block list */}
          <div className="flex-1 overflow-y-auto p-6">
                {blocksLoading && !(selectedPageId && API_MANAGED_PAGES.has(selectedPageId)) ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 animate-pulse rounded-2xl bg-tint/60 dark:bg-dark-card" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 max-w-3xl">
                    {!API_MANAGED_PAGES.has(selectedPageId ?? '') && blocks.length === 0 && (
                      <GlassCard className="p-10 text-center">
                        <p className="text-muted">No content blocks yet.</p>
                        <p className="mt-1 text-xs text-muted">Click <strong>Add Block</strong> above to create the first one.</p>
                      </GlassCard>
                    )}

                    {!API_MANAGED_PAGES.has(selectedPageId ?? '') && blocks.map((block) => {
                      const val = getDraft(block)
                      const changed = block.id in drafts && drafts[block.id] !== block.value
                      const saved = savedIds.has(block.id)
                      const confirmingDelete = confirmDeleteId === block.id
                      return (
                        <GlassCard key={block.id} className={cn('p-5 transition-all', changed && 'border-gold/40', confirmingDelete && 'border-red-400/50')}>
                          <div className="mb-2 flex items-center gap-2">
                            <label className="text-sm font-semibold">{block.label}</label>
                            {changed && !saved && (
                              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                                Unsaved
                              </span>
                            )}
                            {saved && (
                              <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-bold text-green-600 dark:text-green-400">
                                <CheckCircle className="h-3 w-3" /> Saved
                              </span>
                            )}
                            <button
                              className="ml-auto rounded-lg p-1 text-muted transition hover:bg-red-500/10 hover:text-red-500"
                              title="Delete block"
                              onClick={() => setConfirmDeleteId(confirmingDelete ? null : block.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {confirmingDelete && (
                            <div className="mb-3 flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-400/30 px-4 py-3">
                              <p className="flex-1 text-xs text-red-600 dark:text-red-400 font-medium">
                                Delete <strong>{block.label}</strong>? This cannot be undone.
                              </p>
                              <button
                                className="text-xs text-muted hover:text-foreground transition"
                                onClick={() => setConfirmDeleteId(null)}
                              >
                                Cancel
                              </button>
                              <button
                                className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline transition"
                                disabled={deleteBlock.isPending}
                                onClick={() => handleDelete(block)}
                              >
                                {deleteBlock.isPending ? 'Deleting…' : 'Delete'}
                              </button>
                            </div>
                          )}

                          {block.helpText && (
                            <p className="mb-2 text-xs text-muted">{block.helpText}</p>
                          )}
                          <BlockField
                            block={block}
                            value={val}
                            onChange={(v) => setDrafts((prev) => ({ ...prev, [block.id]: v }))}
                          />
                          {changed && (
                            <div className="mt-3 flex justify-end gap-2">
                              <button
                                className="text-xs text-muted hover:text-foreground transition"
                                onClick={() => setDrafts((prev) => { const n = { ...prev }; delete n[block.id]; return n })}
                              >
                                Reset
                              </button>
                              <button
                                className="text-xs font-semibold text-primary dark:text-gold hover:underline transition"
                                onClick={() => saveBlock.mutate({ id: block.id, value: val })}
                              >
                                Save this field
                              </button>
                            </div>
                          )}
                        </GlassCard>
                      )
                    })}


                    {/* Add Block — hidden for pages managed in dedicated managers */}
                    {canAddBlocks && (
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-theme py-5 text-sm text-muted transition hover:border-primary/40 hover:text-primary dark:hover:border-gold/40 dark:hover:text-gold"
                      >
                        <Plus className="h-4 w-4" />
                        Add new content block
                      </button>
                    )}

                    {/* About — managed entirely via real API */}
                    {selectedPageId === 'pg-about' && (
                      <>
                        <hr className="my-2 border-theme" />
                        <AboutContentManager />
                        <hr className="my-2 border-theme" />
                        <CoreValuesManager />
                        <hr className="my-2 border-theme" />
                        <HistoryMilestonesManager />
                        <div className="pb-8" />
                      </>
                    )}

                    {/* Home — managed in dedicated home page content builder */}
                    {selectedPageId === 'pg-home' && (
                      <ManagerRedirectCard
                        icon="🏠"
                        title="Home Page Content"
                        description="Edit hero images, slideshow text, stats bar figures, mission/motto/vision, and the final call-to-action — all from the dedicated Home Page manager."
                        to="/dashboard/admin/site-content/home"
                      />
                    )}

                    {/* Contact — managed in dedicated contact page content builder */}
                    {selectedPageId === 'pg-contact' && (
                      <ManagerRedirectCard
                        icon="📞"
                        title="Contact Page Content"
                        description="Edit the hero image & text, phone numbers, email addresses, WhatsApp number, address, office hours, and Google Maps embed — all from the dedicated Contact Page manager."
                        to="/dashboard/admin/site-content/contact"
                      />
                    )}

                    {/* Blog — show redirect to Blog Posts manager */}
                    {selectedPageId === 'pg-blog' && (
                      <ManagerRedirectCard
                        icon="📝"
                        title="Blog Posts"
                        description="Write, publish, and manage individual blog posts — titles, content, cover images, and publish status — from the dedicated Blog Posts manager."
                        to="/dashboard/admin/blog"
                      />
                    )}

                    {/* Co-Curricular — managed in dedicated page-builder sub-route */}
                    {selectedPageId === 'pg-cocurr' && (
                      <ManagerRedirectCard
                        icon="🤸"
                        title="Co-Curricular Activities"
                        description="Edit the page hero, add categories and manage activities — all in one place."
                        to="/dashboard/admin/site-content/co-curricular"
                      />
                    )}

                    {/* Sports — managed in dedicated manager */}
                    {selectedPageId === 'pg-sports' && (
                      <ManagerRedirectCard
                        icon="🏆"
                        title="Sports Content"
                        description="Manage sports offered, player of the month, and the trophy cabinet from the dedicated Sports manager in the sidebar."
                        to="/dashboard/admin/sports"
                      />
                    )}

                    {/* Music — managed in dedicated manager */}
                    {selectedPageId === 'pg-music' && (
                      <ManagerRedirectCard
                        icon="🎵"
                        title="Music Academy Content"
                        description="Manage instruments, music faculty, and the rehearsal schedule from the dedicated Music Academy manager in the sidebar."
                        to="/dashboard/admin/music"
                      />
                    )}

                    {/* Drama & Dance — managed in dedicated manager */}
                    {selectedPageId === 'pg-drama' && (
                      <ManagerRedirectCard
                        icon="🎭"
                        title="Drama & Dance Content"
                        description="Manage dance styles, annual play archives, drama faculty, and the rehearsal schedule from the dedicated Drama & Dance manager in the sidebar."
                        to="/dashboard/admin/drama"
                      />
                    )}

                    {/* Facilities — managed in dedicated page-builder sub-route */}
                    {selectedPageId === 'pg-facilities' && (
                      <ManagerRedirectCard
                        icon="🏛"
                        title="Facilities"
                        description="Edit the page hero, add facilities, manage descriptions, highlights, images and publish status — all in one place."
                        to="/dashboard/admin/site-content/facilities"
                      />
                    )}

                    {/* Staff Directory — redirect to real Staff & Teachers manager */}
                    {selectedPageId === 'pg-staff' && (
                      <ManagerRedirectCard
                        icon="👩‍🏫"
                        title="Staff & Teachers"
                        description="Add, edit, and manage teachers and departments shown on the Staff Directory page from the dedicated Staff & Teachers manager."
                        to="/dashboard/admin/staff"
                      />
                    )}

                    {/* Academics — inline manager */}
                    {selectedPageId === 'pg-academics' && (
                      <>
                        <hr className="my-2 border-theme" />
                        <AcademicsContentManager />
                        <div className="pb-8" />
                      </>
                    )}

                    {/* Admissions — fee structure panel + redirect to applications */}
                    {selectedPageId === 'pg-admissions' && (
                      <>
                        <hr className="my-2 border-theme" />
                        <ManagerRedirectCard
                          icon="📋"
                          title="Admissions Applications"
                          description="Review, process, approve, or reject student applications from the dedicated Admissions Applications manager."
                          to="/dashboard/admin/admissions"
                        />
                        <hr className="my-2 border-theme" />
                        <FeeRowsPanel qc={queryClient} />
                        <div className="pb-8" />
                      </>
                    )}

                    {/* Why Choose Us — inline manager */}
                    {selectedPageId === 'pg-why' && (
                      <>
                        <hr className="my-2 border-theme" />
                        <WhyChooseUsManager />
                        <div className="pb-8" />
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

      {/* ── Add Block Modal ── */}
      {showAddModal && selectedPage && (
        <AddBlockModal
          pageId={selectedPage.id}
          pageTitle={selectedPage.title}
          existingSortMax={maxSortOrder}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </>
  )
}
