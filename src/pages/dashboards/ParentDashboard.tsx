import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { GraduationCap, CalendarDays, Banknote, ClipboardList, Bell, Clock } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { Button } from '../../components/ui/Button'
import { formatKES } from '../../lib/utils'
import { useAuth } from '../../contexts/AuthContext'
import { useStudentGrades } from '../../hooks/useGrades'
import { useAttendance } from '../../hooks/useAttendance'
import { useFeeStatement, useInitiatePayment } from '../../hooks/useFees'

const LINKED_STUDENT_ID = 's-1'

const TABS = [
  { id: 'grades',        label: 'Grades',       icon: GraduationCap },
  { id: 'attendance',    label: 'Attendance',   icon: CalendarDays  },
  { id: 'fees',          label: 'Fees',         icon: Banknote      },
  { id: 'homework',      label: 'Homework',     icon: ClipboardList },
  { id: 'timetable',     label: 'Timetable',    icon: Clock         },
  { id: 'announcements', label: 'Notices',      icon: Bell          },
]

const HOMEWORK = [
  { id: 1, subject: 'Mathematics',    title: 'Algebra Practice — Quadratic Equations',    due: '2026-05-30', status: 'pending',   teacher: 'Mr. Ochieng'  },
  { id: 2, subject: 'English',        title: 'Essay: "My Future Career"',                 due: '2026-06-02', status: 'pending',   teacher: 'Mrs. Wanjiku' },
  { id: 3, subject: 'Science',        title: 'Lab Report — Photosynthesis Experiment',    due: '2026-05-28', status: 'submitted', teacher: 'Mr. Kamau'    },
  { id: 4, subject: 'Kiswahili',      title: 'Insha: Mazingira ya Shule',                 due: '2026-05-25', status: 'graded',    teacher: 'Ms. Akinyi'   },
  { id: 5, subject: 'Social Studies', title: 'Map Reading Assignment — Kirinyaga County', due: '2026-06-05', status: 'pending',   teacher: 'Mr. Njoroge'  },
]

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

const ANNOUNCEMENTS = [
  { id: 1, title: 'Term 2 Examination Timetable Released',        date: '2026-05-26', category: 'Academic',     body: 'The Term 2 examination timetable has been released. Exams begin 27 July 2026. Please collect your child\'s admit card from the school office.' },
  { id: 2, title: 'Drama Festival Rehearsals',                     date: '2026-05-24', category: 'Co-curricular', body: 'Students selected for the Inter-School Drama Festival must attend rehearsals every Wednesday 4–6 PM in the Theatre Studio.' },
  { id: 3, subject: 'School Fees Reminder — Term 2',               id2: 3,   date: '2026-05-20', category: 'Finance',      body: 'Term 2 fees are due by 15 June 2026. Kindly clear any outstanding balances. M-Pesa Paybill: 522522.' },
  { id: 4, title: 'Sports Day — Inter-House Championships',        date: '2026-06-15', category: 'Sports',       body: 'Annual inter-house athletics will be held on 15 June at the Sports Complex. Students should wear house colours.' },
  { id: 5, title: 'Parent-Teacher Conference Scheduled',           date: '2026-05-15', category: 'Meeting',      body: 'The Term 2 Parent-Teacher conference is scheduled for 22 April 2026. Please book your slot via the school office or call 0712-345-678.' },
].map(a => ({ ...a, title: (a as any).title ?? (a as any).subject ?? '' }))

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  submitted: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  graded:    'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}
const CAT_STYLES: Record<string, string> = {
  Academic:      'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Co-curricular': 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Finance:       'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Sports:        'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Meeting:       'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  General:       'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
}

export function ParentDashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState('grades')
  const [day, setDay] = useState('Monday')

  const { data: progress, isLoading: gradesLoading } = useStudentGrades(LINKED_STUDENT_ID)
  const { data: attendance, isLoading: attendanceLoading } = useAttendance(LINKED_STUDENT_ID, 2026, 2)
  const { data: fees, isLoading: feesLoading } = useFeeStatement(LINKED_STUDENT_ID)
  const { mutate: payMpesa, isPending: payPending } = useInitiatePayment()

  const handlePay = () => {
    payMpesa({ studentId: LINKED_STUDENT_ID, invoiceId: 'INV-2026-003', phone: '0712345678' })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome, {user?.name}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Parent Portal · Amani Kariuki — Grade 5 Gold</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-1">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition whitespace-nowrap ${
              tab === t.id
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── GRADES ── */}
      {tab === 'grades' && (
        <GlassCard className="p-6">
          <h2 className="mb-1 font-bold text-primary dark:text-gold">Grade Progress</h2>
          {progress && (
            <p className="mb-4 text-sm text-muted">
              Average: <span className="font-semibold text-foreground">{progress.average}%</span>
              {' '}·{' '}
              Trend:{' '}
              <span className={progress.trend === 'up' ? 'text-primary' : progress.trend === 'down' ? 'text-red-500' : 'text-muted'}>
                {progress.trend === 'up' ? '↑ Improving' : progress.trend === 'down' ? '↓ Declining' : '→ Stable'}
              </span>
            </p>
          )}
          {gradesLoading ? (
            <div className="h-[250px] animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-700" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={progress?.grades}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(val: number) => [`${val}%`, 'Score']} labelStyle={{ fontWeight: 600 }} />
                <Bar dataKey="score" fill="#15803d" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </GlassCard>
      )}

      {/* ── ATTENDANCE ── */}
      {tab === 'attendance' && (
        <GlassCard className="p-6">
          <h2 className="mb-1 font-bold">Attendance — {attendance?.month ?? 'March 2026'}</h2>
          {!attendanceLoading && attendance && (
            <p className="mb-3 text-sm text-muted">
              Present: <span className="font-semibold text-primary">{attendance.presentCount} days</span>
              {' '}· Absent: <span className="font-semibold text-red-500">{attendance.absentCount} days</span>
              {' '}· Rate: <span className="font-semibold">{attendance.percentage}%</span>
            </p>
          )}
          {attendanceLoading ? (
            <div className="h-40 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-700" />
          ) : (
            <div className="flex flex-wrap gap-1">
              {attendance?.days.map((d) => (
                <div
                  key={d.date}
                  title={d.date}
                  className={`h-8 w-8 rounded-md transition hover:scale-110 ${
                    d.present ? 'bg-primary' : 'bg-neutral-300 dark:bg-neutral-600'
                  }`}
                />
              ))}
            </div>
          )}
          <p className="mt-4 text-sm text-muted">Green = present · Grey = absent</p>
        </GlassCard>
      )}

      {/* ── FEES ── */}
      {tab === 'fees' && (
        <GlassCard className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-bold">Fee Balance</h2>
              {feesLoading ? (
                <div className="mt-1 h-9 w-32 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-700" />
              ) : (
                <p className="text-3xl font-bold text-primary dark:text-gold">{formatKES(fees?.balance ?? 0)}</p>
              )}
            </div>
            <Button variant="gold" onClick={handlePay} disabled={payPending}>
              {payPending ? 'Sending...' : 'Pay via M-Pesa (522522)'}
            </Button>
          </div>
          <div className="space-y-2">
            {feesLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-11 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-700" />
                ))
              : fees?.invoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex justify-between rounded-xl bg-tint/50 px-4 py-3 text-sm text-foreground dark:bg-dark-card"
                  >
                    <span>{inv.desc} ({inv.id})</span>
                    <span className={inv.paid ? 'text-primary' : 'text-gold'}>
                      {formatKES(inv.amount)} {inv.paid ? '✓ Paid' : 'Due'}
                    </span>
                  </div>
                ))}
          </div>
        </GlassCard>
      )}

      {/* ── HOMEWORK ── */}
      {tab === 'homework' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900 dark:text-white">Amani's Homework</h2>
            <span className="text-sm text-gray-400">{HOMEWORK.filter(h => h.status === 'pending').length} pending</span>
          </div>
          {HOMEWORK.map(hw => (
            <GlassCard key={hw.id} className="p-5">
              <div className="flex flex-wrap items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-gold/10 dark:text-gold">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{hw.title}</h3>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[hw.status]}`}>{hw.status}</span>
                  </div>
                  <p className="text-sm text-gray-400">{hw.subject} · {hw.teacher}</p>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-400">
                  <Clock className="h-4 w-4" />
                  Due {hw.due}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* ── TIMETABLE ── */}
      {tab === 'timetable' && (
        <div>
          <div className="mb-4 flex gap-2 overflow-x-auto">
            {DAYS.map(d => (
              <button
                key={d}
                onClick={() => setDay(d)}
                className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition ${
                  day === d
                    ? 'bg-primary text-white dark:bg-gold dark:text-dark'
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
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-gold/10 dark:text-gold font-bold text-lg">
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
      )}

      {/* ── ANNOUNCEMENTS ── */}
      {tab === 'announcements' && (
        <div className="space-y-4">
          {ANNOUNCEMENTS.map(a => (
            <GlassCard key={a.id} className="p-6">
              <div className="flex flex-wrap items-start gap-3 mb-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${CAT_STYLES[a.category] ?? CAT_STYLES.General}`}>{a.category}</span>
                <span className="text-xs text-gray-400 ml-auto">{a.date}</span>
              </div>
              <h3 className="mb-2 font-bold text-gray-900 dark:text-white">{a.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{a.body}</p>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}
