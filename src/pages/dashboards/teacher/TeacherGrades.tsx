import { GlassCard } from '../../../components/ui/GlassCard'
import { Button } from '../../../components/ui/Button'
import { useStudents } from '../../../hooks/useStudents'
import { useSubmitGrade } from '../../../hooks/useGrades'
import { useState } from 'react'
import { SUBJECTS } from './_data'

export function TeacherGrades() {
  const { data: students, isLoading } = useStudents()
  const { mutate: submitGrade, isPending } = useSubmitGrade()
  const [form, setForm] = useState({ studentId: '', subject: 'Mathematics', score: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitGrade({ studentId: form.studentId, subject: form.subject, score: Number(form.score) })
    setForm({ ...form, score: '' })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Input Grades</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Grade 5 Gold · Mathematics · Term 2 2026</p>
      </div>

      <GlassCard className="p-6 max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-3">
          {isLoading ? (
            <div className="h-10 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
          ) : (
            <select required value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })} className="field">
              <option value="">Select Student</option>
              {students?.map(s => <option key={s.id} value={s.id}>{s.name} — {s.className}</option>)}
            </select>
          )}
          <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="field">
            {SUBJECTS.map(s => <option key={s}>{s}</option>)}
          </select>
          <input
            type="number" min={0} max={100} required placeholder="Score (0–100)"
            value={form.score} onChange={e => setForm({ ...form, score: e.target.value })} className="field"
          />
          <Button type="submit" variant="primary" className="w-full" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Grade'}
          </Button>
        </form>
      </GlassCard>
    </div>
  )
}
