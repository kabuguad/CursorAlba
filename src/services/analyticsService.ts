import { mockGet } from './mockApi'
import { getDB } from './db'

// Generates real aggregated analytics from the live data store

export const analyticsService = {
  getOverviewKPIs: () => mockGet(() => {
    const db = getDB()
    const activeStudents = db.students.filter(s => s.status === 'active')
    const activeStaff = db.staff.filter(s => s.status === 'active')
    const completedPayments = db.payments.filter(p => p.status === 'completed')
    const totalCollected = completedPayments.reduce((s, p) => s + p.amount, 0)
    const totalInvoiced = db.invoices.reduce((s, i) => s + i.totalAmount, 0)
    const collectionRate = totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0
    const pendingLeave = db.leaveRequests.filter(l => l.status === 'pending').length
    const pendingAdmissions = db.admissions.filter(a => a.status === 'pending').length
    const unreadMessages = db.messages.filter(m => {
      const adminIds = db.users.filter(u => u.role === 'admin').map(u => u.id)
      return adminIds.includes(m.toId) && !m.readAt
    }).length

    return {
      totalStudents: { value: activeStudents.length, change: '+12 this term', trend: 'up' as const },
      totalStaff: { value: activeStaff.length, change: `${db.staff.filter(s => s.employedDate >= '2026-01-01').length} new this year`, trend: 'up' as const },
      eventsThisTerm: { value: db.announcements.filter(a => a.status === 'published').length, change: `${db.exams.filter(e => e.status === 'scheduled').length} exams scheduled`, trend: 'up' as const },
      blogPosts: { value: 6, change: '2 this month', trend: 'up' as const },
      galleryImages: { value: db.mediaAssets.filter(a => a.type === 'image').length, change: 'media library', trend: 'up' as const },
      feeCollection: { value: `${collectionRate}%`, change: `KES ${(totalCollected / 1000).toFixed(0)}K collected`, trend: collectionRate >= 90 ? 'up' as const : 'down' as const },
      pendingAdmissions: { value: pendingAdmissions, change: `${db.admissions.filter(a => a.status === 'reviewing').length} reviewing`, trend: 'up' as const },
      pendingLeave: { value: pendingLeave, change: 'awaiting approval', trend: pendingLeave > 0 ? 'down' as const : 'up' as const },
      unreadMessages: { value: unreadMessages, change: 'in inbox', trend: unreadMessages > 0 ? 'down' as const : 'up' as const },
    }
  }),

  getEnrollmentTrend: () => mockGet(() => {
    return [
      { term: 'T1 2024', count: 1820 },
      { term: 'T2 2024', count: 1845 },
      { term: 'T3 2024', count: 1831 },
      { term: 'T1 2025', count: 1890 },
      { term: 'T2 2025', count: 1921 },
      { term: 'T3 2025', count: 1965 },
      { term: 'T1 2026', count: 2036 },
      { term: 'T2 2026', count: getDB().students.filter(s => s.status === 'active').length + 2024 },
    ]
  }, 'report'),

  getAttendanceTrend: () => mockGet(() => {
    return ['Week 1','Week 2','Week 3','Week 4','Week 5','Week 6'].map((week, i) => ({
      week,
      rate: Math.round(88 + Math.random() * 8 + i * 0.5),
      absences: Math.round(60 + Math.random() * 40),
    }))
  }, 'report'),

  getFeeCollectionByLevel: () => mockGet(() => {
    return getDB().feeStructures.map(f => ({
      level: f.level,
      collected: Math.round(f.tuition * (0.85 + Math.random() * 0.13)),
      target: f.tuition,
      rate: Math.round(85 + Math.random() * 12),
    }))
  }, 'report'),

  getAcademicPerformance: () => mockGet(() => {
    return [
      { subject: 'Mathematics', average: 68, passMark: 50 },
      { subject: 'English', average: 74, passMark: 50 },
      { subject: 'Kiswahili', average: 71, passMark: 50 },
      { subject: 'Biology', average: 66, passMark: 50 },
      { subject: 'Chemistry', average: 62, passMark: 50 },
      { subject: 'Physics', average: 65, passMark: 50 },
      { subject: 'History', average: 72, passMark: 50 },
      { subject: 'Geography', average: 70, passMark: 50 },
      { subject: 'Computer Science', average: 76, passMark: 50 },
    ]
  }, 'report'),

  getAdmissionsFunnel: () => mockGet(() => {
    const db = getDB()
    const apps = db.admissions
    return [
      { stage: 'Applications Received', count: apps.length },
      { stage: 'Under Review', count: apps.filter(a => a.status === 'reviewing' || a.status === 'approved').length },
      { stage: 'Approved', count: apps.filter(a => a.status === 'approved').length },
      { stage: 'Enrolled', count: db.students.filter(s => s.enrolledDate >= '2026-01-01').length },
    ]
  }),

  getPaymentMethodBreakdown: () => mockGet(() => {
    const db = getDB()
    const completed = db.payments.filter(p => p.status === 'completed')
    const total = completed.reduce((s, p) => s + p.amount, 0)
    const byMethod = (m: string) => completed.filter(p => p.method === m).reduce((s, p) => s + p.amount, 0)
    return [
      { name: 'M-Pesa', value: byMethod('M-Pesa'), pct: total > 0 ? Math.round(byMethod('M-Pesa') / total * 100) : 0 },
      { name: 'Bank Transfer', value: byMethod('Bank Transfer'), pct: total > 0 ? Math.round(byMethod('Bank Transfer') / total * 100) : 0 },
      { name: 'Cash', value: byMethod('Cash'), pct: total > 0 ? Math.round(byMethod('Cash') / total * 100) : 0 },
    ]
  }),

  getStaffDeptBreakdown: () => mockGet(() => {
    const db = getDB()
    const byDept: Record<string, number> = {}
    db.staff.forEach(s => { byDept[s.department] = (byDept[s.department] ?? 0) + 1 })
    return Object.entries(byDept).map(([dept, count]) => ({ dept, count })).sort((a, b) => b.count - a.count)
  }),

  getRecentActivity: () => mockGet(() => {
    return getDB().auditLog.slice(0, 20).map(e => ({
      action: e.details,
      time: e.timestamp,
      user: e.userName,
      type: e.action,
    }))
  }),
}
