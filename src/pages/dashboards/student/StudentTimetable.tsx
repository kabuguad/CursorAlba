import { Clock, MapPin, User } from 'lucide-react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { useStudentTimetable } from '../../../hooks/useStudentData'

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday'] as const
const DAY_ABBR: Record<string,string> = { Monday:'Mon', Tuesday:'Tue', Wednesday:'Wed', Thursday:'Thu', Friday:'Fri' }

const PERIOD_COLORS = ['bg-blue-500','bg-green-600','bg-purple-600','bg-amber-500','bg-rose-500']
const BREAK_AFTER = '09:30'

export function StudentTimetable() {
  const { data: timetable, isLoading } = useStudentTimetable()

  const todayName = DAYS[Math.max(0, new Date().getDay() - 1)] ?? 'Monday'

  if (isLoading) {
    return <div className="mx-auto max-w-6xl px-4 py-8 space-y-4">
      {[1,2,3].map(i => <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)}
    </div>
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Timetable</h1>
        <p className="text-sm text-gray-400 mt-0.5">Term 2, 2026 · Grade 4A</p>
      </div>

      {/* Today highlight */}
      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <h2 className="font-bold text-gray-900 dark:text-white">Today — {todayName}</h2>
        </div>
        {(timetable?.[todayName] ?? []).length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">No classes scheduled today</p>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {(timetable?.[todayName] ?? []).map((slot, i) => (
              <div key={slot.id} className={`shrink-0 rounded-2xl text-white p-4 w-44 ${PERIOD_COLORS[i % PERIOD_COLORS.length]}`}>
                <p className="text-xs font-semibold opacity-80">{slot.startTime} – {slot.endTime}</p>
                <p className="mt-2 font-bold text-sm leading-tight">{slot.subjectName}</p>
                <p className="text-xs opacity-75 mt-1 truncate">{slot.teacherName}</p>
                <div className="mt-2 flex items-center gap-1 text-xs opacity-75">
                  <MapPin className="h-3 w-3" />{slot.room}
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Full weekly grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Header row */}
          <div className="grid grid-cols-6 gap-2 mb-2">
            <div className="px-2 py-1" />
            {DAYS.map(day => (
              <div key={day} className={`rounded-xl px-3 py-2 text-center text-sm font-semibold
                ${day === todayName ? 'bg-green-700 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
                {DAY_ABBR[day]}
              </div>
            ))}
          </div>

          {/* Collect all unique time slots */}
          {(() => {
            const allSlots = DAYS.flatMap(d => timetable?.[d] ?? [])
            const times = [...new Set(allSlots.map(s => s.startTime))].sort()
            return times.map(time => (
              <div key={time} className="grid grid-cols-6 gap-2 mb-2">
                <div className="flex items-center justify-end pr-3">
                  <span className="text-xs text-gray-400 font-medium">{time}</span>
                </div>
                {DAYS.map(day => {
                  const slot = (timetable?.[day] ?? []).find(s => s.startTime === time)
                  if (!slot) {
                    return (
                      <div key={day} className="rounded-xl bg-gray-50 dark:bg-gray-800/30 border border-dashed border-gray-200 dark:border-gray-700 min-h-[72px]" />
                    )
                  }
                  const colIdx = DAYS.indexOf(day)
                  const periodIdx = times.indexOf(time)
                  const color = PERIOD_COLORS[periodIdx % PERIOD_COLORS.length]
                  return (
                    <div key={day} className={`rounded-xl p-3 min-h-[72px] ${color} text-white`}>
                      <p className="text-xs font-bold opacity-90 leading-tight">{slot.subjectName}</p>
                      <div className="mt-1.5 space-y-0.5">
                        <div className="flex items-center gap-1 text-xs opacity-75">
                          <User className="h-2.5 w-2.5" />
                          <span className="truncate text-xs">{slot.teacherName.split(' ').pop()}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs opacity-75">
                          <MapPin className="h-2.5 w-2.5" />{slot.room}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))
          })()}

          {/* Break indicator */}
          <div className="grid grid-cols-6 gap-2 mb-2 opacity-50">
            <div className="flex items-center justify-end pr-3">
              <span className="text-xs text-gray-400">Break</span>
            </div>
            {DAYS.map(day => (
              <div key={day} className="rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-dashed border-amber-200 dark:border-amber-800 min-h-[28px] flex items-center justify-center">
                <span className="text-xs text-amber-500 font-medium">30 min</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {(timetable ? [...new Set(DAYS.flatMap(d => (timetable[d] ?? []).map(s => s.subjectName)))] : []).map((sub, i) => (
          <div key={sub} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
            <span className={`h-3 w-3 rounded-sm ${PERIOD_COLORS[i % PERIOD_COLORS.length]}`} />
            {sub}
          </div>
        ))}
      </div>
    </div>
  )
}
