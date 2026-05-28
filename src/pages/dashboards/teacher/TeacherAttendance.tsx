import { useState, useEffect } from 'react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Button } from '../../../components/ui/Button'
import { useToast } from '../../../contexts/ToastContext'
import { CheckCircle2, XCircle, Clock, FileCheck, Save, RefreshCw, Download } from 'lucide-react'
import { useTeacherProfile, useTeacherClasses, useClassStudents, useClassAttendance, useSaveAttendance } from '../../../hooks/useTeacherData'
import { getDB } from '../../../services/db'

type Status = 'present' | 'absent' | 'late' | 'excused'

const STATUS_OPTS: { val: Status; label: string; icon: any; color: string; active: string }[] = [
  { val:'present', label:'P', icon:CheckCircle2, color:'text-gray-500', active:'bg-green-600 text-white' },
  { val:'absent',  label:'A', icon:XCircle,      color:'text-gray-500', active:'bg-red-600 text-white'   },
  { val:'late',    label:'L', icon:Clock,         color:'text-gray-500', active:'bg-amber-500 text-white' },
  { val:'excused', label:'E', icon:FileCheck,     color:'text-gray-500', active:'bg-blue-600 text-white'  },
]

export function TeacherAttendance() {
  const { showToast }         = useToast()
  const { data: staff }       = useTeacherProfile()
  const { data: classes }     = useTeacherClasses(staff?.id)
  const [classId, setClassId] = useState<string | null>(null)
  const [date, setDate]       = useState(new Date().toISOString().split('T')[0])

  const activeClassId         = classId ?? classes?.[0]?.id
  const { data: students }    = useClassStudents(activeClassId)
  const { data: attSummary }  = useClassAttendance(activeClassId)
  const saveAtt               = useSaveAttendance()

  const [marks, setMarks] = useState<Record<string, Status>>({})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!attSummary) return
    const init: Record<string, Status> = {}
    attSummary.forEach(s => { if (s.todayStatus) init[s.studentId] = s.todayStatus })
    setMarks(init)
    setSaved(false)
  }, [attSummary])

  function mark(studentId: string, status: Status) {
    setMarks(prev => ({ ...prev, [studentId]: status }))
    setSaved(false)
  }

  async function handleSave() {
    if (!activeClassId || !students || !staff) return
    const db = getDB()
    const records = students.map(s => ({
      studentId:  s.id,
      classId:    activeClassId,
      termId:     db.settings.currentTermId,
      date,
      status:     marks[s.id] ?? 'present',
      notes:      '',
      recordedBy: staff.id,
    }))
    try {
      await saveAtt.mutateAsync(records)
      setSaved(true)
      showToast('Attendance saved', 'success')
    } catch {
      showToast('Failed to save attendance', 'error')
    }
  }

  const selectedCls = (classes ?? []).find(c => c.id === activeClassId)
  const marked = Object.keys(marks).length
  const total  = (students ?? []).length
  const counts = { present:0, absent:0, late:0, excused:0 }
  Object.values(marks).forEach(s => { counts[s]++ })

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Register</h1>
          <p className="text-sm text-gray-400 mt-0.5">Mark daily attendance for your class</p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="flex items-center gap-1.5 rounded-xl bg-green-50 dark:bg-green-900/20 px-3 py-2 text-xs font-semibold text-green-700 dark:text-green-300">
              <CheckCircle2 className="h-3.5 w-3.5" /> Saved
            </span>
          )}
          <Button onClick={handleSave} disabled={saveAtt.isPending}
            className="gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-sm">
            {saveAtt.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          {(classes ?? []).map(c => (
            <button key={c.id} onClick={() => setClassId(c.id)}
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${activeClassId === c.id ? 'bg-blue-700 text-white' : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              {c.grade} {c.stream}
            </button>
          ))}
        </div>
        <input type="date" value={date} onChange={e => setDate(e.target.value)}
          className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label:'Total',   value:total,           color:'text-gray-800 dark:text-white'              },
          { label:'Present', value:counts.present,  color:'text-green-700 dark:text-green-400'          },
          { label:'Absent',  value:counts.absent,   color:'text-red-500'                                },
          { label:'Late',    value:counts.late,     color:'text-amber-600 dark:text-amber-400'           },
          { label:'Excused', value:counts.excused,  color:'text-blue-600 dark:text-blue-400'             },
        ].map(s => (
          <GlassCard key={s.label} className="p-3 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-700">
          <div className="h-2 rounded-full bg-blue-600 transition-all" style={{ width: total > 0 ? `${(marked/total)*100}%` : '0%' }} />
        </div>
        <span className="text-xs text-gray-400">{marked}/{total} marked</span>
      </div>

      {/* Register */}
      <GlassCard className="overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 dark:text-white">
            {selectedCls ? `${selectedCls.grade} ${selectedCls.stream}` : '—'} · {new Date(date).toLocaleDateString('en-KE', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
          </h2>
          <div className="flex gap-2">
            <button onClick={() => { const s: Record<string,Status> = {}; (students??[]).forEach(st => s[st.id]='present'); setMarks(s) }}
              className="text-xs text-green-600 hover:underline">Mark all present</button>
          </div>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
          {(students ?? []).length === 0 ? (
            <p className="py-10 text-center text-gray-400 text-sm">No students in this class</p>
          ) : (students ?? []).map((s, i) => {
            const status = marks[s.id]
            const summaryRow = attSummary?.find(r => r.studentId === s.id)
            return (
              <div key={s.id} className={`flex items-center gap-4 px-5 py-3 ${i%2===1?'bg-gray-50/40 dark:bg-gray-800/20':''}`}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold">
                  {s.fullName.split(' ').map((n: string) => n[0]).slice(0,2).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{s.fullName}</p>
                  <p className="text-xs text-gray-400">{s.admNo}
                    {summaryRow && summaryRow.totalDays > 0 &&
                      ` · ${summaryRow.totalPresent}/${summaryRow.totalDays} days this term`
                    }
                  </p>
                </div>
                <div className="flex gap-1">
                  {STATUS_OPTS.map(opt => (
                    <button key={opt.val} onClick={() => mark(s.id, opt.val)}
                      title={opt.val.charAt(0).toUpperCase() + opt.val.slice(1)}
                      className={`rounded-lg w-9 h-9 flex items-center justify-center text-xs font-bold transition border
                        ${status === opt.val ? opt.active + ' border-transparent shadow' : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </GlassCard>
    </div>
  )
}
