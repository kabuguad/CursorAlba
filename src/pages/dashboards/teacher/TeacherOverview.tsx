import { Link } from 'react-router-dom'
import {
  Users, ClipboardCheck, BookOpen, MessageSquare,
  AlertTriangle, Clock, TrendingUp, Bell, CheckCircle2,
  ChevronRight, CalendarDays, FileText, BarChart2,
} from 'lucide-react'
import { GlassCard } from '../../../components/ui/GlassCard'

const TODAY = 'Monday'

const TODAY_TIMETABLE = [
  { period: 1, time: '8:00 – 8:40',  subject: 'Mathematics',    class_: 'Grade 5 Gold',   room: 'A12', done: true  },
  { period: 2, time: '8:40 – 9:20',  subject: 'Mathematics',    class_: 'Grade 6 Silver', room: 'B04', done: true  },
  { period: 3, time: '9:20 – 10:00', subject: 'Mathematics',    class_: 'Grade 5 Blue',   room: 'A12', done: false, now: true },
  { period: 4, time: '10:00 – 10:20', subject: 'Break',         class_: '',               room: '',    done: false, isBreak: true },
  { period: 5, time: '10:20 – 11:00', subject: 'Mathematics',   class_: 'Grade 4 Red',    room: 'C07', done: false },
  { period: 6, time: '11:00 – 11:40', subject: 'Free Period',   class_: '',               room: '',    done: false, isFree: true },
  { period: 7, time: '11:40 – 12:20', subject: 'Mathematics',   class_: 'Grade 5 Gold',   room: 'A12', done: false },
  { period: 8, time: '12:20 – 1:00',  subject: 'Lunch',         class_: '',               room: '',    done: false, isBreak: true },
  { period: 9, time: '1:00 – 1:40',   subject: 'Mathematics',   class_: 'Grade 6 Silver', room: 'B04', done: false },
]

const AT_RISK = [
  { id: 's1', name: 'Kevin Mwangi',    class_: 'Grade 5 Gold',   issue: 'Avg 34% — below pass mark',   type: 'grades'     },
  { id: 's2', name: 'Amina Said',      class_: 'Grade 6 Silver', issue: 'Attendance 61% this term',    type: 'attendance' },
  { id: 's3', name: 'Brian Otieno',    class_: 'Grade 5 Blue',   issue: 'Avg 38% — 3 assignments missing', type: 'grades' },
  { id: 's4', name: 'Fatuma Hassan',   class_: 'Grade 4 Red',    issue: 'Absent 5 consecutive days',   type: 'attendance' },
]

const PENDING_TASKS = [
  { id: 1, label: 'Mark CAT 2 — Grade 5 Gold',             due: 'Today',      link: '/dashboard/teacher/gradebook'   },
  { id: 2, label: 'Grade "Fractions Worksheet" submissions', due: 'Tomorrow',   link: '/dashboard/teacher/assignments' },
  { id: 3, label: 'Attendance not taken — Grade 4 Red',    due: 'Today',      link: '/dashboard/teacher/attendance'  },
  { id: 4, label: 'Submit Term 2 Scheme of Work',          due: 'Fri 31 May', link: '/dashboard/teacher/lesson-plans'},
]

const RECENT_MESSAGES = [
  { id: 1, from: 'Mrs. Grace Mwangi',  re: 'Kevin Mwangi',   preview: "Good afternoon, I wanted to ask about Kevin's performance…", time: '9:14 AM', unread: true  },
  { id: 2, from: 'Mr. James Otieno',   re: 'Brian Otieno',   preview: "Thank you for the update on Brian's homework…",               time: 'Yesterday', unread: false },
  { id: 3, from: 'Admin Office',       re: 'Staff Meeting',  preview: 'Reminder: Staff meeting this Friday at 4 PM in the staffroom', time: 'Yesterday', unread: true  },
]

const STATS = [
  { label: 'Total Students',  value: '148', sub: 'across 5 classes',      icon: Users,         color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { label: 'Avg Attendance',  value: '87%', sub: 'this term',             icon: CalendarDays,  color: 'text-blue-600 dark:text-blue-400',     bg: 'bg-blue-50 dark:bg-blue-900/20'   },
  { label: 'To Grade',        value: '3',   sub: 'assignments pending',   icon: ClipboardCheck,color: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { label: 'Unread Messages', value: '5',   sub: 'from parents & admin',  icon: MessageSquare, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20'},
]

const QUICK_ACTIONS = [
  { label: 'Take Attendance',   icon: ClipboardCheck, to: '/dashboard/teacher/attendance',   color: 'bg-emerald-500 hover:bg-emerald-600' },
  { label: 'Enter Grades',      icon: TrendingUp,     to: '/dashboard/teacher/gradebook',    color: 'bg-blue-500 hover:bg-blue-600'     },
  { label: 'Post Assignment',   icon: BookOpen,       to: '/dashboard/teacher/assignments',  color: 'bg-amber-500 hover:bg-amber-600'   },
  { label: 'Message Parent',    icon: MessageSquare,  to: '/dashboard/teacher/messages',     color: 'bg-violet-500 hover:bg-violet-600' },
  { label: 'Lesson Plans',      icon: FileText,       to: '/dashboard/teacher/lesson-plans', color: 'bg-pink-500 hover:bg-pink-600'     },
  { label: 'View Reports',      icon: BarChart2,      to: '/dashboard/teacher/reports',      color: 'bg-teal-500 hover:bg-teal-600'     },
]

export function TeacherOverview() {
  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{greeting}, Mrs. Wanjiku</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {TODAY}, {now.toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })} · TSC No. KE-TSC-2847
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => (
          <GlassCard key={s.label} className="p-4">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${s.bg}`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{s.label}</p>
                <p className="text-xs text-gray-400">{s.sub}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* At-Risk Alert Banner */}
      {AT_RISK.length > 0 && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-700 dark:text-red-300">{AT_RISK.length} students need your attention</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {AT_RISK.map(s => (
                <span key={s.id} className="inline-flex items-center gap-1 text-xs bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-2 py-1 rounded-full">
                  {s.type === 'attendance' ? <CalendarDays className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                  {s.name}
                </span>
              ))}
            </div>
          </div>
          <Link to="/dashboard/teacher/reports" className="text-xs text-red-600 dark:text-red-400 font-medium hover:underline whitespace-nowrap">View all</Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Timetable */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" /> Today's Schedule
              </h2>
              <Link to="/dashboard/teacher/timetable" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
                Full timetable <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-1">
              {TODAY_TIMETABLE.map(p => (
                <div
                  key={p.period}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                    ${p.now    ? 'bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700' : ''}
                    ${p.done   ? 'opacity-40' : ''}
                    ${p.isBreak || p.isFree ? 'bg-gray-50 dark:bg-gray-800/40' : ''}
                  `}
                >
                  <span className="w-5 text-xs text-gray-400 text-right shrink-0">{p.period}</span>
                  <span className="w-28 text-xs text-gray-500 dark:text-gray-400 shrink-0">{p.time}</span>
                  <span className={`flex-1 font-medium ${p.isBreak ? 'text-gray-400 dark:text-gray-500 italic' : p.isFree ? 'text-gray-400 dark:text-gray-500 italic' : 'text-gray-800 dark:text-white'}`}>
                    {p.subject}
                  </span>
                  {p.class_ && <span className="text-xs text-gray-500 dark:text-gray-400">{p.class_}</span>}
                  {p.room    && <span className="text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded font-mono">{p.room}</span>}
                  {p.now     && <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-full animate-pulse">NOW</span>}
                  {p.done    && <CheckCircle2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Pending Tasks */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" /> Pending Tasks
              </h2>
              <span className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium">{PENDING_TASKS.length}</span>
            </div>
            <div className="space-y-2">
              {PENDING_TASKS.map(t => (
                <Link key={t.id} to={t.link} className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${t.due === 'Today' ? 'bg-red-500' : 'bg-amber-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 leading-snug">{t.label}</p>
                    <p className={`text-xs mt-0.5 ${t.due === 'Today' ? 'text-red-500 font-medium' : 'text-gray-400'}`}>Due: {t.due}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-emerald-600 shrink-0 mt-1" />
                </Link>
              ))}
            </div>
          </GlassCard>

          {/* Recent Messages */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-violet-500" /> Recent Messages
              </h2>
              <Link to="/dashboard/teacher/messages" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">View all</Link>
            </div>
            <div className="space-y-2">
              {RECENT_MESSAGES.map(m => (
                <Link key={m.id} to="/dashboard/teacher/messages" className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-xs font-bold text-violet-700 dark:text-violet-300 shrink-0">
                    {m.from.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm truncate ${m.unread ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{m.from}</p>
                      {m.unread && <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{m.preview}</p>
                    <p className="text-xs text-gray-400">{m.time}</p>
                  </div>
                </Link>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Quick Actions */}
      <GlassCard className="p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {QUICK_ACTIONS.map(a => (
            <Link key={a.label} to={a.to} className={`${a.color} text-white rounded-xl p-3 flex flex-col items-center gap-2 transition-colors text-center`}>
              <a.icon className="w-5 h-5" />
              <span className="text-xs font-medium leading-tight">{a.label}</span>
            </Link>
          ))}
        </div>
      </GlassCard>

      {/* At-Risk Students Detail */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" /> Students Needing Attention
          </h2>
          <Link to="/dashboard/teacher/reports" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">Full report</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Student</th>
                <th className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Class</th>
                <th className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Issue</th>
                <th className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {AT_RISK.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="py-2.5 font-medium text-gray-800 dark:text-white">{s.name}</td>
                  <td className="py-2.5 text-gray-600 dark:text-gray-400">{s.class_}</td>
                  <td className="py-2.5 text-gray-600 dark:text-gray-400">{s.issue}</td>
                  <td className="py-2.5">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${s.type === 'attendance' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
                      {s.type === 'attendance' ? <CalendarDays className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                      {s.type === 'attendance' ? 'Attendance' : 'Grades'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
