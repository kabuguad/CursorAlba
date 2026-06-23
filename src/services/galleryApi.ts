import { apiClient } from './apiClient'

export interface GalleryCategory {
  id: number
  title: string
  slug: string | null
  description: string | null
  icon: string
  sortOrder: number
  isActive: boolean
  imageCount?: number
}

export interface GalleryImage {
  id: number
  url: string
  caption: string | null
  sortOrder: number
  isPublic: boolean
  galleryCategoryId: number
  categoryTitle?: string
  categoryIcon?: string
}

export interface GalleryCategoryCreateDto {
  title: string
  slug?: string | null
  description?: string | null
  icon: string
  sortOrder: number
  isActive: boolean
}

export interface GalleryImageCreateDto {
  url: string
  caption?: string | null
  sortOrder: number
  isPublic: boolean
  galleryCategoryId: number
}

export interface GalleryImageUpdateDto {
  url: string
  caption?: string | null
  sortOrder: number
  isPublic: boolean
  galleryCategoryId: number
}

function unwrapList(res: { data: unknown }): unknown[] {
  const body = res.data as any
  const items = body?.data ?? body
  return Array.isArray(items) ? items : []
}

function unwrapOne(res: { data: unknown }): any {
  const body = res.data as any
  return body?.data ?? body
}

function normalizeCategory(raw: any): GalleryCategory {
  return {
    id: raw.galleryCategoryId ?? raw.id,
    title: raw.title,
    slug: raw.slug ?? null,
    description: raw.description ?? null,
    icon: raw.icon ?? '',
    sortOrder: raw.sortOrder ?? 0,
    isActive: raw.isActive ?? true,
    imageCount: raw.imageCount,
  }
}

function normalizeImage(raw: any): GalleryImage {
  return {
    id: raw.galleryImageId ?? raw.id,
    url: raw.url,
    caption: raw.caption ?? null,
    sortOrder: raw.sortOrder ?? 0,
    isPublic: raw.isPublic ?? true,
    galleryCategoryId: raw.galleryCategoryId,
    categoryTitle: raw.categoryTitle,
    categoryIcon: raw.categoryIcon,
  }
}

export const galleryApi = {
  categories: {
    getAll: (): Promise<GalleryCategory[]> =>
      apiClient.get('/gallery/categories').then(r => unwrapList(r).map(normalizeCategory)),

    getById: (id: number): Promise<GalleryCategory> =>
      apiClient.get(`/gallery/categories/${id}`).then(r => normalizeCategory(unwrapOne(r))),

    create: (dto: GalleryCategoryCreateDto): Promise<GalleryCategory> =>
      apiClient.post('/gallery/categories', dto).then(r => normalizeCategory(unwrapOne(r))),

    update: (id: number, dto: GalleryCategoryCreateDto): Promise<GalleryCategory> =>
      apiClient.put(`/gallery/categories/${id}`, dto).then(r => normalizeCategory(unwrapOne(r))),

    delete: (id: number): Promise<void> =>
      apiClient.delete(`/gallery/categories/${id}`).then(() => undefined),
  },

  images: {
    getPublic: (): Promise<GalleryImage[]> =>
      apiClient.get('/gallery').then(r => unwrapList(r).map(normalizeImage)),

    getByCategory: (categoryId: number): Promise<GalleryImage[]> =>
      apiClient.get(`/gallery/category/${categoryId}`).then(r => unwrapList(r).map(normalizeImage)),

    create: (dto: GalleryImageCreateDto): Promise<GalleryImage> =>
      apiClient.post('/gallery', dto).then(r => normalizeImage(unwrapOne(r))),

    update: (id: number, dto: GalleryImageUpdateDto): Promise<GalleryImage> =>
      apiClient.put(`/gallery/${id}`, dto).then(r => normalizeImage(unwrapOne(r))),

    delete: (id: number): Promise<void> =>
      apiClient.delete(`/gallery/${id}`).then(() => undefined),

    bulkUpload: (categoryId: number, files: File[], isPublic: boolean): Promise<GalleryImage[]> => {
      const form = new FormData()
      form.append('galleryCategoryId', String(categoryId))
      form.append('isPublic', String(isPublic))
      files.forEach(f => form.append('files', f))
      return apiClient.post('/gallery/bulk', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then(r => unwrapList(r).map(normalizeImage))
    },
  },
}
