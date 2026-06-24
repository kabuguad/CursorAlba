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

function unwrapSingle<T>(r: { data: { data: T | T[] } }): T {
  const d = r.data.data
  return Array.isArray(d) ? d[0] : d
}

export const homePageContentApi = {
  get: (): Promise<HomePageContentDto> =>
    apiClient.get('/homepage-content').then(r => unwrapSingle<HomePageContentDto>(r)),

  update: (id: number, dto: UpdateHomePageContentDto): Promise<HomePageContentDto> =>
    apiClient.put(`/homepage-content/${id}`, dto).then(r => unwrapSingle<HomePageContentDto>(r)),
}
