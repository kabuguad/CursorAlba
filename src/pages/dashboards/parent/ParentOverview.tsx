import { Link } from 'react-router-dom'
import {
  CalendarDays, Banknote, ClipboardList, Bell, GraduationCap,
  ChevronRight, BookOpen, UserCheck, TrendingUp, FileText,
} from 'lucide-react'
import { GlassCard } from '../../../components/ui/GlassCard'
import {
  useParentStudentProfile, useParentGradesHistory,
  useParentAttendance, useParentHomework, useParentAnnouncements, useParentInvoice,
} from '../../../hooks/useParentData'
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'

export function ParentOverview() {
  const { data: profile }   = useParentStudentProfile()
  const { data: history }   = useParentGradesHistory()
  const { data: attendance } = useParentAttendance()
  const { data: homework }  = useParentHomework()
  const { data: notices }   = useParentAnnouncements()
  const { data: invoice }   = useParentInvoice()

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

  const pendingHw = (homework ?? []).filter(h => h.status === 'active').length
  const recentNotices = (notices ?? []).slice(0, 3)
  const balanceDue = invoice ? invoice.total - invoice.paid : null

  const quickLinks = [
    { label: 'Academic Report', icon: FileText,    path: '/dashboard/parent/report-cards' },
    { label: 'Attendance',      icon: UserCheck,   path: '/dashboard/parent/attendance'   },
    { label: 'Homework',        icon: ClipboardList, path: '/dashboard/parent/homework'   },
    { label: 'Fee Statement',   icon: Banknote,    path: '/dashboard/parent/fees'         },
    { label: 'Timetable',       icon: CalendarDays, path: '/dashboard/parent/timetable'   },
    { label: 'Notices',         icon: Bell,        path: '/dashboard/parent/notices'      },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">

      {/* Student banner */}
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
          {quickLinks.slice(0,4).map(l => (
            <Link key={l.label} to={l.path}
              className="rounded-xl bg-white/20 hover:bg-white/30 px-3 py-1.5 text-xs font-semibold text-white transition flex items-center gap-1">
              <l.icon className="h-3 w-3" />{l.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label:'Term Average', value: avg !== null ? `${avg}%` : '—', sub:'Current term', color:'from-green-500 to-emerald-600', link:'/dashboard/parent/grades' },
          { label:'Attendance',   value: attendance ? `${attendance.percent}%` : '—', sub:`${attendance?.present ?? 0} / ${attendance?.total ?? 0} days`, color:'from-blue-500 to-blue-600', link:'/dashboard/parent/attendance' },
          { label:'Pending Tasks', value: String(pendingHw), sub:'Active homework', color:'from-amber-500 to-orange-500', link:'/dashboard/parent/homework' },
          { label:'Fees Balance',  value: balanceDue !== null ? (balanceDue <= 0 ? 'Paid' : `KES ${balanceDue.toLocaleString()}`) : '—',
            sub: balanceDue !== null && balanceDue <= 0 ? 'No balance due' : 'Outstanding',
            color: balanceDue !== null && balanceDue <= 0 ? 'from-green-500 to-emerald-600' : 'from-red-500 to-rose-600',
            link:'/dashboard/parent/fees' },
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

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Performance trend */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" /> Academic Trend
            </h2>
            <Link to="/dashboard/parent/grades" className="text-xs text-violet-600 dark:text-violet-400 flex items-center gap-0.5 hover:underline">
              Full grades <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          {trendData.length > 1 ? (
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={trendData} margin={{ left: -30, right: 10, top: 5, bottom: 5 }}>
                <Tooltip formatter={(v: number) => [`${v}%`, 'Average']} />
                <Line type="monotone" dataKey="avg" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 4, fill: '#7c3aed' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-400 text-sm">Building trend data…</div>
          )}
          {avg !== null && (
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Current term average</span>
              <span className={`font-bold ${avg >= 70 ? 'text-green-700 dark:text-green-400' : avg >= 50 ? 'text-amber-600' : 'text-red-500'}`}>{avg}%</span>
            </div>
          )}
        </GlassCard>

        {/* Quick links */}
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
      </div>

      {/* Recent notices */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="h-4 w-4 text-violet-500" /> Latest Notices
          </h2>
          <Link to="/dashboard/parent/notices" className="text-xs text-violet-600 dark:text-violet-400 flex items-center gap-0.5 hover:underline">
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
  )
}
