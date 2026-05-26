import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { VirtualTourButton } from '../virtual-tour/VirtualTourButton'
import { WhatsAppButton } from '../ui/WhatsAppButton'

export function Layout() {
  const { pathname } = useLocation()
  const hideTour = pathname.startsWith('/login') || pathname.startsWith('/dashboard')

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="page-enter pt-24">
        <Outlet />
      </main>
      {!pathname.startsWith('/dashboard') && <Footer />}
      {!hideTour && <VirtualTourButton />}
      {!pathname.startsWith('/login') && !pathname.startsWith('/dashboard') && <WhatsAppButton />}
    </div>
  )
}
