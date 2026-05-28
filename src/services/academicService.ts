import { mockGet, mockPost, mockPut, mockDelete, newId } from './mockApi'
import { getDB, mutateDB } from './db'
import type { AcademicYear, SchoolClass, Subject, AssessmentScheme, Exam, Term } from './db'
import { addAudit } from './auditService'

export type { AcademicYear, SchoolClass, Subject, AssessmentScheme, Exam, Term }

export const academicService = {
  // Academic Years & Terms
  listYears: () => mockGet(() => getDB().academicYears),

  getCurrentYear: () => mockGet(() => getDB().academicYears.find(y => y.isCurrent) ?? getDB().academicYears[0]),

  getCurrentTerm: () => mockGet(() => {
    const year = getDB().academicYears.find(y => y.isCurrent)
    return year?.terms.find(t => t.isCurrent) ?? year?.terms[0] ?? null
  }),

  createYear: (label: string, terms: Omit<Term, 'id'>[]) => mockPost(() => {
    const year: AcademicYear = {
      id: newId('YEAR'),
      label,
      isCurrent: false,
      terms: terms.map(t => ({ ...t, id: newId('TERM') })),
    }
    mutateDB(db => { db.academicYears.push(year) })
    addAudit({ action: 'CREATE', resource: 'AcademicYear', resourceId: year.id, details: `Created academic year: ${label}` })
    return year
  }),

  setCurrentYear: (yearId: string, termId: string) => mockPut(() => {
    mutateDB(db => {
      db.academicYears.forEach(y => {
        y.isCurrent = y.id === yearId
        y.terms.forEach(t => { t.isCurrent = t.id === termId })
      })
      db.settings.currentAcademicYearId = yearId
      db.settings.currentTermId = termId
    })
    addAudit({ action: 'UPDATE', resource: 'AcademicYear', resourceId: yearId, details: `Set as current year/term` })
    return getDB().academicYears.find(y => y.id === yearId)!
  }),

  // Classes
  listClasses: () => mockGet(() => getDB().classes),

  createClass: (data: Omit<SchoolClass, 'id'>) => mockPost(() => {
    const cls: SchoolClass = { id: newId('CLS'), ...data }
    mutateDB(db => { db.classes.push(cls) })
    addAudit({ action: 'CREATE', resource: 'Class', resourceId: cls.id, details: `Created class: ${cls.grade} ${cls.stream}` })
    return cls
  }),

  updateClass: (id: string, data: Partial<SchoolClass>) => mockPut(() => {
    let updated: SchoolClass | undefined
    mutateDB(db => {
      const idx = db.classes.findIndex(c => c.id === id)
      if (idx < 0) throw new Error('Class not found')
      db.classes[idx] = { ...db.classes[idx], ...data }
      updated = db.classes[idx]
    })
    addAudit({ action: 'UPDATE', resource: 'Class', resourceId: id, details: `Updated class: ${updated?.grade} ${updated?.stream}` })
    return updated!
  }),

  deleteClass: (id: string) => mockDelete(() => {
    mutateDB(db => { db.classes = db.classes.filter(c => c.id !== id) })
    addAudit({ action: 'DELETE', resource: 'Class', resourceId: id, details: 'Class deleted' })
  }),

  // Subjects
  listSubjects: () => mockGet(() => getDB().subjects),

  createSubject: (data: Omit<Subject, 'id'>) => mockPost(() => {
    const sub: Subject = { id: newId('SUB'), ...data }
    mutateDB(db => { db.subjects.push(sub) })
    addAudit({ action: 'CREATE', resource: 'Subject', resourceId: sub.id, details: `Created subject: ${sub.name}` })
    return sub
  }),

  updateSubject: (id: string, data: Partial<Subject>) => mockPut(() => {
    let updated: Subject | undefined
    mutateDB(db => {
      const idx = db.subjects.findIndex(s => s.id === id)
      if (idx < 0) throw new Error('Subject not found')
      db.subjects[idx] = { ...db.subjects[idx], ...data }
      updated = db.subjects[idx]
    })
    return updated!
  }),

  deleteSubject: (id: string) => mockDelete(() => {
    mutateDB(db => { db.subjects = db.subjects.filter(s => s.id !== id) })
  }),

  // Assessment Schemes
  listSchemes: () => mockGet(() => getDB().assessmentSchemes),

  createScheme: (data: Omit<AssessmentScheme, 'id'>) => mockPost(() => {
    const scheme: AssessmentScheme = { id: newId('ASC'), ...data }
    mutateDB(db => { db.assessmentSchemes.push(scheme) })
    addAudit({ action: 'CREATE', resource: 'AssessmentScheme', resourceId: scheme.id, details: `Created scheme: ${scheme.name}` })
    return scheme
  }),

  updateScheme: (id: string, data: Partial<AssessmentScheme>) => mockPut(() => {
    let updated: AssessmentScheme | undefined
    mutateDB(db => {
      const idx = db.assessmentSchemes.findIndex(s => s.id === id)
      if (idx < 0) throw new Error('Scheme not found')
      db.assessmentSchemes[idx] = { ...db.assessmentSchemes[idx], ...data }
      updated = db.assessmentSchemes[idx]
    })
    return updated!
  }),

  deleteScheme: (id: string) => mockDelete(() => {
    mutateDB(db => { db.assessmentSchemes = db.assessmentSchemes.filter(s => s.id !== id) })
  }),

  // Exams
  listExams: () => mockGet(() => getDB().exams),

  createExam: (data: Omit<Exam, 'id' | 'createdAt'>) => mockPost(() => {
    const exam: Exam = { id: newId('EXM'), ...data, createdAt: new Date().toISOString() }
    mutateDB(db => { db.exams.push(exam) })
    addAudit({ action: 'CREATE', resource: 'Exam', resourceId: exam.id, details: `Scheduled exam: ${exam.name}` })
    return exam
  }),

  updateExam: (id: string, data: Partial<Exam>) => mockPut(() => {
    let updated: Exam | undefined
    mutateDB(db => {
      const idx = db.exams.findIndex(e => e.id === id)
      if (idx < 0) throw new Error('Exam not found')
      db.exams[idx] = { ...db.exams[idx], ...data }
      updated = db.exams[idx]
    })
    addAudit({ action: 'UPDATE', resource: 'Exam', resourceId: id, details: `Updated exam: ${updated?.name}` })
    return updated!
  }),

  deleteExam: (id: string) => mockDelete(() => {
    mutateDB(db => { db.exams = db.exams.filter(e => e.id !== id) })
    addAudit({ action: 'DELETE', resource: 'Exam', resourceId: id, details: 'Exam deleted' })
  }),
}
