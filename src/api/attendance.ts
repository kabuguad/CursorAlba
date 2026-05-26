export interface AttendanceDay {
  date: string
  present: boolean
}

export interface AttendanceRecord {
  studentId: string
  month: string
  days: AttendanceDay[]
  presentCount: number
  absentCount: number
  percentage: number
}

function delay(ms = 600) {
  return new Promise((res) => setTimeout(res, ms))
}

function generateDays(year: number, month: number): AttendanceDay[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days: AttendanceDay[] = []
  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const dayOfWeek = new Date(year, month, d).getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) continue
    days.push({ date, present: Math.random() > 0.12 })
  }
  return days
}

export async function fetchAttendance(
  studentId: string,
  year = 2026,
  month = 2,
): Promise<AttendanceRecord> {
  await delay()
  const days = generateDays(year, month)
  const presentCount = days.filter((d) => d.present).length
  const absentCount = days.length - presentCount
  return {
    studentId,
    month: new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' }),
    days,
    presentCount,
    absentCount,
    percentage: Math.round((presentCount / days.length) * 100),
  }
}

export async function submitAttendance(payload: {
  classId: string
  date: string
  records: { studentId: string; present: boolean }[]
}): Promise<{ success: boolean }> {
  await delay(800)
  console.info('[Mock API] Attendance submitted:', payload)
  return { success: true }
}
