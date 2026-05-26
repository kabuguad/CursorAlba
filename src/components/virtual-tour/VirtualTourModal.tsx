import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin } from 'lucide-react'
import { cn } from '../../lib/utils'

const HOTSPOTS = [
  { id: 'classrooms', label: 'Classrooms', embed: 'https://www.youtube.com/embed/8vXo9fEIqWk?autoplay=1&mute=1' },
  { id: 'music', label: 'Music Studio', embed: 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1' },
  { id: 'dance', label: 'Dance Studio', embed: 'https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1&mute=1' },
  { id: 'sports', label: 'Sports Fields', embed: 'https://www.youtube.com/embed/Dx5qF7dHySs?autoplay=1&mute=1' },
]

interface VirtualTourModalProps {
  open: boolean
  onClose: () => void
}

export function VirtualTourModal({ open, onClose }: VirtualTourModalProps) {
  const [active, setActive] = useState(HOTSPOTS[0])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass glass-border relative flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-surface-elevated text-foreground"
          >
            <div className="flex items-center justify-between border-b border-primary/10 p-6 dark:border-gold/20">
              <div>
                <h2 className="text-2xl font-bold text-primary dark:text-gold">360° Virtual Tour</h2>
                <p className="text-sm text-muted">Explore Alber School — Kutus, Kirinyaga</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl p-2 transition hover:bg-primary/10 hover:scale-110"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-4 overflow-hidden p-6 lg:flex-row">
              <div className="relative flex-1 overflow-hidden rounded-2xl">
                <iframe
                  key={active.id}
                  title={`360 tour - ${active.label}`}
                  src={active.embed}
                  className="h-full min-h-[300px] w-full rounded-2xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-xl bg-primary/90 px-4 py-2 text-white">
                  <MapPin className="h-4 w-4 text-gold" />
                  <span className="text-sm font-medium">{active.label}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 lg:w-48 lg:flex-col">
                <p className="w-full text-xs font-semibold uppercase tracking-wider text-primary dark:text-gold">
                  Teleport to
                </p>
                {HOTSPOTS.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => setActive(h)}
                    className={cn(
                      'rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-300',
                      'hover:scale-105',
                      active.id === h.id
                        ? 'bg-primary text-white shadow-[0_0_20px_rgba(21,128,61,0.4)]'
                        : 'glass glass-border bg-surface hover:border-gold/50',
                    )}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
