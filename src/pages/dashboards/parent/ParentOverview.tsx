import { Link } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { GlassCard } from '../../../components/ui/GlassCard'
import {
  CalendarDays, Banknote, ClipboardList, Bell, GraduationCap,
  Clock, MessageSquare, BookOpen, AlertCircle, CheckCircle2,
  ChevronRight, TrendingUp, TrendingDown, Minus, Bus, Activity,
} from 'lucide-react'
import { useFeeStatement } from '../../../hooks/useFees'
import { useAttendance } from '../../../hooks/useAttendance'
import { useStudentGrades } from '../../../hooks/useGrades'
import { formatKES } from '../../../lib/utils'

const LINKED_STUDENT_ID = 's-1'

const TODAY_SCHEDULE = [
  { time: '7:30–8:30',   subject: 'Mathematics', teacher: 'Mr. Ochieng',  done: true,    current: false },
  { time: '8:30–9:30',   subject: 'English',     teacher: 'Mrs. Wanjiku', done: true,    current: false },
  { time: '10:00–11:00', subject: 'Science',     teacher: 'Mr. Kamau',    done: false,   current: true  },
  { time: '11:00–12:00', subject: 'Kiswahili',   teacher: 'Ms. Akinyi',   done: false,   current: false },
  { time: '13:00–14:00', subject: 'PE',          teacher: 'Mr. Mutua',    done: false,   current: false },
]

const UPCOMING_EVENTS = [
  { id: 1, title: 'Sports Day — Inter-House',       date: '15 Jun 2026', type: 'Sports'   },
  { id: 2, title: 'Parent-Teacher Conference',      date: '22 Jun 2026', type: 'Meeting'  },
  { id: 3, title: 'Term 2 Fee Deadline',            date: '15 Jun 2026', type: 'Finance'  },
  { id: 4, title: 'Term 2 Exams Begin',             date: '27 Jul 2026', type: 'Academic' },
]

const PENDING_HW = [
  { id: 1, subject: 'English',        title: 'Essay: My Future Career',  due: '28 May', overdue: true  },
  { id: 2, subject: 'Mathematics',    title: 'Algebra Practice',          due: '30 May', overdue: false },
  { id: 3, subject: 'Social Studies', title: 'Map Reading Assignment',    due: '5 Jun',  overdue: false },
]

const RECENT_NOTICES = [
  { id: 1, title: 'Term 2 Examination Timetable Released', date: '26 May', category: 'Academic',      unread: true  },
  { id: 2, title: 'Drama Festival Rehearsals',             date: '24 May', category: 'Co-curricular', unread: true  },
  { id: 3, title: 'School Fees Reminder — Term 2',         date: '20 May', category: 'Finance',       unread: false },
]

const EVENT_COLORS: Record<string, string> = {
  Academic: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Sports:   'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  Meeting:  'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  Finance:  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
}

export function ParentOverview() {
  const { user } = useAuth()
  const { data: fees }       = useFeeStatement(LINKED_STUDENT_ID)
  const { data: attendance } = useAttendance(LINKED_STUDENT_ID, 2026, 2)
  const { data: grades }     = useStudentGrades(LINKED_STUDENT_ID)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const TrendIcon = grades?.trend === 'up' ? TrendingUp : grades?.trend === 'down' ? TrendingDown : Minus
  const trendColor = grades?.trend === 'up'
    ? 'text-green-600 dark:text-green-400'
    : grades?.trend === 'down' ? 'text-red-500' : 'text-gray-400'

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">

      {/* Welcome banner */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {greeting}, {user?.name?.split(' ')[0]}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monitoring{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-200">Amani Kariuki</span>
            {' '}· Grade 5 Gold · Term 2, 2026
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 text-xs font-semibold text-green-700 dark:text-green-400">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          Term 2 in progress
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            to: '/dashboard/parent/attendance',
            icon: CalendarDays,
            iconBg: 'bg-green-100 dark:bg-green-900/30',
            iconColor: 'text-green-700 dark:text-green-400',
            value: attendance ? `${attendance.percentage}%` : '—',
            label: 'Attendance Rate',
            sub: attendance ? `${attendance.presentCount} of ${attendance.presentCount + attendance.absentCount} days` : '—',
            subColor: 'text-gray-400 dark:text-gray-500',
          },
          {
            to: '/dashboard/parent/fees',
            icon: Banknote,
            iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
            iconColor: 'text-yellow-700 dark:text-yellow-400',
            value: fees ? formatKES(fees.balance) : '—',
            label: 'Outstanding Fees',
            sub: 'Due 15 Jun 2026',
            subColor: 'text-yellow-600 dark:text-yellow-400',
          },
          {
            to: '/dashboard/parent/homework',
            icon: ClipboardList,
            iconBg: 'bg-blue-100 dark:bg-blue-900/30',
            iconColor: 'text-blue-700 dark:text-blue-400',
            value: '3',
            label: 'Pending Homework',
            sub: '1 overdue',
            subColor: 'text-red-500',
          },
          {
            to: '/dashboard/parent/grades',
            icon: GraduationCap,
            iconBg: 'bg-purple-100 dark:bg-purple-900/30',
            iconColor: 'text-purple-700 dark:text-purple-400',
            value: grades ? `${grades.average}%` : '—',
            label: 'Average Grade',
            sub: 'Position: 4th of 32',
            subColor: 'text-gray-400 dark:text-gray-500',
            trend: <TrendIcon className={`h-4 w-4 ${trendColor}`} />,
          },
        ].map(card => (
          <Link key={card.to} to={card.to}>
            <GlassCard className="p-4 hover:shadow-md transition-shadow cursor-pointer group h-full">
              <div className="flex items-start justify-between mb-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.iconBg}`}>
                  <card.icon className={`h-[18px] w-[18px] ${card.iconColor}`} />
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 transition" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                {card.trend}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{card.label}</p>
              <p className={`text-[10px] mt-1 ${card.subColor}`}>{card.sub}</p>
            </GlassCard>
          </Link>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Today's classes — spans 2 cols */}
        <GlassCard className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              Today's Classes
            </h2>
            <Link to="/dashboard/parent/timetable" className="text-xs text-[#E8B84B] hover:underline font-medium">
              Full timetable →
            </Link>
          </div>
          <div className="space-y-1.5">
            {TODAY_SCHEDULE.map((cls, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${
                  cls.current
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : cls.done
                    ? 'bg-gray-50/50 dark:bg-gray-800/30 opacity-60'
                    : 'bg-gray-50 dark:bg-gray-800/50'
                }`}
              >
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                  cls.current ? 'bg-green-500 animate-pulse' : cls.done ? 'bg-gray-300' : 'bg-gray-300 dark:bg-gray-600'
                }`} />
                <span className="text-xs font-mono text-gray-400 dark:text-gray-500 w-24 shrink-0">{cls.time}</span>
                <span className={`font-semibold text-sm flex-1 ${cls.done ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                  {cls.subject}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">{cls.teacher}</span>
                {cls.current && (
                  <span className="text-[10px] font-bold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-full shrink-0">
                    NOW
                  </span>
                )}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Upcoming events */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-gray-400" />
              Upcoming
            </h2>
            <Link to="/dashboard/parent/calendar" className="text-xs text-[#E8B84B] hover:underline font-medium">
              Calendar →
            </Link>
          </div>
          <div className="space-y-3">
            {UPCOMING_EVENTS.map(ev => (
              <div key={ev.id} className="flex items-start gap-2.5">
                <span className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${EVENT_COLORS[ev.type] ?? ''}`}>
                  {ev.type}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-tight">{ev.title}</p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{ev.date}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Pending homework */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-gray-400" />
              Homework Due
            </h2>
            <Link to="/dashboard/parent/homework" className="text-xs text-[#E8B84B] hover:underline font-medium">
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {PENDING_HW.map(hw => (
              <div
                key={hw.id}
                className={`flex items-start gap-2.5 rounded-xl px-3 py-2.5 ${
                  hw.overdue ? 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40' : 'bg-gray-50 dark:bg-gray-800/50'
                }`}
              >
                {hw.overdue
                  ? <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                  : <CheckCircle2 className="h-4 w-4 shrink-0 text-gray-300 dark:text-gray-600 mt-0.5" />
                }
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{hw.title}</p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">{hw.subject} · Due {hw.due}</p>
                </div>
                {hw.overdue && <span className="shrink-0 text-[10px] font-bold text-red-600 dark:text-red-400">OVERDUE</span>}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Recent notices */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Bell className="h-4 w-4 text-gray-400" />
              Notices
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">2</span>
            </h2>
            <Link to="/dashboard/parent/notices" className="text-xs text-[#E8B84B] hover:underline font-medium">
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {RECENT_NOTICES.map(n => (
              <div
                key={n.id}
                className={`flex items-start gap-2.5 rounded-xl px-3 py-2.5 ${
                  n.unread ? 'bg-blue-50 dark:bg-blue-900/10' : 'bg-gray-50 dark:bg-gray-800/50'
                }`}
              >
                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${n.unread ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-tight">{n.title}</p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">{n.date} · {n.category}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Quick actions */}
        <GlassCard className="p-5">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-gray-400" />
            Quick Actions
          </h2>
          <div className="space-y-1.5">
            {[
              { label: 'Message Class Teacher',    icon: MessageSquare, to: '/dashboard/parent/messages',      iconBg: 'bg-green-100 dark:bg-green-900/30',   iconColor: 'text-green-700 dark:text-green-400'   },
              { label: 'Request Leave / Absence',  icon: AlertCircle,   to: '/dashboard/parent/leave',         iconBg: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-700 dark:text-orange-400' },
              { label: 'View Report Card',         icon: BookOpen,      to: '/dashboard/parent/report-cards',  iconBg: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-700 dark:text-purple-400' },
              { label: 'Pay School Fees',          icon: Banknote,      to: '/dashboard/parent/fees',          iconBg: 'bg-yellow-100 dark:bg-yellow-900/30', iconColor: 'text-yellow-700 dark:text-yellow-400' },
              { label: 'Book PT Meeting',          icon: CalendarDays,  to: '/dashboard/parent/meetings',      iconBg: 'bg-blue-100 dark:bg-blue-900/30',     iconColor: 'text-blue-700 dark:text-blue-400'     },
              { label: 'View Bus / Transport',     icon: Bus,           to: '/dashboard/parent/transport',     iconBg: 'bg-gray-100 dark:bg-gray-700',        iconColor: 'text-gray-600 dark:text-gray-300'     },
            ].map(action => (
              <Link
                key={action.to}
                to={action.to}
                className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition group"
              >
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${action.iconBg}`}>
                  <action.icon className={`h-3.5 w-3.5 ${action.iconColor}`} />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition flex-1">
                  {action.label}
                </span>
                <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 transition" />
              </Link>
            ))}
          </div>
        </GlassCard>

      </div>
    </div>
  )
}
