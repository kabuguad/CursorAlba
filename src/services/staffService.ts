import { apiClient } from './apiClient'

export interface StaffMember {
  id: string; userId: number; firstName: string; lastName: string; email: string
  qualification: string | null; specialization: string | null; hireDate: string | null
  role: string; status: string
}

export interface LeaveRequest {
  id: string; teacherId: number; type: string; startDate: string; endDate: string
  reason: string; status: string; submittedAt: string; reviewedAt: string | null; reviewNotes: string | null
}

export const staffService = {
  list: () =>
    apiClient.get('/admin/staff').then(r => r.data),

  getById: (id: string) =>
    apiClient.get(`/admin/staff/${id}`).then(r => r.data),

  create: (dto: any) =>
    apiClient.post('/admin/staff', dto).then(r => r.data),

  update: (id: string, dto: any) =>
    apiClient.put(`/admin/staff/${id}`, dto).then(r => r.data),

  delete: (id: string) =>
    apiClient.delete(`/admin/staff/${id}`).then(r => r.data),

  getStats: () =>
    apiClient.get('/admin/staff/stats').then(r => r.data),

  listLeaveRequests: () =>
    apiClient.get('/admin/staff/leave').then(r => r.data).catch(() => ({ success: true, data: [], error: null })),

  reviewLeave: (id: string, status: string, notes: string, reviewerName: string) =>
    apiClient.patch(`/admin/staff/leave/${id}`, { status, reviewNotes: notes, reviewedBy: reviewerName }).then(r => r.data),
}
