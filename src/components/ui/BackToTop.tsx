import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!visible) return null

  return (
    <button
      onClick={scrollUp}
      aria-label="Back to top"
      className="fixed bottom-24 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-surface-elevated/90 text-gold shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-white"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  )
}
