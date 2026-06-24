import { useState } from 'react'
import { createPortal } from 'react-dom'
import { BookOpen, Plus, Search, Loader2, X, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { useBooks, useBorrowings, useLibraryStats, useCreateBook, useDeleteBook, useIssueBorrowing, useReturnBook, useStudents, useStaff } from '../../../hooks/useAdminData'
import { useToast } from '../../../contexts/ToastContext'
import type { Book } from '../../../services/libraryService'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'

const BORROW_STATUS = {
  active:   { label: 'Active',   cls: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',     icon: Clock },
  overdue:  { label: 'Overdue',  cls: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',         icon: AlertCircle },
  returned: { label: 'Returned', cls: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
}

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

const BLANK_BOOK: Omit<Book, 'id' | 'availableCopies' | 'status'> = { isbn: '', title: '', author: '', category: 'Textbook', publisher: '', year: new Date().getFullYear(), totalCopies: 1, location: '' }

export function LibraryManager() {
  const { showToast } = useToast()
  const { data: books = [], isLoading: booksLoading } = useBooks()
  const { data: borrowings = [] } = useBorrowings()
  const { data: stats } = useLibraryStats()
  const { data: students = [] } = useStudents()
  const { data: staff = [] } = useStaff()
  const createBook = useCreateBook()
  const deleteBook = useDeleteBook()
  const issueBorrowing = useIssueBorrowing()
  const returnBook = useReturnBook()

  const [tab, setTab] = useState<'catalogue' | 'borrowings'>('catalogue')
  const [search, setSearch] = useState('')
  const [bookForm, setBookForm] = useState(false)
  const [issueForm, setIssueForm] = useState<Book | null>(null)
  const [bookDraft, setBookDraft] = useState(BLANK_BOOK)
  const [issueDraft, setIssueDraft] = useState({ borrowerType: 'student' as 'student' | 'staff', borrowerId: '', days: 14 })
  const [delConfirm, setDelConfirm] = useState<string | null>(null)
  const [borrowingFilter, setBorrowingFilter] = useState<'all' | 'active' | 'overdue' | 'returned'>('all')

  const filteredBooks = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    b.isbn.toLowerCase().includes(search.toLowerCase())
  )

  const filteredBorrowings = borrowings.filter(b => borrowingFilter === 'all' || b.status === borrowingFilter)
  const today = new Date().toISOString().slice(0, 10)

  const saveBook = async () => {
    try {
      await createBook.mutateAsync(bookDraft)
      showToast('Book added to catalogue ✓'); setBookForm(false)
    } catch (e) { showToast((e as Error).message) }
  }

  const handleIssue = async () => {
    if (!issueForm) return
    const borrowerName = issueDraft.borrowerType === 'student'
      ? (students.find(s => s.id === issueDraft.borrowerId)?.fullName ?? 'Unknown')
      : (staff.find(s => s.id === issueDraft.borrowerId)?.firstName + ' ' + staff.find(s => s.id === issueDraft.borrowerId)?.lastName)
    try {
      await issueBorrowing.mutateAsync({ bookId: issueForm.id, borrowerId: issueDraft.borrowerId, borrowerName: borrowerName ?? 'Unknown', borrowerType: issueDraft.borrowerType, days: issueDraft.days })
      showToast('Book issued ✓'); setIssueForm(null)
    } catch (e) { showToast((e as Error).message) }
  }

  const handleReturn = async (id: string) => {
    await returnBook.mutateAsync(id)
    showToast('Book returned ✓')
  }

  const CATEGORIES = ['Textbook', 'Revision', 'Literature', 'Reference', 'Fiction', 'Non-Fiction', 'Journal']

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Library Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Book catalogue, borrowings, and returns</p>
        </div>
        {tab === 'catalogue' && (
          <button onClick={() => { setBookDraft(BLANK_BOOK); setBookForm(true) }} className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2.5 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a]">
            <Plus className="h-4 w-4" /> Add Book
          </button>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          {[
            { label: 'Total Books', value: stats.totalBooks, cls: 'text-gray-900 dark:text-white' },
            { label: 'Total Copies', value: stats.totalCopies, cls: 'text-blue-600 dark:text-blue-400' },
            { label: 'Active Borrowings', value: stats.activeBorrowings, cls: 'text-yellow-600 dark:text-yellow-400' },
            { label: 'Overdue', value: stats.overdueBorrowings, cls: 'text-red-600 dark:text-red-400' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{s.label}</p>
              <p className={`mt-1 text-2xl font-bold ${s.cls}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex gap-1 border-b border-gray-200 dark:border-gray-700">
        {(['catalogue', 'borrowings'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition border-b-2 -mb-px ${tab === t ? 'border-[#E8B84B] text-[#E8B84B]' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Catalogue */}
      {tab === 'catalogue' && (
        <>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input className={`${INP} pl-9`} placeholder="Search by title, author, or ISBN…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {booksLoading ? <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-gray-400" /></div> : (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-sm">
                  <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                    <tr>{['Title', 'Author', 'Category', 'ISBN', 'Location', 'Copies', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                    {filteredBooks.map(b => (
                      <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-[#E8B84B] shrink-0" />
                            <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{b.title}</p>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{b.author}</td>
                        <td className="px-5 py-3.5"><span className="rounded-full bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">{b.category}</span></td>
                        <td className="px-5 py-3.5 font-mono text-xs text-gray-400">{b.isbn}</td>
                        <td className="px-5 py-3.5 text-xs text-gray-400">{b.location}</td>
                        <td className="px-5 py-3.5">
                          <span className={`font-semibold ${b.availableCopies === 0 ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>{b.availableCopies}</span>
                          <span className="text-gray-400 text-xs">/{b.totalCopies}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex gap-1">
                            <button onClick={() => { setIssueForm(b); setIssueDraft({ borrowerType: 'student', borrowerId: '', days: 14 }) }}
                              disabled={b.availableCopies === 0}
                              className="rounded-lg p-1.5 text-gray-400 hover:bg-green-50 hover:text-green-600 disabled:opacity-40 disabled:cursor-not-allowed" title="Issue book">
                              <Plus className="h-4 w-4" />
                            </button>
                            <button onClick={() => setDelConfirm(b.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600" title="Remove">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredBooks.length === 0 && <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400">No books found</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Borrowings */}
      {tab === 'borrowings' && (
        <>
          <div className="mb-4 flex gap-2">
            {(['all', 'active', 'overdue', 'returned'] as const).map(f => (
              <button key={f} onClick={() => setBorrowingFilter(f)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition ${borrowingFilter === f ? 'bg-[#E8B84B] text-[#0d1b0d]' : 'border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                {f} ({borrowings.filter(b => f === 'all' || b.status === f).length})
              </button>
            ))}
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                  <tr>{['Book', 'Borrower', 'Type', 'Issued', 'Due', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {filteredBorrowings.map(b => {
                    const cfg = BORROW_STATUS[b.status]
                    return (
                      <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                        <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white max-w-[200px]"><p className="line-clamp-1">{b.bookTitle}</p></td>
                        <td className="px-5 py-3.5 text-gray-700 dark:text-gray-300">{b.borrowerName}</td>
                        <td className="px-5 py-3.5"><span className="capitalize text-xs text-gray-400">{b.borrowerType}</span></td>
                        <td className="px-5 py-3.5 text-xs text-gray-400">{b.issuedDate}</td>
                        <td className={`px-5 py-3.5 text-xs font-semibold ${b.dueDate < today && !b.returnedDate ? 'text-red-500' : 'text-gray-400'}`}>{b.dueDate}</td>
                        <td className="px-5 py-3.5">
                          <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold w-fit ${cfg.cls}`}>
                            <cfg.icon className="h-3 w-3" />{cfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {b.status !== 'returned' && (
                            <button onClick={() => handleReturn(b.id)} className="rounded-lg px-3 py-1 text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition">
                              Return
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                  {filteredBorrowings.length === 0 && <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400">No borrowings found</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Add book modal */}
      <Modal open={bookForm} onClose={() => setBookForm(false)} title="Add Book to Catalogue">
        <div className="space-y-4">
          <div><label className={LABEL}>Title *</label><input className={INP} value={bookDraft.title} onChange={e => setBookDraft({ ...bookDraft, title: e.target.value })} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className={LABEL}>Author</label><input className={INP} value={bookDraft.author} onChange={e => setBookDraft({ ...bookDraft, author: e.target.value })} /></div>
            <div><label className={LABEL}>ISBN</label><input className={INP} value={bookDraft.isbn} onChange={e => setBookDraft({ ...bookDraft, isbn: e.target.value })} /></div>
            <div>
              <label className={LABEL}>Category</label>
              <select className={INP} value={bookDraft.category} onChange={e => setBookDraft({ ...bookDraft, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label className={LABEL}>Publisher</label><input className={INP} value={bookDraft.publisher} onChange={e => setBookDraft({ ...bookDraft, publisher: e.target.value })} /></div>
            <div><label className={LABEL}>Year</label><input type="number" className={INP} value={bookDraft.year} onChange={e => setBookDraft({ ...bookDraft, year: +e.target.value })} /></div>
            <div><label className={LABEL}>Total Copies</label><input type="number" className={INP} value={bookDraft.totalCopies} onChange={e => setBookDraft({ ...bookDraft, totalCopies: +e.target.value })} /></div>
            <div><label className={LABEL}>Shelf Location</label><input className={INP} placeholder="e.g. Shelf A1" value={bookDraft.location} onChange={e => setBookDraft({ ...bookDraft, location: e.target.value })} /></div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setBookForm(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
            <button onClick={saveBook} disabled={!bookDraft.title} className="rounded-xl bg-[#E8B84B] px-5 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] disabled:opacity-60">Add Book</button>
          </div>
        </div>
      </Modal>

      {/* Issue book modal */}
      <Modal open={!!issueForm} onClose={() => setIssueForm(null)} title={`Issue: ${issueForm?.title}`}>
        <div className="space-y-4">
          <div>
            <label className={LABEL}>Borrower Type</label>
            <div className="flex gap-3 mt-1">
              {(['student', 'staff'] as const).map(t => (
                <button key={t} onClick={() => setIssueDraft({ ...issueDraft, borrowerType: t, borrowerId: '' })}
                  className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition ${issueDraft.borrowerType === t ? 'bg-[#E8B84B] text-[#0d1b0d]' : 'border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={LABEL}>Select {issueDraft.borrowerType}</label>
            <select className={INP} value={issueDraft.borrowerId} onChange={e => setIssueDraft({ ...issueDraft, borrowerId: e.target.value })}>
              <option value="">Choose…</option>
              {issueDraft.borrowerType === 'student'
                ? students.filter(s => s.status === 'active').map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.admNo})</option>)
                : staff.filter(s => s.status === 'active').map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
            </select>
          </div>
          <div><label className={LABEL}>Loan Period (days)</label><input type="number" className={INP} value={issueDraft.days} min={1} max={90} onChange={e => setIssueDraft({ ...issueDraft, days: +e.target.value })} /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setIssueForm(null)} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
            <button onClick={handleIssue} disabled={!issueDraft.borrowerId || issueBorrowing.isPending} className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-5 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] disabled:opacity-60">
              {issueBorrowing.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Issue Book
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!delConfirm} onClose={() => setDelConfirm(null)} title="Remove Book?">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">This will permanently remove the book from the catalogue.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDelConfirm(null)} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
          <button onClick={async () => { if (delConfirm) { await deleteBook.mutateAsync(delConfirm); setDelConfirm(null); showToast('Book removed') } }} className="rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600">Remove</button>
        </div>
      </Modal>
    </div>
  )
}
