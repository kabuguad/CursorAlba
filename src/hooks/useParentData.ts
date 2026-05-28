import { useQuery } from '@tanstack/react-query'
import { unwrap } from '../services/mockApi'
import { portalService } from '../services/portalService'
import { useAuth } from '../contexts/AuthContext'

function useLinkedStudentId(override?: string) {
  const { user } = useAuth()
  return override ?? user?.linkedId ?? ''
}

export function useParentStudentProfile(overrideStudentId?: string) {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['portal:parent:profile', user?.id, overrideStudentId],
    queryFn: () => portalService.getStudentByUserId(user!.id).then(unwrap),
    enabled: !!user?.id,
  })
}

export function useParentGradesHistory(overrideStudentId?: string) {
  const studentId = useLinkedStudentId(overrideStudentId)
  return useQuery({
    queryKey: ['portal:grades', studentId],
    queryFn: () => portalService.getStudentGradesHistory(studentId).then(unwrap),
    enabled: !!studentId,
  })
}

export function useParentAttendance(overrideStudentId?: string) {
  const studentId = useLinkedStudentId(overrideStudentId)
  return useQuery({
    queryKey: ['portal:attendance', studentId],
    queryFn: () => portalService.getStudentAttendance(studentId).then(unwrap),
    enabled: !!studentId,
  })
}

export function useParentTimetable(overrideStudentId?: string) {
  const studentId = useLinkedStudentId(overrideStudentId)
  return useQuery({
    queryKey: ['portal:timetable', studentId],
    queryFn: () => portalService.getStudentTimetable(studentId).then(unwrap),
    enabled: !!studentId,
  })
}

export function useParentHomework(overrideStudentId?: string) {
  const studentId = useLinkedStudentId(overrideStudentId)
  return useQuery({
    queryKey: ['portal:homework', studentId],
    queryFn: () => portalService.getStudentHomework(studentId).then(unwrap),
    enabled: !!studentId,
  })
}

export function useParentInvoice(overrideStudentId?: string) {
  const studentId = useLinkedStudentId(overrideStudentId)
  return useQuery({
    queryKey: ['portal:invoice', studentId],
    queryFn: () => portalService.getStudentInvoice(studentId).then(unwrap),
    enabled: !!studentId,
  })
}

export function useParentAnnouncements() {
  return useQuery({
    queryKey: ['portal:announcements', 'parent'],
    queryFn: () => portalService.getAnnouncements('parent').then(unwrap),
  })
}
