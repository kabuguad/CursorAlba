import { Link } from 'react-router-dom'
import {
  Users, UserCheck, TrendingUp, TrendingDown, ArrowRight,
  Megaphone, FileText, GraduationCap, Settings, Banknote,
  BookOpen, CalendarDays, ImageIcon, Clock, Inbox, Bus,
  ShieldAlert, Loader2,
} from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import { useOverviewKPIs, useRecentActivity } from '../../../hooks/useAdminData'

const QUICK = [
  { label: 'Students',      icon: Users,         path: '/dashboard/admin/students',      desc: 'Enroll, edit, archive'      },
  { label: 'Staff',         icon: UserCheck,     path: '/dashboard/admin/staff',         desc: 'Teachers & HR'              },
  { label: 'Invoices',      icon: Banknote,      path: '/dashboard/admin/invoices',      desc: 'Generate & track fees'      },
  { label: 'Admissions',    icon: FileText,      path: '/dashboard/admin/admissions',    desc: 'Review applications'        },
  { label: 'Announcements', icon: Megaphone,     path: '/dashboard/admin/announcements', desc: 'School-wide notices'        },
  { label: 'Inbox',         icon: Inbox,         path: '/dashboard/admin/inbox',         desc: 'Messages from community'    },
  { label: 'Blog',          icon: BookOpen,      path: '/dashboard/admin/blog',          desc: 'Write and publish posts'    },
  { label: 'Events',        icon: CalendarDays,  path: '/dashboard/admin/events',        desc: 'Schedule events'            },
  { label: 'Analytics',     icon: TrendingUp,    path: '/dashboard/admin/analytics',     desc: 'Live reports & charts'      },
  { label: 'Users',         icon: ShieldAlert,   path: '/dashboard/admin/users',         desc: 'Accounts & permissions'     },
  { label: 'Gallery',       icon: ImageIcon,     path: '/dashboard/admin/gallery',       desc: 'Media library'              },
  { label: 'Transport',     icon: Bus,           path: '/dashboard/admin/transport',     desc: 'Routes & vehicles'          },
  { label: 'Library',       icon: BookOpen,      path: '/dashboard/admin/library',       desc: 'Books & borrowings'         },
  { label: 'Academics',     icon: GraduationCap, path: '/dashboard/admin/academics',     desc: 'Classes & assessment'       },
  { label: 'Settings',      icon: Settings,      path: '/dashboard/admin/settings',      desc: 'Site & system config'       },
]

function KPISkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="h-3 w-28 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
          <div className="h-8 w-20 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
          <div className="h-3 w-32 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  )
}

const ACTION_ICON: Record<string, typeof TrendingUp> = {
  CREATE: TrendingUp,
  UPDATE: FileText,
  DELETE: TrendingDown,
  LOGIN: UserCheck,
  EXPORT: ArrowRight,
  VIEW: ImageIcon,
}

const ACTION_DOT: Record<string, string> = {
  CREATE: 'bg-green-500',
  UPDATE: 'bg-blue-500',
  DELETE: 'bg-red-500',
  LOGIN: 'bg-purple-500',
  EXPORT: 'bg-yellow-500',
  VIEW: 'bg-gray-400',
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function Overview() {
  const { user } = useAuth()
  const { data: kpis, isLoading: kpisLoading } = useOverviewKPIs()
  const { data: activity, isLoading: actLoading } = useRecentActivity()

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const KPI_CARDS = kpis ? [
    { label: 'Active Students',      value: kpis.totalStudents.value,    change: kpis.totalStudents.change,      trend: kpis.totalStudents.trend,      color: 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400',     icon: Users },
    { label: 'Staff Members',        value: kpis.totalStaff.value,       change: kpis.totalStaff.change,         trend: kpis.totalStaff.trend,         color: 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400',   icon: UserCheck },
    { label: 'Fee Collection',       value: kpis.feeCollection.value,    change: kpis.feeCollection.change,      trend: kpis.feeCollection.trend,      color: 'bg-yellow-50 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-500', icon: Banknote },
    { label: 'Notices Published',    value: kpis.eventsThisTerm.value,   change: kpis.eventsThisTerm.change,     trend: kpis.eventsThisTerm.trend,     color: 'bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400', icon: Megaphone },
    { label: 'Pending Admissions',   value: kpis.pendingAdmissions.value,change: kpis.pendingAdmissions.change,  trend: kpis.pendingAdmissions.trend,  color: 'bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400', icon: FileText },
    { label: 'Unread Messages',      value: kpis.unreadMessages.value,   change: kpis.unreadMessages.change,     trend: kpis.unreadMessages.trend,     color: 'bg-pink-50 dark:bg-pink-950 text-pink-600 dark:text-pink-400',       icon: Inbox },
    { label: 'Leave Pending',        value: kpis.pendingLeave.value,     change: kpis.pendingLeave.change,       trend: kpis.pendingLeave.trend,       color: 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400',icon: Clock },
    { label: 'Media Assets',         value: kpis.galleryImages.value,    change: kpis.galleryImages.change,      trend: 'up' as const,                 color: 'bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400',       icon: ImageIcon },
  ] : []

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500">{dateStr}</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Live overview of Alber School — data refreshes every 60 seconds.
        </p>
      </div>

      {/* KPI grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpisLoading
          ? Array.from({ length: 8 }).map((_, i) => <KPISkeleton key={i} />)
          : KPI_CARDS.map(s => (
            <div key={s.label} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{s.label}</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                  <p className={`mt-1 flex items-center gap-1 text-xs font-medium ${s.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                    {s.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {s.change}
                  </p>
                </div>
                <div className={`rounded-xl p-2.5 ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Activity feed */}
        <div className="lg:col-span-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-white">Live Activity</h2>
            <Link to="/dashboard/admin/audit" className="text-xs text-[#E8B84B] hover:underline">View audit log →</Link>
          </div>
          {actLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading activity…
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {(activity ?? []).slice(0, 10).map((a, i) => {
                const dot = ACTION_DOT[a.type] ?? 'bg-gray-400'
                return (
                  <li key={i} className="flex items-start gap-3 px-6 py-3.5">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dot}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{a.action}</p>
                      <p className="text-xs text-gray-400">{a.user}</p>
                    </div>
                    <span className="shrink-0 text-xs text-gray-400">{timeAgo(a.time)}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Quick actions */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Quick Access</h2>
          </div>
          <div className="p-3 space-y-0.5 max-h-[420px] overflow-y-auto">
            {QUICK.map(q => (
              <Link
                key={q.path}
                to={q.path}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition group"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:bg-[#E8B84B]/10 group-hover:text-[#E8B84B] transition">
                  <q.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-800 dark:text-gray-200">{q.label}</p>
                  <p className="text-xs text-gray-400">{q.desc}</p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-[#E8B84B] transition" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
