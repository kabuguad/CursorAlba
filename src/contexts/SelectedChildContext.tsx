import { createContext, useContext } from 'react'

export interface ChildSummary {
  id: string
  fullName: string
  firstName: string
  className: string
}

export interface SelectedChildCtx {
  children: ChildSummary[]
  selectedChildId: string | null
  selectedChild: ChildSummary | null
  setSelectedChildId: (id: string) => void
  isLoading: boolean
}

export const SelectedChildContext = createContext<SelectedChildCtx>({
  children: [],
  selectedChildId: null,
  selectedChild: null,
  setSelectedChildId: () => {},
  isLoading: false,
})

export function useSelectedChild() {
  return useContext(SelectedChildContext)
}
