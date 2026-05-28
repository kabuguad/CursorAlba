import { useState } from 'react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Button } from '../../../components/ui/Button'
import { useToast } from '../../../contexts/ToastContext'
import { CheckCircle2, XCircle, Clock, AlertCircle, ChevronDown, Download } from 'lucide-react'

type Status = 'present' | 'absent' | 'late' | 'excused'

interface Student { id: string; name: string; admNo: string }

const CLASS_OPTIONS = [
  { label: 'Grade 5 Gold — Period 1 (8:00 AM)',   key: 'g5g', students: [
    { id: 'g5g1',  name: 'Kevin Mwangi',     admNo: 'ALB-2020-051' },
    { id: 'g5g2',  name: 'Lillian Weru',      admNo: 'ALB-2020-052' },
    { id: 'g5g3',  name: 'Martin Ngugi',      admNo: 'ALB-2020-053' },
    { id: 'g5g4',  name: 'Nancy Wanjiku',     admNo: 'ALB-2020-054' },
    { id: 'g5g5',  name: 'Oscar Mungai',      admNo: 'ALB-2020-055' },
    { id: 'g5g6',  name: 'Priscilla Njeri',   admNo: 'ALB-2020-056' },
    { id: 'g5g7',  name: 'Quentin Odhiambo', admNo: 'ALB-2020-057' },
    { id: 'g5g8',  name: 'Rose Wathoni',      admNo: 'ALB-2020-058' },
    { id: 'g5g9',  name: 'Samuel Kuria',      admNo: 'ALB-2020-059' },
    { id: 'g5g10', name: 'Tabitha Njagi',     admNo: 'ALB-2020-060' },
  ]},
  { label: 'Grade 6 Silver — Period 2 (8:40 AM)', key: 'g6s', students: [
    { id: 'g6s1', name: 'Amina Said',      admNo: 'ALB-2019-071' },
    { id: 'g6s2', name: 'Bernard Kamau',   admNo: 'ALB-2019-072' },
    { id: 'g6s3', name: 'Clara Muthoni',   admNo: 'ALB-2019-073' },
    { id: 'g6s4', name: "Daniel Ndung'u",  admNo: 'ALB-2019-074' },
    { id: 'g6s5', name: 'Emily Wairimu',   admNo: 'ALB-2019-075' },
    { id: 'g6s6', name: 'Francis Gitau',   admNo: 'ALB-2019-076' },
    { id: 'g6s7', name: 'Gladys Nyambura', admNo: 'ALB-2019-077' },
    { id: 'g6s8', name: 'Hassan Mwangi',   admNo: 'ALB-2019-078' },
  ]},
  { label: 'Grade 5 Blue — Period 3 (9:20 AM)',   key: 'g5b', students: [
    { id: 'g5b1', name: 'Brian Otieno',     admNo: 'ALB-2020-061' },
    { id: 'g5b2', name: 'Carol Wambui',     admNo: 'ALB-2020-062' },
    { id: 'g5b3', name: 'Dennis Kariuki',   admNo: 'ALB-2020-063' },
    { id: 'g5b4', name: 'Elizabeth Ndiiri', admNo: 'ALB-2020-064' },
    { id: 'g5b5', name: 'Felix Muriithi',   admNo: 'ALB-2020-065' },
    { id: 'g5b6', name: 'Grace Nyawira',    admNo: 'ALB-2020-066' },
  ]},
  { label: 'Grade 4 Red — Period 5 (10:20 AM)',   key: 'g4r', students: [
    { id: 'g4r1', name: 'Aisha Kamau',     admNo: 'ALB-2021-041' },
    { id: 'g4r2', name: 'Boniface Njoro',  admNo: 'ALB-2021-042' },
    { id: 'g4r3', name: 'Cynthia Muriuki', admNo: 'ALB-2021-043' },
    { id: 'g4r4', name: 'David Karuri',    admNo: 'ALB-2021-044' },
    { id: 'g4r5', name: 'Esther Wambua',   admNo: 'ALB-2021-045' },
    { id: 'g4r6', name: 'Fatuma Hassan',   admNo: 'ALB-2021-046' },
    { id: 'g4r7', name: 'George Kimani',   admNo: 'ALB-2021-047' },
    { id: 'g4r8', name: 'Hannah Nyambura', admNo: 'ALB-2021-048' },
  ]},
]

const STATUS_CFG: Record<Status, { label: string; icon: React.ElementType; active: string; inactive: string }> = {
  present: { label: 'Present', icon: CheckCircle2, active: 'bg-emerald-500 text-white border-emerald-500',  inactive: 'border-gray-200 dark:border-gray-700 text-gray-400 hover:border-emerald-300 hover:text-emerald-600' },
  absent:  { label: 'Absent',  icon: XCircle,      active: 'bg-red-500 text-white border-red-500',          inactive: 'border-gray-200 dark:border-gray-700 text-gray-400 hover:border-red-300 hover:text-red-600'     },
  late:    { label: 'Late',    icon: Clock,        active: 'bg-amber-500 text-white border-amber-500',      inactive: 'border-gray-200 dark:border-gray-700 text-gray-400 hover:border-amber-300 hover:text-amber-600' },
  excused: { label: 'Excused', icon: AlertCircle,  active: 'bg-blue-500 text-white border-blue-500',        inactive: 'border-gray-200 dark:border-gray-700 text-gray-400 hover:border-blue-300 hover:text-blue-600'   },
}

const ABSENCE_REASONS = ['Sick (with medical note)', 'Sick (no medical note)', 'Family emergency', 'Transport issues', 'Suspension', 'School activity', 'Unknown', 'Other']
const LATE_REASONS    = ['Transport delay', 'Parent drop-off late', 'Unknown', 'Other']

export function TeacherAttendance() {
  const { showToast } = useToast()
  const [classIndex, setClassIndex] = useState(0)
  const [date, setDate]             = useState(new Date().toISOString().split('T')[0])
  const [submitted, setSubmitted]   = useState(false)

  const cls      = CLASS_OPTIONS[classIndex]
  const students: Student[] = cls.students

  const [statusMap, setStatusMap] = useState<Record<string, Status>>(() =>
    Object.fromEntries(students.map(s => [s.id, 'present' as Status]))
  )
  const [reasonMap, setReasonMap] = useState<Record<string, string>>({})
  const [noteMap,   setNoteMap]   = useState<Record<string, string>>({})

  function handleClassChange(idx: number) {
    setClassIndex(idx)
    const ns = CLASS_OPTIONS[idx].students
    setStatusMap(Object.fromEntries(ns.map(s => [s.id, 'present' as Status])))
    setReasonMap({})
    setNoteMap({})
    setSubmitted(false)
  }

  function setStatus(id: string, st: Status) {
    setStatusMap(prev => ({ ...prev, [id]: st }))
    if (st === 'present') setReasonMap(prev => { const n = { ...prev }; delete n[id]; return n })
  }

  function markAll(st: Status) {
    setStatusMap(Object.fromEntries(students.map(s => [s.id, st])))
  }

  function handleSubmit() {
    const missing = students.filter(s => {
      const st = statusMap[s.id]
      return (st === 'absent' || st === 'late') && !reasonMap[s.id]
    })
    if (missing.length) { showToast(`Please select a reason for ${missing.length} student${missing.length > 1 ? 's' : ''}`, 'error'); return }
    setSubmitted(true)
    showToast('Attendance submitted successfully', 'success')
  }

  const counts = { present: 0, absent: 0, late: 0, excused: 0 } as Record<Status, number>
  students.forEach(s => counts[statusMap[s.id] ?? 'present']++)
  const pct = students.length ? Math.round((counts.present / students.length) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Register</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Mathematics · mark all your classes for today</p>
        </div>
        <button className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700 px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
          <Download className="w-4 h-4" /> Export Register
        </button>
      </div>

      <GlassCard className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[220px]">
            <label className="label">Class / Period</label>
            <div className="relative">
              <select className="field pr-8 appearance-none" value={classIndex} onChange={e => handleClassChange(+e.target.value)}>
                {CLASS_OPTIONS.map((c, i) => <option key={c.key} value={i}>{c.label}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="label">Date</label>
            <input type="date" className="field" value={date} onChange={e => { setDate(e.target.value); setSubmitted(false) }} />
          </div>
        </div>
      </GlassCard>

      {submitted && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl text-sm text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Attendance submitted for <strong>{cls.label.split('—')[0].trim()}</strong> on <strong>{date}</strong>.</span>
          <button onClick={() => setSubmitted(false)} className="ml-auto text-xs underline">Edit</button>
        </div>
      )}

      <div className="grid grid-cols-4 gap-3">
        {(Object.entries(counts) as [Status, number][]).map(([st, count]) => (
          <GlassCard key={st} className="p-3 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
            <p className="text-xs text-gray-500 mt-0.5">{STATUS_CFG[st].label}</p>
          </GlassCard>
        ))}
      </div>

      {!submitted && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">Mark all:</span>
          {(Object.keys(STATUS_CFG) as Status[]).map(st => (
            <button key={st} onClick={() => markAll(st)}
              className="text-xs px-3 py-1.5 rounded-full border font-medium border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              All {STATUS_CFG[st].label}
            </button>
          ))}
          <span className="ml-auto text-sm font-medium text-emerald-600 dark:text-emerald-400">{pct}% present</span>
        </div>
      )}

      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{cls.label.split('—')[0].trim()} — {students.length} students</p>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {students.map((s, i) => {
            const st = statusMap[s.id] ?? 'present'
            const needsReason = st === 'absent' || st === 'late'
            return (
              <div key={s.id} className={`p-4 ${submitted ? 'opacity-75' : ''}`}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="w-6 text-xs text-gray-400 text-right shrink-0">{i + 1}</span>
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-xs font-bold text-emerald-700 dark:text-emerald-300 shrink-0">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white text-sm">{s.name}</p>
                      <p className="text-xs text-gray-400 font-mono">{s.admNo}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 sm:gap-2 ml-9 sm:ml-0">
                    {(Object.keys(STATUS_CFG) as Status[]).map(status => {
                      const cfg = STATUS_CFG[status]
                      return (
                        <button key={status} disabled={submitted} onClick={() => setStatus(s.id, status)}
                          className={`flex items-center gap-1 text-xs px-2 sm:px-3 py-1.5 rounded-full border font-medium transition-all disabled:cursor-default ${st === status ? cfg.active : cfg.inactive}`}>
                          <cfg.icon className="w-3 h-3" />
                          <span className="hidden sm:inline">{cfg.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
                {needsReason && !submitted && (
                  <div className="mt-3 ml-9 sm:ml-16 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Reason *</label>
                      <div className="relative">
                        <select className="field text-xs pr-8 appearance-none py-1.5"
                          value={reasonMap[s.id] ?? ''} onChange={e => setReasonMap(prev => ({ ...prev, [s.id]: e.target.value }))}>
                          <option value="">Select reason…</option>
                          {(st === 'absent' ? ABSENCE_REASONS : LATE_REASONS).map(r => <option key={r}>{r}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Additional note (optional)</label>
                      <input type="text" className="field text-xs py-1.5" placeholder="e.g. parent called to notify"
                        value={noteMap[s.id] ?? ''} onChange={e => setNoteMap(prev => ({ ...prev, [s.id]: e.target.value }))} />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        {!submitted && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex gap-3">
            <Button onClick={handleSubmit}>Submit Attendance</Button>
            <Button variant="outline" onClick={() => markAll('present')}>Reset All</Button>
          </div>
        )}
      </GlassCard>
    </div>
  )
}
