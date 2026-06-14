import { apiClient } from './apiClient'

export interface Student {
  id: string; userId: number; fullName: string; className: string; classSection: string
  admissionNumber: string | null; dateOfBirth: string | null; gender: string | null
  address: string | null; status: string; enrolledDate: string | null
}

export const studentService = {
  list: () =>
    apiClient.get('/admin/students').then(r => r.data),

  getById: (id: string) =>
    apiClient.get(`/admin/students/${id}`).then(r => r.data),

  create: (dto: any) =>
    apiClient.post('/admin/students', dto).then(r => r.data),

  update: (id: string, dto: any) =>
    apiClient.put(`/admin/students/${id}`, dto).then(r => r.data),

  delete: (id: string) =>
    apiClient.delete(`/admin/students/${id}`).then(r => r.data),

  updateStatus: (id: string, status: string) =>
    apiClient.patch(`/admin/students/${id}/status`, { status }).then(r => r.data),

  getStats: () =>
    apiClient.get('/admin/users/stats').then(r => r.data),
}
