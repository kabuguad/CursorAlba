import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, ArrowRight, ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { GlassCard } from '../components/ui/GlassCard'
import { Link } from 'react-router-dom'
import { facilitiesApi, type FacilityDto } from '../services/facilitiesApi'

interface FacilityModalProps {
  open: boolean
  facility: FacilityDto | null
  onClose: () => void
}

function FacilityModal({ open, facility, onClose }: FacilityModalProps) {
  const scrollYRef = useRef(0)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      scrollYRef.current = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollYRef.current}px`
      document.body.style.width = '100%'
      if (contentRef.current) contentRef.current.scrollTop = 0
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
  }, [open])

  const highlights = facility?.highlights
    ? facility.highlights.split('\n').map(h => h.trim()).filter(Boolean)
    : []

  return createPortal(
    <AnimatePresence>
      {open && facility && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            onClick={e => e.stopPropagation()}
            className="glass glass-border relative mx-auto flex w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-surface-elevated text-foreground lg:flex-row max-h-[90vh]"
          >
            <button onClick={onClose} className="absolute top-4 right-4 z-10 rounded-xl p-2 bg-black/20 hover:bg-black/40 transition">
              <X className="h-5 w-5 text-white" />
            </button>
            {facility.img && (
              <div className="relative h-64 w-full overflow-hidden lg:h-auto lg:w-1/2 lg:max-h-[90vh]">
                <img src={facility.img} alt={facility.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:bg-gradient-to-r" />
                <span className="absolute bottom-4 left-4 text-4xl">{facility.icon}</span>
              </div>
            )}
            <div className="flex-1 overflow-y-auto p-8 lg:w-1/2" ref={contentRef}>
              {!facility.img && <span className="mb-4 block text-4xl">{facility.icon}</span>}
              <h2 className="mt-2 text-3xl font-bold text-primary dark:text-gold">{facility.name}</h2>
              <div className="my-4 h-0.5 w-12 rounded-full bg-gold/60" />
              <p className="text-muted leading-relaxed">{facility.desc}</p>
              {highlights.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {highlights.map(h => (
                    <span key={h} className="flex items-center gap-1 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-medium">
                      <ChevronRight className="h-3 w-3 text-gold" /> {h}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-8">
                <Link to="/admissions" onClick={onClose} className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 font-bold text-white transition hover:scale-105 hover:bg-primary/90 dark:bg-gold dark:text-black w-fit">
                  Apply for Admission <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export function Facilities() {
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const { data: pageContent } = useQuery({ queryKey: ['facilities-page-content'], queryFn: () => facilitiesApi.getPageContent(), staleTime: 60_000 })
  const { data: facilities = [], isLoading } = useQuery({ queryKey: ['facilities'], queryFn: () => facilitiesApi.getAll(), staleTime: 60_000 })

  const published = facilities.filter(f => f.isPublished).sort((a, b) => a.sortOrder - b.sortOrder)
  const active = published.find(f => f.facilityId === selectedId) ?? null

  const headline    = pageContent?.headline    ?? 'World-Class Facilities'
  const subheadline = pageContent?.subheadline ?? 'World-class infrastructure designed for modern learning — click any facility to explore.'
  const ctaHeadline = pageContent?.ctaHeadline ?? 'Experience It In Person'
  const ctaSubtext  = pageContent?.ctaSubtext  ?? "Book a campus tour and see our facilities first-hand. Adjacent to the Governor's Offices, Kutus."

  return (
    <div className="overflow-hidden">

      {/* ── Hero Banner (fixed parallax) ── */}
      <section
        className="relative flex min-h-[68vh] items-end justify-center overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=80')`,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0 100%)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/60 to-black/20" />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-gold via-gold/60 to-transparent" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 pb-20 pt-40 text-center">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/30 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />Campus Infrastructure
            </span>
            <h1 className="mt-4 text-5xl font-extrabold leading-tight text-white md:text-7xl [text-shadow:_0_4px_32px_rgba(0,0,0,0.6)]">{headline}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/75">{subheadline}</p>
          </motion.div>
        </div>
      </section>

      {/* ── Grid ── */}
      <div className="mx-auto max-w-7xl px-4 py-20">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-muted">
            <Loader2 className="h-6 w-6 animate-spin text-gold" /> Loading facilities…
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {published.map((f, i) => (
              <motion.div
                key={f.facilityId}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <button
                  onClick={() => setSelectedId(f.facilityId)}
                  className="group w-full text-left"
                >
                  <GlassCard className="overflow-hidden p-0 transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-2xl group-hover:ring-2 group-hover:ring-gold/40">
                    <div className="relative h-44 overflow-hidden">
                      {f.img ? (
                        <img src={f.img} alt={f.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-gold/20 text-5xl">
                          {f.icon}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
                        <span className="rounded-full border border-white/50 bg-white/20 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
                          View Details
                        </span>
                      </div>
                      <span className="absolute bottom-3 left-3 text-3xl drop-shadow-md">{f.icon}</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-foreground group-hover:text-primary dark:group-hover:text-gold transition-colors">{f.name}</h3>
                      <p className="mt-1 text-xs text-muted line-clamp-2">{f.desc}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                        Explore <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </GlassCard>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <FacilityModal open={!!selectedId} facility={active} onClose={() => setSelectedId(null)} />

      {/* ── CTA ── */}
      <section
        className="relative py-20 overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80')`,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/75" />
        <motion.div
          className="relative z-10 mx-auto max-w-2xl px-4 text-center"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">{ctaHeadline}</h2>
          <p className="mb-8 text-white/70">{ctaSubtext}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="flex items-center gap-2 rounded-2xl bg-gold px-8 py-3.5 font-bold text-black transition hover:scale-105 hover:bg-yellow-400">
              Book a Campus Tour <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/admissions" className="flex items-center gap-2 rounded-2xl border-2 border-white/30 px-8 py-3.5 font-bold text-white transition hover:scale-105 hover:bg-white/10">
              Apply Online
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
