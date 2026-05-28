import { useState } from 'react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Clock, Download, MapPin } from 'lucide-react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

const DAY_SHORT: Record<string, string> = {
  Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri',
}

interface Period {
  period: number
  time: string
  start: string
  end: string
  subject: string
  class_: string
  room: string
  type: 'lesson' | 'break' | 'free' | 'duty'
}

const SUBJECT_COLORS: Record<string, string> = {
  'Mathematics':  'bg-blue-50 dark:bg-blue-900/20 border-l-blue-400',
  'Break':        'bg-gray-50 dark:bg-gray-800/40 border-l-gray-300',
  'Lunch':        'bg-gray-50 dark:bg-gray-800/40 border-l-gray-300',
  'Free Period':  'bg-emerald-50 dark:bg-emerald-900/10 border-l-emerald-300',
  'Gate Duty':    'bg-amber-50 dark:bg-amber-900/10 border-l-amber-400',
}

const TIMETABLE: Record<string, Period[]> = {
  Monday: [
    { period: 1, time: '8:00–8:40',   start: '08:00', end: '08:40', subject: 'Mathematics', class_: 'Grade 5 Gold',   room: 'A12', type: 'lesson' },
    { period: 2, time: '8:40–9:20',   start: '08:40', end: '09:20', subject: 'Mathematics', class_: 'Grade 6 Silver', room: 'B04', type: 'lesson' },
    { period: 3, time: '9:20–10:00',  start: '09:20', end: '10:00', subject: 'Mathematics', class_: 'Grade 5 Blue',   room: 'A12', type: 'lesson' },
    { period: 4, time: '10:00–10:20', start: '10:00', end: '10:20', subject: 'Break',        class_: '',               room: '',    type: 'break'  },
    { period: 5, time: '10:20–11:00', start: '10:20', end: '11:00', subject: 'Mathematics', class_: 'Grade 4 Red',    room: 'C07', type: 'lesson' },
    { period: 6, time: '11:00–11:40', start: '11:00', end: '11:40', subject: 'Free Period',  class_: '',               room: '',    type: 'free'   },
    { period: 7, time: '11:40–12:20', start: '11:40', end: '12:20', subject: 'Mathematics', class_: 'Grade 5 Gold',   room: 'A12', type: 'lesson' },
    { period: 8, time: '12:20–1:00',  start: '12:20', end: '13:00', subject: 'Lunch',        class_: '',               room: '',    type: 'break'  },
    { period: 9, time: '1:00–1:40',   start: '13:00', end: '13:40', subject: 'Mathematics', class_: 'Grade 6 Silver', room: 'B04', type: 'lesson' },
  ],
  Tuesday: [
    { period: 1, time: '8:00–8:40',   start: '08:00', end: '08:40', subject: 'Mathematics', class_: 'Grade 7 Green',  room: 'D02', type: 'lesson' },
    { period: 2, time: '8:40–9:20',   start: '08:40', end: '09:20', subject: 'Mathematics', class_: 'Grade 5 Blue',   room: 'A12', type: 'lesson' },
    { period: 3, time: '9:20–10:00',  start: '09:20', end: '10:00', subject: 'Free Period',  class_: '',               room: '',    type: 'free'   },
    { period: 4, time: '10:00–10:20', start: '10:00', end: '10:20', subject: 'Break',        class_: '',               room: '',    type: 'break'  },
    { period: 5, time: '10:20–11:00', start: '10:20', end: '11:00', subject: 'Mathematics', class_: 'Grade 5 Gold',   room: 'A12', type: 'lesson' },
    { period: 6, time: '11:00–11:40', start: '11:00', end: '11:40', subject: 'Mathematics', class_: 'Grade 4 Red',    room: 'C07', type: 'lesson' },
    { period: 7, time: '11:40–12:20', start: '11:40', end: '12:20', subject: 'Mathematics', class_: 'Grade 7 Green',  room: 'D02', type: 'lesson' },
    { period: 8, time: '12:20–1:00',  start: '12:20', end: '13:00', subject: 'Lunch',        class_: '',               room: '',    type: 'break'  },
    { period: 9, time: '1:00–1:40',   start: '13:00', end: '13:40', subject: 'Free Period',  class_: '',               room: '',    type: 'free'   },
  ],
  Wednesday: [
    { period: 1, time: '8:00–8:40',   start: '08:00', end: '08:40', subject: 'Gate Duty',   class_: '',               room: 'Gate',type: 'duty'  },
    { period: 2, time: '8:40–9:20',   start: '08:40', end: '09:20', subject: 'Mathematics', class_: 'Grade 6 Silver', room: 'B04', type: 'lesson' },
    { period: 3, time: '9:20–10:00',  start: '09:20', end: '10:00', subject: 'Mathematics', class_: 'Grade 4 Red',    room: 'C07', type: 'lesson' },
    { period: 4, time: '10:00–10:20', start: '10:00', end: '10:20', subject: 'Break',        class_: '',               room: '',    type: 'break'  },
    { period: 5, time: '10:20–11:00', start: '10:20', end: '11:00', subject: 'Mathematics', class_: 'Grade 5 Blue',   room: 'A12', type: 'lesson' },
    { period: 6, time: '11:00–11:40', start: '11:00', end: '11:40', subject: 'Mathematics', class_: 'Grade 7 Green',  room: 'D02', type: 'lesson' },
    { period: 7, time: '11:40–12:20', start: '11:40', end: '12:20', subject: 'Free Period',  class_: '',               room: '',    type: 'free'   },
    { period: 8, time: '12:20–1:00',  start: '12:20', end: '13:00', subject: 'Lunch',        class_: '',               room: '',    type: 'break'  },
    { period: 9, time: '1:00–1:40',   start: '13:00', end: '13:40', subject: 'Mathematics', class_: 'Grade 5 Gold',   room: 'A12', type: 'lesson' },
  ],
  Thursday: [
    { period: 1, time: '8:00–8:40',   start: '08:00', end: '08:40', subject: 'Mathematics', class_: 'Grade 5 Gold',   room: 'A12', type: 'lesson' },
    { period: 2, time: '8:40–9:20',   start: '08:40', end: '09:20', subject: 'Free Period',  class_: '',               room: '',    type: 'free'   },
    { period: 3, time: '9:20–10:00',  start: '09:20', end: '10:00', subject: 'Mathematics', class_: 'Grade 7 Green',  room: 'D02', type: 'lesson' },
    { period: 4, time: '10:00–10:20', start: '10:00', end: '10:20', subject: 'Break',        class_: '',               room: '',    type: 'break'  },
    { period: 5, time: '10:20–11:00', start: '10:20', end: '11:00', subject: 'Mathematics', class_: 'Grade 6 Silver', room: 'B04', type: 'lesson' },
    { period: 6, time: '11:00–11:40', start: '11:00', end: '11:40', subject: 'Mathematics', class_: 'Grade 5 Blue',   room: 'A12', type: 'lesson' },
    { period: 7, time: '11:40–12:20', start: '11:40', end: '12:20', subject: 'Mathematics', class_: 'Grade 4 Red',    room: 'C07', type: 'lesson' },
    { period: 8, time: '12:20–1:00',  start: '12:20', end: '13:00', subject: 'Lunch',        class_: '',               room: '',    type: 'break'  },
    { period: 9, time: '1:00–1:40',   start: '13:00', end: '13:40', subject: 'Free Period',  class_: '',               room: '',    type: 'free'   },
  ],
  Friday: [
    { period: 1, time: '8:00–8:40',   start: '08:00', end: '08:40', subject: 'Mathematics', class_: 'Grade 4 Red',    room: 'C07', type: 'lesson' },
    { period: 2, time: '8:40–9:20',   start: '08:40', end: '09:20', subject: 'Mathematics', class_: 'Grade 5 Blue',   room: 'A12', type: 'lesson' },
    { period: 3, time: '9:20–10:00',  start: '09:20', end: '10:00', subject: 'Mathematics', class_: 'Grade 5 Gold',   room: 'A12', type: 'lesson' },
    { period: 4, time: '10:00–10:20', start: '10:00', end: '10:20', subject: 'Break',        class_: '',               room: '',    type: 'break'  },
    { period: 5, time: '10:20–11:00', start: '10:20', end: '11:00', subject: 'Free Period',  class_: '',               room: '',    type: 'free'   },
    { period: 6, time: '11:00–11:40', start: '11:00', end: '11:40', subject: 'Mathematics', class_: 'Grade 6 Silver', room: 'B04', type: 'lesson' },
    { period: 7, time: '11:40–12:20', start: '11:40', end: '12:20', subject: 'Mathematics', class_: 'Grade 7 Green',  room: 'D02', type: 'lesson' },
    { period: 8, time: '12:20–1:00',  start: '12:20', end: '13:00', subject: 'Lunch',        class_: '',               room: '',    type: 'break'  },
    { period: 9, time: '1:00–1:40',   start: '13:00', end: '13:40', subject: 'Gate Duty',    class_: '',               room: 'Gate',type: 'duty'  },
  ],
}

function isNowPeriod(p: Period): boolean {
  const now = new Date()
  const [sh, sm] = p.start.split(':').map(Number)
  const [eh, em] = p.end.split(':').map(Number)
  const nowMin = now.getHours() * 60 + now.getMinutes()
  return nowMin >= sh * 60 + sm && nowMin < eh * 60 + em
}

function isPastPeriod(p: Period): boolean {
  const now = new Date()
  const [eh, em] = p.end.split(':').map(Number)
  return now.getHours() * 60 + now.getMinutes() >= eh * 60 + em
}

export function TeacherTimetable() {
  const today = DAYS[Math.min(new Date().getDay() - 1, 4)] ?? 'Monday'
  const [selectedDay, setSelectedDay] = useState(today)

  const periods = TIMETABLE[selectedDay] ?? []
  const lessons  = periods.filter(p => p.type === 'lesson').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Timetable</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Mathematics · Term 2, 2025 — {lessons} lessons today</p>
        </div>
        <button className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700 px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors self-start sm:self-auto">
          <Download className="w-4 h-4" /> Print Timetable
        </button>
      </div>

      {/* Day Selector */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl overflow-x-auto">
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`flex-1 min-w-[64px] py-2 px-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              selectedDay === day
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            } ${day === today ? 'relative' : ''}`}
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{DAY_SHORT[day]}</span>
            {day === today && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {selectedDay === today && (
        <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 px-4 py-2.5 rounded-xl">
          <Clock className="w-4 h-4" />
          <span>Today's schedule — current period highlighted in green</span>
        </div>
      )}

      {/* Period List */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {periods.map(p => {
            const isNow  = selectedDay === today && isNowPeriod(p)
            const isPast = selectedDay === today && isPastPeriod(p) && !isNow
            const color  = SUBJECT_COLORS[p.subject] ?? 'bg-white dark:bg-gray-900 border-l-transparent'

            return (
              <div
                key={p.period}
                className={`flex items-center gap-4 px-5 py-4 border-l-4 transition-colors
                  ${isNow  ? 'bg-emerald-50 dark:bg-emerald-900/25 border-l-emerald-500' : color}
                  ${isPast ? 'opacity-40' : ''}
                `}
              >
                <div className="text-xs text-gray-400 w-6 text-right shrink-0 font-mono">{p.period}</div>
                <div className="w-28 shrink-0">
                  <p className="text-xs font-mono text-gray-500 dark:text-gray-400">{p.time}</p>
                </div>
                <div className="flex-1">
                  <p className={`font-semibold ${p.type === 'break' ? 'text-gray-400 dark:text-gray-500 italic text-sm' : p.type === 'free' ? 'text-gray-400 dark:text-gray-500 italic text-sm' : 'text-gray-800 dark:text-white'}`}>
                    {p.subject}
                  </p>
                  {p.class_ && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{p.class_}</p>
                  )}
                </div>
                {p.room && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 shrink-0">
                    <MapPin className="w-3 h-3" />
                    <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{p.room}</span>
                  </div>
                )}
                {isNow && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-2.5 py-1 rounded-full animate-pulse shrink-0">
                    NOW
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </GlassCard>

      {/* Weekly Summary Grid */}
      <GlassCard className="p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Weekly Overview</h2>
        <div className="grid grid-cols-5 gap-2">
          {DAYS.map(day => {
            const dayPeriods = TIMETABLE[day] ?? []
            const dayLessons = dayPeriods.filter(p => p.type === 'lesson')
            return (
              <div key={day} className={`p-3 rounded-xl border ${selectedDay === day ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/60'}`}>
                <p className={`text-xs font-semibold mb-2 ${day === today ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  {DAY_SHORT[day]} {day === today && '•'}
                </p>
                <div className="space-y-1">
                  {dayLessons.map(p => (
                    <div key={p.period} className="text-xs p-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded truncate">
                      {p.class_}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">{dayLessons.length} lessons</p>
              </div>
            )
          })}
        </div>
      </GlassCard>
    </div>
  )
}
