import { useQuery } from '@tanstack/react-query'
import { portalService } from '../services/portalService'
import { useAuth } from '../contexts/AuthContext'

function unwrap<T>(res: { data: T | null; error: string | null }): T {
  if (res.error) throw new Error(res.error)
  return res.data as T
}

export function useParentChildren() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['portal:parent:children', user?.id],
    queryFn: () => portalService.getParentChildren().then(unwrap),
    enabled: !!user?.id,
  })
}

export function useParentStudentProfile(childId?: string) {
  const { user } = useAuth()
  const cid = childId ?? ''
  return useQuery({
    queryKey: ['portal:parent:profile', user?.id, cid],
    queryFn: () => portalService.getParentChildProfile(cid).then(unwrap),
    enabled: !!user?.id && !!cid,
  })
}

export function useParentGradesHistory(childId?: string) {
  const cid = childId ?? ''
  return useQuery({
    queryKey: ['portal:grades', cid],
    queryFn: () => portalService.getParentChildGrades(cid).then(unwrap),
    enabled: !!cid,
  })
}

export function useParentAttendance(childId?: string) {
  const cid = childId ?? ''
  return useQuery({
    queryKey: ['portal:attendance', cid],
    queryFn: () => portalService.getParentChildAttendance(cid).then(unwrap),
    enabled: !!cid,
  })
}

export function useParentTimetable(childId?: string) {
  const cid = childId ?? ''
  return useQuery({
    queryKey: ['portal:timetable', cid],
    queryFn: () => portalService.getParentChildTimetable(cid).then(unwrap),
    enabled: !!cid,
  })
}

export function useParentHomework(childId?: string) {
  const cid = childId ?? ''
  return useQuery({
    queryKey: ['portal:homework', cid],
    queryFn: () => portalService.getParentChildAssignments(cid).then(unwrap),
    enabled: !!cid,
  })
}

export function useParentInvoice(childId?: string) {
  const cid = childId ?? ''
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
