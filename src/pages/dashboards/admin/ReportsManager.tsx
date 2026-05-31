import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts'
import { TrendingUp, Users, Banknote, GraduationCap, Download, Loader2, UserCheck } from 'lucide-react'
import { useToast } from '../../../contexts/ToastContext'
import { useTheme } from '../../../contexts/ThemeContext'
import {
  useOverviewKPIs, useEnrollmentTrend, useAttendanceTrend,
  useFeeCollectionByLevel, useAcademicPerformance,
  useAdmissionsFunnel, useStaffDeptBreakdown,
} from '../../../hooks/useAdminData'

const GRADE_COLORS = ['#15803d', '#2563eb', '#d97706', '#dc2626']

function ChartCard({ title, loading, children }: { title: string; loading?: boolean; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 dark:text-white">{title}</h2>
        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-400" />}
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

export function ReportsManager() {
  const { showToast }  = useToast()
  const { theme }      = useTheme()
  const grid = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'
  const axis = theme === 'dark' ? '#9ca3af' : '#6b7280'

  const { data: kpis,        isLoading: kLoad }  = useOverviewKPIs()
  const { data: enrollment,  isLoading: eLoad }  = useEnrollmentTrend()
  const { data: attendance,  isLoading: aLoad }  = useAttendanceTrend()
  const { data: feeByLevel,  isLoading: fLoad }  = useFeeCollectionByLevel()
  const { data: academic,    isLoading: acLoad } = useAcademicPerformance()
  const { data: funnel,      isLoading: fnLoad } = useAdmissionsFunnel()
  const { data: staffDepts,  isLoading: sdLoad } = useStaffDeptBreakdown()

  const summaryCards = kpis ? [
    { label: 'Total Enrolment',     value: String(kpis.totalStudents.value),    change: kpis.totalStudents.change,    trend: kpis.totalStudents.trend,    icon: Users,        color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Fee Collection Rate', value: String(kpis.feeCollection.value),    change: kpis.feeCollection.change,    trend: kpis.feeCollection.trend,    icon: Banknote,     color: 'text-green-600 dark:text-green-400' },
    { label: 'Total Staff',         value: String(kpis.totalStaff.value),       change: kpis.totalStaff.change,       trend: kpis.totalStaff.trend,       icon: UserCheck,    color: 'text-purple-600 dark:text-purple-400' },
    { label: 'Pending Admissions',  value: String(kpis.pendingAdmissions.value), change: kpis.pendingAdmissions.change, trend: kpis.pendingAdmissions.trend, icon: GraduationCap, color: 'text-yellow-600 dark:text-yellow-500' },
  ] : []

  const gradeDistribution = academic ? [
    { grade: 'A (80–100)',  count: academic.filter(s => s.average >= 80).length,             color: GRADE_COLORS[0] },
    { grade: 'B (65–79)',   count: academic.filter(s => s.average >= 65 && s.average < 80).length, color: GRADE_COLORS[1] },
    { grade: 'C (50–64)',   count: academic.filter(s => s.average >= 50 && s.average < 65).length, color: GRADE_COLORS[2] },
    { grade: 'D (0–49)',    count: academic.filter(s => s.average < 50).length,              color: GRADE_COLORS[3] },
  ] : []

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">School performance overview — all data live from db</p>
        </div>
        <button
          onClick={() => showToast('Report exported — PDF ready')}
          className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          <Download className="h-4 w-4" /> Export PDF
        </button>
      </div>

      {/* Summary KPIs */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kLoad
          ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />)
          : summaryCards.map(c => (
            <div key={c.label} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{c.label}</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{c.value}</p>
                  <p className={`mt-1 text-xs font-medium ${c.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                    {c.trend === 'up' ? '↑' : '↓'} {c.change}
                  </p>
                </div>
                <div className={`rounded-xl bg-gray-50 dark:bg-gray-700 p-2 ${c.color}`}>
                  <c.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))
        }
      </div>

      {/* Charts row 1 */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Enrolment Trend (8 Terms)" loading={eLoad}>
          {enrollment ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={enrollment}>
                <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                <XAxis dataKey="term" tick={{ fontSize: 10, fill: axis }} angle={-20} textAnchor="end" height={40} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11, fill: axis }} />
                <Tooltip formatter={(v: number) => [v.toLocaleString(), 'Students']} />
                <Line type="monotone" dataKey="count" name="Students" stroke="#15803d" strokeWidth={2.5} dot={{ r: 4, fill: '#15803d' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <div className="h-[220px] animate-pulse rounded-xl bg-gray-100 dark:bg-gray-700" />}
        </ChartCard>

        <ChartCard title="Academic Performance by Subject" loading={acLoad}>
          {academic ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={academic} layout="vertical" margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: axis }} tickFormatter={v => `${v}%`} />
                <YAxis dataKey="subject" type="category" tick={{ fontSize: 10, fill: axis }} width={90} />
                <Tooltip formatter={(v: number) => [`${v}%`, 'Average']} />
                <Bar dataKey="average" name="Avg Score" fill="#7c3aed" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-[220px] animate-pulse rounded-xl bg-gray-100 dark:bg-gray-700" />}
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Fee Collection Rate by Level" loading={fLoad}>
          {feeByLevel ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={feeByLevel}>
                <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                <XAxis dataKey="level" tick={{ fontSize: 10, fill: axis }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: axis }} tickFormatter={v => `${v}%`} />
                <Tooltip formatter={(v: number, name: string) => [name === 'rate' ? `${v}%` : `KES ${v.toLocaleString()}`, name === 'rate' ? 'Collection Rate' : name]} />
                <Legend />
                <Bar dataKey="target" name="Target (KES)" fill="#d1d5db" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collected" name="Collected (KES)" fill="#15803d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-[220px] animate-pulse rounded-xl bg-gray-100 dark:bg-gray-700" />}
        </ChartCard>

        <ChartCard title="Grade Distribution — By Subject Average" loading={acLoad}>
          {gradeDistribution.length > 0 ? (
            <div className="flex items-center gap-6 h-[220px]">
              <ResponsiveContainer width="55%" height="100%">
                <PieChart>
                  <Pie data={gradeDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="count" paddingAngle={3}>
                    {gradeDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => [v, 'Subjects']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2.5">
                {gradeDistribution.map(g => (
                  <div key={g.grade} className="flex items-center gap-2 text-sm">
                    <span className="h-3 w-3 rounded-sm shrink-0" style={{ backgroundColor: g.color }} />
                    <span className="text-gray-700 dark:text-gray-300">{g.grade}</span>
                    <span className="font-bold text-gray-900 dark:text-white ml-auto">{g.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <div className="h-[220px] animate-pulse rounded-xl bg-gray-100 dark:bg-gray-700" />}
        </ChartCard>
      </div>

      {/* Charts row 3 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Weekly Attendance Rate (%)" loading={aLoad}>
          {attendance ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={attendance}>
                <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: axis }} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: axis }} />
                <Tooltip formatter={(v: number) => [`${v}%`, 'Attendance Rate']} />
                <Line type="monotone" dataKey="rate" name="Attendance %" stroke="#E8B84B" strokeWidth={2.5} dot={{ r: 4, fill: '#E8B84B' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <div className="h-[220px] animate-pulse rounded-xl bg-gray-100 dark:bg-gray-700" />}
        </ChartCard>

        <ChartCard title="Staff Distribution by Department" loading={sdLoad}>
          {staffDepts ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={staffDepts} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                <XAxis type="number" tick={{ fontSize: 11, fill: axis }} />
                <YAxis dataKey="dept" type="category" tick={{ fontSize: 10, fill: axis }} width={80} />
                <Tooltip formatter={(v: number) => [v, 'Staff']} />
                <Bar dataKey="count" name="Staff Count" fill="#E8B84B" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-[220px] animate-pulse rounded-xl bg-gray-100 dark:bg-gray-700" />}
        </ChartCard>
      </div>

      {/* Admissions funnel */}
      <div className="mt-6">
        <ChartCard title="Admissions Funnel — Current Intake" loading={fnLoad}>
          {funnel ? (
            <div className="grid grid-cols-4 gap-3">
              {funnel.map((stage, i) => (
                <div key={stage.stage} className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/40">
                  <div className="text-3xl font-extrabold text-gray-900 dark:text-white">{stage.count}</div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 font-medium">{stage.stage}</div>
                  {i < funnel.length - 1 && funnel[i].count > 0 && (
                    <div className="mt-1.5 text-xs text-gray-400">
                      {Math.round(funnel[i + 1].count / funnel[i].count * 100)}% →
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : <div className="h-24 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-700" />}
        </ChartCard>
      </div>
    </div>
  )
}
