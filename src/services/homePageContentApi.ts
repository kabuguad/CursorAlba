import { apiClient } from './apiClient'

export interface HomePageContentDto {
  homePageContentId: number
  heroImage1Url: string
  heroImage2Url: string
  heroImage3Url: string
  heroImage4Url: string
  heroTagline: string
  heroTaglineGold: string
  heroLocationBadge: string
  heroSubtitle: string
  heroPrimaryCtaLabel: string
  heroPrimaryCtaUrl: string
  heroSecondaryCtaLabel: string
  heroSecondaryCtaUrl: string
  statStudentsEnrolled: number
  statEducators: number
  statEstYear: number
  statActivities: number
  foundationSectionLabel: string
  foundationHeading: string
  missionLabel: string
  missionTitle: string
  missionBody: string
  mottoLabel: string
  mottoTitle: string
  mottoTagline: string
  mottoBody: string
  visionLabel: string
  visionTitle: string
  visionBody: string
  ctaBadgeText: string
  ctaHeading: string
  ctaSubtext: string
  ctaPrimaryLabel: string
  ctaPrimaryUrl: string
  ctaSecondaryLabel: string
  ctaSecondaryUrl: string
}

export type UpdateHomePageContentDto = Omit<HomePageContentDto, 'homePageContentId'>

export interface ApiError {
  message: string
  detail?: string
}

function unwrapSingle<T>(r: { data: { success?: boolean; data: T | T[]; error?: unknown } }): T {
  const payload = r.data
  if (payload.success === false) {
    const err = payload as unknown as { message?: string }
    throw new Error(err.message ?? 'API request failed')
  }
  const d = payload.data
  return Array.isArray(d) ? d[0] : d
}

function extractErrorMessage(err: unknown): string {
  const axiosErr = err as {
    response?: {
      status?: number
      data?: { message?: string; title?: string; errors?: Record<string, string[]> }
    }
    message?: string
  }
  const status = axiosErr?.response?.status
  const data = axiosErr?.response?.data
  if (data?.message) return data.message
  if (data?.title) return data.title
  if (data?.errors) {
    const msgs = Object.values(data.errors).flat()
    if (msgs.length) return msgs.join('; ')
  }
  if (status === 401) return 'Not authorised — please sign in with admin credentials'
  if (status === 403) return 'Forbidden — your account does not have admin access'
  if (status === 415) return 'Server rejected the request format (415) — check that the API is up to date'
  if (status === 404) return 'Home page content record not found on the server'
  return axiosErr?.message ?? 'Unknown error'
}

export const homePageContentApi = {
  get: (): Promise<HomePageContentDto> =>
    apiClient
      .get<{ success: boolean; data: HomePageContentDto[] | HomePageContentDto; error: unknown }>('/homepage-content')
      .then(r => unwrapSingle<HomePageContentDto>(r)),

  getById: (id: number): Promise<HomePageContentDto> =>
    apiClient
      .get<{ success: boolean; data: HomePageContentDto; error: unknown }>(`/homepage-content/${id}`)
      .then(r => unwrapSingle<HomePageContentDto>(r)),

  update: async (id: number, dto: UpdateHomePageContentDto): Promise<HomePageContentDto> => {
    try {
      const r = await apiClient.put<{ success: boolean; data: HomePageContentDto | HomePageContentDto[]; error: unknown }>(
        `/homepage-content/${id}`,
        dto,
      )
      return unwrapSingle<HomePageContentDto>(r)
    } catch (err) {
      throw new Error(extractErrorMessage(err))
    }
  },

  create: async (dto: UpdateHomePageContentDto): Promise<HomePageContentDto> => {
    try {
      const r = await apiClient.post<{ success: boolean; data: HomePageContentDto; error: unknown }>(
        '/homepage-content',
        dto,
      )
      return unwrapSingle<HomePageContentDto>(r)
    } catch (err) {
      throw new Error(extractErrorMessage(err))
    }
  },
}
