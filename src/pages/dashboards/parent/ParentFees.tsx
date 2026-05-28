import { Banknote, CheckCircle2, AlertCircle, Clock, Receipt } from 'lucide-react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Button } from '../../../components/ui/Button'
import { useToast } from '../../../contexts/ToastContext'
import { useParentInvoice, useParentStudentProfile } from '../../../hooks/useParentData'

function fmt(n: number) {
  return `KES ${n.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function ParentFees() {
  const { showToast }     = useToast()
  const { data: profile } = useParentStudentProfile()
  const { data: invoice, isLoading } = useParentInvoice()

  const student = profile?.student

  if (isLoading) {
    return <div className="mx-auto max-w-3xl px-4 py-8 space-y-4">
      {[1,2,3].map(i => <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)}
    </div>
  }

  if (!invoice) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 text-center py-20">
        <Receipt className="mx-auto h-12 w-12 text-gray-200 dark:text-gray-700 mb-3" />
        <p className="text-gray-400">No fee statement found for the current term</p>
      </div>
    )
  }

  const balance = invoice.total - invoice.paid
  const paidPct = Math.round((invoice.paid / invoice.total) * 100)
  const status  = invoice.status

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fee Statement</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {student ? `${student.firstName} ${student.lastName}` : '—'} · Term 2, 2026
        </p>
      </div>

      {/* Status banner */}
      <div className={`rounded-2xl p-5 flex items-center gap-4 ${
        status === 'paid' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
          : status === 'partial' ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
          : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`}>
        {status === 'paid'
          ? <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400 shrink-0" />
          : status === 'partial'
          ? <Clock className="h-8 w-8 text-amber-600 dark:text-amber-400 shrink-0" />
          : <AlertCircle className="h-8 w-8 text-red-500 shrink-0" />
        }
        <div>
          <p className={`font-bold text-lg ${status==='paid'?'text-green-700 dark:text-green-400':status==='partial'?'text-amber-700 dark:text-amber-400':'text-red-600'}`}>
            {status === 'paid' ? 'Fully Paid' : status === 'partial' ? 'Partially Paid' : 'Unpaid'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {status !== 'paid' ? `Balance due: ${fmt(balance)}` : 'No outstanding balance'}
          </p>
        </div>
        {status !== 'paid' && (
          <div className="ml-auto">
            <Button
              onClick={() => showToast('Payment gateway coming soon', 'info')}
              className="bg-violet-700 hover:bg-violet-800 text-white text-sm">
              Pay Now
            </Button>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'Total Fees',  value: fmt(invoice.total), color:'text-gray-900 dark:text-white' },
          { label:'Amount Paid', value: fmt(invoice.paid),  color:'text-green-700 dark:text-green-400' },
          { label:'Balance Due', value: fmt(balance),       color: balance > 0 ? 'text-red-500' : 'text-green-700 dark:text-green-400' },
        ].map(s => (
          <GlassCard key={s.label} className="p-4 text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Progress bar */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-gray-600 dark:text-gray-300">Payment progress</span>
          <span className="font-bold text-gray-900 dark:text-white">{paidPct}%</span>
        </div>
        <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-700">
          <div className={`h-3 rounded-full transition-all ${paidPct >= 100 ? 'bg-green-500' : paidPct >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
            style={{ width: `${Math.min(100, paidPct)}%` }} />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>{fmt(invoice.paid)} paid</span>
          <span>{fmt(invoice.total)} total</span>
        </div>
      </GlassCard>

      {/* Line items */}
      <GlassCard className="overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Banknote className="h-4 w-4 text-violet-600" /> Fee Breakdown
          </h2>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
          {invoice.lineItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{fmt(item.amount)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/20 flex justify-between items-center">
          <span className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Total</span>
          <span className="text-lg font-extrabold text-gray-900 dark:text-white">{fmt(invoice.total)}</span>
        </div>
      </GlassCard>

      <p className="text-xs text-gray-400 text-center">
        Due date: {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-KE', { day:'numeric', month:'long', year:'numeric' }) : '—'}
        {' · '}Invoice ref: {invoice.id.toUpperCase()}
      </p>
    </div>
  )
}
