import { createContext, useContext, useState, type ReactNode } from 'react'
import { DEFAULT_PILLARS, type Pillar } from '../data/pillars'

const LS_KEY = 'alber-admin-pillars'

interface PillarsContextValue {
  pillars: Pillar[]
  updatePillars: (next: Pillar[]) => void
}

const PillarsContext = createContext<PillarsContextValue | null>(null)

function load(): Pillar[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return DEFAULT_PILLARS
    const parsed = JSON.parse(raw) as Pillar[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PILLARS
  } catch {
    return DEFAULT_PILLARS
  }
}

export function PillarsProvider({ children }: { children: ReactNode }) {
  const [pillars, setPillars] = useState<Pillar[]>(load)

  const updatePillars = (next: Pillar[]) => {
    setPillars(next)
    localStorage.setItem(LS_KEY, JSON.stringify(next))
  }

  return (
    <PillarsContext.Provider value={{ pillars, updatePillars }}>
      {children}
    </PillarsContext.Provider>
  )
}

export function usePillars() {
  const ctx = useContext(PillarsContext)
  if (!ctx) throw new Error('usePillars must be used within PillarsProvider')
  return ctx
}
