import { mockGet, mockPost, mockPut, mockDelete, newId } from './mockApi'
import { getDB, mutateDB } from './db'
import type { StaffMember, LeaveRequest } from './db'
import { addAudit } from './auditService'

export type { StaffMember, LeaveRequest }

export interface CreateStaffDto {
  firstName: string; lastName: string; email: string; phone: string
  dob: string; gender: 'Male' | 'Female'; role: StaffMember['role']
  department: string; subjects: string[]; classIds: string[]
  tscNo: string; nationalId: string; qualification: string
  contractType: StaffMember['contractType']; contractEnd: string | null
  salaryGrade: string; address: string
}

export const staffService = {
  list: () => mockGet(() => getDB().staff),

  getById: (id: string) => mockGet(() => {
    const s = getDB().staff.find(x => x.id === id)
    if (!s) throw new Error('Staff member not found')
    return s
  }),

  create: (dto: CreateStaffDto) => mockPost(() => {
    const db = getDB()
    const count = db.staff.length + 1
    const member: StaffMember = {
      id: newId('STF'),
      staffNo: dto.role === 'teacher' ? `TSC-${2000 + count}` : `ADM-${3000 + count}`,
      ...dto,
      photo: null,
      employedDate: new Date().toISOString().slice(0, 10),
      status: 'active',
      bankAccount: '',
      nhif: '',
      nssf: '',
    }
    mutateDB(d => { d.staff.push(member) })
    addAudit({ action: 'CREATE', resource: 'Staff', resourceId: member.id, details: `Added staff: ${member.firstName} ${member.lastName} (${member.staffNo})` })
    return member
  }),

  update: (id: string, dto: Partial<CreateStaffDto>) => mockPut(() => {
    let updated: StaffMember | undefined
    mutateDB(db => {
      const idx = db.staff.findIndex(s => s.id === id)
      if (idx < 0) throw new Error('Staff not found')
      db.staff[idx] = { ...db.staff[idx], ...dto }
      updated = db.staff[idx]
    })
    addAudit({ action: 'UPDATE', resource: 'Staff', resourceId: id, details: `Updated: ${updated?.firstName} ${updated?.lastName}` })
    return updated!
  }),

  delete: (id: string) => mockDelete(() => {
    mutateDB(db => { db.staff = db.staff.filter(s => s.id !== id) })
    addAudit({ action: 'DELETE', resource: 'Staff', resourceId: id, details: 'Staff record deleted' })
  }),

  // Leave management
  listLeaveRequests: () => mockGet(() => getDB().leaveRequests, 'read'),

  reviewLeave: (id: string, status: 'approved' | 'rejected', notes: string, reviewerName: string) => mockPut(() => {
    let updated: LeaveRequest | undefined
    mutateDB(db => {
      const idx = db.leaveRequests.findIndex(l => l.id === id)
      if (idx < 0) throw new Error('Leave request not found')
      db.leaveRequests[idx] = {
        ...db.leaveRequests[idx],
        status,
        reviewedBy: reviewerName,
        reviewedAt: new Date().toISOString(),
        reviewNotes: notes,
      }
      updated = db.leaveRequests[idx]
    })
    addAudit({ action: 'UPDATE', resource: 'LeaveRequest', resourceId: id, details: `Leave ${status}: ${updated?.staffName}` })
    return updated!
  }),

  getStats: () => mockGet(() => {
    const staff = getDB().staff
    return {
      total: staff.length,
      active: staff.filter(s => s.status === 'active').length,
      onLeave: staff.filter(s => s.status === 'on_leave').length,
      byDept: staff.reduce<Record<string, number>>((acc, s) => {
        acc[s.department] = (acc[s.department] ?? 0) + 1; return acc
      }, {}),
      teachers: staff.filter(s => s.role === 'teacher').length,
      support: staff.filter(s => s.role !== 'teacher').length,
      contractsExpiringSoon: staff.filter(s => s.contractEnd && s.contractEnd <= '2026-12-31').length,
    }
  }),
}
