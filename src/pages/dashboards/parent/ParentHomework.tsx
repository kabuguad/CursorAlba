import { Clock, ClipboardList } from 'lucide-react'
import { GlassCard } from '../../../components/ui/GlassCard'

const HOMEWORK = [
  { id: 1, subject: 'Mathematics',    title: 'Algebra Practice — Quadratic Equations',    due: '2026-05-30', status: 'pending',   teacher: 'Mr. Ochieng'  },
  { id: 2, subject: 'English',        title: 'Essay: "My Future Career"',                 due: '2026-06-02', status: 'pending',   teacher: 'Mrs. Wanjiku' },
  { id: 3, subject: 'Science',        title: 'Lab Report — Photosynthesis Experiment',    due: '2026-05-28', status: 'submitted', teacher: 'Mr. Kamau'    },
  { id: 4, subject: 'Kiswahili',      title: 'Insha: Mazingira ya Shule',                 due: '2026-05-25', status: 'graded',    teacher: 'Ms. Akinyi'   },
  { id: 5, subject: 'Social Studies', title: 'Map Reading Assignment — Kirinyaga County', due: '2026-06-05', status: 'pending',   teacher: 'Mr. Njoroge'  },
]

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  submitted: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  graded:    'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}

export function ParentHomework() {
  const pending = HOMEWORK.filter(h => h.status === 'pending').length

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Amani's Homework</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Term 2, 2026</p>
        </div>
        <span className="rounded-full bg-yellow-50 dark:bg-yellow-900/30 px-3 py-1 text-sm font-semibold text-yellow-700 dark:text-yellow-400">
          {pending} pending
        </span>
      </div>

      {HOMEWORK.map(hw => (
        <GlassCard key={hw.id} className="p-5">
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">{hw.title}</h3>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[hw.status]}`}>
                  {hw.status}
                </span>
              </div>
              <p className="text-sm text-gray-400">{hw.subject} · {hw.teacher}</p>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-400">
              <Clock className="h-4 w-4" />
              Due {hw.due}
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  )
}
