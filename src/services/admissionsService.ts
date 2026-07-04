import apiClient from '../lib/axios'

// ── Status enum ──────────────────────────────────────────────────────────────
// API stores status as integer: 0=Pending, 1=Reviewing, 2=Approved, 3=Rejected
export const APPLICATION_STATUS_MAP = {
  0: 'Pending',
  1: 'Reviewing',
  2: 'Approved',
  3: 'Rejected',
} as const

export type ApplicationStatusInt = 0 | 1 | 2 | 3
export type ApplicationStatusLabel = 'Pending' | 'Reviewing' | 'Approved' | 'Rejected'

export const STATUS_LABEL_TO_INT: Record<ApplicationStatusLabel, ApplicationStatusInt> = {
  Pending: 0, Reviewing: 1, Approved: 2, Rejected: 3,
}

// ── Entity interfaces ────────────────────────────────────────────────────────
export interface AdmissionApplication {
  id: number
  referenceNumber: string
  childFirstName: string
  childLastName: string
  dateOfBirth: string
  applyingForGrade: string
  previousSchool?: string | null
  parentFirstName: string
  parentLastName: string
  parentEmail: string
  parentPhone: string
  parentIdNumber?: string | null
  parentRelationship?: string | null
  status: ApplicationStatusInt
  notes?: string | null
  reviewedBy?: string | null
  submittedAt: string
  reviewedAt?: string | null
}

export interface AdmissionDocument {
  id: number
  applicationId: number
  documentType: string
  fileName: string
  fileUrl: string
  uploadedAt: string
}

// ── DTOs ─────────────────────────────────────────────────────────────────────
export interface AdmissionApplicationCreateDto {
  childFirstName: string
  childLastName: string
  dateOfBirth: string          // ISO date string e.g. "2018-05-12"
  applyingForGrade: string
  previousSchool?: string | null
  parentFirstName: string
  parentLastName: string
  parentEmail: string
  parentPhone: string
  parentIdNumber?: string | null
  parentRelationship?: string | null
}

export interface AdmissionApplicationUpdateDto {
  parentFirstName: string
  parentLastName: string
  parentEmail: string
  parentPhone: string
  parentIdNumber?: string | null
  parentRelationship?: string | null
}

export interface AdmissionStatusUpdateDto {
  status: ApplicationStatusInt
  notes?: string | null
  reviewedBy?: string | null
}

// ── Service ───────────────────────────────────────────────────────────────────
// Base path prefix: `/api` is already set in apiClient.baseURL,
// so paths here start with /admissions/...
export const admissionsService = {
  // ── Applications ───────────────────────────────────────────────────────────
  list: async (): Promise<AdmissionApplication[]> => {
    const { data } = await apiClient.get<AdmissionApplication[] | { items?: AdmissionApplication[]; data?: AdmissionApplication[] } | null>('/admissions/applications')
    if (Array.isArray(data)) return data
    if (data && Array.isArray((data as { items?: AdmissionApplication[] }).items)) return (data as { items: AdmissionApplication[] }).items
    if (data && Array.isArray((data as { data?: AdmissionApplication[] }).data)) return (data as { data: AdmissionApplication[] }).data
    return []
  },

  getById: async (id: number): Promise<AdmissionApplication> => {
    const { data } = await apiClient.get<AdmissionApplication>(`/admissions/applications/${id}`)
    return data
  },

  getByReference: async (referenceNumber: string): Promise<AdmissionApplication> => {
    const { data } = await apiClient.get<AdmissionApplication>(
      `/admissions/applications/reference/${encodeURIComponent(referenceNumber)}`,
    )
    return data
  },

  create: async (dto: AdmissionApplicationCreateDto): Promise<AdmissionApplication> => {
    const { data } = await apiClient.post<AdmissionApplication>('/admissions/applications', dto)
    return data
  },

  update: async (id: number, dto: AdmissionApplicationUpdateDto): Promise<AdmissionApplication> => {
    const { data } = await apiClient.put<AdmissionApplication>(`/admissions/applications/${id}`, dto)
    return data
  },

  updateStatus: async (id: number, dto: AdmissionStatusUpdateDto): Promise<AdmissionApplication> => {
    const { data } = await apiClient.patch<AdmissionApplication>(
      `/admissions/applications/${id}/status`,
      dto,
    )
    return data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/admissions/applications/${id}`)
  },

  // ── Documents ─────────────────────────────────────────────────────────────
  getDocuments: async (applicationId: number): Promise<AdmissionDocument[]> => {
    const { data } = await apiClient.get<AdmissionDocument[]>(
      `/admissions/applications/${applicationId}/documents`,
    )
    return data
  },

  uploadDocument: async (
    applicationId: number,
    documentType: string,
    file: File,
  ): Promise<AdmissionDocument> => {
    const form = new FormData()
    form.append('DocumentType', documentType)
    form.append('File', file)
    const { data } = await apiClient.post<AdmissionDocument>(
      `/admissions/applications/${applicationId}/documents`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    return data
  },

  deleteDocument: async (applicationId: number, documentId: number): Promise<void> => {
    await apiClient.delete(
      `/admissions/applications/${applicationId}/documents/${documentId}`,
    )
  },
}
