import {
  LayoutDashboard, BookOpen, ClipboardList, Users, CalendarDays,
  MessageSquare, TrendingUp, FileText, Bell, Calendar, Settings, AlertCircle,
} from 'lucide-react'
import { PortalLayout } from '../PortalLayout'

const NAV = [
  {
    group: 'Overview',
    items: [
      { label: 'Dashboard',      icon: LayoutDashboard, path: '/dashboard/teacher',                  exact: true },
    ],
  },
  {
    group: 'Teaching',
    items: [
      { label: 'Gradebook',      icon: TrendingUp,      path: '/dashboard/teacher/gradebook'                    },
      { label: 'Attendance',     icon: CalendarDays,    path: '/dashboard/teacher/attendance'                   },
      { label: 'Assignments',    icon: ClipboardList,   path: '/dashboard/teacher/assignments'                  },
      { label: 'Lesson Plans',   icon: FileText,        path: '/dashboard/teacher/lesson-plans'                 },
    ],
  },
  {
    group: 'My Classes',
    items: [
      { label: 'Class Roster',   icon: Users,           path: '/dashboard/teacher/myclass'                      },
      { label: 'Timetable',      icon: Calendar,        path: '/dashboard/teacher/timetable'                    },
      { label: 'Reports',        icon: BookOpen,        path: '/dashboard/teacher/reports'                      },
    ],
  },
  {
    group: 'Communication',
    items: [
      { label: 'Messages',       icon: MessageSquare,   path: '/dashboard/teacher/messages',    badge: 3       },
      { label: 'Staff Notices',  icon: Bell,            path: '/dashboard/teacher/notices',     badge: 2       },
    ],
  },
  {
    group: 'Account',
    items: [
      { label: 'Leave Requests', icon: AlertCircle,     path: '/dashboard/teacher/leave'                        },
      { label: 'Settings',       icon: Settings,        path: '/dashboard/teacher/settings'                     },
    ],
  },
]

export function TeacherPortalLayout() {
  return <PortalLayout nav={NAV} portalLabel="TEACHER PORTAL" rootPath="/dashboard/teacher" />
}
