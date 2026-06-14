import { apiClient } from './apiClient'

export const userService = {
  list: () =>
    apiClient.get('/admin/users').then(r => r.data),

  getStats: () =>
    apiClient.get('/admin/users/stats').then(r => r.data),

  create: (dto: any) =>
    apiClient.post('/admin/users', dto).then(r => r.data),

  update: (id: string, dto: any) =>
    apiClient.put(`/admin/users/${id}`, dto).then(r => r.data),

  updateStatus: (id: string, status: string) =>
    apiClient.patch(`/admin/users/${id}/status`, { status }).then(r => r.data),

  delete: (id: string) =>
    apiClient.delete(`/admin/users/${id}`).then(r => r.data),
}
