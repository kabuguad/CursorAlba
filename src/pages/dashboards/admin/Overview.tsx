import { Link } from 'react-router-dom'
import {
  Users, UserCheck, CalendarDays, BookOpen, ImageIcon,
  Banknote, TrendingUp, TrendingDown, ArrowRight,
  Megaphone, FileText, GraduationCap, Settings,
} from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'

const STATS = [
  { label: 'Total Students',  value: '2,048', change: '+12 this term',  trend: 'up',  icon: Users,      color: 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'   },
  { label: 'Staff Members',   value: '127',   change: '+3 this month',  trend: 'up',  icon: UserCheck,  color: 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400' },
  { label: 'Events This Term',value: '8',     change: '3 upcoming',     trend: 'up',  icon: CalendarDays,color:'bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400'},
  { label: 'Blog Posts',      value: '6',     change: '2 this month',   trend: 'up',  icon: BookOpen,   color: 'bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400'},
  { label: 'Gallery Images',  value: '40',    change: '+8 last upload', trend: 'up',  icon: ImageIcon,  color: 'bg-pink-50 dark:bg-pink-950 text-pink-600 dark:text-pink-400'   },
  { label: 'Fee Collection',  value: '94%',   change: '↑ 2% vs last term',trend:'up', icon: Banknote,   color: 'bg-yellow-50 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-500'},
]

const ACTIVITY = [
  { action: 'New student enrolled — Amani Kariuki, Grade 4',          time: '5 min ago',   dot: 'bg-green-500' },
  { action: 'Blog post published — CBC vs IGCSE Pathway Guide',        time: '1 hr ago',    dot: 'bg-blue-500'  },
  { action: 'Event added — Science Olympiad, 1 Aug 2026',              time: '2 hrs ago',   dot: 'bg-purple-500'},
  { action: 'Staff record updated — Mr. James Ochieng, Sciences',      time: '3 hrs ago',   dot: 'bg-yellow-500'},
  { action: 'Gallery updated — 8 new photos in Sports category',       time: 'Yesterday',   dot: 'bg-pink-500'  },
  { action: 'Fee structure revised — Senior / IGCSE tuition updated',  time: '2 days ago',  dot: 'bg-orange-500'},
  { action: 'Announcement sent — Term 2 reopening date confirmed',     time: '3 days ago',  dot: 'bg-green-500' },
]

const QUICK = [
  { label: 'Home & About',  icon: FileText,      path: '/dashboard/admin/content',       desc: 'Edit hero, mission, values' },
  { label: 'Students',      icon: Users,         path: '/dashboard/admin/students',      desc: 'Add, edit, archive students' },
  { label: 'Staff',         icon: UserCheck,     path: '/dashboard/admin/staff',         desc: 'Manage teachers by dept'    },
  { label: 'Blog',          icon: BookOpen,      path: '/dashboard/admin/blog',          desc: 'Write and publish posts'    },
  { label: 'Events',        icon: CalendarDays,  path: '/dashboard/admin/events',        desc: 'Schedule school events'     },
  { label: 'Fees',          icon: Banknote,      path: '/dashboard/admin/fees',          desc: 'Update fee structure'       },
  { label: 'Announcements', icon: Megaphone,     path: '/dashboard/admin/announcements', desc: 'Post school-wide notices'   },
  { label: 'Academics',     icon: GraduationCap, path: '/dashboard/admin/academics',     desc: 'Grades & attendance'        },
  { label: 'Settings',      icon: Settings,      path: '/dashboard/admin/settings',      desc: 'Site info & contact'        },
]

export function Overview() {
  const { user } = useAuth()
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500">{dateStr}</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Here's an overview of Alber School — Kutus, Kirinyaga.
        </p>
      </div>

      {/* KPI grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STATS.map(s => (
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
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
          </div>
          <ul className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {ACTIVITY.map((a, i) => (
              <li key={i} className="flex items-start gap-3 px-6 py-3.5">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${a.dot}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{a.action}</p>
                </div>
                <span className="shrink-0 text-xs text-gray-400">{a.time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick actions */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
          </div>
          <div className="p-4 space-y-1">
            {QUICK.map(q => (
              <Link
                key={q.path}
                to={q.path}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition group"
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
