import { useState, useRef } from 'react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Button } from '../../../components/ui/Button'
import { Download, Printer, Award, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useToast } from '../../../contexts/ToastContext'

interface SubjectReport {
  subject: string
  cat1: number
  cat2: number
  exam: number
  total: number
  grade: string
  points: number
  remarks: string
  teacher: string
}

interface TermReport {
  term: string
  year: number
  student: string
  admNo: string
  class: string
  classTeacher: string
  streamSize: number
  position: number
  totalMarks: number
  meanScore: number
  meanGrade: string
  classMean: number
  conduct: string
  classTeacherComment: string
  principalComment: string
  nextTermBegins: string
  subjects: SubjectReport[]
}

const REPORTS: Record<string, TermReport> = {
  '2026-T2': {
    term: 'Term 2', year: 2026,
    student: 'Amani Kariuki', admNo: 'AS/2019/0847',
    class: 'Grade 5 Gold', classTeacher: 'Mrs. Grace Kamau',
    streamSize: 32, position: 4,
    totalMarks: 542, meanScore: 77.4, meanGrade: 'B+', classMean: 71.2,
    conduct: 'Excellent',
    classTeacherComment: 'Amani is a focused and enthusiastic learner. She participates actively in class and demonstrates strong analytical skills. I encourage her to continue building confidence in Science practicals.',
    principalComment: 'A commendable performance. Amani represents the values of Alber School — discipline, curiosity and excellence. Keep striving for the top.',
    nextTermBegins: '1 September 2026',
    subjects: [
      { subject: 'Mathematics',    cat1: 68, cat2: 78, exam: 80, total: 82, grade: 'A-', points: 11, remarks: 'Good grasp of algebra. Work on geometry.', teacher: 'Mr. Ochieng'  },
      { subject: 'English',        cat1: 74, cat2: 76, exam: 82, total: 84, grade: 'A-', points: 11, remarks: 'Excellent comprehension. Polish written expression.', teacher: 'Mrs. Wanjiku' },
      { subject: 'Kiswahili',      cat1: 70, cat2: 72, exam: 75, total: 76, grade: 'B+', points: 10, remarks: 'Good effort. Improve on insha structure.', teacher: 'Ms. Akinyi'   },
      { subject: 'Science',        cat1: 65, cat2: 72, exam: 74, total: 75, grade: 'B+', points: 10, remarks: 'Theory is strong. More focus on practical work.', teacher: 'Mr. Kamau'    },
      { subject: 'Social Studies', cat1: 80, cat2: 82, exam: 85, total: 86, grade: 'A',  points: 12, remarks: 'Outstanding. Top of the class.', teacher: 'Mr. Njoroge'  },
      { subject: 'CRE',            cat1: 78, cat2: 80, exam: 82, total: 83, grade: 'A-', points: 11, remarks: 'Excellent understanding of values.', teacher: 'Mr. Gitonga'  },
      { subject: 'Creative Arts',  cat1: 72, cat2: 75, exam: 76, total: 78, grade: 'B+', points: 10, remarks: 'Creative and expressive. Well done.', teacher: 'Ms. Chebet'   },
    ],
  },
  '2026-T1': {
    term: 'Term 1', year: 2026,
    student: 'Amani Kariuki', admNo: 'AS/2019/0847',
    class: 'Grade 5 Gold', classTeacher: 'Mrs. Grace Kamau',
    streamSize: 32, position: 7,
    totalMarks: 498, meanScore: 71.1, meanGrade: 'B', classMean: 69.8,
    conduct: 'Good',
    classTeacherComment: 'Amani showed steady improvement throughout the term. She is disciplined and well-behaved. She should work on completing assignments on time.',
    principalComment: 'Good effort this term. I look forward to seeing even stronger performance in Term 2.',
    nextTermBegins: '28 April 2026',
    subjects: [
      { subject: 'Mathematics',    cat1: 60, cat2: 65, exam: 68, total: 70, grade: 'B',  points: 9,  remarks: 'Satisfactory. More practice needed.', teacher: 'Mr. Ochieng'  },
      { subject: 'English',        cat1: 70, cat2: 72, exam: 74, total: 75, grade: 'B+', points: 10, remarks: 'Good reading skills. Work on composition.', teacher: 'Mrs. Wanjiku' },
      { subject: 'Kiswahili',      cat1: 65, cat2: 68, exam: 70, total: 71, grade: 'B',  points: 9,  remarks: 'Average performance. Improve vocabulary.', teacher: 'Ms. Akinyi'   },
      { subject: 'Science',        cat1: 60, cat2: 62, exam: 68, total: 68, grade: 'B',  points: 9,  remarks: 'Work harder on experiments.', teacher: 'Mr. Kamau'    },
      { subject: 'Social Studies', cat1: 75, cat2: 78, exam: 80, total: 80, grade: 'A-', points: 11, remarks: 'Very good understanding of map work.', teacher: 'Mr. Njoroge'  },
      { subject: 'CRE',            cat1: 72, cat2: 74, exam: 76, total: 77, grade: 'B+', points: 10, remarks: 'Good participation.', teacher: 'Mr. Gitonga'  },
      { subject: 'Creative Arts',  cat1: 60, cat2: 62, exam: 65, total: 67, grade: 'B',  points: 9,  remarks: 'Needs more effort in portfolio.', teacher: 'Ms. Chebet'   },
    ],
  },
  '2025-T3': {
    term: 'Term 3', year: 2025,
    student: 'Amani Kariuki', admNo: 'AS/2019/0847',
    class: 'Grade 4 Gold', classTeacher: 'Mr. David Mwangi',
    streamSize: 30, position: 9,
    totalMarks: 476, meanScore: 68.0, meanGrade: 'B', classMean: 67.5,
    conduct: 'Good',
    classTeacherComment: 'Amani is a pleasant student who works hard. She has shown improvement from Term 2 and we expect even better results next year.',
    principalComment: 'Well done completing Grade 4. We look forward to seeing you grow in Grade 5.',
    nextTermBegins: '20 January 2026',
    subjects: [
      { subject: 'Mathematics',    cat1: 55, cat2: 60, exam: 64, total: 64, grade: 'B-', points: 8,  remarks: 'Must revise number operations.', teacher: 'Mr. Ochieng'  },
      { subject: 'English',        cat1: 68, cat2: 70, exam: 72, total: 72, grade: 'B',  points: 9,  remarks: 'Good reading. Improve writing.', teacher: 'Mrs. Wanjiku' },
      { subject: 'Kiswahili',      cat1: 62, cat2: 65, exam: 68, total: 68, grade: 'B',  points: 9,  remarks: 'Satisfactory.', teacher: 'Ms. Akinyi'   },
      { subject: 'Science',        cat1: 58, cat2: 60, exam: 65, total: 65, grade: 'B-', points: 8,  remarks: 'Needs improvement in practicals.', teacher: 'Mr. Kamau'    },
      { subject: 'Social Studies', cat1: 72, cat2: 74, exam: 76, total: 76, grade: 'B+', points: 10, remarks: 'Good map reading skills.', teacher: 'Mr. Njoroge'  },
      { subject: 'CRE',            cat1: 68, cat2: 70, exam: 72, total: 72, grade: 'B',  points: 9,  remarks: 'Good moral values.', teacher: 'Mr. Gitonga'  },
      { subject: 'Creative Arts',  cat1: 58, cat2: 60, exam: 62, total: 62, grade: 'B-', points: 8,  remarks: 'Participate more actively.', teacher: 'Ms. Chebet'   },
    ],
  },
}

const GRADE_COLOR: Record<string, string> = {
  'A':  'text-green-700 dark:text-green-400 font-bold',
  'A-': 'text-green-600 dark:text-green-400 font-bold',
  'B+': 'text-blue-600 dark:text-blue-400 font-semibold',
  'B':  'text-blue-500 dark:text-blue-400 font-semibold',
  'B-': 'text-yellow-600 dark:text-yellow-400 font-semibold',
  'C+': 'text-orange-600 dark:text-orange-400',
  'C':  'text-red-500 dark:text-red-400',
}

const TERM_KEYS = ['2026-T2', '2026-T1', '2025-T3'] as const

export function ParentReportCards() {
  const { showToast } = useToast()
  const [selected, setSelected] = useState<string>('2026-T2')
  const printRef = useRef<HTMLDivElement>(null)
  const report = REPORTS[selected]

  const prevKey = TERM_KEYS[TERM_KEYS.indexOf(selected as typeof TERM_KEYS[number]) + 1]
  const prev = prevKey ? REPORTS[prevKey] : null
  const trend = prev
    ? report.meanScore > prev.meanScore ? 'up'
      : report.meanScore < prev.meanScore ? 'down' : 'same'
    : 'same'
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-500' : 'text-gray-400'

  const handlePrint = () => {
    window.print()
    showToast('Print dialog opened')
  }
  const handleDownload = () => showToast('Report card download coming soon')

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Report Cards</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Amani Kariuki · Adm No: AS/2019/0847</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint} className="gap-1.5 text-sm">
            <Printer className="h-4 w-4" /> Print
          </Button>
          <Button variant="gold" onClick={handleDownload} className="gap-1.5 text-sm">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
        </div>
      </div>

      {/* Term selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TERM_KEYS.map(key => {
          const r = REPORTS[key]
          return (
            <button
              key={key}
              onClick={() => setSelected(key)}
              className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition ${
                selected === key
                  ? 'bg-green-700 text-white'
                  : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {r.term} {r.year}
            </button>
          )
        })}
      </div>

      <div ref={printRef} className="space-y-5">

        {/* Report header card */}
        <GlassCard className="p-6">
          <div className="flex flex-wrap gap-6 items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8B84B] text-[#0d1b0d] font-bold text-lg">A</div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Alber School</p>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">Kutus · Kirinyaga County</p>
                </div>
              </div>
              <p className="text-xs text-gray-500"><span className="font-semibold text-gray-700 dark:text-gray-300">Student:</span> {report.student}</p>
              <p className="text-xs text-gray-500"><span className="font-semibold text-gray-700 dark:text-gray-300">Adm No:</span> {report.admNo}</p>
              <p className="text-xs text-gray-500"><span className="font-semibold text-gray-700 dark:text-gray-300">Class:</span> {report.class}</p>
              <p className="text-xs text-gray-500"><span className="font-semibold text-gray-700 dark:text-gray-300">Class Teacher:</span> {report.classTeacher}</p>
              <p className="text-xs text-gray-500"><span className="font-semibold text-gray-700 dark:text-gray-300">Term:</span> {report.term} {report.year}</p>
            </div>

            <div className="flex flex-wrap gap-4">
              {[
                { label: 'Mean Score', value: `${report.meanScore}%`, color: 'text-green-700 dark:text-green-400' },
                { label: 'Mean Grade', value: report.meanGrade, color: 'text-green-700 dark:text-green-400' },
                { label: 'Position',   value: `${report.position} / ${report.streamSize}`, color: 'text-gray-900 dark:text-white' },
                { label: 'Conduct',    value: report.conduct, color: 'text-blue-600 dark:text-blue-400' },
              ].map(stat => (
                <div key={stat.label} className="rounded-xl bg-gray-50 dark:bg-gray-800 px-4 py-3 text-center min-w-[90px]">
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">{stat.label}</p>
                </div>
              ))}
              {prev && (
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800 px-4 py-3 text-center min-w-[90px] flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center gap-1">
                    <TrendIcon className={`h-5 w-5 ${trendColor}`} />
                    <span className={`text-sm font-bold ${trendColor}`}>
                      {Math.abs(report.meanScore - prev.meanScore).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">vs {prev.term}</p>
                </div>
              )}
            </div>
          </div>
        </GlassCard>

        {/* Subjects table */}
        <GlassCard className="overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-gray-400" />
              Academic Performance
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Subject</th>
                  <th className="text-center px-3 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">CAT 1</th>
                  <th className="text-center px-3 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">CAT 2</th>
                  <th className="text-center px-3 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Exam</th>
                  <th className="text-center px-3 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Total</th>
                  <th className="text-center px-3 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Grade</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide hidden md:table-cell">Teacher's Remarks</th>
                </tr>
              </thead>
              <tbody>
                {report.subjects.map((s, i) => (
                  <tr
                    key={s.subject}
                    className={`border-b border-gray-50 dark:border-gray-800/50 ${
                      i % 2 === 0 ? '' : 'bg-gray-50/50 dark:bg-gray-800/20'
                    }`}
                  >
                    <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-200">{s.subject}</td>
                    <td className="px-3 py-3 text-center text-gray-600 dark:text-gray-400">{s.cat1}</td>
                    <td className="px-3 py-3 text-center text-gray-600 dark:text-gray-400">{s.cat2}</td>
                    <td className="px-3 py-3 text-center text-gray-600 dark:text-gray-400">{s.exam}</td>
                    <td className="px-3 py-3 text-center font-semibold text-gray-800 dark:text-gray-200">{s.total}</td>
                    <td className={`px-3 py-3 text-center ${GRADE_COLOR[s.grade] ?? ''}`}>{s.grade}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs hidden md:table-cell">{s.remarks}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                  <td className="px-5 py-3 font-bold text-gray-900 dark:text-white" colSpan={3}>TOTAL</td>
                  <td className="px-3 py-3 text-center" />
                  <td className="px-3 py-3 text-center font-bold text-gray-900 dark:text-white">{report.totalMarks}</td>
                  <td className={`px-3 py-3 text-center ${GRADE_COLOR[report.meanGrade] ?? ''}`}>{report.meanGrade}</td>
                  <td className="hidden md:table-cell px-4 py-3 text-xs text-gray-500">
                    Class mean: {report.classMean}% · Position: {report.position} / {report.streamSize}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </GlassCard>

        {/* Comments */}
        <div className="grid sm:grid-cols-2 gap-4">
          <GlassCard className="p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Class Teacher's Comment</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">"{report.classTeacherComment}"</p>
            <p className="mt-3 text-xs font-semibold text-gray-500">— {report.classTeacher}</p>
          </GlassCard>
          <GlassCard className="p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Principal's Comment</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">"{report.principalComment}"</p>
            <p className="mt-3 text-xs font-semibold text-gray-500">— Mr. Albert Njeru, M.Ed., UON</p>
          </GlassCard>
        </div>

        {/* Footer */}
        <GlassCard className="p-4">
          <div className="flex flex-wrap gap-6 text-xs text-gray-500 dark:text-gray-400">
            <span><span className="font-semibold text-gray-700 dark:text-gray-300">Next Term Begins:</span> {report.nextTermBegins}</span>
            <span><span className="font-semibold text-gray-700 dark:text-gray-300">School Phone:</span> 0712-345-678</span>
            <span><span className="font-semibold text-gray-700 dark:text-gray-300">Email:</span> info@alberschool.ke</span>
          </div>
        </GlassCard>

      </div>
    </div>
  )
}
