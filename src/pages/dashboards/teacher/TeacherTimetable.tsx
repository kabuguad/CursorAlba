import { useState } from 'react'
import { Clock } from 'lucide-react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { DAYS, TIMETABLE } from './_data'

export function TeacherTimetable() {
  const todayIdx = new Date().getDay()
  const defaultDay = DAYS[Math.max(0, todayIdx - 1)] ?? 'Monday'
  const [day, setDay] = useState(defaultDay)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Timetable</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Mathematics · Term 2, 2026</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {DAYS.map(d => (
          <button
            key={d}
            onClick={() => setDay(d)}
            className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition ${
              day === d
                ? 'bg-green-700 text-white'
                : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {TIMETABLE[day].length === 0 ? (
        <GlassCard className="p-12 text-center text-gray-400">No classes scheduled on {day}</GlassCard>
      ) : (
        <div className="space-y-3">
          {TIMETABLE[day].map((p, i) => (
            <GlassCard key={i} className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-bold text-lg">
                  {i + 1}
                </div>
                <div className="flex-1 grid sm:grid-cols-3 gap-1">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{p.subject}</p>
                    <p className="text-xs text-gray-400">{p.class_}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-3.5 w-3.5" />
                    {p.time}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{p.room}</div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}
