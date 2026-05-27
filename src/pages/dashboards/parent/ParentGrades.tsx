import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Button } from '../../../components/ui/Button'
import { useStudentGrades } from '../../../hooks/useGrades'
import { BookOpen, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Link } from 'react-router-dom'

const LINKED_STUDENT_ID = 's-1'

const TERM_DATA: Record<string, { subject: string; score: number; classAvg: number; grade: string; position: number; remarks: string; teacher: string }[]> = {
  'Term 2, 2026': [
    { subject: 'Mathematics',    score: 82, classAvg: 71, grade: 'A-', position: 4,  remarks: 'Good grasp of algebra. Work on geometry.',        teacher: 'Mr. Ochieng'  },
    { subject: 'English',        score: 84, classAvg: 72, grade: 'A-', position: 3,  remarks: 'Excellent comprehension. Polish written expression.', teacher: 'Mrs. Wanjiku' },
    { subject: 'Kiswahili',      score: 76, classAvg: 74, grade: 'B+', position: 8,  remarks: 'Good effort. Improve on insha structure.',           teacher: 'Ms. Akinyi'   },
    { subject: 'Science',        score: 75, classAvg: 69, grade: 'B+', position: 6,  remarks: 'Theory is strong. More focus on practical work.',    teacher: 'Mr. Kamau'    },
    { subject: 'Social Studies', score: 86, classAvg: 75, grade: 'A',  position: 1,  remarks: 'Outstanding. Top of the class.',                    teacher: 'Mr. Njoroge'  },
    { subject: 'CRE',            score: 83, classAvg: 78, grade: 'A-', position: 5,  remarks: 'Excellent understanding of values.',                 teacher: 'Mr. Gitonga'  },
    { subject: 'Creative Arts',  score: 78, classAvg: 70, grade: 'B+', position: 6,  remarks: 'Creative and expressive. Well done.',               teacher: 'Ms. Chebet'   },
  ],
  'Term 1, 2026': [
    { subject: 'Mathematics',    score: 70, classAvg: 69, grade: 'B',  position: 9,  remarks: 'Satisfactory. More practice needed.',              teacher: 'Mr. Ochieng'  },
    { subject: 'English',        score: 75, classAvg: 71, grade: 'B+', position: 7,  remarks: 'Good reading skills. Work on composition.',         teacher: 'Mrs. Wanjiku' },
    { subject: 'Kiswahili',      score: 71, classAvg: 73, grade: 'B',  position: 12, remarks: 'Average performance. Improve vocabulary.',          teacher: 'Ms. Akinyi'   },
    { subject: 'Science',        score: 68, classAvg: 67, grade: 'B',  position: 11, remarks: 'Work harder on experiments.',                       teacher: 'Mr. Kamau'    },
    { subject: 'Social Studies', score: 80, classAvg: 74, grade: 'A-', position: 4,  remarks: 'Very good understanding of map work.',              teacher: 'Mr. Njoroge'  },
    { subject: 'CRE',            score: 77, classAvg: 77, grade: 'B+', position: 9,  remarks: 'Good participation.',                              teacher: 'Mr. Gitonga'  },
    { subject: 'Creative Arts',  score: 67, classAvg: 69, grade: 'B',  position: 14, remarks: 'Needs more effort in portfolio.',                   teacher: 'Ms. Chebet'   },
  ],
  'Term 3, 2025': [
    { subject: 'Mathematics',    score: 64, classAvg: 66, grade: 'B-', position: 12, remarks: 'Must revise number operations.',                   teacher: 'Mr. Ochieng'  },
    { subject: 'English',        score: 72, classAvg: 70, grade: 'B',  position: 9,  remarks: 'Good reading. Improve writing.',                   teacher: 'Mrs. Wanjiku' },
    { subject: 'Kiswahili',      score: 68, classAvg: 71, grade: 'B',  position: 11, remarks: 'Satisfactory.',                                   teacher: 'Ms. Akinyi'   },
    { subject: 'Science',        score: 65, classAvg: 65, grade: 'B-', position: 13, remarks: 'Needs improvement in practicals.',                 teacher: 'Mr. Kamau'    },
    { subject: 'Social Studies', score: 76, classAvg: 72, grade: 'B+', position: 6,  remarks: 'Good map reading skills.',                         teacher: 'Mr. Njoroge'  },
    { subject: 'CRE',            score: 72, classAvg: 74, grade: 'B',  position: 10, remarks: 'Good moral values.',                              teacher: 'Mr. Gitonga'  },
    { subject: 'Creative Arts',  score: 62, classAvg: 68, grade: 'B-', position: 15, remarks: 'Participate more actively.',                       teacher: 'Ms. Chebet'   },
  ],
}

const TERMS = Object.keys(TERM_DATA)

const GRADE_COLOR: Record<string, string> = {
  'A':  'text-green-700 dark:text-green-400',
  'A-': 'text-green-600 dark:text-green-400',
  'B+': 'text-blue-600 dark:text-blue-400',
  'B':  'text-blue-500 dark:text-blue-400',
  'B-': 'text-yellow-600 dark:text-yellow-400',
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg px-3 py-2 text-xs">
      <p className="font-bold text-gray-800 dark:text-gray-200 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}%</p>
      ))}
    </div>
  )
}

export function ParentGrades() {
  const { data: progress, isLoading } = useStudentGrades(LINKED_STUDENT_ID)
  const [term, setTerm] = useState(TERMS[0])
  const subjects = TERM_DATA[term]
  const avg = subjects ? Math.round(subjects.reduce((s, x) => s + x.score, 0) / subjects.length) : 0
  const chartData = subjects?.map(s => ({ subject: s.subject.split(' ')[0], score: s.score, classAvg: s.classAvg }))

  const prevTerm = TERMS[TERMS.indexOf(term) + 1]
  const prevSubjects = prevTerm ? TERM_DATA[prevTerm] : null
  const prevAvg = prevSubjects ? Math.round(prevSubjects.reduce((s, x) => s + x.score, 0) / prevSubjects.length) : null
  const trend = prevAvg !== null ? (avg > prevAvg ? 'up' : avg < prevAvg ? 'down' : 'same') : 'same'
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const trendColor = trend === 'up' ? 'text-green-600 dark:text-green-400' : trend === 'down' ? 'text-red-500' : 'text-gray-400'

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Academic Grades</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Amani Kariuki · Grade 5 Gold</p>
        </div>
        <Link to="/dashboard/parent/report-cards">
          <Button variant="outline" className="gap-1.5 text-sm">
            <BookOpen className="h-4 w-4" />
            Full Report Card
          </Button>
        </Link>
      </div>

      {/* Term selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TERMS.map(t => (
          <button
            key={t}
            onClick={() => setTerm(t)}
            className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition ${
              term === t
                ? 'bg-green-700 text-white'
                : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Mean Score',    value: `${avg}%` },
          { label: 'Class Position', value: '4 / 32' },
          {
            label: 'Trend vs Last Term',
            value: prevAvg !== null ? (
              <span className={`flex items-center gap-1 ${trendColor}`}>
                <TrendIcon className="h-4 w-4" />
                {Math.abs(avg - prevAvg)}% {trend === 'up' ? 'up' : trend === 'down' ? 'down' : 'same'}
              </span>
            ) : '—',
          },
          { label: 'Subjects',      value: subjects?.length ?? '—' },
        ].map(s => (
          <GlassCard key={s.label} className="p-4 text-center">
            <p className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Chart */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 dark:text-white">Performance by Subject</h2>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-green-700" />Amani</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-gray-300 dark:bg-gray-600" />Class Avg</span>
          </div>
        </div>
        {isLoading ? (
          <div className="h-64 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-700" />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="subject" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={50} stroke="rgba(239,68,68,0.3)" strokeDasharray="4 4" label={{ value: 'Pass', position: 'right', fontSize: 9, fill: '#ef4444' }} />
              <Bar dataKey="score"    name="Amani"     fill="#15803d" radius={[6, 6, 0, 0]} />
              <Bar dataKey="classAvg" name="Class Avg" fill="#d1d5db" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </GlassCard>

      {/* Subject breakdown table */}
      <GlassCard className="overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-white">Subject Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Subject</th>
                <th className="text-center px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Score</th>
                <th className="text-center px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Class Avg</th>
                <th className="text-center px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Grade</th>
                <th className="text-center px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Position</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 hidden md:table-cell">Teacher's Remark</th>
              </tr>
            </thead>
            <tbody>
              {subjects?.map((s, i) => (
                <tr key={s.subject} className={`border-b border-gray-50 dark:border-gray-800/50 ${i % 2 === 1 ? 'bg-gray-50/50 dark:bg-gray-800/20' : ''}`}>
                  <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-200">{s.subject}</td>
                  <td className="px-3 py-3 text-center">
                    <span className="font-bold text-gray-900 dark:text-white">{s.score}%</span>
                  </td>
                  <td className="px-3 py-3 text-center text-gray-500 dark:text-gray-400">{s.classAvg}%</td>
                  <td className={`px-3 py-3 text-center font-bold ${GRADE_COLOR[s.grade] ?? 'text-gray-500'}`}>{s.grade}</td>
                  <td className="px-3 py-3 text-center text-gray-500 dark:text-gray-400">{s.position}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 hidden md:table-cell">{s.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

    </div>
  )
}
