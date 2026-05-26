import { useQuery } from '@tanstack/react-query'
import { fetchStudents, fetchStudentById } from '../api/students'

export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents,
  })
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: ['students', id],
    queryFn: () => fetchStudentById(id),
    enabled: !!id,
  })
}
