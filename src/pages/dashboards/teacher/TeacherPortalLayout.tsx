import { LayoutDashboard, BookOpen, ClipboardList, Users, CalendarDays, MessageSquare } from 'lucide-react'
import { PortalLayout } from '../PortalLayout'
import { MESSAGES } from './_data'

const unreadCount = MESSAGES.filter(m => !m.read).length

const NAV = [
  {
    group: 'Teaching',
    items: [
      { label: 'Input Grades',    icon: BookOpen,        path: '/dashboard/teacher',                  exact: true },
      { label: 'Attendance',      icon: LayoutDashboard, path: '/dashboard/teacher/attendance'                   },
      { label: 'Assignments',     icon: ClipboardList,   path: '/dashboard/teacher/assignments'                  },
    ],
  },
  {
    group: 'My Class',
    items: [
      { label: 'Class Roster',    icon: Users,           path: '/dashboard/teacher/myclass'                      },
      { label: 'My Timetable',    icon: CalendarDays,    path: '/dashboard/teacher/timetable'                    },
    ],
  },
  {
    group: 'Communication',
    items: [
      { label: 'Parent Messages', icon: MessageSquare,   path: '/dashboard/teacher/messages', badge: unreadCount },
    ],
  },
]

export function TeacherPortalLayout() {
  return <PortalLayout nav={NAV} portalLabel="TEACHER PORTAL" rootPath="/dashboard/teacher" />
}
