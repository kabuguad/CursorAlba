import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { VirtualTourButton } from '../virtual-tour/VirtualTourButton'
import { WhatsAppButton } from '../ui/WhatsAppButton'
import { BackToTop } from '../ui/BackToTop'

export function Layout() {
  const { pathname } = useLocation()
  const hideTour = pathname.startsWith('/login') || pathname.startsWith('/dashboard')

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="page-enter pt-24">
        <Outlet />
      </main>
      {!pathname.startsWith('/dashboard') && <Footer />}
      {!hideTour && <VirtualTourButton />}
      {!pathname.startsWith('/login') && !pathname.startsWith('/dashboard') && <WhatsAppButton />}
      {!pathname.startsWith('/login') && !pathname.startsWith('/dashboard') && <BackToTop />}
    </div>
  )
}
