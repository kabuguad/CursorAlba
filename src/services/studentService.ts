import { mockGet, mockPost, mockPut, mockDelete, newId } from './mockApi'
import { getDB, mutateDB } from './db'
import type { Student } from './db'
import { addAudit } from './auditService'

export type { Student }

export interface CreateStudentDto {
  firstName: string; lastName: string; dob: string; gender: 'Male' | 'Female'
  grade: string; classId: string; address: string; medicalNotes: string
  specialNeeds: string; previousSchool: string; documents: string[]
  transportRouteId: string | null
  emergencyContact: { name: string; phone: string; relation: string }
}

export const studentService = {
  list: () => mockGet(() => getDB().students),

  getById: (id: string) => mockGet(() => {
    const s = getDB().students.find(x => x.id === id)
    if (!s) throw new Error('Student not found')
    return s
  }),

  create: (dto: CreateStudentDto) => mockPost(() => {
    const db = getDB()
    const count = db.students.length + 1
    const student: Student = {
      id: newId('STU'),
      admNo: `ADM-${String(1000 + count).slice(1)}`,
      ...dto,
      parentIds: [],
      photo: null,
      status: 'active',
      enrolledDate: new Date().toISOString().slice(0, 10),
    }
    mutateDB(d => { d.students.push(student) })
    addAudit({ action: 'CREATE', resource: 'Student', resourceId: student.id, details: `Enrolled: ${student.firstName} ${student.lastName} (${student.admNo})` })
    return student
  }),

  update: (id: string, dto: Partial<CreateStudentDto>) => mockPut(() => {
    let updated: Student | undefined
    mutateDB(db => {
      const idx = db.students.findIndex(s => s.id === id)
      if (idx < 0) throw new Error('Student not found')
      db.students[idx] = { ...db.students[idx], ...dto }
      updated = db.students[idx]
    })
    addAudit({ action: 'UPDATE', resource: 'Student', resourceId: id, details: `Updated: ${updated?.firstName} ${updated?.lastName}` })
    return updated!
  }),

  updateStatus: (id: string, status: Student['status']) => mockPut(() => {
    let updated: Student | undefined
    mutateDB(db => {
      const idx = db.students.findIndex(s => s.id === id)
      if (idx < 0) throw new Error('Student not found')
      db.students[idx].status = status
      updated = db.students[idx]
    })
    addAudit({ action: 'UPDATE', resource: 'Student', resourceId: id, details: `Status → ${status}` })
    return updated!
  }),

  delete: (id: string) => mockDelete(() => {
    mutateDB(db => { db.students = db.students.filter(s => s.id !== id) })
    addAudit({ action: 'DELETE', resource: 'Student', resourceId: id, details: 'Student record deleted' })
  }),

  getStats: () => mockGet(() => {
    const students = getDB().students
    const byGrade: Record<string, number> = {}
    students.filter(s => s.status === 'active').forEach(s => {
      byGrade[s.grade] = (byGrade[s.grade] ?? 0) + 1
    })
    return {
      total: students.length,
      active: students.filter(s => s.status === 'active').length,
      graduated: students.filter(s => s.status === 'graduated').length,
      suspended: students.filter(s => s.status === 'suspended').length,
      byGrade,
      newThisTerm: students.filter(s => s.enrolledDate >= '2026-04-01').length,
    }
  }),
}
