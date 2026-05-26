import type { Student } from './types'

const FIRST = ['Amani', 'Baraka', 'Cherono', 'Daudi', 'Eunice', 'Farida', 'Gitonga', 'Hannah']
const LAST = ['Kariuki', 'Muthoni', 'Oduor', 'Wairimu', 'Kipchoge', 'Nyambura', 'Odhiambo', 'Wanjala']
const GRADES = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Form 1', 'Form 2', 'Form 3', 'Form 4']
const CLASSES = ['Emerald', 'Gold', 'Jade', 'Onyx', 'Pearl', 'Ruby', 'Sapphire', 'Topaz']

export const students: Student[] = Array.from({ length: 50 }, (_, i) => ({
  id: `s-${i + 1}`,
  name: `${FIRST[i % FIRST.length]} ${LAST[i % LAST.length]}`,
  grade: GRADES[i % GRADES.length],
  className: `${CLASSES[i % CLASSES.length]} ${GRADES[i % GRADES.length]}`,
}))

export const gradeData = [
  { subject: 'Mathematics', score: 88 },
  { subject: 'English', score: 92 },
  { subject: 'Science', score: 85 },
  { subject: 'Kiswahili', score: 90 },
  { subject: 'Social Studies', score: 87 },
  { subject: 'Creative Arts', score: 94 },
]

export function generateAttendance(year: number, month: number) {
  const days = new Date(year, month + 1, 0).getDate()
  const data: { date: string; present: boolean }[] = []
  for (let d = 1; d <= days; d++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const day = new Date(year, month, d).getDay()
    if (day === 0 || day === 6) continue
    data.push({ date, present: Math.random() > 0.12 })
  }
  return data
}

export const feeBalance = 48500
export const invoices = [
  { id: 'INV-2026-001', desc: 'Term 1 Tuition', amount: 120000, paid: true, date: '2026-01-05' },
  { id: 'INV-2026-002', desc: 'Transport Levy', amount: 15000, paid: true, date: '2026-01-05' },
  { id: 'INV-2026-003', desc: 'Activity Fee', amount: 8500, paid: false, date: '2026-02-01' },
  { id: 'INV-2026-004', desc: 'Term 2 Tuition Balance', amount: 40000, paid: false, date: '2026-04-01' },
]
