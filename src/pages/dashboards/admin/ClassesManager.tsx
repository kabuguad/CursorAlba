import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Pencil, Trash2, X, BookOpen, Users, GraduationCap, Loader2, Calendar } from 'lucide-react'
import { useClasses, useSubjects, useStaff, useAcademicYears, useCreateClass, useUpdateClass, useDeleteClass, useSetCurrentYear, useCreateSubject, useDeleteSubject, useAssessmentSchemes, useCreateScheme, useDeleteScheme, useExams, useCreateExam, useUpdateExam, useDeleteExam } from '../../../hooks/useAdminData'
import { useToast } from '../../../contexts/ToastContext'
import { unwrap } from '../../../services/mockApi'
import type { SchoolClass, Subject, AssessmentScheme, Exam } from '../../../services/academicService'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'

const TABS = ['Classes', 'Subjects', 'Assessment', 'Exams', 'Calendar'] as const
type Tab = typeof TABS[number]

const EXAM_STATUS_COLORS = { scheduled: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', ongoing: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', completed: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' }

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4 shrink-0">
          <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-4 w-4" /></button>
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>, document.body,
  )
}

export function ClassesManager() {
  const { showToast } = useToast()
  const [tab, setTab] = useState<Tab>('Classes')
  const [showClassForm, setShowClassForm] = useState(false)
  const [showSubjectForm, setShowSubjectForm] = useState(false)
  const [showSchemeForm, setShowSchemeForm] = useState(false)
  const [showExamForm, setShowExamForm] = useState(false)
  const [editingExam, setEditingExam] = useState<Exam | null>(null)
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null)
  const [delConfirm, setDelConfirm] = useState<{ type: string; id: string } | null>(null)

  const { data: classes = [], isLoading: clsLoading } = useClasses()
  const { data: subjects = [], isLoading: subLoading } = useSubjects()
  const { data: staff = [] } = useStaff()
  const { data: years = [] } = useAcademicYears()
  const { data: schemes = [] } = useAssessmentSchemes()
  const { data: exams = [] } = useExams()
  const createClass = useCreateClass()
  const updateClass = useUpdateClass()
  const deleteClass = useDeleteClass()
  const createSubject = useCreateSubject()
  const deleteSubject = useDeleteSubject()
  const createScheme = useCreateScheme()
  const deleteScheme = useDeleteScheme()
  const createExam = useCreateExam()
  const updateExam = useUpdateExam()
  const deleteExam = useDeleteExam()
  const setCurrentYear = useSetCurrentYear()

  const currentYear = years.find(y => y.isCurrent)
  const currentTerm = currentYear?.terms.find(t => t.isCurrent)

  // Class form state
  const [clsDraft, setClsDraft] = useState({ grade: '', stream: '', classTeacherId: '', capacity: 35, academicYearId: currentYear?.id ?? '' })
  // Subject form state
  const [subDraft, setSubDraft] = useState({ name: '', code: '', department: '', grades: [] as string[], periodsPerWeek: 4 })
  // Scheme form state
  const [schemeDraft, setSchemeDraft] = useState({ name: '', grade: '', components: [{ name: 'CAT', weight: 30 }, { name: 'Exam', weight: 70 }] })
  // Exam form state
  const [examDraft, setExamDraft] = useState({ name: '', termId: '', startDate: '', endDate: '', grades: [] as string[], status: 'scheduled' as Exam['status'] })

  const GRADES = ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12']
  const DEPARTMENTS = ['Sciences','Languages','Mathematics','Humanities','Technology','Arts','Commerce','Sports','Administration','Library']

  const teachers = staff.filter(s => s.role === 'teacher')

  const saveClass = async () => {
    try {
      if (editingClass) {
        await updateClass.mutateAsync({ id: editingClass.id, data: { ...clsDraft, classTeacherId: clsDraft.classTeacherId || null, subjectIds: [] } }).then(unwrap)
        showToast('Class updated ✓')
      } else {
        await createClass.mutateAsync({ ...clsDraft, classTeacherId: clsDraft.classTeacherId || null, subjectIds: [], academicYearId: currentYear?.id ?? '' }).then(unwrap)
        showToast('Class created ✓')
      }
      setShowClassForm(false); setEditingClass(null)
    } catch (e) { showToast((e as Error).message) }
  }

  const saveSubject = async () => {
    try {
      await createSubject.mutateAsync(subDraft).then(unwrap)
      showToast('Subject added ✓'); setShowSubjectForm(false)
    } catch (e) { showToast((e as Error).message) }
  }

  const saveScheme = async () => {
    try {
      await createScheme.mutateAsync(schemeDraft).then(unwrap)
      showToast('Assessment scheme saved ✓'); setShowSchemeForm(false)
    } catch (e) { showToast((e as Error).message) }
  }

  const saveExam = async () => {
    try {
      if (editingExam) {
        await updateExam.mutateAsync({ id: editingExam.id, data: examDraft }).then(unwrap)
        showToast('Exam updated ✓')
      } else {
        await createExam.mutateAsync(examDraft).then(unwrap)
        showToast('Exam scheduled ✓')
      }
      setShowExamForm(false); setEditingExam(null)
    } catch (e) { showToast((e as Error).message) }
  }

  const handleDelete = async () => {
    if (!delConfirm) return
    try {
      if (delConfirm.type === 'class') { await deleteClass.mutateAsync(delConfirm.id); showToast('Class deleted') }
      if (delConfirm.type === 'subject') { await deleteSubject.mutateAsync(delConfirm.id); showToast('Subject deleted') }
      if (delConfirm.type === 'scheme') { await deleteScheme.mutateAsync(delConfirm.id); showToast('Scheme deleted') }
      if (delConfirm.type === 'exam') { await deleteExam.mutateAsync(delConfirm.id); showToast('Exam deleted') }
      setDelConfirm(null)
    } catch (e) { showToast((e as Error).message) }
  }

  const toggleGrade = (arr: string[], g: string) => arr.includes(g) ? arr.filter(x => x !== g) : [...arr, g]

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Academic Configuration</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Current: <strong>{currentYear?.label ?? '—'}</strong> · <strong>{currentTerm?.label ?? '—'}</strong>
          {currentTerm && <span className="ml-2 text-gray-400">({currentTerm.startDate} – {currentTerm.endDate})</span>}
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 border-b border-gray-200 dark:border-gray-700">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium transition border-b-2 -mb-px ${tab === t ? 'border-[#E8B84B] text-[#E8B84B]' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* ── CLASSES TAB ── */}
      {tab === 'Classes' && (
        <>
          <div className="mb-4 flex justify-end">
            <button onClick={() => { setClsDraft({ grade: '', stream: '', classTeacherId: '', capacity: 35, academicYearId: currentYear?.id ?? '' }); setEditingClass(null); setShowClassForm(true) }}
              className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2.5 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a]">
              <Plus className="h-4 w-4" /> Add Class
            </button>
          </div>
          {clsLoading ? <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-gray-400" /></div> : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {classes.map(c => {
                const teacher = teachers.find(t => t.id === c.classTeacherId)
                return (
                  <div key={c.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <GraduationCap className="h-4 w-4 text-[#E8B84B]" />
                          <p className="font-bold text-gray-900 dark:text-white">{c.grade} — Stream {c.stream}</p>
                        </div>
                        <p className="text-xs text-gray-400">Capacity: {c.capacity}</p>
                        {teacher && <p className="text-xs text-gray-400 mt-0.5">Class Teacher: {teacher.firstName} {teacher.lastName}</p>}
                        <p className="text-xs text-gray-400 mt-0.5">{c.subjectIds.length} subjects assigned</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => { setClsDraft({ grade: c.grade, stream: c.stream, classTeacherId: c.classTeacherId ?? '', capacity: c.capacity, academicYearId: c.academicYearId }); setEditingClass(c); setShowClassForm(true) }}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => setDelConfirm({ type: 'class', id: c.id })}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* ── SUBJECTS TAB ── */}
      {tab === 'Subjects' && (
        <>
          <div className="mb-4 flex justify-end">
            <button onClick={() => setShowSubjectForm(true)} className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2.5 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a]">
              <Plus className="h-4 w-4" /> Add Subject
            </button>
          </div>
          {subLoading ? <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-gray-400" /></div> : (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                  <tr>{['Subject', 'Code', 'Department', 'Periods/Week', 'Grades', ''].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {subjects.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">{s.name}</td>
                      <td className="px-5 py-3.5"><span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{s.code}</span></td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{s.department}</td>
                      <td className="px-5 py-3.5 text-center text-gray-500 dark:text-gray-400">{s.periodsPerWeek}</td>
                      <td className="px-5 py-3.5 text-xs text-gray-400">{s.grades.length} grades</td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => setDelConfirm({ type: 'subject', id: s.id })} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ── ASSESSMENT TAB ── */}
      {tab === 'Assessment' && (
        <>
          <div className="mb-4 flex justify-end">
            <button onClick={() => setShowSchemeForm(true)} className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2.5 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a]">
              <Plus className="h-4 w-4" /> Add Scheme
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {schemes.map(sc => {
              const total = sc.components.reduce((s, c) => s + c.weight, 0)
              return (
                <div key={sc.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{sc.name}</p>
                      <p className="text-xs text-gray-400">{sc.grade}</p>
                    </div>
                    <button onClick={() => setDelConfirm({ type: 'scheme', id: sc.id })} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                  <div className="space-y-2">
                    {sc.components.map(c => (
                      <div key={c.name} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{c.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                            <div className="h-full rounded-full bg-[#E8B84B]" style={{ width: `${c.weight}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 w-8 text-right">{c.weight}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className={`mt-3 text-xs font-semibold ${total === 100 ? 'text-green-600' : 'text-red-500'}`}>Total: {total}% {total !== 100 ? '⚠️ should be 100%' : '✓'}</p>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* ── EXAMS TAB ── */}
      {tab === 'Exams' && (
        <>
          <div className="mb-4 flex justify-end">
            <button onClick={() => { setExamDraft({ name: '', termId: currentTerm?.id ?? '', startDate: '', endDate: '', grades: [], status: 'scheduled' }); setEditingExam(null); setShowExamForm(true) }}
              className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2.5 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a]">
              <Plus className="h-4 w-4" /> Schedule Exam
            </button>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <tr>{['Exam Name', 'Term', 'Dates', 'Grades', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {exams.map(e => {
                  const year = years.find(y => y.terms.some(t => t.id === e.termId))
                  const term = year?.terms.find(t => t.id === e.termId)
                  return (
                    <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">{e.name}</td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs">{term?.label ?? e.termId}</td>
                      <td className="px-5 py-3.5 text-xs text-gray-500 dark:text-gray-400">{e.startDate} – {e.endDate}</td>
                      <td className="px-5 py-3.5 text-xs text-gray-400">{e.grades.length} grades</td>
                      <td className="px-5 py-3.5">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${EXAM_STATUS_COLORS[e.status]}`}>{e.status}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-1">
                          <button onClick={() => { setExamDraft({ name: e.name, termId: e.termId, startDate: e.startDate, endDate: e.endDate, grades: e.grades, status: e.status }); setEditingExam(e); setShowExamForm(true) }}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600"><Pencil className="h-3.5 w-3.5" /></button>
                          <button onClick={() => setDelConfirm({ type: 'exam', id: e.id })}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {exams.length === 0 && <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">No exams scheduled</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── CALENDAR TAB ── */}
      {tab === 'Calendar' && (
        <div className="space-y-6">
          {years.map(y => (
            <div key={y.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#E8B84B]" />
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">Academic Year {y.label}</p>
                    {y.isCurrent && <span className="text-xs font-semibold text-green-600 dark:text-green-400">● Current Year</span>}
                  </div>
                </div>
                {!y.isCurrent && (
                  <button onClick={async () => {
                    const term = y.terms.find(t => t.isCurrent) ?? y.terms[0]
                    await setCurrentYear.mutateAsync({ yearId: y.id, termId: term.id }).then(unwrap)
                    showToast('Academic year updated ✓')
                  }} className="rounded-lg px-3 py-1.5 text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Set as Current
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {y.terms.map(t => (
                  <div key={t.id} className={`rounded-xl p-4 ${t.isCurrent ? 'bg-[#E8B84B]/10 border border-[#E8B84B]/30' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{t.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.startDate} → {t.endDate}</p>
                    {t.isCurrent && <p className="text-xs font-semibold text-[#E8B84B] mt-1">Active Term</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Class form modal */}
      <Modal open={showClassForm} onClose={() => setShowClassForm(false)} title={editingClass ? 'Edit Class' : 'Add Class'}>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL}>Grade</label>
              <select className={INP} value={clsDraft.grade} onChange={e => setClsDraft({ ...clsDraft, grade: e.target.value })}>
                <option value="">Select grade…</option>
                {GRADES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Stream</label>
              <input className={INP} placeholder="A, B, C…" value={clsDraft.stream} onChange={e => setClsDraft({ ...clsDraft, stream: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Class Teacher</label>
              <select className={INP} value={clsDraft.classTeacherId} onChange={e => setClsDraft({ ...clsDraft, classTeacherId: e.target.value })}>
                <option value="">None assigned</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Capacity</label>
              <input type="number" className={INP} value={clsDraft.capacity} onChange={e => setClsDraft({ ...clsDraft, capacity: +e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowClassForm(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
            <button onClick={saveClass} className="rounded-xl bg-[#E8B84B] px-5 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a]">{editingClass ? 'Save' : 'Create'}</button>
          </div>
        </div>
      </Modal>

      {/* Subject form modal */}
      <Modal open={showSubjectForm} onClose={() => setShowSubjectForm(false)} title="Add Subject">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className={LABEL}>Subject Name</label><input className={INP} value={subDraft.name} onChange={e => setSubDraft({ ...subDraft, name: e.target.value })} /></div>
            <div><label className={LABEL}>Code</label><input className={INP} value={subDraft.code} onChange={e => setSubDraft({ ...subDraft, code: e.target.value })} /></div>
            <div>
              <label className={LABEL}>Department</label>
              <select className={INP} value={subDraft.department} onChange={e => setSubDraft({ ...subDraft, department: e.target.value })}>
                <option value="">Select…</option>
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div><label className={LABEL}>Periods/Week</label><input type="number" className={INP} value={subDraft.periodsPerWeek} onChange={e => setSubDraft({ ...subDraft, periodsPerWeek: +e.target.value })} /></div>
          </div>
          <div>
            <label className={LABEL}>Grades</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {GRADES.map(g => (
                <button key={g} type="button" onClick={() => setSubDraft({ ...subDraft, grades: subDraft.grades.includes(g) ? subDraft.grades.filter(x => x !== g) : [...subDraft.grades, g] })}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition ${subDraft.grades.includes(g) ? 'bg-[#E8B84B] text-[#0d1b0d]' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowSubjectForm(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
            <button onClick={saveSubject} className="rounded-xl bg-[#E8B84B] px-5 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a]">Add Subject</button>
          </div>
        </div>
      </Modal>

      {/* Scheme form */}
      <Modal open={showSchemeForm} onClose={() => setShowSchemeForm(false)} title="Add Assessment Scheme">
        <div className="space-y-4">
          <div><label className={LABEL}>Scheme Name</label><input className={INP} value={schemeDraft.name} onChange={e => setSchemeDraft({ ...schemeDraft, name: e.target.value })} /></div>
          <div><label className={LABEL}>Applicable Grade Range</label><input className={INP} placeholder="e.g. Grade 7–9" value={schemeDraft.grade} onChange={e => setSchemeDraft({ ...schemeDraft, grade: e.target.value })} /></div>
          <div>
            <label className={LABEL}>Components (total must = 100%)</label>
            <div className="space-y-2 mt-1">
              {schemeDraft.components.map((c, i) => (
                <div key={i} className="flex gap-2">
                  <input className={INP} placeholder="Component name" value={c.name} onChange={e => { const cs = [...schemeDraft.components]; cs[i] = { ...cs[i], name: e.target.value }; setSchemeDraft({ ...schemeDraft, components: cs }) }} />
                  <input type="number" className={`${INP} w-20`} value={c.weight} onChange={e => { const cs = [...schemeDraft.components]; cs[i] = { ...cs[i], weight: +e.target.value }; setSchemeDraft({ ...schemeDraft, components: cs }) }} />
                  <button onClick={() => setSchemeDraft({ ...schemeDraft, components: schemeDraft.components.filter((_, j) => j !== i) })} className="text-red-400 hover:text-red-600"><X className="h-4 w-4" /></button>
                </div>
              ))}
              <button onClick={() => setSchemeDraft({ ...schemeDraft, components: [...schemeDraft.components, { name: '', weight: 0 }] })} className="text-xs text-[#E8B84B] hover:underline">+ Add component</button>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowSchemeForm(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
            <button onClick={saveScheme} className="rounded-xl bg-[#E8B84B] px-5 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a]">Save Scheme</button>
          </div>
        </div>
      </Modal>

      {/* Exam form */}
      <Modal open={showExamForm} onClose={() => setShowExamForm(false)} title={editingExam ? 'Edit Exam' : 'Schedule Exam'}>
        <div className="space-y-4">
          <div><label className={LABEL}>Exam Name</label><input className={INP} value={examDraft.name} onChange={e => setExamDraft({ ...examDraft, name: e.target.value })} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className={LABEL}>Start Date</label><input type="date" className={INP} value={examDraft.startDate} onChange={e => setExamDraft({ ...examDraft, startDate: e.target.value })} /></div>
            <div><label className={LABEL}>End Date</label><input type="date" className={INP} value={examDraft.endDate} onChange={e => setExamDraft({ ...examDraft, endDate: e.target.value })} /></div>
            <div>
              <label className={LABEL}>Status</label>
              <select className={INP} value={examDraft.status} onChange={e => setExamDraft({ ...examDraft, status: e.target.value as Exam['status'] })}>
                <option value="scheduled">Scheduled</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div>
            <label className={LABEL}>Grades</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {GRADES.map(g => (
                <button key={g} type="button" onClick={() => setExamDraft({ ...examDraft, grades: examDraft.grades.includes(g) ? examDraft.grades.filter(x => x !== g) : [...examDraft.grades, g] })}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition ${examDraft.grades.includes(g) ? 'bg-[#E8B84B] text-[#0d1b0d]' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowExamForm(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
            <button onClick={saveExam} className="rounded-xl bg-[#E8B84B] px-5 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a]">{editingExam ? 'Save' : 'Schedule'}</button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!delConfirm} onClose={() => setDelConfirm(null)} title="Confirm Delete">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">This will permanently delete this item. Are you sure?</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDelConfirm(null)} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
          <button onClick={handleDelete} className="rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600">Delete</button>
        </div>
      </Modal>
    </div>
  )
}
