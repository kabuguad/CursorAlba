export interface Invoice {
  id: string
  desc: string
  amount: number
  paid: boolean
  date: string
  dueDate: string
}

export interface FeeStatement {
  studentId: string
  studentName: string
  balance: number
  invoices: Invoice[]
}

const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-2026-001', desc: 'Term 1 Tuition', amount: 120000, paid: true, date: '2026-01-05', dueDate: '2026-01-15' },
  { id: 'INV-2026-002', desc: 'Transport Levy', amount: 15000, paid: true, date: '2026-01-05', dueDate: '2026-01-15' },
  { id: 'INV-2026-003', desc: 'Activity Fee', amount: 8500, paid: false, date: '2026-02-01', dueDate: '2026-02-15' },
  { id: 'INV-2026-004', desc: 'Term 2 Tuition Balance', amount: 40000, paid: false, date: '2026-04-01', dueDate: '2026-04-15' },
]

function delay(ms = 600) {
  return new Promise((res) => setTimeout(res, ms))
}

export async function fetchFeeStatement(studentId: string): Promise<FeeStatement> {
  await delay()
  const balance = MOCK_INVOICES.filter((i) => !i.paid).reduce((acc, i) => acc + i.amount, 0)
  return {
    studentId,
    studentName: 'Amani Kariuki',
    balance,
    invoices: MOCK_INVOICES,
  }
}

export async function initiatePayment(payload: {
  studentId: string
  invoiceId: string
  phone: string
}): Promise<{ success: boolean; reference: string }> {
  await delay(1200)
  console.info('[Mock API] M-Pesa STK push initiated:', payload)
  return { success: true, reference: `MPE-${Date.now()}` }
}
