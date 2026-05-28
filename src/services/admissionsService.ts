import { mockGet, mockPost, mockPut, mockDelete, newId } from './mockApi'
import { getDB, mutateDB } from './db'
import type { AdmissionApplication } from './db'
import { addAudit } from './auditService'

export type { AdmissionApplication }

export const admissionsService = {
  list: () => mockGet(() => getDB().admissions.sort((a, b) => b.submittedDate.localeCompare(a.submittedDate))),

  getById: (id: string) => mockGet(() => {
    const a = getDB().admissions.find(x => x.id === id)
    if (!a) throw new Error('Application not found')
    return a
  }),

  create: (data: Omit<AdmissionApplication, 'id' | 'status' | 'notes' | 'assignedTo'>) => mockPost(() => {
    const app: AdmissionApplication = {
      id: newId('APP'),
      ...data,
      status: 'pending',
      notes: '',
      assignedTo: null,
    }
    mutateDB(db => { db.admissions.push(app) })
    addAudit({ action: 'CREATE', resource: 'Admission', resourceId: app.id, details: `New application: ${app.childFirstName} ${app.childLastName}` })
    return app
  }),

  updateStatus: (id: string, status: AdmissionApplication['status'], notes: string, assignedTo?: string) => mockPut(() => {
    let updated: AdmissionApplication | undefined
    mutateDB(db => {
      const idx = db.admissions.findIndex(a => a.id === id)
      if (idx < 0) throw new Error('Application not found')
      db.admissions[idx] = { ...db.admissions[idx], status, notes, assignedTo: assignedTo ?? db.admissions[idx].assignedTo }
      updated = db.admissions[idx]
    })
    addAudit({ action: 'UPDATE', resource: 'Admission', resourceId: id, details: `Status → ${status}: ${updated?.childFirstName} ${updated?.childLastName}` })
    return updated!
  }),

  delete: (id: string) => mockDelete(() => {
    mutateDB(db => { db.admissions = db.admissions.filter(a => a.id !== id) })
    addAudit({ action: 'DELETE', resource: 'Admission', resourceId: id, details: 'Application deleted' })
  }),

  getStats: () => mockGet(() => {
    const apps = getDB().admissions
    return {
      total: apps.length,
      pending: apps.filter(a => a.status === 'pending').length,
      reviewing: apps.filter(a => a.status === 'reviewing').length,
      approved: apps.filter(a => a.status === 'approved').length,
      rejected: apps.filter(a => a.status === 'rejected').length,
    }
  }),
}
