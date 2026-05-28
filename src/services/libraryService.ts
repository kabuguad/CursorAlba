import { mockGet, mockPost, mockPut, mockDelete, newId } from './mockApi'
import { getDB, mutateDB } from './db'
import type { Book, Borrowing } from './db'
import { addAudit } from './auditService'

export type { Book, Borrowing }

function getDueDateStr(days = 14): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export const libraryService = {
  listBooks: () => mockGet(() => {
    const db = getDB()
    return db.books.map(b => {
      const activeBorrowings = db.borrowings.filter(bor => bor.bookId === b.id && bor.status !== 'returned')
      return { ...b, availableCopies: b.totalCopies - activeBorrowings.length }
    })
  }),

  createBook: (data: Omit<Book, 'id' | 'availableCopies' | 'status'>) => mockPost(() => {
    const book: Book = { id: newId('BK'), ...data, availableCopies: data.totalCopies, status: 'available' }
    mutateDB(db => { db.books.push(book) })
    addAudit({ action: 'CREATE', resource: 'Book', resourceId: book.id, details: `Added: ${book.title}` })
    return book
  }),

  updateBook: (id: string, data: Partial<Book>) => mockPut(() => {
    let updated: Book | undefined
    mutateDB(db => {
      const idx = db.books.findIndex(b => b.id === id)
      if (idx < 0) throw new Error('Book not found')
      db.books[idx] = { ...db.books[idx], ...data }
      updated = db.books[idx]
    })
    return updated!
  }),

  deleteBook: (id: string) => mockDelete(() => {
    mutateDB(db => { db.books = db.books.filter(b => b.id !== id) })
    addAudit({ action: 'DELETE', resource: 'Book', resourceId: id, details: 'Book removed from catalogue' })
  }),

  listBorrowings: () => mockGet(() => {
    const today = new Date().toISOString().slice(0, 10)
    return getDB().borrowings.map(b => ({
      ...b,
      status: b.returnedDate ? 'returned' : (b.dueDate < today ? 'overdue' : 'active'),
    })).sort((a, b) => b.issuedDate.localeCompare(a.issuedDate)) as Borrowing[]
  }),

  issueBorrowing: (bookId: string, borrowerId: string, borrowerName: string, borrowerType: Borrowing['borrowerType'], days = 14) => mockPost(() => {
    const db = getDB()
    const book = db.books.find(b => b.id === bookId)
    if (!book) throw new Error('Book not found')
    const active = db.borrowings.filter(b => b.bookId === bookId && !b.returnedDate).length
    if (active >= book.totalCopies) throw new Error('All copies are currently borrowed')
    const bor: Borrowing = {
      id: newId('BOR'),
      bookId,
      bookTitle: book.title,
      borrowerId,
      borrowerName,
      borrowerType,
      issuedDate: new Date().toISOString().slice(0, 10),
      dueDate: getDueDateStr(days),
      returnedDate: null,
      status: 'active',
    }
    mutateDB(db => { db.borrowings.push(bor) })
    addAudit({ action: 'CREATE', resource: 'Borrowing', resourceId: bor.id, details: `${borrowerName} borrowed: ${book.title}` })
    return bor
  }),

  returnBook: (borrowingId: string) => mockPut(() => {
    mutateDB(db => {
      const b = db.borrowings.find(x => x.id === borrowingId)
      if (!b) throw new Error('Borrowing not found')
      b.returnedDate = new Date().toISOString().slice(0, 10)
      b.status = 'returned'
    })
    const b = getDB().borrowings.find(x => x.id === borrowingId)!
    addAudit({ action: 'UPDATE', resource: 'Borrowing', resourceId: borrowingId, details: `Returned: ${b.bookTitle} by ${b.borrowerName}` })
    return b
  }),

  getStats: () => mockGet(() => {
    const db = getDB()
    const today = new Date().toISOString().slice(0, 10)
    const active = db.borrowings.filter(b => !b.returnedDate)
    return {
      totalBooks: db.books.length,
      totalCopies: db.books.reduce((s, b) => s + b.totalCopies, 0),
      activeBorrowings: active.length,
      overdueBorrowings: active.filter(b => b.dueDate < today).length,
      returnedThisMonth: db.borrowings.filter(b => b.returnedDate && b.returnedDate >= today.slice(0, 7)).length,
    }
  }),
}
