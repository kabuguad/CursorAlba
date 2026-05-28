import { mockGet, mockPut, mockPost } from './mockApi'
import { getDB, mutateDB, resetDB } from './db'
import type { SystemSettings } from './db'
import { addAudit } from './auditService'

export type { SystemSettings }

export const systemService = {
  getSettings: () => mockGet(() => getDB().settings),

  updateSettings: (data: Partial<SystemSettings>) => mockPut(() => {
    mutateDB(db => { Object.assign(db.settings, data) })
    addAudit({ action: 'UPDATE', resource: 'SystemSettings', resourceId: null, details: 'System settings updated' })
    return getDB().settings
  }),

  setMaintenanceMode: (enabled: boolean, message?: string) => mockPut(() => {
    mutateDB(db => {
      db.settings.maintenanceMode = enabled
      if (message) db.settings.maintenanceMessage = message
    })
    addAudit({ action: 'UPDATE', resource: 'SystemSettings', resourceId: null, details: `Maintenance mode: ${enabled ? 'ON' : 'OFF'}` })
    return getDB().settings
  }),

  createBackup: () => mockPost(() => {
    const db = getDB()
    const backup = {
      exportedAt: new Date().toISOString(),
      version: '2.0',
      counts: {
        students: db.students.length,
        staff: db.staff.length,
        payments: db.payments.length,
        announcements: db.announcements.length,
      },
      data: db,
    }
    mutateDB(d => { d.settings.lastBackup = backup.exportedAt })
    addAudit({ action: 'EXPORT', resource: 'Database', resourceId: null, details: `Full backup created — ${db.students.length} students, ${db.staff.length} staff` })
    return {
      filename: `alber-backup-${backup.exportedAt.slice(0, 10)}.json`,
      size: `${(JSON.stringify(backup).length / 1024).toFixed(1)} KB`,
      exportedAt: backup.exportedAt,
      counts: backup.counts,
    }
  }, 'heavy'),

  resetToSeed: () => mockPost(() => {
    resetDB()
    return { reset: true }
  }, 'heavy'),

  getSystemHealth: () => mockGet(() => {
    const db = getDB()
    return {
      status: 'healthy' as const,
      database: { status: 'connected', records: db.students.length + db.staff.length + db.payments.length },
      lastBackup: db.settings.lastBackup,
      maintenanceMode: db.settings.maintenanceMode,
      smtpEnabled: db.settings.smtpEnabled,
      activeUsers: db.users.filter(u => u.status === 'active').length,
      currentTerm: db.settings.currentTermId,
      uptime: '99.8%',
    }
  }),

  getAcademicCalendar: () => mockGet(() => {
    return getDB().academicYears.find(y => y.isCurrent) ?? getDB().academicYears[0]
  }),
}
