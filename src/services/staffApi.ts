import { apiClient } from './apiClient'

export interface ApiTeacher {
  id: number
  userId?: number
  firstName: string
  lastName: string
  fullName: string
  email: string
  title: string
  credentials: string
  qualifications: string
  profilePhoto: string | null
  academicPortfolio: string | null
  hireDate: string | null
  departmentId: number
  departmentName: string
}

export interface ApiDepartment {
  id: number
  name: string
  description: string | null
  icon: string | null
  sortOrder: number
  isActive: boolean
  teacherCount?: number
}

export interface TeacherCreateDto {
  firstName: string
  lastName: string
  email: string
  title: string
  credentials: string
  qualifications: string
  profilePhoto?: string | null
  academicPortfolio?: string | null
  hireDate?: string | null
  departmentId: number
}

export interface DepartmentCreateDto {
  name: string
  description?: string | null
  icon?: string | null
  sortOrder: number
  isActive: boolean
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

function normalizeTeacher(raw: any): ApiTeacher {
  return {
    id: raw.teacherId ?? raw.id,
    userId: raw.userId,
    firstName: raw.firstName ?? '',
    lastName: raw.lastName ?? '',
    fullName: raw.fullName ?? `${raw.firstName ?? ''} ${raw.lastName ?? ''}`.trim(),
    email: raw.email ?? '',
    title: raw.title ?? '',
    credentials: raw.credentials ?? '',
    qualifications: raw.qualifications ?? '',
    profilePhoto: raw.profilePhoto ?? null,
    academicPortfolio: raw.academicPortfolio ?? null,
    hireDate: raw.hireDate ?? null,
    departmentId: raw.departmentId,
    departmentName: raw.departmentName ?? '',
  }
}

function normalizeDepartment(raw: any): ApiDepartment {
  return {
    id: raw.departmentId ?? raw.id,
    name: raw.name ?? '',
    description: raw.description ?? null,
    icon: raw.icon ?? null,
    sortOrder: raw.sortOrder ?? 0,
    isActive: raw.isActive ?? true,
    teacherCount: raw.teacherCount,
  }
}

export const staffApi = {
  teachers: {
    getAll: (): Promise<ApiTeacher[]> =>
      apiClient.get('/teachers').then(r => unwrapList(r).map(normalizeTeacher)),

    getById: (id: number): Promise<ApiTeacher> =>
      apiClient.get(`/teachers/${id}`).then(r => normalizeTeacher(unwrapOne(r))),

    getByDepartment: (departmentId: number): Promise<ApiTeacher[]> =>
      apiClient.get(`/teachers?departmentId=${departmentId}`).then(r => unwrapList(r).map(normalizeTeacher)),

    create: (dto: TeacherCreateDto): Promise<ApiTeacher> =>
      apiClient.post('/teachers', dto).then(r => normalizeTeacher(unwrapOne(r))),

    update: (id: number, dto: TeacherCreateDto): Promise<ApiTeacher> =>
      apiClient.put(`/teachers/${id}`, dto).then(r => normalizeTeacher(unwrapOne(r))),

    delete: (id: number): Promise<void> =>
      apiClient.delete(`/teachers/${id}`).then(() => undefined),
  },

  departments: {
    getAll: (): Promise<ApiDepartment[]> =>
      apiClient.get('/departments').then(r => unwrapList(r).map(normalizeDepartment)),

    getById: (id: number): Promise<ApiDepartment> =>
      apiClient.get(`/departments/${id}`).then(r => normalizeDepartment(unwrapOne(r))),

    create: (dto: DepartmentCreateDto): Promise<ApiDepartment> =>
      apiClient.post('/departments', dto).then(r => normalizeDepartment(unwrapOne(r))),

    update: (id: number, dto: DepartmentCreateDto): Promise<ApiDepartment> =>
      apiClient.put(`/departments/${id}`, dto).then(r => normalizeDepartment(unwrapOne(r))),

    delete: (id: number): Promise<void> =>
      apiClient.delete(`/departments/${id}`).then(() => undefined),
  },
}
