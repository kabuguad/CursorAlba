import { useState } from 'react'
import { Plus, Trash2, Megaphone, Loader2, Eye, EyeOff } from 'lucide-react'
import { useToast } from '../../../contexts/ToastContext'
import { useAuth } from '../../../contexts/AuthContext'
import {
  useAnnouncements, useCreateAnnouncement,
  useUpdateAnnouncement, useDeleteAnnouncement,
} from '../../../hooks/useAdminData'
import type { Announcement } from '../../../services/commsService'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'

const TYPES = ['General', 'Academic', 'Sports', 'Finance', 'Emergency', 'Events']
const PRIORITIES = ['normal', 'high', 'urgent'] as const

const AUDIENCE_COLOR: Record<string, string> = {
  all:     'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  parent:  'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  student: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  teacher: 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  admin:   'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
}

const PRIORITY_COLOR: Record<string, string> = {
  normal:  'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
  high:    'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  urgent:  'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400',
}

const BLANK = {
  title: '',
  body: '',
  targetRoles: ['admin', 'teacher', 'parent', 'student'] as Announcement['targetRoles'],
  targetGrades: [] as string[],
  priority: 'normal' as Announcement['priority'],
  publishAt: new Date().toISOString().slice(0, 16),
  expiresAt: null as string | null,
  status: 'published' as Announcement['status'],
  createdBy: '',
}

export function AnnouncementsManager() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const { data: items = [], isLoading } = useAnnouncements()
  const createAnnouncement = useCreateAnnouncement()
  const updateAnnouncement = useUpdateAnnouncement()
  const deleteAnnouncement = useDeleteAnnouncement()

  const [draft, setDraft] = useState(BLANK)
  const [showForm, setShowForm] = useState(false)

  const post = async () => {
    if (!draft.title.trim() || !draft.body.trim()) return showToast('Title and body are required')
    await createAnnouncement.mutateAsync({ data: draft, createdBy: user?.name ?? 'Admin' })
    setDraft({ ...BLANK })
    setShowForm(false)
    showToast('Announcement posted ✓')
  }

  const toggle = async (a: Announcement) => {
    const next = a.status === 'published' ? 'draft' : 'published'
    await updateAnnouncement.mutateAsync({ id: a.id, data: { status: next } })
  }

  const del = async (id: string) => {
    await deleteAnnouncement.mutateAsync(id)
    showToast('Announcement removed')
  }

  const activeCount = items.filter(a => a.status === 'published').length

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Announcements</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{activeCount} published · {items.length - activeCount} draft</p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2.5 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition">
          <Plus className="h-4 w-4" /> New Announcement
        </button>
      </div>

      {/* Compose form */}
      {showForm && (
        <div className="mb-6 rounded-2xl border border-[#E8B84B]/40 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-[#E8B84B]" /> Compose Announcement
          </h2>
          <div className="space-y-4">
            <div>
              <label className={LABEL}>Title *</label>
              <input className={INP} value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} placeholder="Announcement title…" />
            </div>
            <div>
              <label className={LABEL}>Body *</label>
              <textarea rows={4} className={`${INP} resize-none`} value={draft.body} onChange={e => setDraft({ ...draft, body: e.target.value })} placeholder="Full announcement text…" />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className={LABEL}>Priority</label>
                <select className={INP} value={draft.priority} onChange={e => setDraft({ ...draft, priority: e.target.value as Announcement['priority'] })}>
                  {PRIORITIES.map(p => <option key={p} className="capitalize">{p}</option>)}
                </select>
              </div>
              <div>
                <label className={LABEL}>Status</label>
                <select className={INP} value={draft.status} onChange={e => setDraft({ ...draft, status: e.target.value as Announcement['status'] })}>
                  <option value="published">Publish now</option>
                  <option value="draft">Save as draft</option>
                </select>
              </div>
              <div>
                <label className={LABEL}>Expires At (optional)</label>
                <input type="datetime-local" className={INP} value={draft.expiresAt ?? ''}
                  onChange={e => setDraft({ ...draft, expiresAt: e.target.value || null })} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
              <button onClick={post} disabled={createAnnouncement.isPending}
                className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-5 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] disabled:opacity-60">
                {createAnnouncement.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {draft.status === 'published' ? 'Publish' : 'Save Draft'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {isLoading
        ? <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse" />)}</div>
        : (
          <div className="space-y-3">
            {items.map(a => (
              <div key={a.id} className={`rounded-2xl border bg-white dark:bg-gray-800 p-5 transition ${a.status !== 'published' ? 'opacity-60' : ''}`}
                style={{ borderColor: a.priority === 'urgent' ? '#ef4444' : a.priority === 'high' ? '#eab308' : undefined }}>
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 shrink-0 rounded-lg p-2 ${PRIORITY_COLOR[a.priority]}`}>
                    <Megaphone className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{a.title}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${PRIORITY_COLOR[a.priority]}`}>{a.priority}</span>
                      {a.status !== 'published' && (
                        <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-[10px] font-semibold text-gray-500">{a.status}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{a.body}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                      <span>{new Date(a.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span>·</span>
                      <span>{a.createdBy}</span>
                      {a.targetRoles.map(r => (
                        <span key={r} className={`rounded-full px-2 py-0.5 capitalize ${AUDIENCE_COLOR[r] ?? 'bg-gray-100 text-gray-500'}`}>{r}</span>
                      ))}
                      {a.expiresAt && <span className="text-amber-500">Expires {new Date(a.expiresAt).toLocaleDateString()}</span>}
                      <span className="ml-auto flex items-center gap-1"><Eye className="h-3 w-3" />{a.readCount} reads</span>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => toggle(a)} title={a.status === 'published' ? 'Unpublish' : 'Publish'}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-600 transition">
                      {a.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button onClick={() => del(a.id)} disabled={deleteAnnouncement.isPending}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="py-16 text-center text-gray-400">
                <Megaphone className="mx-auto h-8 w-8 mb-3 opacity-30" />
                <p>No announcements yet. Create your first one above.</p>
              </div>
            )}
          </div>
        )
      }
    </div>
  )
}
