export interface SubjectGrade {
  subject: string
  score: number
  grade: string
  term: string
}

export interface StudentProgress {
  studentId: string
  studentName: string
  grades: SubjectGrade[]
  average: number
  trend: 'up' | 'down' | 'stable'
}

const MOCK_GRADES: SubjectGrade[] = [
  { subject: 'Mathematics', score: 88, grade: 'A', term: 'Term 1' },
  { subject: 'English', score: 92, grade: 'A+', term: 'Term 1' },
  { subject: 'Science', score: 85, grade: 'A', term: 'Term 1' },
  { subject: 'Kiswahili', score: 90, grade: 'A', term: 'Term 1' },
  { subject: 'Social Studies', score: 87, grade: 'A', term: 'Term 1' },
  { subject: 'Creative Arts', score: 94, grade: 'A+', term: 'Term 1' },
]

function delay(ms = 600) {
  return new Promise((res) => setTimeout(res, ms))
}

export async function fetchStudentGrades(studentId: string): Promise<StudentProgress> {
  await delay()
  const average = Math.round(MOCK_GRADES.reduce((a, g) => a + g.score, 0) / MOCK_GRADES.length)
  return {
    studentId,
    studentName: 'Amani Kariuki',
    grades: MOCK_GRADES,
    average,
    trend: 'up',
  }
}

export async function submitGrade(payload: {
  studentId: string
  subject: string
  score: number
}): Promise<{ success: boolean }> {
  await delay(800)
  console.info('[Mock API] Grade submitted:', payload)
  return { success: true }
}
