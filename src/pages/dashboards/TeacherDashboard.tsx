import { useState } from 'react'
import { students } from '../../data/students'
import { GlassCard } from '../../components/ui/GlassCard'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../contexts/ToastContext'
import { useAuth } from '../../contexts/AuthContext'

export function TeacherDashboard() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [gradeForm, setGradeForm] = useState({ studentId: '', subject: 'Mathematics', score: '' })
  const [attendance, setAttendance] = useState<Record<string, boolean>>(
    Object.fromEntries(students.slice(0, 15).map((s) => [s.id, true])),
  )
  const [homework, setHomework] = useState({ title: '', due: '', className: '' })

  const submitGrade = (e: React.FormEvent) => {
    e.preventDefault()
    showToast(`Grade recorded for ${students.find((s) => s.id === gradeForm.studentId)?.name}`)
    setGradeForm({ ...gradeForm, score: '' })
  }

  const submitAttendance = () => {
    showToast('Daily attendance saved successfully')
  }

  const submitHomework = (e: React.FormEvent) => {
    e.preventDefault()
    showToast(`Homework "${homework.title}" posted to class`)
    setHomework({ title: '', due: '', className: '' })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold">Teacher Portal — {user?.name}</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <GlassCard className="p-6">
          <h2 className="mb-4 font-bold text-primary dark:text-gold">Input Grades</h2>
          <form onSubmit={submitGrade} className="space-y-3">
            <select
              required
              value={gradeForm.studentId}
              onChange={(e) => setGradeForm({ ...gradeForm, studentId: e.target.value })}
              className="field"
            >
              <option value="">Select Student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.name} — {s.className}</option>
              ))}
            </select>
            <input
              type="number"
              min={0}
              max={100}
              required
              placeholder="Score"
              value={gradeForm.score}
              onChange={(e) => setGradeForm({ ...gradeForm, score: e.target.value })}
              className="field"
            />
            <Button type="submit" variant="primary" className="w-full">Save Grade</Button>
          </form>
        </GlassCard>

        <GlassCard className="p-6 lg:col-span-2">
          <h2 className="mb-4 font-bold">Mark Attendance</h2>
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {students.slice(0, 15).map((s) => (
              <label key={s.id} className="flex items-center gap-3 rounded-xl p-2 hover:bg-tint/30 dark:hover:bg-dark-card">
                <input
                  type="checkbox"
                  checked={attendance[s.id]}
                  onChange={(e) => setAttendance({ ...attendance, [s.id]: e.target.checked })}
                  className="h-5 w-5 accent-primary"
                />
                <span className="text-sm">{s.name}</span>
                <span className="text-xs text-muted">{s.className}</span>
              </label>
            ))}
          </div>
          <Button variant="gold" className="mt-4" onClick={submitAttendance}>
            Submit Attendance
          </Button>
        </GlassCard>

        <GlassCard className="p-6 lg:col-span-3">
          <h2 className="mb-4 font-bold">Post Homework</h2>
          <form onSubmit={submitHomework} className="grid gap-3 md:grid-cols-4">
            <input
              required
              placeholder="Assignment Title"
              value={homework.title}
              onChange={(e) => setHomework({ ...homework, title: e.target.value })}
              className="field"
            />
            <input
              required
              type="date"
              value={homework.due}
              onChange={(e) => setHomework({ ...homework, due: e.target.value })}
              className="field"
            />
            <input
              required
              placeholder="Class"
              value={homework.className}
              onChange={(e) => setHomework({ ...homework, className: e.target.value })}
              className="field"
            />
            <Button type="submit" variant="primary">Post Assignment</Button>
          </form>
        </GlassCard>
      </div>
    </div>
  )
}
