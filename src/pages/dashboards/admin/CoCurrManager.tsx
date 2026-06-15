import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Edit2, Trash2, X, Check, Activity } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '../../../contexts/ToastContext'
import { contentService } from '../../../services/contentService'
import type { CocurrActivity, CocurrCategoryId } from '../../../services/contentService'
import { unwrap } from '../../../services/mockApi'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'
const BTN_GOLD = 'flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-3 py-1.5 text-xs font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60'

const CATEGORIES: { id: CocurrCategoryId; label: string; icon: string; color: string }[] = [
  { id: 'sports',    label: 'Sports & Physical',          icon: '🏆', color: 'from-green-500/20 to-emerald-500/10 border-green-500/30' },
  { id: 'arts',      label: 'Creative & Performing Arts', icon: '🎭', color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30' },
  { id: 'community', label: 'Social & Community',         icon: '🤝', color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30' },
  { id: 'cts',       label: 'Career & Technical',         icon: '⚙️', color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30' },
]

type Draft = { name: string; icon: string; desc: string; categoryId: CocurrCategoryId; sortOrder: number }
const BLANK = (cat: CocurrCategoryId, count: number): Draft => ({ name: '', icon: '⭐', desc: '', categoryId: cat, sortOrder: count + 1 })

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body,
  )
}

export function CoCurrManager() {
  const { showToast } = useToast()
  const qc = useQueryClient()
  const [activeTab, setActiveTab] = useState<CocurrCategoryId>('sports')
  const [editing, setEditing] = useState<CocurrActivity | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [draft, setDraft] = useState<Draft>(BLANK('sports', 0))
  const [delConfirm, setDelConfirm] = useState<string | null>(null)

  const { data: allActivities = [], isLoading } = useQuery({
    queryKey: ['cocurr-activities-admin'],
    queryFn: () => contentService.listCocurrActivities().then(unwrap),
    staleTime: 30_000,
  })

  const items = allActivities.filter(a => a.categoryId === activeTab).sort((a, b) => a.sortOrder - b.sortOrder)

  const createMut = useMutation({
    mutationFn: (dto: Omit<CocurrActivity, 'id'>) => contentService.createCocurrActivity(dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cocurr-activities-admin'] }); qc.invalidateQueries({ queryKey: ['cocurr-activities'] }); showToast('Activity added ✓'); closeForm() },
  })
  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<Omit<CocurrActivity, 'id'>> }) => contentService.updateCocurrActivity(id, dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cocurr-activities-admin'] }); qc.invalidateQueries({ queryKey: ['cocurr-activities'] }); showToast('Activity updated ✓'); closeForm() },
  })
  const deleteMut = useMutation({
    mutationFn: (id: string) => contentService.deleteCocurrActivity(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cocurr-activities-admin'] }); qc.invalidateQueries({ queryKey: ['cocurr-activities'] }); showToast('Activity deleted'); setDelConfirm(null) },
  })

  const openNew = () => { setDraft(BLANK(activeTab, items.length)); setIsNew(true); setEditing(null) }
  const openEdit = (a: CocurrActivity) => { setDraft({ name: a.name, icon: a.icon, desc: a.desc, categoryId: a.categoryId, sortOrder: a.sortOrder }); setEditing(a); setIsNew(false) }
  const closeForm = () => { setEditing(null); setIsNew(false) }

  const handleSave = () => {
    if (!draft.name.trim()) return
    if (isNew) createMut.mutate(draft)
    else if (editing) updateMut.mutate({ id: editing.id, dto: draft })
  }

  const cat = CATEGORIES.find(c => c.id === activeTab)!

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8B84B]/15">
              <Activity className="h-5 w-5 text-[#E8B84B]" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Co-Curricular Activities</h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 ml-[52px]">
            Manage activities shown on the Co-Curricular overview page across all four pillars.
          </p>
        </div>
        <button onClick={openNew} className={BTN_GOLD + ' px-4 py-2 text-sm'}>
          <Plus className="h-4 w-4" /> Add Activity
        </button>
      </div>

      {/* Category tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveTab(c.id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === c.id
                ? 'bg-[#E8B84B] text-[#0d1b0d] shadow-sm'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#E8B84B]/50'
            }`}
          >
            <span>{c.icon}</span>
            <span>{c.label}</span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
              activeTab === c.id ? 'bg-[#0d1b0d]/20 text-[#0d1b0d]' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}>
              {allActivities.filter(a => a.categoryId === c.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Category context card */}
      <div className={`mb-6 rounded-2xl border bg-gradient-to-br p-5 ${cat.color}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{cat.icon}</span>
          <div>
            <p className="font-bold text-gray-900 dark:text-white">{cat.label}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{items.length} activit{items.length === 1 ? 'y' : 'ies'} — shown on the Co-Curricular page under this tab</p>
          </div>
        </div>
      </div>

      {/* Activity list */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-gray-400">Loading activities…</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl">{cat.icon}</span>
            <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">No activities yet in {cat.label}</p>
            <button onClick={openNew} className="mt-4 text-xs font-semibold text-[#E8B84B] hover:underline">Add the first one →</button>
          </div>
        ) : (
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Icon</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Description</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-right">Order</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                  <td className="px-4 py-3 text-2xl">{item.icon}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white whitespace-nowrap">{item.name}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 max-w-xs">
                    <p className="line-clamp-2 text-xs">{item.desc}</p>
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
                          <button onClick={() => deleteMut.mutate(item.id)} disabled={deleteMut.isPending} className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline">Yes</button>
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

      {/* Add/Edit Modal */}
      <Modal open={isNew || !!editing} onClose={closeForm} title={isNew ? 'Add Activity' : 'Edit Activity'}>
        <div className="space-y-4">
          <div className="grid grid-cols-[72px_1fr] gap-3">
            <div>
              <label className={LABEL}>Icon</label>
              <input className={INP + ' text-center text-xl'} value={draft.icon} onChange={e => setDraft(d => ({ ...d, icon: e.target.value }))} placeholder="🏆" />
            </div>
            <div>
              <label className={LABEL}>Activity Name <span className="text-[#E8B84B]">*</span></label>
              <input className={INP} value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} placeholder="e.g. Table Tennis" autoFocus />
            </div>
          </div>
          <div>
            <label className={LABEL}>Description</label>
            <textarea rows={3} className={INP + ' resize-none'} value={draft.desc} onChange={e => setDraft(d => ({ ...d, desc: e.target.value }))} placeholder="Brief description shown on the activity card…" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Category</label>
              <select className={INP} value={draft.categoryId} onChange={e => setDraft(d => ({ ...d, categoryId: e.target.value as CocurrCategoryId }))}>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Sort Order</label>
              <input type="number" min={1} className={INP} value={draft.sortOrder} onChange={e => setDraft(d => ({ ...d, sortOrder: Number(e.target.value) }))} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            <button onClick={closeForm} className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
            <button
              onClick={handleSave}
              disabled={!draft.name.trim() || createMut.isPending || updateMut.isPending}
              className="flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-4 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60"
            >
              <Check className="h-4 w-4" />
              {createMut.isPending || updateMut.isPending ? 'Saving…' : isNew ? 'Add Activity' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
