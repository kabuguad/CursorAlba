import { apiClient } from './apiClient'

export interface GalleryCategory {
  id: number
  title: string
  slug: string | null
  description: string | null
  icon: string
  sortOrder: number
  isActive: boolean
}

export interface GalleryImage {
  id: number
  url: string
  caption: string | null
  sortOrder: number
  isPublic: boolean
  galleryCategoryId: number
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

function unwrapData<T>(res: { data: T }): T {
  return (res.data as any)?.data ?? res.data
}

export const galleryApi = {
  categories: {
    getAll: (): Promise<GalleryCategory[]> =>
      apiClient.get('/gallery/categories').then(r => unwrapData(r) ?? []),

    getById: (id: number): Promise<GalleryCategory> =>
      apiClient.get(`/gallery/categories/${id}`).then(r => unwrapData(r)),

    create: (dto: GalleryCategoryCreateDto): Promise<GalleryCategory> =>
      apiClient.post('/gallery/categories', dto).then(r => unwrapData(r)),

    update: (id: number, dto: GalleryCategoryCreateDto): Promise<GalleryCategory> =>
      apiClient.put(`/gallery/categories/${id}`, dto).then(r => unwrapData(r)),

    delete: (id: number): Promise<void> =>
      apiClient.delete(`/gallery/categories/${id}`).then(() => undefined),
  },

  images: {
    getPublic: (): Promise<GalleryImage[]> =>
      apiClient.get('/gallery').then(r => unwrapData(r) ?? []),

    getByCategory: (categoryId: number): Promise<GalleryImage[]> =>
      apiClient.get(`/gallery/category/${categoryId}`).then(r => unwrapData(r) ?? []),

    create: (dto: GalleryImageCreateDto): Promise<GalleryImage> =>
      apiClient.post('/gallery', dto).then(r => unwrapData(r)),

    update: (id: number, dto: GalleryImageUpdateDto): Promise<GalleryImage> =>
      apiClient.put(`/gallery/${id}`, dto).then(r => unwrapData(r)),

    delete: (id: number): Promise<void> =>
      apiClient.delete(`/gallery/${id}`).then(() => undefined),

    bulkUpload: (categoryId: number, files: File[], isPublic: boolean): Promise<GalleryImage[]> => {
      const form = new FormData()
      form.append('galleryCategoryId', String(categoryId))
      form.append('isPublic', String(isPublic))
      files.forEach(f => form.append('files', f))
      return apiClient.post('/gallery/bulk', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then(r => unwrapData(r) ?? [])
    },
  },
}
