import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts'
import { TrendingUp, Users, Banknote, GraduationCap, Download } from 'lucide-react'
import { useToast } from '../../../contexts/ToastContext'

const ENROLLMENT_TREND = [
  { year: '2021', students: 1540 },
  { year: '2022', students: 1680 },
  { year: '2023', students: 1820 },
  { year: '2024', students: 1960 },
  { year: '2025', students: 2010 },
  { year: '2026', students: 2048 },
]

const ENROLLMENT_BY_LEVEL = [
  { level: 'Daycare',      count: 185 },
  { level: 'PP1–PP2',      count: 240 },
  { level: 'Grade 1–3',    count: 420 },
  { level: 'Grade 4–6',    count: 410 },
  { level: 'Grade 7–9',    count: 380 },
  { level: 'Form 1–4',     count: 413 },
]

const FEE_COLLECTION = [
  { month: 'Jan', collected: 3200000, target: 3500000 },
  { month: 'Feb', collected: 2800000, target: 3000000 },
  { month: 'Mar', collected: 3100000, target: 3200000 },
  { month: 'Apr', collected: 2900000, target: 3100000 },
  { month: 'May', collected: 2600000, target: 3000000 },
]

const GRADE_DISTRIBUTION = [
  { grade: 'A (80–100)', count: 620, color: '#15803d' },
  { grade: 'B (60–79)',  count: 740, color: '#2563eb' },
  { grade: 'C (40–59)', count: 480, color: '#d97706' },
  { grade: 'D (0–39)',   count: 208, color: '#dc2626' },
]

const DEPT_PERFORMANCE = [
  { dept: 'Sciences',   avg: 78 },
  { dept: 'Languages',  avg: 82 },
  { dept: 'Humanities', avg: 75 },
  { dept: 'Music',      avg: 88 },
  { dept: 'Drama',      avg: 91 },
  { dept: 'Sports',     avg: 85 },
]

const ATTENDANCE_MONTHLY = [
  { month: 'Jan', rate: 92 },
  { month: 'Feb', rate: 94 },
  { month: 'Mar', rate: 91 },
  { month: 'Apr', rate: 95 },
  { month: 'May', rate: 93 },
]

const SUMMARY_CARDS = [
  { label: 'Total Enrolment', value: '2,048', change: '+38 vs 2025', trend: 'up', icon: Users, color: 'text-blue-600 dark:text-blue-400' },
  { label: 'Fee Collection Rate', value: '94%', change: '+2% vs Term 1', trend: 'up', icon: Banknote, color: 'text-green-600 dark:text-green-400' },
  { label: 'School Average', value: '79%', change: '+3% vs last term', trend: 'up', icon: GraduationCap, color: 'text-purple-600 dark:text-purple-400' },
  { label: 'Avg Attendance', value: '93%', change: 'Stable', trend: 'up', icon: TrendingUp, color: 'text-yellow-600 dark:text-yellow-500' },
]

export function ReportsManager() {
  const { showToast } = useToast()

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">School performance overview — Term 2, 2026</p>
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
        {SUMMARY_CARDS.map(c => (
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
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Enrolment Trend (2021–2026)</h2>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={ENROLLMENT_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis domain={[1400, 2200]} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => [v.toLocaleString(), 'Students']} />
                <Line type="monotone" dataKey="students" stroke="#15803d" strokeWidth={2.5} dot={{ r: 4, fill: '#15803d' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Enrolment by School Level</h2>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={ENROLLMENT_BY_LEVEL} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="level" type="category" tick={{ fontSize: 11 }} width={80} />
                <Tooltip formatter={(v: number) => [v, 'Students']} />
                <Bar dataKey="count" fill="#E8B84B" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Fee Collection vs Target (KES)</h2>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={FEE_COLLECTION}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(v: number) => [`KES ${v.toLocaleString()}`, '']} />
                <Legend />
                <Bar dataKey="target" name="Target" fill="#d1d5db" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collected" name="Collected" fill="#15803d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Grade Distribution — All Students</h2>
          </div>
          <div className="p-6 flex items-center gap-6">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={GRADE_DISTRIBUTION} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="count" paddingAngle={3}>
                  {GRADE_DISTRIBUTION.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v: number) => [v, 'Students']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2.5">
              {GRADE_DISTRIBUTION.map(g => (
                <div key={g.grade} className="flex items-center gap-2 text-sm">
                  <span className="h-3 w-3 rounded-sm shrink-0" style={{ backgroundColor: g.color }} />
                  <span className="text-gray-700 dark:text-gray-300">{g.grade}</span>
                  <span className="font-bold text-gray-900 dark:text-white ml-auto">{g.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts row 3 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Average Performance by Department</h2>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={DEPT_PERFORMANCE}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="dept" tick={{ fontSize: 11 }} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => [`${v}%`, 'Avg Score']} />
                <Bar dataKey="avg" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Monthly Attendance Rate (%)</h2>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={ATTENDANCE_MONTHLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[85, 100]} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => [`${v}%`, 'Attendance Rate']} />
                <Line type="monotone" dataKey="rate" stroke="#E8B84B" strokeWidth={2.5} dot={{ r: 4, fill: '#E8B84B' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
