import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Banknote, Search, Download, Loader2, X, CheckCircle, Clock, AlertCircle, XCircle, Plus, Tag } from 'lucide-react'
import { useInvoices, useGenerateInvoices, useApplyDiscount, useScholarships, useCreateScholarship, useStudents, useCurrentTerm } from '../../../hooks/useAdminData'
import { useToast } from '../../../contexts/ToastContext'
import { unwrap } from '../../../services/mockApi'
import type { Invoice } from '../../../services/financeService'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'

const STATUS_CFG = {
  paid:    { label: 'Paid',    icon: CheckCircle, cls: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  partial: { label: 'Partial', icon: Clock,       cls: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'   },
  unpaid:  { label: 'Unpaid',  icon: AlertCircle, cls: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  overdue: { label: 'Overdue', icon: XCircle,     cls: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'       },
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4 shrink-0">
          <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-4 w-4" /></button>
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>, document.body,
  )
}

export function InvoicesManager() {
  const { showToast } = useToast()
  const { data: invoices = [], isLoading } = useInvoices()
  const { data: scholarships = [] } = useScholarships()
  const { data: students = [] } = useStudents()
  const { data: currentTerm } = useCurrentTerm()
  const generateInvoices = useGenerateInvoices()
  const applyDiscount = useApplyDiscount()
  const createScholarship = useCreateScholarship()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<Invoice['status'] | 'all'>('all')
  const [selectedInv, setSelectedInv] = useState<Invoice | null>(null)
  const [discountModal, setDiscountModal] = useState<Invoice | null>(null)
  const [scholarshipModal, setScholarshipModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'invoices' | 'scholarships'>('invoices')
  const [discAmt, setDiscAmt] = useState(0)
  const [discReason, setDiscReason] = useState('')
  const [schDraft, setSchDraft] = useState({ studentId: '', studentName: '', type: 'percentage' as 'percentage' | 'fixed', value: 0, reason: '', startTerm: '', endTerm: '' as string | null, status: 'active' as 'active' | 'expired' })

  const filtered = invoices.filter(inv => {
    const q = search.toLowerCase()
    return (statusFilter === 'all' || inv.status === statusFilter) &&
      (inv.studentName.toLowerCase().includes(q) || inv.admNo.toLowerCase().includes(q) || inv.id.toLowerCase().includes(q))
  })

  const totalOutstanding = invoices.reduce((s, i) => s + i.balance, 0)
  const totalCollected = invoices.reduce((s, i) => s + i.paidAmount, 0)
  const totalInvoiced = invoices.reduce((s, i) => s + i.totalAmount, 0)
  const overdueCount = invoices.filter(i => i.status === 'overdue').length

  const handleGenerate = async () => {
    if (!currentTerm) return showToast('No current term configured')
    try {
      const res = await generateInvoices.mutateAsync(currentTerm.id).then(unwrap)
      showToast(`${res.generated} invoices generated ✓`)
    } catch (e) { showToast((e as Error).message) }
  }

  const handleDiscount = async () => {
    if (!discountModal) return
    try {
      await applyDiscount.mutateAsync({ id: discountModal.id, amount: discAmt, reason: discReason }).then(unwrap)
      showToast('Discount applied ✓'); setDiscountModal(null)
    } catch (e) { showToast((e as Error).message) }
  }

  const handleScholarship = async () => {
    const student = students.find(s => s.id === schDraft.studentId)
    try {
      await createScholarship.mutateAsync({ data: { ...schDraft, studentName: `${student?.firstName} ${student?.lastName}` ?? schDraft.studentName }, approvedBy: 'Dr. Wanjiku Mwangi' }).then(unwrap)
      showToast('Scholarship granted ✓'); setScholarshipModal(false)
    } catch (e) { showToast((e as Error).message) }
  }

  const fmt = (n: number) => `KES ${n.toLocaleString()}`

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoices & Scholarships</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Current term: <strong>{currentTerm?.label ?? '—'}</strong></p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setScholarshipModal(true)} className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
            <Tag className="h-4 w-4" /> New Scholarship
          </button>
          <button onClick={handleGenerate} disabled={generateInvoices.isPending} className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2.5 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] disabled:opacity-60">
            {generateInvoices.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Generate Invoices
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 border-b border-gray-200 dark:border-gray-700">
        {(['invoices', 'scholarships'] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition border-b-2 -mb-px ${activeTab === t ? 'border-[#E8B84B] text-[#E8B84B]' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>
            {t} {t === 'scholarships' ? `(${scholarships.length})` : `(${invoices.length})`}
          </button>
        ))}
      </div>

      {activeTab === 'invoices' && (
        <>
          {/* Summary cards */}
          <div className="mb-6 grid gap-4 sm:grid-cols-4">
            {[
              { label: 'Total Invoiced', value: fmt(totalInvoiced), cls: 'text-gray-900 dark:text-white' },
              { label: 'Collected', value: fmt(totalCollected), cls: 'text-green-600 dark:text-green-400' },
              { label: 'Outstanding', value: fmt(totalOutstanding), cls: 'text-yellow-600 dark:text-yellow-400' },
              { label: 'Overdue', value: `${overdueCount} invoices`, cls: 'text-red-600 dark:text-red-400' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{s.label}</p>
                <p className={`mt-1 text-xl font-bold ${s.cls}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="mb-4 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input className={`${INP} pl-9`} placeholder="Search student, admission no…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className={`${INP} w-auto`} value={statusFilter} onChange={e => setStatusFilter(e.target.value as Invoice['status'] | 'all')}>
              <option value="all">All Status</option>
              {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            {isLoading ? <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-gray-400" /></div> : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-sm">
                  <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                    <tr>{['Invoice', 'Student', 'Total', 'Discount', 'Paid', 'Balance', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                    {filtered.map(inv => {
                      const cfg = STATUS_CFG[inv.status]
                      return (
                        <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                          <td className="px-5 py-3.5"><p className="font-mono text-xs text-gray-400">{inv.id}</p><p className="text-[10px] text-gray-400">{inv.issuedDate}</p></td>
                          <td className="px-5 py-3.5"><p className="font-medium text-gray-900 dark:text-white">{inv.studentName}</p><p className="text-[10px] text-gray-400">{inv.admNo}</p></td>
                          <td className="px-5 py-3.5 font-semibold text-gray-900 dark:text-white">{fmt(inv.totalAmount)}</td>
                          <td className="px-5 py-3.5 text-green-600 dark:text-green-400 font-semibold">{inv.discountAmount > 0 ? `-${fmt(inv.discountAmount)}` : '—'}</td>
                          <td className="px-5 py-3.5 text-blue-600 dark:text-blue-400 font-semibold">{fmt(inv.paidAmount)}</td>
                          <td className="px-5 py-3.5"><span className={`font-bold ${inv.balance > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>{fmt(inv.balance)}</span></td>
                          <td className="px-5 py-3.5">
                            <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold w-fit ${cfg.cls}`}>
                              <cfg.icon className="h-3 w-3" />{cfg.label}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex gap-1">
                              <button onClick={() => setSelectedInv(inv)} className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600" title="View"><Banknote className="h-4 w-4" /></button>
                              <button onClick={() => { setDiscountModal(inv); setDiscAmt(inv.discountAmount); setDiscReason(inv.discountReason) }} className="rounded-lg p-1.5 text-gray-400 hover:bg-yellow-50 hover:text-yellow-600" title="Apply discount"><Tag className="h-4 w-4" /></button>
                              <button onClick={() => showToast('Receipt exported')} className="rounded-lg p-1.5 text-gray-400 hover:bg-green-50 hover:text-green-600" title="Export receipt"><Download className="h-4 w-4" /></button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                    {filtered.length === 0 && <tr><td colSpan={8} className="px-5 py-12 text-center text-gray-400">No invoices found</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'scholarships' && (
        <div className="space-y-3">
          {scholarships.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-12 text-center text-gray-400">No scholarships configured</div>
          ) : scholarships.map(sch => (
            <div key={sch.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{sch.studentName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{sch.reason}</p>
                <p className="text-xs text-gray-400 mt-0.5">From {sch.startTerm} · Approved by {sch.approvedBy}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#E8B84B] text-lg">{sch.type === 'percentage' ? `${sch.value}%` : `KES ${sch.value.toLocaleString()}`}</p>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${sch.status === 'active' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>{sch.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoice detail modal */}
      <Modal open={!!selectedInv} onClose={() => setSelectedInv(null)} title={`Invoice ${selectedInv?.id}`}>
        {selectedInv && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-xs text-gray-400">Student</p><p className="font-semibold text-gray-900 dark:text-white">{selectedInv.studentName}</p></div>
              <div><p className="text-xs text-gray-400">Adm No</p><p className="font-semibold text-gray-900 dark:text-white">{selectedInv.admNo}</p></div>
              <div><p className="text-xs text-gray-400">Issued</p><p className="text-gray-700 dark:text-gray-300">{selectedInv.issuedDate}</p></div>
              <div><p className="text-xs text-gray-400">Due</p><p className="text-gray-700 dark:text-gray-300">{selectedInv.dueDate}</p></div>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700/50">
              {selectedInv.lineItems.map(item => (
                <div key={item.description} className="flex justify-between px-4 py-2.5 text-sm">
                  <span className="text-gray-700 dark:text-gray-300">{item.description}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">KES {item.amount.toLocaleString()}</span>
                </div>
              ))}
              {selectedInv.discountAmount > 0 && (
                <div className="flex justify-between px-4 py-2.5 text-sm">
                  <span className="text-green-600">Discount ({selectedInv.discountReason})</span>
                  <span className="font-semibold text-green-600">-KES {selectedInv.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between px-4 py-3 font-bold">
                <span className="text-gray-900 dark:text-white">Balance Due</span>
                <span className={selectedInv.balance > 0 ? 'text-red-600' : 'text-green-600'}>KES {selectedInv.balance.toLocaleString()}</span>
              </div>
            </div>
            <button onClick={() => showToast('Receipt downloaded')} className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
              <Download className="h-4 w-4" /> Download Receipt PDF
            </button>
          </div>
        )}
      </Modal>

      {/* Discount modal */}
      <Modal open={!!discountModal} onClose={() => setDiscountModal(null)} title="Apply Discount">
        <div className="space-y-4">
          <div><label className={LABEL}>Discount Amount (KES)</label><input type="number" className={INP} value={discAmt} onChange={e => setDiscAmt(+e.target.value)} /></div>
          <div><label className={LABEL}>Reason</label><input className={INP} value={discReason} onChange={e => setDiscReason(e.target.value)} /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setDiscountModal(null)} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
            <button onClick={handleDiscount} disabled={applyDiscount.isPending} className="rounded-xl bg-[#E8B84B] px-5 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] disabled:opacity-60">Apply Discount</button>
          </div>
        </div>
      </Modal>

      {/* Scholarship modal */}
      <Modal open={scholarshipModal} onClose={() => setScholarshipModal(false)} title="Grant Scholarship">
        <div className="space-y-4">
          <div>
            <label className={LABEL}>Student</label>
            <select className={INP} value={schDraft.studentId} onChange={e => setSchDraft({ ...schDraft, studentId: e.target.value })}>
              <option value="">Select student…</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.admNo})</option>)}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL}>Type</label>
              <select className={INP} value={schDraft.type} onChange={e => setSchDraft({ ...schDraft, type: e.target.value as 'percentage' | 'fixed' })}>
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (KES)</option>
              </select>
            </div>
            <div><label className={LABEL}>{schDraft.type === 'percentage' ? 'Percentage' : 'Amount (KES)'}</label><input type="number" className={INP} value={schDraft.value} onChange={e => setSchDraft({ ...schDraft, value: +e.target.value })} /></div>
          </div>
          <div><label className={LABEL}>Reason</label><input className={INP} value={schDraft.reason} onChange={e => setSchDraft({ ...schDraft, reason: e.target.value })} /></div>
          <div><label className={LABEL}>Start Term</label><input className={INP} placeholder="e.g. TERM-2026-T2" value={schDraft.startTerm} onChange={e => setSchDraft({ ...schDraft, startTerm: e.target.value })} /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setScholarshipModal(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
            <button onClick={handleScholarship} disabled={createScholarship.isPending} className="rounded-xl bg-[#E8B84B] px-5 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] disabled:opacity-60">Grant Scholarship</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
