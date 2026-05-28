import { mockGet, mockPost, mockPut, mockDelete, newId } from './mockApi'
import { getDB, mutateDB } from './db'
import type { Payment, Invoice, Scholarship, Expense, FeeStructure } from './db'
import { addAudit } from './auditService'

export type { Payment, Invoice, Scholarship, Expense, FeeStructure }

export const financeService = {
  // Payments
  listPayments: () => mockGet(() => getDB().payments, 'read'),

  addPayment: (data: Omit<Payment, 'id'>) => mockPost(() => {
    const p: Payment = { id: newId('PAY'), ...data }
    mutateDB(db => {
      db.payments.push(p)
      // Update invoice if linked
      if (p.invoiceId && p.status === 'completed') {
        const inv = db.invoices.find(i => i.id === p.invoiceId)
        if (inv) {
          inv.paidAmount += p.amount
          inv.balance = Math.max(0, inv.totalAmount - inv.discountAmount - inv.paidAmount)
          inv.status = inv.balance === 0 ? 'paid' : 'partial'
        }
      }
    })
    addAudit({ action: 'CREATE', resource: 'Payment', resourceId: p.id, details: `Payment KES ${p.amount.toLocaleString()} — ${p.studentName}` })
    return p
  }),

  updatePaymentStatus: (id: string, status: Payment['status']) => mockPut(() => {
    let updated: Payment | undefined
    mutateDB(db => {
      const idx = db.payments.findIndex(p => p.id === id)
      if (idx < 0) throw new Error('Payment not found')
      db.payments[idx].status = status
      updated = db.payments[idx]
    })
    addAudit({ action: 'UPDATE', resource: 'Payment', resourceId: id, details: `Status → ${status}` })
    return updated!
  }),

  // Invoices
  listInvoices: () => mockGet(() => getDB().invoices, 'read'),

  getInvoice: (id: string) => mockGet(() => {
    const inv = getDB().invoices.find(i => i.id === id)
    if (!inv) throw new Error('Invoice not found')
    return inv
  }),

  generateInvoices: (termId: string) => mockPost(() => {
    const db = getDB()
    const newInvoices: Invoice[] = []
    db.students.filter(s => s.status === 'active').forEach(s => {
      if (!db.invoices.find(i => i.studentId === s.id && i.termId === termId)) {
        const feeLevel = db.feeStructures.find(f => f.termId === termId) ?? db.feeStructures[2]
        const discount = db.scholarships.find(sc => sc.studentId === s.id && sc.status === 'active')
        const discAmt = discount ? (discount.type === 'percentage' ? Math.round(feeLevel.tuition * discount.value / 100) : discount.value) : 0
        const total = feeLevel.tuition + (s.transportRouteId ? feeLevel.transport : 0) + feeLevel.activities
        const inv: Invoice = {
          id: newId('INV'),
          studentId: s.id,
          studentName: `${s.firstName} ${s.lastName}`,
          admNo: s.admNo,
          termId,
          lineItems: [
            { description: 'Tuition Fee', amount: feeLevel.tuition },
            ...(s.transportRouteId ? [{ description: 'Transport Levy', amount: feeLevel.transport }] : []),
            { description: 'Activity Fee', amount: feeLevel.activities },
          ],
          totalAmount: total,
          paidAmount: 0,
          balance: total - discAmt,
          status: 'unpaid',
          dueDate: '2026-05-15',
          issuedDate: new Date().toISOString().slice(0, 10),
          discountAmount: discAmt,
          discountReason: discount?.reason ?? '',
        }
        newInvoices.push(inv)
      }
    })
    mutateDB(db => { db.invoices.push(...newInvoices) })
    addAudit({ action: 'CREATE', resource: 'Invoice', resourceId: null, details: `Generated ${newInvoices.length} invoices for term ${termId}` })
    return { generated: newInvoices.length, invoices: newInvoices }
  }, 'heavy'),

  applyDiscount: (invoiceId: string, amount: number, reason: string) => mockPut(() => {
    let updated: Invoice | undefined
    mutateDB(db => {
      const idx = db.invoices.findIndex(i => i.id === invoiceId)
      if (idx < 0) throw new Error('Invoice not found')
      db.invoices[idx].discountAmount = amount
      db.invoices[idx].discountReason = reason
      db.invoices[idx].balance = Math.max(0, db.invoices[idx].totalAmount - amount - db.invoices[idx].paidAmount)
      db.invoices[idx].status = db.invoices[idx].balance === 0 ? 'paid' : 'partial'
      updated = db.invoices[idx]
    })
    addAudit({ action: 'UPDATE', resource: 'Invoice', resourceId: invoiceId, details: `Applied discount KES ${amount} — ${reason}` })
    return updated!
  }),

  // Scholarships
  listScholarships: () => mockGet(() => getDB().scholarships),

  createScholarship: (data: Omit<Scholarship, 'id' | 'createdAt'>, approvedBy: string) => mockPost(() => {
    const sch: Scholarship = { id: newId('SCH'), ...data, approvedBy, createdAt: new Date().toISOString() }
    mutateDB(db => { db.scholarships.push(sch) })
    addAudit({ action: 'CREATE', resource: 'Scholarship', resourceId: sch.id, details: `Scholarship granted to ${sch.studentName}` })
    return sch
  }),

  revokeScholarship: (id: string) => mockPut(() => {
    mutateDB(db => {
      const s = db.scholarships.find(sc => sc.id === id)
      if (s) s.status = 'expired'
    })
    addAudit({ action: 'UPDATE', resource: 'Scholarship', resourceId: id, details: 'Scholarship revoked' })
    return getDB().scholarships.find(s => s.id === id)!
  }),

  // Expenses
  listExpenses: () => mockGet(() => getDB().expenses),

  addExpense: (data: Omit<Expense, 'id'>) => mockPost(() => {
    const exp: Expense = { id: newId('EXP'), ...data }
    mutateDB(db => { db.expenses.push(exp) })
    addAudit({ action: 'CREATE', resource: 'Expense', resourceId: exp.id, details: `Expense KES ${exp.amount} — ${exp.description}` })
    return exp
  }),

  approveExpense: (id: string) => mockPut(() => {
    mutateDB(db => {
      const e = db.expenses.find(x => x.id === id)
      if (e) e.status = 'approved'
    })
    addAudit({ action: 'UPDATE', resource: 'Expense', resourceId: id, details: 'Expense approved' })
    return getDB().expenses.find(e => e.id === id)!
  }),

  deleteExpense: (id: string) => mockDelete(() => {
    mutateDB(db => { db.expenses = db.expenses.filter(e => e.id !== id) })
  }),

  // Fee Structures
  listFeeStructures: () => mockGet(() => getDB().feeStructures),

  updateFeeStructure: (id: string, data: Partial<FeeStructure>) => mockPut(() => {
    let updated: FeeStructure | undefined
    mutateDB(db => {
      const idx = db.feeStructures.findIndex(f => f.id === id)
      if (idx < 0) throw new Error('Fee structure not found')
      db.feeStructures[idx] = { ...db.feeStructures[idx], ...data }
      updated = db.feeStructures[idx]
    })
    addAudit({ action: 'UPDATE', resource: 'FeeStructure', resourceId: id, details: `Updated fee: ${updated?.level}` })
    return updated!
  }),

  // Summary stats
  getSummary: () => mockGet(() => {
    const db = getDB()
    const completed = db.payments.filter(p => p.status === 'completed')
    const totalCollected = completed.reduce((s, p) => s + p.amount, 0)
    const totalPending = db.payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0)
    const totalExpenses = db.expenses.filter(e => e.status === 'approved').reduce((s, e) => s + e.amount, 0)
    const totalInvoiced = db.invoices.reduce((s, i) => s + i.totalAmount, 0)
    const outstanding = db.invoices.reduce((s, i) => s + i.balance, 0)
    const overdueCount = db.invoices.filter(i => i.status === 'overdue').length
    const collectionRate = totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0
    const byMethod = {
      mpesa: completed.filter(p => p.method === 'M-Pesa').reduce((s, p) => s + p.amount, 0),
      bank: completed.filter(p => p.method === 'Bank Transfer').reduce((s, p) => s + p.amount, 0),
      cash: completed.filter(p => p.method === 'Cash').reduce((s, p) => s + p.amount, 0),
    }
    const recentDaily = (() => {
      const days: Record<string, number> = {}
      completed.forEach(p => { days[p.date] = (days[p.date] ?? 0) + p.amount })
      return Object.entries(days).sort((a, b) => a[0].localeCompare(b[0])).slice(-10).map(([day, amount]) => ({ day: day.slice(5), amount }))
    })()
    return { totalCollected, totalPending, totalExpenses, totalInvoiced, outstanding, overdueCount, collectionRate, byMethod, recentDaily }
  }, 'read'),
}
