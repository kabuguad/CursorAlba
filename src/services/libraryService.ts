import { apiClient } from './apiClient'

export const libraryService = {
  listBooks: (query?: string) =>
    apiClient.get('/admin/library/books', { params: { q: query } }).then(r => r.data),

  createBook: (dto: any) =>
    apiClient.post('/admin/library/books', dto).then(r => r.data),

  updateBook: (id: number, dto: any) =>
    apiClient.put(`/admin/library/books/${id}`, dto).then(r => r.data),

  deleteBook: (id: number) =>
    apiClient.delete(`/admin/library/books/${id}`).then(r => r.data),

  listBorrowings: () =>
    apiClient.get('/admin/library/borrowings').then(r => r.data),

  issueBook: (dto: any) =>
    apiClient.post('/admin/library/borrowings/issue', dto).then(r => r.data),

  returnBook: (id: number) =>
    apiClient.patch(`/admin/library/borrowings/${id}/return`).then(r => r.data),

  getStats: () =>
    apiClient.get('/admin/library/stats').then(r => r.data),
}
