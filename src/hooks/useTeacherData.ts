import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { portalService } from '../services/portalService'
import { useAuth } from '../contexts/AuthContext'

function unwrap<T>(res: { data: T | null; error: string | null }): T {
  if (res.error) throw new Error(res.error)
  return res.data as T
}

export function useTeacherProfile() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['portal:staff', user?.id],
    queryFn: () => portalService.getStaffByUserId(user!.id).then(unwrap),
    enabled: !!user?.id,
  })
}

export function useTeacherClasses() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['portal:classes', user?.id],
    queryFn: () => portalService.getTeacherClasses(user!.id).then(unwrap),
    enabled: !!user?.id,
  })
}

export function useClassStudents(classId?: string) {
  return useQuery({
    queryKey: ['portal:students', classId],
    queryFn: () => portalService.getClassStudents(classId!).then(unwrap),
    enabled: !!classId,
  })
}

export function useClassGrades(classId?: string, termId?: string) {
  return useQuery({
    queryKey: ['portal:classGrades', classId, termId],
    queryFn: () => portalService.getClassGrades(classId!, termId).then(unwrap),
    enabled: !!classId,
  })
}

export function useClassAttendance(classId?: string) {
  return useQuery({
    queryKey: ['portal:classAttendance', classId],
    queryFn: () => portalService.getClassAttendance(classId!).then(unwrap),
    enabled: !!classId,
    refetchInterval: 30_000,
  })
}

export function useSaveGrades() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (grades: unknown[]) => portalService.saveGrades(grades).then(unwrap),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['portal:classGrades'] }),
  })
}

export function useSaveAttendance() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (records: unknown[]) => portalService.saveAttendance(records).then(unwrap),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['portal:classAttendance'] }),
  })
}

export function useTeacherTimetable() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['portal:teacherTimetable', user?.id],
    queryFn: () => portalService.getTeacherTimetable(user!.id).then(unwrap),
    enabled: !!user?.id,
  })
}

export function useTeacherLeaveRequests() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['portal:leaveRequests', user?.id],
    queryFn: () => portalService.getLeaveRequests(user!.id).then(unwrap),
    enabled: !!user?.id,
  })
}

export function useSubmitLeaveRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { staffId: string; staffName: string; type: string; startDate: string; endDate: string; reason: string }) =>
      portalService.submitLeaveRequest(data).then(unwrap),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['portal:leaveRequests'] }),
  })
}

export function useTeacherAnnouncements() {
  return useQuery({
    queryKey: ['portal:announcements', 'teacher'],
    queryFn: () => portalService.getAnnouncements('teacher').then(unwrap),
  })
}
