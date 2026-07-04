import apiClient from '../lib/axios'

// ── Status ────────────────────────────────────────────────────────────────────
// API returns  status as an integer (0–3)
// API receives status as an integer in PATCH body (0 | 1 | 2 | 3)

export type ApplicationStatusLabel = 'Pending' | 'Reviewing' | 'Approved' | 'Rejected'
export type ApplicationStatusInt   = 0 | 1 | 2 | 3

export const APPLICATION_STATUS_LABELS: ApplicationStatusLabel[] = [
  'Pending', 'Reviewing', 'Approved', 'Rejected',
]

export const STATUS_INT_TO_LABEL: Record<number, ApplicationStatusLabel> = {
  0: 'Pending', 1: 'Reviewing', 2: 'Approved', 3: 'Rejected',
}

export const STATUS_LABEL_TO_INT: Record<ApplicationStatusLabel, ApplicationStatusInt> = {
  Pending: 0, Reviewing: 1, Approved: 2, Rejected: 3,
}

// ── Entity interfaces ────────────────────────────────────────────────────────

/**
 * Matches AdmissionDocument as returned by the API.
 * `id` is normalised from `admissionDocumentId`.
 */
export interface AdmissionDocument {
  id: number
  documentType: string
  originalFileName: string
  contentType: string
  fileSizeBytes: number
  /** Relative server path: /uploads/admissions/{appId}/{filename} */
  filePath: string
  uploadedAt: string
}

/**
 * Matches the application DTO returned by both list and detail endpoints.
 * `id` is normalised from `admissionApplicationId`.
 * `status` is normalised from integer to string label.
 */
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
  status: ApplicationStatusLabel
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

// ── Normalisation helpers ─────────────────────────────────────────────────────
// The API wraps every response in { success, data, error }.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrapEnvelope<T>(raw: any): T {
  if (raw && typeof raw === 'object' && 'success' in raw && 'data' in raw) {
    return raw.data as T
  }
  return raw as T
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normaliseDoc(raw: any): AdmissionDocument {
  return {
    id:               raw.admissionDocumentId ?? raw.id,
    documentType:     raw.documentType,
    originalFileName: raw.originalFileName,
    contentType:      raw.contentType,
    fileSizeBytes:    raw.fileSizeBytes,
    filePath:         raw.filePath,
    uploadedAt:       raw.uploadedAt,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalise(raw: any): AdmissionApplication {
  return {
    id:                raw.admissionApplicationId ?? raw.id,
    referenceNumber:   raw.referenceNumber,
    childFirstName:    raw.childFirstName,
    childLastName:     raw.childLastName,
    dateOfBirth:       raw.dateOfBirth,
    applyingForGrade:  raw.applyingForGrade,
    previousSchool:    raw.previousSchool,
    parentFirstName:   raw.parentFirstName,
    parentLastName:    raw.parentLastName,
    parentEmail:       raw.parentEmail,
    parentPhone:       raw.parentPhone,
    parentIdNumber:    raw.parentIdNumber,
    parentRelationship: raw.parentRelationship,
    // API sends integer; we normalise to label for the UI
    status:            STATUS_INT_TO_LABEL[raw.status as number] ?? 'Pending',
    adminNotes:        raw.adminNotes,
    submittedAt:       raw.submittedAt,
    reviewedAt:        raw.reviewedAt,
    reviewedBy:        raw.reviewedBy,
    documents:         Array.isArray(raw.documents) ? raw.documents.map(normaliseDoc) : [],
  }
}

// ── Service ───────────────────────────────────────────────────────────────────
// axios baseURL is already /api — paths start with /admissions/…

export const admissionsService = {
  // ── Applications ───────────────────────────────────────────────────────────

  list: async (): Promise<AdmissionApplication[]> => {
    const { data } = await apiClient.get('/admissions/applications')
    const arr = unwrapEnvelope<unknown>(data)
    if (!Array.isArray(arr)) return []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return arr.map((r: any) => normalise(r))
  },

  getById: async (id: number): Promise<AdmissionApplication> => {
    const { data } = await apiClient.get(`/admissions/applications/${id}`)
    return normalise(unwrapEnvelope<unknown>(data))
  },

  getByReference: async (referenceNumber: string): Promise<AdmissionApplication> => {
    const { data } = await apiClient.get(
      `/admissions/applications/reference/${encodeURIComponent(referenceNumber)}`,
    )
    return normalise(unwrapEnvelope<unknown>(data))
  },

  create: async (dto: AdmissionApplicationCreateDto): Promise<AdmissionApplication> => {
    const { data } = await apiClient.post('/admissions/applications', dto)
    return normalise(unwrapEnvelope<unknown>(data))
  },

  update: async (id: number, dto: AdmissionApplicationUpdateDto): Promise<AdmissionApplication> => {
    const { data } = await apiClient.put(`/admissions/applications/${id}`, dto)
    return normalise(unwrapEnvelope<unknown>(data))
  },

  updateStatus: async (id: number, dto: AdmissionStatusUpdateDto): Promise<AdmissionApplication> => {
    const { data } = await apiClient.patch(
      `/admissions/applications/${id}/status`,
      dto,
    )
    return normalise(unwrapEnvelope<unknown>(data))
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
    const { data } = await apiClient.post(
      `/admissions/applications/${applicationId}/documents`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    return normaliseDoc(unwrapEnvelope<unknown>(data))
  },

  deleteDocument: async (applicationId: number, documentId: number): Promise<void> => {
    await apiClient.delete(
      `/admissions/applications/${applicationId}/documents/${documentId}`,
    )
  },
}
