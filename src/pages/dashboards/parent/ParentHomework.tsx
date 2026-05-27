import { useState } from 'react'
import { Clock, ClipboardList, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'
import { GlassCard } from '../../../components/ui/GlassCard'

interface Homework {
  id: number
  subject: string
  title: string
  description: string
  due: string
  status: 'pending' | 'submitted' | 'graded'
  teacher: string
  score?: string
  feedback?: string
  overdue: boolean
}

const today = new Date('2026-05-27')

const HOMEWORK: Homework[] = [
  {
    id: 1,
    subject: 'English',
    title: 'Essay: "My Future Career"',
    description: 'Write a 300-word essay describing your dream career, the skills required, and how you plan to get there. Use correct paragraph structure and good vocabulary.',
    due: '2026-05-28',
    status: 'pending',
    teacher: 'Mrs. Wanjiku',
    overdue: true,
  },
  {
    id: 2,
    subject: 'Mathematics',
    title: 'Algebra Practice — Quadratic Equations',
    description: 'Complete exercises 4A to 4F from the Mathematics textbook (pages 67–72). Show all working. Due to be submitted to Mr. Ochieng at the start of Friday\'s lesson.',
    due: '2026-05-30',
    status: 'pending',
    teacher: 'Mr. Ochieng',
    overdue: false,
  },
  {
    id: 3,
    subject: 'Social Studies',
    title: 'Map Reading Assignment — Kirinyaga County',
    description: 'Using the atlas provided, answer all questions on the worksheet about Kirinyaga County landforms, rivers, and administrative divisions.',
    due: '2026-06-05',
    status: 'pending',
    teacher: 'Mr. Njoroge',
    overdue: false,
  },
  {
    id: 4,
    subject: 'Science',
    title: 'Lab Report — Photosynthesis Experiment',
    description: 'Write a full lab report (hypothesis, method, results, conclusion) for the photosynthesis experiment conducted on 20 May.',
    due: '2026-05-28',
    status: 'submitted',
    teacher: 'Mr. Kamau',
    overdue: false,
  },
  {
    id: 5,
    subject: 'Kiswahili',
    title: 'Insha: Mazingira ya Shule',
    description: 'Andika insha ya maneno 250 kuhusu mazingira ya shuleni. Tumia lugha sanifu.',
    due: '2026-05-25',
    status: 'graded',
    teacher: 'Ms. Akinyi',
    score: '38 / 50',
    feedback: 'Insha nzuri sana. Lugha yako ni fasaha. Fanya kazi zaidi kwenye mpangilio wa aya.',
    overdue: false,
  },
  {
    id: 6,
    subject: 'CRE',
    title: 'Bible Story Summary — Joseph',
    description: 'Write a one-page summary of the story of Joseph in Egypt (Genesis 37–50), highlighting the moral lessons.',
    due: '2026-05-20',
    status: 'graded',
    teacher: 'Mr. Gitonga',
    score: '45 / 50',
    feedback: 'Excellent summary. The moral lessons were very well articulated. Keep it up!',
    overdue: false,
  },
]

type Filter = 'all' | 'pending' | 'submitted' | 'graded'

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  submitted: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  graded:    'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics:    'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  English:        'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  Science:        'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  Kiswahili:      'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  'Social Studies': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  CRE:            'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
}

export function ParentHomework() {
  const [filter, setFilter] = useState<Filter>('all')
  const [sortByDue, setSortByDue] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)

  const filtered = HOMEWORK
    .filter(h => filter === 'all' || h.status === filter)
    .sort((a, b) => sortByDue ? a.due.localeCompare(b.due) : b.due.localeCompare(a.due))

  const counts = {
    all:       HOMEWORK.length,
    pending:   HOMEWORK.filter(h => h.status === 'pending').length,
    submitted: HOMEWORK.filter(h => h.status === 'submitted').length,
    graded:    HOMEWORK.filter(h => h.status === 'graded').length,
  }

  const overdue = HOMEWORK.filter(h => h.overdue).length

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-5">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Amani's Homework</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Term 2, 2026 · {counts.pending} pending
            {overdue > 0 && (
              <span className="ml-1.5 text-red-500 font-semibold">· {overdue} overdue</span>
            )}
          </p>
        </div>
        <button
          onClick={() => setSortByDue(s => !s)}
          className="flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          <Clock className="h-4 w-4" />
          Due {sortByDue ? 'soonest' : 'latest'}
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['all', 'pending', 'submitted', 'graded'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition ${
              filter === f
                ? f === 'pending'   ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 ring-1 ring-yellow-400/40'
                : f === 'submitted' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 ring-1 ring-blue-400/40'
                : f === 'graded'    ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 ring-1 ring-green-400/40'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="rounded-full bg-white/60 dark:bg-black/30 px-1.5 py-0.5 text-[10px] font-bold">{counts[f]}</span>
          </button>
        ))}
      </div>

      {/* Homework list */}
      {filtered.length === 0 && (
        <GlassCard className="p-8 text-center">
          <p className="text-gray-400">No {filter === 'all' ? '' : filter} homework at the moment.</p>
        </GlassCard>
      )}

      <div className="space-y-3">
        {filtered.map(hw => {
          const isExpanded = expanded === hw.id
          const daysLeft = Math.ceil((new Date(hw.due).getTime() - today.getTime()) / 86400000)

          return (
            <GlassCard
              key={hw.id}
              className={`overflow-hidden transition-all ${
                hw.overdue ? 'ring-1 ring-red-300 dark:ring-red-800' : ''
              }`}
            >
              <button
                className="w-full p-5 text-left"
                onClick={() => setExpanded(isExpanded ? null : hw.id)}
              >
                <div className="flex flex-wrap items-start gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${SUBJECT_COLORS[hw.subject] ?? 'bg-gray-100 text-gray-500'}`}>
                    <ClipboardList className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{hw.title}</h3>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[hw.status]}`}>
                        {hw.status}
                      </span>
                      {hw.overdue && (
                        <span className="flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-900/30 px-2 py-0.5 text-xs font-bold text-red-600 dark:text-red-400">
                          <AlertCircle className="h-3 w-3" />
                          OVERDUE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{hw.subject} · {hw.teacher}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className={`text-xs font-semibold flex items-center gap-1 ${
                        hw.overdue ? 'text-red-500' : daysLeft <= 2 ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400'
                      }`}>
                        <Clock className="h-3.5 w-3.5" />
                        {hw.overdue ? 'Overdue' : daysLeft === 0 ? 'Due today' : `${daysLeft}d left`}
                      </p>
                      <p className="text-[10px] text-gray-400">{hw.due}</p>
                    </div>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-100 dark:border-gray-800 px-5 pb-5 pt-3 space-y-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Assignment</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{hw.description}</p>
                  </div>
                  {hw.score && (
                    <div className="flex items-center gap-3 rounded-xl bg-green-50 dark:bg-green-900/20 px-4 py-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Score</p>
                        <p className="text-lg font-bold text-green-700 dark:text-green-400">{hw.score}</p>
                      </div>
                      {hw.feedback && (
                        <div className="flex-1 border-l border-green-200 dark:border-green-800 pl-3">
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-0.5">Teacher's Feedback</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{hw.feedback}"</p>
                          <p className="text-xs text-gray-400 mt-1">— {hw.teacher}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
