import { useState } from 'react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Button } from '../../../components/ui/Button'
import { useToast } from '../../../contexts/ToastContext'
import {
  Plus, ChevronDown, CheckCircle2, Clock, AlertCircle,
  ChevronRight, Users, Award, FileText, X,
} from 'lucide-react'

type AssignmentType = 'homework' | 'cat' | 'project' | 'reading' | 'practical'
type GradeView = { studentId: string; name: string; submitted: boolean; late: boolean; score: string; feedback: string }

const CLASSES    = ['Grade 4 Red', 'Grade 5 Gold', 'Grade 5 Blue', 'Grade 6 Silver', 'Grade 7 Green']
const TYPE_OPTS: { value: AssignmentType; label: string }[] = [
  { value: 'homework',  label: 'Homework'         },
  { value: 'cat',       label: 'CAT / Test'        },
  { value: 'project',   label: 'Project'           },
  { value: 'reading',   label: 'Reading Task'      },
  { value: 'practical', label: 'Practical Work'    },
]

const TYPE_COLORS: Record<AssignmentType, string> = {
  homework:  'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  cat:       'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  project:   'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  reading:   'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  practical: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
}

const STUDENT_POOLS: Record<string, { id: string; name: string }[]> = {
  'Grade 5 Gold': [
    { id: 'g5g1', name: 'Kevin Mwangi'     }, { id: 'g5g2', name: 'Lillian Weru'     },
    { id: 'g5g3', name: 'Martin Ngugi'     }, { id: 'g5g4', name: 'Nancy Wanjiku'    },
    { id: 'g5g5', name: 'Oscar Mungai'     }, { id: 'g5g6', name: 'Priscilla Njeri'  },
    { id: 'g5g7', name: 'Quentin Odhiambo' }, { id: 'g5g8', name: 'Rose Wathoni'    },
    { id: 'g5g9', name: 'Samuel Kuria'     }, { id: 'g5g10', name: 'Tabitha Njagi'   },
  ],
  'Grade 6 Silver': [
    { id: 'g6s1', name: 'Amina Said'       }, { id: 'g6s2', name: 'Bernard Kamau'    },
    { id: 'g6s3', name: 'Clara Muthoni'    }, { id: 'g6s4', name: "Daniel Ndung'u"   },
    { id: 'g6s5', name: 'Emily Wairimu'    }, { id: 'g6s6', name: 'Francis Gitau'    },
    { id: 'g6s7', name: 'Gladys Nyambura'  }, { id: 'g6s8', name: 'Hassan Mwangi'    },
  ],
}

interface Assignment {
  id: string
  title: string
  description: string
  class_: string
  type: AssignmentType
  due: string
  maxMarks: number
  grading: GradeView[]
  postedOn: string
}

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'a1', title: 'Fractions Worksheet', description: 'Complete exercises 1–20 on equivalent fractions and simplification. Show all working.',
    class_: 'Grade 5 Gold', type: 'homework', due: '2025-05-28', maxMarks: 20, postedOn: '2025-05-26',
    grading: [
      { studentId: 'g5g1', name: 'Kevin Mwangi',     submitted: true,  late: false, score: '14', feedback: 'Good effort. Work on simplification.' },
      { studentId: 'g5g2', name: 'Lillian Weru',      submitted: true,  late: false, score: '19', feedback: 'Excellent work!'                      },
      { studentId: 'g5g3', name: 'Martin Ngugi',      submitted: true,  late: true,  score: '12', feedback: 'Submitted late. Review equivalent fractions.' },
      { studentId: 'g5g4', name: 'Nancy Wanjiku',     submitted: true,  late: false, score: '20', feedback: 'Perfect score! Outstanding.'            },
      { studentId: 'g5g5', name: 'Oscar Mungai',      submitted: true,  late: false, score: '15', feedback: ''                                       },
      { studentId: 'g5g6', name: 'Priscilla Njeri',   submitted: false, late: false, score: '',   feedback: ''                                       },
      { studentId: 'g5g7', name: 'Quentin Odhiambo',  submitted: true,  late: false, score: '17', feedback: 'Well done.'                             },
      { studentId: 'g5g8', name: 'Rose Wathoni',      submitted: true,  late: false, score: '18', feedback: 'Very good!'                             },
      { studentId: 'g5g9', name: 'Samuel Kuria',      submitted: false, late: false, score: '',   feedback: ''                                       },
      { studentId: 'g5g10', name: 'Tabitha Njagi',    submitted: true,  late: true,  score: '11', feedback: 'Submitted late.'                        },
    ],
  },
  {
    id: 'a2', title: 'CAT 2 — Algebra Equations', description: 'Written test covering one-step and two-step linear equations. 40 minutes.',
    class_: 'Grade 6 Silver', type: 'cat', due: '2025-05-30', maxMarks: 40, postedOn: '2025-05-20',
    grading: [
      { studentId: 'g6s1', name: 'Amina Said',      submitted: false, late: false, score: '', feedback: '' },
      { studentId: 'g6s2', name: 'Bernard Kamau',   submitted: false, late: false, score: '', feedback: '' },
      { studentId: 'g6s3', name: 'Clara Muthoni',   submitted: false, late: false, score: '', feedback: '' },
      { studentId: 'g6s4', name: "Daniel Ndung'u",  submitted: false, late: false, score: '', feedback: '' },
      { studentId: 'g6s5', name: 'Emily Wairimu',   submitted: false, late: false, score: '', feedback: '' },
      { studentId: 'g6s6', name: 'Francis Gitau',   submitted: false, late: false, score: '', feedback: '' },
      { studentId: 'g6s7', name: 'Gladys Nyambura', submitted: false, late: false, score: '', feedback: '' },
      { studentId: 'g6s8', name: 'Hassan Mwangi',   submitted: false, late: false, score: '', feedback: '' },
    ],
  },
  {
    id: 'a3', title: 'Times Tables Drill', description: 'Memorise multiplication tables 1–12. Assessment via oral drill next Tuesday.',
    class_: 'Grade 4 Red', type: 'reading', due: '2025-06-03', maxMarks: 10, postedOn: '2025-05-27',
    grading: [
      { studentId: 'g4r1', name: 'Aisha Kamau',     submitted: false, late: false, score: '', feedback: '' },
      { studentId: 'g4r2', name: 'Boniface Njoro',  submitted: false, late: false, score: '', feedback: '' },
      { studentId: 'g4r3', name: 'Cynthia Muriuki', submitted: false, late: false, score: '', feedback: '' },
      { studentId: 'g4r4', name: 'David Karuri',    submitted: false, late: false, score: '', feedback: '' },
      { studentId: 'g4r5', name: 'Esther Wambua',   submitted: false, late: false, score: '', feedback: '' },
      { studentId: 'g4r6', name: 'Fatuma Hassan',   submitted: false, late: false, score: '', feedback: '' },
      { studentId: 'g4r7', name: 'George Kimani',   submitted: false, late: false, score: '', feedback: '' },
      { studentId: 'g4r8', name: 'Hannah Nyambura', submitted: false, late: false, score: '', feedback: '' },
    ],
  },
]

const BLANK_FORM = { title: '', description: '', class_: 'Grade 5 Gold', type: 'homework' as AssignmentType, due: '', maxMarks: 20 }

export function TeacherAssignments() {
  const { showToast } = useToast()
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS)
  const [showForm, setShowForm]       = useState(false)
  const [gradingId, setGradingId]     = useState<string | null>(null)
  const [form, setForm]               = useState(BLANK_FORM)
  const [localGrades, setLocalGrades] = useState<Record<string, { score: string; feedback: string }>>({})

  function handlePost() {
    if (!form.title.trim() || !form.due) { showToast('Please fill in all required fields', 'error'); return }
    const pool = STUDENT_POOLS[form.class_] ?? []
    const newA: Assignment = {
      id: `a${Date.now()}`,
      ...form,
      postedOn: new Date().toISOString().split('T')[0],
      grading: pool.map(s => ({ studentId: s.id, name: s.name, submitted: false, late: false, score: '', feedback: '' })),
    }
    setAssignments(prev => [newA, ...prev])
    setForm(BLANK_FORM)
    setShowForm(false)
    showToast('Assignment posted successfully', 'success')
  }

  function openGrading(id: string) {
    const a = assignments.find(x => x.id === id)!
    const init: Record<string, { score: string; feedback: string }> = {}
    a.grading.forEach(g => { init[g.studentId] = { score: g.score, feedback: g.feedback } })
    setLocalGrades(init)
    setGradingId(id)
  }

  function saveGrades(id: string) {
    setAssignments(prev => prev.map(a => {
      if (a.id !== id) return a
      return {
        ...a,
        grading: a.grading.map(g => ({
          ...g,
          score: localGrades[g.studentId]?.score ?? g.score,
          feedback: localGrades[g.studentId]?.feedback ?? g.feedback,
          submitted: (localGrades[g.studentId]?.score ?? g.score) !== '',
        })),
      }
    }))
    setGradingId(null)
    showToast('Grades saved successfully', 'success')
  }

  const gradingAssignment = assignments.find(a => a.id === gradingId)

  const isPastDue = (due: string) => new Date(due) < new Date()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assignments</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Post homework, CATs and projects — then grade submissions</p>
        </div>
        <Button onClick={() => setShowForm(s => !s)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Post Assignment
        </Button>
      </div>

      {/* Post Form */}
      {showForm && (
        <GlassCard className="p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" /> New Assignment
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="label">Title *</label>
              <input className="field" placeholder="e.g. Fractions Worksheet — Exercise 3" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="label">Description / Instructions</label>
              <textarea rows={2} className="field resize-none" placeholder="Detailed instructions for students…" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <label className="label">Class</label>
              <div className="relative">
                <select className="field pr-8 appearance-none" value={form.class_} onChange={e => setForm(f => ({ ...f, class_: e.target.value }))}>
                  {CLASSES.map(c => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="label">Type</label>
              <div className="relative">
                <select className="field pr-8 appearance-none" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as AssignmentType }))}>
                  {TYPE_OPTS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="label">Due Date *</label>
              <input type="date" className="field" value={form.due} onChange={e => setForm(f => ({ ...f, due: e.target.value }))} />
            </div>
            <div>
              <label className="label">Max Marks</label>
              <input type="number" min={1} max={100} className="field" value={form.maxMarks} onChange={e => setForm(f => ({ ...f, maxMarks: +e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={handlePost}>Post Assignment</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </GlassCard>
      )}

      {/* Grading Panel */}
      {gradingAssignment && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Grading: {gradingAssignment.title}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{gradingAssignment.class_} · Max: {gradingAssignment.maxMarks} marks</p>
            </div>
            <button onClick={() => setGradingId(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase">Student</th>
                  <th className="text-center pb-2 text-xs font-semibold text-gray-500 uppercase w-24">Score /{gradingAssignment.maxMarks}</th>
                  <th className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase">Feedback</th>
                  <th className="text-center pb-2 text-xs font-semibold text-gray-500 uppercase w-24">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {gradingAssignment.grading.map(g => (
                  <tr key={g.studentId}>
                    <td className="py-2.5 font-medium text-gray-800 dark:text-white">{g.name}</td>
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="number" min={0} max={gradingAssignment.maxMarks}
                        className="w-16 text-center text-sm border border-gray-200 dark:border-gray-700 rounded-md px-1 py-1 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        placeholder="—"
                        value={localGrades[g.studentId]?.score ?? ''}
                        onChange={e => setLocalGrades(prev => ({ ...prev, [g.studentId]: { ...prev[g.studentId], score: e.target.value } }))}
                      />
                    </td>
                    <td className="py-2.5 px-2">
                      <input
                        type="text" className="w-full text-sm field py-1.5"
                        placeholder="Optional feedback…"
                        value={localGrades[g.studentId]?.feedback ?? ''}
                        onChange={e => setLocalGrades(prev => ({ ...prev, [g.studentId]: { ...prev[g.studentId], feedback: e.target.value } }))}
                      />
                    </td>
                    <td className="py-2.5 text-center">
                      {localGrades[g.studentId]?.score
                        ? <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 px-2 py-0.5 rounded-full">Graded</span>
                        : <span className="text-xs bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 px-2 py-0.5 rounded-full">Pending</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={() => saveGrades(gradingAssignment.id)} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Save & Publish Grades
            </Button>
            <Button variant="outline" onClick={() => setGradingId(null)}>Cancel</Button>
          </div>
        </GlassCard>
      )}

      {/* Assignment List */}
      <div className="space-y-4">
        {assignments.map(a => {
          const submitted = a.grading.filter(g => g.submitted).length
          const graded    = a.grading.filter(g => g.score !== '').length
          const total     = a.grading.length
          const pct       = total ? Math.round((submitted / total) * 100) : 0
          const overdue   = isPastDue(a.due)

          return (
            <GlassCard key={a.id} className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[a.type]}`}>
                      {TYPE_OPTS.find(t => t.value === a.type)?.label}
                    </span>
                    <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">{a.class_}</span>
                    {overdue && <span className="text-xs bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 px-2 py-0.5 rounded-full flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Past Due</span>}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{a.title}</h3>
                  {a.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{a.description}</p>}
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Due: {a.due}
                    <span>·</span>
                    <span>Max: {a.maxMarks} marks</span>
                    <span>·</span>
                    <span>Posted: {a.postedOn}</span>
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => openGrading(a.id)}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                  >
                    <Award className="w-3.5 h-3.5" /> Grade
                  </button>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="flex items-center gap-1 text-gray-500"><Users className="w-3 h-3" /> Submissions</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{submitted}/{total}</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="flex items-center gap-1 text-gray-500"><CheckCircle2 className="w-3 h-3" /> Graded</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{graded}/{total}</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${total ? (graded/total)*100 : 0}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
