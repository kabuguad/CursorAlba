import { LayoutDashboard, BookOpen, ClipboardList, CalendarDays, Bell, FileText, UserCheck } from 'lucide-react'
import { PortalLayout } from '../PortalLayout'

const NAV = [
  {
    group: 'My Portal',
    items: [
      { label: 'Overview',     icon: LayoutDashboard, path: '/dashboard/student',                    exact: true },
      { label: 'My Grades',    icon: BookOpen,         path: '/dashboard/student/grades'              },
      { label: 'Report Card',  icon: FileText,         path: '/dashboard/student/report-card'         },
      { label: 'Attendance',   icon: UserCheck,        path: '/dashboard/student/attendance'          },
      { label: 'Homework',     icon: ClipboardList,    path: '/dashboard/student/homework'            },
      { label: 'Timetable',    icon: CalendarDays,     path: '/dashboard/student/timetable'           },
      { label: 'Notices',      icon: Bell,             path: '/dashboard/student/notices'             },
    ],
  },
]

export function StudentPortalLayout() {
  return <PortalLayout nav={NAV} portalLabel="STUDENT PORTAL" rootPath="/dashboard/student" />
}
