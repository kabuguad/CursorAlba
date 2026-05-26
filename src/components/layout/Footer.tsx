import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-20 border-t border-theme bg-tint/30 text-foreground dark:bg-dark-card/50">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-gold font-bold text-xl">A</div>
            <div>
              <h3 className="text-xl font-bold text-primary dark:text-gold">Alber School</h3>
              <p className="text-sm text-muted">Luxury Private Education</p>
            </div>
          </div>
          <p className="max-w-md text-sm text-muted leading-relaxed">
            Adjacent to the Governor&apos;s Offices, Kutus, Kirinyaga County, Kenya.
            Where excellence meets innovation.
          </p>
        </div>
        <div>
          <h4 className="mb-4 font-bold text-primary dark:text-gold">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted">
            {['/', '/programs', '/admissions', '/staff', '/contact'].map((path) => (
              <li key={path}>
                <Link to={path} className="transition hover:text-primary dark:hover:text-gold hover:translate-x-1 inline-block">
                  {path === '/' ? 'Home' : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-bold text-primary dark:text-gold">Contact</h4>
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-gold mt-0.5" />
              Kutus, Kirinyaga County
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gold" />
              +254 712 345 678
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gold" />
              info@alberschool.ke
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-theme py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} Alber School. All rights reserved.
      </div>
    </footer>
  )
}
