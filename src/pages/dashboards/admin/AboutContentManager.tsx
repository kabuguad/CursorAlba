import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Save, Plus, Pencil, Trash2, Loader2, WifiOff, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  aboutApi,
  apiErrorMessage,
  type AboutPageContent,
  type AboutPageContentUpdateDto,
  type CoreValue,
  type CoreValueCreateDto,
  type HistoryMilestone,
  type HistoryMilestoneCreateDto,
} from '../../../services/aboutApi'
import { useToast } from '../../../contexts/ToastContext'

const FIELD = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'
const BTN_GOLD = 'flex items-center gap-1.5 rounded-xl bg-[#E8B84B] px-4 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60'
const BTN_GHOST = 'flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition'

type Tab = 'content' | 'values' | 'history'
const TABS: { id: Tab; label: string }[] = [
  { id: 'content', label: 'Page Content' },
  { id: 'values',  label: 'Core Values' },
  { id: 'history', label: 'History' },
]

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-4 text-center px-6">
      <WifiOff className="h-8 w-8 text-gray-400" />
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">{message}</p>
      <button onClick={onRetry} className={BTN_GOLD}>
        <Loader2 className="h-3.5 w-3.5" /> Retry
      </button>
    </div>
  )
}

// ── Page Content Section ───────────────────────────────────────────────────
function PageContentSection({ item }: { item: AboutPageContent }) {
  const qc = useQueryClient()
  const { showToast } = useToast()
  const [form, setForm] = useState<AboutPageContentUpdateDto>({
    headline: item.headline,
    subheadline: item.subheadline,
    mission: item.mission,
    vision: item.vision,
    historyIntro: item.historyIntro,
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setForm({
      headline: item.headline,
      subheadline: item.subheadline,
      mission: item.mission,
      vision: item.vision,
      historyIntro: item.historyIntro,
    })
  }, [item.id])

  const mut = useMutation({
    mutationFn: () => aboutApi.updatePageContent(item.id, form),
    onSuccess: (updated) => {
      qc.setQueryData(['admin-about-content'], [updated])
      showToast('About page content saved ✓')
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    },
    onError: (err) => showToast(apiErrorMessage(err)),
  })

  const set = (k: keyof AboutPageContentUpdateDto, v: string) =>
    setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <label className={LABEL}>Headline</label>
        <input className={FIELD} value={form.headline ?? ''} onChange={e => set('headline', e.target.value)} placeholder="About the school" />
      </div>
      <div>
        <label className={LABEL}>Subheadline</label>
        <input className={FIELD} value={form.subheadline ?? ''} onChange={e => set('subheadline', e.target.value)} />
      </div>
      <div>
        <label className={LABEL}>Mission</label>
        <textarea rows={4} className={FIELD} value={form.mission ?? ''} onChange={e => set('mission', e.target.value)} />
      </div>
      <div>
        <label className={LABEL}>Vision</label>
        <textarea rows={4} className={FIELD} value={form.vision ?? ''} onChange={e => set('vision', e.target.value)} />
      </div>
      <div>
        <label className={LABEL}>History Intro</label>
        <textarea rows={3} className={FIELD} value={form.historyIntro ?? ''} onChange={e => set('historyIntro', e.target.value)} />
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

// ── Core Values Section ────────────────────────────────────────────────────
const BLANK_VALUE: CoreValueCreateDto = { icon: '', title: '', description: '', sortOrder: 1 }

function CoreValuesSection() {
  const qc = useQueryClient()
  const { showToast } = useToast()
  const [modal, setModal] = useState<{ open: boolean; editing: CoreValue | null }>({ open: false, editing: null })
  const [draft, setDraft] = useState<CoreValueCreateDto>(BLANK_VALUE)
  const [delId, setDelId] = useState<number | null>(null)

  const { data: values = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-core-values'],
    queryFn: aboutApi.getCoreValues,
    staleTime: 30_000,
  })

  const createMut = useMutation({
    mutationFn: (dto: CoreValueCreateDto) => aboutApi.createCoreValue(dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-core-values'] }); showToast('Core value added ✓'); setModal({ open: false, editing: null }) },
    onError: (err) => showToast(apiErrorMessage(err)),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: CoreValueCreateDto }) => aboutApi.updateCoreValue(id, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-core-values'] }); showToast('Core value updated ✓'); setModal({ open: false, editing: null }) },
    onError: (err) => showToast(apiErrorMessage(err)),
  })

  const deleteMut = useMutation({
    mutationFn: (id: number) => aboutApi.deleteCoreValue(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-core-values'] }); showToast('Deleted'); setDelId(null) },
    onError: (err) => showToast(apiErrorMessage(err)),
  })

  const openNew = () => { setDraft({ ...BLANK_VALUE, sortOrder: values.length + 1 }); setModal({ open: true, editing: null }) }
  const openEdit = (v: CoreValue) => { setDraft({ icon: v.icon, title: v.title, description: v.description, sortOrder: v.sortOrder }); setModal({ open: true, editing: v }) }
  const save = () => {
    if (!draft.title.trim()) return showToast('Title is required')
    if (modal.editing) updateMut.mutate({ id: modal.editing.id, dto: draft })
    else createMut.mutate(draft)
  }

  const sorted = [...values].sort((a, b) => a.sortOrder - b.sortOrder)

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-gray-400" /></div>
  if (isError) return <ErrorState message="Could not load core values." onRetry={refetch} />

  return (
    <div className="space-y-3 max-w-2xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{values.length} value{values.length !== 1 ? 's' : ''}</p>
        <button onClick={openNew} className={BTN_GOLD}><Plus className="h-3.5 w-3.5" /> Add Value</button>
      </div>

      {sorted.map(v => (
        <div key={v.id} className="flex items-start gap-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3">
          <span className="text-2xl shrink-0 mt-0.5">{v.icon || '🔷'}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{v.title}</p>
              <span className="text-xs text-gray-400">#{v.sortOrder}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{v.description}</p>
          </div>
          <div className="flex gap-1 shrink-0">
            <button onClick={() => openEdit(v)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition"><Pencil className="h-3.5 w-3.5" /></button>
            {delId === v.id ? (
              <div className="flex items-center gap-1 rounded-lg bg-red-50 dark:bg-red-900/20 px-2 py-1">
                <span className="text-xs text-red-600 dark:text-red-400">Delete?</span>
                <button onClick={() => deleteMut.mutate(v.id)} className="text-xs font-bold text-red-600 hover:underline">Yes</button>
                <button onClick={() => setDelId(null)} className="text-xs text-gray-400 hover:text-gray-600">No</button>
              </div>
            ) : (
              <button onClick={() => setDelId(v.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition"><Trash2 className="h-3.5 w-3.5" /></button>
            )}
          </div>
        </div>
      ))}

      {values.length === 0 && (
        <button onClick={openNew} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 py-10 text-sm text-gray-400 hover:border-[#E8B84B]/50 hover:text-[#E8B84B] transition">
          <Plus className="h-4 w-4" /> Add your first core value
        </button>
      )}

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setModal({ open: false, editing: null })}>
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <h3 className="font-bold text-gray-900 dark:text-white">{modal.editing ? 'Edit Core Value' : 'New Core Value'}</h3>
              <button onClick={() => setModal({ open: false, editing: null })} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>Icon (emoji)</label>
                  <input className={FIELD} value={draft.icon} onChange={e => setDraft(d => ({ ...d, icon: e.target.value }))} placeholder="🌟" />
                </div>
                <div>
                  <label className={LABEL}>Sort Order</label>
                  <input type="number" min={1} className={FIELD} value={draft.sortOrder} onChange={e => setDraft(d => ({ ...d, sortOrder: Number(e.target.value) }))} />
                </div>
              </div>
              <div>
                <label className={LABEL}>Title *</label>
                <input className={FIELD} value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} placeholder="Excellence" autoFocus />
              </div>
              <div>
                <label className={LABEL}>Description</label>
                <textarea rows={3} className={FIELD} value={draft.description} onChange={e => setDraft(d => ({ ...d, description: e.target.value }))} />
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

// ── History Milestones Section ─────────────────────────────────────────────
const BLANK_MILESTONE: HistoryMilestoneCreateDto = { year: '', title: '', description: '', sortOrder: 1 }

function HistorySection() {
  const qc = useQueryClient()
  const { showToast } = useToast()
  const [modal, setModal] = useState<{ open: boolean; editing: HistoryMilestone | null }>({ open: false, editing: null })
  const [draft, setDraft] = useState<HistoryMilestoneCreateDto>(BLANK_MILESTONE)
  const [delId, setDelId] = useState<number | null>(null)

  const { data: milestones = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-history-milestones'],
    queryFn: aboutApi.getHistoryMilestones,
    staleTime: 30_000,
  })

  const createMut = useMutation({
    mutationFn: (dto: HistoryMilestoneCreateDto) => aboutApi.createHistoryMilestone(dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-history-milestones'] }); showToast('Milestone added ✓'); setModal({ open: false, editing: null }) },
    onError: (err) => showToast(apiErrorMessage(err)),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: HistoryMilestoneCreateDto }) => aboutApi.updateHistoryMilestone(id, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-history-milestones'] }); showToast('Milestone updated ✓'); setModal({ open: false, editing: null }) },
    onError: (err) => showToast(apiErrorMessage(err)),
  })

  const deleteMut = useMutation({
    mutationFn: (id: number) => aboutApi.deleteHistoryMilestone(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-history-milestones'] }); showToast('Deleted'); setDelId(null) },
    onError: (err) => showToast(apiErrorMessage(err)),
  })

  const openNew = () => { setDraft({ ...BLANK_MILESTONE, sortOrder: milestones.length + 1 }); setModal({ open: true, editing: null }) }
  const openEdit = (m: HistoryMilestone) => { setDraft({ year: m.year, title: m.title, description: m.description, sortOrder: m.sortOrder }); setModal({ open: true, editing: m }) }
  const save = () => {
    if (!draft.year.trim()) return showToast('Year is required')
    if (!draft.title.trim()) return showToast('Title is required')
    if (modal.editing) updateMut.mutate({ id: modal.editing.id, dto: draft })
    else createMut.mutate(draft)
  }

  const sorted = [...milestones].sort((a, b) => a.sortOrder - b.sortOrder)

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-gray-400" /></div>
  if (isError) return <ErrorState message="Could not load history milestones." onRetry={refetch} />

  return (
    <div className="space-y-3 max-w-2xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{milestones.length} milestone{milestones.length !== 1 ? 's' : ''}</p>
        <button onClick={openNew} className={BTN_GOLD}><Plus className="h-3.5 w-3.5" /> Add Milestone</button>
      </div>

      {sorted.map(m => (
        <div key={m.id} className="flex items-start gap-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3">
          <div className="flex h-10 w-16 shrink-0 items-center justify-center rounded-xl bg-[#E8B84B]/15 dark:bg-[#E8B84B]/10">
            <span className="text-xs font-bold text-[#c49830]">{m.year}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{m.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{m.description}</p>
          </div>
          <div className="flex gap-1 shrink-0">
            <button onClick={() => openEdit(m)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition"><Pencil className="h-3.5 w-3.5" /></button>
            {delId === m.id ? (
              <div className="flex items-center gap-1 rounded-lg bg-red-50 dark:bg-red-900/20 px-2 py-1">
                <span className="text-xs text-red-600 dark:text-red-400">Delete?</span>
                <button onClick={() => deleteMut.mutate(m.id)} className="text-xs font-bold text-red-600 hover:underline">Yes</button>
                <button onClick={() => setDelId(null)} className="text-xs text-gray-400 hover:text-gray-600">No</button>
              </div>
            ) : (
              <button onClick={() => setDelId(m.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition"><Trash2 className="h-3.5 w-3.5" /></button>
            )}
          </div>
        </div>
      ))}

      {milestones.length === 0 && (
        <button onClick={openNew} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 py-10 text-sm text-gray-400 hover:border-[#E8B84B]/50 hover:text-[#E8B84B] transition">
          <Plus className="h-4 w-4" /> Add first milestone
        </button>
      )}

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setModal({ open: false, editing: null })}>
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <h3 className="font-bold text-gray-900 dark:text-white">{modal.editing ? 'Edit Milestone' : 'New Milestone'}</h3>
              <button onClick={() => setModal({ open: false, editing: null })} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>Year *</label>
                  <input className={FIELD} value={draft.year} onChange={e => setDraft(d => ({ ...d, year: e.target.value }))} placeholder="2005" autoFocus />
                </div>
                <div>
                  <label className={LABEL}>Sort Order</label>
                  <input type="number" min={1} className={FIELD} value={draft.sortOrder} onChange={e => setDraft(d => ({ ...d, sortOrder: Number(e.target.value) }))} />
                </div>
              </div>
              <div>
                <label className={LABEL}>Title *</label>
                <input className={FIELD} value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} placeholder="School Founded" />
              </div>
              <div>
                <label className={LABEL}>Description</label>
                <textarea rows={3} className={FIELD} value={draft.description} onChange={e => setDraft(d => ({ ...d, description: e.target.value }))} />
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
export function AboutContentManager() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('content')

  const { data: contentList = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-about-content'],
    queryFn: aboutApi.getPageContent,
    staleTime: 30_000,
  })

  const content = contentList[0] ?? null

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard/admin/site-content')}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Site Content
            </button>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <div>
              <h1 className="text-sm font-bold text-gray-900 dark:text-white">About Page</h1>
              <p className="text-[11px] text-gray-400 font-mono">/about</p>
            </div>
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
            <ErrorState message="Could not load about page content." onRetry={refetch} />
          ) : (
            <PageContentSection item={content} />
          )
        )}
        {tab === 'values' && <CoreValuesSection />}
        {tab === 'history' && <HistorySection />}
      </div>
    </div>
  )
}
