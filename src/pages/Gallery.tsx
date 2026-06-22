import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { PageHero } from '../components/layout/PageHero'
import { ScrollReveal } from '../components/ui/ScrollReveal'

type CategoryId = 'all' | 'sports' | 'robotics' | 'arts' | 'music' | 'karate' | 'skating' | 'trips'

interface GalleryItem {
  id: number
  category: Exclude<CategoryId, 'all'>
  url: string
  caption: string
  aspect: string
}

interface CategoryMeta {
  label: string
  icon: string
  activeClass: string
}

const CATEGORY_META: Record<CategoryId, CategoryMeta> = {
  all:      { label: 'All Photos',          icon: '🖼️', activeClass: 'bg-gold text-dark' },
  sports:   { label: 'Sports',              icon: '⚽', activeClass: 'bg-emerald-600 text-white' },
  robotics: { label: 'Computer & Robotics', icon: '🤖', activeClass: 'bg-blue-600 text-white' },
  arts:     { label: 'Creative Arts',       icon: '🎨', activeClass: 'bg-purple-600 text-white' },
  music:    { label: 'Music',               icon: '🎵', activeClass: 'bg-rose-600 text-white' },
  karate:   { label: 'Karate',              icon: '🥋', activeClass: 'bg-red-600 text-white' },
  skating:  { label: 'Rollerskating',       icon: '⛸️', activeClass: 'bg-sky-600 text-white' },
  trips:    { label: 'Trips',               icon: '🌍', activeClass: 'bg-teal-600 text-white' },
}

const ALL_CATEGORIES: CategoryId[] = [
  'all', 'sports', 'robotics', 'arts', 'music', 'karate', 'skating', 'trips',
]

const GALLERY: GalleryItem[] = [
  // ── Sports ──────────────────────────────────────────────────────────────
  { id: 1,  category: 'sports',   aspect: 'aspect-video',  url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=80',  caption: 'Inter-School Football Championship' },
  { id: 2,  category: 'sports',   aspect: 'aspect-square', url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=700&q=80',    caption: 'Basketball Tournament Finals' },
  { id: 3,  category: 'sports',   aspect: 'aspect-[3/4]',  url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=700&q=80',  caption: 'Athletics Day 2024' },
  { id: 4,  category: 'sports',   aspect: 'aspect-square', url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=700&q=80',  caption: 'Volleyball County Match' },
  { id: 5,  category: 'sports',   aspect: 'aspect-[3/4]',  url: 'https://images.unsplash.com/photo-1593786082977-3048b39ff12c?w=700&q=80',  caption: 'Football Team — County Champions' },
  { id: 6,  category: 'sports',   aspect: 'aspect-video',  url: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a26?w=900&q=80',  caption: 'Swimming Gala' },
  // ── Computer & Robotics ──────────────────────────────────────────────────
  { id: 7,  category: 'robotics', aspect: 'aspect-video',  url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&q=80',  caption: 'Coding Class in Session' },
  { id: 8,  category: 'robotics', aspect: 'aspect-square', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=700&q=80',  caption: 'Robotics Club — Build Day' },
  { id: 9,  category: 'robotics', aspect: 'aspect-[3/4]',  url: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=700&q=80',    caption: 'National Science Fair 2024' },
  { id: 10, category: 'robotics', aspect: 'aspect-square', url: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=700&q=80',  caption: 'AI & Robotics Workshop' },
  { id: 11, category: 'robotics', aspect: 'aspect-video',  url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80',  caption: 'Electronics Lab Session' },
  // ── Creative Arts ────────────────────────────────────────────────────────
  { id: 12, category: 'arts',     aspect: 'aspect-[3/4]',  url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=700&q=80',  caption: 'Annual Art Exhibition 2024' },
  { id: 13, category: 'arts',     aspect: 'aspect-square', url: 'https://images.unsplash.com/photo-1488841714725-bb4c32d1ac94?w=700&q=80',  caption: 'Watercolour Workshop' },
  { id: 14, category: 'arts',     aspect: 'aspect-video',  url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=900&q=80',  caption: 'Clay Sculpture Class' },
  { id: 15, category: 'arts',     aspect: 'aspect-square', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80',    caption: 'Textile & Craft Design' },
  { id: 16, category: 'arts',     aspect: 'aspect-[3/4]',  url: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=700&q=80',  caption: 'Portrait Painting Session' },
  // ── Music ────────────────────────────────────────────────────────────────
  { id: 17, category: 'music',    aspect: 'aspect-video',  url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=900&q=80',  caption: 'End-of-Year Music Concert' },
  { id: 18, category: 'music',    aspect: 'aspect-[3/4]',  url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=700&q=80',  caption: 'School Choir Performance' },
  { id: 19, category: 'music',    aspect: 'aspect-square', url: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=700&q=80',  caption: 'Piano Recital Evening' },
  { id: 20, category: 'music',    aspect: 'aspect-video',  url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=900&q=80',  caption: 'School Band Performance' },
  { id: 21, category: 'music',    aspect: 'aspect-square', url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=700&q=80',  caption: 'Guitar Class' },
  // ── Karate ───────────────────────────────────────────────────────────────
  { id: 22, category: 'karate',   aspect: 'aspect-video',  url: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=900&q=80',    caption: 'Karate Grading Ceremony' },
  { id: 23, category: 'karate',   aspect: 'aspect-square', url: 'https://images.unsplash.com/photo-1614850715649-1d0106293bd1?w=700&q=80',  caption: 'Junior Karate Class' },
  { id: 24, category: 'karate',   aspect: 'aspect-[3/4]',  url: 'https://images.unsplash.com/photo-1599586120429-48281b6f0ece?w=700&q=80',  caption: 'Karate National Tournament' },
  { id: 25, category: 'karate',   aspect: 'aspect-square', url: 'https://images.unsplash.com/photo-1625329614078-9ba68680d9de?w=700&q=80',  caption: 'Kata Competition' },
  // ── Rollerskating ────────────────────────────────────────────────────────
  { id: 26, category: 'skating',  aspect: 'aspect-video',  url: 'https://images.unsplash.com/photo-1610913245788-f23d18d99ec5?w=900&q=80',  caption: 'Rollerskating Fun Day' },
  { id: 27, category: 'skating',  aspect: 'aspect-[3/4]',  url: 'https://images.unsplash.com/photo-1585159812596-fce9b54c5e77?w=700&q=80',  caption: 'Beginners Skating Class' },
  { id: 28, category: 'skating',  aspect: 'aspect-square', url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=700&q=80',  caption: 'Rollerskating Showcase' },
  // ── Trips ────────────────────────────────────────────────────────────────
  { id: 29, category: 'trips',    aspect: 'aspect-video',  url: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=900&q=80',  caption: 'Science Museum Educational Tour' },
  { id: 30, category: 'trips',    aspect: 'aspect-square', url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=700&q=80',  caption: 'Nature Conservation Camp' },
  { id: 31, category: 'trips',    aspect: 'aspect-[3/4]',  url: 'https://images.unsplash.com/photo-1527004013197-933b34a20793?w=700&q=80',  caption: 'Mountain Hiking Excursion' },
  { id: 32, category: 'trips',    aspect: 'aspect-square', url: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=700&q=80',  caption: 'Coastal Field Trip' },
  { id: 33, category: 'trips',    aspect: 'aspect-video',  url: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=900&q=80',  caption: 'Cultural Heritage Visit' },
]

const counts = ALL_CATEGORIES.reduce<Record<CategoryId, number>>((acc, cat) => {
  acc[cat] = cat === 'all' ? GALLERY.length : GALLERY.filter(i => i.category === cat).length
  return acc
}, {} as Record<CategoryId, number>)

export function Gallery() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all')
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const filtered = activeCategory === 'all'
    ? GALLERY
    : GALLERY.filter(i => i.category === activeCategory)

  const prev = useCallback(() => {
    setLightboxIdx(i => i === null ? null : (i - 1 + filtered.length) % filtered.length)
  }, [filtered.length])

  const next = useCallback(() => {
    setLightboxIdx(i => i === null ? null : (i + 1) % filtered.length)
  }, [filtered.length])

  const close = useCallback(() => setLightboxIdx(null), [])

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

  return (
    <div className="overflow-hidden">
      <PageHero
        title="School Gallery"
        subtitle="A window into life at Alber School — sports, arts, music, adventures and everything in between."
        badge="Photo Gallery"
        image="https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=1920&q=80"
        variant="cinematic"
        overlay="dark"
        height="md"
      />

      <div className="mx-auto max-w-7xl px-4 py-16">

        {/* ── Category filter tabs ─────────────────────────────────────────── */}
        <ScrollReveal className="mb-10">
          <div className="flex flex-wrap justify-center gap-2">
            {ALL_CATEGORIES.map(cat => {
              const meta = CATEGORY_META[cat]
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setLightboxIdx(null) }}
                  className={[
                    'flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95',
                    isActive
                      ? meta.activeClass
                      : 'border border-theme bg-surface text-muted hover:border-primary/30 dark:hover:border-gold/30 hover:text-foreground',
                  ].join(' ')}
                >
                  <span aria-hidden>{meta.icon}</span>
                  <span>{meta.label}</span>
                  <span className={[
                    'rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none',
                    isActive
                      ? 'bg-white/25'
                      : 'bg-primary/10 text-primary dark:bg-gold/10 dark:text-gold',
                  ].join(' ')}>
                    {counts[cat]}
                  </span>
                </button>
              )
            })}
          </div>
        </ScrollReveal>

        {/* ── Photo grid (CSS masonry via columns) ────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="columns-2 gap-3 md:columns-3 lg:columns-4"
          >
            {filtered.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(idx * 0.04, 0.5) }}
                className="group relative mb-3 cursor-pointer overflow-hidden rounded-2xl border border-white/10 shadow-md transition-shadow duration-300 hover:shadow-2xl break-inside-avoid"
                onClick={() => setLightboxIdx(idx)}
              >
                <img
                  src={item.url}
                  alt={item.caption}
                  loading="lazy"
                  className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${item.aspect}`}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex items-start gap-2">
                    <ZoomIn className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                    <p className="line-clamp-2 text-xs font-semibold leading-snug text-white">{item.caption}</p>
                  </div>
                  <p className="mt-1 text-[10px] text-white/55">
                    {CATEGORY_META[item.category].icon} {CATEGORY_META[item.category].label}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="py-24 text-center text-muted">
            <p className="mb-2 text-5xl">📷</p>
            <p className="font-medium">No photos in this category yet.</p>
          </div>
        )}
      </div>

      {/* ── Lightbox ──────────────────────────────────────────────────────── */}
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
            {/* Close */}
            <button
              aria-label="Close"
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2.5 text-white backdrop-blur-sm transition hover:bg-white/25"
              onClick={close}
            >
              <X className="h-5 w-5" />
            </button>

            {/* Counter */}
            <div className="absolute left-4 top-4 z-10 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              {lightboxIdx! + 1} / {filtered.length}
            </div>

            {/* Prev */}
            <button
              aria-label="Previous"
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/25"
              onClick={e => { e.stopPropagation(); prev() }}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Next */}
            <button
              aria-label="Next"
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/25"
              onClick={e => { e.stopPropagation(); next() }}
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={lightboxItem.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex max-h-[90vh] max-w-5xl w-full flex-col items-center"
                onClick={e => e.stopPropagation()}
              >
                <img
                  src={lightboxItem.url}
                  alt={lightboxItem.caption}
                  className="max-h-[78vh] max-w-full rounded-2xl object-contain shadow-2xl"
                />
                <div className="mt-4 text-center">
                  <p className="text-base font-semibold text-white">{lightboxItem.caption}</p>
                  <p className="mt-0.5 text-sm text-white/50">
                    {CATEGORY_META[lightboxItem.category].icon} {CATEGORY_META[lightboxItem.category].label}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
