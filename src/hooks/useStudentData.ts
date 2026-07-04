import { useQuery } from '@tanstack/react-query'
import { portalService } from '../services/portalService'
import { useAuth } from '../contexts/AuthContext'

function unwrap<T>(res: { data: T | null; error: string | null }): T {
  if (res.error) throw new Error(res.error)
  return res.data as T
}

export function useStudentProfile() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['portal:profile', user?.id],
    queryFn: () => portalService.getStudentByUserId(user!.id).then(unwrap),
    enabled: !!user?.id,
  })
}

export function useStudentGradesHistory() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['portal:grades', user?.id],
    queryFn: () => portalService.getStudentGradesHistory(user!.id).then(unwrap),
    enabled: !!user?.id,
  })
}

export function useStudentAttendance() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['portal:attendance', user?.id],
    queryFn: () => portalService.getStudentAttendance(user!.id).then(unwrap),
    enabled: !!user?.id,
  })
}

export function useStudentTimetable() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['portal:timetable', user?.id],
    queryFn: () => portalService.getStudentTimetable(user!.id).then(unwrap),
    enabled: !!user?.id,
  })
}

export function useStudentHomework() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['portal:homework', user?.id],
    queryFn: () => portalService.getStudentHomework(user!.id).then(unwrap),
    enabled: !!user?.id,
  })
}

export function useStudentInvoice() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['portal:invoice', user?.id],
    queryFn: () => portalService.getStudentInvoice(user!.id).then(unwrap),
    enabled: !!user?.id,
  })
}

export function useStudentAnnouncements() {
  return useQuery({
    queryKey: ['portal:announcements', 'student'],
    queryFn: () => portalService.getAnnouncements().then(unwrap),
  })
}
