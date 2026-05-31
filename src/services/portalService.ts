import { apiClient } from './apiClient'
import { mutateDB } from './db'
import type { UserRole } from './db'

export type ApiResponse<T> = { data: T; error: null } | { data: null; error: string }

function ok<T>(data: T): ApiResponse<T> {
  return { data, error: null }
}

function fail(err: unknown): ApiResponse<never> {
  const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
    ?? (err as Error)?.message
    ?? 'Unknown error'
  return { data: null, error: msg }
}

interface GradeResponseDto {
  id: number; studentId: number; studentName: string; subjectName: string
  score: number; maxScore: number; percentage: number
  assessmentType?: string; assessmentDate: string; remarks?: string
}

interface AttendanceRecordDto {
  id: number; studentId: number; date: string
  status: string; remarks?: string
}

interface TimetableEntryDto {
  id: number; dayOfWeek: string; startTime: string; endTime: string
  subjectName: string; subjectCode?: string; teacherName: string; classId: number; className?: string
}

interface AssignmentDto {
  id: number; title: string; description?: string; dueDate: string
  subjectName: string; teacherName?: string; className?: string; createdAt: string
}

interface StudentProfileDto {
  id: number; userId: number; fullName: string; gender?: string
  dateOfBirth?: string; address?: string; classId: number
  className: string; classSection?: string; parentId?: number
}

interface InvoiceDto {
  studentFeeId: number; studentName: string; className: string
  feeName: string; amountDue: number; amountPaid: number; balance: number
  status: string; paidAt?: string; payments?: unknown[]
}

interface ChildDto {
  id: number; userId: number; fullName: string
  className: string; classId: number; gender?: string
  dateOfBirth?: string; address?: string; parentId?: number
}

function groupGradesByYearTerm(grades: GradeResponseDto[]) {
  const byYearTerm: Record<string, Record<string, GradeResponseDto[]>> = {}
  grades.forEach(g => {
    const year = new Date(g.assessmentDate).getFullYear().toString()
    const term = g.assessmentType ?? 'General'
    if (!byYearTerm[year]) byYearTerm[year] = {}
    if (!byYearTerm[year][term]) byYearTerm[year][term] = []
    byYearTerm[year][term].push(g)
  })
  const currentYear = new Date().getFullYear().toString()
  return Object.entries(byYearTerm).map(([year, terms]) => ({
    yearId: year,
    yearLabel: year,
    isCurrent: year === currentYear,
    terms: Object.entries(terms).map(([termLabel, tGrades]) => {
      const scores = tGrades.map(g => g.percentage)
      const average = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null
      return {
        termId: `${year}-${termLabel}`,
        termLabel,
        isCurrent: year === currentYear,
        grades: tGrades.map(g => ({
          id: g.id.toString(), studentId: g.studentId.toString(),
          subjectId: g.subjectName, subjectName: g.subjectName,
          termId: `${year}-${termLabel}`, classId: '',
          total: g.percentage, ca: g.score, exam: null,
          remarks: g.remarks ?? '',
          assessmentType: g.assessmentType, assessmentDate: g.assessmentDate,
        })),
        average,
      }
    }),
  })).filter(y => y.terms.length > 0)
}

function calcAttendanceStats(records: AttendanceRecordDto[]) {
  const mapped = records.map(r => ({
    id: r.id.toString(), studentId: r.studentId.toString(),
    date: r.date.split('T')[0],
    status: r.status.toLowerCase() as 'present' | 'absent' | 'late' | 'excused',
    termId: 'current', remarks: r.remarks ?? '',
  }))
  const present = mapped.filter(r => r.status === 'present').length
  const absent  = mapped.filter(r => r.status === 'absent').length
  const late    = mapped.filter(r => r.status === 'late').length
  const excused = mapped.filter(r => r.status === 'excused').length
  const total   = mapped.length
  const percent = total > 0 ? Math.round((present / total) * 100) : 100
  return { records: mapped.sort((a, b) => b.date.localeCompare(a.date)), present, absent, late, excused, total, percent }
}

function groupTimetable(entries: TimetableEntryDto[]) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const
  const result: Record<string, unknown[]> = {}
  days.forEach(day => {
    result[day] = entries
      .filter(e => e.dayOfWeek === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
      .map(e => ({
        id: e.id.toString(), classId: e.classId.toString(),
        subjectId: e.subjectName, subjectName: e.subjectName,
        staffId: '', teacherName: e.teacherName,
        day: e.dayOfWeek, startTime: e.startTime, endTime: e.endTime,
        termId: 'current', className: e.className,
      }))
  })
  return result
}

function mapAssignments(assignments: AssignmentDto[]) {
  return assignments.map(a => ({
    id: a.id.toString(), title: a.title, description: a.description ?? '',
    classId: '', subjectId: a.subjectName, subjectName: a.subjectName,
    assignedDate: a.createdAt?.split('T')[0] ?? new Date().toISOString().split('T')[0],
    dueDate: a.dueDate.split('T')[0],
    teacherName: a.teacherName ?? '', status: 'pending' as const,
  }))
}

export const portalService = {

  getStudentByUserId: async (_userId: string): Promise<ApiResponse<unknown>> => {
    try {
      const [profileRes, invoiceRes] = await Promise.allSettled([
        apiClient.get<StudentProfileDto>('/student/profile'),
        apiClient.get<InvoiceDto>('/student/fees/invoice'),
      ])
      const profile = profileRes.status === 'fulfilled' ? profileRes.value.data : null
      const invoice = invoiceRes.status === 'fulfilled' ? invoiceRes.value.data : null
      if (!profile) return fail('Student profile not found')
      return ok({
        student: {
          id: profile.id.toString(), admNo: `ADM${String(profile.id).padStart(4, '0')}`,
          firstName: profile.fullName.split(' ')[0],
          lastName: profile.fullName.split(' ').slice(1).join(' '),
          dob: profile.dateOfBirth ?? '', gender: (profile.gender ?? 'Male') as 'Male' | 'Female',
          grade: profile.className, classId: profile.classId.toString(),
          photo: null, status: 'active' as const,
          userId: profile.userId.toString(), address: profile.address ?? '',
        },
        classInfo: { id: profile.classId.toString(), name: profile.className, grade: profile.className, stream: profile.classSection ?? '' },
        term: null,
        invoice: invoice ?? null,
      })
    } catch (e) { return fail(e) }
  },

  getStaffByUserId: async (_userId: string): Promise<ApiResponse<unknown>> => {
    try {
      const res = await apiClient.get<{ id: number; userId: number; fullName: string; email: string; qualification?: string; specialization?: string; hireDate?: string }>('/teacher/profile')
      const t = res.data
      return ok({
        id: t.id.toString(), userId: t.userId.toString(),
        firstName: t.fullName.split(' ')[0], lastName: t.fullName.split(' ').slice(1).join(' '),
        email: t.email, qualification: t.qualification, specialization: t.specialization,
        classIds: [], subjects: [],
      })
    } catch (e) { return fail(e) }
  },

  getStudentGradesHistory: async (_studentId: string): Promise<ApiResponse<unknown>> => {
    try {
      const res = await apiClient.get<GradeResponseDto[]>('/student/grades')
      return ok(groupGradesByYearTerm(res.data))
    } catch (e) { return fail(e) }
  },

  getStudentAttendance: async (_studentId: string): Promise<ApiResponse<unknown>> => {
    try {
      const res = await apiClient.get<AttendanceRecordDto[]>('/student/attendance')
      return ok(calcAttendanceStats(res.data))
    } catch (e) { return fail(e) }
  },

  getStudentTimetable: async (_studentId: string): Promise<ApiResponse<unknown>> => {
    try {
      const res = await apiClient.get<TimetableEntryDto[]>('/student/timetable')
      return ok(groupTimetable(res.data))
    } catch (e) { return fail(e) }
  },

  getStudentHomework: async (_studentId: string): Promise<ApiResponse<unknown>> => {
    try {
      const res = await apiClient.get<AssignmentDto[]>('/student/assignments')
      return ok(mapAssignments(res.data))
    } catch (e) { return fail(e) }
  },

  getStudentInvoice: async (_studentId: string): Promise<ApiResponse<unknown>> => {
    try {
      const res = await apiClient.get<InvoiceDto>('/student/fees/invoice')
      return ok(res.data)
    } catch (e) { return fail(e) }
  },

  getAnnouncements: async (_role: UserRole): Promise<ApiResponse<unknown[]>> => {
    return ok([])
  },

  getTeacherClasses: async (_staffId: string): Promise<ApiResponse<unknown>> => {
    try {
      const res = await apiClient.get<{ id: number; name: string; section?: string; fullName: string; studentCount: number }[]>('/teacher/classes')
      return ok(res.data.map(c => ({
        id: c.id.toString(), name: c.fullName, grade: c.name, stream: c.section ?? '',
        studentCount: c.studentCount,
      })))
    } catch (e) { return fail(e) }
  },

  getClassStudents: async (classId: string): Promise<ApiResponse<unknown>> => {
    try {
      const res = await apiClient.get<{ id: number; userId: number; fullName: string; gender?: string }[]>(`/teacher/classes/${classId}/students`)
      return ok(res.data.map(s => ({
        id: s.id.toString(), userId: s.userId.toString(),
        fullName: s.fullName, firstName: s.fullName.split(' ')[0],
        lastName: s.fullName.split(' ').slice(1).join(' '),
        gender: s.gender, classId,
      })))
    } catch (e) { return fail(e) }
  },

  getClassGrades: async (classId: string, _termId?: string): Promise<ApiResponse<unknown>> => {
    try {
      const res = await apiClient.get<GradeResponseDto[]>(`/teacher/grades/class/${classId}`)
      return ok(res.data.map(g => ({
        id: g.id.toString(), studentId: g.studentId.toString(),
        studentName: g.studentName, subjectId: g.subjectName,
        subjectName: g.subjectName, classId, termId: 'current',
        total: g.percentage, ca: g.score, exam: null,
        remarks: g.remarks ?? '', assessmentType: g.assessmentType,
      })))
    } catch (e) { return fail(e) }
  },

  getClassAttendance: async (classId: string, _termId?: string): Promise<ApiResponse<unknown>> => {
    try {
      const res = await apiClient.get<AttendanceRecordDto[]>(`/teacher/attendance/class/${classId}/today`)
      return ok(res.data.map(r => ({
        id: r.id.toString(), studentId: r.studentId.toString(),
        date: r.date?.split('T')[0] ?? new Date().toISOString().split('T')[0],
        status: r.status?.toLowerCase() ?? 'present',
        termId: 'current', classId, remarks: r.remarks ?? '',
      })))
    } catch (e) { return fail(e) }
  },

  saveGrades: async (grades: unknown[]): Promise<ApiResponse<unknown>> => {
    try {
      const payload = (grades as { studentId: string; subjectId: string; total?: number; ca?: number; termId?: string }[]).map(g => ({
        studentId: parseInt(g.studentId),
        subjectId: parseInt(g.subjectId),
        score: g.ca ?? g.total ?? 0,
        maxScore: 100,
        assessmentType: g.termId ?? 'General',
        assessmentDate: new Date().toISOString(),
        remarks: '',
      }))
      const classId = (grades as { classId?: string }[])[0]?.classId
      if (!classId) return fail('No classId provided')
      const res = await apiClient.post(`/teacher/grades/class/${classId}/bulk`, payload)
      return ok(res.data)
    } catch (e) { return fail(e) }
  },

  saveAttendance: async (records: unknown[]): Promise<ApiResponse<unknown>> => {
    try {
      const payload = (records as { studentId: string; date: string; status: string; classId?: string }[]).map(r => ({
        studentId: parseInt(r.studentId),
        date: r.date,
        status: ['Present', 'Absent', 'Late', 'Excused'].findIndex(s => s.toLowerCase() === r.status.toLowerCase()),
        remarks: '',
      }))
      const classId = (records as { classId?: string }[])[0]?.classId
      if (!classId) return fail('No classId provided')
      const res = await apiClient.post(`/teacher/attendance/class/${classId}/bulk`, payload)
      return ok(res.data)
    } catch (e) { return fail(e) }
  },

  getTeacherTimetable: async (_staffId: string): Promise<ApiResponse<unknown>> => {
    try {
      const res = await apiClient.get<TimetableEntryDto[]>('/teacher/timetable')
      return ok(groupTimetable(res.data))
    } catch (e) { return fail(e) }
  },

  getLeaveRequests: async (_staffId: string): Promise<ApiResponse<unknown[]>> => {
    return ok([])
  },

  submitLeaveRequest: async (data: unknown): Promise<ApiResponse<unknown>> => {
    return ok({ id: Date.now().toString(), ...data as object, status: 'pending' })
  },

  getParentChildren: async (): Promise<ApiResponse<ChildDto[]>> => {
    try {
      const res = await apiClient.get<ChildDto[]>('/parent/children')
      return ok(res.data)
    } catch (e) { return fail(e) }
  },

  getParentChildProfile: async (childId: string): Promise<ApiResponse<unknown>> => {
    try {
      const childrenRes = await apiClient.get<ChildDto[]>('/parent/children')
      const child = childrenRes.data.find(c => c.id.toString() === childId)
      if (!child) return fail('Child not found')
      return ok({
        student: {
          id: child.id.toString(), admNo: `ADM${String(child.id).padStart(4, '0')}`,
          firstName: child.fullName.split(' ')[0], lastName: child.fullName.split(' ').slice(1).join(' '),
          dob: child.dateOfBirth ?? '', gender: (child.gender ?? 'Male') as 'Male' | 'Female',
          grade: child.className, classId: child.classId.toString(),
          photo: null, status: 'active' as const,
        },
        classInfo: { id: child.classId.toString(), name: child.className, grade: child.className, stream: '' },
        term: null, invoice: null,
      })
    } catch (e) { return fail(e) }
  },

  getParentChildGrades: async (childId: string): Promise<ApiResponse<unknown>> => {
    try {
      const res = await apiClient.get<GradeResponseDto[]>(`/parent/children/${childId}/grades`)
      return ok(groupGradesByYearTerm(res.data))
    } catch (e) { return fail(e) }
  },

  getParentChildAttendance: async (childId: string): Promise<ApiResponse<unknown>> => {
    try {
      const res = await apiClient.get<AttendanceRecordDto[]>(`/parent/children/${childId}/attendance`)
      return ok(calcAttendanceStats(res.data))
    } catch (e) { return fail(e) }
  },

  getParentChildTimetable: async (childId: string): Promise<ApiResponse<unknown>> => {
    try {
      const res = await apiClient.get<TimetableEntryDto[]>(`/parent/children/${childId}/timetable`)
      return ok(groupTimetable(res.data))
    } catch (e) { return fail(e) }
  },

  getParentChildFees: async (childId: string): Promise<ApiResponse<unknown>> => {
    try {
      const res = await apiClient.get<InvoiceDto>(`/parent/children/${childId}/fees`)
      return ok(res.data)
    } catch (e) { return fail(e) }
  },

  getParentChildAssignments: async (childId: string): Promise<ApiResponse<unknown>> => {
    try {
      const res = await apiClient.get<AssignmentDto[]>(`/parent/children/${childId}/assignments`)
      return ok(mapAssignments(res.data))
    } catch (e) { return fail(e) }
  },
}
