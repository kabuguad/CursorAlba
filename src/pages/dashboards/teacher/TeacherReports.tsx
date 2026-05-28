import { useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, RadarChart, Radar,
  PolarGrid, PolarAngleAxis,
} from 'recharts'
import { GlassCard } from '../../../components/ui/GlassCard'
import { AlertTriangle, TrendingUp, TrendingDown, Users, Award, Download, ChevronDown } from 'lucide-react'

const CLASSES = ['Grade 4 Red', 'Grade 5 Gold', 'Grade 5 Blue', 'Grade 6 Silver', 'Grade 7 Green']

const TERM_TREND: Record<string, { term: string; avg: number }[]> = {
  'Grade 5 Gold': [
    { term: 'Term 1 2024', avg: 61 }, { term: 'Term 2 2024', avg: 65 },
    { term: 'Term 3 2024', avg: 63 }, { term: 'Term 1 2025', avg: 68 }, { term: 'Term 2 2025', avg: 71 },
  ],
  'Grade 6 Silver': [
    { term: 'Term 1 2024', avg: 55 }, { term: 'Term 2 2024', avg: 58 },
    { term: 'Term 3 2024', avg: 60 }, { term: 'Term 1 2025', avg: 62 }, { term: 'Term 2 2025', avg: 64 },
  ],
  'Grade 5 Blue': [
    { term: 'Term 1 2024', avg: 58 }, { term: 'Term 2 2024', avg: 56 },
    { term: 'Term 3 2024', avg: 59 }, { term: 'Term 1 2025', avg: 61 }, { term: 'Term 2 2025', avg: 60 },
  ],
  'Grade 4 Red': [
    { term: 'Term 1 2024', avg: 70 }, { term: 'Term 2 2024', avg: 72 },
    { term: 'Term 3 2024', avg: 68 }, { term: 'Term 1 2025', avg: 74 }, { term: 'Term 2 2025', avg: 76 },
  ],
  'Grade 7 Green': [
    { term: 'Term 1 2024', avg: 52 }, { term: 'Term 2 2024', avg: 55 },
    { term: 'Term 3 2024', avg: 57 }, { term: 'Term 1 2025', avg: 59 }, { term: 'Term 2 2025', avg: 62 },
  ],
}

const ASSESSMENT_BREAKDOWN: Record<string, { name: string; classAvg: number; topScore: number; lowestScore: number }[]> = {
  'Grade 5 Gold': [
    { name: 'CAT 1',    classAvg: 72, topScore: 95, lowestScore: 28 },
    { name: 'CAT 2',    classAvg: 68, topScore: 97, lowestScore: 24 },
    { name: 'Mid-Term', classAvg: 74, topScore: 96, lowestScore: 31 },
    { name: 'End-Term', classAvg: 70, topScore: 94, lowestScore: 29 },
  ],
  'Grade 6 Silver': [
    { name: 'CAT 1',    classAvg: 64, topScore: 92, lowestScore: 21 },
    { name: 'CAT 2',    classAvg: 61, topScore: 90, lowestScore: 19 },
    { name: 'Mid-Term', classAvg: 66, topScore: 93, lowestScore: 24 },
    { name: 'End-Term', classAvg: 63, topScore: 91, lowestScore: 22 },
  ],
}

const DISTRIBUTION: Record<string, { grade: string; count: number; color: string }[]> = {
  'Grade 5 Gold': [
    { grade: 'A (≥80%)',    count: 4,  color: '#10b981' },
    { grade: 'B+ (70–79%)', count: 3,  color: '#3b82f6' },
    { grade: 'B (60–69%)',  count: 2,  color: '#6366f1' },
    { grade: 'C+ (50–59%)', count: 1,  color: '#f59e0b' },
    { grade: 'C (40–49%)',  count: 0,  color: '#f97316' },
    { grade: 'D (30–39%)',  count: 0,  color: '#ef4444' },
    { grade: 'E (<30%)',    count: 0,  color: '#7f1d1d' },
  ],
}

const AT_RISK = [
  { name: 'Kevin Mwangi',    class_: 'Grade 5 Gold',   avg: 34, attendance: 88, missing: 2, trend: 'down'  },
  { name: 'Amina Said',      class_: 'Grade 6 Silver', avg: 49, attendance: 61, missing: 1, trend: 'down'  },
  { name: 'Brian Otieno',    class_: 'Grade 5 Blue',   avg: 38, attendance: 79, missing: 3, trend: 'down'  },
  { name: 'Fatuma Hassan',   class_: 'Grade 4 Red',    avg: 44, attendance: 52, missing: 0, trend: 'down'  },
]

const TOP_STUDENTS = [
  { rank: 1, name: 'Nancy Wanjiku',   class_: 'Grade 5 Gold',   avg: 94, trend: 'up'   },
  { rank: 2, name: 'Rose Wathoni',    class_: 'Grade 5 Gold',   avg: 91, trend: 'up'   },
  { rank: 3, name: 'Emily Wairimu',   class_: 'Grade 6 Silver', avg: 88, trend: 'same' },
  { rank: 4, name: 'Aisha Kamau',     class_: 'Grade 4 Red',    avg: 87, trend: 'up'   },
  { rank: 5, name: 'Clara Muthoni',   class_: 'Grade 6 Silver', avg: 85, trend: 'up'   },
]

const COMPARE_RADAR = [
  { subject: 'CAT 1',    student: 70, classAvg: 72 },
  { subject: 'CAT 2',    student: 60, classAvg: 68 },
  { subject: 'Mid-Term', student: 78, classAvg: 74 },
  { subject: 'End-Term', student: 65, classAvg: 70 },
  { subject: 'Practical', student: 80, classAvg: 71 },
]

const CLASS_SUMMARIES = CLASSES.map(c => ({
  class_: c,
  avg: TERM_TREND[c]?.at(-1)?.avg ?? 60,
  prev: TERM_TREND[c]?.at(-2)?.avg ?? 58,
  students: { 'Grade 4 Red': 8, 'Grade 5 Gold': 10, 'Grade 5 Blue': 6, 'Grade 6 Silver': 8, 'Grade 7 Green': 5 }[c] ?? 0,
  passRate: { 'Grade 4 Red': 100, 'Grade 5 Gold': 80, 'Grade 5 Blue': 67, 'Grade 6 Silver': 75, 'Grade 7 Green': 60 }[c] ?? 70,
}))

export function TeacherReports() {
  const [selectedClass, setSelectedClass] = useState('Grade 5 Gold')

  const trendData = TERM_TREND[selectedClass] ?? []
  const assessData = ASSESSMENT_BREAKDOWN[selectedClass] ?? ASSESSMENT_BREAKDOWN['Grade 5 Gold']
  const distData   = (DISTRIBUTION[selectedClass] ?? DISTRIBUTION['Grade 5 Gold']).filter(d => d.count > 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Mathematics · Academic Year 2025</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select className="field pr-8 appearance-none" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
              {CLASSES.map(c => <option key={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <button className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700 px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* Class Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {CLASS_SUMMARIES.map(c => {
          const delta = c.avg - c.prev
          return (
            <button
              key={c.class_}
              onClick={() => setSelectedClass(c.class_)}
              className={`text-left p-4 rounded-xl border transition-all ${selectedClass === c.class_ ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/60 hover:border-emerald-300'}`}
            >
              <p className="text-xs font-medium text-gray-500 truncate">{c.class_}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{c.avg}%</p>
              <p className={`text-xs flex items-center gap-0.5 mt-0.5 ${delta >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {delta >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(delta)}% vs last term
              </p>
              <p className="text-xs text-gray-400 mt-1">{c.students} students · {c.passRate}% pass</p>
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Term Trend */}
        <GlassCard className="p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" /> Class Average Trend — {selectedClass}
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="term" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip formatter={(v: number) => [`${v}%`, 'Class Avg']} />
              <Line type="monotone" dataKey="avg" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981' }} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Assessment Breakdown */}
        <GlassCard className="p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Assessment Breakdown — {selectedClass}</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={assessData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip formatter={(v: number) => [`${v}%`]} />
              <Legend />
              <Bar dataKey="classAvg"   name="Class Avg"   fill="#10b981" radius={[4,4,0,0]} />
              <Bar dataKey="topScore"   name="Top Score"   fill="#3b82f6" radius={[4,4,0,0]} />
              <Bar dataKey="lowestScore" name="Lowest"    fill="#f87171" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Student vs Class Radar */}
        <GlassCard className="p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-1">Student vs Class Average</h2>
          <p className="text-xs text-gray-400 mb-4">Comparing Nancy Wanjiku against class average</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={COMPARE_RADAR}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <Radar name="Student"   dataKey="student"  stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              <Radar name="Class Avg" dataKey="classAvg" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Grade Distribution */}
        <GlassCard className="p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Grade Distribution — {selectedClass}</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={distData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
              <YAxis dataKey="grade" type="category" tick={{ fontSize: 11 }} width={90} />
              <Tooltip formatter={(v: number) => [v, 'Students']} />
              <Bar dataKey="count" name="Students" radius={[0,4,4,0]}>
                {distData.map((d, i) => (
                  <rect key={i} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* At-Risk Students */}
      <GlassCard className="p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500" /> At-Risk Students — All Classes
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Student</th>
                <th className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Class</th>
                <th className="text-center pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Avg</th>
                <th className="text-center pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Attendance</th>
                <th className="text-center pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Missing HW</th>
                <th className="text-center pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Trend</th>
                <th className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {AT_RISK.map(s => {
                const risk = s.avg < 40 || s.attendance < 70 ? 'High' : 'Medium'
                return (
                  <tr key={s.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                    <td className="py-3 font-medium text-gray-800 dark:text-white">{s.name}</td>
                    <td className="py-3 text-gray-600 dark:text-gray-400">{s.class_}</td>
                    <td className="py-3 text-center">
                      <span className={`font-bold ${s.avg < 40 ? 'text-red-600' : 'text-amber-600'}`}>{s.avg}%</span>
                    </td>
                    <td className="py-3 text-center">
                      <span className={`font-medium ${s.attendance < 70 ? 'text-red-600' : 'text-amber-600'}`}>{s.attendance}%</span>
                    </td>
                    <td className="py-3 text-center text-gray-700 dark:text-gray-300">{s.missing}</td>
                    <td className="py-3 text-center">
                      <TrendingDown className="w-4 h-4 text-red-500 mx-auto" />
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${risk === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}`}>
                        {risk}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Top Students */}
      <GlassCard className="p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" /> Top Performers — All Classes
        </h2>
        <div className="space-y-2">
          {TOP_STUDENTS.map(s => (
            <div key={s.rank} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                ${s.rank === 1 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                  s.rank === 2 ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300' :
                  s.rank === 3 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' :
                  'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                {s.rank}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800 dark:text-white text-sm">{s.name}</p>
                <p className="text-xs text-gray-500">{s.class_}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{s.avg}%</span>
                {s.trend === 'up' ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <Users className="w-4 h-4 text-gray-400" />}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
