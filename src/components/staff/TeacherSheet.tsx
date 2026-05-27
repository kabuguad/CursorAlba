import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Award, GraduationCap } from 'lucide-react'
import type { Teacher } from '../../data/types'

interface TeacherModalProps {
  open: boolean
  teacher: Teacher | null
  onClose: () => void
}

export function TeacherModal({ open, teacher, onClose }: TeacherModalProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const scrollYRef = useRef(0)

  useEffect(() => {
    if (open) {
      scrollYRef.current = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollYRef.current}px`
      document.body.style.width = '100%'
      if (contentRef.current) {
        contentRef.current.scrollTop = 0
      }
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

  return createPortal(
    <AnimatePresence>
      {open && teacher && (
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
            <div className="flex items-center justify-center p-6 lg:w-2/5 lg:bg-primary/5">
              <div className="relative h-40 w-40 rounded-full border-4 border-gold/40 overflow-hidden">
                <img
                  src={teacher.image}
                  alt={teacher.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 lg:w-3/5" ref={contentRef}>
              <h2 className="text-3xl font-bold text-primary dark:text-gold">{teacher.name}</h2>
              <p className="mt-2 text-gold">{teacher.title}</p>
              <span className="mt-2 inline-block rounded-full bg-primary/80 px-3 py-1 text-xs text-white">
                {teacher.department}
              </span>
              <p className="mt-6 text-sm leading-relaxed text-muted">{teacher.bio}</p>
              <div className="mt-6">
                <h3 className="mb-3 flex items-center gap-2 font-bold text-primary dark:text-gold">
                  <Award className="h-4 w-4" /> Credentials
                </h3>
                <ul className="space-y-1 text-sm text-muted">
                  {teacher.credentials.map((c) => (
                    <li key={c}>• {c}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                <h3 className="mb-3 flex items-center gap-2 font-bold text-primary dark:text-gold">
                  <GraduationCap className="h-4 w-4" /> Qualifications
                </h3>
                <ul className="space-y-1 text-sm text-muted">
                  {teacher.qualifications.map((q) => (
                    <li key={q}>• {q}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
