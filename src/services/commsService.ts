import { apiClient } from './apiClient'

export const commsService = {
  // Announcements
  listAnnouncements: () =>
    apiClient.get('/admin/announcements').then(r => r.data),

  createAnnouncement: (dto: any, _createdBy?: string) =>
    apiClient.post('/admin/announcements', dto).then(r => r.data),

  updateAnnouncement: (id: number, dto: any) =>
    apiClient.put(`/admin/announcements/${id}`, dto).then(r => r.data),

  deleteAnnouncement: (id: number) =>
    apiClient.delete(`/admin/announcements/${id}`).then(r => r.data),

  togglePublish: (id: number) =>
    apiClient.post(`/admin/announcements/${id}/publish`).then(r => r.data),

  // Messages
  listMessages: (_userId?: string) =>
    apiClient.get('/admin/messages/inbox').then(r => r.data),

  listInbox: (_userId?: string) =>
    apiClient.get('/admin/messages/inbox').then(r => r.data),

  listAdminInbox: () =>
    apiClient.get('/admin/messages/inbox').then(r => r.data),

  getAdminUnreadCount: () =>
    apiClient.get('/admin/messages/inbox').then(r => {
      const msgs = r.data.data || []
      return { success: true, data: msgs.length, error: null }
    }),

  getThread: (threadId: string) =>
    apiClient.get(`/admin/messages/thread/${threadId}`).then(r => r.data),

  sendMessage: (dto: any, _threadId?: string) =>
    apiClient.post('/admin/messages', dto).then(r => r.data),

  markRead: (id: number) =>
    apiClient.patch(`/admin/messages/${id}/read`).then(r => r.data),

  deleteMessage: (id: number) =>
    apiClient.delete(`/admin/messages/${id}`).then(r => r.data),

  // Meeting Slots
  listMeetingSlots: () =>
    apiClient.get('/admin/meeting-slots').then(r => r.data),

  createMeetingSlot: (dto: any) =>
    apiClient.post('/admin/meeting-slots', dto).then(r => r.data),

  cancelSlot: (id: number) =>
    apiClient.patch(`/admin/meeting-slots/${id}/cancel`).then(r => r.data),

  deleteMeetingSlot: (id: number) =>
    apiClient.delete(`/admin/meeting-slots/${id}`).then(r => r.data),

  // Legacy
  broadcast: (title: string, body: string, _targetRoles: any, _priority: any, createdBy: string) =>
    apiClient.post('/admin/announcements', { title, content: body, createdBy }).then(r => r.data),
}
