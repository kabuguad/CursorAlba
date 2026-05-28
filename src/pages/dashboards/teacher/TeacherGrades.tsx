import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function TeacherGrades() {
  const navigate = useNavigate()
  useEffect(() => { navigate('/dashboard/teacher/gradebook', { replace: true }) }, [navigate])
  return null
}
