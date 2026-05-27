import { useState, useRef, useEffect } from 'react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Button } from '../../../components/ui/Button'
import { useToast } from '../../../contexts/ToastContext'
import { Send, Search, User } from 'lucide-react'

interface Message {
  id: number
  from: 'parent' | 'teacher'
  text: string
  time: string
}

interface Conversation {
  id: number
  name: string
  role: string
  subject: string
  avatar: string
  unread: number
  lastMessage: string
  lastTime: string
  messages: Message[]
}

const CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    name: 'Mrs. Grace Kamau',
    role: 'Class Teacher',
    subject: 'Grade 5 Gold',
    avatar: 'GK',
    unread: 2,
    lastMessage: 'Amani has been doing very well this week.',
    lastTime: '26 May',
    messages: [
      { id: 1, from: 'teacher', text: 'Good morning! Just wanted to update you that Amani has been very attentive this week. Great improvement in Science.', time: 'Mon 10:14 AM' },
      { id: 2, from: 'parent',  text: 'Thank you so much, Mrs. Kamau. We have been working on revision every evening.', time: 'Mon 11:30 AM' },
      { id: 3, from: 'teacher', text: 'It really shows. Please also make sure she completes the English essay due Friday — she hasn\'t started yet based on our in-class check.', time: 'Tue 8:02 AM' },
      { id: 4, from: 'parent',  text: 'Noted. I will follow up at home today. Thank you for letting me know.', time: 'Tue 8:45 AM' },
      { id: 5, from: 'teacher', text: 'Amani has been doing very well this week. Keep it up!', time: '26 May 2:10 PM' },
    ],
  },
  {
    id: 2,
    name: 'Mr. James Ochieng',
    role: 'Mathematics Teacher',
    subject: 'Mathematics',
    avatar: 'JO',
    unread: 0,
    lastMessage: 'Her CAT 2 score is 78%. Solid improvement.',
    lastTime: '22 May',
    messages: [
      { id: 1, from: 'teacher', text: 'Good afternoon. I wanted to share that Amani\'s CAT 1 score was 64%, which is slightly below the class average of 70%.', time: '15 May 3:00 PM' },
      { id: 2, from: 'parent',  text: 'Thank you for letting us know. We will focus on algebra this week.', time: '15 May 5:30 PM' },
      { id: 3, from: 'teacher', text: 'Her CAT 2 score is 78%. Solid improvement. Keep up the revision.', time: '22 May 12:00 PM' },
    ],
  },
  {
    id: 3,
    name: 'Mrs. Janet Wanjiku',
    role: 'English Teacher',
    subject: 'English',
    avatar: 'JW',
    unread: 1,
    lastMessage: 'Please remind her to bring her composition book tomorrow.',
    lastTime: '25 May',
    messages: [
      { id: 1, from: 'teacher', text: 'Hello! Amani\'s reading comprehension is excellent. However she sometimes rushes her written compositions.', time: '20 May 9:00 AM' },
      { id: 2, from: 'parent',  text: 'We will work on taking more time with writing. Thank you.', time: '20 May 10:15 AM' },
      { id: 3, from: 'teacher', text: 'Please remind her to bring her composition book tomorrow.', time: '25 May 4:45 PM' },
    ],
  },
  {
    id: 4,
    name: 'Mr. Francis Gitau',
    role: 'School Bursar',
    subject: 'Finance',
    avatar: 'FG',
    unread: 0,
    lastMessage: 'Your M-Pesa payment of KES 15,000 has been received.',
    lastTime: '5 May',
    messages: [
      { id: 1, from: 'parent',  text: 'Good morning. I just sent a payment of KES 15,000 via M-Pesa. Please confirm receipt.', time: '5 May 9:00 AM' },
      { id: 2, from: 'teacher', text: 'Your M-Pesa payment of KES 15,000 has been received and credited to Amani\'s account. Balance is now KES 12,500. Thank you.', time: '5 May 10:30 AM' },
    ],
  },
  {
    id: 5,
    name: 'Mr. Albert Njeru',
    role: 'Principal',
    subject: 'Administration',
    avatar: 'AN',
    unread: 0,
    lastMessage: 'Thank you for attending the last PTA meeting.',
    lastTime: '10 Apr',
    messages: [
      { id: 1, from: 'teacher', text: 'Thank you for attending the last PTA meeting. Your feedback was very valuable to us.', time: '10 Apr 11:00 AM' },
      { id: 2, from: 'parent',  text: 'Thank you for the warm welcome. We are proud of the school\'s progress.', time: '10 Apr 1:00 PM' },
    ],
  },
]

export function ParentMessages() {
  const { showToast } = useToast()
  const [selected, setSelected] = useState(CONVERSATIONS[0].id)
  const [convos, setConvos] = useState(CONVERSATIONS)
  const [draft, setDraft] = useState('')
  const [search, setSearch] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const convo = convos.find(c => c.id === selected)!
  const filtered = convos.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.subject.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selected, convos])

  const handleSelect = (id: number) => {
    setSelected(id)
    setConvos(prev =>
      prev.map(c => c.id === id ? { ...c, unread: 0 } : c)
    )
    setDraft('')
  }

  const handleSend = () => {
    if (!draft.trim()) return
    const newMsg: Message = {
      id: Date.now(),
      from: 'parent',
      text: draft.trim(),
      time: 'Just now',
    }
    setConvos(prev =>
      prev.map(c =>
        c.id === selected
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: draft.trim(), lastTime: 'Just now' }
          : c
      )
    )
    setDraft('')
    showToast('Message sent')
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const totalUnread = convos.reduce((acc, c) => acc + c.unread, 0)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {convos.length} conversations{totalUnread > 0 ? ` · ${totalUnread} unread` : ''}
        </p>
      </div>

      <div className="flex gap-4 h-[calc(100vh-280px)] min-h-[480px]">

        {/* Sidebar */}
        <GlassCard className="w-72 shrink-0 flex flex-col overflow-hidden hidden sm:flex">
          <div className="p-3 border-b border-gray-100 dark:border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search…"
                className="field w-full pl-8 py-1.5 text-sm"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map(c => (
              <button
                key={c.id}
                onClick={() => handleSelect(c.id)}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/60 transition border-b border-gray-50 dark:border-gray-800/50 ${
                  c.id === selected ? 'bg-[#E8B84B]/8 dark:bg-[#E8B84B]/8' : ''
                }`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8B84B] text-[11px] font-bold text-[#0d1b0d]">
                  {c.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{c.name}</p>
                    <span className="text-[10px] text-gray-400 shrink-0">{c.lastTime}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">{c.role}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{c.lastMessage}</p>
                </div>
                {c.unread > 0 && (
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {c.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Thread */}
        <GlassCard className="flex-1 flex flex-col overflow-hidden">
          {/* Thread header */}
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 px-5 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8B84B] text-[11px] font-bold text-[#0d1b0d]">
              {convo.avatar}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{convo.name}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{convo.role} · {convo.subject}</p>
            </div>

            {/* Mobile conversation switcher */}
            <div className="ml-auto sm:hidden">
              <select
                value={selected}
                onChange={e => handleSelect(Number(e.target.value))}
                className="field text-xs py-1"
              >
                {convos.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {convo.messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.from === 'parent' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  msg.from === 'parent'
                    ? 'bg-green-700 text-white'
                    : 'bg-[#E8B84B] text-[#0d1b0d]'
                }`}>
                  {msg.from === 'parent' ? <User className="h-3.5 w-3.5" /> : convo.avatar}
                </div>
                <div className={`max-w-[75%] ${msg.from === 'parent' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.from === 'parent'
                      ? 'bg-green-700 text-white rounded-tr-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 px-1">{msg.time}</span>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Reply box */}
          <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-3 flex gap-2">
            <textarea
              rows={2}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={handleKey}
              placeholder={`Message ${convo.name.split(' ')[1]}…`}
              className="field flex-1 resize-none text-sm"
            />
            <Button variant="primary" onClick={handleSend} className="self-end shrink-0 gap-1.5">
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </div>
        </GlassCard>

      </div>
    </div>
  )
}
