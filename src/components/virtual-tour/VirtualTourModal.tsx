import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { PanoViewer } from './PanoViewer'
import type { PanoScene } from './PanoViewer'

/**
 * Equirectangular panorama images — sourced from Poly Haven (CC0 licence).
 * To use real Demo School panoramas, swap each `image` URL with an
 * equirectangular JPG/PNG exported from a Ricoh Theta, Insta360, or Panotour Pro.
 *
 * Poly Haven thumbs are 3000×1500 px, CC0, CORS-enabled (~1–6 MB each).
 */

const PH_THUMB = (name: string) =>
  `https://cdn.polyhaven.com/asset_img/thumbs/${name}.png?width=400&height=200`

const PH_FULL  = (name: string) =>
  `https://cdn.polyhaven.com/asset_img/thumbs/${name}.png?width=3000&height=1500`

const PH_TONE  = (name: string) =>
  `https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/${name}.jpg`

const SCENES: PanoScene[] = [
  {
    id:      'campus',
    label:   'Campus Entrance',
    icon:    '🏫',
    image:   PH_FULL('school_quad'),
    preview: PH_THUMB('school_quad'),
    pitch:   0,
    yaw:     0,
    hotspots: [
      { pitch: -3, yaw:   60, targetScene: 'classrooms', text: '→ Smart Classrooms' },
      { pitch: -3, yaw:  -60, targetScene: 'sports',     text: '→ Sports Complex'   },
      { pitch: -3, yaw:  170, targetScene: 'library',    text: '→ Digital Library'  },
    ],
  },
  {
    id:      'classrooms',
    label:   'Smart Classrooms',
    icon:    '🖥️',
    image:   PH_FULL('school_hall'),
    preview: PH_THUMB('school_hall'),
    pitch:   0,
    yaw:     0,
    hotspots: [
      { pitch: -3, yaw: -120, targetScene: 'campus',  text: '→ Campus Entrance' },
      { pitch: -3, yaw:  120, targetScene: 'library', text: '→ Digital Library' },
      { pitch: -3, yaw:    0, targetScene: 'music',   text: '→ Music Studio'    },
    ],
  },
  {
    id:      'library',
    label:   'Digital Library',
    icon:    '📚',
    image:   PH_FULL('reading_room'),
    preview: PH_THUMB('reading_room'),
    pitch:   -5,
    yaw:     0,
    hotspots: [
      { pitch: -3, yaw: -90, targetScene: 'classrooms', text: '→ Smart Classrooms' },
      { pitch: -3, yaw:  90, targetScene: 'sports',     text: '→ Sports Complex'   },
      { pitch: -3, yaw: 170, targetScene: 'campus',     text: '→ Campus Entrance'  },
    ],
  },
  {
    id:      'music',
    label:   'Music Studio',
    icon:    '🎹',
    image:   PH_TONE('music_hall_01'),
    preview: PH_THUMB('music_hall_01'),
    pitch:   0,
    yaw:     0,
    hotspots: [
      { pitch: -3, yaw: -90, targetScene: 'classrooms', text: '→ Smart Classrooms' },
      { pitch: -3, yaw:  90, targetScene: 'sports',     text: '→ Sports Complex'   },
    ],
  },
  {
    id:      'sports',
    label:   'Sports Complex',
    icon:    '🏟️',
    image:   PH_TONE('gym_01'),
    preview: PH_THUMB('gym_01'),
    pitch:   0,
    yaw:     0,
    hotspots: [
      { pitch: -3, yaw: -90, targetScene: 'campus',  text: '→ Campus Entrance' },
      { pitch: -3, yaw:   0, targetScene: 'music',   text: '→ Music Studio'    },
      { pitch: -3, yaw:  90, targetScene: 'library', text: '→ Digital Library' },
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
                  Demo School · Kutus, Kirinyaga — drag to explore, click hotspots to teleport
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
