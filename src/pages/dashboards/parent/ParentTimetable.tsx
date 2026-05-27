import { useState } from 'react'
import { Clock } from 'lucide-react'
import { GlassCard } from '../../../components/ui/GlassCard'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

const TIMETABLE: Record<string, { time: string; end: string; subject: string; teacher: string; room: string; color: string }[]> = {
  Monday: [
    { time: '7:30',  end: '8:30',  subject: 'Mathematics',    teacher: 'Mr. Ochieng',  room: 'Room 12',    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'     },
    { time: '8:30',  end: '9:30',  subject: 'English',        teacher: 'Mrs. Wanjiku', room: 'Room 08',    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
    { time: '10:00', end: '11:00', subject: 'Science',        teacher: 'Mr. Kamau',    room: 'Lab 2',      color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'   },
    { time: '11:00', end: '12:00', subject: 'Kiswahili',      teacher: 'Ms. Akinyi',   room: 'Room 05',    color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' },
    { time: '13:00', end: '14:00', subject: 'PE',             teacher: 'Mr. Mutua',    room: 'Field',      color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
  ],
  Tuesday: [
    { time: '7:30',  end: '8:30',  subject: 'Social Studies', teacher: 'Mr. Njoroge',  room: 'Room 10',    color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
    { time: '8:30',  end: '9:30',  subject: 'Mathematics',    teacher: 'Mr. Ochieng',  room: 'Room 12',    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'     },
    { time: '10:00', end: '11:00', subject: 'Creative Arts',  teacher: 'Ms. Chebet',   room: 'Art Studio', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300'       },
    { time: '11:00', end: '12:00', subject: 'English',        teacher: 'Mrs. Wanjiku', room: 'Room 08',    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
    { time: '13:00', end: '14:00', subject: 'CRE',            teacher: 'Mr. Gitonga',  room: 'Room 03',    color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'         },
  ],
  Wednesday: [
    { time: '7:30',  end: '8:30',  subject: 'Science',        teacher: 'Mr. Kamau',    room: 'Lab 2',      color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'   },
    { time: '8:30',  end: '9:30',  subject: 'Kiswahili',      teacher: 'Ms. Akinyi',   room: 'Room 05',    color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' },
    { time: '10:00', end: '11:00', subject: 'Mathematics',    teacher: 'Mr. Ochieng',  room: 'Room 12',    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'     },
    { time: '11:00', end: '12:00', subject: 'Social Studies', teacher: 'Mr. Njoroge',  room: 'Room 10',    color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
    { time: '13:00', end: '14:00', subject: 'Music',          teacher: 'Ms. Waweru',   room: 'Music Room', color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' },
  ],
  Thursday: [
    { time: '7:30',  end: '8:30',  subject: 'English',        teacher: 'Mrs. Wanjiku', room: 'Room 08',    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
    { time: '8:30',  end: '9:30',  subject: 'CRE',            teacher: 'Mr. Gitonga',  room: 'Room 03',    color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'         },
    { time: '10:00', end: '11:00', subject: 'Kiswahili',      teacher: 'Ms. Akinyi',   room: 'Room 05',    color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' },
    { time: '11:00', end: '12:00', subject: 'Science',        teacher: 'Mr. Kamau',    room: 'Lab 2',      color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'   },
    { time: '13:00', end: '14:00', subject: 'Mathematics',    teacher: 'Mr. Ochieng',  room: 'Room 12',    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'     },
  ],
  Friday: [
    { time: '7:30',  end: '8:30',  subject: 'Creative Arts',  teacher: 'Ms. Chebet',   room: 'Art Studio', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300'       },
    { time: '8:30',  end: '9:30',  subject: 'Social Studies', teacher: 'Mr. Njoroge',  room: 'Room 10',    color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
    { time: '10:00', end: '11:00', subject: 'English',        teacher: 'Mrs. Wanjiku', room: 'Room 08',    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
    { time: '11:00', end: '12:00', subject: 'PE',             teacher: 'Mr. Mutua',    room: 'Field',      color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
    { time: '13:00', end: '14:00', subject: 'Mathematics',    teacher: 'Mr. Ochieng',  room: 'Room 12',    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'     },
  ],
}

function isCurrentPeriod(time: string, end: string): boolean {
  const now = new Date()
  const [sh, sm] = time.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  const nowMins = now.getHours() * 60 + now.getMinutes()
  const startMins = sh * 60 + sm
  const endMins   = eh * 60 + em
  return nowMins >= startMins && nowMins < endMins
}

function getTodayName(): string {
  const d = new Date().getDay()
  if (d === 0 || d === 6) return 'Monday'
  return DAYS[d - 1]
}

export function ParentTimetable() {
  const [day, setDay] = useState(getTodayName())
  const todayName = getTodayName()
  const periods = TIMETABLE[day]

  const hasCurrent = day === todayName && periods.some(p => isCurrentPeriod(p.time, p.end))
  const now = new Date()
  const nowTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Amani's Timetable</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Grade 5 Gold · Term 2, 2026</p>
      </div>

      {/* Day selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {DAYS.map((d, i) => {
          const isToday = d === todayName
          const isSelected = d === day
          return (
            <button
              key={d}
              onClick={() => setDay(d)}
              className={`shrink-0 flex flex-col items-center rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                isSelected
                  ? 'bg-green-700 text-white'
                  : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <span className="text-xs opacity-70">{DAYS_SHORT[i]}</span>
              {isToday && (
                <span className={`mt-0.5 h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-green-500'}`} />
              )}
              {!isToday && <span className="mt-0.5 h-1.5 w-1.5" />}
            </button>
          )
        })}
      </div>

      {/* Current time banner */}
      {day === todayName && (
        <div className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm ${
          hasCurrent
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'
        }`}>
          <span className={`h-2 w-2 rounded-full ${hasCurrent ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600 dark:text-gray-400">
            Now: <span className="font-semibold text-gray-800 dark:text-gray-200">{nowTime}</span>
            {hasCurrent
              ? ' — class in progress'
              : now.getHours() < 7
              ? ' — school not started yet'
              : now.getHours() >= 14
              ? ' — school day ended'
              : ' — between lessons'
            }
          </span>
        </div>
      )}

      {/* Periods */}
      <div className="space-y-2">
        {periods.map((p, i) => {
          const isCurrent = day === todayName && isCurrentPeriod(p.time, p.end)
          const isPast    = day === todayName && !isCurrent && nowTime >= p.end
          return (
            <GlassCard
              key={i}
              className={`overflow-hidden transition-all ${
                isCurrent ? 'ring-2 ring-green-400 dark:ring-green-600' : ''
              } ${isPast ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center gap-4 p-4">
                {/* Period number / color bar */}
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold text-lg ${p.color}`}>
                  {i + 1}
                </div>

                <div className="flex-1 grid sm:grid-cols-3 gap-1 min-w-0">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{p.subject}</p>
                    <p className="text-xs text-gray-400">{p.teacher}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    {p.time}–{p.end}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    📍 {p.room}
                  </div>
                </div>

                {isCurrent && (
                  <span className="shrink-0 rounded-full bg-green-100 dark:bg-green-900/40 px-2.5 py-1 text-xs font-bold text-green-700 dark:text-green-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    NOW
                  </span>
                )}
                {isPast && !isCurrent && (
                  <span className="shrink-0 text-[10px] font-semibold text-gray-300 dark:text-gray-600 uppercase tracking-wide">Done</span>
                )}
              </div>
            </GlassCard>
          )
        })}
      </div>

      {/* Break info */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-400 px-1">
        <span>Break: 9:30–10:00 AM</span>
        <span>·</span>
        <span>Lunch: 12:00–1:00 PM</span>
        <span>·</span>
        <span>School ends: 4:00 PM</span>
      </div>

    </div>
  )
}
