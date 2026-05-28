import { useState } from 'react'
import { ClipboardList, CheckCircle2, Clock, AlertTriangle, BookOpen } from 'lucide-react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { useParentHomework, useParentStudentProfile } from '../../../hooks/useParentData'

const SUBJ_COLORS: Record<string, string> = {
  Mathematics: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'English Language': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  Kiswahili: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'Science & Technology': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
}

export function ParentHomework() {
  const { data: profile }  = useParentStudentProfile()
  const { data: homework, isLoading } = useParentHomework()
  const [filter, setFilter] = useState<'active'|'closed'|'all'>('active')

  const student = profile?.student
  const all     = homework ?? []
  const active  = all.filter(h => h.status === 'active')
  const closed  = all.filter(h => h.status === 'closed')
  const shown   = filter === 'active' ? active : filter === 'closed' ? closed : all

  if (isLoading) {
    return <div className="mx-auto max-w-4xl px-4 py-8 space-y-3">
      {[1,2,3].map(i => <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)}
    </div>
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Homework</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {student ? `${student.firstName} ${student.lastName}` : ''} · {active.length} active tasks
        </p>
      </div>

      <div className="flex gap-2">
        {([['active','Active',active.length],['closed','Completed',closed.length],['all','All',all.length]] as const).map(([v,l,c]) => (
          <button key={v} onClick={() => setFilter(v)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition flex items-center gap-1.5 ${filter===v?'bg-violet-700 text-white shadow':'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            {l}<span className={`text-xs rounded-full px-1.5 ${filter===v?'bg-white/20':'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>{c}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {shown.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 opacity-40 mb-3" />
            <p className="text-gray-400">{filter==='active' ? 'No active homework — all caught up!' : 'No tasks in this category'}</p>
          </GlassCard>
        ) : shown.map(hw => {
          const due      = new Date(hw.dueDate)
          const daysLeft = Math.ceil((due.getTime() - Date.now()) / 86400000)
          const overdue  = daysLeft < 0 && hw.status === 'active'
          const urgent   = daysLeft <= 1 && daysLeft >= 0 && hw.status === 'active'
          const badgeClr = SUBJ_COLORS[hw.subjectName ?? ''] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
          return (
            <GlassCard key={hw.id} className={`p-5 ${overdue ? 'border border-red-200 dark:border-red-900/50' : ''}`}>
              <div className="flex items-start gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl mt-0.5
                  ${hw.status==='closed'?'bg-gray-100 dark:bg-gray-700':overdue?'bg-red-100 dark:bg-red-900/30':'bg-violet-100 dark:bg-violet-900/30'}`}>
                  {hw.status==='closed'
                    ? <CheckCircle2 className="h-5 w-5 text-gray-400" />
                    : overdue ? <AlertTriangle className="h-5 w-5 text-red-500" />
                    : <ClipboardList className={`h-5 w-5 ${urgent?'text-amber-500':'text-violet-600 dark:text-violet-400'}`} />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h3 className={`font-semibold ${hw.status==='closed'?'text-gray-500 dark:text-gray-400 line-through':'text-gray-900 dark:text-white'}`}>
                        {hw.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeClr}`}>
                          <BookOpen className="inline h-3 w-3 mr-1" />{hw.subjectName}
                        </span>
                        <span className="text-xs text-gray-400">{hw.assignedByName}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      {hw.status==='active' ? (
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold
                          ${overdue?'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300':urgent?'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300':'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                          <Clock className="h-3 w-3" />
                          {overdue?'Overdue':daysLeft===0?'Due today':`${daysLeft}d left`}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                          <CheckCircle2 className="h-3 w-3" /> Submitted
                        </span>
                      )}
                      <p className="text-xs text-gray-400 mt-1">Due: {due.toLocaleDateString('en-KE',{day:'numeric',month:'short'})}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{hw.description}</p>
                </div>
              </div>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
