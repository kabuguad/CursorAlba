import { apiClient } from './apiClient'

export const analyticsService = {
  getOverviewKpis: () =>
    apiClient.get('/admin/analytics/kpis').then(r => r.data),

  getEnrollmentTrend: () =>
    apiClient.get('/admin/analytics/enrollment-trend').then(r => r.data),

  getAttendanceTrend: () =>
    apiClient.get('/admin/analytics/attendance-trend').then(r => r.data),

  getFeeCollectionByLevel: () =>
    apiClient.get('/admin/analytics/fee-collection-by-level').then(r => r.data),

  getAcademicPerformance: () =>
    apiClient.get('/admin/analytics/academic-performance').then(r => r.data),

  getAdmissionsFunnel: () =>
    apiClient.get('/admin/analytics/admissions-funnel').then(r => r.data),

  getPaymentMethodBreakdown: () =>
    apiClient.get('/admin/analytics/payment-methods').then(r => r.data),

  getStaffDeptBreakdown: () =>
    apiClient.get('/admin/analytics/staff-by-dept').then(r => r.data),

  getRecentActivity: () =>
    apiClient.get('/admin/analytics/recent-activity').then(r => r.data),
}
