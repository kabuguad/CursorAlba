import { useState, useRef, useEffect } from 'react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { useToast } from '../../../contexts/ToastContext'
import { Send, Search, Plus, Users, ChevronLeft } from 'lucide-react'

interface Message {
  id: string
  from: 'teacher' | 'parent'
  text: string
  time: string
}

interface Conversation {
  id: string
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
    id: 'c1', name: 'Mrs. Grace Mwangi', role: 'Parent — Kevin Mwangi (Gr 5 Gold)', subject: 'Kevin\'s Mathematics Performance',
    avatar: 'G', unread: 2, lastMessage: 'Thank you for letting me know. We will practice at home.', lastTime: '9:14 AM',
    messages: [
      { id: 'm1', from: 'teacher', text: 'Good afternoon Mrs. Mwangi. I am writing regarding Kevin\'s mathematics performance. His recent CAT 2 score of 24/40 is a concern, and I have noticed he struggles particularly with fractions. I would like us to work together to support him.', time: 'Mon 9:00 AM' },
      { id: 'm2', from: 'parent',  text: 'Good afternoon Mrs. Wanjiku. Thank you for reaching out. We had noticed he was finding homework difficult but did not want to alarm you. What do you suggest we do?', time: 'Mon 9:06 AM' },
      { id: 'm3', from: 'teacher', text: 'I would suggest 20 minutes of fraction practice daily using the worksheet I will send. Also, Kevin should attend the maths clinic every Tuesday at lunch. I will monitor his progress closely.', time: 'Mon 9:09 AM' },
      { id: 'm4', from: 'parent',  text: 'That sounds very good. We will make sure he attends. Is there a specific textbook page range we should focus on?', time: 'Mon 9:12 AM' },
      { id: 'm5', from: 'parent',  text: 'Thank you for letting me know. We will practice at home.', time: '9:14 AM' },
    ],
  },
  {
    id: 'c2', name: 'Mr. James Otieno', role: 'Parent — Brian Otieno (Gr 5 Blue)', subject: 'Brian\'s Homework Submissions',
    avatar: 'J', unread: 0, lastMessage: 'Understood. I will ensure he completes all pending assignments this weekend.', lastTime: 'Yesterday',
    messages: [
      { id: 'm1', from: 'teacher', text: 'Dear Mr. Otieno, I am reaching out as Brian has missed 3 homework submissions this term. His average is currently 38% which puts him at risk. I would like to arrange a brief meeting if possible.', time: 'Fri 2:30 PM' },
      { id: 'm2', from: 'parent',  text: 'Thank you for the update Mrs. Wanjiku. I was not aware. Brian told me he had been submitting his work. I apologise for this.', time: 'Fri 3:15 PM' },
      { id: 'm3', from: 'teacher', text: 'No need to apologise. The important thing is we address it now. I will list all missing assignments and send them to you today. A parent-teacher meeting next Tuesday at 4 PM would be helpful.', time: 'Fri 3:20 PM' },
      { id: 'm4', from: 'parent',  text: 'Understood. I will ensure he completes all pending assignments this weekend.', time: 'Fri 4:01 PM' },
    ],
  },
  {
    id: 'c3', name: 'Admin Office', role: 'School Administration', subject: 'Scheme of Work Deadline',
    avatar: 'A', unread: 1, lastMessage: 'Please ensure submission by COB Friday 30 May.', lastTime: 'Yesterday',
    messages: [
      { id: 'm1', from: 'parent',  text: 'Dear Mrs. Wanjiku, this is a reminder that Term 2 Schemes of Work are due by COB Friday 30 May. Please submit soft and hard copies to the Academics Office.', time: 'Yesterday 8:00 AM' },
      { id: 'm2', from: 'teacher', text: 'Noted, thank you. I will have mine ready by Thursday.', time: 'Yesterday 9:30 AM' },
      { id: 'm3', from: 'parent',  text: 'Please ensure submission by COB Friday 30 May.', time: 'Yesterday 10:00 AM' },
    ],
  },
  {
    id: 'c4', name: 'Mrs. Wambua', role: 'Parent — Esther Wambua (Gr 4 Red)', subject: 'General Enquiry',
    avatar: 'W', unread: 0, lastMessage: 'Thank you Mrs. Wanjiku! We are very proud of Esther.', lastTime: '2 days ago',
    messages: [
      { id: 'm1', from: 'parent',  text: 'Good morning. I wanted to ask how Esther is doing in class. She seems to enjoy maths this term.', time: 'Mon 8:45 AM' },
      { id: 'm2', from: 'teacher', text: 'Good morning Mrs. Wambua! Esther is doing wonderfully. She scored 87% in the last CAT and is one of the top students in Grade 4 Red. Her participation in class is excellent. You should be very proud!', time: 'Mon 10:00 AM' },
      { id: 'm3', from: 'parent',  text: 'Thank you Mrs. Wanjiku! We are very proud of Esther.', time: 'Mon 11:15 AM' },
    ],
  },
  {
    id: 'c5', name: 'Mr. Hassan', role: 'Parent — Amina Said (Gr 6 Silver)', subject: 'Attendance Concern',
    avatar: 'H', unread: 0, lastMessage: 'We will bring a medical note on Monday.', lastTime: '3 days ago',
    messages: [
      { id: 'm1', from: 'teacher', text: 'Dear Mr. Hassan, I am concerned about Amina\'s attendance. She has missed 14 days this term and her attendance rate is currently 61%. This is significantly below the school\'s minimum requirement of 80%. Could we discuss this?', time: 'Thu 11:00 AM' },
      { id: 'm2', from: 'parent',  text: 'Apologies Mrs. Wanjiku. Amina had a prolonged illness but she is now recovered. We should have informed the school sooner.', time: 'Thu 2:30 PM' },
      { id: 'm3', from: 'teacher', text: 'Thank you for letting me know. Could you provide a medical note to the school office? This will help regularise her absence record.', time: 'Thu 2:45 PM' },
      { id: 'm4', from: 'parent',  text: 'We will bring a medical note on Monday.', time: 'Thu 3:00 PM' },
    ],
  },
]

const TEMPLATES = [
  'Your child was absent today. Please provide a reason or medical note.',
  'I am pleased to inform you that your child\'s performance has improved significantly this term.',
  'Your child has outstanding homework submissions. Please follow up at home.',
  'We would like to schedule a parent-teacher meeting. Please let me know your availability.',
  'Your child\'s attendance this term is below the required 80%. Please advise on the reason.',
]

export function TeacherMessages() {
  const { showToast } = useToast()
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS)
  const [selectedId, setSelectedId]       = useState<string | null>('c1')
  const [text, setText]                   = useState('')
  const [search, setSearch]               = useState('')
  const [showTemplates, setShowTemplates] = useState(false)
  const [showCompose, setShowCompose]     = useState(false)
  const [mobileView, setMobileView]       = useState<'list' | 'thread'>('list')
  const endRef = useRef<HTMLDivElement>(null)

  const selected = conversations.find(c => c.id === selectedId)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [selectedId, conversations])

  const filtered = conversations.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.subject.toLowerCase().includes(search.toLowerCase())
  )

  const totalUnread = conversations.reduce((a, c) => a + c.unread, 0)

  function selectConv(id: string) {
    setSelectedId(id)
    setMobileView('thread')
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c))
  }

  function sendMessage() {
    if (!text.trim() || !selectedId) return
    const msg: Message = { id: `m${Date.now()}`, from: 'teacher', text: text.trim(), time: new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }) }
    setConversations(prev => prev.map(c => c.id === selectedId
      ? { ...c, messages: [...c.messages, msg], lastMessage: text.trim(), lastTime: 'Just now' }
      : c
    ))
    setText('')
    showToast('Message sent', 'success')
  }

  function useTemplate(t: string) {
    setText(t)
    setShowTemplates(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            Messages
            {totalUnread > 0 && <span className="text-sm font-normal bg-red-500 text-white px-2 py-0.5 rounded-full">{totalUnread} new</span>}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Communicate with parents and school administration</p>
        </div>
        <button
          onClick={() => setShowCompose(s => !s)}
          className="flex items-center gap-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> New Message
        </button>
      </div>

      {showCompose && (
        <GlassCard className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" /> Compose New Message
          </h3>
          <div className="space-y-3">
            <div>
              <label className="label">To (parent name or broadcast)</label>
              <input type="text" className="field" placeholder="e.g. Mrs. Mwangi or 'All Grade 5 Gold parents'" />
            </div>
            <div>
              <label className="label">Subject</label>
              <input type="text" className="field" placeholder="e.g. CAT 2 Results" />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea rows={3} className="field resize-none" placeholder="Write your message…" />
            </div>
            <div className="flex gap-2">
              <button className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors" onClick={() => { setShowCompose(false); showToast('Message sent', 'success') }}>Send</button>
              <button className="text-sm text-gray-500 hover:underline" onClick={() => setShowCompose(false)}>Cancel</button>
            </div>
          </div>
        </GlassCard>
      )}

      <div className="flex h-[600px] border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
        {/* Sidebar */}
        <div className={`flex flex-col border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 ${mobileView === 'thread' ? 'hidden sm:flex' : 'flex'} w-full sm:w-72 shrink-0`}>
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search…" className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-gray-700 dark:text-white" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map(c => (
              <button
                key={c.id}
                onClick={() => selectConv(c.id)}
                className={`w-full flex items-start gap-3 p-4 text-left border-b border-gray-100 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-700 transition-colors ${selectedId === c.id ? 'bg-white dark:bg-gray-700' : ''}`}
              >
                <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold text-white shrink-0">{c.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm truncate ${c.unread ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>{c.name}</p>
                    <p className="text-xs text-gray-400 shrink-0 ml-2">{c.lastTime}</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{c.subject}</p>
                  <p className="text-xs text-gray-400 truncate">{c.lastMessage}</p>
                </div>
                {c.unread > 0 && <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center shrink-0 font-bold">{c.unread}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Thread */}
        <div className={`flex-1 flex flex-col ${mobileView === 'list' ? 'hidden sm:flex' : 'flex'}`}>
          {selected ? (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                <button className="sm:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setMobileView('list')}>
                  <ChevronLeft className="w-5 h-5 text-gray-500" />
                </button>
                <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold text-white shrink-0">{selected.avatar}</div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{selected.name}</p>
                  <p className="text-xs text-gray-500">{selected.role}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selected.messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.from === 'teacher' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${msg.from === 'teacher' ? 'bg-emerald-600 text-white rounded-tr-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-tl-sm'}`}>
                      <p className="leading-relaxed">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.from === 'teacher' ? 'text-emerald-200' : 'text-gray-400'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>

              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                {showTemplates && (
                  <div className="mb-2 space-y-1">
                    {TEMPLATES.map((t, i) => (
                      <button key={i} onClick={() => useTemplate(t)} className="w-full text-left text-xs px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-700 dark:text-gray-300 transition-colors border border-gray-100 dark:border-gray-700">
                        {t}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowTemplates(s => !s)}
                    className="text-xs px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
                  >
                    Templates
                  </button>
                  <input
                    type="text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Type a message…"
                    className="flex-1 px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!text.trim()}
                    className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-xl transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Select a conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
