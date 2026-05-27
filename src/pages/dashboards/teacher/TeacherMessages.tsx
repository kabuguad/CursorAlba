import { useState } from 'react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Button } from '../../../components/ui/Button'
import { useToast } from '../../../contexts/ToastContext'
import { MESSAGES } from './_data'

export function TeacherMessages() {
  const { showToast } = useToast()
  const [replyMap, setReplyMap] = useState<Record<number, string>>({})
  const unread = MESSAGES.filter(m => !m.read).length

  const handleReply = (id: number) => {
    if (!replyMap[id]?.trim()) return
    showToast('Message sent to parent')
    setReplyMap(prev => ({ ...prev, [id]: '' }))
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Parent Messages</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{MESSAGES.length} messages · {unread} unread</p>
        </div>
        {unread > 0 && (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">{unread}</span>
        )}
      </div>

      {MESSAGES.map(m => (
        <GlassCard key={m.id} className={`p-5 ${!m.read ? 'ring-2 ring-green-600/20' : ''}`}>
          <div className="flex items-start gap-3 mb-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-bold text-sm">
              {m.parent.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900 dark:text-white">{m.parent}</p>
                {!m.read && <span className="h-2 w-2 rounded-full bg-green-600" />}
              </div>
              <p className="text-xs text-gray-400">Re: {m.student} · {m.date} {m.time}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{m.text}</p>
          <div className="flex gap-2">
            <input
              placeholder="Reply to parent…"
              value={replyMap[m.id] ?? ''}
              onChange={e => setReplyMap(prev => ({ ...prev, [m.id]: e.target.value }))}
              className="field flex-1 text-sm"
            />
            <Button variant="primary" onClick={() => handleReply(m.id)} className="shrink-0">Reply</Button>
          </div>
        </GlassCard>
      ))}
    </div>
  )
}
