import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { PageHero } from '../components/layout/PageHero'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { galleryApi, type GalleryCategory, type GalleryImage } from '../services/galleryApi'

const FALLBACK_IMAGES: GalleryImage[] = [
  { id: 1,  url: '/images/unsplash-1571019614242-c5c5dee9f50b.jpg',  caption: 'Inter-School Football Championship',   sortOrder: 0, isPublic: true, galleryCategoryId: -1 },
  { id: 2,  url: '/images/unsplash-1546519638-68e109498ffc.jpg',    caption: 'Basketball Tournament Finals',          sortOrder: 1, isPublic: true, galleryCategoryId: -1 },
  { id: 3,  url: '/images/unsplash-1461896836934-ffe607ba8211.jpg',  caption: 'Athletics Day 2024',                   sortOrder: 2, isPublic: true, galleryCategoryId: -1 },
  { id: 4,  url: '/images/unsplash-1461749280684-dccba630e2f6.jpg',  caption: 'Coding Class in Session',              sortOrder: 3, isPublic: true, galleryCategoryId: -2 },
  { id: 5,  url: '/images/unsplash-1485827404703-89b55fcc595e.jpg',  caption: 'Robotics Club — Build Day',            sortOrder: 4, isPublic: true, galleryCategoryId: -2 },
  { id: 6,  url: '/images/unsplash-1513364776144-60967b0f800f.jpg',  caption: 'Annual Art Exhibition 2024',           sortOrder: 5, isPublic: true, galleryCategoryId: -3 },
  { id: 7,  url: '/images/unsplash-1514320291840-2e0a9bf2a9ae.jpg',  caption: 'End-of-Year Music Concert',            sortOrder: 6, isPublic: true, galleryCategoryId: -4 },
  { id: 8,  url: '/images/unsplash-1555597673-b21d5c935865.jpg',    caption: 'Karate Grading Ceremony',              sortOrder: 7, isPublic: true, galleryCategoryId: -5 },
  { id: 9,  url: '/images/unsplash-1610913245788-f23d18d99ec5.jpg',  caption: 'Rollerskating Fun Day',               sortOrder: 8, isPublic: true, galleryCategoryId: -6 },
  { id: 10, url: '/images/unsplash-1464037866556-6812c9d1c72e.jpg',  caption: 'Science Museum Educational Tour',     sortOrder: 9, isPublic: true, galleryCategoryId: -7 },
]

const FALLBACK_CATEGORIES: GalleryCategory[] = [
  { id: -1, title: 'Sports',              slug: 'sports',   description: null, icon: '⚽', sortOrder: 0, isActive: true },
  { id: -2, title: 'Computer & Robotics', slug: 'robotics', description: null, icon: '🤖', sortOrder: 1, isActive: true },
  { id: -3, title: 'Creative Arts',       slug: 'arts',     description: null, icon: '🎨', sortOrder: 2, isActive: true },
  { id: -4, title: 'Music',               slug: 'music',    description: null, icon: '🎵', sortOrder: 3, isActive: true },
  { id: -5, title: 'Karate',              slug: 'karate',   description: null, icon: '🥋', sortOrder: 4, isActive: true },
  { id: -6, title: 'Rollerskating',       slug: 'skating',  description: null, icon: '⛸️', sortOrder: 5, isActive: true },
  { id: -7, title: 'Trips',               slug: 'trips',    description: null, icon: '🌍', sortOrder: 6, isActive: true },
]

const ACCENT_CLASSES = [
  'bg-emerald-600 text-white',
  'bg-blue-600 text-white',
  'bg-purple-600 text-white',
  'bg-rose-600 text-white',
  'bg-red-600 text-white',
  'bg-sky-600 text-white',
  'bg-teal-600 text-white',
  'bg-orange-600 text-white',
  'bg-indigo-600 text-white',
]

export function Gallery() {
  const [activeCatId, setActiveCatId] = useState<number | null>(null)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const scrollYRef = useRef(0)

  const { data: categories = [], isLoading: catsLoading, isError: catsError } = useQuery({
    queryKey: ['gallery-categories-public'],
    queryFn: galleryApi.categories.getAll,
    retry: 1,
  })

  const { data: allImages = [], isLoading: imgsLoading, isError: imgsError } = useQuery({
    queryKey: ['gallery-images-public'],
    queryFn: galleryApi.images.getPublic,
    retry: 1,
  })

  const useFallback = catsError || imgsError || (categories.length === 0 && allImages.length === 0 && !catsLoading && !imgsLoading)

  const activeCategories = useFallback
    ? FALLBACK_CATEGORIES
    : categories.filter(c => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder)

  const activeImages = useFallback ? FALLBACK_IMAGES : allImages

  const filtered = activeCatId === null
    ? activeImages
    : activeImages.filter(img => img.galleryCategoryId === activeCatId)

  const isLoading = catsLoading || imgsLoading
  const isOpen = lightboxIdx !== null

  const prev = useCallback(() => {
    setLightboxIdx(i => i === null ? null : (i - 1 + filtered.length) % filtered.length)
  }, [filtered.length])

  const next = useCallback(() => {
    setLightboxIdx(i => i === null ? null : (i + 1) % filtered.length)
  }, [filtered.length])

  const close = useCallback(() => setLightboxIdx(null), [])

  useEffect(() => {
    if (isOpen) {
      scrollYRef.current = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollYRef.current}px`
      document.body.style.width = '100%'
    } else {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, scrollYRef.current)
    }
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (lightboxIdx === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape')     close()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxIdx, prev, next, close])

  const lightboxItem = lightboxIdx !== null ? filtered[lightboxIdx] : null
  const lightboxCat = lightboxItem
    ? activeCategories.find(c => c.id === lightboxItem.galleryCategoryId)
    : null

  const getCatAccent = (idx: number) => ACCENT_CLASSES[idx % ACCENT_CLASSES.length]

  return (
    <div className="overflow-hidden">
      <PageHero
        title="School Gallery"
        subtitle="A window into life at Alber School — sports, arts, music, adventures and everything in between."
        badge="Photo Gallery"
        image="/images/unsplash-1564981797816-1043664bf78d.jpg"
        variant="cinematic"
        overlay="dark"
        height="md"
      />

      <div className="mx-auto max-w-7xl px-4 py-16">

        {/* ── Category filter tabs ─────────────────────────────────────────── */}
        <ScrollReveal className="mb-10">
          <div className="flex flex-wrap justify-center gap-2">
            {/* All tab */}
            <button
              onClick={() => { setActiveCatId(null); setLightboxIdx(null) }}
              className={[
                'flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95',
                activeCatId === null
                  ? 'bg-gold text-dark'
                  : 'border border-theme bg-surface text-muted hover:border-primary/30 dark:hover:border-gold/30 hover:text-foreground',
              ].join(' ')}
            >
              <span aria-hidden>🖼️</span>
              <span>All Photos</span>
              <span className={[
                'rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none',
                activeCatId === null ? 'bg-white/25' : 'bg-primary/10 text-primary dark:bg-gold/10 dark:text-gold',
              ].join(' ')}>
                {activeImages.length}
              </span>
            </button>

            {activeCategories.map((cat, idx) => {
              const count = activeImages.filter(i => i.galleryCategoryId === cat.id).length
              const isActive = activeCatId === cat.id
              return (
                <button
                  key={`cat-${cat.id}-${idx}`}
                  onClick={() => { setActiveCatId(cat.id); setLightboxIdx(null) }}
                  className={[
                    'flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95',
                    isActive
                      ? getCatAccent(idx)
                      : 'border border-theme bg-surface text-muted hover:border-primary/30 dark:hover:border-gold/30 hover:text-foreground',
                  ].join(' ')}
                >
                  {cat.icon && <span aria-hidden>{cat.icon}</span>}
                  <span>{cat.title}</span>
                  <span className={[
                    'rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none',
                    isActive ? 'bg-white/25' : 'bg-primary/10 text-primary dark:bg-gold/10 dark:text-gold',
                  ].join(' ')}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </ScrollReveal>

        {/* ── Loading state ────────────────────────────────────────────────── */}
        {isLoading && (
          <div className="flex items-center justify-center py-20 gap-2 text-muted">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading gallery…</span>
          </div>
        )}

        {/* ── Photo grid ──────────────────────────────────────────────────── */}
        {!isLoading && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCatId ?? 'all'}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="columns-2 gap-3 md:columns-3 lg:columns-4"
            >
              {filtered.map((item, idx) => {
                const cat = activeCategories.find(c => c.id === item.galleryCategoryId)
                return (
                  <motion.div
                    key={`img-${item.id}-${idx}`}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: Math.min(idx * 0.04, 0.5) }}
                    className="group relative mb-3 cursor-pointer overflow-hidden rounded-2xl border border-white/10 shadow-md transition-shadow duration-300 hover:shadow-2xl break-inside-avoid"
                    onClick={() => setLightboxIdx(idx)}
                  >
                    <img
                      src={item.url}
                      alt={item.caption ?? ''}
                      loading="lazy"
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="flex items-start gap-2">
                        <ZoomIn className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                        <p className="line-clamp-2 text-xs font-semibold leading-snug text-white">{item.caption}</p>
                      </div>
                      {cat && (
                        <p className="mt-1 text-[10px] text-white/55">
                          {cat.icon} {cat.title}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="py-24 text-center text-muted">
            <p className="mb-2 text-5xl">📷</p>
            <p className="font-medium">No photos in this category yet.</p>
          </div>
        )}
      </div>

      {/* ── Lightbox ─────────────────────────────────────────────────────── */}
      {createPortal(
        <AnimatePresence>
          {lightboxItem && (
            <motion.div
              key="lightbox-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4"
              onClick={close}
            >
              <button
                aria-label="Close"
                className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2.5 text-white backdrop-blur-sm transition hover:bg-white/25"
                onClick={close}
              >
                <X className="h-5 w-5" />
              </button>

              <div className="absolute left-4 top-4 z-10 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                {lightboxIdx! + 1} / {filtered.length}
              </div>

              <button
                aria-label="Previous"
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/25"
                onClick={e => { e.stopPropagation(); prev() }}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                aria-label="Next"
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/25"
                onClick={e => { e.stopPropagation(); next() }}
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={lightboxItem.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="flex w-full max-w-5xl flex-col items-center"
                  onClick={e => e.stopPropagation()}
                >
                  <img
                    src={lightboxItem.url}
                    alt={lightboxItem.caption ?? ''}
                    className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl"
                  />
                  <div className="mt-4 text-center">
                    <p className="text-base font-semibold text-white">{lightboxItem.caption}</p>
                    {lightboxCat && (
                      <p className="mt-0.5 text-sm text-white/50">
                        {lightboxCat.icon} {lightboxCat.title}
                      </p>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  )
}
