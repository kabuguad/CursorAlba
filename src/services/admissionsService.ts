import apiClient from '../lib/axios'

// ── Status ────────────────────────────────────────────────────────────────────
// API returns  status as a string label ("Pending" | "Reviewing" | …)
// API receives status as an integer in PATCH body (0 | 1 | 2 | 3)

export type ApplicationStatusLabel = 'Pending' | 'Reviewing' | 'Approved' | 'Rejected'
export type ApplicationStatusInt   = 0 | 1 | 2 | 3

export const APPLICATION_STATUS_LABELS: ApplicationStatusLabel[] = [
  'Pending', 'Reviewing', 'Approved', 'Rejected',
]

export const STATUS_LABEL_TO_INT: Record<ApplicationStatusLabel, ApplicationStatusInt> = {
  Pending: 0, Reviewing: 1, Approved: 2, Rejected: 3,
}

// ── Entity interfaces ────────────────────────────────────────────────────────

/**
 * Matches ApplicationSummaryDto — returned by GET /admissions/applications.
 * Intentionally omits document payloads; use documentCount for the count.
 */
export interface AdmissionSummary {
  id: number
  referenceNumber: string
  /** Server combines childFirstName + " " + childLastName */
  childFullName: string
  applyingForGrade: string
  parentEmail: string
  parentPhone: string
  status: ApplicationStatusLabel
  documentCount: number
  submittedAt: string
}

/**
 * Matches DocumentResponseDto — nested inside AdmissionDetail.
 */
export interface AdmissionDocument {
  id: number
  documentType: string
  originalFileName: string
  contentType: string
  fileSizeBytes: number
  /** Relative URL: /api/admissions/applications/{appId}/documents/{docId} */
  downloadUrl: string
  uploadedAt: string
}

/**
 * Matches ApplicationResponseDto — returned by GET /admissions/applications/{id}.
 * Includes the full Documents collection (eager-loaded by EF Core).
 */
export interface AdmissionDetail {
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
  status: ApplicationStatusLabel
  /** Maps to AdminNotes on the server DTO */
  adminNotes?: string | null
  submittedAt: string
  reviewedAt?: string | null
  reviewedBy?: string | null
  documents: AdmissionDocument[]
}

// ── Request DTOs ─────────────────────────────────────────────────────────────

export interface AdmissionApplicationCreateDto {
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
  /** Integer enum: 0=Pending 1=Reviewing 2=Approved 3=Rejected */
  status: ApplicationStatusInt
  notes?: string | null
  reviewedBy?: string | null
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function normaliseDetail(data: AdmissionDetail): AdmissionDetail {
  return { ...data, documents: Array.isArray(data.documents) ? data.documents : [] }
}

// ── Service ───────────────────────────────────────────────────────────────────
// axios baseURL is already /api — paths start with /admissions/…

export const admissionsService = {
  // ── Applications ───────────────────────────────────────────────────────────

  list: async (): Promise<AdmissionSummary[]> => {
    const { data } = await apiClient.get<
      AdmissionSummary[] | { items?: AdmissionSummary[]; data?: AdmissionSummary[] } | null
    >('/admissions/applications')
    if (Array.isArray(data)) return data
    if (data && Array.isArray((data as { items?: AdmissionSummary[] }).items))
      return (data as { items: AdmissionSummary[] }).items
    if (data && Array.isArray((data as { data?: AdmissionSummary[] }).data))
      return (data as { data: AdmissionSummary[] }).data
    return []
  },

  getById: async (id: number): Promise<AdmissionDetail> => {
    const { data } = await apiClient.get<AdmissionDetail>(`/admissions/applications/${id}`)
    return normaliseDetail(data)
  },

  getByReference: async (referenceNumber: string): Promise<AdmissionDetail> => {
    const { data } = await apiClient.get<AdmissionDetail>(
      `/admissions/applications/reference/${encodeURIComponent(referenceNumber)}`,
    )
    return normaliseDetail(data)
  },

  create: async (dto: AdmissionApplicationCreateDto): Promise<AdmissionDetail> => {
    const { data } = await apiClient.post<AdmissionDetail>('/admissions/applications', dto)
    return normaliseDetail(data)
  },

  update: async (id: number, dto: AdmissionApplicationUpdateDto): Promise<AdmissionDetail> => {
    const { data } = await apiClient.put<AdmissionDetail>(`/admissions/applications/${id}`, dto)
    return normaliseDetail(data)
  },

  updateStatus: async (id: number, dto: AdmissionStatusUpdateDto): Promise<AdmissionDetail> => {
    const { data } = await apiClient.patch<AdmissionDetail>(
      `/admissions/applications/${id}/status`,
      dto,
    )
    return normaliseDetail(data)
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/admissions/applications/${id}`)
  },

  // ── Documents ─────────────────────────────────────────────────────────────

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
