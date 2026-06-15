import { useState } from 'react'
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, CalendarDays, ImageIcon,
  Users, UserCheck, GraduationCap, Banknote, Megaphone,
  Settings, LogOut, ExternalLink, ChevronLeft, ChevronRight,
  Menu, Bell, School, X, ClipboardList, BarChart2, CreditCard, Clock,
  Moon, Sun, UserCog, Globe,
} from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import { useToast } from '../../../contexts/ToastContext'
import { useTheme } from '../../../contexts/ThemeContext'
import { cn } from '../../../lib/utils'

const NAV = [
  {
    group: 'Overview',
    items: [
      { label: 'Dashboard',     icon: LayoutDashboard, path: '/dashboard/admin'                  },
      { label: 'Reports',       icon: BarChart2,        path: '/dashboard/admin/reports'          },
    ],
  },
  {
    group: 'Content',
    items: [
      { label: 'Content',       icon: Globe,            path: '/dashboard/admin/pages'            },
      { label: 'Blog Posts',    icon: BookOpen,         path: '/dashboard/admin/blog'             },
      { label: 'Events',        icon: CalendarDays,     path: '/dashboard/admin/events'           },
      { label: 'Gallery',       icon: ImageIcon,        path: '/dashboard/admin/gallery'          },
    ],
  },
  {
    group: 'School',
    items: [
      { label: 'Admissions',    icon: ClipboardList,    path: '/dashboard/admin/admissions'       },
      { label: 'Students',      icon: Users,            path: '/dashboard/admin/students'         },
      { label: 'Staff',         icon: UserCheck,        path: '/dashboard/admin/staff'            },
      { label: 'Academics',     icon: GraduationCap,    path: '/dashboard/admin/academics'        },
      { label: 'Timetable',     icon: Clock,            path: '/dashboard/admin/timetable'        },
    ],
  },
  {
    group: 'Finances',
    items: [
      { label: 'Payments',      icon: CreditCard,       path: '/dashboard/admin/payments'         },
      { label: 'Fee Structure', icon: Banknote,         path: '/dashboard/admin/fees'             },
    ],
  },
  {
    group: 'Comms',
    items: [
      { label: 'Announcements', icon: Megaphone,        path: '/dashboard/admin/announcements'    },
    ],
  },
  {
    group: 'System',
    items: [
      { label: 'Accounts',      icon: UserCog,          path: '/dashboard/admin/accounts'          },
      { label: 'Site Settings', icon: Settings,         path: '/dashboard/admin/settings'         },
    ],
  },
]

export function AdminLayout() {
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [collapsed,  setCollapsed]  = useState(false)

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) ?? 'AD'

  const handleLogout = () => {
    logout()
    showToast('Logged out successfully')
    navigate('/login')
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className={cn(
        'flex h-16 shrink-0 items-center gap-3 border-b border-gray-200 dark:border-white/10 px-4',
        collapsed && 'justify-center px-2',
      )}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E8B84B]">
          <School className="h-5 w-5 text-[#0d1b0d]" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-gray-900 dark:text-white">Alber School</p>
            <p className="text-[10px] tracking-widest text-[#E8B84B]">ADMIN PORTAL</p>
          </div>
        )}
        {/* Mobile close */}
        <button
          className="ml-auto rounded-lg p-1 text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white lg:hidden"
          onClick={() => setDrawerOpen(false)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {NAV.map(group => (
          <div key={group.group} className="mb-3">
            {!collapsed && (
              <p className="mb-1 px-3 text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/25">
                {group.group}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/dashboard/admin'}
                  onClick={() => setDrawerOpen(false)}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) => cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                    'hover:bg-gray-100 dark:hover:bg-white/8',
                    isActive
                      ? 'bg-[#E8B84B]/12 text-[#E8B84B] ring-1 ring-inset ring-[#E8B84B]/25'
                      : 'text-gray-500 dark:text-white/55 hover:text-gray-900 dark:hover:text-white/90',
                    collapsed && 'justify-center px-0 py-3',
                  )}
                >
                  <item.icon className="h-[18px] w-[18px] shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="shrink-0 border-t border-gray-200 dark:border-white/10 p-3 space-y-2">
        {!collapsed && (
          <div className="flex items-center gap-2.5 rounded-xl px-2 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8B84B] text-[11px] font-bold text-[#0d1b0d]">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-gray-800 dark:text-white">{user?.name}</p>
              <p className="truncate text-[10px] text-gray-400 dark:text-white/35">{user?.email}</p>
            </div>
          </div>
        )}
        <div className={cn('flex gap-1.5', collapsed ? 'flex-col items-center' : '')}>
          <Link
            to="/"
            title="View public site"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-700 dark:hover:text-white transition"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 dark:text-white/40 hover:bg-red-50 dark:hover:bg-red-500/15 hover:text-red-500 dark:hover:text-red-400 transition"
          >
            <LogOut className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-700 dark:hover:text-white transition ml-auto"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Mobile overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside className={cn(
        'hidden lg:flex flex-col bg-white dark:bg-[#0d1b0d] border-r border-gray-200 dark:border-transparent transition-all duration-300 shrink-0',
        collapsed ? 'w-[68px]' : 'w-60',
      )}>
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-white dark:bg-[#0d1b0d] border-r border-gray-200 dark:border-transparent transition-transform duration-300 lg:hidden',
        drawerOpen ? 'translate-x-0' : '-translate-x-full',
      )}>
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex flex-1 min-w-0 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 lg:px-6">
          <button
            onClick={() => setDrawerOpen(true)}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1" />

          <Link
            to="/"
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Site
          </Link>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            className="rounded-lg p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {theme === 'light'
              ? <Moon className="h-4 w-4" />
              : <Sun className="h-4 w-4" />
            }
          </button>

          <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[#E8B84B]" />
          </button>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8B84B] text-[11px] font-bold text-[#0d1b0d] cursor-default">
            {initials}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
