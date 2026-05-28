import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Inbox, Send, Loader2, X, Reply, Trash2, Mail, MailOpen } from 'lucide-react'
import { useAdminInbox, useSendMessage, useMarkRead } from '../../../hooks/useAdminData'
import { useToast } from '../../../contexts/ToastContext'
import { useAuth } from '../../../contexts/AuthContext'
import { useQueryClient } from '@tanstack/react-query'
import { unwrap } from '../../../services/mockApi'
import type { Message } from '../../../services/db'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'

const ROLE_COLORS = { admin: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400', teacher: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', parent: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400', student: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' }

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function ReplyModal({ open, onClose, message }: { open: boolean; onClose: () => void; message: Message | null }) {
  const { showToast } = useToast()
  const { user } = useAuth()
  const send = useSendMessage()
  const [body, setBody] = useState('')

  const handleSend = async () => {
    if (!message || !body.trim()) return
    try {
      await send.mutateAsync({
        data: { fromId: 'usr-a001', fromName: user?.name ?? 'Admin', fromRole: 'admin', toId: message.fromId, toName: message.fromName, toRole: message.fromRole, subject: `Re: ${message.subject}`, body },
        threadId: message.threadId,
      }).then(unwrap)
      showToast('Reply sent ✓')
      setBody(''); onClose()
    } catch (e) { showToast((e as Error).message) }
  }

  if (!open || !message) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h3 className="font-bold text-gray-900 dark:text-white">Reply to {message.fromName}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="rounded-xl bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
            <p className="text-xs text-gray-400 mb-1">Original: {message.subject}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{message.body}</p>
          </div>
          <div>
            <label className={LABEL}>Your reply</label>
            <textarea rows={5} className={`${INP} resize-none`} placeholder="Type your reply…" value={body} onChange={e => setBody(e.target.value)} />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
            <button onClick={handleSend} disabled={send.isPending || !body.trim()} className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-5 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] disabled:opacity-60">
              {send.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <Send className="h-3.5 w-3.5" /> Send Reply
            </button>
          </div>
        </div>
      </div>
    </div>, document.body,
  )
}

export function InboxManager() {
  const { data: messages = [], isLoading } = useAdminInbox()
  const markRead = useMarkRead()
  const [selected, setSelected] = useState<Message | null>(null)
  const [showReply, setShowReply] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const unread = messages.filter(m => !m.readAt)
  const filtered = filter === 'unread' ? unread : messages

  const openMessage = async (m: Message) => {
    setSelected(m)
    if (!m.readAt) {
      await markRead.mutateAsync(m.id)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inbox</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{unread.length} unread · {messages.length} total messages</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'unread'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition ${filter === f ? 'bg-[#E8B84B] text-[#0d1b0d]' : 'border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              {f} {f === 'unread' ? `(${unread.length})` : ''}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Message list */}
        <div className="lg:col-span-2 space-y-2">
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-gray-400" /></div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Inbox className="h-10 w-10 mb-2" />
              <p className="text-sm">No messages</p>
            </div>
          ) : (
            filtered.map(m => (
              <button key={m.id} onClick={() => openMessage(m)} className={`w-full rounded-2xl border px-4 py-3.5 text-left transition ${selected?.id === m.id ? 'border-[#E8B84B] bg-[#E8B84B]/5' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${ROLE_COLORS[m.fromRole]}`}>{m.fromRole}</span>
                  {!m.readAt && <span className="h-2 w-2 rounded-full bg-[#E8B84B]" />}
                  <span className="ml-auto text-xs text-gray-400">{timeAgo(m.sentAt)}</span>
                </div>
                <p className={`text-sm ${!m.readAt ? 'font-semibold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>{m.fromName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{m.subject}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{m.body}</p>
              </button>
            ))
          )}
        </div>

        {/* Message detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-full">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{selected.subject}</p>
                  <p className="text-xs text-gray-400">From {selected.fromName} ({selected.fromRole}) · {timeAgo(selected.sentAt)}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowReply(true)} className="flex items-center gap-1.5 rounded-xl bg-[#E8B84B] px-3 py-2 text-xs font-semibold text-[#0d1b0d] hover:bg-[#d4a43a]">
                    <Reply className="h-3.5 w-3.5" /> Reply
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="rounded-xl bg-gray-50 dark:bg-gray-700/40 p-4">
                  <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{selected.body}</p>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                  {selected.readAt ? <><MailOpen className="h-3.5 w-3.5" /> Read {timeAgo(selected.readAt)}</> : <><Mail className="h-3.5 w-3.5" /> Unread</>}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col items-center justify-center h-64 text-gray-400">
              <Inbox className="h-10 w-10 mb-2" />
              <p className="text-sm">Select a message to read</p>
            </div>
          )}
        </div>
      </div>

      <ReplyModal open={showReply} onClose={() => setShowReply(false)} message={selected} />
    </div>
  )
}
