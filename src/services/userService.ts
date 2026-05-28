import { mockGet, mockPost, mockPut, mockDelete, newId } from './mockApi'
import { getDB, mutateDB } from './db'
import type { SystemUser, UserRole, UserStatus } from './db'
import { addAudit } from './auditService'

export type { SystemUser }

export interface CreateUserDto {
  name: string; email: string; role: UserRole; phone: string
  status: UserStatus; permissions: string[]; linkedId: string | null
}

export const userService = {
  list: () => mockGet(() => getDB().users),

  getById: (id: string) => mockGet(() => {
    const u = getDB().users.find(x => x.id === id)
    if (!u) throw new Error('User not found')
    return u
  }),

  create: (dto: CreateUserDto) => mockPost(() => {
    const user: SystemUser = {
      id: newId('USR'),
      ...dto,
      lastLogin: null,
      avatar: null,
      createdAt: new Date().toISOString(),
    }
    mutateDB(db => { db.users.push(user) })
    addAudit({ action: 'CREATE', resource: 'User', resourceId: user.id, details: `Created user: ${user.name} (${user.role})` })
    return user
  }),

  update: (id: string, dto: Partial<CreateUserDto>) => mockPut(() => {
    let updated: SystemUser | undefined
    mutateDB(db => {
      const idx = db.users.findIndex(u => u.id === id)
      if (idx < 0) throw new Error('User not found')
      db.users[idx] = { ...db.users[idx], ...dto }
      updated = db.users[idx]
    })
    addAudit({ action: 'UPDATE', resource: 'User', resourceId: id, details: `Updated user: ${updated?.name}` })
    return updated!
  }),

  updateStatus: (id: string, status: UserStatus) => mockPut(() => {
    let updated: SystemUser | undefined
    mutateDB(db => {
      const idx = db.users.findIndex(u => u.id === id)
      if (idx < 0) throw new Error('User not found')
      db.users[idx].status = status
      updated = db.users[idx]
    })
    addAudit({ action: 'UPDATE', resource: 'User', resourceId: id, details: `Status changed to: ${status}` })
    return updated!
  }),

  delete: (id: string) => mockDelete(() => {
    mutateDB(db => { db.users = db.users.filter(u => u.id !== id) })
    addAudit({ action: 'DELETE', resource: 'User', resourceId: id, details: 'User account deleted' })
  }),

  getStats: () => mockGet(() => {
    const users = getDB().users
    return {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      byRole: {
        admin: users.filter(u => u.role === 'admin').length,
        teacher: users.filter(u => u.role === 'teacher').length,
        parent: users.filter(u => u.role === 'parent').length,
        student: users.filter(u => u.role === 'student').length,
      },
    }
  }),
}
