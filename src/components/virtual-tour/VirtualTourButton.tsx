import { useState } from 'react'
import { Orbit } from 'lucide-react'
import { VirtualTourModal } from './VirtualTourModal'

export function VirtualTourButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="float-3d fixed bottom-24 right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-light px-5 py-3 text-sm font-bold text-white shadow-xl transition-all duration-300 hover:scale-110 pulse-glow"
      >
        <Orbit className="h-5 w-5 animate-spin" style={{ animationDuration: '8s' }} />
        360° Virtual Tour
      </button>
      <VirtualTourModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
