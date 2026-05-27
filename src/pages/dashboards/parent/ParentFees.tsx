import { GlassCard } from '../../../components/ui/GlassCard'
import { Button } from '../../../components/ui/Button'
import { formatKES } from '../../../lib/utils'
import { useFeeStatement, useInitiatePayment } from '../../../hooks/useFees'

const LINKED_STUDENT_ID = 's-1'

export function ParentFees() {
  const { data: fees, isLoading } = useFeeStatement(LINKED_STUDENT_ID)
  const { mutate: payMpesa, isPending } = useInitiatePayment()

  const handlePay = () => {
    payMpesa({ studentId: LINKED_STUDENT_ID, invoiceId: 'INV-2026-003', phone: '0712345678' })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fee Statement</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Amani Kariuki · Term 2, 2026</p>
      </div>

      <GlassCard className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Outstanding Balance</p>
            {isLoading ? (
              <div className="h-9 w-32 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
            ) : (
              <p className="text-3xl font-bold text-green-700 dark:text-green-400">{formatKES(fees?.balance ?? 0)}</p>
            )}
          </div>
          <Button variant="gold" onClick={handlePay} disabled={isPending}>
            {isPending ? 'Sending…' : 'Pay via M-Pesa (522522)'}
          </Button>
        </div>

        <div className="space-y-2">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-11 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
              ))
            : fees?.invoices.map(inv => (
                <div
                  key={inv.id}
                  className="flex justify-between rounded-xl bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm"
                >
                  <span className="text-gray-700 dark:text-gray-300">{inv.desc} ({inv.id})</span>
                  <span className={inv.paid ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-[#E8B84B] font-semibold'}>
                    {formatKES(inv.amount)} {inv.paid ? '✓ Paid' : 'Due'}
                  </span>
                </div>
              ))}
        </div>
      </GlassCard>
    </div>
  )
}
