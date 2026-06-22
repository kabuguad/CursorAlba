import axios from 'axios'

const http = axios.create({ baseURL: '/api' })

export interface FacilityPageContent {
  facilitiesPageContentId: number
  headline: string
  subheadline: string
  ctaHeadline: string
  ctaSubtext: string
}

export interface FacilityDto {
  facilityId: number
  icon: string
  name: string
  desc: string
  img: string
  highlights: string
  sortOrder: number
  isPublished: boolean
  facilitiesPageContentId: number
}

type ApiWrap<T> = { success: boolean; data: T; error?: string | null }

function unwrap<T>(res: { data: ApiWrap<T> }) {
  return res.data.data
}

export const facilitiesApi = {
  getPageContent: () =>
    http.get<ApiWrap<FacilityPageContent>>('/facilities-page-content/1').then(unwrap),

  updatePageContent: (dto: Pick<FacilityPageContent, 'headline' | 'subheadline' | 'ctaHeadline' | 'ctaSubtext'>) =>
    http.put<ApiWrap<FacilityPageContent>>('/facilities-page-content/1', dto).then(r => r.data.data),

  getAll: () =>
    http.get<ApiWrap<FacilityDto[]>>('/facilities').then(unwrap),

  create: (dto: Omit<FacilityDto, 'facilityId'>) =>
    http.post<ApiWrap<FacilityDto>>('/facilities', dto).then(unwrap),

  update: (id: number, dto: Omit<FacilityDto, 'facilityId' | 'facilitiesPageContentId'>) =>
    http.put<ApiWrap<FacilityDto>>(`/facilities/${id}`, dto).then(unwrap),

  remove: (id: number) => http.delete(`/facilities/${id}`),
}
