import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Pencil, Trash2, X, Search, Eye, EyeOff, Loader2, ImageIcon } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '../../../contexts/ToastContext'
import { adminApi } from '../../../services/adminApiService'
import type { ApiBlogPost } from '../../../services/adminApiService'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'

interface Draft {
  title: string
  summary: string
  content: string
  coverImageUrl: string
  isPublished: boolean
}

const BLANK: Draft = { title: '', summary: '', content: '', coverImageUrl: '', isPublished: false }

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body,
  )
}

export function BlogManager() {
  const { showToast } = useToast()
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<ApiBlogPost | null>(null)
  const [draft, setDraft] = useState<Draft>(BLANK)
  const [isNew, setIsNew] = useState(false)
  const [delConfirm, setDelConfirm] = useState<number | null>(null)

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['admin-blog'],
    queryFn: adminApi.blog.getAll,
    retry: 1,
  })

  const createMut = useMutation({
    mutationFn: adminApi.blog.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-blog'] }); showToast('Post created ✓'); closeForm() },
    onError: () => showToast('Failed to create post', 'error'),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: Parameters<typeof adminApi.blog.update>[1] }) =>
      adminApi.blog.update(id, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-blog'] }); showToast('Post updated ✓'); closeForm() },
    onError: () => showToast('Failed to update post', 'error'),
  })

  const deleteMut = useMutation({
    mutationFn: adminApi.blog.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-blog'] }); showToast('Post deleted') },
    onError: () => showToast('Failed to delete post', 'error'),
  })

  const toggleMut = useMutation({
    mutationFn: adminApi.blog.togglePublish,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-blog'] }),
  })

  const closeForm = () => { setEditing(null); setIsNew(false); setDraft(BLANK) }

  const openNew = () => { setDraft({ ...BLANK }); setIsNew(true); setEditing(null) }

  const openEdit = (p: ApiBlogPost) => {
    setDraft({ title: p.title, summary: p.summary ?? '', content: p.content, coverImageUrl: p.coverImageUrl ?? '', isPublished: p.isPublished })
    setEditing(p)
    setIsNew(false)
  }

  const save = () => {
    if (!draft.title.trim()) return showToast('Title is required')
    if (!draft.content.trim()) return showToast('Content is required')
    const dto = { title: draft.title.trim(), content: draft.content, summary: draft.summary || undefined, coverImageUrl: draft.coverImageUrl || undefined, isPublished: draft.isPublished }
    if (isNew) createMut.mutate(dto)
    else if (editing) updateMut.mutate({ id: editing.id, dto })
  }

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.summary ?? '').toLowerCase().includes(search.toLowerCase()),
  )

  const isBusy = createMut.isPending || updateMut.isPending
  const FORM_OPEN = isNew || !!editing

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {posts.filter(p => p.isPublished).length} published · {posts.filter(p => !p.isPublished).length} drafts
          </p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2.5 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition">
          <Plus className="h-4 w-4" /> New Post
        </button>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input className={`${INP} pl-9`} placeholder="Search posts…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading posts…
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <tr>
                  {['Post', 'Status', 'Views', 'Date', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {p.coverImageUrl
                          ? <img src={p.coverImageUrl} alt="" className="h-10 w-14 rounded-lg object-cover shrink-0 bg-gray-100 dark:bg-gray-700" />
                          : <div className="h-10 w-14 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0"><ImageIcon className="h-4 w-4 text-gray-400" /></div>
                        }
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{p.title}</p>
                          <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{p.summary ?? p.content.slice(0, 80)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleMut.mutate(p.id)}
                        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                          p.isPublished
                            ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100'
                            : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {p.isPublished ? <><Eye className="h-3 w-3" />Published</> : <><EyeOff className="h-3 w-3" />Draft</>}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{p.viewCount.toLocaleString()}</td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap text-xs">
                      {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => setDelConfirm(p.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-12 text-center text-gray-400">No posts found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={FORM_OPEN} onClose={closeForm} title={isNew ? 'New Post' : 'Edit Post'}>
        <div className="space-y-4">
          <div>
            <label className={LABEL}>Title *</label>
            <input className={INP} value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} placeholder="Post title…" />
          </div>
          <div>
            <label className={LABEL}>Summary</label>
            <textarea rows={2} className={`${INP} resize-none`} value={draft.summary} onChange={e => setDraft({ ...draft, summary: e.target.value })} placeholder="Brief summary shown on listing page…" />
          </div>
          <div>
            <label className={LABEL}>Cover Image URL</label>
            <input className={INP} value={draft.coverImageUrl} onChange={e => setDraft({ ...draft, coverImageUrl: e.target.value })} placeholder="https://…" />
            {draft.coverImageUrl && (
              <div className="mt-2 aspect-video max-h-40 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100">
                <img src={draft.coverImageUrl} alt="preview" className="h-full w-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
              </div>
            )}
          </div>
          <div>
            <label className={LABEL}>Content *</label>
            <textarea rows={10} className={`${INP} resize-none`} value={draft.content} onChange={e => setDraft({ ...draft, content: e.target.value })} placeholder="Write your post content here…" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={draft.isPublished} onChange={e => setDraft({ ...draft, isPublished: e.target.checked })} className="h-4 w-4 rounded accent-[#E8B84B]" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Publish immediately</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={closeForm} className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
            <button onClick={save} disabled={isBusy} className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-5 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] disabled:opacity-60">
              {isBusy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isNew ? 'Create Post' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={!!delConfirm} onClose={() => setDelConfirm(null)} title="Delete Post?">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">This will permanently remove the post and cannot be undone.</p>
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
