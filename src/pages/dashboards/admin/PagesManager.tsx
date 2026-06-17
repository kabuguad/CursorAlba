import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ExternalLink, ChevronRight, Save, Globe, Eye, EyeOff, CheckCircle, Plus, X, Trash2, Edit2, Check, ChevronUp, ChevronDown, Layers } from 'lucide-react'
import { Link } from 'react-router-dom'
import { contentService } from '../../../services/contentService'
import type { CmsPage, CmsBlock, CmsBlockType, AboutCoreValue, AboutHistoryItem, AcademicsSchoolLevel, PublicFeeRow } from '../../../services/contentService'
import { unwrap } from '../../../services/mockApi'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Button } from '../../../components/ui/Button'
import { useToast } from '../../../contexts/ToastContext'
import { cn } from '../../../lib/utils'
import { useCreateCmsBlock, useDeleteCmsBlock } from '../../../hooks/useCmsData'
import { LEVEL_COLOR_MAP } from '../../../lib/academicsColors'
import type { AcademicsCompetency, Facility } from '../../../services/contentService'
import { usePillars } from '../../../contexts/PillarsContext'
import { GRADIENT_MAP, type Pillar } from '../../../data/pillars'

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

const COLOR_OPTIONS = Object.keys(LEVEL_COLOR_MAP)

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

// ── CBC Competencies CRUD Panel ───────────────────────────────────────────
function CompetenciesPanel({ qc }: { qc: ReturnType<typeof useQueryClient> }) {
  const { showToast } = useToast()
  const { data: items = [] } = useQuery({
    queryKey: ['academics-competencies'],
    queryFn: () => contentService.listCompetencies().then(unwrap),
    staleTime: 30_000,
  })

  const create = useMutation({
    mutationFn: (dto: Omit<AcademicsCompetency, 'id'>) => contentService.createCompetency(dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['academics-competencies'] }); showToast('Competency added') },
  })
  const update = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<Omit<AcademicsCompetency, 'id'>> }) =>
      contentService.updateCompetency(id, dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['academics-competencies'] }); showToast('Competency updated') },
  })
  const del = useMutation({
    mutationFn: (id: string) => contentService.deleteCompetency(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['academics-competencies'] }); showToast('Competency deleted') },
  })

  type Draft = { icon: string; title: string; desc: string; isFeatured: boolean; sortOrder: number }
  const blank: Draft = { icon: '⭐', title: '', desc: '', isFeatured: false, sortOrder: items.length + 1 }
  const [editing, setEditing] = useState<string | 'new' | null>(null)
  const [form, setForm] = useState<Draft>(blank)
  const [saving, setSaving] = useState(false)

  const openEdit = (c: AcademicsCompetency) => {
    setForm({ icon: c.icon, title: c.title, desc: c.desc, isFeatured: c.isFeatured, sortOrder: c.sortOrder })
    setEditing(c.id)
  }
  const openNew = () => { setForm({ ...blank, sortOrder: items.length + 1 }); setEditing('new') }
  const close   = () => setEditing(null)

  const handleSave = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    try {
      if (editing === 'new') await create.mutateAsync(form)
      else if (typeof editing === 'string') await update.mutateAsync({ id: editing, dto: form })
      close()
    } finally { setSaving(false) }
  }

  function CompForm() {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-[64px_1fr] gap-3">
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Icon</label>
            <input className={FIELD} value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="💡" />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Title <span className="text-gold">*</span></label>
            <input className={FIELD} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Digital Literacy" autoFocus />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Description</label>
          <textarea rows={3} className={`${FIELD} resize-none`} value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="What this competency means for learners…" />
        </div>
        <div className="flex items-center gap-6">
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Sort Order</label>
            <input type="number" min={1} className={`${FIELD} w-24`} value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} />
          </div>
          <div className="flex items-center gap-2 pt-4">
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, isFeatured: !f.isFeatured }))}
              className={cn(
                'relative h-5 w-9 rounded-full transition-colors',
                form.isFeatured ? 'bg-[#E8B84B]' : 'bg-gray-300 dark:bg-gray-600',
              )}
            >
              <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform', form.isFeatured ? 'translate-x-4' : 'translate-x-0.5')} />
            </button>
            <span className="text-xs text-muted">Featured <span className="text-[10px]">(wide gold-gradient card)</span></span>
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <button onClick={handleSave} disabled={saving || !form.title.trim()} className={BTN_GOLD}>
            {saving ? 'Saving…' : <><Check className="h-3.5 w-3.5" /> Save</>}
          </button>
          <button onClick={close} className={BTN_GHOST}><X className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 max-w-3xl space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted">CBC Competencies</h2>
          <p className="text-xs text-muted mt-0.5">Manage the competency cards in the "Our Approach / CBC Difference" section. Toggle <strong>Featured</strong> to display a card in the wider gold-accent style.</p>
        </div>
        <button onClick={openNew} className={BTN_GOLD}><Plus className="h-3.5 w-3.5" /> Add Competency</button>
      </div>

      {editing === 'new' && (
        <GlassCard className="p-5 border-gold/40">
          <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-3">New Competency</p>
          <CompForm />
        </GlassCard>
      )}

      <div className="space-y-2">
        {[...items].sort((a, b) => a.sortOrder - b.sortOrder).map(c => (
          <div key={c.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            {editing === c.id ? (
              <div className="p-5"><CompForm /></div>
            ) : (
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-2xl w-8 text-center flex-shrink-0">{c.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold truncate">{c.title}</p>
                    {c.isFeatured && (
                      <span className="rounded-full bg-[#E8B84B]/20 px-2 py-0.5 text-[10px] font-bold text-[#c49830]">Featured</span>
                    )}
                  </div>
                  <p className="text-xs text-muted truncate">{c.desc}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(c)} className="rounded-lg p-1.5 text-muted hover:bg-tint/60 dark:hover:bg-dark-card transition" title="Edit">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => del.mutate(c.id)} className="rounded-lg p-1.5 text-muted hover:bg-red-500/10 hover:text-red-500 transition" title="Delete">
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

// ── School Levels CRUD Panel ───────────────────────────────────────────────
function SchoolLevelsPanel({ qc }: { qc: ReturnType<typeof useQueryClient> }) {
  const { showToast } = useToast()
  const { data: levels = [] } = useQuery({
    queryKey: ['academics-school-levels'],
    queryFn: () => contentService.listSchoolLevels().then(unwrap),
    staleTime: 30_000,
  })

  const create = useMutation({
    mutationFn: (dto: Omit<AcademicsSchoolLevel, 'id'>) => contentService.createSchoolLevel(dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['academics-school-levels'] }); showToast('School level added') },
  })
  const update = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<Omit<AcademicsSchoolLevel, 'id'>> }) =>
      contentService.updateSchoolLevel(id, dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['academics-school-levels'] }); showToast('School level updated') },
  })
  const del = useMutation({
    mutationFn: (id: string) => contentService.deleteSchoolLevel(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['academics-school-levels'] }); showToast('School level deleted') },
  })

  type Draft = Omit<AcademicsSchoolLevel, 'id'>
  const blank: Draft = { slug: '', name: '', ages: '', icon: '📚', colorKey: 'blue', desc: '', highlights: '', sortOrder: levels.length + 1 }
  const [editing, setEditing] = useState<string | 'new' | null>(null)
  const [form, setForm] = useState<Draft>(blank)
  const [saving, setSaving] = useState(false)

  const slugify = (s: string) => s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const [slugTouched, setSlugTouched] = useState(false)

  const openEdit = (s: AcademicsSchoolLevel) => {
    setForm({ slug: s.slug, name: s.name, ages: s.ages, icon: s.icon, colorKey: s.colorKey, desc: s.desc, highlights: s.highlights, sortOrder: s.sortOrder })
    setSlugTouched(true)
    setEditing(s.id)
  }
  const openNew = () => {
    setForm({ ...blank, sortOrder: levels.length + 1 })
    setSlugTouched(false)
    setEditing('new')
  }
  const close = () => setEditing(null)

  const handleNameChange = (v: string) => {
    setForm(f => ({ ...f, name: v, slug: slugTouched ? f.slug : slugify(v) }))
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) return
    setSaving(true)
    try {
      if (editing === 'new') await create.mutateAsync(form)
      else if (typeof editing === 'string') await update.mutateAsync({ id: editing, dto: form })
      close()
    } finally { setSaving(false) }
  }

  function LevelForm() {
    return (
      <div className="space-y-4">
        {/* Row 1: icon + name */}
        <div className="grid grid-cols-[64px_1fr] gap-3">
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Icon</label>
            <input className={FIELD} value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="📚" />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Name <span className="text-gold">*</span></label>
            <input className={FIELD} value={form.name} onChange={e => handleNameChange(e.target.value)} placeholder="e.g. Junior School" autoFocus />
          </div>
        </div>
        {/* Row 2: slug + ages */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Slug <span className="text-gold">*</span></label>
            <input className={`${FIELD} font-mono text-xs`} value={form.slug} onChange={e => { setSlugTouched(true); setForm(f => ({ ...f, slug: e.target.value })) }} placeholder="junior-school" />
            <p className="mt-0.5 text-[10px] text-muted">Used as the tab identifier — lowercase, hyphens only</p>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Ages / Grades</label>
            <input className={FIELD} value={form.ages} onChange={e => setForm(f => ({ ...f, ages: e.target.value }))} placeholder="e.g. Grades 7 – 9 · Ages 12 – 14" />
          </div>
        </div>
        {/* Row 3: colour picker */}
        <div>
          <label className="mb-2 block text-[10px] font-semibold uppercase text-muted tracking-wider">Card Colour</label>
          <div className="flex flex-wrap gap-2">
            {COLOR_OPTIONS.map(ck => {
              const { color, border } = LEVEL_COLOR_MAP[ck]
              return (
                <button
                  key={ck}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, colorKey: ck }))}
                  className={cn(
                    'h-8 w-8 rounded-lg border-2 bg-gradient-to-br transition-all',
                    color,
                    form.colorKey === ck ? 'border-gold scale-110 shadow-md' : border,
                  )}
                  title={ck}
                />
              )
            })}
            <span className="self-center ml-2 text-xs text-muted capitalize">{form.colorKey}</span>
          </div>
        </div>
        {/* Row 4: description */}
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Description</label>
          <textarea rows={3} className={`${FIELD} resize-none`} value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="One or two sentences shown under the level name…" />
        </div>
        {/* Row 5: learning areas */}
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Learning Areas <span className="font-normal text-muted">(one per line)</span></label>
          <textarea rows={5} className={`${FIELD} resize-none font-mono text-xs`} value={form.highlights} onChange={e => setForm(f => ({ ...f, highlights: e.target.value }))} placeholder={'English\nKiswahili\nMathematics\n…'} />
        </div>
        {/* Row 6: sort order */}
        <div className="flex items-center gap-3">
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Sort Order</label>
            <input type="number" min={1} className={`${FIELD} w-24`} value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} />
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <button onClick={handleSave} disabled={saving || !form.name.trim() || !form.slug.trim()} className={BTN_GOLD}>
            {saving ? 'Saving…' : <><Check className="h-3.5 w-3.5" /> Save Level</>}
          </button>
          <button onClick={close} className={BTN_GHOST}><X className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 max-w-3xl space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted">School Structure</h2>
          <p className="text-xs text-muted mt-0.5">Manage the level tabs shown in the School Structure selector on the Academics page.</p>
        </div>
        <button onClick={openNew} className={BTN_GOLD}><Plus className="h-3.5 w-3.5" /> Add Level</button>
      </div>

      {editing === 'new' && (
        <GlassCard className="p-5 border-gold/40">
          <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-4">New School Level</p>
          <LevelForm />
        </GlassCard>
      )}

      <div className="space-y-2">
        {[...levels].sort((a, b) => a.sortOrder - b.sortOrder).map(s => {
          const colors = LEVEL_COLOR_MAP[s.colorKey] ?? LEVEL_COLOR_MAP['blue']
          return (
            <div key={s.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
              {editing === s.id ? (
                <div className="p-5">
                  <LevelForm />
                </div>
              ) : (
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className={cn('flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-xl', colors.color)}>
                    {s.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{s.name}</p>
                    <p className="text-xs text-muted">{s.ages}</p>
                  </div>
                  <span className="hidden sm:block text-[10px] font-mono text-muted bg-tint/60 dark:bg-dark-card px-2 py-1 rounded">{s.slug}</span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => openEdit(s)} className="rounded-lg p-1.5 text-muted hover:bg-tint/60 dark:hover:bg-dark-card transition" title="Edit">
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => del.mutate(s.id)} className="rounded-lg p-1.5 text-muted hover:bg-red-500/10 hover:text-red-500 transition" title="Delete">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Redirect card helper ────────────────────────────────────────────────────

function ManagerRedirectCard({ icon, title, description, to }: { icon: string; title: string; description: string; to: string }) {
  return (
    <div className="mt-8 max-w-3xl">
      <div className="rounded-2xl border-2 border-dashed border-primary/30 dark:border-gold/30 bg-primary/5 dark:bg-gold/5 p-6">
        <div className="flex items-start gap-4">
          <span className="text-3xl flex-shrink-0">{icon}</span>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-primary dark:text-gold uppercase tracking-widest mb-1">{title}</h3>
            <p className="text-xs text-muted mb-4">{description}</p>
            <Link
              to={to}
              className="inline-flex items-center gap-2 rounded-xl bg-primary dark:bg-gold text-white dark:text-dark px-4 py-2 text-xs font-semibold transition hover:opacity-90"
            >
              Open dedicated manager →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Facilities CRUD Panel ──────────────────────────────────────────────────
function FacilitiesPanel({ qc }: { qc: ReturnType<typeof useQueryClient> }) {
  const { showToast } = useToast()

  const { data: items = [] } = useQuery({
    queryKey: ['facilities'],
    queryFn: () => contentService.listFacilities().then(unwrap),
    staleTime: 30_000,
  })

  const create = useMutation({
    mutationFn: (dto: Omit<Facility, 'id'>) => contentService.createFacility(dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['facilities'] }); showToast('Facility added') },
  })
  const update = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<Omit<Facility, 'id'>> }) =>
      contentService.updateFacility(id, dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['facilities'] }); showToast('Facility saved') },
  })
  const del = useMutation({
    mutationFn: (id: string) => contentService.deleteFacility(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['facilities'] }); showToast('Facility deleted') },
  })

  type Draft = Omit<Facility, 'id'>
  const blank: Draft = { name: '', icon: '🏫', desc: '', img: '', highlights: '', sortOrder: items.length + 1, isPublished: true }
  const [editing, setEditing] = useState<string | 'new' | null>(null)
  const [form, setForm] = useState<Draft>(blank)
  const [saving, setSaving] = useState(false)

  const openEdit = (f: Facility) => {
    setForm({ name: f.name, icon: f.icon, desc: f.desc, img: f.img, highlights: f.highlights, sortOrder: f.sortOrder, isPublished: f.isPublished })
    setEditing(f.id)
  }
  const openNew = () => { setForm({ ...blank, sortOrder: items.length + 1 }); setEditing('new') }
  const close   = () => setEditing(null)

  const handleSave = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      if (editing === 'new') await create.mutateAsync(form)
      else if (typeof editing === 'string') await update.mutateAsync({ id: editing, dto: form })
      close()
    } finally { setSaving(false) }
  }

  function FacilityForm() {
    return (
      <div className="space-y-4">
        {/* Row 1: icon + name */}
        <div className="grid grid-cols-[64px_1fr] gap-3">
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Icon</label>
            <input className={FIELD} value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="🏫" />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Name <span className="text-gold">*</span></label>
            <input className={FIELD} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Science Laboratories" autoFocus />
          </div>
        </div>

        {/* Row 2: description */}
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Description</label>
          <textarea rows={3} className={`${FIELD} resize-none`} value={form.desc}
            onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
            placeholder="Short paragraph shown in the facility detail modal…" />
        </div>

        {/* Row 3: image URL */}
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Image URL</label>
          <input className={FIELD} type="url" value={form.img} onChange={e => setForm(f => ({ ...f, img: e.target.value }))} placeholder="https://…" />
          {form.img && (
            <img src={form.img} alt="preview" className="mt-2 h-24 w-full rounded-xl object-cover"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
          )}
        </div>

        {/* Row 4: highlights */}
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">
            Highlights <span className="font-normal text-muted">(one per line — shown as tags)</span>
          </label>
          <textarea rows={4} className={`${FIELD} resize-none font-mono text-xs`} value={form.highlights}
            onChange={e => setForm(f => ({ ...f, highlights: e.target.value }))}
            placeholder={'Interactive whiteboards\nHigh-speed fibre internet\nAir-conditioned\nCCTV monitored'} />
        </div>

        {/* Row 5: sort order + publish toggle */}
        <div className="flex items-center gap-6">
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Sort Order</label>
            <input type="number" min={1} className={`${FIELD} w-24`} value={form.sortOrder}
              onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} />
          </div>
          <div className="flex items-center gap-2 pt-4">
            <button type="button"
              onClick={() => setForm(f => ({ ...f, isPublished: !f.isPublished }))}
              className={cn('relative h-5 w-9 rounded-full transition-colors', form.isPublished ? 'bg-[#E8B84B]' : 'bg-gray-300 dark:bg-gray-600')}>
              <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform', form.isPublished ? 'translate-x-4' : 'translate-x-0.5')} />
            </button>
            <span className="text-xs text-muted">Published <span className="text-[10px]">(visible on public site)</span></span>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={handleSave} disabled={saving || !form.name.trim()} className={BTN_GOLD}>
            {saving ? 'Saving…' : <><Check className="h-3.5 w-3.5" /> Save</>}
          </button>
          <button onClick={close} className={BTN_GHOST}><X className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 max-w-3xl space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted">Facilities</h2>
          <p className="text-xs text-muted mt-0.5">Each card appears on the public Facilities page. Click a card to open a detail modal with image, description, and highlight tags.</p>
        </div>
        <button onClick={openNew} className={BTN_GOLD}><Plus className="h-3.5 w-3.5" /> Add Facility</button>
      </div>

      {editing === 'new' && (
        <GlassCard className="p-5 border-gold/40">
          <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-3">New Facility</p>
          <FacilityForm />
        </GlassCard>
      )}

      <div className="space-y-2">
        {[...items].sort((a, b) => a.sortOrder - b.sortOrder).map(f => (
          <div key={f.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            {editing === f.id ? (
              <div className="p-5"><FacilityForm /></div>
            ) : (
              <div className="flex items-center gap-3 px-4 py-3">
                {f.img ? (
                  <img src={f.img} alt={f.name} className="h-12 w-16 flex-shrink-0 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-12 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-2xl">{f.icon}</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{f.icon}</span>
                    <p className="text-sm font-semibold truncate">{f.name}</p>
                    {!f.isPublished && (
                      <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">DRAFT</span>
                    )}
                  </div>
                  <p className="text-xs text-muted truncate">{f.desc}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(f)} className="rounded-lg p-1.5 text-muted hover:bg-tint/60 dark:hover:bg-dark-card transition" title="Edit">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => del.mutate(f.id)} className="rounded-lg p-1.5 text-muted hover:bg-red-500/10 hover:text-red-500 transition" title="Delete">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {items.length === 0 && editing === null && (
        <button onClick={openNew}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-theme py-8 text-sm text-muted transition hover:border-gold/50 hover:text-gold">
          <Plus className="h-4 w-4" /> Add your first facility
        </button>
      )}
    </div>
  )
}

// ── Teaching Pillars CRUD Panel ────────────────────────────────────────────
const BLANK_PILLAR: Omit<Pillar, 'id'> = { icon: '📌', title: '', desc: '', gradient: 'green' }

function TeachingPillarsPanel() {
  const { showToast } = useToast()
  const { pillars, updatePillars } = usePillars()
  const [editing, setEditing] = useState<string | 'new' | null>(null)
  const [draft, setDraft] = useState<Omit<Pillar, 'id'>>(BLANK_PILLAR)

  const openEdit = (p: Pillar) => { setDraft({ icon: p.icon, title: p.title, desc: p.desc, gradient: p.gradient }); setEditing(p.id) }
  const openNew  = () => { setDraft({ ...BLANK_PILLAR }); setEditing('new') }
  const close    = () => setEditing(null)

  const save = () => {
    if (!draft.title.trim()) return showToast('Title is required')
    const next = editing === 'new'
      ? [...pillars, { ...draft, id: `p-${Date.now()}` }]
      : pillars.map(p => p.id === editing ? { ...draft, id: p.id } : p)
    updatePillars(next)
    showToast(editing === 'new' ? 'Pillar added ✓' : 'Pillar updated ✓')
    close()
  }

  const del = (id: string) => {
    if (!confirm('Delete this pillar?')) return
    updatePillars(pillars.filter(p => p.id !== id))
    showToast('Pillar deleted')
  }

  const move = (id: string, dir: -1 | 1) => {
    const idx = pillars.findIndex(p => p.id === id)
    const next = [...pillars]
    const swap = idx + dir
    if (swap < 0 || swap >= next.length) return
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    updatePillars(next)
  }

  function PillarForm() {
    const g = GRADIENT_MAP[draft.gradient] ?? GRADIENT_MAP.green
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-[64px_1fr] gap-3">
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Icon</label>
            <input className={FIELD} value={draft.icon} onChange={e => setDraft(d => ({ ...d, icon: e.target.value }))} placeholder="🌱" />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Title <span className="text-gold">*</span></label>
            <input className={FIELD} value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} placeholder="e.g. Holistic Development" autoFocus />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase text-muted tracking-wider">Description</label>
          <textarea rows={3} className={`${FIELD} resize-none`} value={draft.desc} onChange={e => setDraft(d => ({ ...d, desc: e.target.value }))} placeholder="What this pillar means for learners…" />
        </div>
        <div>
          <label className="mb-2 block text-[10px] font-semibold uppercase text-muted tracking-wider">Card Gradient</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(GRADIENT_MAP).map(([key, gm]) => (
              <button key={key} type="button" onClick={() => setDraft(d => ({ ...d, gradient: key }))}
                className={cn('flex items-center gap-1.5 rounded-lg border-2 px-2.5 py-1 text-[11px] font-semibold transition',
                  draft.gradient === key ? 'border-gold scale-105 shadow-sm' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-500')}>
                <span className="h-3 w-3 rounded-full ring-1 ring-black/10" style={{ backgroundColor: gm.preview }} />
                {gm.label}
              </button>
            ))}
          </div>
          <div className={cn('mt-3 flex items-start gap-4 rounded-2xl border bg-gradient-to-br p-4', g.color, g.border)}>
            <span className="text-3xl">{draft.icon || '📌'}</span>
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-sm">{draft.title || 'Pillar Title'}</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{draft.desc || 'Description will appear here.'}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <button onClick={save} disabled={!draft.title.trim()} className={BTN_GOLD}><Check className="h-3.5 w-3.5" /> Save</button>
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
            <Layers className="h-4 w-4 text-gold" /> Teaching Pillars
          </h2>
          <p className="text-xs text-muted mt-0.5">The philosophy cards shown in the Teaching Approach section of the Academics page.</p>
        </div>
        <button onClick={openNew} className={BTN_GOLD}><Plus className="h-3.5 w-3.5" /> Add Pillar</button>
      </div>

      {editing === 'new' && (
        <GlassCard className="p-5 border-gold/40">
          <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-3">New Teaching Pillar</p>
          <PillarForm />
        </GlassCard>
      )}

      <div className="space-y-2">
        {pillars.map((p, i) => {
          const gm = GRADIENT_MAP[p.gradient] ?? GRADIENT_MAP.green
          return (
            <div key={p.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
              {editing === p.id ? (
                <div className="p-5"><PillarForm /></div>
              ) : (
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className={cn('flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br text-2xl', gm.color, gm.border)}>
                    {p.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{p.title}</p>
                    <p className="text-xs text-muted truncate">{p.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => move(p.id, -1)} disabled={i === 0} className="rounded-lg p-1.5 text-muted hover:bg-tint/60 dark:hover:bg-dark-card disabled:opacity-30 transition"><ChevronUp className="h-3.5 w-3.5" /></button>
                    <button onClick={() => move(p.id, 1)} disabled={i === pillars.length - 1} className="rounded-lg p-1.5 text-muted hover:bg-tint/60 dark:hover:bg-dark-card disabled:opacity-30 transition"><ChevronDown className="h-3.5 w-3.5" /></button>
                    <button onClick={() => openEdit(p)} className="rounded-lg p-1.5 text-muted hover:bg-tint/60 dark:hover:bg-dark-card transition"><Edit2 className="h-3.5 w-3.5" /></button>
                    <button onClick={() => del(p.id)} className="rounded-lg p-1.5 text-muted hover:bg-red-500/10 hover:text-red-500 transition"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {pillars.length === 0 && editing === null && (
        <button onClick={openNew}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-theme py-8 text-sm text-muted transition hover:border-gold/50 hover:text-gold">
          <Plus className="h-4 w-4" /> Add your first teaching pillar
        </button>
      )}
    </div>
  )
}

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

                    {/* Co-Curricular — managed in dedicated manager */}
                    {selectedPageId === 'pg-cocurr' && (
                      <ManagerRedirectCard
                        icon="🤸"
                        title="Co-Curricular Activities"
                        description="Add, edit, and organise all co-curricular activities (Sports, Arts, Community, Career & Technical) from the dedicated manager in the sidebar."
                        to="/dashboard/admin/co-curricular"
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

                    {/* Facilities-specific structured data panel */}
                    {selectedPageId === 'pg-facilities' && (
                      <>
                        <hr className="my-2 border-theme" />
                        <FacilitiesPanel qc={queryClient} />
                        <div className="pb-8" />
                      </>
                    )}

                    {/* Academics-specific structured data panels */}
                    {selectedPageId === 'pg-academics' && (
                      <>
                        <hr className="my-2 border-theme" />
                        <SchoolLevelsPanel qc={queryClient} />
                        <hr className="my-2 border-theme" />
                        <CompetenciesPanel qc={queryClient} />
                        <hr className="my-2 border-theme" />
                        <TeachingPillarsPanel />
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

                    {/* Staff Directory — redirect to dedicated manager */}
                    {selectedPageId === 'pg-staff' && (
                      <ManagerRedirectCard
                        icon="👩‍🏫"
                        title="Staff Directory"
                        description="Add, edit, and manage public staff profiles shown on the Staff Directory page from the dedicated Staff Directory manager."
                        to="/dashboard/admin/public-staff"
                      />
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
