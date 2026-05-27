import {
  LayoutDashboard, GraduationCap, CalendarDays, Banknote,
  ClipboardList, Bell, Clock, MessageSquare, BookOpen,
  Calendar, Star, AlertCircle, Users, Bus, Settings,
} from 'lucide-react'
import { PortalLayout } from '../PortalLayout'

const NAV = [
  {
    group: 'Overview',
    items: [
      { label: 'Dashboard',     icon: LayoutDashboard, path: '/dashboard/parent',           exact: true },
    ],
  },
  {
    group: "Amani's Progress",
    items: [
      { label: 'Grades',        icon: GraduationCap,   path: '/dashboard/parent/grades'        },
      { label: 'Attendance',    icon: CalendarDays,    path: '/dashboard/parent/attendance'     },
      { label: 'Homework',      icon: ClipboardList,   path: '/dashboard/parent/homework',  badge: 1 },
      { label: 'Report Cards',  icon: BookOpen,        path: '/dashboard/parent/report-cards'  },
      { label: 'Co-Curricular', icon: Star,            path: '/dashboard/parent/co-curricular' },
    ],
  },
  {
    group: 'School',
    items: [
      { label: 'Timetable',     icon: Clock,           path: '/dashboard/parent/timetable'     },
      { label: 'Calendar',      icon: Calendar,        path: '/dashboard/parent/calendar'       },
      { label: 'Notices',       icon: Bell,            path: '/dashboard/parent/notices',   badge: 3 },
      { label: 'Transport',     icon: Bus,             path: '/dashboard/parent/transport'      },
    ],
  },
  {
    group: 'Communication',
    items: [
      { label: 'Messages',      icon: MessageSquare,   path: '/dashboard/parent/messages',  badge: 2 },
      { label: 'PT Meetings',   icon: Users,           path: '/dashboard/parent/meetings'       },
      { label: 'Leave Request', icon: AlertCircle,     path: '/dashboard/parent/leave'          },
    ],
  },
  {
    group: 'Finance',
    items: [
      { label: 'Fee Statement', icon: Banknote,        path: '/dashboard/parent/fees'           },
    ],
  },
  {
    group: 'Account',
    items: [
      { label: 'Settings',      icon: Settings,        path: '/dashboard/parent/settings'       },
    ],
  },
]

export function ParentPortalLayout() {
  return <PortalLayout nav={NAV} portalLabel="PARENT PORTAL" rootPath="/dashboard/parent" />
}
