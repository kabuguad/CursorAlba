import { useState } from 'react'
import { ClipboardList, CheckCircle2, Clock, BookOpen, AlertTriangle } from 'lucide-react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { useStudentHomework } from '../../../hooks/useStudentData'

const SUBJ_COLORS: Record<string, string> = {
  Mathematics:       'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'English Language':'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  Kiswahili:        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'Science & Technology':'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Computer Science':'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  Music:             'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  'Physical Education':'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'Religious Education':'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
}

type FilterTab = 'active' | 'closed' | 'all'

export function StudentHomework() {
  const { data: homework, isLoading } = useStudentHomework()
  const [filter, setFilter] = useState<FilterTab>('active')

  const all    = homework ?? []
  const active = all.filter(h => h.status === 'active')
  const closed = all.filter(h => h.status === 'closed')
  const shown  = filter === 'active' ? active : filter === 'closed' ? closed : all

  if (isLoading) {
    return <div className="mx-auto max-w-4xl px-4 py-8 space-y-3">
      {[1,2,3].map(i => <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)}
    </div>
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Homework & Tasks</h1>
          <p className="text-sm text-gray-400 mt-0.5">{active.length} active · {closed.length} completed</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {([['active','Active', active.length],['closed','Completed', closed.length],['all','All', all.length]] as const).map(([val, label, count]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition flex items-center gap-1.5 ${filter === val ? 'bg-green-700 text-white shadow' : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            {label}
            <span className={`text-xs rounded-full px-1.5 py-0 ${filter === val ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>{count}</span>
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {shown.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 opacity-50 mb-3" />
            <p className="text-gray-400">{filter === 'active' ? 'No active homework — you\'re all caught up!' : 'No tasks in this category'}</p>
          </GlassCard>
        ) : shown.map(hw => {
          const due     = new Date(hw.dueDate)
          const today   = new Date()
          const daysLeft = Math.ceil((due.getTime() - today.getTime()) / 86400000)
          const isOverdue = daysLeft < 0 && hw.status === 'active'
          const isDue1 = daysLeft <= 1 && daysLeft >= 0 && hw.status === 'active'
          const badgeColor = SUBJ_COLORS[hw.subjectName ?? ''] ?? 'bg-gray-100 text-gray-600'

          return (
            <GlassCard key={hw.id} className={`p-5 ${isOverdue ? 'border border-red-200 dark:border-red-900/50' : ''}`}>
              <div className="flex items-start gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl mt-0.5
                  ${hw.status === 'closed' ? 'bg-gray-100 dark:bg-gray-700' : isOverdue ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                  {hw.status === 'closed'
                    ? <CheckCircle2 className="h-5 w-5 text-gray-400" />
                    : isOverdue
                    ? <AlertTriangle className="h-5 w-5 text-red-500" />
                    : <ClipboardList className={`h-5 w-5 ${isDue1 ? 'text-amber-500' : 'text-green-600 dark:text-green-400'}`} />
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h3 className={`font-semibold ${hw.status === 'closed' ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                        {hw.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeColor}`}>
                          <BookOpen className="inline h-3 w-3 mr-1" />{hw.subjectName}
                        </span>
                        <span className="text-xs text-gray-400">by {hw.assignedByName}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {hw.status === 'active' ? (
                        <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold
                          ${isOverdue ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                            : isDue1 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                          <Clock className="h-3 w-3" />
                          {isOverdue ? 'Overdue' : daysLeft === 0 ? 'Due today' : `${daysLeft}d left`}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                          <CheckCircle2 className="h-3 w-3" /> Submitted
                        </span>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        Due: {due.toLocaleDateString('en-KE', { day:'numeric', month:'short' })}
                      </p>
                    </div>
                  </div>

                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{hw.description}</p>

                  <p className="text-xs text-gray-400 mt-2">
                    Assigned: {new Date(hw.assignedDate).toLocaleDateString('en-KE', { day:'numeric', month:'short', year:'numeric' })}
                  </p>
                </div>
              </div>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
