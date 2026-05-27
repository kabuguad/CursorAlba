import { useState } from 'react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Button } from '../../../components/ui/Button'
import { formatKES } from '../../../lib/utils'
import { useFeeStatement, useInitiatePayment } from '../../../hooks/useFees'
import { useToast } from '../../../contexts/ToastContext'
import { Download, Receipt, AlertCircle, CheckCircle2, Clock } from 'lucide-react'

const LINKED_STUDENT_ID = 's-1'

interface PaymentRecord {
  id: string
  date: string
  amount: number
  method: string
  mpesaCode?: string
  description: string
  status: 'confirmed'
}

const PAYMENT_HISTORY: PaymentRecord[] = [
  { id: 'PAY-001', date: '5 May 2026',   amount: 15000, method: 'M-Pesa', mpesaCode: 'QDJ4H8K2LP', description: 'Term 2 fees partial payment', status: 'confirmed' },
  { id: 'PAY-002', date: '2 Feb 2026',   amount: 27500, method: 'M-Pesa', mpesaCode: 'PLK2G5N9QR', description: 'Term 1 fees full payment',    status: 'confirmed' },
  { id: 'PAY-003', date: '19 Sep 2025',  amount: 27500, method: 'M-Pesa', mpesaCode: 'XMN3T7W0HB', description: 'Term 3 2025 fees',             status: 'confirmed' },
  { id: 'PAY-004', date: '12 May 2025',  amount: 25000, method: 'M-Pesa', mpesaCode: 'RKP8C1Q6TY', description: 'Term 2 2025 fees',             status: 'confirmed' },
]

const UPCOMING_DUES = [
  { label: 'Term 2 Balance Remaining', amount: 12500, dueDate: '15 Jun 2026', urgent: true  },
  { label: 'Term 3 Fees (estimated)',  amount: 27500, dueDate: '1 Sep 2026',  urgent: false },
]

type TabType = 'statement' | 'history'

export function ParentFees() {
  const { showToast } = useToast()
  const { data: fees, isLoading } = useFeeStatement(LINKED_STUDENT_ID)
  const { mutate: payMpesa, isPending } = useInitiatePayment()
  const [tab, setTab] = useState<TabType>('statement')
  const [phone, setPhone] = useState('0712345678')
  const [phoneError, setPhoneError] = useState('')

  const handlePay = () => {
    if (!/^0[17]\d{8}$/.test(phone.replace(/[-\s]/g, ''))) {
      setPhoneError('Enter a valid Safaricom number (07xx or 01xx)')
      return
    }
    setPhoneError('')
    payMpesa({
      studentId: LINKED_STUDENT_ID,
      invoiceId: 'INV-2026-003',
      phone: phone.replace(/[-\s]/g, ''),
    })
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fee Statement</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Amani Kariuki · Adm No: AS/2019/0847</p>
      </div>

      {/* Balance highlight */}
      <GlassCard className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Outstanding Balance</p>
            {isLoading
              ? <div className="h-10 w-36 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-700" />
              : <p className="text-4xl font-bold text-green-700 dark:text-green-400">{formatKES(fees?.balance ?? 0)}</p>
            }
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Due by 15 June 2026
            </p>
          </div>

          {/* M-Pesa payment */}
          <div className="flex-1 min-w-[220px] space-y-2">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Pay via M-Pesa · Paybill: <span className="font-bold text-gray-800 dark:text-gray-200">522522</span></p>
            <div>
              <input
                type="tel"
                value={phone}
                onChange={e => { setPhone(e.target.value); setPhoneError('') }}
                placeholder="07xx xxx xxx"
                className={`field w-full text-sm ${phoneError ? 'border-red-400' : ''}`}
              />
              {phoneError && <p className="mt-1 text-xs text-red-500">{phoneError}</p>}
            </div>
            <Button variant="gold" onClick={handlePay} disabled={isPending} className="w-full">
              {isPending ? 'Sending STK push…' : `Pay ${fees ? formatKES(fees.balance) : ''} via M-Pesa`}
            </Button>
            <p className="text-[10px] text-gray-400">You will receive an M-Pesa STK push on {phone}. Enter your PIN to complete.</p>
          </div>
        </div>
      </GlassCard>

      {/* Upcoming dues */}
      <div className="grid sm:grid-cols-2 gap-3">
        {UPCOMING_DUES.map(d => (
          <div
            key={d.label}
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${
              d.urgent
                ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
            }`}
          >
            <Clock className={`h-4 w-4 mt-0.5 shrink-0 ${d.urgent ? 'text-yellow-500' : 'text-gray-400'}`} />
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{d.label}</p>
              <p className={`text-lg font-bold ${d.urgent ? 'text-yellow-700 dark:text-yellow-400' : 'text-gray-700 dark:text-gray-300'}`}>
                {formatKES(d.amount)}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Due: {d.dueDate}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-1">
        {[
          { id: 'statement' as TabType, label: 'Fee Statement' },
          { id: 'history'   as TabType, label: 'Payment History' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-xl py-2 text-sm font-medium transition ${
              tab === t.id
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Statement */}
      {tab === 'statement' && (
        <GlassCard className="divide-y divide-gray-50 dark:divide-gray-800">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse m-4 rounded-xl bg-gray-100 dark:bg-gray-700" />
              ))
            : fees?.invoices.map(inv => (
                <div key={inv.id} className="flex items-center justify-between px-5 py-4 gap-3">
                  <div className="flex items-center gap-3">
                    {inv.paid
                      ? <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      : <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0" />
                    }
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{inv.desc}</p>
                      <p className="text-xs text-gray-400">{inv.id}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-gray-900 dark:text-white">{formatKES(inv.amount)}</p>
                    <p className={`text-xs font-semibold ${inv.paid ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                      {inv.paid ? '✓ Paid' : 'Unpaid'}
                    </p>
                  </div>
                </div>
              ))}
        </GlassCard>
      )}

      {/* Payment history */}
      {tab === 'history' && (
        <div className="space-y-3">
          {PAYMENT_HISTORY.map(pay => (
            <GlassCard key={pay.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{pay.description}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{pay.date} · {pay.method}</p>
                    {pay.mpesaCode && (
                      <p className="text-xs text-gray-400 font-mono">Code: {pay.mpesaCode}</p>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-green-700 dark:text-green-400">{formatKES(pay.amount)}</p>
                  <button
                    onClick={() => showToast(`Receipt for ${pay.id} download coming soon`)}
                    className="flex items-center gap-1 text-xs text-[#E8B84B] hover:underline mt-1"
                  >
                    <Receipt className="h-3 w-3" />
                    Receipt
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
          <button
            onClick={() => showToast('Full payment history download coming soon')}
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition mx-auto"
          >
            <Download className="h-4 w-4" />
            Download full payment history
          </button>
        </div>
      )}

    </div>
  )
}
