import { apiClient } from './apiClient'

export const transportService = {
  listRoutes: () =>
    apiClient.get('/admin/transport/routes').then(r => r.data),

  createRoute: (dto: any) =>
    apiClient.post('/admin/transport/routes', dto).then(r => r.data),

  updateRoute: (id: number, dto: any) =>
    apiClient.put(`/admin/transport/routes/${id}`, dto).then(r => r.data),

  deleteRoute: (id: number) =>
    apiClient.delete(`/admin/transport/routes/${id}`).then(r => r.data),

  getRouteStudents: (routeId: number) =>
    apiClient.get(`/admin/transport/routes/${routeId}/students`).then(r => r.data),

  listVehicles: () =>
    apiClient.get('/admin/transport/vehicles').then(r => r.data),

  createVehicle: (dto: any) =>
    apiClient.post('/admin/transport/vehicles', dto).then(r => r.data),

  updateVehicle: (id: number, dto: any) =>
    apiClient.put(`/admin/transport/vehicles/${id}`, dto).then(r => r.data),

  deleteVehicle: (id: number) =>
    apiClient.delete(`/admin/transport/vehicles/${id}`).then(r => r.data),

  getStats: () =>
    apiClient.get('/admin/transport/stats').then(r => r.data),
}
