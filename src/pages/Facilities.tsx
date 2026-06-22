import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { GlassCard } from '../components/ui/GlassCard'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
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
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass glass-border relative mx-auto flex w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-surface-elevated text-foreground lg:flex-row max-h-[90vh]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 rounded-xl p-2 hover:bg-primary/10"
            >
              <X className="h-6 w-6" />
            </button>
            {facility.img && (
              <img
                src={facility.img}
                alt={facility.name}
                className="h-64 w-full object-cover lg:h-auto lg:w-1/2 lg:max-h-[90vh]"
              />
            )}
            <div className="flex-1 overflow-y-auto p-8 lg:w-1/2" ref={contentRef}>
              <span className="text-4xl">{facility.icon}</span>
              <h2 className="mt-4 text-3xl font-bold text-primary dark:text-gold">{facility.name}</h2>
              <p className="mt-4 text-muted leading-relaxed">{facility.desc}</p>
              {highlights.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {highlights.map((h) => (
                    <span key={h} className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-medium">
                      {h}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-8">
                <Link to="/admissions" onClick={onClose}>
                  <Button variant="primary">Apply for Admission</Button>
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

  const { data: pageContent } = useQuery({
    queryKey: ['facilities-page-content'],
    queryFn: () => facilitiesApi.getPageContent(),
    staleTime: 60_000,
  })

  const { data: facilities = [], isLoading } = useQuery({
    queryKey: ['facilities'],
    queryFn: () => facilitiesApi.getAll(),
    staleTime: 60_000,
  })

  const published = facilities.filter(f => f.isPublished).sort((a, b) => a.sortOrder - b.sortOrder)
  const active = published.find(f => f.facilityId === selectedId) ?? null

  const headline   = pageContent?.headline    ?? 'Facilities'
  const subheadline = pageContent?.subheadline ?? 'World-class infrastructure designed for modern learning — click any facility to explore.'
  const ctaHeadline = pageContent?.ctaHeadline ?? 'Experience It In Person'
  const ctaSubtext  = pageContent?.ctaSubtext  ?? "Book a campus tour and see our facilities first-hand. Adjacent to the Governor's Offices, Kutus."

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <ScrollReveal className="mb-16 text-center">
        <h1 className="mb-4 text-5xl font-bold md:text-7xl">{headline}</h1>
        <p className="mx-auto max-w-2xl text-muted">{subheadline}</p>
      </ScrollReveal>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-muted">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading facilities…
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {published.map((f, i) => (
            <ScrollReveal key={f.facilityId} delay={i * 0.06}>
              <button
                onClick={() => setSelectedId(f.facilityId)}
                className="w-full text-left transition-all hover:scale-105"
              >
                <GlassCard className="overflow-hidden p-0">
                  <div className="relative h-40 overflow-hidden">
                    {f.img ? (
                      <img src={f.img} alt={f.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-gold/20 text-5xl">
                        {f.icon}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className="absolute bottom-3 left-3 text-3xl">{f.icon}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold">{f.name}</h3>
                    <p className="mt-1 text-xs text-muted line-clamp-2">{f.desc}</p>
                  </div>
                </GlassCard>
              </button>
            </ScrollReveal>
          ))}
        </div>
      )}

      <FacilityModal
        open={!!selectedId}
        facility={active}
        onClose={() => setSelectedId(null)}
      />

      <ScrollReveal className="mt-16 text-center">
        <GlassCard className="p-10">
          <h2 className="mb-4 text-3xl font-bold">{ctaHeadline}</h2>
          <p className="mb-8 text-muted">{ctaSubtext}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button variant="primary">Book a Campus Tour</Button>
            </Link>
            <Link to="/admissions">
              <Button variant="outline">Apply Online</Button>
            </Link>
          </div>
        </GlassCard>
      </ScrollReveal>
    </div>
  )
}
