/**
 * Consolidated React Query hooks for all admin data domains.
 * Each hook wraps a service call with proper cache keys, loading states, and mutations.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { unwrap } from '../services/mockApi'
import { userService } from '../services/userService'
import { studentService } from '../services/studentService'
import { staffService } from '../services/staffService'
import { academicService } from '../services/academicService'
import { financeService } from '../services/financeService'
import { commsService } from '../services/commsService'
import { analyticsService } from '../services/analyticsService'
import { contentService } from '../services/contentService'
import { transportService } from '../services/transportService'
import { libraryService } from '../services/libraryService'
import { auditService } from '../services/auditService'
import { systemService } from '../services/systemService'
import { admissionsService } from '../services/admissionsService'

// ── Users ─────────────────────────────────────────────────────────────────
export const useUsers = () => useQuery({ queryKey: ['users'], queryFn: () => userService.list().then(unwrap) })
export const useUserStats = () => useQuery({ queryKey: ['users', 'stats'], queryFn: () => userService.getStats().then(unwrap) })
export const useCreateUser = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: userService.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }) })
}
export const useUpdateUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Parameters<typeof userService.update>[1] }) => userService.update(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}
export const useUpdateUserStatus = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Parameters<typeof userService.updateStatus>[1] }) => userService.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}
export const useDeleteUser = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: userService.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }) })
}

// ── Students ──────────────────────────────────────────────────────────────
export const useStudents = () => useQuery({ queryKey: ['students'], queryFn: () => studentService.list().then(unwrap) })
export const useStudentStats = () => useQuery({ queryKey: ['students', 'stats'], queryFn: () => studentService.getStats().then(unwrap) })
export const useCreateStudent = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: studentService.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }) })
}
export const useUpdateStudent = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Parameters<typeof studentService.update>[1] }) => studentService.update(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }),
  })
}
export const useUpdateStudentStatus = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Parameters<typeof studentService.updateStatus>[1] }) => studentService.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }),
  })
}
export const useDeleteStudent = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: studentService.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }) })
}

// ── Staff ─────────────────────────────────────────────────────────────────
export const useStaff = () => useQuery({ queryKey: ['staff'], queryFn: () => staffService.list().then(unwrap) })
export const useStaffStats = () => useQuery({ queryKey: ['staff', 'stats'], queryFn: () => staffService.getStats().then(unwrap) })
export const useLeaveRequests = () => useQuery({ queryKey: ['leave'], queryFn: () => staffService.listLeaveRequests().then(unwrap) })
export const useCreateStaff = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: staffService.create, onSuccess: () => { qc.invalidateQueries({ queryKey: ['staff'] }); qc.invalidateQueries({ queryKey: ['users'] }) } })
}
export const useUpdateStaff = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Parameters<typeof staffService.update>[1] }) => staffService.update(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['staff'] }),
  })
}
export const useDeleteStaff = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: staffService.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ['staff'] }) })
}
export const useReviewLeave = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, notes, reviewer }: { id: string; status: 'approved' | 'rejected'; notes: string; reviewer: string }) =>
      staffService.reviewLeave(id, status, notes, reviewer),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['leave'] }); qc.invalidateQueries({ queryKey: ['analytics'] }) },
  })
}

// ── Academics ─────────────────────────────────────────────────────────────
export const useAcademicYears = () => useQuery({ queryKey: ['academicYears'], queryFn: () => academicService.listYears().then(unwrap) })
export const useCurrentYear = () => useQuery({ queryKey: ['academicYears', 'current'], queryFn: () => academicService.getCurrentYear().then(unwrap) })
export const useCurrentTerm = () => useQuery({ queryKey: ['academicYears', 'currentTerm'], queryFn: () => academicService.getCurrentTerm().then(unwrap) })
export const useClasses = () => useQuery({ queryKey: ['classes'], queryFn: () => academicService.listClasses().then(unwrap) })
export const useSubjects = () => useQuery({ queryKey: ['subjects'], queryFn: () => academicService.listSubjects().then(unwrap) })
export const useAssessmentSchemes = () => useQuery({ queryKey: ['schemes'], queryFn: () => academicService.listSchemes().then(unwrap) })
export const useExams = () => useQuery({ queryKey: ['exams'], queryFn: () => academicService.listExams().then(unwrap) })
export const useCreateClass = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: academicService.createClass, onSuccess: () => qc.invalidateQueries({ queryKey: ['classes'] }) })
}
export const useUpdateClass = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof academicService.updateClass>[1] }) => academicService.updateClass(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['classes'] }),
  })
}
export const useDeleteClass = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: academicService.deleteClass, onSuccess: () => qc.invalidateQueries({ queryKey: ['classes'] }) })
}
export const useCreateSubject = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: academicService.createSubject, onSuccess: () => qc.invalidateQueries({ queryKey: ['subjects'] }) })
}
export const useDeleteSubject = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: academicService.deleteSubject, onSuccess: () => qc.invalidateQueries({ queryKey: ['subjects'] }) })
}
export const useCreateScheme = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: academicService.createScheme, onSuccess: () => qc.invalidateQueries({ queryKey: ['schemes'] }) })
}
export const useDeleteScheme = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: academicService.deleteScheme, onSuccess: () => qc.invalidateQueries({ queryKey: ['schemes'] }) })
}
export const useCreateExam = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: academicService.createExam, onSuccess: () => qc.invalidateQueries({ queryKey: ['exams'] }) })
}
export const useUpdateExam = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof academicService.updateExam>[1] }) => academicService.updateExam(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['exams'] }),
  })
}
export const useDeleteExam = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: academicService.deleteExam, onSuccess: () => qc.invalidateQueries({ queryKey: ['exams'] }) })
}
export const useSetCurrentYear = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ yearId, termId }: { yearId: string; termId: string }) => academicService.setCurrentYear(yearId, termId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['academicYears'] }); qc.invalidateQueries({ queryKey: ['settings'] }) },
  })
}

// ── Finance ───────────────────────────────────────────────────────────────
export const usePayments = () => useQuery({ queryKey: ['payments'], queryFn: () => financeService.listPayments().then(unwrap) })
export const useInvoices = () => useQuery({ queryKey: ['invoices'], queryFn: () => financeService.listInvoices().then(unwrap) })
export const useScholarships = () => useQuery({ queryKey: ['scholarships'], queryFn: () => financeService.listScholarships().then(unwrap) })
export const useExpenses = () => useQuery({ queryKey: ['expenses'], queryFn: () => financeService.listExpenses().then(unwrap) })
export const useFeeStructures = () => useQuery({ queryKey: ['feeStructures'], queryFn: () => financeService.listFeeStructures().then(unwrap) })
export const useFinanceSummary = () => useQuery({ queryKey: ['finance', 'summary'], queryFn: () => financeService.getSummary().then(unwrap) })
export const useAddPayment = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: financeService.addPayment, onSuccess: () => { qc.invalidateQueries({ queryKey: ['payments'] }); qc.invalidateQueries({ queryKey: ['invoices'] }); qc.invalidateQueries({ queryKey: ['finance'] }) } })
}
export const useUpdatePaymentStatus = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Parameters<typeof financeService.updatePaymentStatus>[1] }) => financeService.updatePaymentStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payments'] }),
  })
}
export const useGenerateInvoices = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: financeService.generateInvoices, onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }) })
}
export const useApplyDiscount = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, amount, reason }: { id: string; amount: number; reason: string }) => financeService.applyDiscount(id, amount, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  })
}
export const useCreateScholarship = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ data, approvedBy }: { data: Parameters<typeof financeService.createScholarship>[0]; approvedBy: string }) => financeService.createScholarship(data, approvedBy),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['scholarships'] }),
  })
}
export const useAddExpense = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: financeService.addExpense, onSuccess: () => { qc.invalidateQueries({ queryKey: ['expenses'] }); qc.invalidateQueries({ queryKey: ['finance'] }) } })
}
export const useApproveExpense = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: financeService.approveExpense, onSuccess: () => qc.invalidateQueries({ queryKey: ['expenses'] }) })
}
export const useUpdateFeeStructure = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof financeService.updateFeeStructure>[1] }) => financeService.updateFeeStructure(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['feeStructures'] }),
  })
}

// ── Communications ────────────────────────────────────────────────────────
export const useAdminInbox = () => useQuery({ queryKey: ['inbox', 'admin'], queryFn: () => commsService.listAdminInbox().then(unwrap), refetchInterval: 30000 })
export const useAnnouncements = () => useQuery({ queryKey: ['announcements'], queryFn: () => commsService.listAnnouncements().then(unwrap) })
export const useMeetingSlots = () => useQuery({ queryKey: ['meetingSlots'], queryFn: () => commsService.listMeetingSlots().then(unwrap) })
export const useAdminUnreadCount = () => useQuery({ queryKey: ['inbox', 'unread'], queryFn: () => commsService.getAdminUnreadCount().then(unwrap), refetchInterval: 30000 })
export const useSendMessage = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ data, threadId }: { data: Parameters<typeof commsService.sendMessage>[0]; threadId?: string }) => commsService.sendMessage(data, threadId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inbox'] }),
  })
}
export const useMarkRead = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: commsService.markRead, onSuccess: () => { qc.invalidateQueries({ queryKey: ['inbox'] }) } })
}
export const useCreateAnnouncement = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ data, createdBy }: { data: Parameters<typeof commsService.createAnnouncement>[0]; createdBy: string }) => commsService.createAnnouncement(data, createdBy),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['announcements'] }),
  })
}
export const useUpdateAnnouncement = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof commsService.updateAnnouncement>[1] }) => commsService.updateAnnouncement(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['announcements'] }),
  })
}
export const useDeleteAnnouncement = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: commsService.deleteAnnouncement, onSuccess: () => qc.invalidateQueries({ queryKey: ['announcements'] }) })
}
export const useCreateMeetingSlot = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: commsService.createMeetingSlot, onSuccess: () => qc.invalidateQueries({ queryKey: ['meetingSlots'] }) })
}
export const useDeleteMeetingSlot = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: commsService.deleteMeetingSlot, onSuccess: () => qc.invalidateQueries({ queryKey: ['meetingSlots'] }) })
}

// ── Analytics ─────────────────────────────────────────────────────────────
export const useOverviewKPIs = () => useQuery({ queryKey: ['analytics', 'kpis'], queryFn: () => analyticsService.getOverviewKPIs().then(unwrap), refetchInterval: 60000 })
export const useEnrollmentTrend = () => useQuery({ queryKey: ['analytics', 'enrollment'], queryFn: () => analyticsService.getEnrollmentTrend().then(unwrap) })
export const useAttendanceTrend = () => useQuery({ queryKey: ['analytics', 'attendance'], queryFn: () => analyticsService.getAttendanceTrend().then(unwrap) })
export const useFeeCollectionByLevel = () => useQuery({ queryKey: ['analytics', 'feeLevel'], queryFn: () => analyticsService.getFeeCollectionByLevel().then(unwrap) })
export const useAcademicPerformance = () => useQuery({ queryKey: ['analytics', 'academic'], queryFn: () => analyticsService.getAcademicPerformance().then(unwrap) })
export const useAdmissionsFunnel = () => useQuery({ queryKey: ['analytics', 'funnel'], queryFn: () => analyticsService.getAdmissionsFunnel().then(unwrap) })
export const usePaymentMethodBreakdown = () => useQuery({ queryKey: ['analytics', 'paymentMethod'], queryFn: () => analyticsService.getPaymentMethodBreakdown().then(unwrap) })
export const useStaffDeptBreakdown = () => useQuery({ queryKey: ['analytics', 'staffDept'], queryFn: () => analyticsService.getStaffDeptBreakdown().then(unwrap) })
export const useRecentActivity = () => useQuery({ queryKey: ['analytics', 'activity'], queryFn: () => analyticsService.getRecentActivity().then(unwrap), refetchInterval: 30000 })

// ── Content / Media ───────────────────────────────────────────────────────
export const useMediaAssets = () => useQuery({ queryKey: ['media'], queryFn: () => contentService.listMedia().then(unwrap) })
export const useUploadMedia = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: contentService.uploadMedia, onSuccess: () => qc.invalidateQueries({ queryKey: ['media'] }) })
}
export const useDeleteMedia = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: contentService.deleteMedia, onSuccess: () => qc.invalidateQueries({ queryKey: ['media'] }) })
}

// ── Transport ─────────────────────────────────────────────────────────────
export const useTransportRoutes = () => useQuery({ queryKey: ['transport', 'routes'], queryFn: () => transportService.listRoutes().then(unwrap) })
export const useVehicles = () => useQuery({ queryKey: ['transport', 'vehicles'], queryFn: () => transportService.listVehicles().then(unwrap) })
export const useTransportStats = () => useQuery({ queryKey: ['transport', 'stats'], queryFn: () => transportService.getStats().then(unwrap) })
export const useCreateRoute = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: transportService.createRoute, onSuccess: () => qc.invalidateQueries({ queryKey: ['transport'] }) })
}
export const useUpdateRoute = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof transportService.updateRoute>[1] }) => transportService.updateRoute(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['transport'] }),
  })
}
export const useDeleteRoute = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: transportService.deleteRoute, onSuccess: () => qc.invalidateQueries({ queryKey: ['transport'] }) })
}
export const useCreateVehicle = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: transportService.createVehicle, onSuccess: () => qc.invalidateQueries({ queryKey: ['transport'] }) })
}

// ── Library ───────────────────────────────────────────────────────────────
export const useBooks = () => useQuery({ queryKey: ['books'], queryFn: () => libraryService.listBooks().then(unwrap) })
export const useBorrowings = () => useQuery({ queryKey: ['borrowings'], queryFn: () => libraryService.listBorrowings().then(unwrap) })
export const useLibraryStats = () => useQuery({ queryKey: ['library', 'stats'], queryFn: () => libraryService.getStats().then(unwrap) })
export const useCreateBook = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: libraryService.createBook, onSuccess: () => qc.invalidateQueries({ queryKey: ['books'] }) })
}
export const useDeleteBook = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: libraryService.deleteBook, onSuccess: () => qc.invalidateQueries({ queryKey: ['books'] }) })
}
export const useIssueBorrowing = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ bookId, borrowerId, borrowerName, borrowerType, days }: { bookId: string; borrowerId: string; borrowerName: string; borrowerType: 'student' | 'staff'; days?: number }) =>
      libraryService.issueBorrowing(bookId, borrowerId, borrowerName, borrowerType, days),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['borrowings'] }); qc.invalidateQueries({ queryKey: ['books'] }) },
  })
}
export const useReturnBook = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: libraryService.returnBook, onSuccess: () => { qc.invalidateQueries({ queryKey: ['borrowings'] }); qc.invalidateQueries({ queryKey: ['books'] }) } })
}

// ── Audit ─────────────────────────────────────────────────────────────────
export const useAuditLog = (filters?: Parameters<typeof auditService.list>[0]) =>
  useQuery({ queryKey: ['audit', filters], queryFn: () => auditService.list(filters).then(unwrap) })
export const useAuditStats = () => useQuery({ queryKey: ['audit', 'stats'], queryFn: () => auditService.getStats().then(unwrap) })

// ── System ────────────────────────────────────────────────────────────────
export const useSystemSettings = () => useQuery({ queryKey: ['settings'], queryFn: () => systemService.getSettings().then(unwrap) })
export const useSystemHealth = () => useQuery({ queryKey: ['system', 'health'], queryFn: () => systemService.getSystemHealth().then(unwrap), refetchInterval: 60000 })
export const useUpdateSettings = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: systemService.updateSettings, onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }) })
}
export const useCreateBackup = () => useMutation({ mutationFn: systemService.createBackup })
export const useSetMaintenanceMode = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ enabled, message }: { enabled: boolean; message?: string }) => systemService.setMaintenanceMode(enabled, message),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  })
}

// ── Admissions ────────────────────────────────────────────────────────────
export const useAdmissions = () => useQuery({ queryKey: ['admissions'], queryFn: () => admissionsService.list() })
export const useAdmissionsStats = () => useQuery({ queryKey: ['admissions', 'stats'], queryFn: () => admissionsService.getStats() })
export const useUpdateAdmissionStatus = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: Parameters<typeof admissionsService.updateStatus>[1]; notes: string; assignedTo?: string }) =>
      admissionsService.updateStatus(id, status, notes),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admissions'] }); qc.invalidateQueries({ queryKey: ['analytics'] }) },
  })
}
export const useDeleteAdmission = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: admissionsService.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ['admissions'] }) })
}
