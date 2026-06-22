import axios from 'axios'

const http = axios.create({ baseURL: '/api' })

export interface WcuPageContent {
  id: number
  tagline: string
  headline: string
  subheadline: string
  statStudents: string
  statEducators: string
  statPassRate: string
  statActivities: string
  ctaHeadline: string
  ctaSubtext: string
  updatedAt: string
  items: WcuItemDto[]
}

export interface WcuItemDto {
  id: number
  icon: string
  title: string
  subtitle: string
  description: string
  stat: string
  statLabel: string
  color: string
  sortOrder: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export type UpdateWcuPageContentDto = Pick<
  WcuPageContent,
  | 'tagline'
  | 'headline'
  | 'subheadline'
  | 'statStudents'
  | 'statEducators'
  | 'statPassRate'
  | 'statActivities'
  | 'ctaHeadline'
  | 'ctaSubtext'
>

export interface CreateWcuItemDto {
  icon: string
  title: string
  subtitle: string
  description: string
  stat: string
  statLabel: string
  color: string
  sortOrder?: number
  isPublished: boolean
}

export interface UpdateWcuItemDto {
  icon: string
  title: string
  subtitle: string
  description: string
  stat: string
  statLabel: string
  color: string
  sortOrder: number
  isPublished: boolean
}

type ApiWrap<T> = { success: boolean; data: T; error?: string | null }

function unwrap<T>(res: { data: ApiWrap<T> }) {
  return res.data.data
}

export const whyChooseUsApi = {
  getPageContent: () =>
    http.get<ApiWrap<WcuPageContent>>('/why-choose-us-page-content').then(unwrap),

  updatePageContent: (dto: UpdateWcuPageContentDto) =>
    http.put<ApiWrap<WcuPageContent>>('/why-choose-us-page-content', dto).then(unwrap),

  getItems: () =>
    http.get<ApiWrap<WcuItemDto[]>>('/why-choose-us-items').then(unwrap),

  createItem: (dto: CreateWcuItemDto) =>
    http.post<ApiWrap<WcuItemDto>>('/why-choose-us-items', dto).then(unwrap),

  updateItem: (id: number, dto: UpdateWcuItemDto) =>
    http.put<ApiWrap<WcuItemDto>>(`/why-choose-us-items/${id}`, dto).then(unwrap),

  patchItem: (id: number, dto: { isPublished?: boolean; sortOrder?: number }) =>
    http.patch<ApiWrap<WcuItemDto>>(`/why-choose-us-items/${id}`, dto).then(unwrap),

  deleteItem: (id: number) =>
    http.delete(`/why-choose-us-items/${id}`),
}
