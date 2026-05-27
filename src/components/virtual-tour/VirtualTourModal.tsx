import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { PanoViewer } from './PanoViewer'
import type { PanoScene } from './PanoViewer'

/**
 * Equirectangular panorama images used for the virtual tour demo.
 * Replace these URLs with real school panoramas shot with a 360° camera
 * (e.g. Insta360, Ricoh Theta, or any equirectangular export from Panotour Pro).
 */
const SCENES: PanoScene[] = [
  {
    id: 'campus',
    label: 'Campus Entrance',
    icon: '🏫',
    image: 'https://pannellum.org/images/cerro-toco-0.jpg',
    pitch: 0,
    yaw: 0,
    hotspots: [
      { pitch: -2,  yaw:  80, targetScene: 'classrooms', text: '→ Smart Classrooms' },
      { pitch: -2,  yaw: -80, targetScene: 'sports',     text: '→ Sports Complex'   },
      { pitch:  3,  yaw: 160, targetScene: 'library',    text: '→ Digital Library'  },
    ],
  },
  {
    id: 'classrooms',
    label: 'Smart Classrooms',
    icon: '🖥️',
    image: 'https://pannellum.org/images/cerro-toco-0.jpg',
    pitch: 5,
    yaw: 90,
    hotspots: [
      { pitch: -2, yaw: -60, targetScene: 'campus',   text: '→ Campus Entrance' },
      { pitch: -2, yaw: 180, targetScene: 'library',  text: '→ Digital Library' },
      { pitch: -2, yaw:  90, targetScene: 'music',    text: '→ Music Studio'    },
    ],
  },
  {
    id: 'library',
    label: 'Digital Library',
    icon: '📚',
    image: 'https://pannellum.org/images/cerro-toco-0.jpg',
    pitch: -8,
    yaw: 180,
    hotspots: [
      { pitch: -2, yaw:   0, targetScene: 'classrooms', text: '→ Classrooms'    },
      { pitch: -2, yaw:  90, targetScene: 'sports',     text: '→ Sports Fields' },
    ],
  },
  {
    id: 'music',
    label: 'Music Studio',
    icon: '🎹',
    image: 'https://pannellum.org/images/cerro-toco-0.jpg',
    pitch: 3,
    yaw: -45,
    hotspots: [
      { pitch: -2, yaw:  60, targetScene: 'classrooms', text: '→ Classrooms'   },
      { pitch: -2, yaw: 180, targetScene: 'sports',     text: '→ Sports Complex' },
    ],
  },
  {
    id: 'sports',
    label: 'Sports Complex',
    icon: '🏟️',
    image: 'https://pannellum.org/images/cerro-toco-0.jpg',
    pitch: 0,
    yaw: -90,
    hotspots: [
      { pitch: -2, yaw:  90, targetScene: 'campus',  text: '→ Campus Entrance' },
      { pitch: -2, yaw: -45, targetScene: 'library', text: '→ Library'         },
    ],
  },
]

interface VirtualTourModalProps {
  open: boolean
  onClose: () => void
}

export function VirtualTourModal({ open, onClose }: VirtualTourModalProps) {
  const scrollRef = useRef(0)

  useEffect(() => {
    if (open) {
      scrollRef.current = window.scrollY
      document.body.style.overflow = 'hidden'
      document.body.style.top = `-${scrollRef.current}px`
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.overflow = ''
      document.body.style.width = ''
      window.scrollTo(0, scrollRef.current)
    }
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.overflow = ''
      document.body.style.width = ''
    }
  }, [open])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between bg-black/90 px-6 py-4 backdrop-blur-sm">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                  <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-gold" />
                  360° Virtual Tour
                  <span className="ml-1 rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-gold">
                    Live
                  </span>
                </h2>
                <p className="mt-0.5 text-xs text-white/50">
                  Alber School · Kutus, Kirinyaga — drag to explore, click hotspots to teleport
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
                aria-label="Close virtual tour"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Panorama viewer — fills remaining space */}
            <div className="flex-1 overflow-hidden">
              <PanoViewer scenes={SCENES} initialScene="campus" autoRotate={2} />
            </div>

            {/* Footer note */}
            <div className="shrink-0 bg-black/80 px-6 py-2 text-center text-[11px] text-white/30">
              Demo panoramas · Replace with real school 360° photos for production
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
