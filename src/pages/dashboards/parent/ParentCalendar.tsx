import { useState } from 'react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'

interface CalEvent {
  id: number
  title: string
  date: string
  type: string
  description: string
  time?: string
}

const EVENTS: CalEvent[] = [
  { id: 1,  date: '2026-05-30', type: 'Deadline',  title: 'Algebra Homework Due',             description: 'Mathematics assignment — Quadratic Equations', time: 'By 3:00 PM' },
  { id: 2,  date: '2026-06-02', type: 'Deadline',  title: 'English Essay Due',                description: 'Essay: My Future Career', time: 'By 3:00 PM' },
  { id: 3,  date: '2026-06-05', type: 'Deadline',  title: 'Social Studies Assignment Due',    description: 'Map Reading — Kirinyaga County', time: 'By 3:00 PM' },
  { id: 4,  date: '2026-06-10', type: 'Academic',  title: 'Mid-Term CAT 2 — Mathematics',    description: 'In-class continuous assessment test', time: '7:30 AM' },
  { id: 5,  date: '2026-06-11', type: 'Academic',  title: 'Mid-Term CAT 2 — Science',        description: 'Written and practical components', time: '7:30 AM' },
  { id: 6,  date: '2026-06-12', type: 'Academic',  title: 'Mid-Term CAT 2 — English',        description: 'Grammar and composition', time: '7:30 AM' },
  { id: 7,  date: '2026-06-15', type: 'Finance',   title: 'Term 2 Fee Deadline',              description: 'All outstanding balances due. M-Pesa Paybill 522522.' },
  { id: 8,  date: '2026-06-15', type: 'Sports',    title: 'Inter-House Sports Day',           description: 'Annual athletics championships at the Sports Complex', time: '8:00 AM – 5:00 PM' },
  { id: 9,  date: '2026-06-20', type: 'Holiday',   title: 'Madaraka Day (Public Holiday)',    description: 'School closed' },
  { id: 10, date: '2026-06-22', type: 'Meeting',   title: 'Parent-Teacher Conference',        description: 'Book your slot via the school office or call 0712-345-678', time: '8:00 AM – 4:00 PM' },
  { id: 11, date: '2026-06-28', type: 'Sports',    title: 'Inter-School Football Finals',     description: 'Alber School vs Kerugoya Boys — Away match' },
  { id: 12, date: '2026-07-03', type: 'Academic',  title: 'Drama Festival — School Round',   description: 'Internal drama competition selection', time: '2:00 PM' },
  { id: 13, date: '2026-07-10', type: 'Academic',  title: 'Library Books Return Deadline',   description: 'All borrowed library books must be returned or renewed' },
  { id: 14, date: '2026-07-17', type: 'Academic',  title: 'Term 2 Exams Begin',              description: 'Formal end-of-term examinations commence', time: '7:30 AM' },
  { id: 15, date: '2026-07-31', type: 'Holiday',   title: 'Term 2 Ends',                     description: 'Last day of Term 2. Students dismissed at 12:00 PM' },
  { id: 16, date: '2026-09-01', type: 'Academic',  title: 'Term 3 Begins',                   description: 'School reopens for Term 3 — 2026' },
]

const TYPE_STYLES: Record<string, { dot: string; badge: string }> = {
  Academic:  { dot: 'bg-blue-500',   badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'   },
  Sports:    { dot: 'bg-green-500',  badge: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
  Finance:   { dot: 'bg-yellow-500', badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' },
  Meeting:   { dot: 'bg-orange-500', badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' },
  Holiday:   { dot: 'bg-red-400',    badge: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300'       },
  Deadline:  { dot: 'bg-purple-500', badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

export function ParentCalendar() {
  const today = new Date()
  const [viewDate, setViewDate] = useState(new Date(2026, 5, 1))
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<string | null>(null)

  const year  = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

  const dateStr = (d: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

  const eventsForDate = (d: number) =>
    EVENTS.filter(e => e.date === dateStr(d) && (!filterType || e.type === filterType))

  const upcomingEvents = [...EVENTS]
    .filter(e => {
      const d = new Date(e.date)
      return d >= new Date(year, month, 1) && d <= new Date(year, month + 1, 0) && (!filterType || e.type === filterType)
    })
    .sort((a, b) => a.date.localeCompare(b.date))

  const selectedEvents = selectedDate
    ? EVENTS.filter(e => e.date === selectedDate && (!filterType || e.type === filterType))
    : []

  const isToday = (d: number) => {
    const t = today
    return t.getFullYear() === year && t.getMonth() === month && t.getDate() === d
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">School Calendar</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Events, deadlines and important dates</p>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterType(null)}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
            !filterType ? 'bg-gray-800 dark:bg-white text-white dark:text-gray-900' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          All
        </button>
        {Object.keys(TYPE_STYLES).map(type => (
          <button
            key={type}
            onClick={() => setFilterType(filterType === type ? null : type)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
              filterType === type ? TYPE_STYLES[type].badge + ' ring-1 ring-inset ring-current/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${TYPE_STYLES[type].dot}`} />
            {type}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Calendar grid */}
        <GlassCard className="p-5 lg:col-span-2">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            </button>
            <h2 className="font-bold text-gray-900 dark:text-white">{MONTHS[month]} {year}</h2>
            <button onClick={nextMonth} className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS_SHORT.map(d => (
              <div key={d} className="text-center text-[10px] font-bold uppercase tracking-wide text-gray-400 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1
              const events = eventsForDate(d)
              const ds = dateStr(d)
              const isSelected = selectedDate === ds
              const isTod = isToday(d)
              const isWeekend = new Date(year, month, d).getDay() === 0 || new Date(year, month, d).getDay() === 6
              return (
                <button
                  key={d}
                  onClick={() => setSelectedDate(isSelected ? null : ds)}
                  className={`relative rounded-lg p-1 min-h-[52px] text-left transition ${
                    isSelected ? 'bg-green-50 dark:bg-green-900/20 ring-1 ring-green-500' :
                    isTod ? 'bg-[#E8B84B]/10 ring-1 ring-[#E8B84B]' :
                    isWeekend ? 'bg-gray-50/50 dark:bg-gray-800/20 opacity-60' :
                    'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <span className={`text-xs font-semibold ${
                    isTod ? 'text-[#E8B84B]' :
                    isWeekend ? 'text-gray-400' :
                    'text-gray-700 dark:text-gray-300'
                  }`}>{d}</span>
                  <div className="flex flex-wrap gap-0.5 mt-0.5">
                    {events.slice(0, 3).map(ev => (
                      <span
                        key={ev.id}
                        className={`h-1.5 w-1.5 rounded-full ${TYPE_STYLES[ev.type]?.dot ?? 'bg-gray-400'}`}
                      />
                    ))}
                    {events.length > 3 && <span className="text-[8px] text-gray-400">+{events.length - 3}</span>}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            {Object.entries(TYPE_STYLES).map(([type, styles]) => (
              <div key={type} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
                {type}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Sidebar — selected day or upcoming */}
        <div className="space-y-4">
          {selectedDate && selectedEvents.length > 0 && (
            <GlassCard className="p-5">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-gray-400" />
                {new Date(selectedDate + 'T00:00').toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h3>
              <div className="space-y-3">
                {selectedEvents.map(ev => (
                  <div key={ev.id} className="flex gap-3">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${TYPE_STYLES[ev.type]?.dot}`} />
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{ev.title}</p>
                      {ev.time && <p className="text-xs text-[#E8B84B] font-medium">{ev.time}</p>}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{ev.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          <GlassCard className="p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">
              {MONTHS[month]} Events
            </h3>
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-gray-400">No events this month.</p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map(ev => (
                  <div key={ev.id} className="flex gap-3">
                    <div className="text-center shrink-0 w-8">
                      <p className="text-lg font-bold text-gray-800 dark:text-gray-200 leading-none">
                        {new Date(ev.date + 'T00:00').getDate()}
                      </p>
                      <p className="text-[9px] uppercase text-gray-400 tracking-wide">
                        {DAYS_SHORT[new Date(ev.date + 'T00:00').getDay()]}
                      </p>
                    </div>
                    <div className="flex-1 border-l border-gray-100 dark:border-gray-800 pl-3">
                      <div className="flex items-start gap-1.5">
                        <span className={`mt-1 shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${TYPE_STYLES[ev.type]?.badge}`}>
                          {ev.type}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-0.5">{ev.title}</p>
                      {ev.time && <p className="text-[11px] text-gray-400">{ev.time}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
