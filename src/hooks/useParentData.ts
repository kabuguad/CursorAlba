import { useQuery } from '@tanstack/react-query'
import { portalService } from '../services/portalService'
import { useAuth } from '../contexts/AuthContext'
import { useSelectedChild } from '../contexts/SelectedChildContext'

function unwrap<T>(res: { data: T | null; error: string | null }): T {
  if (res.error) throw new Error(res.error)
  return res.data as T
}

// ── Children list ──────────────────────────────────────────────────────────
export function useParentChildren() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['portal:parent:children', user?.id],
    queryFn: () => portalService.getParentChildren().then(unwrap),
    enabled: !!user?.id,
  })
}

// ── Per-child hooks — all auto-resolve childId from SelectedChildContext ──
export function useParentStudentProfile(childId?: string) {
  const { user } = useAuth()
  const { selectedChildId } = useSelectedChild()
  const cid = childId ?? selectedChildId ?? ''
  return useQuery({
    queryKey: ['portal:parent:profile', user?.id, cid],
    queryFn: () => portalService.getParentChildProfile(cid).then(unwrap),
    enabled: !!user?.id && !!cid,
  })
}

export function useParentGradesHistory(childId?: string) {
  const { selectedChildId } = useSelectedChild()
  const cid = childId ?? selectedChildId ?? ''
  return useQuery({
    queryKey: ['portal:grades', cid],
    queryFn: () => portalService.getParentChildGrades(cid).then(unwrap),
    enabled: !!cid,
  })
}

export function useParentAttendance(childId?: string) {
  const { selectedChildId } = useSelectedChild()
  const cid = childId ?? selectedChildId ?? ''
  return useQuery({
    queryKey: ['portal:attendance', cid],
    queryFn: () => portalService.getParentChildAttendance(cid).then(unwrap),
    enabled: !!cid,
  })
}

export function useParentTimetable(childId?: string) {
  const { selectedChildId } = useSelectedChild()
  const cid = childId ?? selectedChildId ?? ''
  return useQuery({
    queryKey: ['portal:timetable', cid],
    queryFn: () => portalService.getParentChildTimetable(cid).then(unwrap),
    enabled: !!cid,
  })
}

export function useParentHomework(childId?: string) {
  const { selectedChildId } = useSelectedChild()
  const cid = childId ?? selectedChildId ?? ''
  return useQuery({
    queryKey: ['portal:homework', cid],
    queryFn: () => portalService.getParentChildAssignments(cid).then(unwrap),
    enabled: !!cid,
  })
}

export function useParentInvoice(childId?: string) {
  const { selectedChildId } = useSelectedChild()
  const cid = childId ?? selectedChildId ?? ''
  return useQuery({
    queryKey: ['portal:invoice', cid],
    queryFn: () => portalService.getParentChildFees(cid).then(unwrap),
    enabled: !!cid,
  })
}

export function useParentAnnouncements() {
  return useQuery({
    queryKey: ['portal:announcements', 'parent'],
    queryFn: () => portalService.getAnnouncements('parent').then(unwrap),
  })
}
