import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Trash2, X, Filter } from 'lucide-react'
import { useToast } from '../../../contexts/ToastContext'
import { galleryImages as SEED } from '../../../data/gallery'
import type { GalleryImage } from '../../../data/types'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'

const CATS = ['All', 'Campus', 'Classrooms', 'Sports', 'Arts', 'Events', 'Students']

const BLANK = { url: '', category: 'Campus', title: '' }

export function GalleryManager() {
  const { showToast } = useToast()
  const [images, setImages] = useState<GalleryImage[]>(SEED.map(i => ({ ...i })))
  const [cat, setCat] = useState('All')
  const [addOpen, setAddOpen] = useState(false)
  const [draft, setDraft] = useState(BLANK)
  const [delConfirm, setDelConfirm] = useState<string | null>(null)

  const filtered = cat === 'All' ? images : images.filter(i => i.category === cat)

  const add = () => {
    if (!draft.url.trim()) return showToast('Image URL is required')
    setImages(prev => [{ ...draft, id: `g-${Date.now()}` }, ...prev])
    setDraft(BLANK)
    setAddOpen(false)
    showToast('Image added ✓')
  }

  const del = (id: string) => {
    setImages(prev => prev.filter(i => i.id !== id))
    setDelConfirm(null)
    showToast('Image removed')
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gallery</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{images.length} images across {CATS.length - 1} categories</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2.5 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition">
          <Plus className="h-4 w-4" /> Add Image
        </button>
      </div>

      {/* Category filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Filter className="h-4 w-4 text-gray-400 self-center" />
        {CATS.map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              cat === c
                ? 'bg-[#E8B84B] text-[#0d1b0d]'
                : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#E8B84B]/50'
            }`}
          >
            {c} {c !== 'All' ? `(${images.filter(i => i.category === c).length})` : `(${images.length})`}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.map(img => (
          <div key={img.id} className="group relative aspect-square overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
            <img src={img.url} alt={img.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3">
              <p className="text-xs font-semibold text-white line-clamp-1">{img.title}</p>
              <span className="mt-0.5 text-[10px] text-white/70">{img.category}</span>
            </div>
            <button
              onClick={() => setDelConfirm(img.id)}
              className="absolute top-2 right-2 rounded-lg bg-red-500 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-gray-400">No images in this category</div>
        )}
      </div>

      {/* Add modal */}
      {addOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <h3 className="font-bold text-gray-900 dark:text-white">Add Image</h3>
              <button onClick={() => setAddOpen(false)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={LABEL}>Image URL *</label>
                <input className={INP} placeholder="https://…" value={draft.url} onChange={e => setDraft({ ...draft, url: e.target.value })} />
              </div>
              <div>
                <label className={LABEL}>Title / Caption</label>
                <input className={INP} value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} />
              </div>
              <div>
                <label className={LABEL}>Category</label>
                <select className={INP} value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value })}>
                  {CATS.slice(1).map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              {draft.url && (
                <div className="aspect-video overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700">
                  <img src={draft.url} alt="preview" className="h-full w-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setAddOpen(false)} className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
                <button onClick={add} className="rounded-xl bg-[#E8B84B] px-5 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a]">Add Image</button>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}

      {/* Delete confirm */}
      {delConfirm && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 shadow-2xl p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Remove Image?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">This will remove the image from the public gallery.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDelConfirm(null)} className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
              <button onClick={() => del(delConfirm)} className="rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600">Remove</button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}
