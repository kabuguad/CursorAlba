import { GraduationCap, CalendarDays, Banknote, ClipboardList, Bell, Clock } from 'lucide-react'
import { PortalLayout } from '../PortalLayout'

const NAV = [
  {
    group: "Amani's Progress",
    items: [
      { label: 'Grades',     icon: GraduationCap, path: '/dashboard/parent',              exact: true },
      { label: 'Attendance', icon: CalendarDays,  path: '/dashboard/parent/attendance'               },
      { label: 'Homework',   icon: ClipboardList, path: '/dashboard/parent/homework'                 },
    ],
  },
  {
    group: 'School',
    items: [
      { label: 'Timetable',  icon: Clock,         path: '/dashboard/parent/timetable'                },
      { label: 'Notices',    icon: Bell,          path: '/dashboard/parent/notices',      badge: 2   },
    ],
  },
  {
    group: 'Finance',
    items: [
      { label: 'Fee Statement', icon: Banknote,   path: '/dashboard/parent/fees'                     },
    ],
  },
]

export function ParentPortalLayout() {
  return <PortalLayout nav={NAV} portalLabel="PARENT PORTAL" rootPath="/dashboard/parent" />
}
