import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Save, Plus, Pencil, Trash2, Loader2, WifiOff, X, Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  whyChooseUsApi,
  type WcuPageContent,
  type UpdateWcuPageContentDto,
  type WcuItemDto,
  type CreateWcuItemDto,
  type UpdateWcuItemDto,
} from '../../../services/whyChooseUsApi'
import { useToast } from '../../../contexts/ToastContext'

const FIELD = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'
const BTN_GOLD = 'flex items-center gap-1.5 rounded-xl bg-[#E8B84B] px-4 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60'
const BTN_GHOST = 'flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition'

type Tab = 'content' | 'items'
const TABS: { id: Tab; label: string }[] = [
  { id: 'content', label: 'Page Content' },
  { id: 'items',   label: 'Items' },
]

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-4 text-center px-6">
      <WifiOff className="h-8 w-8 text-gray-400" />
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">{message}</p>
      <button onClick={onRetry} className={BTN_GOLD}><Loader2 className="h-3.5 w-3.5" /> Retry</button>
    </div>
  )
}

// ── Page Content Section ───────────────────────────────────────────────────
function PageContentSection({ item }: { item: WcuPageContent }) {
  const qc = useQueryClient()
  const { showToast } = useToast()
  const [form, setForm] = useState<UpdateWcuPageContentDto>({
    tagline: item.tagline,
    headline: item.headline,
    subheadline: item.subheadline,
    statStudents: item.statStudents,
    statEducators: item.statEducators,
    statPassRate: item.statPassRate,
    statActivities: item.statActivities,
    ctaHeadline: item.ctaHeadline,
    ctaSubtext: item.ctaSubtext,
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setForm({
      tagline: item.tagline,
      headline: item.headline,
      subheadline: item.subheadline,
      statStudents: item.statStudents,
      statEducators: item.statEducators,
      statPassRate: item.statPassRate,
      statActivities: item.statActivities,
      ctaHeadline: item.ctaHeadline,
      ctaSubtext: item.ctaSubtext,
    })
  }, [item.whyChooseUsPageContentId])

  const mut = useMutation({
    mutationFn: () => whyChooseUsApi.updatePageContent(item.whyChooseUsPageContentId, form),
    onSuccess: (updated) => {
      qc.setQueryData(['admin-wcu-content'], updated)
      showToast('Why Choose Us page content saved ✓')
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    },
    onError: () => showToast('Failed to save — check API connection'),
  })

  const set = (k: keyof UpdateWcuPageContentDto, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#E8B84B]">Hero Text</p>
        <div>
          <label className={LABEL}>Tagline</label>
          <input className={FIELD} value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="Why Alber School?" />
        </div>
        <div>
          <label className={LABEL}>Headline</label>
          <input className={FIELD} value={form.headline} onChange={e => set('headline', e.target.value)} />
        </div>
        <div>
          <label className={LABEL}>Subheadline</label>
          <textarea rows={3} className={FIELD} value={form.subheadline} onChange={e => set('subheadline', e.target.value)} />
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#E8B84B]">Stats Bar</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Students</label>
            <input className={FIELD} value={form.statStudents} onChange={e => set('statStudents', e.target.value)} placeholder="1,200+" />
          </div>
          <div>
            <label className={LABEL}>Educators</label>
            <input className={FIELD} value={form.statEducators} onChange={e => set('statEducators', e.target.value)} placeholder="80+" />
          </div>
          <div>
            <label className={LABEL}>Pass Rate</label>
            <input className={FIELD} value={form.statPassRate} onChange={e => set('statPassRate', e.target.value)} placeholder="98%" />
          </div>
          <div>
            <label className={LABEL}>Activities</label>
            <input className={FIELD} value={form.statActivities} onChange={e => set('statActivities', e.target.value)} placeholder="40+" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#E8B84B]">CTA Section</p>
        <div>
          <label className={LABEL}>CTA Headline</label>
          <input className={FIELD} value={form.ctaHeadline} onChange={e => set('ctaHeadline', e.target.value)} />
        </div>
        <div>
          <label className={LABEL}>CTA Subtext</label>
          <textarea rows={2} className={FIELD} value={form.ctaSubtext} onChange={e => set('ctaSubtext', e.target.value)} />
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

// ── Items Section ──────────────────────────────────────────────────────────
const BLANK_ITEM: CreateWcuItemDto = {
  icon: '', title: '', subtitle: '', description: '',
  stat: '', statLabel: '', color: '#E8B84B', sortOrder: 1, isPublished: true,
}

function ItemsSection() {
  const qc = useQueryClient()
  const { showToast } = useToast()
  const [modal, setModal] = useState<{ open: boolean; editing: WcuItemDto | null }>({ open: false, editing: null })
  const [draft, setDraft] = useState<CreateWcuItemDto>(BLANK_ITEM)
  const [delId, setDelId] = useState<number | null>(null)

  const { data: items = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-wcu-items'],
    queryFn: whyChooseUsApi.getItems,
    staleTime: 30_000,
  })

  const createMut = useMutation({
    mutationFn: (dto: CreateWcuItemDto) => whyChooseUsApi.createItem(dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-wcu-items'] }); showToast('Item added ✓'); setModal({ open: false, editing: null }) },
    onError: () => showToast('Failed to create item'),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateWcuItemDto }) => whyChooseUsApi.updateItem(id, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-wcu-items'] }); showToast('Item updated ✓'); setModal({ open: false, editing: null }) },
    onError: () => showToast('Failed to update item'),
  })

  const patchMut = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: { isPublished?: boolean } }) => whyChooseUsApi.patchItem(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-wcu-items'] }),
  })

  const deleteMut = useMutation({
    mutationFn: (id: number) => whyChooseUsApi.deleteItem(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-wcu-items'] }); showToast('Deleted'); setDelId(null) },
    onError: () => showToast('Failed to delete'),
  })

  const openNew = () => {
    setDraft({ ...BLANK_ITEM, sortOrder: items.length + 1 })
    setModal({ open: true, editing: null })
  }
  const openEdit = (item: WcuItemDto) => {
    setDraft({
      icon: item.icon, title: item.title, subtitle: item.subtitle,
      description: item.description, stat: item.stat, statLabel: item.statLabel,
      color: item.color, sortOrder: item.sortOrder, isPublished: item.isPublished,
    })
    setModal({ open: true, editing: item })
  }
  const save = () => {
    if (!draft.title.trim()) return showToast('Title is required')
    if (modal.editing) {
      updateMut.mutate({ id: modal.editing.whyChooseUsItemId, dto: { ...draft, sortOrder: draft.sortOrder ?? 1 } })
    } else {
      createMut.mutate(draft)
    }
  }

  const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder)

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-gray-400" /></div>
  if (isError) return <ErrorState message="Could not load items." onRetry={refetch} />

  return (
    <div className="space-y-3 max-w-2xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        <button onClick={openNew} className={BTN_GOLD}><Plus className="h-3.5 w-3.5" /> Add Item</button>
      </div>

      {sorted.map(item => (
        <div key={item.whyChooseUsItemId} className={`flex items-start gap-3 rounded-2xl border bg-white dark:bg-gray-800 px-4 py-3 ${item.isPublished ? 'border-gray-200 dark:border-gray-700' : 'border-dashed border-gray-300 dark:border-gray-600 opacity-60'}`}>
          <span className="text-2xl shrink-0 mt-0.5">{item.icon || '⭐'}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</p>
              {item.stat && (
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: item.color + '22', color: item.color }}>
                  {item.stat} {item.statLabel}
                </span>
              )}
              <span className="text-xs text-gray-400">#{item.sortOrder}</span>
            </div>
            {item.subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.subtitle}</p>}
            {item.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.description}</p>}
          </div>
          <div className="flex gap-1 shrink-0 items-start">
            <button
              onClick={() => patchMut.mutate({ id: item.whyChooseUsItemId, dto: { isPublished: !item.isPublished } })}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition"
              title={item.isPublished ? 'Unpublish' : 'Publish'}
            >
              {item.isPublished ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </button>
            <button onClick={() => openEdit(item)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition"><Pencil className="h-3.5 w-3.5" /></button>
            {delId === item.whyChooseUsItemId ? (
              <div className="flex items-center gap-1 rounded-lg bg-red-50 dark:bg-red-900/20 px-2 py-1">
                <span className="text-xs text-red-600 dark:text-red-400">Delete?</span>
                <button onClick={() => deleteMut.mutate(item.whyChooseUsItemId)} className="text-xs font-bold text-red-600 hover:underline">Yes</button>
                <button onClick={() => setDelId(null)} className="text-xs text-gray-400 hover:text-gray-600">No</button>
              </div>
            ) : (
              <button onClick={() => setDelId(item.whyChooseUsItemId)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition"><Trash2 className="h-3.5 w-3.5" /></button>
            )}
          </div>
        </div>
      ))}

      {items.length === 0 && (
        <button onClick={openNew} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 py-10 text-sm text-gray-400 hover:border-[#E8B84B]/50 hover:text-[#E8B84B] transition">
          <Plus className="h-4 w-4" /> Add your first item
        </button>
      )}

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setModal({ open: false, editing: null })}>
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4 shrink-0">
              <h3 className="font-bold text-gray-900 dark:text-white">{modal.editing ? 'Edit Item' : 'New Item'}</h3>
              <button onClick={() => setModal({ open: false, editing: null })} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-4 w-4" /></button>
            </div>
            <div className="overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>Icon (emoji)</label>
                  <input className={FIELD} value={draft.icon} onChange={e => setDraft(d => ({ ...d, icon: e.target.value }))} placeholder="🎯" autoFocus />
                </div>
                <div>
                  <label className={LABEL}>Color</label>
                  <div className="flex gap-2">
                    <input type="color" className="h-9 w-12 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer p-0.5 bg-white dark:bg-gray-900" value={draft.color} onChange={e => setDraft(d => ({ ...d, color: e.target.value }))} />
                    <input className={FIELD} value={draft.color} onChange={e => setDraft(d => ({ ...d, color: e.target.value }))} placeholder="#E8B84B" />
                  </div>
                </div>
              </div>
              <div>
                <label className={LABEL}>Title *</label>
                <input className={FIELD} value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} placeholder="Expert Teachers" />
              </div>
              <div>
                <label className={LABEL}>Subtitle</label>
                <input className={FIELD} value={draft.subtitle} onChange={e => setDraft(d => ({ ...d, subtitle: e.target.value }))} placeholder="Short phrase" />
              </div>
              <div>
                <label className={LABEL}>Description</label>
                <textarea rows={3} className={FIELD} value={draft.description} onChange={e => setDraft(d => ({ ...d, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>Stat</label>
                  <input className={FIELD} value={draft.stat} onChange={e => setDraft(d => ({ ...d, stat: e.target.value }))} placeholder="98%" />
                </div>
                <div>
                  <label className={LABEL}>Stat Label</label>
                  <input className={FIELD} value={draft.statLabel} onChange={e => setDraft(d => ({ ...d, statLabel: e.target.value }))} placeholder="Pass Rate" />
                </div>
                <div>
                  <label className={LABEL}>Sort Order</label>
                  <input type="number" min={1} className={FIELD} value={draft.sortOrder} onChange={e => setDraft(d => ({ ...d, sortOrder: Number(e.target.value) }))} />
                </div>
                <div className="flex items-end pb-0.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className={`relative h-5 w-9 rounded-full transition ${draft.isPublished ? 'bg-[#E8B84B]' : 'bg-gray-300 dark:bg-gray-600'}`} onClick={() => setDraft(d => ({ ...d, isPublished: !d.isPublished }))}>
                      <div className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${draft.isPublished ? 'translate-x-4' : ''}`} />
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Published</span>
                  </label>
                </div>
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
export function WhyChooseUsManager() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('content')

  const { data: content, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-wcu-content'],
    queryFn: whyChooseUsApi.getPageContent,
    staleTime: 30_000,
  })

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
            <h1 className="text-sm font-bold text-gray-900 dark:text-white">Why Choose Us</h1>
            <p className="text-[11px] text-gray-400 font-mono">/why-choose-us</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6">
        <div className="mx-auto max-w-4xl flex gap-0">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition ${
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
        {tab === 'items' && <ItemsSection />}
      </div>
    </div>
  )
}
