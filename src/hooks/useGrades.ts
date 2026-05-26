import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchStudentGrades, submitGrade } from '../api/grades'
import { useToast } from '../contexts/ToastContext'

export function useStudentGrades(studentId: string) {
  return useQuery({
    queryKey: ['grades', studentId],
    queryFn: () => fetchStudentGrades(studentId),
    enabled: !!studentId,
  })
}

export function useSubmitGrade() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: submitGrade,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['grades', variables.studentId] })
      showToast(`Grade recorded successfully`)
    },
    onError: () => {
      showToast('Failed to save grade. Please try again.')
    },
  })
}
