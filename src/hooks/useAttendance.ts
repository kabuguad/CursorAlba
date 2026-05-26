import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAttendance, submitAttendance } from '../api/attendance'
import { useToast } from '../contexts/ToastContext'

export function useAttendance(studentId: string, year?: number, month?: number) {
  return useQuery({
    queryKey: ['attendance', studentId, year, month],
    queryFn: () => fetchAttendance(studentId, year, month),
    enabled: !!studentId,
  })
}

export function useSubmitAttendance() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: submitAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] })
      showToast('Daily attendance saved successfully')
    },
    onError: () => {
      showToast('Failed to save attendance. Please try again.')
    },
  })
}
