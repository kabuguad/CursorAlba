import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { BookOpen, CalendarDays, Bell, ClipboardList, GraduationCap, Clock } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { useAuth } from '../../contexts/AuthContext'

const TABS = [
  { id: 'overview',     label: 'Overview',     icon: GraduationCap },
  { id: 'grades',       label: 'My Grades',    icon: BookOpen       },
  { id: 'homework',     label: 'Homework',     icon: ClipboardList  },
  { id: 'timetable',   label: 'Timetable',    icon: CalendarDays   },
  { id: 'announcements', label: 'Notices',    icon: Bell           },
]

const GRADES = [
  { subject: 'Mathematics',    score: 88, grade: 'A' },
  { subject: 'English',        score: 92, grade: 'A' },
  { subject: 'Science',        score: 85, grade: 'A-' },
  { subject: 'Kiswahili',      score: 90, grade: 'A' },
  { subject: 'Social Studies', score: 78, grade: 'B+' },
  { subject: 'Creative Arts',  score: 94, grade: 'A' },
  { subject: 'CRE',            score: 82, grade: 'A-' },
  { subject: 'PE',             score: 96, grade: 'A' },
]

const HOMEWORK = [
  { id: 1, subject: 'Mathematics',    title: 'Algebra Practice — Quadratic Equations',    due: '2026-05-30', status: 'pending',   teacher: 'Mr. Ochieng'    },
  { id: 2, subject: 'English',        title: 'Essay: "My Future Career"',                 due: '2026-06-02', status: 'pending',   teacher: 'Mrs. Wanjiku'   },
  { id: 3, subject: 'Science',        title: 'Lab Report — Photosynthesis Experiment',    due: '2026-05-28', status: 'submitted', teacher: 'Mr. Kamau'      },
  { id: 4, subject: 'Kiswahili',      title: 'Insha: Mazingira ya Shule',                 due: '2026-05-25', status: 'graded',    teacher: 'Ms. Akinyi'     },
  { id: 5, subject: 'Social Studies', title: 'Map Reading Assignment — Kirinyaga County', due: '2026-06-05', status: 'pending',   teacher: 'Mr. Njoroge'    },
  { id: 6, subject: 'Creative Arts',  title: 'Portfolio: 3 Original Sketches',            due: '2026-06-10', status: 'pending',   teacher: 'Ms. Chebet'     },
]

const TIMETABLE: Record<string, { time: string; subject: string; teacher: string; room: string }[]> = {
  Monday:    [
    { time: '7:30–8:30',   subject: 'Mathematics',    teacher: 'Mr. Ochieng',  room: 'Room 12' },
    { time: '8:30–9:30',   subject: 'English',        teacher: 'Mrs. Wanjiku', room: 'Room 08' },
    { time: '10:00–11:00', subject: 'Science',        teacher: 'Mr. Kamau',    room: 'Lab 2'   },
    { time: '11:00–12:00', subject: 'Kiswahili',      teacher: 'Ms. Akinyi',   room: 'Room 05' },
    { time: '13:00–14:00', subject: 'PE',             teacher: 'Mr. Mutua',    room: 'Field'   },
  ],
  Tuesday:   [
    { time: '7:30–8:30',   subject: 'Social Studies', teacher: 'Mr. Njoroge',  room: 'Room 10' },
    { time: '8:30–9:30',   subject: 'Mathematics',    teacher: 'Mr. Ochieng',  room: 'Room 12' },
    { time: '10:00–11:00', subject: 'Creative Arts',  teacher: 'Ms. Chebet',   room: 'Art Studio' },
    { time: '11:00–12:00', subject: 'English',        teacher: 'Mrs. Wanjiku', room: 'Room 08' },
    { time: '13:00–14:00', subject: 'CRE',            teacher: 'Mr. Gitonga',  room: 'Room 03' },
  ],
  Wednesday: [
    { time: '7:30–8:30',   subject: 'Science',        teacher: 'Mr. Kamau',    room: 'Lab 2'   },
    { time: '8:30–9:30',   subject: 'Kiswahili',      teacher: 'Ms. Akinyi',   room: 'Room 05' },
    { time: '10:00–11:00', subject: 'Mathematics',    teacher: 'Mr. Ochieng',  room: 'Room 12' },
    { time: '11:00–12:00', subject: 'Social Studies', teacher: 'Mr. Njoroge',  room: 'Room 10' },
    { time: '13:00–14:00', subject: 'Music',          teacher: 'Ms. Waweru',   room: 'Music Room' },
  ],
  Thursday:  [
    { time: '7:30–8:30',   subject: 'English',        teacher: 'Mrs. Wanjiku', room: 'Room 08' },
    { time: '8:30–9:30',   subject: 'CRE',            teacher: 'Mr. Gitonga',  room: 'Room 03' },
    { time: '10:00–11:00', subject: 'Kiswahili',      teacher: 'Ms. Akinyi',   room: 'Room 05' },
    { time: '11:00–12:00', subject: 'Science',        teacher: 'Mr. Kamau',    room: 'Lab 2'   },
    { time: '13:00–14:00', subject: 'Mathematics',    teacher: 'Mr. Ochieng',  room: 'Room 12' },
  ],
  Friday:    [
    { time: '7:30–8:30',   subject: 'Creative Arts',  teacher: 'Ms. Chebet',   room: 'Art Studio' },
    { time: '8:30–9:30',   subject: 'Social Studies', teacher: 'Mr. Njoroge',  room: 'Room 10' },
    { time: '10:00–11:00', subject: 'English',        teacher: 'Mrs. Wanjiku', room: 'Room 08' },
    { time: '11:00–12:00', subject: 'PE',             teacher: 'Mr. Mutua',    room: 'Field'   },
    { time: '13:00–14:00', subject: 'Mathematics',    teacher: 'Mr. Ochieng',  room: 'Room 12' },
  ],
}

const ANNOUNCEMENTS = [
  { id: 1, title: 'Term 2 Examination Timetable Released',         date: '2026-05-26', category: 'Academic',  body: 'The Term 2 examination timetable has been released. Exams begin 27 July 2026. Please collect your admit card from the office.' },
  { id: 2, title: 'Drama Festival Rehearsals — All Cast Members',  date: '2026-05-24', category: 'Co-curricular', body: 'All students selected for the Inter-School Drama Festival must attend rehearsals every Wednesday 4–6 PM in the Theatre Studio.' },
  { id: 3, title: 'School Fees Reminder — Term 2',                  date: '2026-05-20', category: 'Finance',   body: 'Term 2 fees are due by 15 June 2026. Parents are reminded to clear any pending balances to avoid disruption of studies.' },
  { id: 4, title: 'Sports Day — Inter-House Championships',         date: '2026-05-18', category: 'Sports',    body: 'Annual inter-house athletics will be held on 15 June at the Sports Complex. All students are required to participate in at least one event.' },
  { id: 5, title: 'Library Book Return Deadline',                   date: '2026-05-15', category: 'General',   body: 'All borrowed library books must be returned by 30 May 2026. Fines of KES 10 per day will apply for late returns.' },
]

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
  General:       'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
}

function gradeColor(s: number) {
  if (s >= 80) return 'text-green-600 dark:text-green-400'
  if (s >= 60) return 'text-blue-600 dark:text-blue-400'
  if (s >= 40) return 'text-yellow-600 dark:text-yellow-500'
  return 'text-red-600 dark:text-red-400'
}

export function StudentDashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState('overview')
  const [day, setDay] = useState('Monday')

  const avg = Math.round(GRADES.reduce((s, g) => s + g.score, 0) / GRADES.length)
  const pending = HOMEWORK.filter(h => h.status === 'pending').length

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome, {user?.name}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Grade 5 Gold · Term 2, 2026</p>
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

      {/* ── OVERVIEW ── */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Class Average', value: `${avg}%`, sub: 'Term 2 2026', color: 'text-green-600 dark:text-green-400' },
              { label: 'Pending Homework', value: String(pending), sub: `${HOMEWORK.length - pending} done`, color: 'text-yellow-600 dark:text-yellow-500' },
              { label: 'Attendance Rate', value: '94%', sub: '56 of 60 days', color: 'text-blue-600 dark:text-blue-400' },
              { label: 'Notices Unread', value: '3', sub: 'tap Notices tab', color: 'text-purple-600 dark:text-purple-400' },
            ].map(c => (
              <GlassCard key={c.label} className="p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{c.label}</p>
                <p className={`mt-1 text-3xl font-bold ${c.color}`}>{c.value}</p>
                <p className="mt-1 text-xs text-gray-400">{c.sub}</p>
              </GlassCard>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <GlassCard className="p-6">
              <h2 className="mb-4 font-bold text-gray-900 dark:text-white">My Grades — Term 2</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={GRADES} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis dataKey="subject" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={40} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={((v: number) => [`${v}%`, 'Score']) as any} />
                  <Bar dataKey="score" fill="#15803d" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>

            <GlassCard className="p-6">
              <h2 className="mb-4 font-bold text-gray-900 dark:text-white">Upcoming Homework</h2>
              <div className="space-y-3">
                {HOMEWORK.filter(h => h.status === 'pending').slice(0, 4).map(hw => (
                  <div key={hw.id} className="flex items-start gap-3 rounded-xl bg-gray-50 dark:bg-gray-800 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-gold/10 dark:text-gold">
                      <ClipboardList className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{hw.title}</p>
                      <p className="text-xs text-gray-400">{hw.subject} · Due {hw.due}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          <GlassCard className="p-6">
            <h2 className="mb-3 font-bold text-gray-900 dark:text-white">Today's Schedule — {DAYS[new Date().getDay() === 0 ? 0 : new Date().getDay() - 1] ?? 'Monday'}</h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {(TIMETABLE[DAYS[Math.max(0, new Date().getDay() - 1)]] ?? TIMETABLE['Monday']).map((p, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-700 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-gold/10 dark:text-gold text-xs font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{p.subject}</p>
                    <p className="text-xs text-gray-400">{p.time} · {p.room}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* ── GRADES ── */}
      {tab === 'grades' && (
        <div className="space-y-6">
          <GlassCard className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 dark:text-white">Grade Report — Term 2 2026</h2>
              <span className="rounded-full bg-green-50 dark:bg-green-900/30 px-3 py-1 text-sm font-semibold text-green-700 dark:text-green-400">
                Average: {avg}%
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    {['Subject', 'Score', 'Grade', 'Remarks'].map(h => (
                      <th key={h} className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {GRADES.map(g => (
                    <tr key={g.subject} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3.5 font-medium text-gray-900 dark:text-white">{g.subject}</td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-24 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700 h-2">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${g.score}%` }} />
                          </div>
                          <span className={`font-bold ${gradeColor(g.score)}`}>{g.score}%</span>
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${gradeColor(g.score)}`}>{g.grade}</span>
                      </td>
                      <td className="py-3.5 text-gray-400 text-xs">
                        {g.score >= 90 ? 'Excellent — keep it up!' : g.score >= 75 ? 'Good performance' : g.score >= 60 ? 'Satisfactory' : 'Needs improvement'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
          <GlassCard className="p-6">
            <h2 className="mb-4 font-bold text-gray-900 dark:text-white">Performance Chart</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={GRADES} margin={{ top: 0, right: 0, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="subject" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={50} />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={((v: number) => [`${v}%`, 'Score']) as any} />
                <Bar dataKey="score" fill="#15803d" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>
      )}

      {/* ── HOMEWORK ── */}
      {tab === 'homework' && (
        <div className="space-y-4">
          <div className="flex gap-3">
            {['All', 'pending', 'submitted', 'graded'].map(s => (
              <button key={s} className="rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs font-medium capitalize hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                {s === 'All' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)} {s !== 'All' && `(${HOMEWORK.filter(h => h.status === s).length})`}
              </button>
            ))}
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
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${CAT_STYLES[a.category]}`}>{a.category}</span>
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
