import { useState } from 'react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { useAttendance } from '../../../hooks/useAttendance'
import { ChevronLeft, ChevronRight, Download } from 'lucide-react'
import { useToast } from '../../../contexts/ToastContext'

const LINKED_STUDENT_ID = 's-1'

const MONTHS_LIST = [
  { label: 'January',   year: 2026, month: 1 },
  { label: 'February',  year: 2026, month: 2 },
  { label: 'March',     year: 2026, month: 3 },
  { label: 'April',     year: 2026, month: 4 },
  { label: 'May',       year: 2026, month: 5 },
]

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

const ABSENCE_REASONS: Record<string, string> = {
  '2026-02-05': 'Medical — Doctor appointment',
  '2026-02-12': 'Medical — Fever',
  '2026-02-19': 'Family event',
}

const LATE_DAYS: Record<string, string> = {
  '2026-02-08': 'Arrived 8:15 AM',
  '2026-02-15': 'Arrived 8:00 AM',
}

export function ParentAttendance() {
  const { showToast } = useToast()
  const [monthIdx, setMonthIdx] = useState(MONTHS_LIST.length - 1)
  const { label: monthLabel, year, month } = MONTHS_LIST[monthIdx]
  const { data: attendance, isLoading } = useAttendance(LINKED_STUDENT_ID, year, month)

  const canPrev = monthIdx > 0
  const canNext = monthIdx < MONTHS_LIST.length - 1

  const daysInMonth = new Date(year, month, 0).getDate()
  const firstWeekday = new Date(year, month - 1, 1).getDay()
  const mondayOffset = firstWeekday === 0 ? 6 : firstWeekday - 1

  const getStatus = (date: string) => {
    const day = attendance?.days.find(d => d.date === date)
    if (!day) return 'weekend'
    if (LATE_DAYS[date]) return 'late'
    if (day.present) return 'present'
    return 'absent'
  }

  const weeks: { date: string; dayLabel: string; status: string }[][] = []
  let week: { date: string; dayLabel: string; status: string }[] = []

  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const weekday = new Date(year, month - 1, d).getDay()
    const isWeekend = weekday === 0 || weekday === 6
    if (!isWeekend) {
      week.push({ date, dayLabel: DAY_LABELS[weekday - 1] ?? '', status: getStatus(date) })
      if (weekday === 5 || d === daysInMonth) {
        weeks.push([...week])
        week = []
      }
    }
  }

  const present  = attendance?.presentCount ?? 0
  const absent   = attendance?.absentCount  ?? 0
  const lateCount = Object.keys(LATE_DAYS).filter(d => d.startsWith(`${year}-${String(month).padStart(2, '0')}`)).length
  const total    = present + absent
  const rate     = total > 0 ? Math.round((present / total) * 100) : 0

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Record</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Amani Kariuki · Grade 5 Gold</p>
        </div>
        <button
          onClick={() => showToast('Attendance report download coming soon')}
          className="flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => canPrev && setMonthIdx(i => i - 1)}
          disabled={!canPrev}
          className="flex items-center gap-1 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">{canPrev ? MONTHS_LIST[monthIdx - 1].label : ''}</span>
        </button>
        <h2 className="font-bold text-gray-900 dark:text-white">{monthLabel} {year}</h2>
        <button
          onClick={() => canNext && setMonthIdx(i => i + 1)}
          disabled={!canNext}
          className="flex items-center gap-1 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-30"
        >
          <span className="hidden sm:inline">{canNext ? MONTHS_LIST[monthIdx + 1].label : ''}</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Attendance Rate', value: `${rate}%`,    color: rate >= 85 ? 'text-green-600 dark:text-green-400' : 'text-red-500' },
          { label: 'Days Present',    value: present,        color: 'text-green-600 dark:text-green-400' },
          { label: 'Days Absent',     value: absent,         color: absent > 0 ? 'text-red-500' : 'text-gray-400' },
          { label: 'Late Arrivals',   value: lateCount,      color: lateCount > 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400' },
        ].map(s => (
          <GlassCard key={s.label} className="p-4 text-center">
            {isLoading
              ? <div className="h-7 w-16 mx-auto animate-pulse rounded-lg bg-gray-100 dark:bg-gray-700" />
              : <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            }
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Calendar */}
      <GlassCard className="p-5">
        {/* Day headers */}
        <div className="grid grid-cols-5 mb-2">
          {DAY_LABELS.map(d => (
            <div key={d} className="text-center text-[10px] font-bold uppercase tracking-wide text-gray-400 py-1">{d}</div>
          ))}
        </div>

        {isLoading ? (
          <div className="h-48 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-700" />
        ) : (
          <div className="space-y-1.5">
            {weeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-5 gap-1.5">
                {week.map(day => {
                  const reason = ABSENCE_REASONS[day.date]
                  const lateNote = LATE_DAYS[day.date]
                  return (
                    <div
                      key={day.date}
                      title={reason ?? lateNote ?? day.date}
                      className={`relative flex flex-col items-center justify-center rounded-xl py-2 text-center cursor-default group ${
                        day.status === 'present' ? 'bg-green-100 dark:bg-green-900/30' :
                        day.status === 'absent'  ? 'bg-red-100 dark:bg-red-900/30' :
                        day.status === 'late'    ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                        'bg-gray-50 dark:bg-gray-800/30'
                      }`}
                    >
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">
                        {new Date(day.date + 'T00:00').getDate()}
                      </span>
                      <span className={`text-sm font-bold ${
                        day.status === 'present' ? 'text-green-700 dark:text-green-400' :
                        day.status === 'absent'  ? 'text-red-600 dark:text-red-400' :
                        day.status === 'late'    ? 'text-yellow-700 dark:text-yellow-400' :
                        'text-gray-300 dark:text-gray-600'
                      }`}>
                        {day.status === 'present' ? '✓' : day.status === 'absent' ? '✗' : day.status === 'late' ? '~' : '·'}
                      </span>
                      {(reason || lateNote) && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-10 hidden group-hover:block w-40 rounded-lg bg-gray-900 text-white text-[10px] px-2 py-1 text-center shadow-lg">
                          {reason ?? lateNote}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
          {[
            { color: 'bg-green-100 dark:bg-green-900/30', symbol: '✓', label: 'Present' },
            { color: 'bg-red-100 dark:bg-red-900/30',     symbol: '✗', label: 'Absent'  },
            { color: 'bg-yellow-100 dark:bg-yellow-900/30', symbol: '~', label: 'Late arrival' },
          ].map(l => (
            <span key={l.label} className="flex items-center gap-1.5">
              <span className={`flex h-5 w-5 items-center justify-center rounded ${l.color} text-[10px] font-bold`}>{l.symbol}</span>
              {l.label}
            </span>
          ))}
        </div>
      </GlassCard>

      {/* Absence reasons */}
      {Object.keys(ABSENCE_REASONS).some(d => d.startsWith(`${year}-${String(month).padStart(2, '0')}`)) && (
        <GlassCard className="p-5">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-3">Absence Notes</h3>
          <div className="space-y-2">
            {Object.entries(ABSENCE_REASONS)
              .filter(([d]) => d.startsWith(`${year}-${String(month).padStart(2, '0')}`))
              .map(([date, reason]) => (
                <div key={date} className="flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 px-4 py-2.5">
                  <span className="text-xs font-mono text-red-600 dark:text-red-400 shrink-0">{date}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{reason}</span>
                </div>
              ))}
          </div>
        </GlassCard>
      )}

      {/* Late arrivals */}
      {Object.keys(LATE_DAYS).some(d => d.startsWith(`${year}-${String(month).padStart(2, '0')}`)) && (
        <GlassCard className="p-5">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-3">Late Arrival Notes</h3>
          <div className="space-y-2">
            {Object.entries(LATE_DAYS)
              .filter(([d]) => d.startsWith(`${year}-${String(month).padStart(2, '0')}`))
              .map(([date, note]) => (
                <div key={date} className="flex items-start gap-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2.5">
                  <span className="text-xs font-mono text-yellow-600 dark:text-yellow-400 shrink-0">{date}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{note}</span>
                </div>
              ))}
          </div>
        </GlassCard>
      )}

    </div>
  )
}
