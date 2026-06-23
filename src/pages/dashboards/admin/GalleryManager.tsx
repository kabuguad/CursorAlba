import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  Plus, Trash2, X, Loader2, Upload, Link as LinkIcon,
  FolderOpen, Pencil, ChevronRight, Images, Tag,
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '../../../contexts/ToastContext'
import {
  galleryApi,
  type GalleryCategory,
  type GalleryImage,
  type GalleryCategoryCreateDto,
} from '../../../services/galleryApi'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'
const BTN_GOLD = 'flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2.5 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60'
const BTN_GHOST = 'rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition'

const ICON_OPTIONS = ['🖼️','⚽','🤖','🎨','🎵','🥋','⛸️','🌍','📸','🏫','🎓','🏆','🌿','🎭','💻','🔬','📚']

// ── Category modal ──────────────────────────────────────────────────────────

interface CatModalProps {
  initial?: GalleryCategory | null
  onClose: () => void
  onSave: (dto: GalleryCategoryCreateDto) => void
  saving: boolean
}

function CategoryModal({ initial, onClose, onSave, saving }: CatModalProps) {
  const [form, setForm] = useState<GalleryCategoryCreateDto>({
    title: initial?.title ?? '',
    slug: initial?.slug ?? '',
    description: initial?.description ?? '',
    icon: initial?.icon ?? '🖼️',
    sortOrder: initial?.sortOrder ?? 0,
    isActive: initial?.isActive ?? true,
  })

  const set = <K extends keyof GalleryCategoryCreateDto>(k: K, v: GalleryCategoryCreateDto[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h3 className="font-bold text-gray-900 dark:text-white">
            {initial ? 'Edit Category' : 'New Category'}
          </h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className={LABEL}>Title *</label>
            <input className={INP} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Sports" />
          </div>
          <div>
            <label className={LABEL}>Icon</label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {ICON_OPTIONS.map(ico => (
                <button
                  key={ico}
                  type="button"
                  onClick={() => set('icon', ico)}
                  className={`text-xl rounded-lg p-1.5 transition ${form.icon === ico ? 'bg-[#E8B84B]/20 ring-2 ring-[#E8B84B]' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  {ico}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={LABEL}>Description</label>
            <input className={INP} value={form.description ?? ''} onChange={e => set('description', e.target.value)} placeholder="Optional description" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Slug</label>
              <input className={INP} value={form.slug ?? ''} onChange={e => set('slug', e.target.value)} placeholder="sports" />
            </div>
            <div>
              <label className={LABEL}>Sort Order</label>
              <input type="number" className={INP} value={form.sortOrder} onChange={e => set('sortOrder', Number(e.target.value))} />
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="h-4 w-4 accent-[#E8B84B]" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Active (visible on public gallery)</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onClose} className={BTN_GHOST}>Cancel</button>
            <button
              onClick={() => onSave(form)}
              disabled={saving || !form.title.trim()}
              className={BTN_GOLD}
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {initial ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

// ── Image modal ─────────────────────────────────────────────────────────────

interface ImgDraft { url: string; caption: string; isPublic: boolean; galleryCategoryId: number; sortOrder: number }

interface ImageModalProps {
  categoryId: number
  categories: GalleryCategory[]
  initial?: GalleryImage | null
  onClose: () => void
  onSave: (draft: ImgDraft) => void
  saving: boolean
}

function ImageModal({ categoryId, categories, initial, onClose, onSave, saving }: ImageModalProps) {
  const [draft, setDraft] = useState<ImgDraft>({
    url: initial?.url ?? '',
    caption: initial?.caption ?? '',
    isPublic: initial?.isPublic ?? true,
    galleryCategoryId: initial?.galleryCategoryId ?? categoryId,
    sortOrder: initial?.sortOrder ?? 0,
  })
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const results = await galleryApi.images.bulkUpload(draft.galleryCategoryId, [file], draft.isPublic)
      if (results[0]?.url) setDraft(d => ({ ...d, url: results[0].url }))
    } catch {
      // if bulk upload fails, just clear
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const set = <K extends keyof ImgDraft>(k: K, v: ImgDraft[K]) => setDraft(d => ({ ...d, [k]: v }))

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h3 className="font-bold text-gray-900 dark:text-white">{initial ? 'Edit Image' : 'Add Image'}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-6 space-y-4">

          {!initial && (
            <div className="flex rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {(['url', 'file'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setUploadMode(m)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition ${
                    uploadMode === m ? 'bg-[#E8B84B] text-[#0d1b0d]' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {m === 'url' ? <><LinkIcon className="h-3.5 w-3.5" /> URL</> : <><Upload className="h-3.5 w-3.5" /> Upload</>}
                </button>
              ))}
            </div>
          )}

          {(initial || uploadMode === 'url') && (
            <div>
              <label className={LABEL}>Image URL *</label>
              <input className={INP} placeholder="https://…" value={draft.url} onChange={e => set('url', e.target.value)} />
            </div>
          )}

          {!initial && uploadMode === 'file' && (
            <div>
              <label className={LABEL}>Upload File</label>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
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
            <input className={INP} value={draft.caption} onChange={e => set('caption', e.target.value)} placeholder="Optional caption…" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Category</label>
              <select className={INP} value={draft.galleryCategoryId} onChange={e => set('galleryCategoryId', Number(e.target.value))}>
                {categories.map((c, i) => <option key={`cat-${c.id}-${i}`} value={c.id}>{c.icon} {c.title}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Sort Order</label>
              <input type="number" className={INP} value={draft.sortOrder} onChange={e => set('sortOrder', Number(e.target.value))} />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={draft.isPublic} onChange={e => set('isPublic', e.target.checked)} className="h-4 w-4 accent-[#E8B84B]" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Visible on public gallery</span>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onClose} className={BTN_GHOST}>Cancel</button>
            <button
              onClick={() => onSave(draft)}
              disabled={saving || !draft.url.trim()}
              className={BTN_GOLD}
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {initial ? 'Save Changes' : 'Add Image'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

// ── Main component ──────────────────────────────────────────────────────────

export function GalleryManager() {
  const { showToast } = useToast()
  const qc = useQueryClient()

  const [selectedCatId, setSelectedCatId] = useState<number | null>(null)
  const [catModal, setCatModal] = useState<{ open: boolean; editing: GalleryCategory | null }>({ open: false, editing: null })
  const [imgModal, setImgModal] = useState<{ open: boolean; editing: GalleryImage | null }>({ open: false, editing: null })
  const [delCat, setDelCat] = useState<GalleryCategory | null>(null)
  const [delImg, setDelImg] = useState<GalleryImage | null>(null)
  const [bulkOpen, setBulkOpen] = useState(false)
  const [bulkFiles, setBulkFiles] = useState<File[]>([])
  const [bulkPublic, setBulkPublic] = useState(true)
  const [bulkUploading, setBulkUploading] = useState(false)
  const bulkInputRef = useRef<HTMLInputElement>(null)

  // ── Queries ──
  const { data: categories = [], isLoading: catsLoading } = useQuery({
    queryKey: ['admin-gallery-categories'],
    queryFn: galleryApi.categories.getAll,
    retry: 1,
  })

  const { data: images = [], isLoading: imgsLoading } = useQuery({
    queryKey: ['admin-gallery-images', selectedCatId],
    queryFn: () =>
      selectedCatId !== null
        ? galleryApi.images.getByCategory(selectedCatId)
        : galleryApi.images.getPublic(),
    enabled: true,
    retry: 1,
  })

  const selectedCat = categories.find(c => c.id === selectedCatId) ?? null

  // ── Category mutations ──
  const createCatMut = useMutation({
    mutationFn: galleryApi.categories.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-gallery-categories'] })
      showToast('Category created ✓')
      setCatModal({ open: false, editing: null })
    },
    onError: () => showToast('Failed to create category', 'error'),
  })

  const updateCatMut = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: GalleryCategoryCreateDto }) =>
      galleryApi.categories.update(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-gallery-categories'] })
      showToast('Category updated ✓')
      setCatModal({ open: false, editing: null })
    },
    onError: () => showToast('Failed to update category', 'error'),
  })

  const deleteCatMut = useMutation({
    mutationFn: (id: number) => galleryApi.categories.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-gallery-categories'] })
      qc.invalidateQueries({ queryKey: ['admin-gallery-images'] })
      if (selectedCatId === delCat?.id) setSelectedCatId(null)
      showToast('Category deleted')
      setDelCat(null)
    },
    onError: () => showToast('Failed to delete category', 'error'),
  })

  // ── Image mutations ──
  const createImgMut = useMutation({
    mutationFn: (dto: ImgDraft) => galleryApi.images.create({ ...dto, caption: dto.caption || null }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-gallery-images'] })
      showToast('Image added ✓')
      setImgModal({ open: false, editing: null })
    },
    onError: () => showToast('Failed to add image', 'error'),
  })

  const updateImgMut = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: ImgDraft }) =>
      galleryApi.images.update(id, { ...dto, caption: dto.caption || null }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-gallery-images'] })
      showToast('Image updated ✓')
      setImgModal({ open: false, editing: null })
    },
    onError: () => showToast('Failed to update image', 'error'),
  })

  const deleteImgMut = useMutation({
    mutationFn: (id: number) => galleryApi.images.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-gallery-images'] })
      showToast('Image removed')
      setDelImg(null)
    },
    onError: () => showToast('Failed to delete image', 'error'),
  })

  // ── Bulk upload ──
  const handleBulkUpload = async () => {
    if (!selectedCatId || bulkFiles.length === 0) return
    setBulkUploading(true)
    try {
      const results = await galleryApi.images.bulkUpload(selectedCatId, bulkFiles, bulkPublic)
      qc.invalidateQueries({ queryKey: ['admin-gallery-images'] })
      showToast(`${results.length} image${results.length !== 1 ? 's' : ''} uploaded ✓`)
      setBulkFiles([])
      setBulkOpen(false)
    } catch {
      showToast('Bulk upload failed', 'error')
    } finally {
      setBulkUploading(false)
    }
  }

  const sortedCategories = [...categories].sort((a, b) => a.sortOrder - b.sortOrder)
  const displayedImages = selectedCatId !== null
    ? images
    : images.slice(0, 30)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gallery</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {categories.length} categories · {images.length} images loaded
          </p>
        </div>
        <button
          onClick={() => setCatModal({ open: true, editing: null })}
          className={BTN_GOLD}
        >
          <Plus className="h-4 w-4" /> New Category
        </button>
      </div>

      <div className="flex gap-6">

        {/* ── Left: Category sidebar ──────────────────────────────────── */}
        <div className="w-60 shrink-0">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
              <Tag className="h-4 w-4 text-gray-400" />
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Categories</span>
            </div>

            {catsLoading ? (
              <div className="flex items-center justify-center py-8 gap-2 text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading…
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {/* All images option */}
                <button
                  onClick={() => setSelectedCatId(null)}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-sm text-left transition ${
                    selectedCatId === null
                      ? 'bg-[#E8B84B]/10 text-[#0d1b0d] dark:text-[#E8B84B] font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Images className="h-4 w-4 shrink-0 text-gray-400" />
                  <span className="flex-1 truncate">All Images</span>
                  {selectedCatId === null && <ChevronRight className="h-3.5 w-3.5 text-[#E8B84B]" />}
                </button>

                {sortedCategories.map((cat, ci) => (
                  <div key={`cat-${cat.id}-${ci}`} className={`group flex items-center gap-2 px-4 py-3 transition cursor-pointer ${
                    selectedCatId === cat.id
                      ? 'bg-[#E8B84B]/10'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                    onClick={() => setSelectedCatId(cat.id)}
                  >
                    <span className="text-base shrink-0">{cat.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate font-medium ${
                        selectedCatId === cat.id
                          ? 'text-[#0d1b0d] dark:text-[#E8B84B]'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>{cat.title}</p>
                      {!cat.isActive && (
                        <span className="text-[10px] text-gray-400">Hidden</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={e => { e.stopPropagation(); setCatModal({ open: true, editing: cat }) }}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); setDelCat(cat) }}
                        className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                    {selectedCatId === cat.id && <ChevronRight className="h-3.5 w-3.5 text-[#E8B84B] shrink-0" />}
                  </div>
                ))}

                {categories.length === 0 && (
                  <p className="px-4 py-6 text-xs text-gray-400 text-center">No categories yet.<br />Create one to get started.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Images panel ─────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {selectedCat ? `${selectedCat.icon} ${selectedCat.title}` : 'All Images'}
              </h2>
              <span className="text-xs text-gray-400">({displayedImages.length})</span>
            </div>
            {selectedCatId !== null && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBulkOpen(true)}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <Upload className="h-3.5 w-3.5" /> Bulk Upload
                </button>
                <button
                  onClick={() => setImgModal({ open: true, editing: null })}
                  className={BTN_GOLD}
                >
                  <Plus className="h-4 w-4" /> Add Image
                </button>
              </div>
            )}
          </div>

          {selectedCatId === null && categories.length > 0 && (
            <div className="mb-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 px-4 py-3 text-sm text-blue-700 dark:text-blue-300">
              Select a category on the left to manage its images, or add images to a specific category.
            </div>
          )}

          {imgsLoading ? (
            <div className="flex items-center justify-center py-20 gap-2 text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading images…
            </div>
          ) : (
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {displayedImages.map((img, ii) => {
                const cat = categories.find(c => c.id === img.galleryCategoryId)
                return (
                  <div
                    key={`img-${img.id}-${ii}`}
                    className="group relative aspect-square overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
                  >
                    <img
                      src={img.url}
                      alt={img.caption ?? ''}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5">
                      <p className="text-xs font-semibold text-white line-clamp-1">{img.caption || 'No caption'}</p>
                      {cat && <span className="mt-0.5 text-[10px] text-white/70">{cat.icon} {cat.title}</span>}
                    </div>
                    {!img.isPublic && (
                      <span className="absolute top-2 left-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] text-white">Hidden</span>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setImgModal({ open: true, editing: img })}
                        className="rounded-lg bg-white/90 dark:bg-gray-800/90 p-1.5 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 shadow"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => setDelImg(img)}
                        className="rounded-lg bg-red-500 p-1.5 text-white hover:bg-red-600 shadow"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )
              })}
              {displayedImages.length === 0 && !imgsLoading && (
                <div className="col-span-full py-16 text-center text-gray-400">
                  <p className="text-4xl mb-2">📷</p>
                  <p className="text-sm">No images in this category yet.</p>
                  {selectedCatId !== null && (
                    <button onClick={() => setImgModal({ open: true, editing: null })} className="mt-3 text-sm text-[#E8B84B] hover:underline">
                      Add the first image →
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Category modal ──────────────────────────────────────────────── */}
      {catModal.open && (
        <CategoryModal
          initial={catModal.editing}
          onClose={() => setCatModal({ open: false, editing: null })}
          saving={createCatMut.isPending || updateCatMut.isPending}
          onSave={dto => {
            if (catModal.editing) {
              updateCatMut.mutate({ id: catModal.editing.id, dto })
            } else {
              createCatMut.mutate(dto)
            }
          }}
        />
      )}

      {/* ── Image modal ─────────────────────────────────────────────────── */}
      {imgModal.open && (
        <ImageModal
          categoryId={selectedCatId ?? categories[0]?.id ?? 0}
          categories={categories}
          initial={imgModal.editing}
          onClose={() => setImgModal({ open: false, editing: null })}
          saving={createImgMut.isPending || updateImgMut.isPending}
          onSave={draft => {
            if (imgModal.editing) {
              updateImgMut.mutate({ id: imgModal.editing.id, dto: draft })
            } else {
              createImgMut.mutate(draft)
            }
          }}
        />
      )}

      {/* ── Bulk upload modal ───────────────────────────────────────────── */}
      {bulkOpen && selectedCatId !== null && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <h3 className="font-bold text-gray-900 dark:text-white">Bulk Upload to {selectedCat?.title}</h3>
              <button onClick={() => { setBulkOpen(false); setBulkFiles([]) }} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <input
                ref={bulkInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={e => setBulkFiles(Array.from(e.target.files ?? []))}
              />
              <button
                onClick={() => bulkInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 py-8 text-sm text-gray-500 dark:text-gray-400 hover:border-[#E8B84B]/50 hover:text-gray-700 transition"
              >
                <Upload className="h-6 w-6" />
                {bulkFiles.length > 0
                  ? `${bulkFiles.length} file${bulkFiles.length !== 1 ? 's' : ''} selected`
                  : 'Click to select images'}
              </button>
              {bulkFiles.length > 0 && (
                <div className="max-h-32 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
                  {bulkFiles.map((f, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400">
                      <span className="truncate">{f.name}</span>
                      <span className="ml-2 shrink-0 text-gray-400">{(f.size / 1024).toFixed(0)} KB</span>
                    </div>
                  ))}
                </div>
              )}
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={bulkPublic} onChange={e => setBulkPublic(e.target.checked)} className="h-4 w-4 accent-[#E8B84B]" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Make images public</span>
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => { setBulkOpen(false); setBulkFiles([]) }} className={BTN_GHOST}>Cancel</button>
                <button
                  onClick={handleBulkUpload}
                  disabled={bulkUploading || bulkFiles.length === 0}
                  className={BTN_GOLD}
                >
                  {bulkUploading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Uploading…</> : <>Upload {bulkFiles.length > 0 ? bulkFiles.length : ''} Files</>}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}

      {/* ── Delete category confirm ─────────────────────────────────────── */}
      {delCat && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 shadow-2xl p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Delete "{delCat.title}"?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              This will delete the category. Images in this category may become uncategorised.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDelCat(null)} className={BTN_GHOST}>Cancel</button>
              <button
                onClick={() => deleteCatMut.mutate(delCat.id)}
                disabled={deleteCatMut.isPending}
                className="flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
              >
                {deleteCatMut.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}

      {/* ── Delete image confirm ────────────────────────────────────────── */}
      {delImg && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 shadow-2xl p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Remove Image?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              This will permanently remove the image from the gallery.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDelImg(null)} className={BTN_GHOST}>Cancel</button>
              <button
                onClick={() => deleteImgMut.mutate(delImg.id)}
                disabled={deleteImgMut.isPending}
                className="flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
              >
                {deleteImgMut.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Remove
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}
