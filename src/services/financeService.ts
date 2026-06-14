import { apiClient } from './apiClient'

export const financeService = {
  // Fee Structures
  listFeeStructures: () =>
    apiClient.get('/admin/fees').then(r => r.data),

  createFeeStructure: (dto: any) =>
    apiClient.post('/admin/fees', dto).then(r => r.data),

  updateFeeStructure: (id: any, dto: any) =>
    apiClient.put(`/admin/fees/${id}`, dto).then(r => r.data),

  deleteFeeStructure: (id: number) =>
    apiClient.delete(`/admin/fees/${id}`).then(r => r.data),

  // Invoices
  listInvoices: () =>
    apiClient.get('/admin/fees/invoices').then(r => r.data),

  generateInvoices: (termId: string) =>
    apiClient.post('/admin/fees/invoices/generate', { termId }).then(r => r.data),

  applyDiscount: (invoiceId: any, amount: number, reason?: string) =>
    apiClient.post(`/admin/fees/invoices/${invoiceId}/discount`, { discountAmount: amount, discountReason: reason }).then(r => r.data),

  // Payments
  listPayments: (from?: string, to?: string) =>
    apiClient.get('/admin/payments', { params: { from, to } }).then(r => r.data),

  makePayment: (dto: any) =>
    apiClient.post('/admin/payments', dto).then(r => r.data),

  addPayment: (dto: any) =>
    apiClient.post('/admin/payments', dto).then(r => r.data),

  updatePaymentStatus: (id: string, status: string) =>
    apiClient.patch(`/admin/payments/${id}`, { status }).then(r => r.data),

  getPaymentSummary: () =>
    apiClient.get('/admin/payments/summary').then(r => r.data),

  // Scholarships
  listScholarships: () =>
    apiClient.get('/admin/scholarships').then(r => r.data),

  createScholarship: (dto: any, _approvedBy?: string) =>
    apiClient.post('/admin/scholarships', dto).then(r => r.data),

  revokeScholarship: (id: number) =>
    apiClient.patch(`/admin/scholarships/${id}/revoke`).then(r => r.data),

  // Expenses
  listExpenses: () =>
    apiClient.get('/admin/expenses').then(r => r.data),

  createExpense: (dto: any) =>
    apiClient.post('/admin/expenses', dto).then(r => r.data),

  addExpense: (dto: any) =>
    apiClient.post('/admin/expenses', dto).then(r => r.data),

  approveExpense: (id: number) =>
    apiClient.patch(`/admin/expenses/${id}/approve`).then(r => r.data),

  deleteExpense: (id: number) =>
    apiClient.delete(`/admin/expenses/${id}`).then(r => r.data),

  // Summary
  getSummary: () =>
    apiClient.get('/admin/fees/summary').then(r => r.data),
}
