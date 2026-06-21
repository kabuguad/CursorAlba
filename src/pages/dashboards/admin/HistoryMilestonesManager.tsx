import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, X, Check, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { aboutApi } from '../../../services/aboutApi'
import type { HistoryMilestone, HistoryMilestoneCreateDto } from '../../../services/aboutApi'
import { useToast } from '../../../contexts/ToastContext'
import { cn } from '../../../lib/utils'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'
const BTN_GOLD = 'flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-3 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60'
const BTN_GHOST = 'flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition'

const BLANK: HistoryMilestoneCreateDto = { year: '', title: '', description: '', sortOrder: 1 }

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto"
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

export function HistoryMilestonesManager() {
  const qc = useQueryClient()
  const { showToast } = useToast()

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['history-milestones'],
    queryFn: () => aboutApi.getHistoryMilestones(),
    staleTime: 30_000,
  })

  const createMut = useMutation({
    mutationFn: (dto: HistoryMilestoneCreateDto) => aboutApi.createHistoryMilestone(dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['history-milestones'] }); showToast('Milestone added ✓'); closeModal() },
    onError: () => showToast('Failed to create — check API connection'),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: HistoryMilestoneCreateDto }) =>
      aboutApi.updateHistoryMilestone(id, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['history-milestones'] }); showToast('Milestone updated ✓'); closeModal() },
    onError: () => showToast('Failed to update'),
  })

  const deleteMut = useMutation({
    mutationFn: (id: number) => aboutApi.deleteHistoryMilestone(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['history-milestones'] }); showToast('Milestone deleted'); setDelConfirm(null) },
    onError: () => showToast('Failed to delete'),
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<HistoryMilestone | null>(null)
  const [draft, setDraft] = useState<HistoryMilestoneCreateDto>(BLANK)
  const [delConfirm, setDelConfirm] = useState<number | null>(null)

  const set = <K extends keyof HistoryMilestoneCreateDto>(k: K, v: HistoryMilestoneCreateDto[K]) =>
    setDraft(d => ({ ...d, [k]: v }))

  const openNew = () => {
    setDraft({ ...BLANK, sortOrder: items.length + 1 })
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (item: HistoryMilestone) => {
    setDraft({ year: item.year, title: item.title, description: item.description, sortOrder: item.sortOrder })
    setEditing(item)
    setModalOpen(true)
  }

  const closeModal = () => { setModalOpen(false); setEditing(null) }

  const handleSave = () => {
    if (!draft.year.trim()) return showToast('Year is required')
    if (!draft.title.trim()) return showToast('Title is required')
    if (editing) {
      updateMut.mutate({ id: editing.id, dto: draft })
    } else {
      createMut.mutate(draft)
    }
  }

  const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">History Milestones</h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Timeline events shown in the History section of the About page.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/about" target="_blank" className={BTN_GHOST}>
            <ExternalLink className="h-3.5 w-3.5" /> View Page
          </Link>
          <button onClick={openNew} className={BTN_GOLD}>
            <Plus className="h-4 w-4" /> Add Milestone
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-center">
          <p className="text-2xl font-bold text-[#E8B84B]">{items.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Milestones</p>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-center">
          <p className="text-2xl font-bold text-purple-500">
            {items.length > 0 ? items.reduce((min, i) => (i.year < min ? i.year : min), items[0].year) : '—'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Earliest Year</p>
        </div>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && items.length === 0 && (
        <button
          onClick={openNew}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 py-16 text-sm text-gray-400 hover:border-[#E8B84B]/50 hover:text-[#E8B84B] transition"
        >
          <Plus className="h-5 w-5" /> Add your first milestone
        </button>
      )}

      {/* Timeline list */}
      {!isLoading && sorted.length > 0 && (
        <div className="relative space-y-0">
          {/* Vertical line */}
          <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-[#E8B84B]/25 pointer-events-none" />

          {sorted.map((item, idx) => (
            <div key={item.id} className="relative flex items-start gap-4 py-2">
              {/* Year bubble */}
              <div className="relative z-10 flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-full border-2 border-[#E8B84B] bg-white dark:bg-gray-900 shadow-sm">
                <span className="text-[10px] font-black text-[#E8B84B] leading-tight text-center break-all px-1">
                  {item.year}
                </span>
              </div>

              {/* Content card */}
              <div className="flex-1 min-w-0 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.title}</p>
                      <span className="shrink-0 text-[10px] font-mono text-gray-400">#{item.sortOrder}</span>
                    </div>
                    {item.description && (
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => openEdit(item)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition"
                      title="Edit"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    {delConfirm === item.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => deleteMut.mutate(item.id)}
                          disabled={deleteMut.isPending}
                          className="rounded-lg bg-red-500 px-2.5 py-1 text-xs font-bold text-white hover:bg-red-600 transition disabled:opacity-60"
                        >
                          {deleteMut.isPending ? '…' : 'Delete'}
                        </button>
                        <button
                          onClick={() => setDelConfirm(null)}
                          className="rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDelConfirm(item.id)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? `Edit Milestone — ${editing.year}` : 'New History Milestone'}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Year <span className="text-[#E8B84B]">*</span></label>
              <input
                className={INP}
                value={draft.year}
                onChange={e => set('year', e.target.value)}
                placeholder="e.g. 2005"
                autoFocus
              />
            </div>
            <div>
              <label className={LABEL}>Sort Order</label>
              <input
                type="number"
                min={1}
                className={INP}
                value={draft.sortOrder}
                onChange={e => set('sortOrder', Number(e.target.value))}
              />
            </div>
          </div>
          <div>
            <label className={LABEL}>Title <span className="text-[#E8B84B]">*</span></label>
            <input
              className={INP}
              value={draft.title}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g. School Founded"
            />
          </div>
          <div>
            <label className={LABEL}>Description</label>
            <textarea
              rows={3}
              className={cn(INP, 'resize-none')}
              value={draft.description}
              onChange={e => set('description', e.target.value)}
              placeholder="What happened this year…"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={createMut.isPending || updateMut.isPending || !draft.year.trim() || !draft.title.trim()}
              className={BTN_GOLD}
            >
              <Check className="h-3.5 w-3.5" />
              {createMut.isPending || updateMut.isPending ? 'Saving…' : editing ? 'Save Changes' : 'Add Milestone'}
            </button>
            <button onClick={closeModal} className={BTN_GHOST}>
              <X className="h-3.5 w-3.5" /> Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
