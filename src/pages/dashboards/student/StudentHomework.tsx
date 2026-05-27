import { useState } from 'react'
import { Clock, ClipboardList } from 'lucide-react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { HOMEWORK, STATUS_STYLES } from './_data'

type Filter = 'All' | 'pending' | 'submitted' | 'graded'

export function StudentHomework() {
  const [filter, setFilter] = useState<Filter>('All')
  const shown = filter === 'All' ? HOMEWORK : HOMEWORK.filter(h => h.status === filter)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Homework</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {HOMEWORK.filter(h => h.status === 'pending').length} pending · Term 2, 2026
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['All', 'pending', 'submitted', 'graded'] as Filter[]).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-xl px-3 py-1.5 text-xs font-medium capitalize transition ${
              filter === s
                ? 'bg-green-700 text-white'
                : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {s === 'All' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            {s !== 'All' && ` (${HOMEWORK.filter(h => h.status === s).length})`}
          </button>
        ))}
      </div>

      {shown.map(hw => (
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
              <p className="text-sm text-gray-500 dark:text-gray-400">{hw.subject} · {hw.teacher}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>Due {hw.due}</span>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  )
}
