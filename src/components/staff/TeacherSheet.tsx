import { motion, AnimatePresence } from 'framer-motion'
import { X, Award, GraduationCap } from 'lucide-react'
import type { Teacher } from '../../data/types'

interface TeacherSheetProps {
  teacher: Teacher | null
  onClose: () => void
}

export function TeacherSheet({ teacher, onClose }: TeacherSheetProps) {
  return (
    <AnimatePresence>
      {teacher && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28 }}
            className="fixed top-0 right-0 z-[110] flex h-full w-full max-w-md flex-col overflow-y-auto glass glass-border bg-surface-elevated text-foreground"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 rounded-xl p-2 hover:bg-primary/10"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="relative h-64 shrink-0">
              <img src={teacher.image} alt={teacher.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h2 className="text-2xl font-bold">{teacher.name}</h2>
                <p className="text-gold">{teacher.title}</p>
                <span className="mt-2 inline-block rounded-full bg-primary/80 px-3 py-1 text-xs">
                  {teacher.department}
                </span>
              </div>
            </div>
            <div className="flex-1 p-6">
              <p className="mb-6 text-sm leading-relaxed text-muted">{teacher.bio}</p>
              <div className="mb-4">
                <h3 className="mb-2 flex items-center gap-2 font-bold text-primary dark:text-gold">
                  <Award className="h-4 w-4" /> Credentials
                </h3>
                <ul className="space-y-1 text-sm text-muted">
                  {teacher.credentials.map((c) => (
                    <li key={c}>• {c}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-2 flex items-center gap-2 font-bold text-primary dark:text-gold">
                  <GraduationCap className="h-4 w-4" /> Qualifications
                </h3>
                <ul className="space-y-1 text-sm text-muted">
                  {teacher.qualifications.map((q) => (
                    <li key={q}>• {q}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
