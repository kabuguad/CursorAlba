import { apiClient } from './apiClient'

export interface Book {
  id: string
  isbn: string
  title: string
  author: string
  category: string
  publisher: string
  year: number
  totalCopies: number
  availableCopies: number
  location: string
  status: 'available' | 'all_borrowed' | 'reserved'
}

export interface Borrowing {
  id: string
  bookId: string
  bookTitle: string
  borrowerId: string
  borrowerName: string
  borrowerType: 'student' | 'staff'
  issuedDate: string
  dueDate: string
  returnedDate: string | null
  status: 'active' | 'returned' | 'overdue'
}

export interface LibraryStats {
  totalBooks: number
  totalCopies: number
  activeBorrowings: number
  overdueBorrowings: number
}

export interface IssueBorrowingDto {
  bookId: string
  borrowerId: string
  borrowerName: string
  borrowerType: 'student' | 'staff'
  days?: number
}

export const libraryService = {
  listBooks: (query?: string) =>
    apiClient.get<Book[]>('/admin/library/books', { params: { q: query } }).then(r => r.data),

  createBook: (dto: Omit<Book, 'id' | 'availableCopies' | 'status'>) =>
    apiClient.post<Book>('/admin/library/books', dto).then(r => r.data),

  updateBook: (id: string, dto: Partial<Book>) =>
    apiClient.put<Book>(`/admin/library/books/${id}`, dto).then(r => r.data),

  deleteBook: (id: string) =>
    apiClient.delete<{ deleted: boolean }>(`/admin/library/books/${id}`).then(r => r.data),

  listBorrowings: () =>
    apiClient.get<Borrowing[]>('/admin/library/borrowings').then(r => r.data),

  issueBorrowing: (dto: IssueBorrowingDto) =>
    apiClient.post<Borrowing>('/admin/library/borrowings/issue', dto).then(r => r.data),

  returnBook: (id: string) =>
    apiClient.patch<Borrowing>(`/admin/library/borrowings/${id}/return`).then(r => r.data),

  getStats: () =>
    apiClient.get<LibraryStats>('/admin/library/stats').then(r => r.data),
}
