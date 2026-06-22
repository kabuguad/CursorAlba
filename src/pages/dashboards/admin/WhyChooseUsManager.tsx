import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, Check, X, Eye, EyeOff, ExternalLink, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import { whyChooseUsApi, type WcuItemDto, type CreateWcuItemDto, type UpdateWcuItemDto, type WcuPageContent, type UpdateWcuPageContentDto } from '../../../services/whyChooseUsApi'
import { GlassCard } from '../../../components/ui/GlassCard'
import { useToast } from '../../../contexts/ToastContext'
import { cn } from '../../../lib/utils'

const FIELD = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const BTN_GOLD = 'flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-3 py-1.5 text-xs font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60'
const BTN_GHOST = 'rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition'

const COLOR_OPTIONS = [
  { value: 'gold',   label: 'Gold' },
  { value: 'blue',   label: 'Blue' },
  { value: 'green',  label: 'Green' },
  { value: 'purple', label: 'Purple' },
  { value: 'teal',   label: 'Teal' },
  { value: 'rose',   label: 'Rose' },
  { value: 'amber',  label: 'Amber' },
]

const COLOR_DOT: Record<string, string> = {
  gold:   'bg-yellow-400',
  blue:   'bg-blue-400',
  green:  'bg-green-400',
  purple: 'bg-purple-400',
  teal:   'bg-teal-400',
  rose:   'bg-rose-400',
  amber:  'bg-amber-400',
}

type ItemDraft = Omit<CreateWcuItemDto, 'sortOrder'>

const BLANK: ItemDraft = {
  icon: '⭐',
  title: '',
  subtitle: '',
  description: '',
  stat: '',
  statLabel: '',
  color: 'gold',
  isPublished: true,
}

function ItemForm({
  form,
  setForm,
  onSave,
  onCancel,
  saving,
  isNew,
}: {
  form: ItemDraft
  setForm: React.Dispatch<React.SetStateAction<ItemDraft>>
  onSave: () => void
  onCancel: () => void
  saving: boolean
  isNew: boolean
}) {
  const set = <K extends keyof ItemDraft>(k: K, v: ItemDraft[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="space-y-4 p-5">
      {isNew && (
        <p className="text-xs font-semibold text-[#E8B84B] uppercase tracking-wider">New Reason</p>
      )}

      <div className="grid grid-cols-[80px_1fr] gap-3">
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase text-gray-500 tracking-wider">Icon</label>
          <input className={FIELD} value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="🎓" />
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase text-gray-500 tracking-wider">
            Title <span className="text-[#E8B84B]">*</span>
          </label>
          <input className={FIELD} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Academic Excellence" autoFocus />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-[10px] font-semibold uppercase text-gray-500 tracking-wider">Subtitle</label>
        <input className={FIELD} value={form.subtitle} onChange={e => set('subtitle', e.target.value)} placeholder="e.g. Top Results, Year After Year" />
      </div>

      <div>
        <label className="mb-1 block text-[10px] font-semibold uppercase text-gray-500 tracking-wider">Description</label>
        <textarea rows={3} className={`${FIELD} resize-none`} value={form.description} onChange={e => set('description', e.target.value)} placeholder="What makes this point special…" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase text-gray-500 tracking-wider">Stat Value</label>
          <input className={FIELD} value={form.stat} onChange={e => set('stat', e.target.value)} placeholder="e.g. 97%" />
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase text-gray-500 tracking-wider">Stat Label</label>
          <input className={FIELD} value={form.statLabel} onChange={e => set('statLabel', e.target.value)} placeholder="e.g. KCSE Pass Rate" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase text-gray-500 tracking-wider">Colour</label>
          <select className={FIELD} value={form.color} onChange={e => set('color', e.target.value)}>
            {COLOR_OPTIONS.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <div className="flex items-center gap-2 pb-2">
            <input
              id="published-toggle"
              type="checkbox"
              checked={form.isPublished}
              onChange={e => set('isPublished', e.target.checked)}
              className="h-4 w-4 accent-[#E8B84B]"
            />
            <label htmlFor="published-toggle" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
              Published
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button onClick={onSave} disabled={saving || !form.title.trim()} className={BTN_GOLD}>
          {saving ? 'Saving…' : <><Check className="h-3.5 w-3.5" /> Save</>}
        </button>
        <button onClick={onCancel} className={BTN_GHOST}><X className="h-3.5 w-3.5" /></button>
      </div>
    </div>
  )
}

function PageContentModal({
  initial,
  onClose,
}: {
  initial: WcuPageContent
  onClose: () => void
}) {
  const { showToast } = useToast()
  const qc = useQueryClient()
  const [form, setForm] = useState<UpdateWcuPageContentDto>({
    tagline: initial.tagline,
    headline: initial.headline,
    subheadline: initial.subheadline,
    statStudents: initial.statStudents,
    statEducators: initial.statEducators,
    statPassRate: initial.statPassRate,
    statActivities: initial.statActivities,
    ctaHeadline: initial.ctaHeadline,
    ctaSubtext: initial.ctaSubtext,
  })

  const mut = useMutation({
    mutationFn: () => whyChooseUsApi.updatePageContent(initial.whyChooseUsPageContentId, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wcu-page-content'] })
      showToast('Page content updated')
      onClose()
    },
    onError: () => showToast('Failed to update page content'),
  })

  const set = <K extends keyof UpdateWcuPageContentDto>(k: K, v: string) =>
    setForm(f => ({ ...f, [k]: v }))

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <GlassCard
        className="w-full max-w-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">Edit Page Content</h2>
          <button onClick={onClose} className="rounded-xl p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        <form onSubmit={e => { e.preventDefault(); mut.mutate() }} className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#E8B84B]">Hero Section</p>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase text-gray-500 tracking-wider">Tagline (pill label)</label>
            <input className={FIELD} value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="The Alber Difference" />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase text-gray-500 tracking-wider">Headline</label>
            <input className={FIELD} value={form.headline} onChange={e => set('headline', e.target.value)} placeholder="Why Choose Us?" />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase text-gray-500 tracking-wider">Subheadline</label>
            <textarea rows={2} className={`${FIELD} resize-none`} value={form.subheadline} onChange={e => set('subheadline', e.target.value)} />
          </div>

          <p className="text-[10px] font-bold uppercase tracking-widest text-[#E8B84B] pt-2">Stats Bar</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase text-gray-500 tracking-wider">Students Enrolled</label>
              <input className={FIELD} value={form.statStudents} onChange={e => set('statStudents', e.target.value)} placeholder="2,000+" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase text-gray-500 tracking-wider">Qualified Educators</label>
              <input className={FIELD} value={form.statEducators} onChange={e => set('statEducators', e.target.value)} placeholder="120+" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase text-gray-500 tracking-wider">KCSE Pass Rate</label>
              <input className={FIELD} value={form.statPassRate} onChange={e => set('statPassRate', e.target.value)} placeholder="97%" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase text-gray-500 tracking-wider">Co-Curricular Activities</label>
              <input className={FIELD} value={form.statActivities} onChange={e => set('statActivities', e.target.value)} placeholder="30+" />
            </div>
          </div>

          <p className="text-[10px] font-bold uppercase tracking-widest text-[#E8B84B] pt-2">Call to Action</p>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase text-gray-500 tracking-wider">CTA Headline</label>
            <input className={FIELD} value={form.ctaHeadline} onChange={e => set('ctaHeadline', e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase text-gray-500 tracking-wider">CTA Subtext</label>
            <textarea rows={2} className={`${FIELD} resize-none`} value={form.ctaSubtext} onChange={e => set('ctaSubtext', e.target.value)} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className={BTN_GHOST}>Cancel</button>
            <button type="submit" disabled={mut.isPending} className={BTN_GOLD}>
              {mut.isPending ? 'Saving…' : <><Check className="h-3.5 w-3.5" /> Save Changes</>}
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  )
}

export function WhyChooseUsManager() {
  const qc = useQueryClient()
  const { showToast } = useToast()

  const { data: pageContent, isLoading: pcLoading } = useQuery({
    queryKey: ['wcu-page-content'],
    queryFn: () => whyChooseUsApi.getPageContent(),
    staleTime: 30_000,
  })

  const { data: items = [], isLoading: itemsLoading } = useQuery({
    queryKey: ['wcu-items'],
    queryFn: () => whyChooseUsApi.getItems(),
    staleTime: 30_000,
  })

  const isLoading = pcLoading || itemsLoading

  const create = useMutation({
    mutationFn: (dto: CreateWcuItemDto) => whyChooseUsApi.createItem(dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['wcu-items'] }); showToast('Reason added') },
    onError: () => showToast('Failed to add reason'),
  })

  const update = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateWcuItemDto }) =>
      whyChooseUsApi.updateItem(id, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['wcu-items'] }); showToast('Reason updated') },
    onError: () => showToast('Failed to update reason'),
  })

  const del = useMutation({
    mutationFn: (id: number) => whyChooseUsApi.deleteItem(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['wcu-items'] }); showToast('Reason deleted') },
    onError: () => showToast('Failed to delete reason'),
  })

  const togglePublish = useMutation({
    mutationFn: ({ id, val }: { id: number; val: boolean }) =>
      whyChooseUsApi.patchItem(id, { isPublished: val }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wcu-items'] }),
    onError: () => showToast('Failed to update visibility'),
  })

  // patchItem falls back to full PUT if API doesn't support PATCH
  

  const [editing, setEditing] = useState<number | 'new' | null>(null)
  const [form, setForm] = useState<ItemDraft>({ ...BLANK })
  const [saving, setSaving] = useState(false)
  const [showPageContentModal, setShowPageContentModal] = useState(false)

  const openNew = () => {
    setForm({ ...BLANK })
    setEditing('new')
  }

  const openEdit = (item: WcuItemDto) => {
    setForm({
      icon: item.icon,
      title: item.title,
      subtitle: item.subtitle,
      description: item.description,
      stat: item.stat,
      statLabel: item.statLabel,
      color: item.color,
      isPublished: item.isPublished,
    })
    setEditing(item.whyChooseUsItemId)
  }

  const close = () => setEditing(null)

  const handleSave = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    try {
      if (editing === 'new') {
        await create.mutateAsync({
          ...form,
          sortOrder: items.length + 1,
        })
      } else if (typeof editing === 'number') {
        const existing = items.find(i => i.whyChooseUsItemId === editing)
        await update.mutateAsync({
          id: editing,
          dto: {
            ...form,
            sortOrder: existing?.sortOrder ?? items.length,
          },
        })
      }
      close()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {showPageContentModal && pageContent && (
        <PageContentModal initial={pageContent} onClose={() => setShowPageContentModal(false)} />
      )}

      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Why Choose Us</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage "The Alber Difference" reasons shown on the public Why Choose Us page.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowPageContentModal(true)}
            disabled={pcLoading || !pageContent}
            className={BTN_GHOST}
          >
            <Settings className="h-3.5 w-3.5 mr-1" /> Page Content
          </button>
          <Link
            to="/why-choose-us"
            target="_blank"
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <ExternalLink className="h-3.5 w-3.5" /> View Page
          </Link>
          <button onClick={openNew} className={BTN_GOLD}>
            <Plus className="h-3.5 w-3.5" /> Add Reason
          </button>
        </div>
      </div>

      {/* Page content preview strip */}
      {pageContent && !pcLoading && (
        <GlassCard className="mb-6 p-4 border-[#E8B84B]/20" hover={false}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#E8B84B] mb-1">Page Content</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{pageContent.headline}</p>
              <p className="text-xs text-gray-500 truncate mt-0.5">{pageContent.subheadline}</p>
              <div className="mt-2 flex flex-wrap gap-3">
                {[
                  { label: 'Students', value: pageContent.statStudents },
                  { label: 'Educators', value: pageContent.statEducators },
                  { label: 'Pass Rate', value: pageContent.statPassRate },
                  { label: 'Activities', value: pageContent.statActivities },
                ].map(s => (
                  <span key={s.label} className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-bold text-[#E8B84B]">{s.value}</span> {s.label}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => setShowPageContentModal(true)}
              className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              title="Edit page content"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </GlassCard>
      )}

      {/* Summary strip */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        {[
          { label: 'Total Reasons', value: items.length },
          { label: 'Published', value: items.filter(i => i.isPublished).length },
          { label: 'Draft', value: items.filter(i => !i.isPublished).length },
        ].map(s => (
          <GlassCard key={s.label} className="p-4 text-center" hover={false}>
            <p className="text-2xl font-black text-[#E8B84B]">{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* New item form */}
      {editing === 'new' && (
        <GlassCard className="mb-6 border-[#E8B84B]/40" hover={false}>
          <ItemForm form={form} setForm={setForm} onSave={handleSave} onCancel={close} saving={saving} isNew />
        </GlassCard>
      )}

      {/* Items list */}
      {isLoading ? (
        <div className="py-16 text-center text-sm text-gray-500">Loading…</div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 py-16 text-center">
          <p className="text-3xl mb-3">🏫</p>
          <p className="text-sm font-medium text-gray-500">No reasons yet</p>
          <p className="text-xs text-gray-400 mt-1">Click "Add Reason" to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...items].sort((a, b) => a.sortOrder - b.sortOrder).map(item => (
            <div
              key={item.whyChooseUsItemId}
              className={cn(
                'rounded-2xl border bg-white dark:bg-gray-800 overflow-hidden transition',
                !item.isPublished && 'opacity-60',
                editing === item.whyChooseUsItemId
                  ? 'border-[#E8B84B]/40'
                  : 'border-gray-200 dark:border-gray-700',
              )}
            >
              {editing === item.whyChooseUsItemId ? (
                <ItemForm form={form} setForm={setForm} onSave={handleSave} onCancel={close} saving={saving} isNew={false} />
              ) : (
                <div className="flex items-center gap-4 px-4 py-3">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className={`h-2.5 w-2.5 rounded-full ${COLOR_DOT[item.color] ?? 'bg-gray-400'}`} />
                    <span className="text-2xl w-8 text-center">{item.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold truncate">{item.title}</p>
                      {!item.isPublished && (
                        <span className="shrink-0 rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-[10px] font-bold uppercase text-gray-500">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.subtitle}</p>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-1">
                    <span className="hidden sm:block text-xs font-bold text-[#E8B84B] mr-2">{item.stat}</span>
                    <button
                      onClick={() => togglePublish.mutate({ id: item.whyChooseUsItemId, val: !item.isPublished })}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      title={item.isPublished ? 'Unpublish' : 'Publish'}
                    >
                      {item.isPublished
                        ? <Eye className="h-3.5 w-3.5 text-green-500" />
                        : <EyeOff className="h-3.5 w-3.5" />
                      }
                    </button>
                    <button
                      onClick={() => openEdit(item)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      title="Edit"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => del.mutate(item.whyChooseUsItemId)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
