import { useState, useMemo } from 'react'
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import {
  ImageIcon, UserCheck, LogOut, ExternalLink, ChevronLeft, ChevronRight, ChevronDown,
  Menu, Bell, School, X,
  Moon, Sun, Globe, Monitor, ClipboardList,
} from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import { useToast } from '../../../contexts/ToastContext'
import { useTheme } from '../../../contexts/ThemeContext'
import { cn } from '../../../lib/utils'

// ── Nav type definitions ────────────────────────────────────────────────────
type NavItem = { label: string; icon: React.ElementType; path: string }
type NavGroup = { kind: 'group'; group: string; items: NavItem[] }
type NavDivider = { kind: 'divider'; label: string; sublabel: string }
type NavEntry = NavGroup | NavDivider

// ── Navigation definition ────────────────────────────────────────────────────
const NAV: NavEntry[] = [
  // ── CMS boundary ────────────────────────────────────────────────────────────
  {
    kind: 'divider',
    label: 'CMS',
    sublabel: 'Public Website',
  },
  {
    kind: 'group',
    group: 'Content & Media',
    items: [
      { label: 'Site Content',     icon: Globe,      path: '/dashboard/admin/site-content' },
      { label: 'Gallery',          icon: ImageIcon,  path: '/dashboard/admin/gallery'      },
    ],
  },
  {
    kind: 'group',
    group: 'Staff',
    items: [
      { label: 'Staff & Teachers', icon: UserCheck,  path: '/dashboard/admin/staff'        },
    ],
  },
  // ── Portal boundary ──────────────────────────────────────────────────────────
  {
    kind: 'divider',
    label: 'PORTAL',
    sublabel: 'School Operations',
  },
  {
    kind: 'group',
    group: 'Admissions',
    items: [
      { label: 'Applications', icon: ClipboardList, path: '/dashboard/admin/admissions' },
    ],
  },
]

// Helper — only the group entries (dividers excluded)
const NAV_GROUPS = NAV.filter((e): e is NavGroup => e.kind === 'group')

export function AdminLayout() {
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [collapsed,  setCollapsed]  = useState(false)

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) ?? 'AD'

  const handleLogout = () => {
    logout()
    showToast('Logged out successfully')
    navigate('/login')
  }

  const activeGroup = useMemo(() =>
    NAV_GROUPS.find(g => g.items.some(i =>
      i.path === '/dashboard/admin'
        ? location.pathname === i.path
        : location.pathname.startsWith(i.path),
    ))?.group ?? 'Overview'
  , [location.pathname])

  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set(NAV_GROUPS.map(g => g.group)),
  )

  const toggleGroup = (group: string) => {
    setOpenGroups(prev => {
      const next = new Set(prev)
      next.has(group) ? next.delete(group) : next.add(group)
      return next
    })
  }

  const isGroupOpen = (group: string) => openGroups.has(group) || activeGroup === group

  // ── Sidebar divider chip ──────────────────────────────────────────────────
  function SectionDivider({ entry }: { entry: NavDivider }) {
    if (collapsed) {
      return (
        <div className="my-2 mx-3">
          <div className="h-px bg-gray-200 dark:bg-white/10" />
        </div>
      )
    }
    return (
      <div className="mx-3 my-2 flex items-center gap-2">
        <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
        <span className="flex items-center gap-1 rounded-full border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-2 py-0.5">
          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/35">
            {entry.label}
          </span>
          <span className="text-[9px] text-gray-300 dark:text-white/20">·</span>
          <span className="text-[9px] uppercase tracking-wider text-gray-400 dark:text-white/25">
            {entry.sublabel}
          </span>
        </span>
        <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
      </div>
    )
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
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {NAV.map((entry, idx) => {
          if (entry.kind === 'divider') {
            return <SectionDivider key={`div-${idx}`} entry={entry} />
          }

          const { group, items } = entry
          const open = isGroupOpen(group)
          const isActive = activeGroup === group

          return (
            <div key={group} className="mb-1">
              {!collapsed && (
                <button
                  onClick={() => toggleGroup(group)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-3 py-1.5 mb-0.5 transition-colors',
                    isActive
                      ? 'text-[#E8B84B]'
                      : 'text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/60',
                  )}
                >
                  <span className="text-[9px] font-bold uppercase tracking-widest">
                    {group}
                  </span>
                  <ChevronDown className={cn(
                    'h-3 w-3 transition-transform duration-200',
                    !open && '-rotate-90',
                  )} />
                </button>
              )}
              {(open || collapsed) && (
                <div className="space-y-0.5">
                  {items.map(item => (
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
              )}
            </div>
          )
        })}
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

          {/* Section context badge in topbar */}
          <SectionContextBadge pathname={location.pathname} />

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

// ── Topbar context badge ────────────────────────────────────────────────────
// Shows "CMS" or "Portal" pill so the admin always knows which domain they're in.
const CMS_PATHS = [
  '/dashboard/admin/site-content',
  '/dashboard/admin/gallery',
  '/dashboard/admin/staff',
]

function SectionContextBadge({ pathname }: { pathname: string }) {
  const isCms = CMS_PATHS.some(p => pathname.startsWith(p))
  if (!isCms) return null

  return (
    <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
      <Monitor className="h-3 w-3" /> CMS
    </span>
  )
}
