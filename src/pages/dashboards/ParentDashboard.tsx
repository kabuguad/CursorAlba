import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { GlassCard } from '../../components/ui/GlassCard'
import { Button } from '../../components/ui/Button'
import { formatKES } from '../../lib/utils'
import { useAuth } from '../../contexts/AuthContext'
import { useStudentGrades } from '../../hooks/useGrades'
import { useAttendance } from '../../hooks/useAttendance'
import { useFeeStatement, useInitiatePayment } from '../../hooks/useFees'

const LINKED_STUDENT_ID = 's-1'

export function ParentDashboard() {
  const { user } = useAuth()

  const { data: progress, isLoading: gradesLoading } = useStudentGrades(LINKED_STUDENT_ID)
  const { data: attendance, isLoading: attendanceLoading } = useAttendance(LINKED_STUDENT_ID, 2026, 2)
  const { data: fees, isLoading: feesLoading } = useFeeStatement(LINKED_STUDENT_ID)
  const { mutate: payMpesa, isPending: payPending } = useInitiatePayment()

  const handlePay = () => {
    payMpesa({ studentId: LINKED_STUDENT_ID, invoiceId: 'INV-2026-003', phone: '0712345678' })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
      <p className="text-muted">Parent / Student Dashboard</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <GlassCard className="p-6">
          <h2 className="mb-1 font-bold text-primary dark:text-gold">Grade Progress</h2>
          {progress && (
            <p className="mb-4 text-sm text-muted">
              Average: <span className="font-semibold text-foreground">{progress.average}%</span>
              {' '}·{' '}
              Trend:{' '}
              <span className={progress.trend === 'up' ? 'text-primary' : progress.trend === 'down' ? 'text-red-500' : 'text-muted'}>
                {progress.trend === 'up' ? '↑ Improving' : progress.trend === 'down' ? '↓ Declining' : '→ Stable'}
              </span>
            </p>
          )}
          {gradesLoading ? (
            <div className="h-[250px] animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-700" />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={progress?.grades}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  formatter={(val: number) => [`${val}%`, 'Score']}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Bar dataKey="score" fill="#15803d" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="mb-1 font-bold">Attendance — {attendance?.month ?? 'March 2026'}</h2>
          {!attendanceLoading && attendance && (
            <p className="mb-3 text-sm text-muted">
              Present: <span className="font-semibold text-primary">{attendance.presentCount} days</span>
              {' '}· Absent: <span className="font-semibold text-red-500">{attendance.absentCount} days</span>
              {' '}· Rate: <span className="font-semibold">{attendance.percentage}%</span>
            </p>
          )}
          {attendanceLoading ? (
            <div className="h-40 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-700" />
          ) : (
            <div className="flex flex-wrap gap-1">
              {attendance?.days.map((d) => (
                <div
                  key={d.date}
                  title={d.date}
                  className={`h-8 w-8 rounded-md transition hover:scale-110 ${
                    d.present ? 'bg-primary' : 'bg-neutral-300 dark:bg-neutral-600'
                  }`}
                />
              ))}
            </div>
          )}
          <p className="mt-4 text-sm text-muted">Green = present · Grey = absent</p>
        </GlassCard>

        <GlassCard className="p-6 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-bold">Fee Balance</h2>
              {feesLoading ? (
                <div className="mt-1 h-9 w-32 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-700" />
              ) : (
                <p className="text-3xl font-bold text-primary dark:text-gold">{formatKES(fees?.balance ?? 0)}</p>
              )}
            </div>
            <Button variant="gold" onClick={handlePay} disabled={payPending}>
              {payPending ? 'Sending...' : 'Pay via M-Pesa (522522)'}
            </Button>
          </div>
          <div className="mt-6 space-y-2">
            {feesLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-11 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-700" />
                ))
              : fees?.invoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex justify-between rounded-xl bg-tint/50 px-4 py-3 text-sm text-foreground dark:bg-dark-card"
                  >
                    <span>{inv.desc} ({inv.id})</span>
                    <span className={inv.paid ? 'text-primary' : 'text-gold'}>
                      {formatKES(inv.amount)} {inv.paid ? '✓ Paid' : 'Due'}
                    </span>
                  </div>
                ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
