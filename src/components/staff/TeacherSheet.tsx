import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Award, GraduationCap, Mail, Building2 } from 'lucide-react'
import type { ApiTeacher } from '../../services/staffApi'

interface TeacherModalProps {
  open: boolean
  teacher: ApiTeacher | null
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

            <div className="flex flex-col items-center justify-center gap-4 p-6 lg:w-2/5 lg:bg-primary/5">
              <div className="relative h-40 w-40 rounded-full border-4 border-gold/40 overflow-hidden">
                <img
                  src={teacher.profilePhoto ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.fullName)}&background=0d4a1f&color=E8B84B&size=400`}
                  alt={teacher.fullName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-primary dark:text-gold">{teacher.title}</p>
                <h2 className="mt-0.5 text-xl font-bold text-foreground">{teacher.fullName}</h2>
                <span className="mt-2 inline-block rounded-full bg-primary/80 px-3 py-1 text-xs text-white">
                  {teacher.departmentName}
                </span>
              </div>
              <div className="flex flex-col gap-1 text-xs text-muted w-full px-2">
                <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 shrink-0" />{teacher.email}</span>
                <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5 shrink-0" />{teacher.departmentName}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 lg:w-3/5" ref={contentRef}>
              {teacher.academicPortfolio && (
                <div className="mb-6">
                  <h3 className="mb-2 font-bold text-primary dark:text-gold">About</h3>
                  <p className="text-sm leading-relaxed text-muted">{teacher.academicPortfolio}</p>
                </div>
              )}

              {teacher.credentials && (
                <div className="mb-6">
                  <h3 className="mb-3 flex items-center gap-2 font-bold text-primary dark:text-gold">
                    <Award className="h-4 w-4" /> Credentials
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{teacher.credentials}</p>
                </div>
              )}

              {teacher.qualifications && (
                <div className="mb-6">
                  <h3 className="mb-3 flex items-center gap-2 font-bold text-primary dark:text-gold">
                    <GraduationCap className="h-4 w-4" /> Qualifications
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{teacher.qualifications}</p>
                </div>
              )}

              {teacher.hireDate && (
                <p className="text-xs text-muted/60 mt-4">
                  Joined {new Date(teacher.hireDate).toLocaleDateString('en-KE', { year: 'numeric', month: 'long' })}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
