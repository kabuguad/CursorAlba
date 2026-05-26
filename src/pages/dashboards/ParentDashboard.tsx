import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { gradeData, feeBalance, invoices, generateAttendance } from '../../data/students'
import { GlassCard } from '../../components/ui/GlassCard'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../contexts/ToastContext'
import { formatKES } from '../../lib/utils'
import { useAuth } from '../../contexts/AuthContext'

export function ParentDashboard() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const attendance = useMemo(() => generateAttendance(2026, 2), [])

  const payMpesa = () => {
    showToast('M-Pesa STK Push simulated — Paybill 522522, Account ALBER')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
      <p className="text-muted">Parent / Student Dashboard</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <GlassCard className="p-6">
          <h2 className="mb-4 font-bold text-primary dark:text-gold">Grade Progress</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={gradeData}>
              <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#15803d" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="mb-4 font-bold">Attendance — March 2026</h2>
          <div className="flex flex-wrap gap-1">
            {attendance.map((d) => (
              <div
                key={d.date}
                title={d.date}
                className={`h-8 w-8 rounded-md transition hover:scale-110 ${
                  d.present ? 'bg-primary' : 'bg-neutral-300 dark:bg-neutral-600'
                }`}
              />
            ))}
          </div>
          <p className="mt-4 text-sm text-muted">Green = present · Grey = absent</p>
        </GlassCard>

        <GlassCard className="p-6 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-bold">Fee Balance</h2>
              <p className="text-3xl font-bold text-primary dark:text-gold">{formatKES(feeBalance)}</p>
            </div>
            <Button variant="gold" onClick={payMpesa}>
              Pay via M-Pesa (522522)
            </Button>
          </div>
          <div className="mt-6 space-y-2">
            {invoices.map((inv) => (
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
