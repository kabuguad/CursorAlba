import { mockGet, mockPost, mockPut, mockDelete, newId } from './mockApi'
import { getDB, mutateDB } from './db'
import type { Message, Announcement, MeetingSlot, UserRole } from './db'
import { addAudit } from './auditService'

export type { Message, Announcement, MeetingSlot }

export const commsService = {
  // Messages
  listMessages: (userId: string) => mockGet(() => {
    const db = getDB()
    return db.messages.filter(m => m.toId === userId || m.fromId === userId)
      .sort((a, b) => b.sentAt.localeCompare(a.sentAt))
  }),

  listInbox: (userId: string) => mockGet(() => {
    return getDB().messages.filter(m => m.toId === userId)
      .sort((a, b) => b.sentAt.localeCompare(a.sentAt))
  }),

  listAdminInbox: () => mockGet(() => {
    const db = getDB()
    const adminIds = db.users.filter(u => u.role === 'admin').map(u => u.id)
    return db.messages.filter(m => adminIds.includes(m.toId))
      .sort((a, b) => b.sentAt.localeCompare(a.sentAt))
  }),

  getThread: (threadId: string) => mockGet(() => {
    return getDB().messages.filter(m => m.threadId === threadId)
      .sort((a, b) => a.sentAt.localeCompare(b.sentAt))
  }),

  sendMessage: (data: Omit<Message, 'id' | 'sentAt' | 'readAt' | 'threadId'>, replyToThreadId?: string) => mockPost(() => {
    const msg: Message = {
      id: newId('MSG'),
      ...data,
      sentAt: new Date().toISOString(),
      readAt: null,
      threadId: replyToThreadId ?? newId('THR'),
    }
    mutateDB(db => { db.messages.push(msg) })
    addAudit({ action: 'CREATE', resource: 'Message', resourceId: msg.id, details: `Message sent to ${data.toName}: ${data.subject}` })
    return msg
  }),

  markRead: (messageId: string) => mockPut(() => {
    mutateDB(db => {
      const m = db.messages.find(x => x.id === messageId)
      if (m && !m.readAt) m.readAt = new Date().toISOString()
    })
    return true
  }),

  deleteMessage: (id: string) => mockDelete(() => {
    mutateDB(db => { db.messages = db.messages.filter(m => m.id !== id) })
  }),

  // Announcements
  listAnnouncements: () => mockGet(() => getDB().announcements.sort((a, b) => b.createdAt.localeCompare(a.createdAt))),

  createAnnouncement: (data: Omit<Announcement, 'id' | 'createdAt' | 'readCount'>, createdBy: string) => mockPost(() => {
    const ann: Announcement = {
      id: newId('ANN'),
      ...data,
      createdBy,
      createdAt: new Date().toISOString(),
      readCount: 0,
    }
    mutateDB(db => { db.announcements.push(ann) })
    addAudit({ action: 'CREATE', resource: 'Announcement', resourceId: ann.id, details: `Published: ${ann.title}` })
    return ann
  }),

  updateAnnouncement: (id: string, data: Partial<Announcement>) => mockPut(() => {
    let updated: Announcement | undefined
    mutateDB(db => {
      const idx = db.announcements.findIndex(a => a.id === id)
      if (idx < 0) throw new Error('Announcement not found')
      db.announcements[idx] = { ...db.announcements[idx], ...data }
      updated = db.announcements[idx]
    })
    addAudit({ action: 'UPDATE', resource: 'Announcement', resourceId: id, details: `Updated: ${updated?.title}` })
    return updated!
  }),

  deleteAnnouncement: (id: string) => mockDelete(() => {
    mutateDB(db => { db.announcements = db.announcements.filter(a => a.id !== id) })
    addAudit({ action: 'DELETE', resource: 'Announcement', resourceId: id, details: 'Announcement deleted' })
  }),

  // Meeting Slots
  listMeetingSlots: () => mockGet(() => getDB().meetingSlots.sort((a, b) => a.date.localeCompare(b.date))),

  createMeetingSlot: (data: Omit<MeetingSlot, 'id' | 'bookedByParentId' | 'bookedByParentName' | 'studentId' | 'status'>) => mockPost(() => {
    const slot: MeetingSlot = {
      id: newId('MSL'),
      ...data,
      bookedByParentId: null,
      bookedByParentName: null,
      studentId: null,
      status: 'available',
    }
    mutateDB(db => { db.meetingSlots.push(slot) })
    addAudit({ action: 'CREATE', resource: 'MeetingSlot', resourceId: slot.id, details: `Slot created: ${data.teacherName} on ${data.date}` })
    return slot
  }),

  cancelSlot: (id: string) => mockPut(() => {
    mutateDB(db => {
      const s = db.meetingSlots.find(x => x.id === id)
      if (s) s.status = 'cancelled'
    })
    return true
  }),

  deleteMeetingSlot: (id: string) => mockDelete(() => {
    mutateDB(db => { db.meetingSlots = db.meetingSlots.filter(s => s.id !== id) })
  }),

  getUnreadCount: (userId: string) => mockGet(() => {
    return getDB().messages.filter(m => m.toId === userId && !m.readAt).length
  }),

  getAdminUnreadCount: () => mockGet(() => {
    const db = getDB()
    const adminIds = db.users.filter(u => u.role === 'admin').map(u => u.id)
    return db.messages.filter(m => adminIds.includes(m.toId) && !m.readAt).length
  }),

  broadcast: (title: string, body: string, targetRoles: UserRole[], priority: Announcement['priority'], createdBy: string) =>
    commsService.createAnnouncement({ title, body, targetRoles, targetGrades: [], priority, publishAt: new Date().toISOString(), expiresAt: null, status: 'published' }, createdBy),
}
