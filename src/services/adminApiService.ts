import apiClient from '../lib/axios'

export interface ApiBlogPost {
  id: number
  title: string
  slug: string
  content: string
  summary: string | null
  coverImageUrl: string | null
  authorId: string | null
  isPublished: boolean
  publishedAt: string | null
  viewCount: number
  createdAt: string
}

export interface ApiEvent {
  id: number
  title: string
  description: string | null
  startDate: string
  endDate: string
  location: string | null
  imageUrl: string | null
  isPublished: boolean
  eventType: string | null
  isPast: boolean
}

export interface ApiGalleryImage {
  id: number
  url: string
  caption: string | null
  category: string | null
  sortOrder: number
  isPublic: boolean
  createdAt: string
}

export interface ApiApplication {
  id: string
  childFirstName: string
  childLastName: string
  dob: string
  gender: string
  applyingForGrade: string
  applyingForClassId: number | null
  previousSchool: string | null
  parentFirstName: string
  parentLastName: string
  parentEmail: string
  parentPhone: string
  parentRelationship: string
  address: string
  documents: string[]
  status: string
  notes: string
  submittedDate: string
  assignedTo: string | null
  reviewedAt: string | null
}

export interface ApiStaffMember {
  id: string
  userId: number
  firstName: string
  lastName: string
  email: string
  qualification: string | null
  specialization: string | null
  hireDate: string | null
  role: string
  status: string
}

export interface ApiStudent {
  id: string
  userId: number
  firstName: string
  lastName: string
  email: string
  classId: number
  className: string
  classSection: string
  parentId: number | null
  parentName: string
  dateOfBirth: string | null
  gender: string | null
  address: string | null
}

export interface ApiClass {
  id: number
  name: string
  section: string | null
  fullName: string
  description: string | null
  studentCount: number
}

export interface ApiSubject {
  id: number
  name: string
  code: string | null
  classId: number
  className: string
  classSection: string
}

export interface ApiFeeStructure {
  id: number
  name: string
  amount: number
  term: string | null
  academicYear: string | null
  classId: number
  className: string
  feeType: string | null
  dueDate: string
  status: string
}

const blog = {
  getAll: () => apiClient.get<ApiBlogPost[]>('/admin/blog').then(r => r.data),
  getById: (id: number) => apiClient.get<ApiBlogPost>(`/admin/blog/${id}`).then(r => r.data),
  create: (dto: { title: string; content: string; summary?: string; coverImageUrl?: string; author?: string; isPublished: boolean; category?: string }) =>
    apiClient.post<ApiBlogPost>('/admin/blog', dto).then(r => r.data),
  update: (id: number, dto: { title: string; content: string; summary?: string; coverImageUrl?: string; author?: string; isPublished: boolean; category?: string }) =>
    apiClient.put(`/admin/blog/${id}`, dto).then(r => r.data),
  delete: (id: number) => apiClient.delete(`/admin/blog/${id}`).then(r => r.data),
  togglePublish: (id: number) => apiClient.post<{ isPublished: boolean }>(`/admin/blog/${id}/publish`).then(r => r.data),
}

const events = {
  getAll: () => apiClient.get<ApiEvent[]>('/admin/events').then(r => r.data),
  create: (dto: { title: string; description?: string; startDate: string; endDate?: string; location?: string; imageUrl?: string; isPublished: boolean; eventType?: string }) =>
    apiClient.post<ApiEvent>('/admin/events', dto).then(r => r.data),
  update: (id: number, dto: { title: string; description?: string; startDate: string; endDate?: string; location?: string; imageUrl?: string; isPublished: boolean; eventType?: string }) =>
    apiClient.put(`/admin/events/${id}`, dto).then(r => r.data),
  delete: (id: number) => apiClient.delete(`/admin/events/${id}`).then(r => r.data),
}

const gallery = {
  getAll: () => apiClient.get<ApiGalleryImage[]>('/admin/gallery').then(r => r.data),
  add: (dto: { url: string; caption?: string; category?: string; sortOrder?: number; isPublic?: boolean }) =>
    apiClient.post<ApiGalleryImage>('/admin/gallery', dto).then(r => r.data),
  update: (id: number, dto: { url: string; caption?: string; category?: string; sortOrder?: number; isPublic?: boolean }) =>
    apiClient.put(`/admin/gallery/${id}`, dto).then(r => r.data),
  delete: (id: number) => apiClient.delete(`/admin/gallery/${id}`).then(r => r.data),
}

const upload = {
  uploadFile: async (file: File, folder?: string): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    const params = folder ? `?folder=${folder}` : ''
    const r = await apiClient.post<{ url: string }>(`/admin/upload${params}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return r.data.url
  },
  deleteFile: (fileUrl: string) =>
    apiClient.delete(`/admin/upload?fileUrl=${encodeURIComponent(fileUrl)}`).then(r => r.data),
}

const admissions = {
  getAll: () => apiClient.get<ApiApplication[]>('/admin/admissions').then(r => r.data),
  getStats: () => apiClient.get<{ total: number; pending: number; reviewing: number; approved: number; rejected: number }>('/admin/admissions/stats').then(r => r.data),
  updateStatus: (id: string, status: string, notes?: string) =>
    apiClient.patch<ApiApplication>(`/admin/admissions/${id}/status`, { status: capitalize(status), notes }).then(r => r.data),
  delete: (id: string) => apiClient.delete(`/admin/admissions/${id}`).then(r => r.data),
}

const staff = {
  getAll: () => apiClient.get<ApiStaffMember[]>('/admin/staff').then(r => r.data),
  create: (dto: { firstName: string; lastName: string; email: string; password: string; qualification?: string; specialization?: string; hireDate?: string }) =>
    apiClient.post<ApiStaffMember>('/admin/staff', dto).then(r => r.data),
  update: (id: string, dto: { firstName: string; lastName: string; email: string; qualification?: string; specialization?: string; hireDate?: string }) =>
    apiClient.put(`/admin/staff/${id}`, dto).then(r => r.data),
  delete: (id: string) => apiClient.delete(`/admin/staff/${id}`).then(r => r.data),
}

const students = {
  getAll: () => apiClient.get<ApiStudent[]>('/admin/students').then(r => r.data),
  create: (dto: { firstName: string; lastName: string; email: string; password: string; classId: number; parentId?: number; dateOfBirth?: string; gender?: string; address?: string }) =>
    apiClient.post<ApiStudent>('/admin/students', dto).then(r => r.data),
  update: (id: string, dto: { firstName: string; lastName: string; email: string; classId: number; parentId?: number; dateOfBirth?: string; gender?: string; address?: string }) =>
    apiClient.put(`/admin/students/${id}`, dto).then(r => r.data),
  delete: (id: string) => apiClient.delete(`/admin/students/${id}`).then(r => r.data),
}

const classes = {
  getAll: () => apiClient.get<ApiClass[]>('/admin/classes').then(r => r.data),
  create: (dto: { name: string; section?: string; description?: string }) =>
    apiClient.post<ApiClass>('/admin/classes', dto).then(r => r.data),
  update: (id: number, dto: { name: string; section?: string; description?: string }) =>
    apiClient.put(`/admin/classes/${id}`, dto).then(r => r.data),
  delete: (id: number) => apiClient.delete(`/admin/classes/${id}`).then(r => r.data),
}

const subjects = {
  getAll: (classId?: number) => {
    const params = classId ? `?classId=${classId}` : ''
    return apiClient.get<ApiSubject[]>(`/admin/subjects${params}`).then(r => r.data)
  },
  create: (dto: { name: string; code: string; classId: number }) =>
    apiClient.post<ApiSubject>('/admin/subjects', dto).then(r => r.data),
  update: (id: number, dto: { name: string; code: string; classId: number }) =>
    apiClient.put(`/admin/subjects/${id}`, dto).then(r => r.data),
  delete: (id: number) => apiClient.delete(`/admin/subjects/${id}`).then(r => r.data),
}

const fees = {
  getAll: () => apiClient.get<ApiFeeStructure[]>('/admin/fees').then(r => r.data),
  create: (dto: { name: string; amount: number; term?: string; academicYear?: string; classId: number; feeType?: string; dueDate: string }) =>
    apiClient.post<ApiFeeStructure>('/admin/fees', dto).then(r => r.data),
  update: (id: number, dto: { name: string; amount: number; term?: string; academicYear?: string; classId: number; feeType?: string; dueDate: string }) =>
    apiClient.put(`/admin/fees/${id}`, dto).then(r => r.data),
  delete: (id: number) => apiClient.delete(`/admin/fees/${id}`).then(r => r.data),
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

export const adminApi = { blog, events, gallery, upload, admissions, staff, students, classes, subjects, fees }
