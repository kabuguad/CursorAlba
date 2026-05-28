import { getDB, mutateDB } from './db'
import type { StudentGrade, AttendanceRecord, UserRole } from './db'
import { mockGet, mockPost, newId } from './mockApi'

export const portalService = {

  // ── Shared helpers ──────────────────────────────────────────────────────

  getStudentByUserId: (userId: string) =>
    mockGet(() => {
      const db = getDB()
      const user = db.users.find(u => u.id === userId)
      if (!user?.linkedId) throw new Error('No linked student for user ' + userId)
      const student = db.students.find(s => s.id === user.linkedId!)
      if (!student) throw new Error('Student not found: ' + user.linkedId)
      const classInfo = db.classes.find(c => c.id === student.classId) ?? null
      const term      = db.academicYears.flatMap(y => y.terms).find(t => t.id === db.settings.currentTermId) ?? null
      const invoice   = db.invoices.find(i => i.studentId === student.id && i.termId === db.settings.currentTermId) ?? null
      return { student, classInfo, term, invoice }
    }),

  getStaffByUserId: (userId: string) =>
    mockGet(() => {
      const db   = getDB()
      const user = db.users.find(u => u.id === userId)
      if (!user?.linkedId) throw new Error('No linked staff for user ' + userId)
      const staff = db.staff.find(s => s.id === user.linkedId!)
      if (!staff) throw new Error('Staff not found: ' + user.linkedId)
      return staff
    }),

  // ── Student: grade history (all years / all terms) ──────────────────────

  getStudentGradesHistory: (studentId: string) =>
    mockGet(() => {
      const db      = getDB()
      const grades  = db.studentGrades.filter(g => g.studentId === studentId)
      const subMap  = Object.fromEntries(db.subjects.map(s => [s.id, s.name]))

      return db.academicYears
        .map(year => ({
          yearId: year.id,
          yearLabel: year.label,
          isCurrent: year.isCurrent,
          terms: year.terms
            .map(term => {
              const tg = grades
                .filter(g => g.termId === term.id)
                .map(g => ({ ...g, subjectName: subMap[g.subjectId] ?? g.subjectId }))
              const finished = tg.filter(g => g.total !== null)
              const average  = finished.length
                ? Math.round(finished.reduce((s, g) => s + (g.total ?? 0), 0) / finished.length)
                : null
              return { termId: term.id, termLabel: term.label, isCurrent: term.isCurrent, grades: tg, average }
            })
            .filter(t => t.grades.length > 0),
        }))
        .filter(y => y.terms.length > 0)
    }),

  // ── Student: attendance ─────────────────────────────────────────────────

  getStudentAttendance: (studentId: string, termId?: string) =>
    mockGet(() => {
      const db      = getDB()
      const tid     = termId ?? db.settings.currentTermId
      const records = db.attendanceRecords
        .filter(r => r.studentId === studentId && r.termId === tid)
        .sort((a, b) => b.date.localeCompare(a.date))
      const present = records.filter(r => r.status === 'present').length
      const absent  = records.filter(r => r.status === 'absent').length
      const late    = records.filter(r => r.status === 'late').length
      const excused = records.filter(r => r.status === 'excused').length
      const total   = records.length
      const percent = total > 0 ? Math.round((present / total) * 100) : 100
      return { records, present, absent, late, excused, total, percent }
    }),

  // ── Student: timetable ──────────────────────────────────────────────────

  getStudentTimetable: (studentId: string, termId?: string) =>
    mockGet(() => {
      const db      = getDB()
      const student = db.students.find(s => s.id === studentId)
      if (!student) throw new Error('Student not found')
      const tid  = termId ?? db.settings.currentTermId
      const slots = db.timetableSlots
        .filter(s => s.classId === student.classId && s.termId === tid)
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const
      const result: Record<string, Array<typeof slots[0] & { subjectName: string; teacherName: string }>> = {}
      days.forEach(day => {
        result[day] = slots
          .filter(s => s.day === day)
          .sort((a, b) => a.startTime.localeCompare(b.startTime))
          .map(s => ({
            ...s,
            subjectName: db.subjects.find(sub => sub.id === s.subjectId)?.name ?? s.subjectId,
            teacherName: (() => {
              const t = db.staff.find(st => st.id === s.staffId)
              return t ? `${t.firstName} ${t.lastName}` : 'TBA'
            })(),
          }))
      })
      return result
    }),

  // ── Student: homework ───────────────────────────────────────────────────

  getStudentHomework: (studentId: string) =>
    mockGet(() => {
      const db      = getDB()
      const student = db.students.find(s => s.id === studentId)
      if (!student) throw new Error('Student not found')
      return db.homework
        .filter(h => h.classId === student.classId)
        .sort((a, b) => b.assignedDate.localeCompare(a.assignedDate))
        .map(h => ({ ...h, subjectName: db.subjects.find(s => s.id === h.subjectId)?.name ?? h.subjectId }))
    }),

  // ── Student: invoice ────────────────────────────────────────────────────

  getStudentInvoice: (studentId: string) =>
    mockGet(() => {
      const db = getDB()
      return db.invoices.find(i => i.studentId === studentId && i.termId === db.settings.currentTermId) ?? null
    }),

  // ── Announcements ───────────────────────────────────────────────────────

  getAnnouncements: (role: UserRole) =>
    mockGet(() =>
      getDB()
        .announcements
        .filter(a => a.status === 'published' && a.targetRoles.includes(role))
        .sort((a, b) => new Date(b.publishAt).getTime() - new Date(a.publishAt).getTime())
    ),

  // ── Teacher: classes & students ─────────────────────────────────────────

  getTeacherClasses: (staffId: string) =>
    mockGet(() => {
      const db    = getDB()
      const staff = db.staff.find(s => s.id === staffId)
      if (!staff) return []
      return db.classes
        .filter(c => staff.classIds.includes(c.id))
        .map(c => ({ ...c, studentCount: db.students.filter(s => s.classId === c.id).length }))
    }),

  getClassStudents: (classId: string) =>
    mockGet(() => {
      const db = getDB()
      return db.students
        .filter(s => s.classId === classId)
        .map(s => ({ ...s, fullName: `${s.firstName} ${s.lastName}` }))
    }),

  getClassGrades: (classId: string, termId?: string) =>
    mockGet(() => {
      const db  = getDB()
      const tid = termId ?? db.settings.currentTermId
      return db.studentGrades.filter(g => g.classId === classId && g.termId === tid)
    }),

  getClassAttendance: (classId: string, termId?: string) =>
    mockGet(() => {
      const db       = getDB()
      const tid      = termId ?? db.settings.currentTermId
      const students = db.students.filter(s => s.classId === classId)
      const today    = new Date().toISOString().split('T')[0]
      return students.map(s => {
        const recs = db.attendanceRecords.filter(r => r.studentId === s.id && r.termId === tid)
        return {
          studentId:    s.id,
          fullName:     `${s.firstName} ${s.lastName}`,
          admNo:        s.admNo,
          todayStatus:  recs.find(r => r.date === today)?.status ?? null,
          totalPresent: recs.filter(r => r.status === 'present').length,
          totalAbsent:  recs.filter(r => r.status === 'absent').length,
          totalDays:    recs.length,
        }
      })
    }),

  saveGrades: (grades: Omit<StudentGrade, 'id'>[]) =>
    mockPost(() => {
      mutateDB(db => {
        grades.forEach(g => {
          const i = db.studentGrades.findIndex(
            eg => eg.studentId === g.studentId && eg.subjectId === g.subjectId && eg.termId === g.termId,
          )
          if (i >= 0) Object.assign(db.studentGrades[i], g)
          else db.studentGrades.push({ id: newId('GRD'), ...g })
        })
      })
      return { saved: grades.length }
    }),

  saveAttendance: (records: Omit<AttendanceRecord, 'id'>[]) =>
    mockPost(() => {
      mutateDB(db => {
        records.forEach(r => {
          const i = db.attendanceRecords.findIndex(
            er => er.studentId === r.studentId && er.date === r.date,
          )
          if (i >= 0) Object.assign(db.attendanceRecords[i], r)
          else db.attendanceRecords.push({ id: newId('ATT'), ...r })
        })
      })
      return { saved: records.length }
    }),

  // ── Teacher: timetable ──────────────────────────────────────────────────

  getTeacherTimetable: (staffId: string, termId?: string) =>
    mockGet(() => {
      const db    = getDB()
      const tid   = termId ?? db.settings.currentTermId
      const slots = db.timetableSlots.filter(s => s.staffId === staffId && s.termId === tid)
      const days  = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const
      const result: Record<string, Array<typeof slots[0] & { subjectName: string; className: string }>> = {}
      days.forEach(day => {
        result[day] = slots
          .filter(s => s.day === day)
          .sort((a, b) => a.startTime.localeCompare(b.startTime))
          .map(s => ({
            ...s,
            subjectName: db.subjects.find(sub => sub.id === s.subjectId)?.name ?? s.subjectId,
            className: (() => {
              const c = db.classes.find(c => c.id === s.classId)
              return c ? `${c.grade} ${c.stream}` : s.classId
            })(),
          }))
      })
      return result
    }),

  getLeaveRequests: (staffId: string) =>
    mockGet(() => getDB().leaveRequests.filter(lr => lr.staffId === staffId)),

  submitLeaveRequest: (data: {
    staffId: string; staffName: string; type: string
    startDate: string; endDate: string; reason: string
  }) =>
    mockPost(() => {
      const req = {
        id: newId('LV'), ...data,
        type: data.type as import('./db').LeaveRequest['type'],
        status: 'pending' as const,
        submittedAt: new Date().toISOString(),
        reviewedBy: null, reviewedAt: null, reviewNotes: '',
      }
      mutateDB(db => { db.leaveRequests.push(req) })
      return req
    }),
}
