import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, X, Check, ExternalLink, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { aboutApi } from '../../../services/aboutApi'
import type { AboutPageContent, AboutPageContentCreateDto } from '../../../services/aboutApi'
import { useToast } from '../../../contexts/ToastContext'
import { cn } from '../../../lib/utils'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'
const BTN_GOLD = 'flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-3 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60'
const BTN_GHOST = 'flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition'

const BLANK: AboutPageContentCreateDto = {
  headline: '',
  subheadline: '',
  mission: '',
  vision: '',
  historyIntro: '',
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-xl rounded-2xl bg-white dark:bg-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto"
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

export function AboutContentManager() {
  const qc = useQueryClient()
  const { showToast } = useToast()

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['about-page-content'],
    queryFn: () => aboutApi.getPageContent(),
    staleTime: 30_000,
  })

  const createMut = useMutation({
    mutationFn: (dto: AboutPageContentCreateDto) => aboutApi.createPageContent(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['about-page-content'] })
      showToast('About page content created ✓')
      closeModal()
    },
    onError: () => showToast('Failed to create — check your API connection'),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: AboutPageContentCreateDto }) =>
      aboutApi.updatePageContent(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['about-page-content'] })
      showToast('Updated ✓')
      closeModal()
    },
    onError: () => showToast('Failed to update'),
  })

  const deleteMut = useMutation({
    mutationFn: (id: number) => aboutApi.deletePageContent(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['about-page-content'] })
      showToast('Deleted')
      setDelConfirm(null)
    },
    onError: () => showToast('Failed to delete'),
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<AboutPageContent | null>(null)
  const [draft, setDraft] = useState<AboutPageContentCreateDto>(BLANK)
  const [delConfirm, setDelConfirm] = useState<number | null>(null)

  const set = <K extends keyof AboutPageContentCreateDto>(k: K, v: AboutPageContentCreateDto[K]) =>
    setDraft(d => ({ ...d, [k]: v }))

  const openNew = () => {
    setDraft(BLANK)
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (item: AboutPageContent) => {
    setDraft({
      headline: item.headline,
      subheadline: item.subheadline,
      mission: item.mission,
      vision: item.vision,
      historyIntro: item.historyIntro,
    })
    setEditing(item)
    setModalOpen(true)
  }

  const closeModal = () => { setModalOpen(false); setEditing(null) }

  const handleSave = () => {
    if (!draft.headline.trim()) return showToast('Headline is required')
    if (editing) {
      updateMut.mutate({ id: editing.id, dto: draft })
    } else {
      createMut.mutate(draft)
    }
  }

  const isPending = createMut.isPending || updateMut.isPending

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">About Page Content</h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Headline, mission, vision and history intro shown on the public About page.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/about"
            target="_blank"
            className={BTN_GHOST}
          >
            <ExternalLink className="h-3.5 w-3.5" /> View Page
          </Link>
          <button onClick={openNew} className={BTN_GOLD}>
            <Plus className="h-4 w-4" /> Add Record
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-center">
          <p className="text-2xl font-bold text-[#E8B84B]">{items.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Records</p>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-center">
          <p className="text-2xl font-bold text-green-500">{items.filter(i => i.headline).length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">With Headline</p>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      )}

      {/* List */}
      {!isLoading && items.length === 0 && (
        <button
          onClick={openNew}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 py-16 text-sm text-gray-400 hover:border-[#E8B84B]/50 hover:text-[#E8B84B] transition"
        >
          <Plus className="h-5 w-5" /> Add your first about page record
        </button>
      )}

      {!isLoading && items.length > 0 && (
        <div className="space-y-3">
          {items.map(item => (
            <div
              key={item.id}
              className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E8B84B]/15">
                    <FileText className="h-4 w-4 text-[#E8B84B]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      {item.headline || '(No headline)'}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                      {item.subheadline || '—'}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.mission && (
                        <span className="rounded-full bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                          Mission ✓
                        </span>
                      )}
                      {item.vision && (
                        <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                          Vision ✓
                        </span>
                      )}
                      {item.historyIntro && (
                        <span className="rounded-full bg-purple-50 dark:bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold text-purple-600 dark:text-purple-400">
                          History Intro ✓
                        </span>
                      )}
                    </div>
                  </div>
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
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? 'Edit About Page Content' : 'New About Page Content'}
      >
        <div className="space-y-4">
          <div>
            <label className={LABEL}>Headline <span className="text-[#E8B84B]">*</span></label>
            <input
              className={INP}
              value={draft.headline}
              onChange={e => set('headline', e.target.value)}
              placeholder="e.g. About Us"
              autoFocus
            />
          </div>
          <div>
            <label className={LABEL}>Sub-headline</label>
            <input
              className={INP}
              value={draft.subheadline}
              onChange={e => set('subheadline', e.target.value)}
              placeholder="Brief description shown under the headline"
            />
          </div>
          <div>
            <label className={LABEL}>Mission</label>
            <textarea
              rows={3}
              className={cn(INP, 'resize-none')}
              value={draft.mission}
              onChange={e => set('mission', e.target.value)}
              placeholder="Our mission statement…"
            />
          </div>
          <div>
            <label className={LABEL}>Vision</label>
            <textarea
              rows={3}
              className={cn(INP, 'resize-none')}
              value={draft.vision}
              onChange={e => set('vision', e.target.value)}
              placeholder="Our vision statement…"
            />
          </div>
          <div>
            <label className={LABEL}>History Intro</label>
            <textarea
              rows={2}
              className={cn(INP, 'resize-none')}
              value={draft.historyIntro}
              onChange={e => set('historyIntro', e.target.value)}
              placeholder="Brief intro shown above the history timeline…"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={isPending || !draft.headline.trim()}
              className={BTN_GOLD}
            >
              <Check className="h-3.5 w-3.5" />
              {isPending ? 'Saving…' : editing ? 'Save Changes' : 'Create'}
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
