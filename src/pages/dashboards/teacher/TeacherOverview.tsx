import { Link } from 'react-router-dom'
import {
  Users, ClipboardCheck, BookOpen, Bell,
  ChevronRight, CalendarDays, MapPin, TrendingUp,
} from 'lucide-react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { useAuth } from '../../../contexts/AuthContext'
import { useTeacherProfile, useTeacherClasses, useTeacherTimetable, useTeacherAnnouncements } from '../../../hooks/useTeacherData'

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'] as const

export function TeacherOverview() {
  const { user }             = useAuth()
  const { data: staff }      = useTeacherProfile()
  const { data: classes }    = useTeacherClasses(staff?.id)
  const { data: timetable }  = useTeacherTimetable(staff?.id)
  const { data: notices }    = useTeacherAnnouncements()

  const todayName = DAYS[new Date().getDay()]
  const todaySlots = timetable?.[todayName] ?? []
  const totalStudents = (classes ?? []).reduce((s, c) => s + (c.studentCount ?? 0), 0)
  const recentNotices = (notices ?? []).slice(0, 3)

  const staffName = staff ? `${staff.firstName} ${staff.lastName}` : user?.name ?? 'Teacher'
  const deptLabel = staff?.department ?? 'Sciences'
  const qualification = staff?.qualification ?? ''

  const stats = [
    { label:'My Classes',      value: String((classes ?? []).length), sub:'Active this term',       icon:<BookOpen className="h-5 w-5"/>,       color:'from-blue-500 to-blue-600'     },
    { label:'Total Students',  value: String(totalStudents),          sub:'Across all classes',     icon:<Users className="h-5 w-5"/>,          color:'from-green-500 to-emerald-600'  },
    { label:'Today\'s Lessons',value: String(todaySlots.length),      sub:`${todayName} schedule`,  icon:<CalendarDays className="h-5 w-5"/>,   color:'from-purple-500 to-violet-600'  },
    { label:'Notices',         value: String(recentNotices.length),   sub:'Unread announcements',   icon:<Bell className="h-5 w-5"/>,           color:'from-amber-500 to-orange-500'   },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">

      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-white shadow-lg">
        <p className="text-blue-200 text-sm mb-1">Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}</p>
        <h1 className="text-3xl font-extrabold">{staffName}</h1>
        <p className="mt-1 text-blue-100 text-sm">
          {deptLabel} · {qualification && `${qualification} · `}Staff No: {staff?.staffNo ?? '—'}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { label:'My Gradebook',  path:'/dashboard/teacher/gradebook' },
            { label:'Attendance',    path:'/dashboard/teacher/attendance' },
            { label:'My Class',      path:'/dashboard/teacher/myclass'   },
          ].map(l => (
            <Link key={l.label} to={l.path}
              className="rounded-xl bg-white/20 hover:bg-white/30 px-3 py-1.5 text-xs font-semibold text-white transition">
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(s => (
          <GlassCard key={s.label} className="relative overflow-hidden p-5">
            <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-5`} />
            <div className="text-gray-500 dark:text-gray-400 mb-1">{s.icon}</div>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            <p className="text-xs text-gray-400">{s.sub}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* My Classes */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 dark:text-white">My Classes</h2>
            <Link to="/dashboard/teacher/myclass" className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-0.5 hover:underline">
              Manage <ChevronRight className="h-3 w-3"/>
            </Link>
          </div>
          {(classes ?? []).length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No classes assigned</p>
          ) : (classes ?? []).map(c => (
            <div key={c.id} className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-gray-800/60 p-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{c.grade} {c.stream}</p>
                  <p className="text-xs text-gray-400">{c.studentCount} students</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link to="/dashboard/teacher/gradebook"
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition">
                  Grades
                </Link>
                <Link to="/dashboard/teacher/attendance"
                  className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                  Attendance
                </Link>
              </div>
            </div>
          ))}
        </GlassCard>

        {/* Today's Timetable */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <h2 className="font-bold text-gray-900 dark:text-white">Today — {todayName}</h2>
          </div>
          {todaySlots.length === 0 ? (
            <div className="text-center py-8">
              <CalendarDays className="mx-auto h-12 w-12 text-gray-200 dark:text-gray-700 mb-3" />
              <p className="text-gray-400 text-sm">No lessons scheduled today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaySlots.map((slot, i) => (
                <div key={slot.id} className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{slot.subjectName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{slot.className}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{slot.startTime}–{slot.endTime}</p>
                    <div className="flex items-center gap-1 justify-end text-xs text-gray-400">
                      <MapPin className="h-3 w-3"/>{slot.room}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      {/* Notices */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="h-4 w-4 text-amber-500" /> Announcements
          </h2>
          <Link to="/dashboard/teacher/notices" className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-0.5 hover:underline">
            All <ChevronRight className="h-3 w-3"/>
          </Link>
        </div>
        {recentNotices.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">No announcements at this time</p>
        ) : (
          <div className="space-y-3">
            {recentNotices.map(n => (
              <div key={n.id} className={`rounded-xl p-4 ${n.priority === 'urgent' ? 'bg-red-50 dark:bg-red-900/20' : n.priority === 'high' ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
                <div className="flex items-start gap-2">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.priority === 'urgent' ? 'bg-red-500' : n.priority === 'high' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{n.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{n.body}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(n.publishAt).toLocaleDateString('en-KE', { day:'numeric', month:'short', year:'numeric' })}</p>
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
