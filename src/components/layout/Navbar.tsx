import { useState, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, LogIn, ChevronDown, Orbit } from 'lucide-react'
import { ThemeToggle } from '../ui/ThemeToggle'
import { Button } from '../ui/Button'
import { MobileDrawer } from './MobileDrawer'
import { VirtualTourModal } from '../virtual-tour/VirtualTourModal'
import { cn } from '../../lib/utils'

const ABOUT_LINKS = [
  { to: '/about',                     label: '🏫 Our School',       sub: 'History, mission, vision & leadership' },
  { to: '/about#our-environment',     label: '🌿 Our Environment',  sub: 'Mount Kenya scenery, nature & campus' },
]

const CO_CURRICULAR_LINKS = [
  { to: '/co-curricular', label: '📋 Overview', sub: 'All 4 pillars at a glance' },
  { to: '/sports', label: '🏆 Sports & Athletics', sub: 'Fixtures, results, trophy cabinet' },
  { to: '/music', label: '🎵 Music Academy', sub: 'Instruments, faculty, trial lessons' },
  { to: '/drama-dance', label: '🎭 Drama & Dance', sub: 'Styles, plays, choreographers' },
  { to: '/co-curricular#social-&-community', label: '🤝 Social & Community', sub: 'CSL, festivals, student council' },
  { to: '/co-curricular#career-&-technical', label: '⚙️ Career & Technical', sub: 'Vocational options, Grades 10–12' },
]

const NAV_LEFT = [
  { to: '/', label: 'Home' },
  { to: '/academics', label: 'Academics' },
  { to: '/facilities', label: 'Facilities' },
  { to: '/why-choose-us', label: 'Why Us' },
]

const NAV_RIGHT = [
  { to: '/staff', label: 'Staff' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/admissions', label: 'Admissions' },
  { to: '/contact', label: 'Contact' },
]

const ALL_NAV = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/academics', label: 'Academics' },
  { to: '/facilities', label: 'Facilities' },
  { to: '/why-choose-us', label: 'Why Us' },
  { to: '/co-curricular', label: 'Activities' },
  ...NAV_RIGHT,
]

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [tourOpen, setTourOpen] = useState(false)
  const menuTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openDd = (name: string) => {
    if (menuTimer.current) clearTimeout(menuTimer.current)
    setOpenMenu(name)
  }

  const closeDd = () => {
    menuTimer.current = setTimeout(() => setOpenMenu(null), 150)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-elevated/70 backdrop-blur-xl shadow-sm shadow-black/10 px-4 py-2">
        <nav className="glass glass-border relative flex w-full items-center justify-between rounded-2xl bg-surface-elevated/60 px-4 py-3 text-foreground lg:px-8">
          <Link to="/" className="flex items-center gap-2 transition hover:scale-105">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-gold font-bold text-lg">
              A
            </div>
            <div className="hidden sm:block">
              <span className="block text-lg font-bold text-primary dark:text-gold leading-tight">Gatumbi SDA School</span>
              <span className="block text-[10px] uppercase tracking-widest text-muted">Gatumbi · Kirinyaga</span>
            </div>
          </Link>

          <div className="hidden items-center gap-1 xl:flex">
            {/* Home */}
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(
                  'whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105',
                  isActive ? 'bg-primary/10 text-primary dark:bg-gold/10 dark:text-gold' : 'text-muted hover:text-primary dark:hover:text-gold',
                )
              }
            >
              Home
            </NavLink>

            {/* About dropdown */}
            <div className="relative" onMouseEnter={() => openDd('about')} onMouseLeave={closeDd}>
              <button
                className={cn(
                  'whitespace-nowrap flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105',
                  openMenu === 'about'
                    ? 'bg-primary/10 text-primary dark:bg-gold/10 dark:text-gold'
                    : 'text-muted hover:text-primary dark:hover:text-gold',
                )}
              >
                About
                <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', openMenu === 'about' && 'rotate-180')} />
              </button>
              {openMenu === 'about' && (
                <div
                  className="absolute left-1/2 top-full z-[100] mt-2 w-64 -translate-x-1/2 overflow-hidden rounded-2xl bg-surface-elevated border shadow-2xl"
                  onMouseEnter={() => openDd('about')}
                  onMouseLeave={closeDd}
                >
                  {ABOUT_LINKS.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setOpenMenu(null)}
                      className={({ isActive }) =>
                        cn('flex flex-col px-4 py-3 transition hover:bg-primary/10 dark:hover:bg-gold/10', isActive && 'bg-primary/5 dark:bg-gold/5')
                      }
                    >
                      <span className="text-sm font-semibold text-foreground">{link.label}</span>
                      <span className="text-xs text-muted">{link.sub}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {/* Remaining NAV_LEFT items */}
            {NAV_LEFT.filter(i => i.to !== '/').map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105',
                    isActive
                      ? 'bg-primary/10 text-primary dark:bg-gold/10 dark:text-gold'
                      : 'text-muted hover:text-primary dark:hover:text-gold',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}

            {/* Activities dropdown */}
            <div className="relative" onMouseEnter={() => openDd('activities')} onMouseLeave={closeDd}>
              <button
                className={cn(
                  'whitespace-nowrap flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105',
                  openMenu === 'activities'
                    ? 'bg-primary/10 text-primary dark:bg-gold/10 dark:text-gold'
                    : 'text-muted hover:text-primary dark:hover:text-gold',
                )}
              >
                Activities
                <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', openMenu === 'activities' && 'rotate-180')} />
              </button>
              {openMenu === 'activities' && (
                <div
                  className="absolute left-1/2 top-full z-[100] mt-2 w-72 -translate-x-1/2 overflow-hidden rounded-2xl bg-surface-elevated border shadow-2xl"
                  onMouseEnter={() => openDd('activities')}
                  onMouseLeave={closeDd}
                >
                  {CO_CURRICULAR_LINKS.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setOpenMenu(null)}
                      className={({ isActive }) =>
                        cn('flex flex-col px-4 py-3 transition hover:bg-primary/10 dark:hover:bg-gold/10', isActive && 'bg-primary/5 dark:bg-gold/5')
                      }
                    >
                      <span className="text-sm font-semibold text-foreground">{link.label}</span>
                      <span className="text-xs text-muted">{link.sub}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {NAV_RIGHT.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105',
                    isActive
                      ? 'bg-primary/10 text-primary dark:bg-gold/10 dark:text-gold'
                      : 'text-muted hover:text-primary dark:hover:text-gold',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}

          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTourOpen(true)}
              className="hidden md:flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 px-3.5 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg dark:from-gold dark:to-gold/80 dark:text-black"
            >
              <Orbit className="h-4 w-4 animate-spin" style={{ animationDuration: '8s' }} />
              360° Tour
            </button>
            <ThemeToggle />
            <Link to="/login" className="hidden sm:block">
              <Button variant="primary" className="text-xs px-4 py-2">
                <LogIn className="h-4 w-4" /> Portal
              </Button>
            </Link>
            <button
              onClick={() => setDrawerOpen(true)}
              className="rounded-xl p-2 xl:hidden transition hover:bg-primary/10"
              aria-label="Menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </nav>
      </header>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        links={ALL_NAV}
        aboutLinks={ABOUT_LINKS}
        coLinks={CO_CURRICULAR_LINKS}
        onTour={() => { setDrawerOpen(false); setTourOpen(true) }}
      />

      <VirtualTourModal open={tourOpen} onClose={() => setTourOpen(false)} />
    </>
  )
}
