import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ExternalLink, ChevronRight, Save, Globe, Eye, EyeOff, CheckCircle, Plus, X, Trash2, Edit2, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { contentService } from '../../../services/contentService'
import type { CmsPage, CmsBlock, CmsBlockType, AboutCoreValue, AboutHistoryItem } from '../../../services/contentService'
import { unwrap } from '../../../services/mockApi'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Button } from '../../../components/ui/Button'
import { useToast } from '../../../contexts/ToastContext'
import { cn } from '../../../lib/utils'
import { useCreateCmsBlock, useDeleteCmsBlock } from '../../../hooks/useCmsData'

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

// ── Shared styles ─────────────────────────────────────────────────────────
const FIELD = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const BTN_GOLD = 'flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-3 py-1.5 text-xs font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60'
const BTN_GHOST = 'rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition'

// ── Core Values CRUD Panel ─────────────────────────────────────────────────
function CoreValuesPanel({ qc }: { qc: ReturnType<typeof useQueryClient> }) {
  const { showToast } = useToast()
  const { data: values = [] } = useQuery({
    queryKey: ['about-core-values'],
    queryFn: () => contentService.listCoreValues().then(unwrap),
    staleTime: 30_000,
  })

  const create = useMutation({
    mutationFn: (dto: Omit<AboutCoreValue, 'id'>) => contentService.createCoreValue(dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['about-core-values'] }); showToast('Core value added') },
  })
  const update = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<Omit<AboutCoreValue, 'id'>> }) =>
      contentService.updateCoreValue(id, dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['about-core-values'] }); showToast('Core value updated') },
  })
  const del = useMutation({
    mutationFn: (id: string) => contentService.deleteCoreValue(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['about-core-values'] }); showToast('Core value deleted') },
  })

  type Draft = { icon: string; title: string; desc: string; sortOrder: number }
  const blank: Draft = { icon: '⭐', title: '', desc: '', sortOrder: values.length + 1 }
  const [editing, setEditing] = useState<string | 'new' | null>(null)
  const [form, setForm] = useState<Draft>(blank)
  const [saving, setSaving] = useState(false)

  const openEdit = (v: AboutCoreValue) => { setForm({ icon: v.icon, title: v.title, desc: v.desc, sortOrder: v.sortOrder }); setEditing(v.id) }
  const openNew  = () => { setForm({ ...blank, sortOrder: values.length + 1 }); setEditing('new') }
  const close    = () => setEditing(null)

  const handleSave = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    try {
      if (editing === 'new') await create.mutateAsync(form)
      else if (typeof editing === 'string') await update.mutateAsync({ id: editing, dto: form })
      close()
    } finally { setSaving(false) }
  }

  return (
    <div className="mt-8 max-w-3xl space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted">Core Values</h2>
          <p className="text-xs text-muted mt-0.5">Add, edit or remove the value cards shown on the About page.</p>
        </div>
        <button onClick={openNew} className={BTN_GOLD}><Plus className="h-3.5 w-3.5" /> Add Value</button>
      </div>

      {editing === 'new' && (
        <GlassCard className="p-5 border-gold/40 space-y-3">
          <p className="text-xs font-semibold text-gold uppercase tracking-wider">New Core Value</p>
          <div className="grid grid-cols-[72px_1fr] gap-3">
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Icon</label>
              <input className={FIELD} value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="🎓" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Title <span className="text-gold">*</span></label>
              <input className={FIELD} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Innovation" autoFocus />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Description</label>
            <textarea rows={2} className={`${FIELD} resize-none`} value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="Short description shown on the card…" />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={handleSave} disabled={saving || !form.title.trim()} className={BTN_GOLD}>
              {saving ? 'Saving…' : <><Check className="h-3.5 w-3.5" /> Save</>}
            </button>
            <button onClick={close} className={BTN_GHOST}><X className="h-3.5 w-3.5" /></button>
          </div>
        </GlassCard>
      )}

      <div className="space-y-2">
        {[...values].sort((a, b) => a.sortOrder - b.sortOrder).map(v => (
          <div key={v.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            {editing === v.id ? (
              <div className="p-5 space-y-3">
                <div className="grid grid-cols-[72px_1fr] gap-3">
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Icon</label>
                    <input className={FIELD} value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Title <span className="text-gold">*</span></label>
                    <input className={FIELD} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} autoFocus />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Description</label>
                  <textarea rows={2} className={`${FIELD} resize-none`} value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} />
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={handleSave} disabled={saving || !form.title.trim()} className={BTN_GOLD}>
                    {saving ? 'Saving…' : <><Check className="h-3.5 w-3.5" /> Save</>}
                  </button>
                  <button onClick={close} className={BTN_GHOST}><X className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 px-4 py-3">
                <span className="text-2xl w-9 text-center flex-shrink-0">{v.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{v.title}</p>
                  <p className="text-xs text-muted truncate">{v.desc}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(v)} className="rounded-lg p-1.5 text-muted hover:bg-tint/60 dark:hover:bg-dark-card transition" title="Edit">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => del.mutate(v.id)} className="rounded-lg p-1.5 text-muted hover:bg-red-500/10 hover:text-red-500 transition" title="Delete">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── History Items CRUD Panel ───────────────────────────────────────────────
function HistoryItemsPanel({ qc }: { qc: ReturnType<typeof useQueryClient> }) {
  const { showToast } = useToast()
  const { data: items = [] } = useQuery({
    queryKey: ['about-history'],
    queryFn: () => contentService.listHistoryItems().then(unwrap),
    staleTime: 30_000,
  })

  const create = useMutation({
    mutationFn: (dto: Omit<AboutHistoryItem, 'id'>) => contentService.createHistoryItem(dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['about-history'] }); showToast('History milestone added') },
  })
  const update = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<Omit<AboutHistoryItem, 'id'>> }) =>
      contentService.updateHistoryItem(id, dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['about-history'] }); showToast('History milestone updated') },
  })
  const del = useMutation({
    mutationFn: (id: string) => contentService.deleteHistoryItem(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['about-history'] }); showToast('History milestone deleted') },
  })

  type Draft = { year: string; title: string; desc: string; sortOrder: number }
  const blank: Draft = { year: '', title: '', desc: '', sortOrder: items.length + 1 }
  const [editing, setEditing] = useState<string | 'new' | null>(null)
  const [form, setForm] = useState<Draft>(blank)
  const [saving, setSaving] = useState(false)

  const openEdit = (h: AboutHistoryItem) => { setForm({ year: h.year, title: h.title, desc: h.desc, sortOrder: h.sortOrder }); setEditing(h.id) }
  const openNew  = () => { setForm({ ...blank, sortOrder: items.length + 1 }); setEditing('new') }
  const close    = () => setEditing(null)

  const handleSave = async () => {
    if (!form.year.trim() || !form.title.trim()) return
    setSaving(true)
    try {
      if (editing === 'new') await create.mutateAsync(form)
      else if (typeof editing === 'string') await update.mutateAsync({ id: editing, dto: form })
      close()
    } finally { setSaving(false) }
  }

  const ItemForm = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-[100px_1fr] gap-3">
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Year <span className="text-gold">*</span></label>
          <input className={FIELD} value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} placeholder="2005" autoFocus />
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Title <span className="text-gold">*</span></label>
          <input className={FIELD} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Foundation" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Description</label>
        <textarea rows={2} className={`${FIELD} resize-none`} value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="What happened that year…" />
      </div>
      <div>
        <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Sort Order</label>
        <input type="number" min={1} className={`${FIELD} w-24`} value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} />
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={handleSave} disabled={saving || !form.year.trim() || !form.title.trim()} className={BTN_GOLD}>
          {saving ? 'Saving…' : <><Check className="h-3.5 w-3.5" /> Save</>}
        </button>
        <button onClick={close} className={BTN_GHOST}><X className="h-3.5 w-3.5" /></button>
      </div>
    </div>
  )

  return (
    <div className="mt-8 max-w-3xl space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted">Our History</h2>
          <p className="text-xs text-muted mt-0.5">Manage timeline milestones shown on the About page.</p>
        </div>
        <button onClick={openNew} className={BTN_GOLD}><Plus className="h-3.5 w-3.5" /> Add Milestone</button>
      </div>

      {editing === 'new' && (
        <GlassCard className="p-5 border-gold/40">
          <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-3">New Milestone</p>
          <ItemForm />
        </GlassCard>
      )}

      <div className="space-y-2">
        {[...items].sort((a, b) => a.sortOrder - b.sortOrder).map(h => (
          <div key={h.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            {editing === h.id ? (
              <div className="p-5"><ItemForm /></div>
            ) : (
              <div className="flex items-center gap-4 px-4 py-3">
                <span className="text-lg font-bold text-[#E8B84B] w-12 flex-shrink-0">{h.year}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{h.title}</p>
                  <p className="text-xs text-muted truncate">{h.desc}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(h)} className="rounded-lg p-1.5 text-muted hover:bg-tint/60 dark:hover:bg-dark-card transition" title="Edit">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => del.mutate(h.id)} className="rounded-lg p-1.5 text-muted hover:bg-red-500/10 hover:text-red-500 transition" title="Delete">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function PagesManager() {
  const { showToast } = useToast()
  const queryClient = useQueryClient()

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

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function PageTreeItem({ page, depth = 0 }: { page: CmsPage; depth?: number }) {
    const isSelected = selectedPageId === page.id
    const expanded = expandedIds.has(page.id)
    const kids = children(page.id)
    const hasSubs = hasChildren(page.id)
    const pub = page.isPublished

    return (
      <div>
        <div
          className={cn(
            'flex items-center gap-2 rounded-xl px-3 py-2 transition cursor-pointer select-none',
            isSelected
              ? 'bg-primary/15 dark:bg-gold/15 text-primary dark:text-gold font-semibold'
              : 'hover:bg-tint/60 dark:hover:bg-dark-card/80',
            depth > 0 && 'ml-5 border-l border-theme/40 pl-3',
          )}
          onClick={() => {
            setSelectedPageId(page.id)
            if (hasSubs) toggleExpand(page.id)
          }}
        >
          <span className="text-base">{page.icon}</span>
          <span className="flex-1 text-sm">{page.title}</span>
          {!pub && <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">DRAFT</span>}
          {hasSubs && (
            <ChevronRight className={cn('h-3.5 w-3.5 transition-transform text-muted', expanded && 'rotate-90')} />
          )}
        </div>
        {hasSubs && expanded && (
          <div className="mt-0.5 space-y-0.5">
            {kids.map((child) => (
              <PageTreeItem key={child.id} page={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        {/* ── Sidebar: Page Tree ── */}
        <aside className="hidden w-64 flex-shrink-0 flex-col overflow-y-auto border-r border-theme bg-surface md:flex">
          <div className="border-b border-theme px-4 py-4">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-gold" />
              <span className="font-bold text-sm">Site Pages</span>
            </div>
            <p className="mt-1 text-xs text-muted">Select a page to edit its content</p>
          </div>
          <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
            {topLevel.map((page) => (
              <PageTreeItem key={page.id} page={page} />
            ))}
          </nav>
        </aside>

        {/* ── Main: Block Editor ── */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {!selectedPage ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
              <Globe className="h-12 w-12 text-muted opacity-40" />
              <div>
                <p className="text-lg font-semibold">Select a page</p>
                <p className="text-sm text-muted">Choose a page from the left panel to edit its content blocks.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between gap-4 border-b border-theme px-6 py-4 bg-surface">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedPage.icon}</span>
                  <div>
                    <h1 className="text-base font-bold">{selectedPage.title}</h1>
                    <p className="text-xs text-muted font-mono">{selectedPage.path}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
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
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-theme px-3 py-1.5 text-xs font-semibold transition hover:border-primary/50 hover:bg-primary/5 dark:hover:border-gold/50 dark:hover:bg-gold/5"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Block
                  </button>
                  <Button
                    variant={isDirty ? 'primary' : 'outline'}
                    onClick={saveAll}
                    disabled={saveBlock.isPending}
                    className="flex items-center gap-1.5 text-xs px-4 py-1.5"
                  >
                    <Save className="h-3.5 w-3.5" />
                    {saveBlock.isPending ? 'Saving…' : 'Save Changes'}
                  </Button>
                </div>
              </div>

              {/* Block list */}
              <div className="flex-1 overflow-y-auto p-6">
                {blocksLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 animate-pulse rounded-2xl bg-tint/60 dark:bg-dark-card" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 max-w-3xl">
                    {blocks.length === 0 && (
                      <GlassCard className="p-10 text-center">
                        <p className="text-muted">No content blocks yet.</p>
                        <p className="mt-1 text-xs text-muted">Click <strong>Add Block</strong> above to create the first one.</p>
                      </GlassCard>
                    )}

                    {blocks.map((block) => {
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
                            <span className="rounded bg-tint/60 dark:bg-dark-card px-2 py-0.5 font-mono text-[10px] text-muted">
                              {block.type}
                            </span>
                            <span className="rounded bg-tint/60 dark:bg-dark-card px-2 py-0.5 font-mono text-[10px] text-muted">
                              {block.key}
                            </span>
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

                    {/* Always show Add Block at the bottom */}
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-theme py-5 text-sm text-muted transition hover:border-primary/40 hover:text-primary dark:hover:border-gold/40 dark:hover:text-gold"
                    >
                      <Plus className="h-4 w-4" />
                      Add new content block
                    </button>

                    {/* About-specific structured data panels */}
                    {selectedPageId === 'pg-about' && (
                      <>
                        <hr className="my-2 border-theme" />
                        <CoreValuesPanel qc={queryClient} />
                        <hr className="my-2 border-theme" />
                        <HistoryItemsPanel qc={queryClient} />
                        <div className="pb-8" />
                      </>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

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
