import { Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line,
} from 'recharts'
import { ClipboardList, TrendingUp, CheckCircle2, Bell, ChevronRight, BookOpen, CalendarDays, FileText } from 'lucide-react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { useAuth } from '../../../contexts/AuthContext'
import { useStudentProfile, useStudentGradesHistory, useStudentHomework, useStudentAttendance, useStudentAnnouncements } from '../../../hooks/useStudentData'

const SUBJECT_COLORS = ['#15803d','#2563eb','#7c3aed','#d97706','#dc2626','#0891b2','#be185d','#4f46e5']

export function StudentOverview() {
  const { user } = useAuth()
  const { data: profile }      = useStudentProfile()
  const { data: gradesHistory } = useStudentGradesHistory()
  const { data: homework }      = useStudentHomework()
  const { data: attendance }    = useStudentAttendance()
  const { data: notices }       = useStudentAnnouncements()

  const student   = profile?.student
  const classInfo = profile?.classInfo

  // Current term grades (2026 T2)
  const currentYear = gradesHistory?.find(y => y.isCurrent)
  const currentTerm = currentYear?.terms.find(t => t.isCurrent)
  const currentGrades = currentTerm?.grades ?? []
  const finishedGrades = currentGrades.filter(g => g.total !== null)
  const avg = finishedGrades.length
    ? Math.round(finishedGrades.reduce((s, g) => s + (g.total ?? 0), 0) / finishedGrades.length)
    : currentGrades.length
    ? Math.round(currentGrades.reduce((s, g) => s + ((g.cat1 ?? 0) * 0.5 + (g.cat2 ?? 0) * 0.5), 0) / currentGrades.length)
    : 0

  // Trend data — average per term across history
  const trendData = gradesHistory?.flatMap(y =>
    y.terms.map(t => ({
      label: `${t.termLabel.replace('Term ', 'T')} ${y.yearLabel}`,
      avg: t.average ?? 0,
    }))
  ).filter(d => d.avg > 0) ?? []

  const pendingHw  = (homework ?? []).filter(h => h.status === 'active').length
  const recentHw   = (homework ?? []).filter(h => h.status === 'active').slice(0, 4)
  const unreadNotes = (notices ?? []).slice(0, 3)

  // Bar chart data for current term
  const barData = currentGrades.slice(0, 8).map((g, i) => ({
    subject: (g.subjectName ?? '').split(' ')[0].slice(0, 5),
    score: g.total ?? Math.round(((g.cat1 ?? 0) + (g.cat2 ?? 0)) / 2),
    color: SUBJECT_COLORS[i % SUBJECT_COLORS.length],
  }))

  const firstName = student?.firstName ?? user?.name?.split(' ')[0] ?? 'Student'
  const gradeLabel = classInfo ? `${classInfo.grade} ${classInfo.stream}` : 'Grade 4A'

  const stats = [
    { label: 'Term Average',    value: avg ? `${avg}%` : '—',          sub: 'Current term',              color: 'from-green-500 to-emerald-600' },
    { label: 'Attendance Rate', value: attendance ? `${attendance.percent}%` : '—', sub: `${attendance?.present ?? 0} of ${attendance?.total ?? 0} days`, color: 'from-blue-500 to-blue-600' },
    { label: 'Pending Tasks',   value: String(pendingHw),               sub: `${homework?.filter(h=>h.status==='closed').length ?? 0} completed`, color: 'from-amber-500 to-orange-500' },
    { label: 'Notices',         value: String(unreadNotes.length),      sub: 'New announcements',         color: 'from-violet-500 to-purple-600' },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">

      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-green-700 to-emerald-600 p-6 text-white shadow-lg">
        <p className="text-green-200 text-sm font-medium mb-1">Welcome back</p>
        <h1 className="text-3xl font-extrabold">{firstName} {student?.lastName ?? ''}</h1>
        <p className="mt-1 text-green-100 text-sm">{gradeLabel} · Term 2, 2026 · Adm No: {student?.admNo ?? '—'}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {[
            { label: 'My Grades',   icon: BookOpen,      path: '/dashboard/student/grades'      },
            { label: 'Report Card', icon: FileText,       path: '/dashboard/student/report-card' },
            { label: 'Timetable',   icon: CalendarDays,   path: '/dashboard/student/timetable'   },
          ].map(link => (
            <Link key={link.label} to={link.path}
              className="flex items-center gap-1.5 rounded-xl bg-white/20 hover:bg-white/30 px-3 py-1.5 text-xs font-semibold text-white transition">
              <link.icon className="h-3.5 w-3.5" />
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(s => (
          <GlassCard key={s.label} className="relative overflow-hidden p-5">
            <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-5`} />
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{s.label}</p>
            <p className="mt-1 text-3xl font-extrabold text-gray-900 dark:text-white">{s.value}</p>
            <p className="mt-1 text-xs text-gray-400">{s.sub}</p>
          </GlassCard>
        ))}
      </div>

      {/* Main 2-col grid */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Grades bar chart */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 dark:text-white">Current Term Performance</h2>
            <Link to="/dashboard/student/grades" className="text-xs text-green-600 dark:text-green-400 flex items-center gap-0.5 hover:underline">
              Full grades <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="subject" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`${v}%`, 'Score']} />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {barData.map((_, i) => (
                    <rect key={i} fill={SUBJECT_COLORS[i % SUBJECT_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">Grades loading…</div>
          )}
        </GlassCard>

        {/* Performance trend */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Performance Trend
            </h2>
            <span className="text-xs text-gray-400">All terms</span>
          </div>
          {trendData.length > 1 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData} margin={{ top: 5, right: 5, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="label" tick={{ fontSize: 9 }} angle={-25} textAnchor="end" height={40} interval={0} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`${v}%`, 'Average']} />
                <Line type="monotone" dataKey="avg" stroke="#15803d" strokeWidth={2.5} dot={{ r: 4, fill: '#15803d' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">Building trend data…</div>
          )}
        </GlassCard>
      </div>

      {/* Bottom 2-col */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Upcoming homework */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 dark:text-white">Active Homework</h2>
            <Link to="/dashboard/student/homework" className="text-xs text-green-600 dark:text-green-400 flex items-center gap-0.5 hover:underline">
              All tasks <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          {recentHw.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <CheckCircle2 className="h-10 w-10 mb-2 text-green-500 opacity-60" />
              <p className="text-sm">All caught up!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentHw.map(hw => {
                const due = new Date(hw.dueDate)
                const days = Math.ceil((due.getTime() - Date.now()) / 86400000)
                const urgent = days <= 1
                return (
                  <div key={hw.id} className="flex items-start gap-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 p-3">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold
                      ${urgent ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                      <ClipboardList className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{hw.title}</p>
                      <p className={`text-xs mt-0.5 ${urgent ? 'text-red-500' : 'text-gray-400'}`}>
                        {hw.subjectName} · Due {new Date(hw.dueDate).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}
                        {days <= 3 ? ` · ${days <= 0 ? 'Overdue' : `${days}d left`}` : ''}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </GlassCard>

        {/* Announcements */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Bell className="h-4 w-4 text-violet-500" />
              Latest Notices
            </h2>
            <Link to="/dashboard/student/notices" className="text-xs text-green-600 dark:text-green-400 flex items-center gap-0.5 hover:underline">
              All <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          {unreadNotes.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">No announcements</p>
          ) : (
            <div className="space-y-3">
              {unreadNotes.map(n => (
                <div key={n.id} className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-3">
                  <div className="flex items-start gap-2">
                    <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${n.priority === 'urgent' ? 'bg-red-500' : n.priority === 'high' ? 'bg-amber-500' : 'bg-green-500'}`} />
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
