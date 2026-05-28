import { useState } from 'react'
import { Download, Printer, Award, User, Calendar } from 'lucide-react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Button } from '../../../components/ui/Button'
import { useStudentGradesHistory, useStudentProfile, useStudentAttendance } from '../../../hooks/useStudentData'
import jsPDF from 'jspdf'

const GRADE_BADGE: Record<string, string> = {
  A:'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'B+':'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  B:'bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-300',
  'C+':'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  C:'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  D:'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

const TEACHER_REMARKS: Record<string, string> = {
  'sub-001': 'Good grasp of algebra. Work on geometry for end term.',
  'sub-002': 'Excellent comprehension. Polish written expression.',
  'sub-003': 'Good effort. Improve on insha structure.',
  'sub-004': 'Theory is strong. More focus on practical work.',
  'sub-010': 'Creative projects are impressive. Keep it up.',
  'sub-011': 'Outstanding musical talent.',
  'sub-012': 'Excellent physical fitness. Team player.',
  'sub-013': 'Excellent understanding of moral values.',
}

export function StudentReportCard() {
  const { data: profile }       = useStudentProfile()
  const { data: gradesHistory } = useStudentGradesHistory()
  const { data: attendance }    = useStudentAttendance()

  const [selYear, setSelYear] = useState<string | null>(null)
  const [selTerm, setSelTerm] = useState<string | null>(null)

  const student   = profile?.student
  const classInfo = profile?.classInfo

  const years = gradesHistory ?? []
  const activeYear = years.find(y => y.yearId === selYear) ?? years[0]
  const terms = activeYear?.terms ?? []
  const activeTerm = terms.find(t => t.termId === selTerm) ?? terms.find(t => !t.isCurrent) ?? terms[0]
  const grades = activeTerm?.grades.filter(g => g.total !== null) ?? []
  const avg = grades.length
    ? Math.round(grades.reduce((s, g) => s + (g.total ?? 0), 0) / grades.length)
    : null

  function gradeLabel(score: number) {
    if (score >= 80) return 'A'
    if (score >= 75) return 'B+'
    if (score >= 70) return 'B'
    if (score >= 65) return 'C+'
    if (score >= 60) return 'C'
    return 'D'
  }

  function downloadPDF() {
    if (!student || !grades.length) return
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const W = 210

    // --- Header ---
    doc.setFillColor(21, 128, 61)
    doc.rect(0, 0, W, 38, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.text('ALBER SCHOOL', W / 2, 14, { align: 'center' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text('Excellence Meets Tomorrow', W / 2, 21, { align: 'center' })
    doc.text('Kutus Town, Kirinyaga County · +254 712 345 678 · info@alberschool.ke', W / 2, 27, { align: 'center' })
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text('STUDENT PROGRESS REPORT', W / 2, 34, { align: 'center' })

    // --- Student info box ---
    doc.setTextColor(0, 0, 0)
    doc.setFillColor(248, 250, 252)
    doc.rect(10, 42, W - 20, 26, 'F')
    doc.setDrawColor(220, 220, 220)
    doc.rect(10, 42, W - 20, 26, 'S')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    const studentName = `${student.firstName} ${student.lastName}`
    doc.text('Student Name:', 14, 50)
    doc.setFont('helvetica', 'normal')
    doc.text(studentName, 45, 50)
    doc.setFont('helvetica', 'bold')
    doc.text('Admission No:', 14, 57)
    doc.setFont('helvetica', 'normal')
    doc.text(student.admNo, 45, 57)
    doc.setFont('helvetica', 'bold')
    doc.text('Class:', 14, 64)
    doc.setFont('helvetica', 'normal')
    doc.text(classInfo ? `${classInfo.grade} ${classInfo.stream}` : '—', 45, 64)

    doc.setFont('helvetica', 'bold')
    doc.text('Term:', 120, 50)
    doc.setFont('helvetica', 'normal')
    doc.text(activeTerm?.termLabel ?? '—', 135, 50)
    doc.setFont('helvetica', 'bold')
    doc.text('Year:', 120, 57)
    doc.setFont('helvetica', 'normal')
    doc.text(activeYear?.yearLabel ?? '—', 135, 57)
    doc.setFont('helvetica', 'bold')
    doc.text('Date Issued:', 120, 64)
    doc.setFont('helvetica', 'normal')
    doc.text(new Date().toLocaleDateString('en-KE', { day:'2-digit', month:'short', year:'numeric' }), 145, 64)

    // --- Table header ---
    let y = 76
    doc.setFillColor(21, 128, 61)
    doc.rect(10, y, W - 20, 7, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.text('SUBJECT', 13, y + 5)
    doc.text('CAT 1', 75, y + 5)
    doc.text('CAT 2', 92, y + 5)
    doc.text('END TERM', 109, y + 5)
    doc.text('TOTAL', 133, y + 5)
    doc.text('GRD', 150, y + 5)
    doc.text("TEACHER'S REMARKS", 160, y + 5)

    // --- Rows ---
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')
    y += 9
    grades.forEach((g, i) => {
      if (i % 2 === 0) {
        doc.setFillColor(248, 250, 252)
        doc.rect(10, y - 4.5, W - 20, 7, 'F')
      }
      doc.setFontSize(8)
      doc.text(g.subjectName ?? '', 13, y)
      doc.text(g.cat1 !== null ? String(g.cat1) : '—', 75, y)
      doc.text(g.cat2 !== null ? String(g.cat2) : '—', 92, y)
      doc.text(g.endterm !== null ? String(g.endterm) : '—', 109, y)
      doc.setFont('helvetica', 'bold')
      doc.text(g.total !== null ? `${g.total}%` : '—', 133, y)
      doc.text(g.grade || '—', 150, y)
      doc.setFont('helvetica', 'normal')
      const remark = (TEACHER_REMARKS as any)[grades[i] && Object.keys(TEACHER_REMARKS)[i] ? Object.keys(TEACHER_REMARKS)[i] : ''] ?? 'Good performance. Keep working hard.'
      doc.setFontSize(7)
      doc.text(remark.slice(0, 42), 160, y)
      doc.setFontSize(8)
      y += 7.5
    })

    // --- Average row ---
    doc.setFillColor(209, 250, 229)
    doc.rect(10, y, W - 20, 7, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.text('TERM MEAN SCORE', 13, y + 5)
    doc.text(avg !== null ? `${avg}%` : '—', 133, y + 5)
    doc.text(avg !== null ? gradeLabel(avg) : '—', 150, y + 5)

    // --- Attendance ---
    y += 14
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text('ATTENDANCE SUMMARY', 13, y)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    y += 6
    doc.setFillColor(248, 250, 252)
    doc.rect(10, y - 4, W - 20, 8, 'F')
    if (attendance) {
      doc.text(`Days Present: ${attendance.present}   Absent: ${attendance.absent}   Late: ${attendance.late}   Total School Days: ${attendance.total}   Attendance Rate: ${attendance.percent}%`, 13, y)
    } else {
      doc.text('Attendance data not available for this term.', 13, y)
    }

    // --- Class Teacher Comment ---
    y += 14
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text('CLASS TEACHER\'S COMMENT', 13, y)
    y += 6
    doc.setFillColor(248, 250, 252)
    doc.rect(10, y - 4, W - 20, 12, 'F')
    doc.setDrawColor(220, 220, 220)
    doc.rect(10, y - 4, W - 20, 12, 'S')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    const comment = avg && avg >= 80
      ? 'Outstanding performance. Keep up the excellent work and continue striving for excellence.'
      : avg && avg >= 70
      ? 'Very good performance this term. Continue working hard and you will reach even greater heights.'
      : 'Good effort this term. I encourage you to be more consistent and seek help where needed.'
    doc.text(comment, 13, y + 2)
    doc.setFont('helvetica', 'bold')
    doc.text('Class Teacher: Ms. Lucy Akinyi', 13, y + 8)

    // --- Principal ---
    y += 18
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text('PRINCIPAL\'S REMARK', 13, y)
    y += 6
    doc.setFillColor(248, 250, 252)
    doc.rect(10, y - 4, W - 20, 14, 'F')
    doc.setDrawColor(220, 220, 220)
    doc.rect(10, y - 4, W - 20, 14, 'S')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.text('We are proud of your progress this term. Continue to be disciplined and focused. We look forward to seeing you excel in the coming term.', 13, y + 2, { maxWidth: W - 26 })
    doc.setFont('helvetica', 'bold')
    doc.text('Principal: Dr. Wanjiku Mwangi', 13, y + 10)

    // --- Signature lines ---
    y += 22
    const sigY = y + 8
    doc.setDrawColor(0, 0, 0)
    doc.setLineWidth(0.3)
    doc.line(13, sigY, 65, sigY)
    doc.line(80, sigY, 132, sigY)
    doc.line(147, sigY, 199, sigY)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text('Class Teacher Signature', 13, sigY + 4)
    doc.text('Principal Signature', 80, sigY + 4)
    doc.text('Parent/Guardian Signature', 147, sigY + 4)

    // --- Footer ---
    doc.setTextColor(180, 180, 180)
    doc.setFontSize(7)
    doc.text('Generated by Alber School Management System · Confidential — For Authorised Recipients Only', W / 2, 289, { align: 'center' })

    doc.save(`${studentName} - ${activeTerm?.termLabel ?? 'Report'} ${activeYear?.yearLabel ?? ''}.pdf`)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Progress Report Card</h1>
          <p className="text-sm text-gray-400 mt-0.5">Select a completed term to view and download</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => window.print()} variant="outline" className="gap-1.5 text-sm">
            <Printer className="h-4 w-4" /> Print
          </Button>
          <Button onClick={downloadPDF} disabled={!grades.length}
            className="gap-1.5 text-sm bg-green-700 hover:bg-green-800 text-white">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
        </div>
      </div>

      {/* Selectors */}
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-2">
          {years.map(y => (
            <button key={y.yearId} onClick={() => { setSelYear(y.yearId); setSelTerm(null) }}
              className={`rounded-xl px-3 py-1.5 text-sm font-medium transition ${activeYear?.yearId === y.yearId ? 'bg-green-700 text-white' : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              {y.yearLabel}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {terms.map(t => (
            <button key={t.termId} onClick={() => setSelTerm(t.termId)}
              className={`rounded-xl px-3 py-1.5 text-sm font-medium transition ${activeTerm?.termId === t.termId ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              {t.termLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Report card preview */}
      <GlassCard className="overflow-hidden print:shadow-none">
        {/* School header */}
        <div className="bg-gradient-to-r from-green-700 to-emerald-600 text-white px-8 py-6 text-center">
          <h2 className="text-2xl font-extrabold tracking-wide">ALBER SCHOOL</h2>
          <p className="text-green-200 text-sm mt-0.5">Excellence Meets Tomorrow</p>
          <p className="text-green-200 text-xs mt-0.5">Kutus Town, Kirinyaga County · +254 712 345 678</p>
          <div className="mt-3 inline-block rounded-xl bg-white/20 px-6 py-1.5">
            <p className="text-sm font-semibold">STUDENT PROGRESS REPORT</p>
            <p className="text-xs text-green-200">{activeTerm?.termLabel} · {activeYear?.yearLabel}</p>
          </div>
        </div>

        {/* Student info */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 px-8 py-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
          {[
            { icon: <User className="h-4 w-4" />, label: 'Student', value: student ? `${student.firstName} ${student.lastName}` : '—' },
            { icon: <Award className="h-4 w-4" />, label: 'Admission No', value: student?.admNo ?? '—' },
            { icon: <Calendar className="h-4 w-4" />, label: 'Class', value: classInfo ? `${classInfo.grade} ${classInfo.stream}` : '—' },
          ].map(f => (
            <div key={f.label} className="flex items-start gap-2">
              <span className="mt-0.5 text-green-600 dark:text-green-400">{f.icon}</span>
              <div>
                <p className="text-xs text-gray-400">{f.label}</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{f.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Grades table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-green-700 text-white">
                {['Subject','CAT 1','CAT 2','End Term','Total','Grade',"Teacher's Remark"].map(h => (
                  <th key={h} className={`py-3 px-4 text-xs font-semibold uppercase tracking-wide ${h==='Subject'||h==="Teacher's Remark"?'text-left':'text-center'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grades.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-gray-400">
                  {activeTerm?.isCurrent ? 'Term is ongoing — select a completed term to view the full report' : 'No grade data available for this term'}
                </td></tr>
              ) : grades.map((g, i) => (
                <tr key={g.subjectName} className={`border-b border-gray-50 dark:border-gray-800/50 ${i%2===1?'bg-gray-50/50 dark:bg-gray-800/20':''}`}>
                  <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200">{g.subjectName}</td>
                  <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">{g.cat1 ?? '—'}</td>
                  <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">{g.cat2 ?? '—'}</td>
                  <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">{g.endterm ?? '—'}</td>
                  <td className="px-4 py-3 text-center font-bold text-gray-900 dark:text-white">{g.total !== null ? `${g.total}%` : '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${GRADE_BADGE[g.grade]??'bg-gray-100 text-gray-600'}`}>{g.grade || '—'}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                    {(TEACHER_REMARKS as any)[Object.keys(TEACHER_REMARKS)[i] ?? ''] ?? 'Good performance. Keep it up.'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {avg !== null && (
          <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-green-900/20 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide">Term Mean Score</span>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-extrabold text-green-700 dark:text-green-400">{avg}%</span>
              <span className={`px-3 py-1 rounded-xl text-sm font-bold ${GRADE_BADGE[gradeLabel(avg)]??''}`}>{gradeLabel(avg)}</span>
            </div>
          </div>
        )}

        {/* Attendance */}
        {attendance && (
          <div className="px-8 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Attendance Summary</p>
            <div className="flex flex-wrap gap-4 text-sm">
              {[
                { label:'Present', value: attendance.present, color:'text-green-700 dark:text-green-400' },
                { label:'Absent',  value: attendance.absent,  color:'text-red-500' },
                { label:'Late',    value: attendance.late,    color:'text-amber-600 dark:text-amber-400' },
                { label:'Excused', value: attendance.excused, color:'text-blue-600 dark:text-blue-400' },
                { label:'Rate',    value: `${attendance.percent}%`, color:'text-gray-900 dark:text-white' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <span className="text-gray-400 text-xs">{s.label}:</span>
                  <span className={`font-bold ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Signatures */}
        <div className="grid grid-cols-3 gap-8 px-8 py-6 border-t border-gray-200 dark:border-gray-700">
          {['Class Teacher','Principal','Parent/Guardian'].map(label => (
            <div key={label} className="text-center">
              <div className="border-b border-gray-400 dark:border-gray-600 mb-2 pb-6" />
              <p className="text-xs text-gray-400">{label} Signature</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
