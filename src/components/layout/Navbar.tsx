import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, LogIn, LogOut } from 'lucide-react'
import { ThemeToggle } from '../ui/ThemeToggle'
import { Button } from '../ui/Button'
import { MobileDrawer } from './MobileDrawer'
import { useAuth } from '../../contexts/AuthContext'
import { cn } from '../../lib/utils'

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/programs', label: 'Programs' },
  { to: '/academics', label: 'Academics' },
  { to: '/facilities', label: 'Facilities' },
  { to: '/music', label: 'Music' },
  { to: '/drama-dance', label: 'Drama & Dance' },
  { to: '/sports', label: 'Sports' },
  { to: '/staff', label: 'Staff' },
  { to: '/admissions', label: 'Admissions' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
        <nav className="glass glass-border mx-auto flex max-w-7xl items-center justify-between rounded-2xl bg-surface-elevated px-4 py-3 text-foreground lg:px-6">
          <Link to="/" className="flex items-center gap-2 transition hover:scale-105">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-gold font-bold text-lg">
              A
            </div>
            <div className="hidden sm:block">
              <span className="block text-lg font-bold text-primary dark:text-gold leading-tight">Alber School</span>
              <span className="block text-[10px] uppercase tracking-widest text-muted">Kutus · Kirinyaga</span>
            </div>
          </Link>

          <div className="hidden items-center gap-1 xl:flex">
            {NAV.slice(0, 8).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105',
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
            <ThemeToggle />
            {user ? (
              <>
                <Button
                  variant="ghost"
                  className="hidden sm:inline-flex text-xs"
                  onClick={() => navigate(`/dashboard/${user.role}`)}
                >
                  Dashboard
                </Button>
                <button
                  onClick={handleLogout}
                  className="rounded-xl p-2 transition hover:bg-primary/10 hover:scale-110"
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <Link to="/login" className="hidden sm:block">
                <Button variant="primary" className="text-xs px-4 py-2">
                  <LogIn className="h-4 w-4" /> Portal
                </Button>
              </Link>
            )}
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
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} links={NAV} />
    </>
  )
}
