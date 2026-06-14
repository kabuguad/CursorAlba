import { apiClient } from './apiClient'

export const academicService = {
  // Academic Years
  listYears: () =>
    apiClient.get('/admin/academic-years').then(r => r.data),

  getCurrentYear: () =>
    apiClient.get('/admin/academic-years/current').then(r => r.data),

  getCurrentTerm: () =>
    apiClient.get('/admin/academic-years/current').then(r => {
      const data = r.data.data
      if (data?.terms?.length) {
        const currentTerm = data.terms.find((t: any) => t.isCurrent) || data.terms[0]
        return { success: true, data: currentTerm, error: null }
      }
      return { success: true, data: null, error: null }
    }),

  createYear: (label: string, terms: any[]) =>
    apiClient.post('/admin/academic-years', { label, terms }).then(r => r.data),

  setCurrentYear: (yearId: string, termId: string) =>
    apiClient.patch('/admin/academic-years/current', { yearId: Number(yearId), termId: Number(termId) }).then(r => r.data),

  // Classes
  listClasses: () =>
    apiClient.get('/admin/classes').then(r => r.data),

  createClass: (data: any) =>
    apiClient.post('/admin/classes', data).then(r => r.data),

  updateClass: (id: string, data: any) =>
    apiClient.put(`/admin/classes/${id}`, data).then(r => r.data),

  deleteClass: (id: string) =>
    apiClient.delete(`/admin/classes/${id}`).then(r => r.data),

  // Subjects
  listSubjects: () =>
    apiClient.get('/admin/subjects').then(r => r.data),

  createSubject: (data: any) =>
    apiClient.post('/admin/subjects', data).then(r => r.data),

  updateSubject: (id: string, data: any) =>
    apiClient.put(`/admin/subjects/${id}`, data).then(r => r.data),

  deleteSubject: (id: string) =>
    apiClient.delete(`/admin/subjects/${id}`).then(r => r.data),

  // Assessment Schemes
  listAssessmentSchemes: () =>
    apiClient.get('/admin/assessment-schemes').then(r => r.data),
  listSchemes: function () { return this.listAssessmentSchemes() },

  createScheme: (data: any) =>
    apiClient.post('/admin/assessment-schemes', data).then(r => r.data),
  updateScheme: (id: string, data: any) =>
    apiClient.put(`/admin/assessment-schemes/${id}`, data).then(r => r.data),

  deleteScheme: (id: string) =>
    apiClient.delete(`/admin/assessment-schemes/${id}`).then(r => r.data),

  // Exams
  listExams: () =>
    apiClient.get('/admin/exams').then(r => r.data),

  createExam: (data: any) =>
    apiClient.post('/admin/exams', data).then(r => r.data),

  updateExam: (id: string, data: any) =>
    apiClient.put(`/admin/exams/${id}`, data).then(r => r.data),

  deleteExam: (id: string) =>
    apiClient.delete(`/admin/exams/${id}`).then(r => r.data),

  // Timetable
  listTimetable: (classId: number) =>
    apiClient.get(`/admin/timetable/class/${classId}`).then(r => r.data),

  createTimetableEntry: (data: any) =>
    apiClient.post('/admin/timetable', data).then(r => r.data),

  updateTimetableEntry: (id: number, data: any) =>
    apiClient.put(`/admin/timetable/${id}`, data).then(r => r.data),

  deleteTimetableEntry: (id: number) =>
    apiClient.delete(`/admin/timetable/${id}`).then(r => r.data),
}
