import type { Student } from '../data/types'

const FIRST = ['Amani', 'Baraka', 'Cherono', 'Daudi', 'Eunice', 'Farida', 'Gitonga', 'Hannah', 'Ivan', 'Judy']
const LAST = ['Kariuki', 'Muthoni', 'Oduor', 'Wairimu', 'Kipchoge', 'Nyambura', 'Odhiambo', 'Wanjala', 'Kamau', 'Njeri']
const GRADES = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Form 1', 'Form 2', 'Form 3', 'Form 4']
const CLASSES = ['Emerald', 'Gold', 'Jade', 'Onyx', 'Pearl', 'Ruby', 'Sapphire', 'Topaz']

const MOCK_STUDENTS: Student[] = Array.from({ length: 50 }, (_, i) => ({
  id: `s-${i + 1}`,
  name: `${FIRST[i % FIRST.length]} ${LAST[i % LAST.length]}`,
  grade: GRADES[i % GRADES.length],
  className: `${CLASSES[i % CLASSES.length]} ${GRADES[i % GRADES.length]}`,
}))

function delay(ms = 600) {
  return new Promise((res) => setTimeout(res, ms))
}

export async function fetchStudents(): Promise<Student[]> {
  await delay()
  return MOCK_STUDENTS
}

export async function fetchStudentById(id: string): Promise<Student> {
  await delay(400)
  const student = MOCK_STUDENTS.find((s) => s.id === id)
  if (!student) throw new Error(`Student ${id} not found`)
  return student
}
