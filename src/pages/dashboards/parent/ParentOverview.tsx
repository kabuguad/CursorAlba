import { Link } from 'react-router-dom'
import {
  CalendarDays, Banknote, ClipboardList, Bell,
  ChevronRight, BookOpen, UserCheck, TrendingUp, FileText,
  MapPin, AlertTriangle, Clock, CheckCircle2, BookMarked,
} from 'lucide-react'
import { GlassCard } from '../../../components/ui/GlassCard'
import {
  useParentStudentProfile, useParentGradesHistory,
  useParentAttendance, useParentHomework, useParentAnnouncements,
  useParentInvoice, useParentTimetable,
} from '../../../hooks/useParentData'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Cell,
  ResponsiveContainer, Tooltip,
} from 'recharts'

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday'] as const
const PERIOD_COLORS = ['bg-blue-500','bg-green-600','bg-purple-600','bg-amber-500','bg-rose-500']

const SUBJ_COLORS: Record<string, string> = {
  Mathematics:           'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'English Language':    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  Kiswahili:             'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'Science & Technology':'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
}

function gradeColor(score: number) {
  if (score >= 75) return '#16a34a'
  if (score >= 50) return '#d97706'
  return '#dc2626'
}

export function ParentOverview() {
  const { data: profile }    = useParentStudentProfile()
  const { data: history }    = useParentGradesHistory()
  const { data: attendance } = useParentAttendance()
  const { data: homework }   = useParentHomework()
  const { data: notices }    = useParentAnnouncements()
  const { data: invoice }    = useParentInvoice()
  const { data: timetable }  = useParentTimetable()

  const student   = profile?.student
  const classInfo = profile?.classInfo

  const currentYear   = history?.find(y => y.isCurrent)
  const currentTerm   = currentYear?.terms.find(t => t.isCurrent)
  const currentGrades = currentTerm?.grades.filter(g => g.total !== null) ?? []
  const avg = currentGrades.length
    ? Math.round(currentGrades.reduce((s, g) => s + (g.total ?? 0), 0) / currentGrades.length)
    : null

  const trendData = (history ?? []).flatMap(y =>
    y.terms.map(t => ({ label: `T${t.termLabel.match(/\d/)?.[0]} ${y.yearLabel}`, avg: t.average ?? 0 }))
  ).filter(d => d.avg > 0).slice(-6)

  const subjectBarData = currentGrades.map(g => ({
    name: g.subjectName.length > 10 ? g.subjectName.slice(0, 9) + '…' : g.subjectName,
    full: g.subjectName,
    score: g.total ?? 0,
  }))

  const activeHw   = (homework ?? []).filter(h => h.status === 'active').slice(0, 4)
  const recentNotices = (notices ?? []).slice(0, 3)
  const balanceDue = invoice ? invoice.total - invoice.paid : null

  const todayName  = DAYS[Math.max(0, new Date().getDay() - 1)] ?? 'Monday'
  const todaySlots = timetable?.[todayName] ?? []

  const quickLinks = [
    { label: 'Academic Report', icon: FileText,      path: '/dashboard/parent/report-cards' },
    { label: 'Attendance',      icon: UserCheck,     path: '/dashboard/parent/attendance'   },
    { label: 'Homework',        icon: ClipboardList, path: '/dashboard/parent/homework'     },
    { label: 'Fee Statement',   icon: Banknote,      path: '/dashboard/parent/fees'         },
    { label: 'Timetable',       icon: CalendarDays,  path: '/dashboard/parent/timetable'    },
    { label: 'Notices',         icon: Bell,          path: '/dashboard/parent/notices'      },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">

      {/* ── Student banner ── */}
      <div className="rounded-2xl bg-gradient-to-r from-violet-700 to-purple-700 p-6 text-white shadow-lg">
        <p className="text-violet-200 text-sm mb-1">Your child</p>
        <h1 className="text-3xl font-extrabold">
          {student ? `${student.firstName} ${student.lastName}` : '—'}
        </h1>
        <p className="text-violet-100 text-sm mt-1">
          {classInfo ? `${classInfo.grade} ${classInfo.stream}` : '—'}
          {student?.admNo ? ` · Adm No: ${student.admNo}` : ''}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {quickLinks.slice(0, 4).map(l => (
            <Link key={l.label} to={l.path}
              className="rounded-xl bg-white/20 hover:bg-white/30 px-3 py-1.5 text-xs font-semibold text-white transition flex items-center gap-1">
              <l.icon className="h-3 w-3" />{l.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Term Average',  value: avg !== null ? `${avg}%` : '—', sub: 'Current term', color: 'from-green-500 to-emerald-600', link: '/dashboard/parent/grades' },
          { label: 'Attendance',    value: attendance ? `${attendance.percent}%` : '—', sub: `${attendance?.present ?? 0} / ${attendance?.total ?? 0} days`, color: 'from-blue-500 to-blue-600', link: '/dashboard/parent/attendance' },
          { label: 'Pending Tasks', value: String(activeHw.length), sub: 'Active homework', color: 'from-amber-500 to-orange-500', link: '/dashboard/parent/homework' },
          {
            label: 'Fees Balance',
            value: balanceDue !== null ? (balanceDue <= 0 ? 'Paid' : `KES ${balanceDue.toLocaleString()}`) : '—',
            sub: balanceDue !== null && balanceDue <= 0 ? 'No balance due' : 'Outstanding',
            color: balanceDue !== null && balanceDue <= 0 ? 'from-green-500 to-emerald-600' : 'from-red-500 to-rose-600',
            link: '/dashboard/parent/fees',
          },
        ].map(s => (
          <Link key={s.label} to={s.link}>
            <GlassCard className="relative overflow-hidden p-5 hover:shadow-md transition-shadow">
              <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-5`} />
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{s.label}</p>
              <p className="mt-1 text-3xl font-extrabold text-gray-900 dark:text-white">{s.value}</p>
              <p className="mt-1 text-xs text-gray-400">{s.sub}</p>
            </GlassCard>
          </Link>
        ))}
      </div>

      {/* ── Today's Classes ── */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Today's Classes — {todayName}
          </h2>
          <Link to="/dashboard/parent/timetable"
            className="text-xs text-violet-600 dark:text-violet-400 flex items-center gap-0.5 hover:underline">
            Full timetable <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        {todaySlots.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">No classes scheduled today</p>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {todaySlots.map((slot, i) => (
              <div key={slot.id}
                className={`shrink-0 rounded-2xl text-white p-4 w-44 ${PERIOD_COLORS[i % PERIOD_COLORS.length]}`}>
                <p className="text-xs font-semibold opacity-80">{slot.startTime}–{slot.endTime}</p>
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

      {/* ── Charts row ── */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Academic Trend */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" /> Academic Trend
            </h2>
            <Link to="/dashboard/parent/grades"
              className="text-xs text-violet-600 dark:text-violet-400 flex items-center gap-0.5 hover:underline">
              Full grades <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          {trendData.length > 1 ? (
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={trendData} margin={{ left: -30, right: 10, top: 5, bottom: 5 }}>
                <Tooltip formatter={(v: number) => [`${v}%`, 'Average']} />
                <Line type="monotone" dataKey="avg" stroke="#7c3aed" strokeWidth={2.5}
                  dot={{ r: 4, fill: '#7c3aed' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-36 flex items-center justify-center text-gray-400 text-sm">Building trend data…</div>
          )}
          {avg !== null && (
            <div className="mt-3 flex items-center justify-between text-sm border-t border-gray-100 dark:border-gray-700 pt-3">
              <span className="text-gray-500 dark:text-gray-400">Current term average</span>
              <span className={`font-bold ${avg >= 70 ? 'text-green-700 dark:text-green-400' : avg >= 50 ? 'text-amber-600' : 'text-red-500'}`}>{avg}%</span>
            </div>
          )}
        </GlassCard>

        {/* Subject Scores */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BookMarked className="h-4 w-4 text-violet-600" /> Subject Performance
            </h2>
            <Link to="/dashboard/parent/grades"
              className="text-xs text-violet-600 dark:text-violet-400 flex items-center gap-0.5 hover:underline">
              Details <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          {subjectBarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={subjectBarData} margin={{ left: -30, right: 5, top: 5, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number, _: string, props: { payload?: { full?: string } }) => [`${v}%`, props.payload?.full ?? '']} />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {subjectBarData.map((entry, i) => (
                    <Cell key={i} fill={gradeColor(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-36 flex items-center justify-center text-gray-400 text-sm">No grade data yet</div>
          )}
        </GlassCard>
      </div>

      {/* ── Active Homework ── */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-amber-500" /> Active Homework
          </h2>
          <Link to="/dashboard/parent/homework"
            className="text-xs text-violet-600 dark:text-violet-400 flex items-center gap-0.5 hover:underline">
            All tasks <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {activeHw.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
            <CheckCircle2 className="h-10 w-10 text-green-500 opacity-40" />
            <p className="text-sm text-gray-400">All caught up — no active homework!</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {activeHw.map(hw => {
              const due      = new Date(hw.dueDate)
              const daysLeft = Math.ceil((due.getTime() - Date.now()) / 86400000)
              const overdue  = daysLeft < 0
              const urgent   = daysLeft <= 1 && daysLeft >= 0
              const badgeClr = SUBJ_COLORS[hw.subjectName ?? ''] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'

              return (
                <div key={hw.id}
                  className={`rounded-xl border p-4 transition ${overdue ? 'border-red-200 bg-red-50 dark:border-red-800/40 dark:bg-red-950/20' : urgent ? 'border-amber-200 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-950/20' : 'border-gray-100 bg-gray-50 dark:border-gray-700/50 dark:bg-gray-800/40'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-xs font-semibold rounded-lg px-2 py-0.5 ${badgeClr}`}>
                      {hw.subjectName}
                    </span>
                    {overdue ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400 shrink-0">
                        <AlertTriangle className="h-3 w-3" /> Overdue
                      </span>
                    ) : urgent ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 shrink-0">
                        <Clock className="h-3 w-3" /> Due soon
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">{hw.title}</p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                    <BookOpen className="h-3 w-3" />
                    Due {due.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    {daysLeft >= 0 ? ` · ${daysLeft}d left` : ` · ${Math.abs(daysLeft)}d ago`}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </GlassCard>

      {/* ── Bottom row: Quick links + Latest Notices ── */}
      <div className="grid gap-6 lg:grid-cols-2">

        <GlassCard className="p-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map(l => (
              <Link key={l.label} to={l.path}
                className="flex items-center gap-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 p-3 hover:bg-gray-100 dark:hover:bg-gray-700/60 transition">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
                  <l.icon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{l.label}</span>
              </Link>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Bell className="h-4 w-4 text-violet-500" /> Latest Notices
            </h2>
            <Link to="/dashboard/parent/notices"
              className="text-xs text-violet-600 dark:text-violet-400 flex items-center gap-0.5 hover:underline">
              All <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          {recentNotices.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No announcements</p>
          ) : (
            <div className="space-y-3">
              {recentNotices.map(n => (
                <div key={n.id} className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-3">
                  <div className="flex items-start gap-2">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.priority === 'urgent' ? 'bg-red-500' : n.priority === 'high' ? 'bg-amber-500' : 'bg-violet-500'}`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{n.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{n.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

    </div>
  )
}
