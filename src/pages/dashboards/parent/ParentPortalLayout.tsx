import { PortalLayout } from '../PortalLayout'
import type { PortalNavGroup } from '../PortalLayout'
import {
  LayoutDashboard, BookOpen, UserCheck, CreditCard,
  FileText, Calendar, Bell, MessageSquare,
  ScrollText, CalendarDays, Trophy, LogOut as LeaveIcon,
  Users, Bus, Settings,
} from 'lucide-react'

const ROOT = '/dashboard/parent'

const NAV: PortalNavGroup[] = [
  {
    group: 'Overview',
    items: [
      { label: 'Dashboard',      icon: LayoutDashboard, path: ROOT, exact: true },
    ],
  },
  {
    group: 'Academics',
    items: [
      { label: 'Grades',         icon: BookOpen,        path: `${ROOT}/grades`       },
      { label: 'Attendance',     icon: UserCheck,       path: `${ROOT}/attendance`   },
      { label: 'Homework',       icon: FileText,        path: `${ROOT}/homework`     },
      { label: 'Timetable',      icon: Calendar,        path: `${ROOT}/timetable`    },
      { label: 'Report Cards',   icon: ScrollText,      path: `${ROOT}/report-cards` },
    ],
  },
  {
    group: 'Finance',
    items: [
      { label: 'Fees',           icon: CreditCard,      path: `${ROOT}/fees`         },
    ],
  },
  {
    group: 'Communication',
    items: [
      { label: 'Notices',        icon: Bell,            path: `${ROOT}/notices`      },
      { label: 'Messages',       icon: MessageSquare,   path: `${ROOT}/messages`     },
      { label: 'Meetings',       icon: Users,           path: `${ROOT}/meetings`     },
    ],
  },
  {
    group: 'Activities',
    items: [
      { label: 'Calendar',       icon: CalendarDays,    path: `${ROOT}/calendar`     },
      { label: 'Co-Curricular',  icon: Trophy,          path: `${ROOT}/co-curricular`},
      { label: 'Transport',      icon: Bus,             path: `${ROOT}/transport`    },
    ],
  },
  {
    group: 'Admin',
    items: [
      { label: 'Leave Request',  icon: LeaveIcon,       path: `${ROOT}/leave`        },
      { label: 'Settings',       icon: Settings,        path: `${ROOT}/settings`     },
    ],
  },
]

export function ParentPortalLayout() {
  return <PortalLayout nav={NAV} portalLabel="PARENT PORTAL" rootPath={ROOT} />
}
