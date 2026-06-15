import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, Check, X, Eye, EyeOff, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { contentService } from '../../../services/contentService'
import type { WhyChooseUsItem } from '../../../services/contentService'
import { unwrap } from '../../../services/mockApi'
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

type Draft = Omit<WhyChooseUsItem, 'id'>

const BLANK: Draft = {
  icon: '⭐',
  title: '',
  subtitle: '',
  desc: '',
  stat: '',
  statLabel: '',
  color: 'gold',
  sortOrder: 1,
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
  form: Draft
  setForm: React.Dispatch<React.SetStateAction<Draft>>
  onSave: () => void
  onCancel: () => void
  saving: boolean
  isNew: boolean
}) {
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) =>
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
        <textarea rows={3} className={`${FIELD} resize-none`} value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="What makes this point special…" />
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
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase text-gray-500 tracking-wider">Sort Order</label>
          <input type="number" min={1} className={FIELD} value={form.sortOrder} onChange={e => set('sortOrder', Number(e.target.value))} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="published-toggle"
          type="checkbox"
          checked={form.isPublished}
          onChange={e => set('isPublished', e.target.checked)}
          className="h-4 w-4 accent-[#E8B84B]"
        />
        <label htmlFor="published-toggle" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          Published (visible on public site)
        </label>
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

export function WhyChooseUsManager() {
  const qc = useQueryClient()
  const { showToast } = useToast()

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['why-choose-us'],
    queryFn: () => contentService.listWhyChooseUsItems().then(unwrap),
    staleTime: 30_000,
  })

  const create = useMutation({
    mutationFn: (dto: Draft) => contentService.createWhyChooseUsItem(dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['why-choose-us'] }); showToast('Reason added') },
  })
  const update = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<Draft> }) =>
      contentService.updateWhyChooseUsItem(id, dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['why-choose-us'] }); showToast('Reason updated') },
  })
  const del = useMutation({
    mutationFn: (id: string) => contentService.deleteWhyChooseUsItem(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['why-choose-us'] }); showToast('Reason deleted') },
  })
  const togglePublish = useMutation({
    mutationFn: ({ id, val }: { id: string; val: boolean }) =>
      contentService.updateWhyChooseUsItem(id, { isPublished: val }).then(unwrap),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['why-choose-us'] }),
  })

  const [editing, setEditing] = useState<string | 'new' | null>(null)
  const [form, setForm] = useState<Draft>({ ...BLANK })
  const [saving, setSaving] = useState(false)

  const openNew = () => {
    setForm({ ...BLANK, sortOrder: items.length + 1 })
    setEditing('new')
  }
  const openEdit = (item: WhyChooseUsItem) => {
    setForm({
      icon: item.icon, title: item.title, subtitle: item.subtitle, desc: item.desc,
      stat: item.stat, statLabel: item.statLabel, color: item.color,
      sortOrder: item.sortOrder, isPublished: item.isPublished,
    })
    setEditing(item.id)
  }
  const close = () => setEditing(null)

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
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Why Choose Us</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage "The Alber Difference" reasons shown on the public Why Choose Us page.
          </p>
        </div>
        <div className="flex items-center gap-3">
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

      {/* Summary strip */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        {[
          { label: 'Total Reasons', value: items.length },
          { label: 'Published', value: items.filter(i => i.isPublished).length },
          { label: 'Draft', value: items.filter(i => !i.isPublished).length },
        ].map(s => (
          <GlassCard key={s.label} className="p-4 text-center" hover={false}>
            <p className="text-2xl font-black text-[#E8B84B]">{s.value}</p>
            <p className="text-xs text-muted">{s.label}</p>
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
              key={item.id}
              className={cn(
                'rounded-2xl border bg-white dark:bg-gray-800 overflow-hidden transition',
                !item.isPublished && 'opacity-60',
                editing === item.id
                  ? 'border-[#E8B84B]/40'
                  : 'border-gray-200 dark:border-gray-700',
              )}
            >
              {editing === item.id ? (
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
                    <p className="text-xs text-muted truncate">{item.subtitle}</p>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-1">
                    <span className="hidden sm:block text-xs font-bold text-[#E8B84B] mr-2">{item.stat}</span>
                    <button
                      onClick={() => togglePublish.mutate({ id: item.id, val: !item.isPublished })}
                      className="rounded-lg p-1.5 text-muted hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      title={item.isPublished ? 'Unpublish' : 'Publish'}
                    >
                      {item.isPublished
                        ? <Eye className="h-3.5 w-3.5 text-green-500" />
                        : <EyeOff className="h-3.5 w-3.5" />
                      }
                    </button>
                    <button
                      onClick={() => openEdit(item)}
                      className="rounded-lg p-1.5 text-muted hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      title="Edit"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => del.mutate(item.id)}
                      className="rounded-lg p-1.5 text-muted hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition"
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
