import { useState } from 'react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Button } from '../../../components/ui/Button'
import { useToast } from '../../../contexts/ToastContext'
import {
  Plus, ChevronDown, CheckCircle2, Clock, XCircle,
  FileText, BookOpen, Edit2, Trash2, ChevronRight,
} from 'lucide-react'

type Status = 'planned' | 'delivered' | 'skipped'

interface LessonPlan {
  id: string
  week: number
  date: string
  class_: string
  topic: string
  subtopic: string
  objectives: string
  activities: string
  resources: string
  assessment: string
  duration: number
  status: Status
  cbcStrands: string
}

const INITIAL_PLANS: LessonPlan[] = [
  {
    id: 'lp1', week: 1, date: '2025-05-05', class_: 'Grade 5 Gold',
    topic: 'Fractions', subtopic: 'Equivalent Fractions',
    objectives: 'Learners will identify and generate equivalent fractions using models and algorithms.',
    activities: 'Introduce using fraction bars. Group activity: match equivalent fraction cards. Individual practice: textbook exercises p.45–47.',
    resources: 'Fraction bar models, Flashcards, Textbook Grade 5 Maths p.45, Whiteboard',
    assessment: 'Oral questioning during lesson; exit ticket — 5 equivalent fraction problems',
    duration: 40, status: 'delivered', cbcStrands: 'Numbers; Problem Solving; Communication',
  },
  {
    id: 'lp2', week: 1, date: '2025-05-05', class_: 'Grade 6 Silver',
    topic: 'Algebra', subtopic: 'Simple Equations',
    objectives: 'Solve one-step linear equations in one unknown using inverse operations.',
    activities: 'Balance scale demonstration. Think-pair-share: solve 5 equations. Class practice on whiteboard.',
    resources: 'Balance scale prop, Equation cards, Whiteboard, Grade 6 Maths textbook p.88',
    assessment: 'Mini-whiteboard responses; homework — 10 equations',
    duration: 40, status: 'delivered', cbcStrands: 'Algebra; Logical Thinking; Collaboration',
  },
  {
    id: 'lp3', week: 2, date: '2025-05-12', class_: 'Grade 5 Gold',
    topic: 'Fractions', subtopic: 'Addition of Fractions (Same Denominator)',
    objectives: 'Add fractions with the same denominator and simplify results.',
    activities: 'Real-life scenario: sharing a pizza. Group work with fraction strips. Textbook p.50–52.',
    resources: 'Fraction strips, Pizza diagram poster, Textbook p.50',
    assessment: 'Group work observation; 5-question quiz end of lesson',
    duration: 40, status: 'delivered', cbcStrands: 'Numbers; Collaboration; Critical Thinking',
  },
  {
    id: 'lp4', week: 3, date: '2025-05-19', class_: 'Grade 5 Gold',
    topic: 'Fractions', subtopic: 'Subtraction of Fractions',
    objectives: 'Subtract fractions with like and unlike denominators.',
    activities: 'Number line model. Worked examples. Individual practice.',
    resources: 'Number line charts, Textbook p.54',
    assessment: 'CAT 2 preparation worksheet',
    duration: 40, status: 'planned', cbcStrands: 'Numbers; Problem Solving',
  },
  {
    id: 'lp5', week: 3, date: '2025-05-20', class_: 'Grade 5 Gold',
    topic: 'Fractions', subtopic: 'CAT 2 Assessment',
    objectives: 'Assess learners on fractions (equivalent, addition, subtraction).',
    activities: 'Written test — 40 marks, 40 minutes.',
    resources: 'CAT 2 question papers',
    assessment: 'Written CAT 2 — marks to be entered in gradebook within 7 days',
    duration: 40, status: 'planned', cbcStrands: 'Numbers',
  },
  {
    id: 'lp6', week: 2, date: '2025-05-13', class_: 'Grade 6 Silver',
    topic: 'Algebra', subtopic: 'Two-Step Equations',
    objectives: 'Solve two-step linear equations using inverse operations.',
    activities: 'Review one-step. Introduce two-step with balance model. Partner practice.',
    resources: 'Balance scale, Textbook p.92',
    assessment: 'Partner problem-solving observation; homework 8 questions',
    duration: 40, status: 'skipped', cbcStrands: 'Algebra; Critical Thinking',
  },
]

const CLASSES = ['All Classes', 'Grade 4 Red', 'Grade 5 Gold', 'Grade 5 Blue', 'Grade 6 Silver', 'Grade 7 Green']

const STATUS_CONFIG: Record<Status, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  delivered: { label: 'Delivered',  icon: CheckCircle2, color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-100 dark:bg-emerald-900/40' },
  planned:   { label: 'Planned',    icon: Clock,        color: 'text-blue-700 dark:text-blue-300',       bg: 'bg-blue-100 dark:bg-blue-900/40'       },
  skipped:   { label: 'Skipped',    icon: XCircle,      color: 'text-red-700 dark:text-red-300',         bg: 'bg-red-100 dark:bg-red-900/40'         },
}

const BLANK: Omit<LessonPlan, 'id' | 'status'> = {
  week: 4, date: '', class_: 'Grade 5 Gold', topic: '', subtopic: '',
  objectives: '', activities: '', resources: '', assessment: '',
  duration: 40, cbcStrands: '',
}

export function TeacherLessonPlans() {
  const { showToast } = useToast()
  const [plans, setPlans] = useState<LessonPlan[]>(INITIAL_PLANS)
  const [filterClass, setFilterClass] = useState('All Classes')
  const [showForm, setShowForm] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [form, setForm] = useState(BLANK)

  const filtered = filterClass === 'All Classes' ? plans : plans.filter(p => p.class_ === filterClass)

  const byWeek = filtered.reduce<Record<number, LessonPlan[]>>((acc, p) => {
    ;(acc[p.week] = acc[p.week] ?? []).push(p)
    return acc
  }, {})

  function handleSubmit() {
    if (!form.date || !form.topic || !form.class_) {
      showToast('Please fill in all required fields', 'error')
      return
    }
    const newPlan: LessonPlan = { ...form, id: `lp${Date.now()}`, status: 'planned' }
    setPlans(prev => [...prev, newPlan])
    setForm(BLANK)
    setShowForm(false)
    showToast('Lesson plan saved successfully', 'success')
  }

  function setStatus(id: string, status: Status) {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, status } : p))
    showToast(`Lesson marked as ${status}`, 'success')
  }

  function deletePlan(id: string) {
    setPlans(prev => prev.filter(p => p.id !== id))
    showToast('Lesson plan deleted', 'success')
  }

  const delivered = plans.filter(p => p.status === 'delivered').length
  const total     = plans.length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lesson Plans</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Term 2, 2025 · Mathematics · {delivered}/{total} lessons delivered
          </p>
        </div>
        <Button onClick={() => setShowForm(s => !s)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Lesson Plan
        </Button>
      </div>

      {/* Progress */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Term Progress</p>
          <p className="text-sm text-gray-500">{delivered} of {total} lessons delivered</p>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${total ? (delivered / total) * 100 : 0}%` }} />
        </div>
        <div className="flex gap-4 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />{plans.filter(p=>p.status==='delivered').length} Delivered</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />{plans.filter(p=>p.status==='planned').length} Planned</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />{plans.filter(p=>p.status==='skipped').length} Skipped</span>
        </div>
      </GlassCard>

      {/* New Plan Form */}
      {showForm && (
        <GlassCard className="p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" /> New Lesson Plan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="label">Class *</label>
              <div className="relative">
                <select className="field pr-8 appearance-none" value={form.class_} onChange={e => setForm(f => ({ ...f, class_: e.target.value }))}>
                  {CLASSES.slice(1).map(c => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="label">Date *</label>
              <input type="date" className="field" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div>
              <label className="label">Week No.</label>
              <input type="number" min={1} max={14} className="field" value={form.week} onChange={e => setForm(f => ({ ...f, week: +e.target.value }))} />
            </div>
            <div>
              <label className="label">Topic *</label>
              <input type="text" className="field" placeholder="e.g. Fractions" value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} />
            </div>
            <div>
              <label className="label">Sub-topic</label>
              <input type="text" className="field" placeholder="e.g. Equivalent Fractions" value={form.subtopic} onChange={e => setForm(f => ({ ...f, subtopic: e.target.value }))} />
            </div>
            <div>
              <label className="label">Duration (minutes)</label>
              <input type="number" min={20} max={120} className="field" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: +e.target.value }))} />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="label">Learning Objectives *</label>
              <textarea rows={2} className="field resize-none" placeholder="By the end of this lesson, learners will be able to…" value={form.objectives} onChange={e => setForm(f => ({ ...f, objectives: e.target.value }))} />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="label">Teaching Activities</label>
              <textarea rows={3} className="field resize-none" placeholder="Step-by-step teaching activities…" value={form.activities} onChange={e => setForm(f => ({ ...f, activities: e.target.value }))} />
            </div>
            <div className="sm:col-span-1">
              <label className="label">Resources / Materials</label>
              <textarea rows={2} className="field resize-none" placeholder="Textbooks, charts, manipulatives…" value={form.resources} onChange={e => setForm(f => ({ ...f, resources: e.target.value }))} />
            </div>
            <div className="sm:col-span-1">
              <label className="label">Assessment Method</label>
              <textarea rows={2} className="field resize-none" placeholder="Oral questions, exit ticket, quiz…" value={form.assessment} onChange={e => setForm(f => ({ ...f, assessment: e.target.value }))} />
            </div>
            <div className="sm:col-span-1">
              <label className="label">CBC Core Competencies</label>
              <input type="text" className="field" placeholder="e.g. Communication; Critical Thinking" value={form.cbcStrands} onChange={e => setForm(f => ({ ...f, cbcStrands: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={handleSubmit}>Save Lesson Plan</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </GlassCard>
      )}

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {CLASSES.map(c => (
          <button
            key={c}
            onClick={() => setFilterClass(c)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${filterClass === c ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Plans by Week */}
      {Object.keys(byWeek).sort((a, b) => +a - +b).map(wk => (
        <div key={wk}>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Week {wk}
          </h3>
          <div className="space-y-2">
            {byWeek[+wk].map(plan => {
              const st = STATUS_CONFIG[plan.status]
              const isExpanded = expandedId === plan.id
              return (
                <GlassCard key={plan.id} className="p-0 overflow-hidden">
                  <button
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : plan.id)}
                  >
                    <div className={`p-1.5 rounded-lg ${st.bg}`}>
                      <st.icon className={`w-4 h-4 ${st.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-800 dark:text-white text-sm">{plan.topic} — {plan.subtopic}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.bg} ${st.color}`}>{st.label}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{plan.class_} · {plan.date} · {plan.duration} min</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-4 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Learning Objectives</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{plan.objectives}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Teaching Activities</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{plan.activities}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Resources</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{plan.resources}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Assessment</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{plan.assessment}</p>
                        </div>
                        {plan.cbcStrands && (
                          <div className="sm:col-span-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">CBC Core Competencies</p>
                            <div className="flex flex-wrap gap-2">
                              {plan.cbcStrands.split(';').map(s => (
                                <span key={s} className="text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">{s.trim()}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                        {plan.status !== 'delivered' && (
                          <button onClick={() => setStatus(plan.id, 'delivered')} className="text-xs flex items-center gap-1 text-emerald-600 hover:underline">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Mark Delivered
                          </button>
                        )}
                        {plan.status !== 'skipped' && (
                          <button onClick={() => setStatus(plan.id, 'skipped')} className="text-xs flex items-center gap-1 text-red-600 hover:underline">
                            <XCircle className="w-3.5 h-3.5" /> Mark Skipped
                          </button>
                        )}
                        {plan.status !== 'planned' && (
                          <button onClick={() => setStatus(plan.id, 'planned')} className="text-xs flex items-center gap-1 text-blue-600 hover:underline">
                            <Clock className="w-3.5 h-3.5" /> Reset to Planned
                          </button>
                        )}
                        <button className="text-xs flex items-center gap-1 text-gray-500 hover:underline ml-auto">
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button onClick={() => deletePlan(plan.id)} className="text-xs flex items-center gap-1 text-red-500 hover:underline">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </GlassCard>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
