import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, NavLink } from 'react-router-dom'
import { X, ChevronDown, Orbit } from 'lucide-react'
import { cn } from '../../lib/utils'

interface NavLink {
  to: string
  label: string
}

interface CoLink {
  to: string
  label: string
  sub: string
}

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
  links: NavLink[]
  coLinks: CoLink[]
  aboutLinks: CoLink[]
  onTour: () => void
}

const CO_CURRICULAR_PATHS = ['/co-curricular', '/sports', '/music', '/drama-dance']
const ABOUT_PATHS = ['/about']

export function MobileDrawer({ open, onClose, links, coLinks, aboutLinks, onTour }: MobileDrawerProps) {
  const [coOpen, setCoOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)

  const mainLinks = links.filter(
    (l) =>
      !CO_CURRICULAR_PATHS.some((p) => l.to === p || (l.to !== '/' && p.startsWith(l.to))) &&
      !ABOUT_PATHS.includes(l.to),
  )

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-0 right-0 z-[70] flex h-full w-[min(320px,85vw)] flex-col glass glass-border bg-surface-elevated p-6 text-foreground overflow-y-auto"
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="text-xl font-bold text-primary dark:text-gold">Menu</span>
              <button onClick={onClose} className="rounded-xl p-2 hover:bg-primary/10">
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {mainLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'rounded-xl px-4 py-3 text-base font-medium transition-all hover:scale-[1.02]',
                      isActive ? 'bg-primary text-white' : 'hover:bg-tint dark:hover:bg-dark-card',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {/* About accordion */}
              <div className="mt-1">
                <button
                  onClick={() => setAboutOpen((o) => !o)}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition hover:bg-tint dark:hover:bg-dark-card"
                >
                  <span>About</span>
                  <ChevronDown className={cn('h-5 w-5 transition-transform', aboutOpen && 'rotate-180')} />
                </button>
                <AnimatePresence>
                  {aboutOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-gold/30 pl-4">
                        {aboutLinks.map((link) => (
                          <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={onClose}
                            className={({ isActive }) =>
                              cn(
                                'flex flex-col rounded-xl px-3 py-2.5 transition hover:bg-tint dark:hover:bg-dark-card',
                                isActive && 'bg-primary/10',
                              )
                            }
                          >
                            <span className="text-sm font-semibold">{link.label}</span>
                            <span className="text-xs text-muted">{link.sub}</span>
                          </NavLink>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Co-Curricular accordion */}
              <div className="mt-1">
                <button
                  onClick={() => setCoOpen((o) => !o)}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition hover:bg-tint dark:hover:bg-dark-card"
                >
                  <span>Co-Curricular</span>
                  <ChevronDown className={cn('h-5 w-5 transition-transform', coOpen && 'rotate-180')} />
                </button>
                <AnimatePresence>
                  {coOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-gold/30 pl-4">
                        {coLinks.map((link) => (
                          <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={onClose}
                            className={({ isActive }) =>
                              cn(
                                'flex flex-col rounded-xl px-3 py-2.5 transition hover:bg-tint dark:hover:bg-dark-card',
                                isActive && 'bg-primary/10',
                              )
                            }
                          >
                            <span className="text-sm font-semibold">{link.label}</span>
                            <span className="text-xs text-muted">{link.sub}</span>
                          </NavLink>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={onTour}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 px-4 py-3 text-center font-bold text-white dark:from-gold dark:to-gold/80 dark:text-black"
              >
                <Orbit className="h-4 w-4 animate-spin" style={{ animationDuration: '8s' }} />
                360° Virtual Tour
              </button>

              <Link
                to="/login"
                onClick={onClose}
                className="mt-2 rounded-xl bg-gold px-4 py-3 text-center font-bold text-dark"
              >
                Portal Login
              </Link>
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
