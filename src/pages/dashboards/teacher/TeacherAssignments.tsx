import { useState } from 'react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Button } from '../../../components/ui/Button'
import { useToast } from '../../../contexts/ToastContext'
import { SUBJECTS, POSTED_ASSIGNMENTS } from './_data'

export function TeacherAssignments() {
  const { showToast } = useToast()
  const [form, setForm] = useState({ title: '', due: '', className: '', subject: 'Mathematics' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    showToast(`Assignment "${form.title}" posted to ${form.className}`)
    setForm({ title: '', due: '', className: '', subject: 'Mathematics' })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assignments</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Post and track homework</p>
      </div>

      <GlassCard className="p-6">
        <h2 className="mb-4 font-bold text-green-700 dark:text-green-400">Post New Assignment</h2>
        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
          <input
            required placeholder="Assignment Title" value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })} className="field md:col-span-2"
          />
          <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="field">
            {SUBJECTS.map(s => <option key={s}>{s}</option>)}
          </select>
          <input
            required placeholder="Class (e.g. Grade 5 Gold)" value={form.className}
            onChange={e => setForm({ ...form, className: e.target.value })} className="field"
          />
          <input
            required type="date" value={form.due}
            onChange={e => setForm({ ...form, due: e.target.value })} className="field"
          />
          <Button type="submit" variant="primary">Post Assignment</Button>
        </form>
      </GlassCard>

      <GlassCard className="p-6">
        <h2 className="mb-4 font-bold text-gray-900 dark:text-white">Posted Assignments</h2>
        <div className="space-y-3">
          {POSTED_ASSIGNMENTS.map(a => (
            <div key={a.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white">{a.title}</p>
                <p className="text-xs text-gray-400">{a.subject} · {a.class_} · Due {a.due}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{a.submitted}/{a.total}</p>
                <p className="text-xs text-gray-400">submitted</p>
              </div>
              <div className="w-24 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700 h-2">
                <div className="h-full rounded-full bg-green-600" style={{ width: `${Math.round((a.submitted / a.total) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
