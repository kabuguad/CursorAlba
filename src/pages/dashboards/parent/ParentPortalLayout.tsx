import { useState, useEffect } from 'react'
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, GraduationCap, CalendarDays, Banknote,
  ClipboardList, Bell, Clock, MessageSquare, BookOpen,
  Calendar, Star, AlertCircle, Users, Bus, Settings,
  LogOut, ExternalLink, ChevronLeft, ChevronRight, Menu, School, X,
  Moon, Sun, ChevronDown, CheckCircle2,
} from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import { useToast } from '../../../contexts/ToastContext'
import { useTheme } from '../../../contexts/ThemeContext'
import { cn } from '../../../lib/utils'
import { SelectedChildContext, type ChildSummary } from '../../../contexts/SelectedChildContext'
import { useParentChildren } from '../../../hooks/useParentData'

// ── Nav definition ───────────────────────────────────────────────────────────
// Child name is injected dynamically into the group label.
function buildNav(childFirstName: string) {
  return [
    {
      group: 'Overview',
      items: [
        { label: 'Dashboard',     icon: LayoutDashboard, path: '/dashboard/parent',                exact: true },
      ],
    },
    {
      group: `${childFirstName}'s Progress`,
      items: [
        { label: 'Grades',        icon: GraduationCap,   path: '/dashboard/parent/grades'        },
        { label: 'Attendance',    icon: CalendarDays,    path: '/dashboard/parent/attendance'     },
        { label: 'Report Cards',  icon: BookOpen,        path: '/dashboard/parent/report-cards'  },
        { label: 'Homework',      icon: ClipboardList,   path: '/dashboard/parent/homework',  badge: 1 },
        { label: 'Timetable',     icon: Clock,           path: '/dashboard/parent/timetable'     },
        { label: 'Co-Curricular', icon: Star,            path: '/dashboard/parent/co-curricular' },
      ],
    },
    {
      group: 'School',
      items: [
        { label: 'Notices',       icon: Bell,            path: '/dashboard/parent/notices',   badge: 3 },
        { label: 'Calendar',      icon: Calendar,        path: '/dashboard/parent/calendar'       },
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
}

export function ParentPortalLayout() {
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const [drawerOpen,  setDrawerOpen]  = useState(false)
  const [collapsed,   setCollapsed]   = useState(false)
  const [pickerOpen,  setPickerOpen]  = useState(false)
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null)

  const { data: rawChildren = [], isLoading: childrenLoading } = useParentChildren()

  // Map API shape → ChildSummary
  const children: ChildSummary[] = (rawChildren as { id: number | string; fullName: string; className: string }[]).map(c => ({
    id: c.id.toString(),
    fullName: c.fullName,
    firstName: c.fullName.split(' ')[0],
    className: c.className,
  }))

  // Auto-select first child once data arrives
  useEffect(() => {
    if (children.length > 0 && !selectedChildId) {
      setSelectedChildId(children[0].id)
    }
  }, [children.length])          // eslint-disable-line react-hooks/exhaustive-deps

  const selectedChild = children.find(c => c.id === selectedChildId) ?? null

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) ?? '??'

  const handleLogout = () => {
    logout()
    showToast('Logged out successfully')
    navigate('/login')
  }

  const nav = buildNav(selectedChild?.firstName ?? 'Child')

  // ── Child picker dropdown ───────────────────────────────────────────────
  function ChildSwitcher() {
    if (childrenLoading) {
      return (
        <div className={cn('mx-3 mb-3', collapsed && 'flex justify-center')}>
          <div className="h-10 animate-pulse rounded-xl bg-gray-100 dark:bg-white/5" />
        </div>
      )
    }

    if (children.length === 0) return null

    // Collapsed: just show avatar with initials
    if (collapsed) {
      return (
        <div className="flex flex-col items-center gap-1 mx-2 mb-3">
          {children.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedChildId(c.id)}
              title={c.fullName}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold transition',
                c.id === selectedChildId
                  ? 'bg-[#E8B84B] text-[#0d1b0d] ring-2 ring-[#E8B84B]/40'
                  : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/50 hover:bg-gray-200 dark:hover:bg-white/20',
              )}
            >
              {c.firstName[0]}{c.fullName.split(' ').pop()?.[0]}
            </button>
          ))}
        </div>
      )
    }

    // Single child: non-interactive "viewing" banner
    if (children.length === 1) {
      const c = children[0]
      return (
        <div className="mx-3 mb-3">
          <div className="flex items-center gap-2 rounded-xl bg-[#E8B84B]/8 border border-[#E8B84B]/20 px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8B84B] text-[10px] font-bold text-[#0d1b0d]">
              {c.firstName[0]}{c.fullName.split(' ').pop()?.[0]}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-[#E8B84B] shrink-0" />
                <span className="text-xs font-semibold text-gray-900 dark:text-white truncate">{c.fullName}</span>
              </div>
              <span className="text-[10px] text-gray-400 dark:text-white/35">{c.className}</span>
            </div>
          </div>
        </div>
      )
    }

    // Multiple children: dropdown picker
    return (
      <div className="relative mx-3 mb-3" onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setPickerOpen(false) }}>
        <button
          onClick={() => setPickerOpen(p => !p)}
          className="flex w-full items-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 hover:border-[#E8B84B]/40 hover:bg-[#E8B84B]/5 transition"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8B84B] text-[10px] font-bold text-[#0d1b0d]">
            {selectedChild ? `${selectedChild.firstName[0]}${selectedChild.fullName.split(' ').pop()?.[0]}` : '—'}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-xs font-semibold text-gray-900 dark:text-white truncate">
              {selectedChild?.fullName ?? 'Select child'}
            </div>
            <div className="text-[10px] text-gray-400 dark:text-white/35 truncate">{selectedChild?.className}</div>
          </div>
          <ChevronDown className={cn('h-3.5 w-3.5 text-gray-400 shrink-0 transition-transform', pickerOpen && 'rotate-180')} />
        </button>

        {pickerOpen && (
          <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 shadow-xl py-1 overflow-hidden">
            <p className="px-3 pt-1.5 pb-1 text-[9px] font-bold uppercase tracking-widest text-gray-400">
              {children.length} children
            </p>
            {children.map(c => (
              <button
                key={c.id}
                onClick={() => { setSelectedChildId(c.id); setPickerOpen(false) }}
                className={cn(
                  'flex w-full items-center gap-2.5 px-3 py-2 text-left transition hover:bg-gray-50 dark:hover:bg-white/5',
                  c.id === selectedChildId && 'bg-[#E8B84B]/8',
                )}
              >
                <div className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                  c.id === selectedChildId
                    ? 'bg-[#E8B84B] text-[#0d1b0d]'
                    : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/50',
                )}>
                  {c.firstName[0]}{c.fullName.split(' ').pop()?.[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-gray-900 dark:text-white truncate">{c.fullName}</div>
                  <div className="text-[10px] text-gray-400">{c.className}</div>
                </div>
                {c.id === selectedChildId && <CheckCircle2 className="h-3.5 w-3.5 text-[#E8B84B] shrink-0" />}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ── Sidebar content ──────────────────────────────────────────────────────
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
            <p className="text-[10px] tracking-widest text-[#E8B84B]">PARENT PORTAL</p>
          </div>
        )}
        <button
          className="ml-auto rounded-lg p-1 text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white lg:hidden"
          onClick={() => setDrawerOpen(false)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Child switcher */}
      <div className="pt-3">
        <ChildSwitcher />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        {nav.map(group => (
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
                  end={item.exact ?? item.path === '/dashboard/parent'}
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
                  {!collapsed && <span className="flex-1">{item.label}</span>}
                  {!collapsed && !!item.badge && item.badge > 0 && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
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
    <SelectedChildContext.Provider value={{
      children,
      selectedChildId,
      selectedChild,
      setSelectedChildId,
      isLoading: childrenLoading,
    }}>
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

            {/* Active child badge in topbar */}
            {selectedChild && (
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#E8B84B]/30 bg-[#E8B84B]/8 px-3 py-1 text-xs font-semibold text-gray-700 dark:text-white/80">
                <span className="h-2 w-2 rounded-full bg-[#E8B84B]" />
                {selectedChild.fullName}
                <span className="text-gray-400 dark:text-white/35">· {selectedChild.className}</span>
              </span>
            )}

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
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
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
    </SelectedChildContext.Provider>
  )
}
