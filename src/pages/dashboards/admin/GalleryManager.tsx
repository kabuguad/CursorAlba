import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Trash2, X, Filter, Loader2, Upload, Link } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '../../../contexts/ToastContext'
import { adminApi } from '../../../services/adminApiService'
import type { ApiGalleryImage } from '../../../services/adminApiService'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'

const CATS = ['All', 'Campus', 'Classrooms', 'Sports', 'Arts', 'Events', 'Students']

interface Draft {
  url: string
  caption: string
  category: string
  isPublic: boolean
}

const BLANK: Draft = { url: '', caption: '', category: 'Campus', isPublic: true }

export function GalleryManager() {
  const { showToast } = useToast()
  const qc = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [cat, setCat] = useState('All')
  const [addOpen, setAddOpen] = useState(false)
  const [draft, setDraft] = useState<Draft>(BLANK)
  const [delConfirm, setDelConfirm] = useState<number | null>(null)
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url')
  const [uploading, setUploading] = useState(false)

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: adminApi.gallery.getAll,
    retry: 1,
  })

  const addMut = useMutation({
    mutationFn: adminApi.gallery.add,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-gallery'] })
      showToast('Image added ✓')
      setDraft(BLANK)
      setAddOpen(false)
    },
    onError: () => showToast('Failed to add image', 'error'),
  })

  const deleteMut = useMutation({
    mutationFn: adminApi.gallery.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-gallery'] }); showToast('Image removed') },
    onError: () => showToast('Failed to delete image', 'error'),
  })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await adminApi.upload.uploadFile(file, 'gallery')
      setDraft(d => ({ ...d, url }))
      showToast('File uploaded ✓')
    } catch {
      showToast('Upload failed', 'error')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const add = () => {
    if (!draft.url.trim()) return showToast('Image URL is required')
    addMut.mutate({ url: draft.url, caption: draft.caption || undefined, category: draft.category, isPublic: draft.isPublic })
  }

  const filtered: ApiGalleryImage[] = cat === 'All' ? images : images.filter(i => i.category === cat)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gallery</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {images.length} images · {images.filter(i => i.isPublic).length} public
          </p>
        </div>
        <button onClick={() => { setDraft(BLANK); setAddOpen(true) }} className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2.5 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition">
          <Plus className="h-4 w-4" /> Add Image
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 items-center">
        <Filter className="h-4 w-4 text-gray-400 shrink-0" />
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
            {c} ({c === 'All' ? images.length : images.filter(i => i.category === c).length})
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 gap-2 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading gallery…
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map(img => (
            <div key={img.id} className="group relative aspect-square overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
              <img src={img.url} alt={img.caption ?? ''} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3">
                <p className="text-xs font-semibold text-white line-clamp-1">{img.caption || 'No caption'}</p>
                <span className="mt-0.5 text-[10px] text-white/70">{img.category ?? 'Uncategorised'}</span>
              </div>
              <button
                onClick={() => setDelConfirm(img.id)}
                disabled={deleteMut.isPending}
                className="absolute top-2 right-2 rounded-lg bg-red-500 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-60"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              {!img.isPublic && (
                <span className="absolute top-2 left-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] text-white">Hidden</span>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-16 text-center text-gray-400">No images in this category</div>
          )}
        </div>
      )}

      {addOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <h3 className="font-bold text-gray-900 dark:text-white">Add Image</h3>
              <button onClick={() => setAddOpen(false)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {(['url', 'file'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setUploadMode(m)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition ${
                      uploadMode === m
                        ? 'bg-[#E8B84B] text-[#0d1b0d]'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {m === 'url' ? <><Link className="h-3.5 w-3.5" />URL</> : <><Upload className="h-3.5 w-3.5" />Upload</>}
                  </button>
                ))}
              </div>

              {uploadMode === 'url' ? (
                <div>
                  <label className={LABEL}>Image URL *</label>
                  <input className={INP} placeholder="https://…" value={draft.url} onChange={e => setDraft({ ...draft, url: e.target.value })} />
                </div>
              ) : (
                <div>
                  <label className={LABEL}>Upload File</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 py-6 text-sm text-gray-500 dark:text-gray-400 hover:border-[#E8B84B]/50 hover:text-gray-700 transition disabled:opacity-60"
                  >
                    {uploading ? <><Loader2 className="h-4 w-4 animate-spin" />Uploading…</> : <><Upload className="h-4 w-4" />Click to select image</>}
                  </button>
                  {draft.url && <p className="mt-1.5 text-xs text-green-600 dark:text-green-400 truncate">{draft.url}</p>}
                </div>
              )}

              {draft.url && (
                <div className="aspect-video overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700">
                  <img src={draft.url} alt="preview" className="h-full w-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                </div>
              )}

              <div>
                <label className={LABEL}>Caption</label>
                <input className={INP} value={draft.caption} onChange={e => setDraft({ ...draft, caption: e.target.value })} placeholder="Optional caption…" />
              </div>
              <div>
                <label className={LABEL}>Category</label>
                <select className={INP} value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value })}>
                  {CATS.slice(1).map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={draft.isPublic} onChange={e => setDraft({ ...draft, isPublic: e.target.checked })} className="h-4 w-4 accent-[#E8B84B]" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Visible on public gallery</span>
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setAddOpen(false)} className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
                <button onClick={add} disabled={addMut.isPending || !draft.url} className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-5 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] disabled:opacity-60">
                  {addMut.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Add Image
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}

      {delConfirm !== null && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 shadow-2xl p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Remove Image?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">This will remove the image from the public gallery.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDelConfirm(null)} className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
              <button
                onClick={() => { deleteMut.mutate(delConfirm!); setDelConfirm(null) }}
                className="rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600"
              >Remove</button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}
