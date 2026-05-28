import { useQuery } from '@tanstack/react-query'
import { unwrap } from '../services/mockApi'
import { portalService } from '../services/portalService'
import { useAuth } from '../contexts/AuthContext'

function sid(linkedId?: string | null, override?: string) {
  return override ?? linkedId ?? ''
}

export function useStudentProfile(overrideStudentId?: string) {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['portal:profile', user?.id, overrideStudentId],
    queryFn: () => {
      if (overrideStudentId) {
        return portalService.getStudentByUserId(user!.id).then(unwrap)
      }
      return portalService.getStudentByUserId(user!.id).then(unwrap)
    },
    enabled: !!user?.id,
  })
}

export function useStudentGradesHistory(overrideStudentId?: string) {
  const { user } = useAuth()
  const studentId = sid(user?.linkedId, overrideStudentId)
  return useQuery({
    queryKey: ['portal:grades', studentId],
    queryFn: () => portalService.getStudentGradesHistory(studentId).then(unwrap),
    enabled: !!studentId,
  })
}

export function useStudentAttendance(overrideStudentId?: string) {
  const { user } = useAuth()
  const studentId = sid(user?.linkedId, overrideStudentId)
  return useQuery({
    queryKey: ['portal:attendance', studentId],
    queryFn: () => portalService.getStudentAttendance(studentId).then(unwrap),
    enabled: !!studentId,
  })
}

export function useStudentTimetable(overrideStudentId?: string) {
  const { user } = useAuth()
  const studentId = sid(user?.linkedId, overrideStudentId)
  return useQuery({
    queryKey: ['portal:timetable', studentId],
    queryFn: () => portalService.getStudentTimetable(studentId).then(unwrap),
    enabled: !!studentId,
  })
}

export function useStudentHomework(overrideStudentId?: string) {
  const { user } = useAuth()
  const studentId = sid(user?.linkedId, overrideStudentId)
  return useQuery({
    queryKey: ['portal:homework', studentId],
    queryFn: () => portalService.getStudentHomework(studentId).then(unwrap),
    enabled: !!studentId,
  })
}

export function useStudentInvoice(overrideStudentId?: string) {
  const { user } = useAuth()
  const studentId = sid(user?.linkedId, overrideStudentId)
  return useQuery({
    queryKey: ['portal:invoice', studentId],
    queryFn: () => portalService.getStudentInvoice(studentId).then(unwrap),
    enabled: !!studentId,
  })
}

export function useStudentAnnouncements() {
  return useQuery({
    queryKey: ['portal:announcements', 'student'],
    queryFn: () => portalService.getAnnouncements('student').then(unwrap),
  })
}
