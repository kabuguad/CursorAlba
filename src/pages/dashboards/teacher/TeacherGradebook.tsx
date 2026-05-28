import { useState, useEffect } from 'react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Button } from '../../../components/ui/Button'
import { useToast } from '../../../contexts/ToastContext'
import { Save, Lock, CheckCircle2, RefreshCw } from 'lucide-react'
import { useTeacherProfile, useTeacherClasses, useClassStudents, useClassGrades, useSaveGrades } from '../../../hooks/useTeacherData'
import { getDB } from '../../../services/db'

const SUBJECTS_FOR_TEACHER = ['sub-005','sub-006','sub-007']

export function TeacherGradebook() {
  const { showToast } = useToast()
  const { data: staff }                 = useTeacherProfile()
  const { data: classes }               = useTeacherClasses(staff?.id)
  const [selectedClass, setSelectedClass] = useState<string | null>(null)

  const classId = selectedClass ?? classes?.[0]?.id
  const { data: students }    = useClassStudents(classId)
  const { data: savedGrades } = useClassGrades(classId)
  const saveGrades             = useSaveGrades()

  const db = getDB()
  const subjects = db.subjects.filter(s => SUBJECTS_FOR_TEACHER.includes(s.id))

  type GradeEntry = { cat1: string; cat2: string; endterm: string }
  const [entries, setEntries] = useState<Record<string, Record<string, GradeEntry>>>({})
  const [locked, setLocked]  = useState(false)
  const [saved, setSaved]    = useState(false)

  useEffect(() => {
    if (!students || !savedGrades) return
    const init: Record<string, Record<string, GradeEntry>> = {}
    students.forEach(s => {
      init[s.id] = {}
      subjects.forEach(sub => {
        const existing = savedGrades.find(g => g.studentId === s.id && g.subjectId === sub.id)
        init[s.id][sub.id] = {
          cat1:    existing?.cat1    !== null && existing?.cat1    !== undefined ? String(existing.cat1)    : '',
          cat2:    existing?.cat2    !== null && existing?.cat2    !== undefined ? String(existing.cat2)    : '',
          endterm: existing?.endterm !== null && existing?.endterm !== undefined ? String(existing.endterm) : '',
        }
      })
    })
    setEntries(init)
    setLocked(savedGrades.some(g => g.isLocked))
    setSaved(false)
  }, [students, savedGrades, classId])

  function setEntry(studentId: string, subjectId: string, field: keyof GradeEntry, value: string) {
    if (locked) return
    const num = value === '' ? '' : String(Math.min(100, Math.max(0, Number(value))))
    setEntries(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], [subjectId]: { ...prev[studentId]?.[subjectId], [field]: num } },
    }))
    setSaved(false)
  }

  function computeTotal(e: GradeEntry): number | null {
    const c1 = e.cat1 !== '' ? Number(e.cat1) : null
    const c2 = e.cat2 !== '' ? Number(e.cat2) : null
    const et = e.endterm !== '' ? Number(e.endterm) : null
    if (c1 === null || c2 === null || et === null) return null
    return Math.round(c1 * 0.2 + c2 * 0.2 + et * 0.6)
  }

  function gradeLabel(t: number | null) {
    if (t === null) return '—'
    if (t >= 80) return 'A'
    if (t >= 75) return 'B+'
    if (t >= 70) return 'B'
    if (t >= 65) return 'C+'
    if (t >= 60) return 'C'
    return 'D'
  }

  async function handleSave() {
    if (!classId || !students || !staff) return
    const currentTermId = db.settings.currentTermId
    const grades = students.flatMap(s =>
      subjects.map(sub => {
        const e = entries[s.id]?.[sub.id]
        if (!e) return null
        const c1 = e.cat1 !== '' ? Number(e.cat1) : null
        const c2 = e.cat2 !== '' ? Number(e.cat2) : null
        const et = e.endterm !== '' ? Number(e.endterm) : null
        const total = computeTotal(e)
        return {
          studentId: s.id, examId: 'exm-001', subjectId: sub.id,
          classId: classId, termId: currentTermId,
          cat1: c1, cat2: c2, endterm: et, total,
          grade: gradeLabel(total), isLocked: false, enteredBy: staff.id,
        }
      }).filter(Boolean)
    ) as any[]

    try {
      await saveGrades.mutateAsync(grades)
      setSaved(true)
      showToast('Grades saved successfully', 'success')
    } catch {
      showToast('Failed to save grades', 'error')
    }
  }

  const selectedCls = (classes ?? []).find(c => c.id === classId)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gradebook</h1>
          <p className="text-sm text-gray-400 mt-0.5">Enter and manage student grades for the current term</p>
        </div>
        <div className="flex gap-2">
          {locked && (
            <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 px-3 py-2 text-xs font-semibold text-amber-700 dark:text-amber-300">
              <Lock className="h-3.5 w-3.5" /> Grades locked
            </div>
          )}
          {saved && (
            <div className="flex items-center gap-1.5 rounded-xl bg-green-50 dark:bg-green-900/20 px-3 py-2 text-xs font-semibold text-green-700 dark:text-green-300">
              <CheckCircle2 className="h-3.5 w-3.5" /> Saved
            </div>
          )}
          <Button onClick={handleSave} disabled={locked || saveGrades.isPending}
            className="gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-sm">
            {saveGrades.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Grades
          </Button>
        </div>
      </div>

      {/* Class selector */}
      <div className="flex gap-2">
        {(classes ?? []).map(c => (
          <button key={c.id} onClick={() => setSelectedClass(c.id)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${classId === c.id ? 'bg-blue-700 text-white shadow' : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            {c.grade} {c.stream} · {c.studentCount} students
          </button>
        ))}
      </div>

      {/* Grade table */}
      <GlassCard className="overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 dark:text-white">
            {selectedCls ? `${selectedCls.grade} ${selectedCls.stream}` : '—'} — Term 2, 2026
          </h2>
          <p className="text-xs text-gray-400">CAT 1 & CAT 2 (20% each) · End Term (60%)</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left px-4 py-3 font-semibold uppercase tracking-wide text-gray-400">Student</th>
                {subjects.map(sub => (
                  <th key={sub.id} colSpan={4} className="text-center px-2 py-3 font-semibold uppercase tracking-wide text-gray-400 border-l border-gray-100 dark:border-gray-800">
                    {sub.name.split(' ')[0]}
                  </th>
                ))}
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                <th className="px-4 py-2" />
                {subjects.map(sub => (
                  ['CAT1','CAT2','ET','Total'].map(h => (
                    <th key={`${sub.id}-${h}`} className="text-center px-2 py-2 text-xs text-gray-400 border-l border-gray-100 dark:border-gray-800">{h}</th>
                  ))
                ))}
              </tr>
            </thead>
            <tbody>
              {(students ?? []).length === 0 ? (
                <tr><td colSpan={100} className="py-10 text-center text-gray-400">No students in this class</td></tr>
              ) : (students ?? []).map((s, i) => (
                <tr key={s.id} className={`border-b border-gray-50 dark:border-gray-800/50 ${i%2===1?'bg-gray-50/40 dark:bg-gray-800/20':''}`}>
                  <td className="px-4 py-2.5">
                    <p className="font-medium text-gray-800 dark:text-gray-200">{s.fullName}</p>
                    <p className="text-gray-400">{s.admNo}</p>
                  </td>
                  {subjects.map(sub => {
                    const e = entries[s.id]?.[sub.id] ?? { cat1:'', cat2:'', endterm:'' }
                    const total = computeTotal(e)
                    return (
                      <>
                        {(['cat1','cat2','endterm'] as const).map(field => (
                          <td key={`${s.id}-${sub.id}-${field}`} className="px-1 py-2 border-l border-gray-100 dark:border-gray-800">
                            <input
                              type="number" min={0} max={100} disabled={locked}
                              value={e[field]}
                              onChange={ev => setEntry(s.id, sub.id, field, ev.target.value)}
                              className="w-14 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-center text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            />
                          </td>
                        ))}
                        <td key={`${s.id}-${sub.id}-total`} className="px-2 py-2 text-center font-bold border-l border-gray-100 dark:border-gray-800">
                          <span className={total !== null ? (total >= 70 ? 'text-green-700 dark:text-green-400' : total >= 50 ? 'text-amber-600' : 'text-red-500') : 'text-gray-300'}>
                            {total !== null ? total : '—'}
                          </span>
                        </td>
                      </>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
