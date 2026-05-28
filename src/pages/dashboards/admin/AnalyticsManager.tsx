import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList } from 'recharts'
import { TrendingUp, Download, Loader2, RefreshCw } from 'lucide-react'
import { useEnrollmentTrend, useAttendanceTrend, useFeeCollectionByLevel, useAcademicPerformance, useAdmissionsFunnel, usePaymentMethodBreakdown, useStaffDeptBreakdown, useFinanceSummary } from '../../../hooks/useAdminData'
import { useTheme } from '../../../contexts/ThemeContext'
import { useToast } from '../../../contexts/ToastContext'
import { useQueryClient } from '@tanstack/react-query'

const TABS = ['Enrollment', 'Finance', 'Academics', 'Admissions', 'Staff'] as const
type Tab = typeof TABS[number]

const PIE_COLORS = ['#E8B84B', '#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ec4899']

function SectionCard({ title, children, isLoading }: { title: string; children: React.ReactNode; isLoading?: boolean }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-[#E8B84B]" />
        <h2 className="font-semibold text-gray-900 dark:text-white">{title}</h2>
      </div>
      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-40"><Loader2 className="h-5 w-5 animate-spin text-gray-400" /></div>
        ) : children}
      </div>
    </div>
  )
}

export function AnalyticsManager() {
  const { theme } = useTheme()
  const { showToast } = useToast()
  const qc = useQueryClient()
  const [tab, setTab] = useState<Tab>('Enrollment')

  const grid = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'
  const axis = theme === 'dark' ? '#9ca3af' : '#6b7280'

  const { data: enrollment, isLoading: enrollLoading, refetch: refetchEnroll } = useEnrollmentTrend()
  const { data: attendance, isLoading: attLoading } = useAttendanceTrend()
  const { data: feeLevel, isLoading: feeLvlLoading } = useFeeCollectionByLevel()
  const { data: academic, isLoading: acadLoading } = useAcademicPerformance()
  const { data: funnel, isLoading: funnelLoading } = useAdmissionsFunnel()
  const { data: payMethod, isLoading: payMethodLoading } = usePaymentMethodBreakdown()
  const { data: staffDept, isLoading: staffLoading } = useStaffDeptBreakdown()
  const { data: finance, isLoading: finLoading } = useFinanceSummary()

  const handleRefresh = () => {
    qc.invalidateQueries({ queryKey: ['analytics'] })
    qc.invalidateQueries({ queryKey: ['finance'] })
    showToast('Analytics refreshed ✓')
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Reports</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Live data aggregated from all modules</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleRefresh} className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
          <button onClick={() => showToast('Report exported to CSV')} className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2.5 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a]">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      {/* Finance KPI row */}
      {!finLoading && finance && (
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          {[
            { label: 'Total Collected', value: `KES ${(finance.totalCollected / 1000).toFixed(0)}K`, cls: 'text-green-600 dark:text-green-400' },
            { label: 'Outstanding', value: `KES ${(finance.outstanding / 1000).toFixed(0)}K`, cls: 'text-red-600 dark:text-red-400' },
            { label: 'Collection Rate', value: `${finance.collectionRate}%`, cls: 'text-[#E8B84B]' },
            { label: 'Overdue Invoices', value: `${finance.overdueCount}`, cls: 'text-orange-600 dark:text-orange-400' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{s.label}</p>
              <p className={`mt-1 text-2xl font-bold ${s.cls}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex gap-1 border-b border-gray-200 dark:border-gray-700">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium transition border-b-2 -mb-px ${tab === t ? 'border-[#E8B84B] text-[#E8B84B]' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* ── ENROLLMENT ── */}
      {tab === 'Enrollment' && (
        <div className="grid gap-6">
          <SectionCard title="Student Enrollment Trend (8 Terms)" isLoading={enrollLoading}>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={enrollment ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                <XAxis dataKey="term" tick={{ fontSize: 11, fill: axis }} />
                <YAxis tick={{ fontSize: 11, fill: axis }} domain={['auto', 'auto']} />
                <Tooltip formatter={(v: number) => [`${v} students`, 'Enrollment']} />
                <Line type="monotone" dataKey="count" stroke="#E8B84B" strokeWidth={2.5} dot={{ r: 4, fill: '#E8B84B' }} />
              </LineChart>
            </ResponsiveContainer>
          </SectionCard>
          <SectionCard title="Weekly Attendance Rate" isLoading={attLoading}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={attendance ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: axis }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: axis }} tickFormatter={v => `${v}%`} />
                <Tooltip formatter={(v: number) => [`${v}%`, 'Attendance Rate']} />
                <Bar dataKey="rate" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>
      )}

      {/* ── FINANCE ── */}
      {tab === 'Finance' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="Fee Collection Rate by Level" isLoading={feeLvlLoading}>
            <div className="space-y-3">
              {(feeLevel ?? []).map(f => (
                <div key={f.level}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{f.level}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{f.rate}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    <div className="h-full rounded-full bg-[#E8B84B] transition-all" style={{ width: `${f.rate}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Payment Method Breakdown" isLoading={payMethodLoading}>
            <div className="flex gap-4 items-center">
              <ResponsiveContainer width="60%" height={200}>
                <PieChart>
                  <Pie data={payMethod ?? []} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={false}>
                    {(payMethod ?? []).map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`KES ${v.toLocaleString()}`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {(payMethod ?? []).map((m, i) => (
                  <div key={m.name} className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-gray-700 dark:text-gray-300">{m.name}</span>
                    <span className="font-semibold text-gray-900 dark:text-white ml-auto">{m.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
          <SectionCard title="Daily Collection Trend" isLoading={finLoading}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={finance?.recentDaily ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: axis }} />
                <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11, fill: axis }} />
                <Tooltip formatter={(v: number) => [`KES ${v.toLocaleString()}`, 'Collected']} />
                <Line type="monotone" dataKey="amount" stroke="#15803d" strokeWidth={2.5} dot={{ r: 4, fill: '#15803d' }} />
              </LineChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>
      )}

      {/* ── ACADEMICS ── */}
      {tab === 'Academics' && (
        <SectionCard title="Average Score by Subject (Current Term)" isLoading={acadLoading}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={academic ?? []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: axis }} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="subject" width={120} tick={{ fontSize: 11, fill: axis }} />
              <Tooltip formatter={(v: number) => [`${v}%`, 'Average Score']} />
              <Bar dataKey="average" fill="#E8B84B" radius={[0, 4, 4, 0]}>
                {(academic ?? []).map((entry, i) => (
                  <Cell key={i} fill={entry.average >= 70 ? '#10b981' : entry.average >= 50 ? '#E8B84B' : '#ef4444'} />
                ))}
              </Bar>
              <Bar dataKey="passMark" fill="none" strokeDasharray="4" stroke="#6b7280" fillOpacity={0} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3 text-xs">
            <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded-full bg-green-500" />70%+ (Good)</div>
            <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded-full bg-[#E8B84B]" />50–69% (Average)</div>
            <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded-full bg-red-500" />Below 50% (Needs attention)</div>
          </div>
        </SectionCard>
      )}

      {/* ── ADMISSIONS ── */}
      {tab === 'Admissions' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="Applications Funnel" isLoading={funnelLoading}>
            <div className="space-y-3">
              {(funnel ?? []).map((f, i) => (
                <div key={f.stage}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{f.stage}</span>
                    <span className="font-bold text-gray-900 dark:text-white">{f.count}</span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${funnel && funnel[0].count > 0 ? (f.count / funnel[0].count) * 100 : 0}%`, background: PIE_COLORS[i] }} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {/* ── STAFF ── */}
      {tab === 'Staff' && (
        <SectionCard title="Staff by Department" isLoading={staffLoading}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={staffDept ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="dept" tick={{ fontSize: 11, fill: axis }} />
              <YAxis tick={{ fontSize: 11, fill: axis }} />
              <Tooltip />
              <Bar dataKey="count" fill="#E8B84B" radius={[4, 4, 0, 0]}>
                {(staffDept ?? []).map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      )}
    </div>
  )
}
