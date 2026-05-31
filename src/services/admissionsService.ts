import apiClient from '../lib/axios'

export interface AdmissionApplication {
  id: string
  childFirstName: string
  childLastName: string
  dob: string
  gender: string
  applyingForGrade: string
  applyingForClassId?: number | null
  previousSchool?: string | null
  parentFirstName: string
  parentLastName: string
  parentEmail: string
  parentPhone: string
  parentRelationship?: string
  address?: string
  documents: string[]
  status: 'pending' | 'reviewing' | 'approved' | 'rejected'
  notes: string
  submittedDate: string
  assignedTo?: string | null
  reviewedAt?: string | null
}

export interface AdmissionsStats {
  total: number
  pending: number
  reviewing: number
  approved: number
  rejected: number
}

export const admissionsService = {
  list: async (): Promise<AdmissionApplication[]> => {
    const { data } = await apiClient.get<AdmissionApplication[]>('/admin/admissions')
    return data
  },

  getById: async (id: string): Promise<AdmissionApplication> => {
    const { data } = await apiClient.get<AdmissionApplication>(`/admin/admissions/${id}`)
    return data
  },

  updateStatus: async (
    id: string,
    status: AdmissionApplication['status'],
    notes: string,
  ): Promise<AdmissionApplication> => {
    const backendStatus = status.charAt(0).toUpperCase() + status.slice(1)
    const { data } = await apiClient.patch<AdmissionApplication>(
      `/admin/admissions/${id}/status`,
      { status: backendStatus, notes },
    )
    return data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/admissions/${id}`)
  },

  getStats: async (): Promise<AdmissionsStats> => {
    const { data } = await apiClient.get<AdmissionsStats>('/admin/admissions/stats')
    return data
  },
}
