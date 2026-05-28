import { mockGet } from './mockApi'
import { getDB, mutateDB, newId } from './db'
import type { AuditEntry, UserRole } from './db'

export type { AuditEntry }

// Used by all other services to log mutations — synchronous, no await needed
export function addAudit(entry: {
  action: AuditEntry['action']
  resource: string
  resourceId: string | null
  details: string
  userId?: string
  userName?: string
  userRole?: UserRole
}): void {
  const e: AuditEntry = {
    id: newId('AUD'),
    timestamp: new Date().toISOString(),
    userId: entry.userId ?? 'usr-a001',
    userName: entry.userName ?? 'Dr. Wanjiku Mwangi',
    userRole: entry.userRole ?? 'admin',
    action: entry.action,
    resource: entry.resource,
    resourceId: entry.resourceId,
    details: entry.details,
    ipAddress: '196.201.214.10',
    sessionId: 'sess-' + Math.random().toString(36).slice(2, 8),
  }
  try {
    mutateDB(db => {
      db.auditLog.unshift(e)
      if (db.auditLog.length > 500) db.auditLog = db.auditLog.slice(0, 500)
    })
  } catch { /* never crash */ }
}

export const auditService = {
  list: (filters?: { action?: string; resource?: string; userId?: string; from?: string; to?: string }) =>
    mockGet(() => {
      let logs = getDB().auditLog
      if (filters?.action) logs = logs.filter(l => l.action === filters.action)
      if (filters?.resource) logs = logs.filter(l => l.resource.toLowerCase().includes(filters.resource!.toLowerCase()))
      if (filters?.userId) logs = logs.filter(l => l.userId === filters.userId)
      if (filters?.from) logs = logs.filter(l => l.timestamp >= filters.from!)
      if (filters?.to) logs = logs.filter(l => l.timestamp <= filters.to! + 'T23:59:59Z')
      return logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    }),

  getStats: () => mockGet(() => {
    const logs = getDB().auditLog
    const today = new Date().toISOString().slice(0, 10)
    return {
      totalEntries: logs.length,
      todayEntries: logs.filter(l => l.timestamp.startsWith(today)).length,
      byAction: logs.reduce<Record<string, number>>((acc, l) => {
        acc[l.action] = (acc[l.action] ?? 0) + 1; return acc
      }, {}),
      byUser: logs.reduce<Record<string, number>>((acc, l) => {
        acc[l.userName] = (acc[l.userName] ?? 0) + 1; return acc
      }, {}),
      exports: logs.filter(l => l.action === 'EXPORT').length,
      deletes: logs.filter(l => l.action === 'DELETE').length,
    }
  }),
}
