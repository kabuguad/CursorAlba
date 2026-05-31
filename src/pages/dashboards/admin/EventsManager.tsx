import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Pencil, Trash2, X, Search, Clock, CheckCircle, Loader2 } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '../../../contexts/ToastContext'
import { adminApi } from '../../../services/adminApiService'
import type { ApiEvent } from '../../../services/adminApiService'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'

interface Draft {
  title: string
  description: string
  startDate: string
  location: string
  isPublished: boolean
}

const BLANK: Draft = {
  title: '',
  description: '',
  startDate: new Date().toISOString().slice(0, 10),
  location: '',
  isPublished: true,
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-2xl">
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

export function EventsManager() {
  const { showToast } = useToast()
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<ApiEvent | null>(null)
  const [draft, setDraft] = useState<Draft>(BLANK)
  const [isNew, setIsNew] = useState(false)
  const [delConfirm, setDelConfirm] = useState<number | null>(null)

  const { data: evts = [], isLoading } = useQuery({
    queryKey: ['admin-events'],
    queryFn: adminApi.events.getAll,
    retry: 1,
  })

  const createMut = useMutation({
    mutationFn: adminApi.events.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-events'] }); showToast('Event created ✓'); closeForm() },
    onError: () => showToast('Failed to create event', 'error'),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: Parameters<typeof adminApi.events.update>[1] }) =>
      adminApi.events.update(id, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-events'] }); showToast('Event updated ✓'); closeForm() },
    onError: () => showToast('Failed to update event', 'error'),
  })

  const deleteMut = useMutation({
    mutationFn: adminApi.events.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-events'] }); showToast('Event deleted') },
    onError: () => showToast('Failed to delete event', 'error'),
  })

  const closeForm = () => { setEditing(null); setIsNew(false); setDraft(BLANK) }
  const openNew = () => { setDraft({ ...BLANK }); setIsNew(true); setEditing(null) }
  const openEdit = (e: ApiEvent) => {
    setDraft({
      title: e.title,
      description: e.description ?? '',
      startDate: e.startDate.slice(0, 10),
      location: e.location ?? '',
      isPublished: e.isPublished,
    })
    setEditing(e)
    setIsNew(false)
  }

  const save = () => {
    if (!draft.title.trim()) return showToast('Title is required')
    const dto = {
      title: draft.title.trim(),
      description: draft.description || undefined,
      startDate: new Date(draft.startDate).toISOString(),
      location: draft.location || undefined,
      isPublished: draft.isPublished,
    }
    if (isNew) createMut.mutate(dto)
    else if (editing) updateMut.mutate({ id: editing.id, dto })
  }

  const filtered = evts
    .filter(e =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.location ?? '').toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => a.startDate.localeCompare(b.startDate))

  const upcoming = evts.filter(e => !e.isPast).length
  const past = evts.filter(e => e.isPast).length
  const isBusy = createMut.isPending || updateMut.isPending
  const FORM_OPEN = isNew || !!editing

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Events</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{upcoming} upcoming · {past} past</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2.5 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition">
          <Plus className="h-4 w-4" /> New Event
        </button>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input className={`${INP} pl-9`} placeholder="Search events…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading events…
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <tr>
                  {['Title', 'Date', 'Location', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {filtered.map(e => (
                  <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900 dark:text-white">{e.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{e.description}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {new Date(e.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{e.location ?? '—'}</td>
                    <td className="px-5 py-4">
                      {e.isPast
                        ? <span className="flex items-center gap-1 text-xs font-medium text-gray-400"><CheckCircle className="h-3.5 w-3.5" />Past</span>
                        : <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400"><Clock className="h-3.5 w-3.5" />Upcoming</span>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(e)} className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => setDelConfirm(e.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-12 text-center text-gray-400">No events found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={FORM_OPEN} onClose={closeForm} title={isNew ? 'New Event' : 'Edit Event'}>
        <div className="space-y-4">
          <div>
            <label className={LABEL}>Event Title *</label>
            <input className={INP} value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL}>Date</label>
              <input type="date" className={INP} value={draft.startDate} onChange={e => setDraft({ ...draft, startDate: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Location / Venue</label>
              <input className={INP} value={draft.location} onChange={e => setDraft({ ...draft, location: e.target.value })} />
            </div>
          </div>
          <div>
            <label className={LABEL}>Description</label>
            <textarea rows={3} className={`${INP} resize-none`} value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={draft.isPublished} onChange={e => setDraft({ ...draft, isPublished: e.target.checked })} className="h-4 w-4 rounded accent-[#E8B84B]" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Show on public calendar</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={closeForm} className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
            <button onClick={save} disabled={isBusy} className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-5 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] disabled:opacity-60">
              {isBusy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isNew ? 'Create' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={!!delConfirm} onClose={() => setDelConfirm(null)} title="Delete Event?">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">This will permanently remove the event from the public calendar.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDelConfirm(null)} className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
          <button
            onClick={() => { if (delConfirm) { deleteMut.mutate(delConfirm); setDelConfirm(null) } }}
            disabled={deleteMut.isPending}
            className="rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
          >Delete</button>
        </div>
      </Modal>
    </div>
  )
}
