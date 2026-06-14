import { apiClient } from './apiClient'

export const systemService = {
  getHealth: () =>
    apiClient.get('/admin/system/health').then(r => r.data),

  getSettings: () =>
    apiClient.get('/admin/system/settings').then(r => r.data),

  updateSettings: (settings: any) =>
    apiClient.put('/admin/system/settings', settings).then(r => r.data),

  createBackup: () =>
    apiClient.post('/admin/system/backup').then(r => r.data),

  setMaintenanceMode: (enabled: boolean, message?: string) =>
    apiClient.post('/admin/system/maintenance', { enabled, message }).then(r => r.data),
}
