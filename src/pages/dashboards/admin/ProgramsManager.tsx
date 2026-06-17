import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Edit2, Trash2, X, Check, Image as ImageIcon, SortAsc } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '../../../contexts/ToastContext'
import { contentService } from '../../../services/contentService'
import type { PublicProgramLevel } from '../../../services/contentService'
import { unwrap } from '../../../services/mockApi'
import { cn } from '../../../lib/utils'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'
const BTN_GOLD = 'flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-3 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60'
const BTN_GHOST = 'flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition'

type ProgramDraft = Omit<PublicProgramLevel, 'id' | 'createdAt'>

const BLANK: ProgramDraft = { slug: '', name: '', ages: '', description: '', imageUrl: null, sortOrder: 1 }

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 bg-white dark:bg-gray-800 z-10">
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

export function ProgramsManager() {
  const { showToast } = useToast()
  const qc = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<PublicProgramLevel | null>(null)
  const [draft, setDraft] = useState<ProgramDraft>(BLANK)
  const [delConfirm, setDelConfirm] = useState<string | null>(null)

  const { data: programs = [], isLoading } = useQuery({
    queryKey: ['admin-program-levels'],
    queryFn: () => contentService.listProgramLevels().then(unwrap),
    staleTime: 30_000,
  })

  const createMut = useMutation({
    mutationFn: (dto: ProgramDraft) => contentService.createProgramLevel(dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-program-levels'] }); showToast('Program level added ✓'); closeModal() },
  })

  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<ProgramDraft> }) => contentService.updateProgramLevel(id, dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-program-levels'] }); showToast('Program level updated ✓'); closeModal() },
  })

  const deleteMut = useMutation({
    mutationFn: (id: string) => contentService.deleteProgramLevel(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-program-levels'] }); showToast('Program level deleted'); setDelConfirm(null) },
  })

  const openNew = () => {
    setDraft({ ...BLANK, sortOrder: programs.length + 1 })
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (p: PublicProgramLevel) => {
    setDraft({ slug: p.slug, name: p.name, ages: p.ages, description: p.description, imageUrl: p.imageUrl, sortOrder: p.sortOrder })
    setEditing(p)
    setModalOpen(true)
  }

  const closeModal = () => { setModalOpen(false); setEditing(null) }

  const handleSave = () => {
    if (!draft.name.trim()) return showToast('Name is required')
    if (!draft.ages.trim()) return showToast('Age range is required')
    const slug = draft.slug.trim() || draft.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    if (editing) {
      updateMut.mutate({ id: editing.id, dto: { ...draft, slug } })
    } else {
      createMut.mutate({ ...draft, slug })
    }
  }

  const isPending = createMut.isPending || updateMut.isPending

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Programs Manager</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage program levels shown on the public Programs / Academics page
          </p>
        </div>
        <button onClick={openNew} className={BTN_GOLD}>
          <Plus className="h-4 w-4" /> Add Program Level
        </button>
      </div>

      {/* Stats bar */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-center">
          <p className="text-2xl font-bold text-[#E8B84B]">{programs.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Program Levels</p>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-center">
          <p className="text-2xl font-bold text-green-500">{programs.filter(p => p.imageUrl).length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">With Images</p>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-center">
          <p className="text-2xl font-bold text-blue-500">{programs.filter(p => p.description).length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">With Descriptions</p>
        </div>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      )}

      {/* Program level cards */}
      {!isLoading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {[...programs].sort((a, b) => a.sortOrder - b.sortOrder).map(prog => (
            <div key={prog.id} className="group relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-sm hover:shadow-md transition">
              {prog.imageUrl ? (
                <div className="h-40 overflow-hidden">
                  <img
                    src={prog.imageUrl}
                    alt={prog.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                  <ImageIcon className="h-10 w-10 text-gray-300" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{prog.name}</h3>
                    <span className="inline-block mt-0.5 rounded-full bg-[#E8B84B]/20 px-2 py-0.5 text-[11px] font-semibold text-[#b8892b]">
                      {prog.ages}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 rounded-lg bg-gray-50 dark:bg-gray-700 px-2 py-0.5">
                    <SortAsc className="h-3 w-3 text-gray-400" />
                    <span className="text-[10px] font-mono text-gray-400">{prog.sortOrder}</span>
                  </div>
                </div>
                {prog.description && (
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{prog.description}</p>
                )}
                <div className="mt-1 text-[10px] font-mono text-gray-300 dark:text-gray-600">/{prog.slug}</div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => openEdit(prog)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-600 py-1.5 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <Edit2 className="h-3.5 w-3.5" /> Edit
                  </button>
                  {delConfirm === prog.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => deleteMut.mutate(prog.id)}
                        disabled={deleteMut.isPending}
                        className="rounded-lg bg-red-500 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-red-600 transition disabled:opacity-60"
                      >
                        {deleteMut.isPending ? '…' : 'Delete'}
                      </button>
                      <button
                        onClick={() => setDelConfirm(null)}
                        className="rounded-lg px-2 py-1.5 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDelConfirm(prog.id)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && programs.length === 0 && (
        <button
          onClick={openNew}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 py-16 text-sm text-gray-400 hover:border-[#E8B84B]/50 hover:text-[#E8B84B] transition"
        >
          <Plus className="h-5 w-5" /> Add your first program level
        </button>
      )}

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? `Edit: ${editing.name}` : 'New Program Level'}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Name <span className="text-[#E8B84B]">*</span></label>
              <input
                className={INP}
                value={draft.name}
                onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                placeholder="e.g. Primary School"
                autoFocus
              />
            </div>
            <div>
              <label className={LABEL}>Age Range <span className="text-[#E8B84B]">*</span></label>
              <input
                className={INP}
                value={draft.ages}
                onChange={e => setDraft(d => ({ ...d, ages: e.target.value }))}
                placeholder="e.g. 6–12 years"
              />
            </div>
          </div>

          <div>
            <label className={LABEL}>URL Slug</label>
            <input
              className={INP}
              value={draft.slug}
              onChange={e => setDraft(d => ({ ...d, slug: e.target.value }))}
              placeholder="auto-generated from name if left blank"
            />
          </div>

          <div>
            <label className={LABEL}>Description</label>
            <textarea
              rows={3}
              className={cn(INP, 'resize-none')}
              value={draft.description}
              onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
              placeholder="Brief description shown on the public page…"
            />
          </div>

          <div>
            <label className={LABEL}>Image URL</label>
            <input
              className={INP}
              value={draft.imageUrl ?? ''}
              onChange={e => setDraft(d => ({ ...d, imageUrl: e.target.value || null }))}
              placeholder="https://…"
            />
            {draft.imageUrl && (
              <img
                src={draft.imageUrl}
                alt="preview"
                className="mt-2 h-28 w-full rounded-lg object-cover"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            )}
          </div>

          <div>
            <label className={LABEL}>Sort Order</label>
            <input
              type="number"
              min={1}
              className={INP}
              value={draft.sortOrder}
              onChange={e => setDraft(d => ({ ...d, sortOrder: Number(e.target.value) }))}
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={isPending || !draft.name.trim() || !draft.ages.trim()}
              className={BTN_GOLD}
            >
              <Check className="h-3.5 w-3.5" />
              {isPending ? 'Saving…' : editing ? 'Save Changes' : 'Create Program'}
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
