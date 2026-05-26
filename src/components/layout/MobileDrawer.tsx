import { motion, AnimatePresence } from 'framer-motion'
import { Link, NavLink } from 'react-router-dom'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
  links: { to: string; label: string }[]
}

export function MobileDrawer({ open, onClose, links }: MobileDrawerProps) {
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
            className="fixed top-0 right-0 z-[70] flex h-full w-[min(320px,85vw)] flex-col glass glass-border bg-surface-elevated p-6 text-foreground"
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="text-xl font-bold text-primary dark:text-gold">Menu</span>
              <button onClick={onClose} className="rounded-xl p-2 hover:bg-primary/10">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'rounded-xl px-4 py-3 text-lg font-medium transition-all hover:scale-[1.02]',
                      isActive ? 'bg-primary text-white' : 'hover:bg-tint dark:hover:bg-dark-card',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Link
                to="/login"
                onClick={onClose}
                className="mt-4 rounded-xl bg-gold px-4 py-3 text-center font-bold text-dark"
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
