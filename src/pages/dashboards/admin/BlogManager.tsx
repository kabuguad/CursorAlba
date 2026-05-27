import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Pencil, Trash2, X, Search } from 'lucide-react'
import { useToast } from '../../../contexts/ToastContext'
import { blogPosts as SEED } from '../../../data/blog'
import type { BlogPost } from '../../../data/types'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'

const CATS = ['Academics', 'Arts', 'Sports', 'Technology', 'Campus', 'Community']

const BLANK: Omit<BlogPost, 'id'> = { title: '', excerpt: '', content: '', image: '', author: '', date: new Date().toISOString().slice(0, 10), category: 'Academics' }

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-800 shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4 shrink-0">
          <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-4 w-4" /></button>
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>,
    document.body,
  )
}

export function BlogManager() {
  const { showToast } = useToast()
  const [posts, setPosts] = useState<BlogPost[]>(SEED.map(p => ({ ...p })))
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [draft, setDraft] = useState<Omit<BlogPost, 'id'>>(BLANK)
  const [isNew, setIsNew] = useState(false)
  const [delConfirm, setDelConfirm] = useState<string | null>(null)

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()),
  )

  const openNew = () => { setDraft({ ...BLANK }); setIsNew(true); setEditing(null) }
  const openEdit = (p: BlogPost) => { setDraft({ title: p.title, excerpt: p.excerpt, content: p.content, image: p.image, author: p.author, date: p.date, category: p.category }); setEditing(p); setIsNew(false) }

  const save = () => {
    if (!draft.title.trim()) return showToast('Title is required')
    if (isNew) {
      setPosts(prev => [{ ...draft, id: `b-${Date.now()}` }, ...prev])
      showToast('Blog post created ✓')
    } else if (editing) {
      setPosts(prev => prev.map(p => p.id === editing.id ? { ...draft, id: p.id } : p))
      showToast('Blog post updated ✓')
    }
    setEditing(null); setIsNew(false)
  }

  const del = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id))
    setDelConfirm(null)
    showToast('Post deleted')
  }

  const FORM_OPEN = isNew || !!editing

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{posts.length} posts published</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2.5 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition">
          <Plus className="h-4 w-4" /> New Post
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input className={`${INP} pl-9`} placeholder="Search posts…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
              <tr>
                {['Title', 'Category', 'Author', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{p.title}</p>
                    <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{p.excerpt}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">{p.category}</span>
                  </td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{p.author}</td>
                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{p.date}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDelConfirm(p.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition">
                        <Trash2 className="h-4 w-4" />
                      </button>
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

      {/* Edit / New modal */}
      <Modal open={FORM_OPEN} onClose={() => { setEditing(null); setIsNew(false) }} title={isNew ? 'New Blog Post' : 'Edit Post'}>
        <div className="space-y-4">
          <div>
            <label className={LABEL}>Title *</label>
            <input className={INP} value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL}>Category</label>
              <select className={INP} value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value })}>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Author</label>
              <input className={INP} value={draft.author} onChange={e => setDraft({ ...draft, author: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Date</label>
              <input type="date" className={INP} value={draft.date} onChange={e => setDraft({ ...draft, date: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Cover Image URL</label>
              <input className={INP} placeholder="https://…" value={draft.image} onChange={e => setDraft({ ...draft, image: e.target.value })} />
            </div>
          </div>
          <div>
            <label className={LABEL}>Excerpt (shown in listing)</label>
            <textarea rows={2} className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40 resize-none" value={draft.excerpt} onChange={e => setDraft({ ...draft, excerpt: e.target.value })} />
          </div>
          <div>
            <label className={LABEL}>Full Content</label>
            <textarea rows={7} className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40 resize-none" value={draft.content} onChange={e => setDraft({ ...draft, content: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => { setEditing(null); setIsNew(false) }} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
            <button onClick={save} className="rounded-xl bg-[#E8B84B] px-5 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition">
              {isNew ? 'Publish' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!delConfirm} onClose={() => setDelConfirm(null)} title="Delete Post?">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">This will permanently remove the post. This cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDelConfirm(null)} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
          <button onClick={() => delConfirm && del(delConfirm)} className="rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600 transition">Delete</button>
        </div>
      </Modal>
    </div>
  )
}
