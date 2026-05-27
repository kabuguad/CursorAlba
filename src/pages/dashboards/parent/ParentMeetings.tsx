import { useState } from 'react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Button } from '../../../components/ui/Button'
import { useToast } from '../../../contexts/ToastContext'
import { CalendarDays, Clock, User, CheckCircle2, XCircle, Info } from 'lucide-react'

interface Slot {
  id: string
  teacher: string
  role: string
  date: string
  time: string
  duration: string
  available: boolean
}

interface Booking {
  id: string
  teacher: string
  role: string
  date: string
  time: string
  duration: string
  agenda: string
  bookedOn: string
  status: 'Confirmed' | 'Cancelled'
}

const SLOTS: Slot[] = [
  { id: 's1',  teacher: 'Mrs. Grace Kamau',   role: 'Class Teacher',        date: '22 Jun 2026', time: '8:00 AM',  duration: '15 min', available: true  },
  { id: 's2',  teacher: 'Mrs. Grace Kamau',   role: 'Class Teacher',        date: '22 Jun 2026', time: '8:20 AM',  duration: '15 min', available: false },
  { id: 's3',  teacher: 'Mrs. Grace Kamau',   role: 'Class Teacher',        date: '22 Jun 2026', time: '8:40 AM',  duration: '15 min', available: true  },
  { id: 's4',  teacher: 'Mrs. Grace Kamau',   role: 'Class Teacher',        date: '22 Jun 2026', time: '9:00 AM',  duration: '15 min', available: false },
  { id: 's5',  teacher: 'Mr. James Ochieng',  role: 'Mathematics Teacher',  date: '22 Jun 2026', time: '10:00 AM', duration: '15 min', available: true  },
  { id: 's6',  teacher: 'Mr. James Ochieng',  role: 'Mathematics Teacher',  date: '22 Jun 2026', time: '10:20 AM', duration: '15 min', available: true  },
  { id: 's7',  teacher: 'Mr. James Ochieng',  role: 'Mathematics Teacher',  date: '22 Jun 2026', time: '10:40 AM', duration: '15 min', available: false },
  { id: 's8',  teacher: 'Mrs. Janet Wanjiku', role: 'English Teacher',      date: '22 Jun 2026', time: '11:00 AM', duration: '15 min', available: true  },
  { id: 's9',  teacher: 'Mrs. Janet Wanjiku', role: 'English Teacher',      date: '22 Jun 2026', time: '11:20 AM', duration: '15 min', available: true  },
  { id: 's10', teacher: 'Mr. Eric Kamau',     role: 'Science Teacher',      date: '22 Jun 2026', time: '2:00 PM',  duration: '15 min', available: true  },
  { id: 's11', teacher: 'Mr. Eric Kamau',     role: 'Science Teacher',      date: '22 Jun 2026', time: '2:20 PM',  duration: '15 min', available: false },
  { id: 's12', teacher: 'Mr. Eric Kamau',     role: 'Science Teacher',      date: '22 Jun 2026', time: '2:40 PM',  duration: '15 min', available: true  },
  { id: 's13', teacher: 'Mr. Albert Njeru',   role: 'Principal',            date: '22 Jun 2026', time: '3:30 PM',  duration: '20 min', available: true  },
  { id: 's14', teacher: 'Mr. Albert Njeru',   role: 'Principal',            date: '22 Jun 2026', time: '3:55 PM',  duration: '20 min', available: true  },
]

const EXISTING_BOOKINGS: Booking[] = []

export function ParentMeetings() {
  const { showToast } = useToast()
  const [bookings, setBookings] = useState<Booking[]>(EXISTING_BOOKINGS)
  const [bookedIds, setBookedIds] = useState<Set<string>>(new Set())
  const [agendaMap, setAgendaMap] = useState<Record<string, string>>({})
  const [expandedTeacher, setExpandedTeacher] = useState<string | null>(null)

  const teachers = [...new Set(SLOTS.map(s => s.teacher))]

  const book = (slot: Slot) => {
    const agenda = agendaMap[slot.id] ?? ''
    const booking: Booking = {
      id: slot.id,
      teacher: slot.teacher,
      role: slot.role,
      date: slot.date,
      time: slot.time,
      duration: slot.duration,
      agenda,
      bookedOn: new Date().toLocaleDateString('en-KE'),
      status: 'Confirmed',
    }
    setBookings(b => [booking, ...b])
    setBookedIds(s => new Set([...s, slot.id]))
    showToast(`Meeting booked with ${slot.teacher} at ${slot.time}`)
  }

  const cancel = (id: string) => {
    setBookings(b => b.map(bk => bk.id === id ? { ...bk, status: 'Cancelled' as const } : bk))
    setBookedIds(s => { const n = new Set(s); n.delete(id); return n })
    showToast('Meeting cancelled')
  }

  const slotsFor = (teacher: string) => SLOTS.filter(s => s.teacher === teacher)
  const availableFor = (teacher: string) =>
    slotsFor(teacher).filter(s => s.available && !bookedIds.has(s.id)).length

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Parent-Teacher Meetings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Term 2 Conference · 22 June 2026 · Book your 15-minute slots below
        </p>
      </div>

      {/* Info */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 px-4 py-3">
        <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Meetings are held at school on <strong>22 June 2026, 8:00 AM – 4:00 PM</strong>.
          Each slot is 15 minutes. You may book one slot per teacher. Bring your child's exercise books.
        </p>
      </div>

      {/* Booked meetings */}
      {bookings.filter(b => b.status === 'Confirmed').length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide mb-3">
            Your Booked Meetings ({bookings.filter(b => b.status === 'Confirmed').length})
          </h2>
          <div className="space-y-3">
            {bookings.filter(b => b.status === 'Confirmed').map(bk => (
              <GlassCard key={bk.id} className="p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{bk.teacher}</p>
                      <p className="text-xs text-gray-400">{bk.role}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{bk.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{bk.time} ({bk.duration})</span>
                      </div>
                      {bk.agenda && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">"{bk.agenda}"</p>}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => cancel(bk.id)}
                    className="text-xs text-red-500 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0 gap-1"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Cancel
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Available slots by teacher */}
      <div>
        <h2 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide mb-3">
          Available Slots
        </h2>
        <div className="space-y-3">
          {teachers.map(teacher => {
            const slots = slotsFor(teacher)
            const role  = slots[0].role
            const date  = slots[0].date
            const avail = availableFor(teacher)
            const isOpen = expandedTeacher === teacher
            const alreadyBooked = bookings.some(b => b.teacher === teacher && b.status === 'Confirmed')

            return (
              <GlassCard key={teacher} className="overflow-hidden">
                <button
                  onClick={() => setExpandedTeacher(isOpen ? null : teacher)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition text-left"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8B84B] text-[11px] font-bold text-[#0d1b0d]">
                    {teacher.split(' ').slice(-1)[0].slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{teacher}</p>
                    <p className="text-xs text-gray-400">{role} · {date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {alreadyBooked && (
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 rounded-full px-2 py-0.5">
                        Booked
                      </span>
                    )}
                    <span className={`text-xs rounded-full px-2 py-0.5 font-semibold ${
                      avail > 0
                        ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-400 dark:bg-gray-800'
                    }`}>
                      {avail} slot{avail !== 1 ? 's' : ''} available
                    </span>
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100 dark:border-gray-800 px-4 pb-4 pt-3 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {slots.map(slot => {
                        const isBooked   = bookedIds.has(slot.id)
                        const isBusy     = !slot.available
                        const isDisabled = isBusy || isBooked || alreadyBooked
                        return (
                          <div
                            key={slot.id}
                            className={`rounded-xl border p-2.5 text-center text-xs transition ${
                              isBooked
                                ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                                : isBusy
                                ? 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 opacity-50'
                                : alreadyBooked
                                ? 'border-gray-100 dark:border-gray-800 opacity-40'
                                : 'border-gray-200 dark:border-gray-700 hover:border-green-400 hover:bg-green-50/50 dark:hover:bg-green-900/10 cursor-pointer'
                            }`}
                          >
                            <p className={`font-semibold ${isBooked ? 'text-green-700 dark:text-green-400' : isBusy ? 'text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
                              {slot.time}
                            </p>
                            <p className="text-gray-400 dark:text-gray-500 mt-0.5">{slot.duration}</p>
                            {isBooked && <p className="text-green-600 dark:text-green-400 font-semibold mt-1">✓ Yours</p>}
                            {isBusy && !isBooked && <p className="text-gray-400 mt-1">Taken</p>}
                          </div>
                        )
                      })}
                    </div>

                    {!alreadyBooked && avail > 0 && (
                      <div className="space-y-2">
                        <div>
                          <label className="label text-xs">Agenda / What you'd like to discuss (optional)</label>
                          <input
                            type="text"
                            placeholder="e.g. Mathematics performance, homework submission…"
                            value={agendaMap[slots[0].id] ?? ''}
                            onChange={e => setAgendaMap(m => ({ ...m, [slots[0].id]: e.target.value }))}
                            className="field w-full text-sm"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {slots.filter(s => s.available && !bookedIds.has(s.id)).map(slot => (
                            <Button
                              key={slot.id}
                              variant="primary"
                              onClick={() => book({ ...slot })}
                              className="text-xs py-1.5"
                            >
                              Book {slot.time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {alreadyBooked && !bookedIds.has(slots.find(s => bookedIds.has(s.id))?.id ?? '') && (
                      <p className="text-xs text-gray-400 italic">You already have a booking with this teacher.</p>
                    )}
                  </div>
                )}
              </GlassCard>
            )
          })}
        </div>
      </div>
    </div>
  )
}
