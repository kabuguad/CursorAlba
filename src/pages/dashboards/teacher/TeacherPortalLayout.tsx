import { PortalLayout } from '../PortalLayout'
import type { PortalNavGroup } from '../PortalLayout'
import {
  LayoutDashboard, BookOpen, ClipboardList, UserCheck,
  FileText, Users, Calendar, MessageSquare,
  BarChart2, BookMarked, LogOut as LeaveIcon, Bell, Settings,
} from 'lucide-react'

const ROOT = '/dashboard/teacher'

const NAV: PortalNavGroup[] = [
  {
    group: 'Overview',
    items: [
      { label: 'Dashboard',    icon: LayoutDashboard, path: ROOT, exact: true },
    ],
  },
  {
    group: 'Academics',
    items: [
      { label: 'Gradebook',    icon: BookOpen,        path: `${ROOT}/gradebook`    },
      { label: 'Grades',       icon: ClipboardList,   path: `${ROOT}/grades`       },
      { label: 'Attendance',   icon: UserCheck,       path: `${ROOT}/attendance`   },
      { label: 'Assignments',  icon: FileText,        path: `${ROOT}/assignments`  },
      { label: 'Lesson Plans', icon: BookMarked,      path: `${ROOT}/lesson-plans` },
    ],
  },
  {
    group: 'My Class',
    items: [
      { label: 'My Class',     icon: Users,           path: `${ROOT}/myclass`      },
      { label: 'Timetable',   icon: Calendar,         path: `${ROOT}/timetable`    },
    ],
  },
  {
    group: 'Communication',
    items: [
      { label: 'Messages',     icon: MessageSquare,   path: `${ROOT}/messages`     },
      { label: 'Notices',      icon: Bell,            path: `${ROOT}/notices`      },
    ],
  },
  {
    group: 'Admin',
    items: [
      { label: 'Reports',      icon: BarChart2,       path: `${ROOT}/reports`      },
      { label: 'Leave Request',icon: LeaveIcon,       path: `${ROOT}/leave`        },
      { label: 'Settings',     icon: Settings,        path: `${ROOT}/settings`     },
    ],
  },
]

export function TeacherPortalLayout() {
  return <PortalLayout nav={NAV} portalLabel="TEACHER PORTAL" rootPath={ROOT} />
}
