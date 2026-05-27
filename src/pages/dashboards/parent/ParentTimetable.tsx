import { useState } from 'react'
import { Clock } from 'lucide-react'
import { GlassCard } from '../../../components/ui/GlassCard'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

const TIMETABLE: Record<string, { time: string; subject: string; teacher: string; room: string }[]> = {
  Monday:    [
    { time: '7:30–8:30',   subject: 'Mathematics',    teacher: 'Mr. Ochieng',  room: 'Room 12'    },
    { time: '8:30–9:30',   subject: 'English',        teacher: 'Mrs. Wanjiku', room: 'Room 08'    },
    { time: '10:00–11:00', subject: 'Science',        teacher: 'Mr. Kamau',    room: 'Lab 2'      },
    { time: '11:00–12:00', subject: 'Kiswahili',      teacher: 'Ms. Akinyi',   room: 'Room 05'    },
    { time: '13:00–14:00', subject: 'PE',             teacher: 'Mr. Mutua',    room: 'Field'      },
  ],
  Tuesday:   [
    { time: '7:30–8:30',   subject: 'Social Studies', teacher: 'Mr. Njoroge',  room: 'Room 10'    },
    { time: '8:30–9:30',   subject: 'Mathematics',    teacher: 'Mr. Ochieng',  room: 'Room 12'    },
    { time: '10:00–11:00', subject: 'Creative Arts',  teacher: 'Ms. Chebet',   room: 'Art Studio' },
    { time: '11:00–12:00', subject: 'English',        teacher: 'Mrs. Wanjiku', room: 'Room 08'    },
    { time: '13:00–14:00', subject: 'CRE',            teacher: 'Mr. Gitonga',  room: 'Room 03'    },
  ],
  Wednesday: [
    { time: '7:30–8:30',   subject: 'Science',        teacher: 'Mr. Kamau',    room: 'Lab 2'      },
    { time: '8:30–9:30',   subject: 'Kiswahili',      teacher: 'Ms. Akinyi',   room: 'Room 05'    },
    { time: '10:00–11:00', subject: 'Mathematics',    teacher: 'Mr. Ochieng',  room: 'Room 12'    },
    { time: '11:00–12:00', subject: 'Social Studies', teacher: 'Mr. Njoroge',  room: 'Room 10'    },
    { time: '13:00–14:00', subject: 'Music',          teacher: 'Ms. Waweru',   room: 'Music Room' },
  ],
  Thursday:  [
    { time: '7:30–8:30',   subject: 'English',        teacher: 'Mrs. Wanjiku', room: 'Room 08'    },
    { time: '8:30–9:30',   subject: 'CRE',            teacher: 'Mr. Gitonga',  room: 'Room 03'    },
    { time: '10:00–11:00', subject: 'Kiswahili',      teacher: 'Ms. Akinyi',   room: 'Room 05'    },
    { time: '11:00–12:00', subject: 'Science',        teacher: 'Mr. Kamau',    room: 'Lab 2'      },
    { time: '13:00–14:00', subject: 'Mathematics',    teacher: 'Mr. Ochieng',  room: 'Room 12'    },
  ],
  Friday:    [
    { time: '7:30–8:30',   subject: 'Creative Arts',  teacher: 'Ms. Chebet',   room: 'Art Studio' },
    { time: '8:30–9:30',   subject: 'Social Studies', teacher: 'Mr. Njoroge',  room: 'Room 10'    },
    { time: '10:00–11:00', subject: 'English',        teacher: 'Mrs. Wanjiku', room: 'Room 08'    },
    { time: '11:00–12:00', subject: 'PE',             teacher: 'Mr. Mutua',    room: 'Field'      },
    { time: '13:00–14:00', subject: 'Mathematics',    teacher: 'Mr. Ochieng',  room: 'Room 12'    },
  ],
}

export function ParentTimetable() {
  const todayIdx = new Date().getDay()
  const [day, setDay] = useState(DAYS[Math.max(0, todayIdx - 1)] ?? 'Monday')

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Amani's Timetable</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Grade 5 Gold · Term 2, 2026</p>
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
                  <p className="text-xs text-gray-400">{p.teacher}</p>
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
    </div>
  )
}
