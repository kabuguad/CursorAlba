import { useState } from 'react'
import { GlassCard } from '../../components/ui/GlassCard'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../contexts/ToastContext'
import { useAuth } from '../../contexts/AuthContext'
import { useStudents } from '../../hooks/useStudents'
import { useSubmitGrade } from '../../hooks/useGrades'
import { useSubmitAttendance } from '../../hooks/useAttendance'

const SUBJECTS = ['Mathematics', 'English', 'Science', 'Kiswahili', 'Social Studies', 'Creative Arts']

export function TeacherDashboard() {
  const { user } = useAuth()
  const { showToast } = useToast()

  const { data: students, isLoading: studentsLoading } = useStudents()

  const [gradeForm, setGradeForm] = useState({ studentId: '', subject: 'Mathematics', score: '' })
  const [attendanceMap, setAttendanceMap] = useState<Record<string, boolean>>({})
  const [homework, setHomework] = useState({ title: '', due: '', className: '' })

  const { mutate: submitGrade, isPending: gradePending } = useSubmitGrade()
  const { mutate: submitAttendance, isPending: attendancePending } = useSubmitAttendance()

  const visibleStudents = students?.slice(0, 15) ?? []

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitGrade({
      studentId: gradeForm.studentId,
      subject: gradeForm.subject,
      score: Number(gradeForm.score),
    })
    setGradeForm({ ...gradeForm, score: '' })
  }

  const handleAttendanceSubmit = () => {
    const records = visibleStudents.map((s) => ({
      studentId: s.id,
      present: attendanceMap[s.id] ?? true,
    }))
    submitAttendance({
      classId: 'cls-emerald-grade5',
      date: new Date().toISOString().split('T')[0],
      records,
    })
  }

  const handleHomeworkSubmit = (e: React.FormEvent) => {
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
          <form onSubmit={handleGradeSubmit} className="space-y-3">
            {studentsLoading ? (
              <div className="h-10 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-700" />
            ) : (
              <select
                required
                value={gradeForm.studentId}
                onChange={(e) => setGradeForm({ ...gradeForm, studentId: e.target.value })}
                className="field"
              >
                <option value="">Select Student</option>
                {students?.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} — {s.className}</option>
                ))}
              </select>
            )}
            <select
              value={gradeForm.subject}
              onChange={(e) => setGradeForm({ ...gradeForm, subject: e.target.value })}
              className="field"
            >
              {SUBJECTS.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
            <input
              type="number"
              min={0}
              max={100}
              required
              placeholder="Score (0–100)"
              value={gradeForm.score}
              onChange={(e) => setGradeForm({ ...gradeForm, score: e.target.value })}
              className="field"
            />
            <Button type="submit" variant="primary" className="w-full" disabled={gradePending}>
              {gradePending ? 'Saving...' : 'Save Grade'}
            </Button>
          </form>
        </GlassCard>

        <GlassCard className="p-6 lg:col-span-2">
          <h2 className="mb-4 font-bold">Mark Attendance</h2>
          {studentsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-700" />
              ))}
            </div>
          ) : (
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {visibleStudents.map((s) => (
                <label key={s.id} className="flex items-center gap-3 rounded-xl p-2 hover:bg-tint/30 dark:hover:bg-dark-card cursor-pointer">
                  <input
                    type="checkbox"
                    checked={attendanceMap[s.id] ?? true}
                    onChange={(e) => setAttendanceMap({ ...attendanceMap, [s.id]: e.target.checked })}
                    className="h-5 w-5 accent-primary"
                  />
                  <span className="text-sm">{s.name}</span>
                  <span className="text-xs text-muted">{s.className}</span>
                </label>
              ))}
            </div>
          )}
          <Button
            variant="gold"
            className="mt-4"
            onClick={handleAttendanceSubmit}
            disabled={attendancePending || studentsLoading}
          >
            {attendancePending ? 'Saving...' : 'Submit Attendance'}
          </Button>
        </GlassCard>

        <GlassCard className="p-6 lg:col-span-3">
          <h2 className="mb-4 font-bold">Post Homework</h2>
          <form onSubmit={handleHomeworkSubmit} className="grid gap-3 md:grid-cols-4">
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
              placeholder="Class (e.g. Emerald Grade 5)"
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
