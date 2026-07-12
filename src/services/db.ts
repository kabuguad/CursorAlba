/**
 * In-Memory Data Store
 * Single source of truth for all mock data. Backed by sessionStorage so data
 * survives React re-renders but resets on tab close (simulating a session-scoped
 * API backend). Swap this module for real Axios calls when the ASP.NET Core
 * backend is ready — all service modules only import from here.
 */

import { newId } from './mockApi'
import type { Department } from '../data/types'

// ── Types ──────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'teacher' | 'parent' | 'student'
export type UserStatus = 'active' | 'inactive' | 'suspended'

export interface SystemUser {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  lastLogin: string | null
  createdAt: string
  permissions: string[]
  linkedId: string | null   // studentId / staffId / etc.
  phone: string
  avatar: string | null
}

export interface Student {
  id: string
  admNo: string
  firstName: string
  lastName: string
  dob: string
  gender: 'Male' | 'Female'
  grade: string
  classId: string
  photo: string | null
  status: 'active' | 'inactive' | 'graduated' | 'suspended'
  enrolledDate: string
  parentIds: string[]
  address: string
  medicalNotes: string
  specialNeeds: string
  previousSchool: string
  documents: string[]
  emergencyContact: { name: string; phone: string; relation: string }
  transportRouteId: string | null
}

export interface StaffMember {
  id: string
  staffNo: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dob: string
  gender: 'Male' | 'Female'
  photo: string | null
  role: 'teacher' | 'admin_staff' | 'support'
  department: string
  subjects: string[]
  classIds: string[]
  tscNo: string
  nationalId: string
  qualification: string
  employedDate: string
  contractType: 'permanent' | 'temporary' | 'intern'
  contractEnd: string | null
  salaryGrade: string
  status: 'active' | 'inactive' | 'on_leave'
  bankAccount: string
  nhif: string
  nssf: string
  address: string
}

export interface AcademicYear {
  id: string
  label: string
  isCurrent: boolean
  terms: Term[]
}

export interface Term {
  id: string
  label: string
  startDate: string
  endDate: string
  isCurrent: boolean
}

export interface SchoolClass {
  id: string
  grade: string
  stream: string
  classTeacherId: string | null
  capacity: number
  subjectIds: string[]
  academicYearId: string
}

export interface Subject {
  id: string
  name: string
  code: string
  department: string
  grades: string[]
  periodsPerWeek: number
}

export interface AssessmentScheme {
  id: string
  name: string
  grade: string
  components: { name: string; weight: number }[]
}

export interface Exam {
  id: string
  name: string
  termId: string
  startDate: string
  endDate: string
  grades: string[]
  status: 'scheduled' | 'ongoing' | 'completed'
  createdAt: string
}

export interface Payment {
  id: string
  date: string
  time: string
  studentId: string
  studentName: string
  studentAdmNo: string
  parentName: string
  phone: string
  amount: number
  description: string
  method: 'M-Pesa' | 'Bank Transfer' | 'Cash'
  reference: string
  status: 'completed' | 'pending' | 'failed' | 'refunded'
  termId: string
  invoiceId: string | null
}

export interface Invoice {
  id: string
  studentId: string
  studentName: string
  admNo: string
  termId: string
  lineItems: { description: string; amount: number }[]
  totalAmount: number
  paidAmount: number
  balance: number
  status: 'unpaid' | 'partial' | 'paid' | 'overdue'
  dueDate: string
  issuedDate: string
  discountAmount: number
  discountReason: string
}

export interface Scholarship {
  id: string
  studentId: string
  studentName: string
  type: 'percentage' | 'fixed'
  value: number
  reason: string
  startTerm: string
  endTerm: string | null
  status: 'active' | 'expired'
  approvedBy: string
  createdAt: string
}

export interface Expense {
  id: string
  date: string
  category: string
  description: string
  amount: number
  payee: string
  approvedBy: string
  receiptNo: string
  status: 'approved' | 'pending' | 'rejected'
}

export interface FeeStructure {
  id: string
  level: string
  tuition: number
  transport: number
  activities: number
  termId: string
}

export interface Message {
  id: string
  fromId: string
  fromName: string
  fromRole: UserRole
  toId: string
  toName: string
  toRole: UserRole
  subject: string
  body: string
  sentAt: string
  readAt: string | null
  threadId: string
}

export interface Announcement {
  id: string
  title: string
  body: string
  targetRoles: UserRole[]
  targetGrades: string[]
  priority: 'normal' | 'high' | 'urgent'
  publishAt: string
  expiresAt: string | null
  status: 'draft' | 'published' | 'expired'
  createdBy: string
  createdAt: string
  readCount: number
}

export interface MeetingSlot {
  id: string
  teacherId: string
  teacherName: string
  date: string
  startTime: string
  endTime: string
  bookedByParentId: string | null
  bookedByParentName: string | null
  studentId: string | null
  status: 'available' | 'booked' | 'cancelled'
  notes: string
}

export interface LeaveRequest {
  id: string
  staffId: string
  staffName: string
  type: 'annual' | 'sick' | 'maternity' | 'emergency' | 'study'
  startDate: string
  endDate: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  reviewedBy: string | null
  reviewedAt: string | null
  reviewNotes: string
}

export interface TransportRoute {
  id: string
  name: string
  description: string
  stops: string[]
  vehicleId: string | null
  driverId: string | null
  driverName: string
  driverPhone: string
  capacity: number
  feePerTerm: number
  status: 'active' | 'inactive'
}

export interface Vehicle {
  id: string
  registration: string
  make: string
  model: string
  capacity: number
  routeId: string | null
  status: 'active' | 'maintenance' | 'retired'
  lastService: string
  nextService: string
}

export interface Book {
  id: string
  isbn: string
  title: string
  author: string
  category: string
  publisher: string
  year: number
  totalCopies: number
  availableCopies: number
  location: string
  status: 'available' | 'all_borrowed' | 'reserved'
}

export interface Borrowing {
  id: string
  bookId: string
  bookTitle: string
  borrowerId: string
  borrowerName: string
  borrowerType: 'student' | 'staff'
  issuedDate: string
  dueDate: string
  returnedDate: string | null
  status: 'active' | 'returned' | 'overdue'
}

export interface AuditEntry {
  id: string
  timestamp: string
  userId: string
  userName: string
  userRole: UserRole
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'EXPORT' | 'VIEW'
  resource: string
  resourceId: string | null
  details: string
  ipAddress: string
  sessionId: string
}

export interface MediaAsset {
  id: string
  name: string
  url: string
  type: 'image' | 'document' | 'video'
  size: string
  uploadedAt: string
  uploadedBy: string
  category: string
  usedIn: string[]
}

export interface SystemSettings {
  schoolName: string
  schoolMotto: string
  address: string
  phone: string
  email: string
  website: string
  whatsapp: string
  logo: string | null
  primaryColor: string
  currentAcademicYearId: string
  currentTermId: string
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpEnabled: boolean
  maintenanceMode: boolean
  maintenanceMessage: string
  lastBackup: string | null
}

export interface AdmissionApplication {
  id: string
  childFirstName: string
  childLastName: string
  dob: string
  gender: 'Male' | 'Female'
  applyingForGrade: string
  parentFirstName: string
  parentLastName: string
  parentEmail: string
  parentPhone: string
  address: string
  previousSchool: string
  documents: string[]
  status: 'pending' | 'reviewing' | 'approved' | 'rejected'
  submittedDate: string
  notes: string
  assignedTo: string | null
}

export interface TimetableSlot {
  id: string
  classId: string
  subjectId: string
  staffId: string
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'
  startTime: string
  endTime: string
  room: string
  termId: string
}

export interface AttendanceRecord {
  id: string
  studentId: string
  classId: string
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  recordedBy: string
  notes: string
  termId: string
}

export interface StudentGrade {
  id: string
  studentId: string
  examId: string
  subjectId: string
  classId: string
  termId: string
  cat1: number | null
  cat2: number | null
  endterm: number | null
  total: number | null
  grade: string
  isLocked: boolean
  enteredBy: string
}

export interface Homework {
  id: string
  title: string
  description: string
  subjectId: string
  classId: string
  assignedBy: string
  assignedByName: string
  assignedDate: string
  dueDate: string
  status: 'active' | 'closed'
  termId: string
}

export interface PublicBlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImageUrl: string | null
  author: string
  category: string
  isPublished: boolean
  publishedAt: string | null
  viewCount: number
  createdAt: string
}

export interface PublicEvent {
  id: string
  title: string
  description: string | null
  startDate: string
  endDate: string | null
  location: string | null
  imageUrl: string | null
  isPublished: boolean
  isPast: boolean
  eventType: string | null
}

export interface PublicGalleryImage {
  id: string
  url: string
  caption: string | null
  category: string | null
  sortOrder: number
  isPublic: boolean
  createdAt: string
}

export interface PublicProgramLevel {
  id: string
  slug: string
  name: string
  ages: string
  description: string
  imageUrl: string | null
  sortOrder: number
  createdAt: string
}

export interface PublicFeeRow {
  id: string
  level: string
  tuition: number
  transport: number
  activities: number
  total: number
  sortOrder: number
}

export interface PublicTeacher {
  id: string
  name: string
  title: string
  department: Department
  image: string | null
  bio: string
  credentials: string[]
  qualifications: string[]
}

export interface SportFixture {
  id: string
  sport: string
  opponent: string
  date: string
  venue: string
  result: string
  status: 'upcoming' | 'live' | 'completed'
}

// ── Academics — CBC Competencies ───────────────────────────────────────────

export interface AcademicsCompetency {
  id: string
  icon: string
  title: string
  desc: string
  isFeatured: boolean
  sortOrder: number
}

// ── Academics — School Levels ──────────────────────────────────────────────

export interface AcademicsSchoolLevel {
  id: string
  slug: string
  name: string
  ages: string
  icon: string
  colorKey: string
  desc: string
  highlights: string
  sortOrder: number
}

// ── Facilities ─────────────────────────────────────────────────────────────

export interface Facility {
  id: string
  name: string
  icon: string
  desc: string
  img: string
  highlights: string  // newline-separated list
  sortOrder: number
  isPublished: boolean
}

// ── Co-Curricular Activities ────────────────────────────────────────────────

export type CocurrCategoryId = 'sports' | 'arts' | 'community' | 'cts'

export interface CocurrActivity {
  id: string
  categoryId: CocurrCategoryId
  name: string
  icon: string
  desc: string
  sortOrder: number
}

// ── Sports Offered ─────────────────────────────────────────────────────────

export interface SportOffered {
  id: string
  name: string
  icon: string
  desc: string
  sortOrder: number
}

// ── Sport Trophies ─────────────────────────────────────────────────────────

export interface SportTrophy {
  id: string
  year: string
  title: string
  category: string
  sortOrder: number
}

// ── Music Instruments ──────────────────────────────────────────────────────

export interface MusicInstrument {
  id: string
  name: string
  icon: string
  desc: string
  sortOrder: number
}

// ── Music Teachers ─────────────────────────────────────────────────────────

export interface MusicTeacher {
  id: string
  name: string
  subject: string
  img: string
  credentials: string
  sortOrder: number
}

// ── Music Schedule Slots ───────────────────────────────────────────────────

export interface MusicScheduleSlot {
  id: string
  day: string
  slots: string   // newline-separated slot strings
  sortOrder: number
}

// ── Dance Styles ───────────────────────────────────────────────────────────

export interface DanceStyle {
  id: string
  style: string
  icon: string
  desc: string
  sortOrder: number
}

// ── Drama Past Plays ───────────────────────────────────────────────────────

export interface DramaPlay {
  id: string
  year: string
  title: string
  desc: string
  img: string
  sortOrder: number
}

// ── Drama Faculty ──────────────────────────────────────────────────────────

export interface DramaFaculty {
  id: string
  name: string
  role: string
  img: string
  bio: string
  sortOrder: number
}

// ── Drama Schedule Slots ───────────────────────────────────────────────────

export interface DramaScheduleSlot {
  id: string
  day: string
  activity: string
  sortOrder: number
}

// ── About Page Structured Data ─────────────────────────────────────────────

export interface AboutCoreValue {
  id: string
  icon: string
  title: string
  desc: string
  sortOrder: number
}

export interface AboutHistoryItem {
  id: string
  year: string
  title: string
  desc: string
  sortOrder: number
}

// ── CMS / Page Builder ─────────────────────────────────────────────────────

export type CmsBlockType = 'text' | 'textarea' | 'image' | 'list'

export interface CmsPage {
  id: string
  slug: string
  parentId: string | null
  title: string
  icon: string
  path: string
  isPublished: boolean
  sortOrder: number
}

export interface CmsBlock {
  id: string
  pageId: string
  key: string
  label: string
  type: CmsBlockType
  value: string
  helpText: string
  sortOrder: number
}

// ── DB Shape ───────────────────────────────────────────────────────────────

export interface DB {
  users: SystemUser[]
  students: Student[]
  staff: StaffMember[]
  academicYears: AcademicYear[]
  classes: SchoolClass[]
  subjects: Subject[]
  assessmentSchemes: AssessmentScheme[]
  exams: Exam[]
  payments: Payment[]
  invoices: Invoice[]
  scholarships: Scholarship[]
  expenses: Expense[]
  feeStructures: FeeStructure[]
  messages: Message[]
  announcements: Announcement[]
  meetingSlots: MeetingSlot[]
  leaveRequests: LeaveRequest[]
  transportRoutes: TransportRoute[]
  vehicles: Vehicle[]
  books: Book[]
  borrowings: Borrowing[]
  auditLog: AuditEntry[]
  mediaAssets: MediaAsset[]
  settings: SystemSettings
  admissions: AdmissionApplication[]
  timetableSlots: TimetableSlot[]
  attendanceRecords: AttendanceRecord[]
  studentGrades: StudentGrade[]
  homework: Homework[]
  publicBlogPosts: PublicBlogPost[]
  publicEvents: PublicEvent[]
  publicGalleryImages: PublicGalleryImage[]
  publicProgramLevels: PublicProgramLevel[]
  publicFeeRows: PublicFeeRow[]
  publicTeachers: PublicTeacher[]
  publicSportFixtures: SportFixture[]
  cmsPages: CmsPage[]
  cmsBlocks: CmsBlock[]
  aboutCoreValues: AboutCoreValue[]
  aboutHistoryItems: AboutHistoryItem[]
  academicsSchoolLevels: AcademicsSchoolLevel[]
  academicsCompetencies: AcademicsCompetency[]
  facilities: Facility[]
  cocurrActivities: CocurrActivity[]
  sportsOffered: SportOffered[]
  sportTrophies: SportTrophy[]
  musicInstruments: MusicInstrument[]
  musicTeachers: MusicTeacher[]
  musicScheduleSlots: MusicScheduleSlot[]
  danceStyles: DanceStyle[]
  dramaPlays: DramaPlay[]
  dramaFaculty: DramaFaculty[]
  dramaScheduleSlots: DramaScheduleSlot[]
  whyChooseUsItems: WhyChooseUsItem[]
}

export interface WhyChooseUsItem {
  id: string
  icon: string
  title: string
  subtitle: string
  desc: string
  stat: string
  statLabel: string
  color: string
  sortOrder: number
  isPublished: boolean
}

// ── Seed Data ──────────────────────────────────────────────────────────────

function createSeed(): DB {
  const TERM_ID = 'TERM-2026-T2'
  const YEAR_ID = 'YEAR-2026'

  const subjects: Subject[] = [
    { id: 'sub-001', name: 'Mathematics', code: 'MATH', department: 'Sciences', grades: ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'], periodsPerWeek: 5 },
    { id: 'sub-002', name: 'English', code: 'ENG', department: 'Languages', grades: ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'], periodsPerWeek: 5 },
    { id: 'sub-003', name: 'Kiswahili', code: 'KSW', department: 'Languages', grades: ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9'], periodsPerWeek: 4 },
    { id: 'sub-004', name: 'Science & Technology', code: 'SCI', department: 'Sciences', grades: ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6'], periodsPerWeek: 4 },
    { id: 'sub-005', name: 'Biology', code: 'BIO', department: 'Sciences', grades: ['Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'], periodsPerWeek: 4 },
    { id: 'sub-006', name: 'Chemistry', code: 'CHEM', department: 'Sciences', grades: ['Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'], periodsPerWeek: 4 },
    { id: 'sub-007', name: 'Physics', code: 'PHY', department: 'Sciences', grades: ['Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'], periodsPerWeek: 4 },
    { id: 'sub-008', name: 'History & Government', code: 'HIST', department: 'Humanities', grades: ['Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'], periodsPerWeek: 3 },
    { id: 'sub-009', name: 'Geography', code: 'GEO', department: 'Humanities', grades: ['Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'], periodsPerWeek: 3 },
    { id: 'sub-010', name: 'Computer Science', code: 'CS', department: 'Technology', grades: ['Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'], periodsPerWeek: 3 },
    { id: 'sub-011', name: 'Music', code: 'MUS', department: 'Arts', grades: ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9'], periodsPerWeek: 2 },
    { id: 'sub-012', name: 'Physical Education', code: 'PE', department: 'Sports', grades: ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'], periodsPerWeek: 2 },
    { id: 'sub-013', name: 'Religious Education', code: 'CRE', department: 'Humanities', grades: ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9'], periodsPerWeek: 2 },
    { id: 'sub-014', name: 'Business Studies', code: 'BS', department: 'Commerce', grades: ['Grade 10','Grade 11','Grade 12'], periodsPerWeek: 4 },
    { id: 'sub-015', name: 'Agriculture', code: 'AGRI', department: 'Sciences', grades: ['Grade 7','Grade 8','Grade 9'], periodsPerWeek: 3 },
  ]

  const classes: SchoolClass[] = [
    { id: 'cls-101', grade: 'Grade 4', stream: 'A', classTeacherId: 'stf-003', capacity: 35, subjectIds: ['sub-001','sub-002','sub-003','sub-004','sub-010','sub-011','sub-012','sub-013'], academicYearId: YEAR_ID },
    { id: 'cls-102', grade: 'Grade 4', stream: 'B', classTeacherId: 'stf-005', capacity: 35, subjectIds: ['sub-001','sub-002','sub-003','sub-004','sub-010','sub-011','sub-012','sub-013'], academicYearId: YEAR_ID },
    { id: 'cls-201', grade: 'Grade 7', stream: 'A', classTeacherId: 'stf-001', capacity: 40, subjectIds: ['sub-001','sub-002','sub-003','sub-005','sub-006','sub-007','sub-008','sub-009','sub-010','sub-012','sub-015'], academicYearId: YEAR_ID },
    { id: 'cls-202', grade: 'Grade 7', stream: 'B', classTeacherId: 'stf-002', capacity: 40, subjectIds: ['sub-001','sub-002','sub-003','sub-005','sub-006','sub-007','sub-008','sub-009','sub-010','sub-012','sub-015'], academicYearId: YEAR_ID },
    { id: 'cls-301', grade: 'Grade 10', stream: 'A', classTeacherId: 'stf-004', capacity: 38, subjectIds: ['sub-001','sub-002','sub-005','sub-006','sub-007','sub-008','sub-009','sub-010','sub-012','sub-014'], academicYearId: YEAR_ID },
    { id: 'cls-302', grade: 'Grade 10', stream: 'B', classTeacherId: 'stf-006', capacity: 38, subjectIds: ['sub-001','sub-002','sub-005','sub-006','sub-007','sub-008','sub-009','sub-010','sub-012','sub-014'], academicYearId: YEAR_ID },
    { id: 'cls-401', grade: 'Grade 12', stream: 'A', classTeacherId: 'stf-007', capacity: 32, subjectIds: ['sub-001','sub-002','sub-005','sub-006','sub-007','sub-010','sub-012','sub-014'], academicYearId: YEAR_ID },
  ]

  const staff: StaffMember[] = [
    { id: 'stf-001', staffNo: 'TSC-1001', firstName: 'James', lastName: 'Ochieng', email: 'j.ochieng@alberschool.ke', phone: '0712-001-001', dob: '1985-03-15', gender: 'Male', photo: null, role: 'teacher', department: 'Sciences', subjects: ['sub-005','sub-006','sub-007'], classIds: ['cls-201'], tscNo: 'TSC/123456', nationalId: '12345678', qualification: 'B.Ed Science, UoN', employedDate: '2015-01-05', contractType: 'permanent', contractEnd: null, salaryGrade: 'C5', status: 'active', bankAccount: 'KCB-0011223344', nhif: 'NHIF-001001', nssf: 'NSSF-001001', address: 'Kutus Town, Kirinyaga' },
    { id: 'stf-002', staffNo: 'TSC-1002', firstName: 'Mary', lastName: 'Kamau', email: 'm.kamau@alberschool.ke', phone: '0722-002-002', dob: '1988-07-22', gender: 'Female', photo: null, role: 'teacher', department: 'Languages', subjects: ['sub-002','sub-003'], classIds: ['cls-202'], tscNo: 'TSC/123457', nationalId: '23456789', qualification: 'B.Ed English, Kenyatta University', employedDate: '2017-08-01', contractType: 'permanent', contractEnd: null, salaryGrade: 'C4', status: 'active', bankAccount: 'Equity-0022334455', nhif: 'NHIF-002002', nssf: 'NSSF-002002', address: 'Kerugoya, Kirinyaga' },
    { id: 'stf-003', staffNo: 'TSC-1003', firstName: 'Grace', lastName: 'Wanjiku', email: 'g.wanjiku@alberschool.ke', phone: '0733-003-003', dob: '1990-11-08', gender: 'Female', photo: null, role: 'teacher', department: 'Mathematics', subjects: ['sub-001'], classIds: ['cls-101'], tscNo: 'TSC/123458', nationalId: '34567890', qualification: 'B.Sc Mathematics, JKUAT', employedDate: '2019-01-07', contractType: 'permanent', contractEnd: null, salaryGrade: 'C3', status: 'active', bankAccount: 'Co-op-0033445566', nhif: 'NHIF-003003', nssf: 'NSSF-003003', address: 'Wanguru, Kirinyaga' },
    { id: 'stf-004', staffNo: 'TSC-1004', firstName: 'David', lastName: 'Mwangi', email: 'd.mwangi@alberschool.ke', phone: '0744-004-004', dob: '1982-05-30', gender: 'Male', photo: null, role: 'teacher', department: 'Humanities', subjects: ['sub-008','sub-009'], classIds: ['cls-301'], tscNo: 'TSC/123459', nationalId: '45678901', qualification: 'B.A History & Geography, Egerton', employedDate: '2012-02-14', contractType: 'permanent', contractEnd: null, salaryGrade: 'C6', status: 'active', bankAccount: 'NCBA-0044556677', nhif: 'NHIF-004004', nssf: 'NSSF-004004', address: 'Kagio, Kirinyaga' },
    { id: 'stf-005', staffNo: 'TSC-1005', firstName: 'Peter', lastName: 'Njeru', email: 'p.njeru@alberschool.ke', phone: '0755-005-005', dob: '1992-02-18', gender: 'Male', photo: null, role: 'teacher', department: 'Technology', subjects: ['sub-010'], classIds: ['cls-102'], tscNo: 'TSC/123460', nationalId: '56789012', qualification: 'B.Sc Computer Science, Strathmore', employedDate: '2020-09-01', contractType: 'temporary', contractEnd: '2026-12-31', salaryGrade: 'C2', status: 'active', bankAccount: 'KCB-0055667788', nhif: 'NHIF-005005', nssf: 'NSSF-005005', address: 'Sagana, Kirinyaga' },
    { id: 'stf-006', staffNo: 'TSC-1006', firstName: 'Ann', lastName: 'Muthoni', email: 'a.muthoni@alberschool.ke', phone: '0766-006-006', dob: '1987-09-25', gender: 'Female', photo: null, role: 'teacher', department: 'Sciences', subjects: ['sub-005','sub-006'], classIds: ['cls-302'], tscNo: 'TSC/123461', nationalId: '67890123', qualification: 'B.Sc Biology & Chemistry, UoN', employedDate: '2016-01-11', contractType: 'permanent', contractEnd: null, salaryGrade: 'C4', status: 'on_leave', bankAccount: 'Equity-0066778899', nhif: 'NHIF-006006', nssf: 'NSSF-006006', address: 'Kerugoya, Kirinyaga' },
    { id: 'stf-007', staffNo: 'TSC-1007', firstName: 'Samuel', lastName: 'Kariuki', email: 's.kariuki@alberschool.ke', phone: '0777-007-007', dob: '1979-12-03', gender: 'Male', photo: null, role: 'teacher', department: 'Commerce', subjects: ['sub-001','sub-014'], classIds: ['cls-401'], tscNo: 'TSC/123462', nationalId: '78901234', qualification: 'M.Sc Mathematics & Business, UoN', employedDate: '2008-08-20', contractType: 'permanent', contractEnd: null, salaryGrade: 'D1', status: 'active', bankAccount: 'KCB-0077889900', nhif: 'NHIF-007007', nssf: 'NSSF-007007', address: 'Kutus Town, Kirinyaga' },
    { id: 'stf-008', staffNo: 'ADM-2001', firstName: 'Esther', lastName: 'Wairimu', email: 'e.wairimu@alberschool.ke', phone: '0788-008-008', dob: '1993-06-14', gender: 'Female', photo: null, role: 'admin_staff', department: 'Administration', subjects: [], classIds: [], tscNo: '', nationalId: '89012345', qualification: 'Diploma Business Admin, KCA', employedDate: '2021-03-01', contractType: 'permanent', contractEnd: null, salaryGrade: 'C1', status: 'active', bankAccount: 'Co-op-0088990011', nhif: 'NHIF-008008', nssf: 'NSSF-008008', address: 'Kutus Town, Kirinyaga' },
    { id: 'stf-009', staffNo: 'TSC-1008', firstName: 'John', lastName: 'Odhiambo', email: 'j.odhiambo@alberschool.ke', phone: '0799-009-009', dob: '1984-04-10', gender: 'Male', photo: null, role: 'teacher', department: 'Arts', subjects: ['sub-011','sub-012'], classIds: ['cls-101','cls-102','cls-201','cls-202'], tscNo: 'TSC/123463', nationalId: '90123456', qualification: 'B.Ed Music & PE, MMU', employedDate: '2013-09-02', contractType: 'permanent', contractEnd: null, salaryGrade: 'C5', status: 'active', bankAccount: 'NCBA-0099001122', nhif: 'NHIF-009009', nssf: 'NSSF-009009', address: 'Wanguru, Kirinyaga' },
    { id: 'stf-010', staffNo: 'ADM-2002', firstName: 'Faith', lastName: 'Nyambura', email: 'f.nyambura@alberschool.ke', phone: '0700-010-010', dob: '1995-08-28', gender: 'Female', photo: null, role: 'support', department: 'Library', subjects: [], classIds: [], tscNo: '', nationalId: '01234567', qualification: 'Diploma Library Science, Kisii University', employedDate: '2022-01-10', contractType: 'permanent', contractEnd: null, salaryGrade: 'B3', status: 'active', bankAccount: 'Equity-0010011223', nhif: 'NHIF-010010', nssf: 'NSSF-010010', address: 'Kagio, Kirinyaga' },
  ]

  const students: Student[] = [
    { id: 'stu-001', admNo: 'ADM-0041', firstName: 'Amani', lastName: 'Kariuki', dob: '2015-03-12', gender: 'Male', grade: 'Grade 4', classId: 'cls-101', photo: null, status: 'active', enrolledDate: '2020-01-06', parentIds: ['usr-p001'], address: 'Kutus Town, Kirinyaga', medicalNotes: 'Mild asthma — inhaler in office', specialNeeds: '', previousSchool: 'Kutus Nursery School', documents: ['Birth Certificate', 'Immunization Card'], emergencyContact: { name: 'Grace Njeri', phone: '0712-111-001', relation: 'Mother' }, transportRouteId: 'rte-001' },
    { id: 'stu-002', admNo: 'ADM-0022', firstName: 'Baraka', lastName: 'Muthoni', dob: '2014-07-05', gender: 'Male', grade: 'Grade 4', classId: 'cls-102', photo: null, status: 'active', enrolledDate: '2019-01-07', parentIds: ['usr-p002'], address: 'Kerugoya, Kirinyaga', medicalNotes: '', specialNeeds: '', previousSchool: 'Kerugoya Nursery', documents: ['Birth Certificate'], emergencyContact: { name: 'Peter Muthoni', phone: '0722-111-002', relation: 'Father' }, transportRouteId: 'rte-001' },
    { id: 'stu-003', admNo: 'ADM-0033', firstName: 'Cherono', lastName: 'Oduor', dob: '2013-09-20', gender: 'Female', grade: 'Grade 7', classId: 'cls-201', photo: null, status: 'active', enrolledDate: '2018-01-08', parentIds: ['usr-p003'], address: 'Wanguru, Kirinyaga', medicalNotes: '', specialNeeds: '', previousSchool: 'Wanguru Primary', documents: ['Birth Certificate', 'KCPE Certificate'], emergencyContact: { name: 'Ruth Oduor', phone: '0733-111-003', relation: 'Mother' }, transportRouteId: null },
    { id: 'stu-004', admNo: 'ADM-0055', firstName: 'Daudi', lastName: 'Wairimu', dob: '2013-01-14', gender: 'Male', grade: 'Grade 7', classId: 'cls-202', photo: null, status: 'active', enrolledDate: '2018-01-08', parentIds: ['usr-p004'], address: 'Sagana, Kirinyaga', medicalNotes: 'Allergic to peanuts', specialNeeds: '', previousSchool: 'Sagana Primary', documents: ['Birth Certificate'], emergencyContact: { name: 'Samuel Wairimu', phone: '0744-111-004', relation: 'Father' }, transportRouteId: 'rte-002' },
    { id: 'stu-005', admNo: 'ADM-0067', firstName: 'Eunice', lastName: 'Kipchoge', dob: '2010-11-02', gender: 'Female', grade: 'Grade 10', classId: 'cls-301', photo: null, status: 'active', enrolledDate: '2015-01-05', parentIds: ['usr-p005'], address: 'Kerugoya, Kirinyaga', medicalNotes: '', specialNeeds: '', previousSchool: 'Kerugoya Primary', documents: ['Birth Certificate', 'KCPE Certificate', 'KCSE Transcript'], emergencyContact: { name: 'Susan Kipchoge', phone: '0755-111-005', relation: 'Mother' }, transportRouteId: null },
    { id: 'stu-006', admNo: 'ADM-0078', firstName: 'Farida', lastName: 'Nyambura', dob: '2011-06-16', gender: 'Female', grade: 'Grade 10', classId: 'cls-302', photo: null, status: 'active', enrolledDate: '2016-01-04', parentIds: ['usr-p006'], address: 'Kutus Town, Kirinyaga', medicalNotes: '', specialNeeds: '', previousSchool: 'Kutus Primary', documents: ['Birth Certificate', 'KCPE Certificate'], emergencyContact: { name: 'Ali Nyambura', phone: '0766-111-006', relation: 'Father' }, transportRouteId: 'rte-003' },
    { id: 'stu-007', admNo: 'ADM-0089', firstName: 'Gitonga', lastName: 'Odhiambo', dob: '2008-04-28', gender: 'Male', grade: 'Grade 12', classId: 'cls-401', photo: null, status: 'active', enrolledDate: '2013-01-07', parentIds: ['usr-p007'], address: 'Kagio, Kirinyaga', medicalNotes: '', specialNeeds: '', previousSchool: 'Kagio Primary', documents: ['Birth Certificate', 'KCPE Certificate', 'KCSE Transcript'], emergencyContact: { name: 'John Odhiambo', phone: '0777-111-007', relation: 'Father' }, transportRouteId: null },
    { id: 'stu-008', admNo: 'ADM-0012', firstName: 'Hannah', lastName: 'Wanjala', dob: '2009-12-07', gender: 'Female', grade: 'Grade 12', classId: 'cls-401', photo: null, status: 'active', enrolledDate: '2014-01-06', parentIds: ['usr-p008'], address: 'Kerugoya, Kirinyaga', medicalNotes: '', specialNeeds: '', previousSchool: 'Kerugoya Primary', documents: ['Birth Certificate', 'KCPE Certificate', 'KCSE Transcript'], emergencyContact: { name: 'David Wanjala', phone: '0788-111-008', relation: 'Father' }, transportRouteId: 'rte-001' },
    { id: 'stu-009', admNo: 'ADM-0101', firstName: 'Ibrahim', lastName: 'Mwenda', dob: '2014-02-19', gender: 'Male', grade: 'Grade 4', classId: 'cls-101', photo: null, status: 'active', enrolledDate: '2019-01-07', parentIds: ['usr-p009'], address: 'Wanguru, Kirinyaga', medicalNotes: '', specialNeeds: '', previousSchool: 'Wanguru Nursery', documents: ['Birth Certificate', 'Immunization Card'], emergencyContact: { name: 'Mary Mwenda', phone: '0799-111-009', relation: 'Mother' }, transportRouteId: 'rte-002' },
    { id: 'stu-010', admNo: 'ADM-0115', firstName: 'Joyce', lastName: 'Kamau', dob: '2015-05-23', gender: 'Female', grade: 'Grade 4', classId: 'cls-102', photo: null, status: 'active', enrolledDate: '2020-01-06', parentIds: ['usr-p010'], address: 'Sagana, Kirinyaga', medicalNotes: '', specialNeeds: '', previousSchool: 'Sagana Nursery', documents: ['Birth Certificate'], emergencyContact: { name: 'George Kamau', phone: '0700-111-010', relation: 'Father' }, transportRouteId: 'rte-003' },
    { id: 'stu-011', admNo: 'ADM-0122', firstName: 'Kevin', lastName: 'Mutiso', dob: '2012-08-11', gender: 'Male', grade: 'Grade 7', classId: 'cls-201', photo: null, status: 'active', enrolledDate: '2017-01-09', parentIds: [], address: 'Kagio, Kirinyaga', medicalNotes: 'Type 1 Diabetes — glucose kit in class', specialNeeds: 'Needs blood sugar checks at break', previousSchool: 'Kagio Primary', documents: ['Birth Certificate', 'KCPE Certificate', 'Medical Report'], emergencyContact: { name: 'Rose Mutiso', phone: '0711-222-001', relation: 'Mother' }, transportRouteId: null },
    { id: 'stu-012', admNo: 'ADM-0133', firstName: 'Lydia', lastName: 'Waithera', dob: '2011-04-03', gender: 'Female', grade: 'Grade 10', classId: 'cls-301', photo: null, status: 'active', enrolledDate: '2016-01-04', parentIds: [], address: 'Kerugoya, Kirinyaga', medicalNotes: '', specialNeeds: '', previousSchool: 'Kerugoya Primary', documents: ['Birth Certificate', 'KCPE Certificate'], emergencyContact: { name: 'James Waithera', phone: '0722-333-002', relation: 'Father' }, transportRouteId: 'rte-002' },
  ]

  const users: SystemUser[] = [
    { id: 'usr-a001', name: 'Dr. Wanjiku Mwangi', email: 'admin@alberschool.ke', role: 'admin', status: 'active', lastLogin: new Date(Date.now() - 3600000).toISOString(), createdAt: '2020-01-01T00:00:00Z', permissions: ['*'], linkedId: null, phone: '0700-000-001', avatar: null },
    { id: 'usr-a002', name: 'Albert Njeru', email: 'director@alberschool.ke', role: 'admin', status: 'active', lastLogin: new Date(Date.now() - 86400000).toISOString(), createdAt: '2020-01-01T00:00:00Z', permissions: ['*'], linkedId: null, phone: '0700-000-002', avatar: null },
    { id: 'usr-t001', name: 'James Ochieng', email: 'teacher@alberschool.ke', role: 'teacher', status: 'active', lastLogin: new Date(Date.now() - 7200000).toISOString(), createdAt: '2020-01-01T00:00:00Z', permissions: ['grades:write','attendance:write','assignments:write'], linkedId: 'stf-001', phone: '0712-001-001', avatar: null },
    { id: 'usr-t002', name: 'Mary Kamau', email: 'm.kamau@alberschool.ke', role: 'teacher', status: 'active', lastLogin: new Date(Date.now() - 43200000).toISOString(), createdAt: '2020-01-01T00:00:00Z', permissions: ['grades:write','attendance:write','assignments:write'], linkedId: 'stf-002', phone: '0722-002-002', avatar: null },
    { id: 'usr-p001', name: 'Grace Njeri', email: 'parent@alberschool.ke', role: 'parent', status: 'active', lastLogin: new Date(Date.now() - 10800000).toISOString(), createdAt: '2020-01-01T00:00:00Z', permissions: ['fees:read','grades:read','attendance:read'], linkedId: 'stu-001', phone: '0712-111-001', avatar: null },
    { id: 'usr-p002', name: 'Peter Muthoni', email: 'p.muthoni@gmail.com', role: 'parent', status: 'active', lastLogin: new Date(Date.now() - 172800000).toISOString(), createdAt: '2020-01-01T00:00:00Z', permissions: ['fees:read','grades:read','attendance:read'], linkedId: 'stu-002', phone: '0722-111-002', avatar: null },
    { id: 'usr-p003', name: 'Ruth Oduor', email: 'r.oduor@gmail.com', role: 'parent', status: 'active', lastLogin: new Date(Date.now() - 259200000).toISOString(), createdAt: '2019-01-01T00:00:00Z', permissions: ['fees:read','grades:read','attendance:read'], linkedId: 'stu-003', phone: '0733-111-003', avatar: null },
    { id: 'usr-s001', name: 'Amani Kariuki', email: 'student@alberschool.ke', role: 'student', status: 'active', lastLogin: new Date(Date.now() - 3600000).toISOString(), createdAt: '2020-01-01T00:00:00Z', permissions: ['grades:read','homework:read','timetable:read'], linkedId: 'stu-001', phone: '', avatar: null },
    ...staff.map((s, i) => ({
      id: `usr-stf-${s.id}`,
      name: `${s.firstName} ${s.lastName}`,
      email: s.email,
      role: 'teacher' as UserRole,
      status: s.status === 'active' ? 'active' as UserStatus : 'inactive' as UserStatus,
      lastLogin: i === 0 ? new Date(Date.now() - 3600000).toISOString() : null,
      createdAt: s.employedDate + 'T00:00:00Z',
      permissions: ['grades:write','attendance:write'],
      linkedId: s.id,
      phone: s.phone,
      avatar: null,
    })),
  ]

  const academicYears: AcademicYear[] = [
    {
      id: YEAR_ID,
      label: '2026',
      isCurrent: true,
      terms: [
        { id: 'TERM-2026-T1', label: 'Term 1', startDate: '2026-01-06', endDate: '2026-04-03', isCurrent: false },
        { id: TERM_ID, label: 'Term 2', startDate: '2026-04-27', endDate: '2026-07-31', isCurrent: true },
        { id: 'TERM-2026-T3', label: 'Term 3', startDate: '2026-09-07', endDate: '2026-11-20', isCurrent: false },
      ],
    },
    {
      id: 'YEAR-2025',
      label: '2025',
      isCurrent: false,
      terms: [
        { id: 'TERM-2025-T1', label: 'Term 1', startDate: '2025-01-06', endDate: '2025-04-03', isCurrent: false },
        { id: 'TERM-2025-T2', label: 'Term 2', startDate: '2025-04-28', endDate: '2025-07-25', isCurrent: false },
        { id: 'TERM-2025-T3', label: 'Term 3', startDate: '2025-09-08', endDate: '2025-11-21', isCurrent: false },
      ],
    },
    {
      id: 'YEAR-2024',
      label: '2024',
      isCurrent: false,
      terms: [
        { id: 'TERM-2024-T1', label: 'Term 1', startDate: '2024-01-08', endDate: '2024-04-05', isCurrent: false },
        { id: 'TERM-2024-T2', label: 'Term 2', startDate: '2024-04-29', endDate: '2024-07-26', isCurrent: false },
        { id: 'TERM-2024-T3', label: 'Term 3', startDate: '2024-09-09', endDate: '2024-11-22', isCurrent: false },
      ],
    },
  ]

  const feeStructures: FeeStructure[] = [
    { id: 'fee-01', level: 'Daycare', tuition: 18000, transport: 6000, activities: 2500, termId: TERM_ID },
    { id: 'fee-02', level: 'Grade 1–3', tuition: 32000, transport: 8000, activities: 3500, termId: TERM_ID },
    { id: 'fee-03', level: 'Grade 4–6', tuition: 40000, transport: 8000, activities: 4000, termId: TERM_ID },
    { id: 'fee-04', level: 'Grade 7–9', tuition: 65000, transport: 10000, activities: 5000, termId: TERM_ID },
    { id: 'fee-05', level: 'Grade 10–12 (CBC)', tuition: 85000, transport: 10000, activities: 6000, termId: TERM_ID },
    { id: 'fee-06', level: 'IGCSE', tuition: 120000, transport: 10000, activities: 8000, termId: TERM_ID },
  ]

  const payments: Payment[] = [
    { id: 'PAY-001', date: '2026-05-27', time: '08:14', studentId: 'stu-001', studentName: 'Amani Kariuki', studentAdmNo: 'ADM-0041', parentName: 'Grace Njeri', phone: '0712-111-001', amount: 40000, description: 'Term 2 Tuition Balance', method: 'M-Pesa', reference: 'QHJ8K2M1X3', status: 'completed', termId: TERM_ID, invoiceId: 'INV-001' },
    { id: 'PAY-002', date: '2026-05-27', time: '09:30', studentId: 'stu-002', studentName: 'Baraka Muthoni', studentAdmNo: 'ADM-0022', parentName: 'Peter Muthoni', phone: '0722-111-002', amount: 15000, description: 'Transport Levy T2', method: 'M-Pesa', reference: 'QHJ8L5N2P4', status: 'completed', termId: TERM_ID, invoiceId: 'INV-002' },
    { id: 'PAY-003', date: '2026-05-26', time: '14:45', studentId: 'stu-003', studentName: 'Cherono Oduor', studentAdmNo: 'ADM-0033', parentName: 'Ruth Oduor', phone: '0733-111-003', amount: 120000, description: 'Term 2 Full Tuition', method: 'Bank Transfer', reference: 'BANK-2026-003', status: 'completed', termId: TERM_ID, invoiceId: 'INV-003' },
    { id: 'PAY-004', date: '2026-05-26', time: '11:00', studentId: 'stu-004', studentName: 'Daudi Wairimu', studentAdmNo: 'ADM-0055', parentName: 'Samuel Wairimu', phone: '0744-111-004', amount: 8500, description: 'Activity Fee', method: 'M-Pesa', reference: 'QHJ8M7P3R5', status: 'pending', termId: TERM_ID, invoiceId: 'INV-004' },
    { id: 'PAY-005', date: '2026-05-25', time: '16:20', studentId: 'stu-005', studentName: 'Eunice Kipchoge', studentAdmNo: 'ADM-0067', parentName: 'Susan Kipchoge', phone: '0755-111-005', amount: 120000, description: 'Term 2 Full Tuition', method: 'M-Pesa', reference: 'QHJ9A2B4D6', status: 'completed', termId: TERM_ID, invoiceId: 'INV-005' },
    { id: 'PAY-006', date: '2026-05-25', time: '10:05', studentId: 'stu-006', studentName: 'Farida Nyambura', studentAdmNo: 'ADM-0078', parentName: 'Ali Nyambura', phone: '0766-111-006', amount: 40000, description: 'Term 2 Tuition Balance', method: 'M-Pesa', reference: 'QHJ9C3D5E7', status: 'failed', termId: TERM_ID, invoiceId: 'INV-006' },
    { id: 'PAY-007', date: '2026-05-24', time: '08:55', studentId: 'stu-007', studentName: 'Gitonga Odhiambo', studentAdmNo: 'ADM-0089', parentName: 'John Odhiambo', phone: '0777-111-007', amount: 25000, description: 'Partial Term 2 Tuition', method: 'Cash', reference: 'CASH-0007', status: 'completed', termId: TERM_ID, invoiceId: 'INV-007' },
    { id: 'PAY-008', date: '2026-05-24', time: '13:30', studentId: 'stu-008', studentName: 'Hannah Wanjala', studentAdmNo: 'ADM-0012', parentName: 'David Wanjala', phone: '0788-111-008', amount: 135000, description: 'Term 2 Full + Transport', method: 'M-Pesa', reference: 'QHJ9F4G6H8', status: 'completed', termId: TERM_ID, invoiceId: 'INV-008' },
    { id: 'PAY-009', date: '2026-05-23', time: '15:10', studentId: 'stu-009', studentName: 'Ibrahim Mwenda', studentAdmNo: 'ADM-0101', parentName: 'Mary Mwenda', phone: '0799-111-009', amount: 15000, description: 'Transport Levy T2', method: 'M-Pesa', reference: 'QHJ9H5I7J9', status: 'completed', termId: TERM_ID, invoiceId: 'INV-009' },
    { id: 'PAY-010', date: '2026-05-22', time: '09:00', studentId: 'stu-010', studentName: 'Joyce Kamau', studentAdmNo: 'ADM-0115', parentName: 'George Kamau', phone: '0700-111-010', amount: 120000, description: 'Term 2 Full Tuition', method: 'Bank Transfer', reference: 'BANK-2026-010', status: 'pending', termId: TERM_ID, invoiceId: 'INV-010' },
    { id: 'PAY-011', date: '2026-05-20', time: '11:30', studentId: 'stu-011', studentName: 'Kevin Mutiso', studentAdmNo: 'ADM-0122', parentName: 'Rose Mutiso', phone: '0711-222-001', amount: 65000, description: 'Term 2 Full Tuition Gr7', method: 'M-Pesa', reference: 'QHJ9J6K8L0', status: 'completed', termId: TERM_ID, invoiceId: 'INV-011' },
    { id: 'PAY-012', date: '2026-05-18', time: '08:00', studentId: 'stu-012', studentName: 'Lydia Waithera', studentAdmNo: 'ADM-0133', parentName: 'James Waithera', phone: '0722-333-002', amount: 42500, description: 'Partial Tuition', method: 'Bank Transfer', reference: 'BANK-2026-012', status: 'completed', termId: TERM_ID, invoiceId: 'INV-012' },
  ]

  const invoices: Invoice[] = students.map((s, i) => {
    const feeLevel = s.grade.startsWith('Grade 12') ? feeStructures[5] : s.grade.startsWith('Grade 10') ? feeStructures[4] : s.grade.startsWith('Grade 7') ? feeStructures[3] : feeStructures[2]
    const total = feeLevel.tuition + (s.transportRouteId ? feeLevel.transport : 0) + feeLevel.activities
    const studentPayments = payments.filter(p => p.studentId === s.id && p.status === 'completed')
    const paid = studentPayments.reduce((a, b) => a + b.amount, 0)
    const balance = Math.max(0, total - paid)
    return {
      id: `INV-${String(i + 1).padStart(3, '0')}`,
      studentId: s.id,
      studentName: `${s.firstName} ${s.lastName}`,
      admNo: s.admNo,
      termId: TERM_ID,
      lineItems: [
        { description: 'Tuition Fee', amount: feeLevel.tuition },
        ...(s.transportRouteId ? [{ description: 'Transport Levy', amount: feeLevel.transport }] : []),
        { description: 'Activity Fee', amount: feeLevel.activities },
      ],
      totalAmount: total,
      paidAmount: paid,
      balance,
      status: balance === 0 ? 'paid' : paid === 0 ? (new Date() > new Date('2026-05-15') ? 'overdue' : 'unpaid') : 'partial',
      dueDate: '2026-05-15',
      issuedDate: '2026-04-27',
      discountAmount: 0,
      discountReason: '',
    }
  })

  const scholarships: Scholarship[] = [
    { id: 'sch-001', studentId: 'stu-011', studentName: 'Kevin Mutiso', type: 'percentage', value: 30, reason: 'Medical hardship bursary', startTerm: 'TERM-2026-T1', endTerm: null, status: 'active', approvedBy: 'Dr. Wanjiku Mwangi', createdAt: '2026-01-10T09:00:00Z' },
    { id: 'sch-002', studentId: 'stu-007', studentName: 'Gitonga Odhiambo', type: 'fixed', value: 20000, reason: 'Academic excellence award', startTerm: TERM_ID, endTerm: 'TERM-2026-T3', status: 'active', approvedBy: 'Dr. Wanjiku Mwangi', createdAt: '2026-04-27T08:00:00Z' },
  ]

  const expenses: Expense[] = [
    { id: 'exp-001', date: '2026-05-20', category: 'Utilities', description: 'Kenya Power electricity bill — May 2026', amount: 48500, payee: 'Kenya Power', approvedBy: 'Dr. Wanjiku Mwangi', receiptNo: 'KP-20260520', status: 'approved' },
    { id: 'exp-002', date: '2026-05-18', category: 'Supplies', description: 'Lab chemicals and equipment restock', amount: 32000, payee: 'Scientific Supplies Ltd', approvedBy: 'Dr. Wanjiku Mwangi', receiptNo: 'SSL-20260518', status: 'approved' },
    { id: 'exp-003', date: '2026-05-15', category: 'Maintenance', description: 'Roof repair — Block B classrooms', amount: 125000, payee: 'Kirinyaga Contractors', approvedBy: 'Albert Njeru', receiptNo: 'KC-20260515', status: 'approved' },
    { id: 'exp-004', date: '2026-05-10', category: 'Salaries', description: 'May 2026 support staff salaries', amount: 380000, payee: 'Various', approvedBy: 'Albert Njeru', receiptNo: 'PAY-MAY-2026', status: 'approved' },
    { id: 'exp-005', date: '2026-05-28', category: 'Transport', description: 'Bus fuel and servicing — May', amount: 28000, payee: 'Kutus Petrol Station', approvedBy: 'Dr. Wanjiku Mwangi', receiptNo: 'KPS-20260528', status: 'pending' },
    { id: 'exp-006', date: '2026-05-25', category: 'Library', description: 'New textbooks — CBC Grade 7 & 8', amount: 67000, payee: 'Longhorn Publishers', approvedBy: 'Dr. Wanjiku Mwangi', receiptNo: 'LP-20260525', status: 'approved' },
  ]

  const messages: Message[] = [
    { id: 'msg-001', fromId: 'usr-p001', fromName: 'Grace Njeri', fromRole: 'parent', toId: 'usr-t001', toName: 'James Ochieng', toRole: 'teacher', subject: 'Re: Amani attendance concern', body: 'Thank you Mr. Ochieng. Amani was sick last week but is better now. He will be back Monday.', sentAt: new Date(Date.now() - 7200000).toISOString(), readAt: new Date(Date.now() - 3600000).toISOString(), threadId: 'thr-001' },
    { id: 'msg-002', fromId: 'usr-t001', fromName: 'James Ochieng', fromRole: 'teacher', toId: 'usr-p001', toName: 'Grace Njeri', toRole: 'parent', subject: 'Re: Amani attendance concern', body: 'Glad to hear. Please bring a sick note from the doctor when he returns. His Chemistry CAT is on Wednesday.', sentAt: new Date(Date.now() - 5400000).toISOString(), readAt: null, threadId: 'thr-001' },
    { id: 'msg-003', fromId: 'usr-p003', fromName: 'Ruth Oduor', fromRole: 'parent', toId: 'usr-a001', toName: 'Dr. Wanjiku Mwangi', toRole: 'admin', subject: 'Transport delay complaint', body: 'The bus on Route 1 has been arriving 30 minutes late for the past week. Could you look into this?', sentAt: new Date(Date.now() - 86400000).toISOString(), readAt: null, threadId: 'thr-002' },
    { id: 'msg-004', fromId: 'usr-t002', fromName: 'Mary Kamau', fromRole: 'teacher', toId: 'usr-a001', toName: 'Dr. Wanjiku Mwangi', toRole: 'admin', subject: 'Leave application support', body: 'Dr. Mwangi, I submitted a leave request for next week. Please review at your earliest convenience.', sentAt: new Date(Date.now() - 172800000).toISOString(), readAt: new Date(Date.now() - 100000000).toISOString(), threadId: 'thr-003' },
    { id: 'msg-005', fromId: 'usr-p002', fromName: 'Peter Muthoni', fromRole: 'parent', toId: 'usr-a001', toName: 'Dr. Wanjiku Mwangi', toRole: 'admin', subject: 'Fee payment plan request', body: 'Dear Dr. Mwangi, due to financial constraints I would like to request a payment plan for Term 2 fees. Baraka is in Grade 4B.', sentAt: new Date(Date.now() - 259200000).toISOString(), readAt: null, threadId: 'thr-004' },
  ]

  const announcements: Announcement[] = [
    { id: 'ann-001', title: 'Term 2 Reopening — 27 April 2026', body: 'Dear parents and guardians, Term 2 begins on Monday 27 April 2026. All students should report by 7:30 AM in full uniform. School buses will resume normal operations.', targetRoles: ['parent', 'student', 'teacher'], targetGrades: [], priority: 'high', publishAt: '2026-04-20T08:00:00Z', expiresAt: '2026-04-28T00:00:00Z', status: 'published', createdBy: 'Dr. Wanjiku Mwangi', createdAt: '2026-04-18T10:00:00Z', readCount: 189 },
    { id: 'ann-002', title: 'Mid-Term Examinations Schedule — Week 6', body: 'Mid-term examinations will be held from 2–6 June 2026. Timetables are available from class teachers. Students should revise thoroughly.', targetRoles: ['parent', 'student', 'teacher'], targetGrades: [], priority: 'high', publishAt: '2026-05-20T08:00:00Z', expiresAt: '2026-06-08T00:00:00Z', status: 'published', createdBy: 'Dr. Wanjiku Mwangi', createdAt: '2026-05-19T14:00:00Z', readCount: 234 },
    { id: 'ann-003', title: 'Staff Meeting — 30 May 2026', body: 'All teaching staff are required to attend the term review meeting on Friday 30 May 2026 at 3:00 PM in the staffroom. Attendance is mandatory.', targetRoles: ['teacher'], targetGrades: [], priority: 'normal', publishAt: '2026-05-25T08:00:00Z', expiresAt: '2026-05-31T00:00:00Z', status: 'published', createdBy: 'Dr. Wanjiku Mwangi', createdAt: '2026-05-24T09:00:00Z', readCount: 12 },
    { id: 'ann-004', title: 'Science Fair — Registration Open', body: 'The Annual Demo School Science Fair is on 15 July 2026. Students from Grade 7–12 can register their projects before 15 June. Forms available from HODs.', targetRoles: ['student', 'teacher', 'parent'], targetGrades: ['Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'], priority: 'normal', publishAt: '2026-05-28T08:00:00Z', expiresAt: '2026-06-16T00:00:00Z', status: 'published', createdBy: 'Dr. Wanjiku Mwangi', createdAt: '2026-05-27T11:00:00Z', readCount: 67 },
    { id: 'ann-005', title: 'Fee Deadline Reminder', body: 'This is a reminder that Term 2 fees are due by 15 May 2026. Parents with outstanding balances should clear them or contact the bursar to make payment arrangements.', targetRoles: ['parent'], targetGrades: [], priority: 'urgent', publishAt: '2026-05-12T08:00:00Z', expiresAt: '2026-05-31T00:00:00Z', status: 'published', createdBy: 'Dr. Wanjiku Mwangi', createdAt: '2026-05-11T16:00:00Z', readCount: 98 },
  ]

  const meetingSlots: MeetingSlot[] = [
    { id: 'msl-001', teacherId: 'stf-001', teacherName: 'James Ochieng', date: '2026-06-05', startTime: '14:00', endTime: '14:30', bookedByParentId: 'usr-p001', bookedByParentName: 'Grace Njeri', studentId: 'stu-001', status: 'booked', notes: 'Discuss Amani mid-term performance' },
    { id: 'msl-002', teacherId: 'stf-001', teacherName: 'James Ochieng', date: '2026-06-05', startTime: '14:30', endTime: '15:00', bookedByParentId: null, bookedByParentName: null, studentId: null, status: 'available', notes: '' },
    { id: 'msl-003', teacherId: 'stf-001', teacherName: 'James Ochieng', date: '2026-06-05', startTime: '15:00', endTime: '15:30', bookedByParentId: null, bookedByParentName: null, studentId: null, status: 'available', notes: '' },
    { id: 'msl-004', teacherId: 'stf-002', teacherName: 'Mary Kamau', date: '2026-06-06', startTime: '13:00', endTime: '13:30', bookedByParentId: 'usr-p003', bookedByParentName: 'Ruth Oduor', studentId: 'stu-003', status: 'booked', notes: 'English essay concerns' },
    { id: 'msl-005', teacherId: 'stf-002', teacherName: 'Mary Kamau', date: '2026-06-06', startTime: '13:30', endTime: '14:00', bookedByParentId: null, bookedByParentName: null, studentId: null, status: 'available', notes: '' },
    { id: 'msl-006', teacherId: 'stf-003', teacherName: 'Grace Wanjiku', date: '2026-06-07', startTime: '14:00', endTime: '14:30', bookedByParentId: null, bookedByParentName: null, studentId: null, status: 'available', notes: '' },
  ]

  const leaveRequests: LeaveRequest[] = [
    { id: 'lv-001', staffId: 'stf-006', staffName: 'Ann Muthoni', type: 'maternity', startDate: '2026-05-01', endDate: '2026-08-01', reason: 'Maternity leave — first child', status: 'approved', submittedAt: '2026-03-15T10:00:00Z', reviewedBy: 'Dr. Wanjiku Mwangi', reviewedAt: '2026-03-18T09:00:00Z', reviewNotes: 'Approved. Please coordinate with Deputy Principal for class cover.' },
    { id: 'lv-002', staffId: 'stf-002', staffName: 'Mary Kamau', type: 'sick', startDate: '2026-06-02', endDate: '2026-06-04', reason: 'Medical appointment and recovery', status: 'pending', submittedAt: new Date(Date.now() - 172800000).toISOString(), reviewedBy: null, reviewedAt: null, reviewNotes: '' },
    { id: 'lv-003', staffId: 'stf-005', staffName: 'Peter Njeru', type: 'annual', startDate: '2026-07-28', endDate: '2026-08-08', reason: 'Annual leave during school holiday', status: 'pending', submittedAt: new Date(Date.now() - 86400000).toISOString(), reviewedBy: null, reviewedAt: null, reviewNotes: '' },
    { id: 'lv-004', staffId: 'stf-009', staffName: 'John Odhiambo', type: 'study', startDate: '2026-06-20', endDate: '2026-06-22', reason: 'CBC curriculum training workshop — Nairobi', status: 'approved', submittedAt: '2026-05-20T08:00:00Z', reviewedBy: 'Dr. Wanjiku Mwangi', reviewedAt: '2026-05-22T10:00:00Z', reviewNotes: 'Approved. Travel allowance approved — present certificate on return.' },
  ]

  const transportRoutes: TransportRoute[] = [
    { id: 'rte-001', name: 'Route 1 — Kutus Central', description: 'Covers Kutus Town, Market area, and nearby estates', stops: ['School Gate', 'Kutus Market', 'Barclays Corner', 'Kutus Police', 'Shell Petrol'], vehicleId: 'veh-001', driverId: 'drv-001', driverName: 'Moses Kamau', driverPhone: '0711-555-001', capacity: 40, feePerTerm: 8000, status: 'active' },
    { id: 'rte-002', name: 'Route 2 — Wanguru–Sagana', description: 'Covers Wanguru town and Sagana areas', stops: ['School Gate', 'Wanguru Junction', 'Wanguru Market', 'Sagana Town', 'Sagana Bridge'], vehicleId: 'veh-002', driverId: 'drv-002', driverName: 'Joseph Ngugi', driverPhone: '0722-555-002', capacity: 35, feePerTerm: 10000, status: 'active' },
    { id: 'rte-003', name: 'Route 3 — Kerugoya', description: 'Serves Kerugoya and surrounding residential areas', stops: ['School Gate', 'Kagio Junction', 'Kerugoya Town', 'County Hospital', 'Kerugoya Market'], vehicleId: 'veh-003', driverId: 'drv-003', driverName: 'Paul Waweru', driverPhone: '0733-555-003', capacity: 45, feePerTerm: 10000, status: 'active' },
  ]

  const vehicles: Vehicle[] = [
    { id: 'veh-001', registration: 'KCH 123A', make: 'Isuzu', model: 'NQR (School Bus)', capacity: 40, routeId: 'rte-001', status: 'active', lastService: '2026-03-01', nextService: '2026-09-01' },
    { id: 'veh-002', registration: 'KDD 456B', make: 'Nissan', model: 'Civilian', capacity: 35, routeId: 'rte-002', status: 'active', lastService: '2026-04-15', nextService: '2026-10-15' },
    { id: 'veh-003', registration: 'KEB 789C', make: 'Toyota', model: 'Coaster', capacity: 45, routeId: 'rte-003', status: 'active', lastService: '2026-02-20', nextService: '2026-08-20' },
    { id: 'veh-004', registration: 'KDB 321D', make: 'Isuzu', model: 'NQR (Reserve)', capacity: 40, routeId: null, status: 'maintenance', lastService: '2026-01-10', nextService: '2026-07-10' },
  ]

  const books: Book[] = [
    { id: 'bk-001', isbn: '978-9966-47-001-1', title: 'Mathematics Today Grade 7', author: 'Various', category: 'Textbook', publisher: 'Kenya Literature Bureau', year: 2022, totalCopies: 40, availableCopies: 34, location: 'Shelf A1', status: 'available' },
    { id: 'bk-002', isbn: '978-9966-47-002-2', title: 'Longhorn Biology Form 1', author: 'Various', category: 'Textbook', publisher: 'Longhorn Publishers', year: 2021, totalCopies: 38, availableCopies: 38, location: 'Shelf A2', status: 'available' },
    { id: 'bk-003', isbn: '978-9966-47-003-3', title: 'Chemistry Form 2 Revision', author: 'Mwangi & Ochieng', category: 'Revision', publisher: 'Spotlight Publishers', year: 2023, totalCopies: 25, availableCopies: 18, location: 'Shelf B1', status: 'available' },
    { id: 'bk-004', isbn: '978-9966-47-004-4', title: 'English Grammar & Composition', author: 'Collins', category: 'Textbook', publisher: 'Oxford University Press', year: 2020, totalCopies: 50, availableCopies: 44, location: 'Shelf A3', status: 'available' },
    { id: 'bk-005', isbn: '978-9966-47-005-5', title: 'Kiswahili Kwa Shule Grade 8', author: 'Various', category: 'Textbook', publisher: 'Kenya Literature Bureau', year: 2022, totalCopies: 35, availableCopies: 35, location: 'Shelf A4', status: 'available' },
    { id: 'bk-006', isbn: '978-0-330-45153-2', title: 'Things Fall Apart', author: 'Chinua Achebe', category: 'Literature', publisher: 'Heinemann', year: 1958, totalCopies: 15, availableCopies: 11, location: 'Shelf C1', status: 'available' },
    { id: 'bk-007', isbn: '978-9966-47-007-7', title: 'Kenya History & Government', author: 'Ochieng & Maxon', category: 'Textbook', publisher: 'East African Publishers', year: 2019, totalCopies: 30, availableCopies: 27, location: 'Shelf B2', status: 'available' },
    { id: 'bk-008', isbn: '978-9966-47-008-8', title: 'Computer Studies Grade 10–12', author: 'Njoroge et al.', category: 'Textbook', publisher: 'Longhorn Publishers', year: 2023, totalCopies: 30, availableCopies: 23, location: 'Shelf D1', status: 'available' },
    { id: 'bk-009', isbn: '978-9966-47-009-9', title: 'CBC Science Grade 6', author: 'KLB', category: 'Textbook', publisher: 'Kenya Literature Bureau', year: 2022, totalCopies: 40, availableCopies: 40, location: 'Shelf A5', status: 'available' },
    { id: 'bk-010', isbn: '978-9966-47-010-3', title: 'Physics Form 3 Notes', author: 'Kamau & Waweru', category: 'Revision', publisher: 'Spotlight Publishers', year: 2022, totalCopies: 20, availableCopies: 20, location: 'Shelf B3', status: 'available' },
    { id: 'bk-011', isbn: '978-0-14-028329-7', title: 'Animal Farm', author: 'George Orwell', category: 'Literature', publisher: 'Penguin', year: 1945, totalCopies: 12, availableCopies: 9, location: 'Shelf C2', status: 'available' },
    { id: 'bk-012', isbn: '978-9966-47-012-7', title: 'Business Studies Form 4', author: 'Various', category: 'Textbook', publisher: 'Kenya Literature Bureau', year: 2021, totalCopies: 28, availableCopies: 28, location: 'Shelf D2', status: 'available' },
  ]

  const borrowings: Borrowing[] = [
    { id: 'bor-001', bookId: 'bk-001', bookTitle: 'Mathematics Today Grade 7', borrowerId: 'stu-003', borrowerName: 'Cherono Oduor', borrowerType: 'student', issuedDate: '2026-05-15', dueDate: '2026-05-29', returnedDate: null, status: 'overdue' },
    { id: 'bor-002', bookId: 'bk-001', bookTitle: 'Mathematics Today Grade 7', borrowerId: 'stu-004', borrowerName: 'Daudi Wairimu', borrowerType: 'student', issuedDate: '2026-05-20', dueDate: '2026-06-03', returnedDate: null, status: 'active' },
    { id: 'bor-003', bookId: 'bk-003', bookTitle: 'Chemistry Form 2 Revision', borrowerId: 'stu-005', borrowerName: 'Eunice Kipchoge', borrowerType: 'student', issuedDate: '2026-05-10', dueDate: '2026-05-24', returnedDate: '2026-05-23', status: 'returned' },
    { id: 'bor-004', bookId: 'bk-006', bookTitle: 'Things Fall Apart', borrowerId: 'stu-007', borrowerName: 'Gitonga Odhiambo', borrowerType: 'student', issuedDate: '2026-05-22', dueDate: '2026-06-05', returnedDate: null, status: 'active' },
    { id: 'bor-005', bookId: 'bk-008', bookTitle: 'Computer Studies Grade 10–12', borrowerId: 'stf-005', borrowerName: 'Peter Njeru', borrowerType: 'staff', issuedDate: '2026-05-01', dueDate: '2026-06-01', returnedDate: null, status: 'active' },
    { id: 'bor-006', bookId: 'bk-011', bookTitle: 'Animal Farm', borrowerId: 'stu-008', borrowerName: 'Hannah Wanjala', borrowerType: 'student', issuedDate: '2026-05-25', dueDate: '2026-06-08', returnedDate: null, status: 'active' },
  ]

  const assessmentSchemes: AssessmentScheme[] = [
    { id: 'asc-001', name: 'CBC Primary (Grade 1–6)', grade: 'Grade 1–6', components: [{ name: 'Formative Assessment', weight: 40 }, { name: 'Summative Assessment', weight: 60 }] },
    { id: 'asc-002', name: 'CBC Junior Secondary (Grade 7–9)', grade: 'Grade 7–9', components: [{ name: 'CAT 1', weight: 20 }, { name: 'CAT 2', weight: 20 }, { name: 'End of Term Exam', weight: 60 }] },
    { id: 'asc-003', name: 'IGCSE (Grade 10–12)', grade: 'Grade 10–12', components: [{ name: 'Coursework', weight: 30 }, { name: 'Mid-Term Paper', weight: 20 }, { name: 'Final Exam', weight: 50 }] },
  ]

  const exams: Exam[] = [
    { id: 'exm-001', name: 'Mid-Term Examinations T2 2026', termId: TERM_ID, startDate: '2026-06-02', endDate: '2026-06-06', grades: ['Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'], status: 'scheduled', createdAt: '2026-05-15T09:00:00Z' },
    { id: 'exm-002', name: 'End of Term 1 2026', termId: 'TERM-2026-T1', startDate: '2026-03-24', endDate: '2026-03-28', grades: ['Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'], status: 'completed', createdAt: '2026-02-20T09:00:00Z' },
  ]

  const mediaAssets: MediaAsset[] = [
    { id: 'mda-001', name: 'school-hero-bg.jpg', url: '/images/unsplash-1580582932707-520aed937b7b.jpg', type: 'image', size: '2.1 MB', uploadedAt: '2026-01-15T10:00:00Z', uploadedBy: 'Dr. Wanjiku Mwangi', category: 'Hero', usedIn: ['Home Page'] },
    { id: 'mda-002', name: 'science-lab.jpg', url: '/images/unsplash-1567168544813-cc03465b4fa8.jpg', type: 'image', size: '1.4 MB', uploadedAt: '2026-02-10T11:00:00Z', uploadedBy: 'Dr. Wanjiku Mwangi', category: 'Facilities', usedIn: ['Facilities Page', 'Gallery'] },
    { id: 'mda-003', name: 'sports-day-2025.jpg', url: '/images/unsplash-1552674605-db6ffd4facb5.jpg', type: 'image', size: '3.2 MB', uploadedAt: '2026-03-05T14:00:00Z', uploadedBy: 'Dr. Wanjiku Mwangi', category: 'Sports', usedIn: ['Gallery'] },
    { id: 'mda-004', name: 'school-prospectus-2026.pdf', url: '#', type: 'document', size: '4.8 MB', uploadedAt: '2026-01-01T08:00:00Z', uploadedBy: 'Albert Njeru', category: 'Documents', usedIn: ['Admissions Page'] },
    { id: 'mda-005', name: 'music-performance.jpg', url: '/images/unsplash-1514320291840-2e0a9bf2a9ae.jpg', type: 'image', size: '1.8 MB', uploadedAt: '2026-04-20T16:00:00Z', uploadedBy: 'Dr. Wanjiku Mwangi', category: 'Arts', usedIn: ['Gallery', 'Co-Curricular'] },
  ]

  const auditLog: AuditEntry[] = [
    { id: 'aud-001', timestamp: new Date(Date.now() - 300000).toISOString(), userId: 'usr-a001', userName: 'Dr. Wanjiku Mwangi', userRole: 'admin', action: 'LOGIN', resource: 'Auth', resourceId: null, details: 'Admin login from web browser', ipAddress: '196.201.214.10', sessionId: 'sess-abc123' },
    { id: 'aud-002', timestamp: new Date(Date.now() - 600000).toISOString(), userId: 'usr-a001', userName: 'Dr. Wanjiku Mwangi', userRole: 'admin', action: 'CREATE', resource: 'Announcement', resourceId: 'ann-004', details: 'Created announcement: Science Fair — Registration Open', ipAddress: '196.201.214.10', sessionId: 'sess-abc123' },
    { id: 'aud-003', timestamp: new Date(Date.now() - 3600000).toISOString(), userId: 'usr-a001', userName: 'Dr. Wanjiku Mwangi', userRole: 'admin', action: 'UPDATE', resource: 'Admission', resourceId: 'adm-003', details: 'Changed status: pending → approved', ipAddress: '196.201.214.10', sessionId: 'sess-abc121' },
    { id: 'aud-004', timestamp: new Date(Date.now() - 7200000).toISOString(), userId: 'usr-t001', userName: 'James Ochieng', userRole: 'teacher', action: 'UPDATE', resource: 'Grades', resourceId: 'cls-201', details: 'Updated grades for 38 students in Grade 7A Chemistry', ipAddress: '196.201.214.55', sessionId: 'sess-xyz456' },
    { id: 'aud-005', timestamp: new Date(Date.now() - 86400000).toISOString(), userId: 'usr-a001', userName: 'Dr. Wanjiku Mwangi', userRole: 'admin', action: 'EXPORT', resource: 'Students', resourceId: null, details: 'Exported full student list (12 records) to CSV', ipAddress: '196.201.214.10', sessionId: 'sess-abc120' },
    { id: 'aud-006', timestamp: new Date(Date.now() - 172800000).toISOString(), userId: 'usr-a001', userName: 'Dr. Wanjiku Mwangi', userRole: 'admin', action: 'CREATE', resource: 'Scholarship', resourceId: 'sch-002', details: 'Scholarship granted to Gitonga Odhiambo — KES 20,000 fixed', ipAddress: '196.201.214.10', sessionId: 'sess-abc119' },
    { id: 'aud-007', timestamp: new Date(Date.now() - 259200000).toISOString(), userId: 'usr-a002', userName: 'Albert Njeru', userRole: 'admin', action: 'UPDATE', resource: 'FeeStructure', resourceId: 'fee-06', details: 'IGCSE tuition updated: KES 110,000 → KES 120,000', ipAddress: '196.201.214.11', sessionId: 'sess-dir001' },
  ]

  const settings: SystemSettings = {
    schoolName: 'Gatumbi SDA School',
    schoolMotto: 'Excellence Meets Tomorrow',
    address: 'Kutus Town, Kirinyaga County, Kenya',
    phone: '+254 712 345 678',
    email: 'info@alberschool.ke',
    website: 'https://alberschool.ke',
    whatsapp: '254712345678',
    logo: null,
    primaryColor: '#E8B84B',
    currentAcademicYearId: YEAR_ID,
    currentTermId: TERM_ID,
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: 'notifications@alberschool.ke',
    smtpEnabled: false,
    maintenanceMode: false,
    maintenanceMessage: 'We are performing scheduled maintenance. We will be back shortly.',
    lastBackup: null,
  }

  const admissions: AdmissionApplication[] = [
    { id: 'APP-001', childFirstName: 'Naomi', childLastName: 'Wangari', dob: '2016-04-10', gender: 'Female', applyingForGrade: 'Grade 3', parentFirstName: 'James', parentLastName: 'Wangari', parentEmail: 'j.wangari@gmail.com', parentPhone: '0712-200-001', address: 'Kutus Town, Kirinyaga', previousSchool: 'Kutus Nursery School', documents: ['Birth Certificate', 'Immunization Card'], status: 'pending', submittedDate: '2026-05-25', notes: '', assignedTo: null },
    { id: 'APP-002', childFirstName: 'Brian', childLastName: 'Otieno', dob: '2013-08-22', gender: 'Male', applyingForGrade: 'Grade 7', parentFirstName: 'Paul', parentLastName: 'Otieno', parentEmail: 'p.otieno@gmail.com', parentPhone: '0722-200-002', address: 'Kerugoya, Kirinyaga', previousSchool: 'Kerugoya Primary School', documents: ['Birth Certificate', 'KCPE Certificate', 'School Leaving Certificate'], status: 'reviewing', submittedDate: '2026-05-20', notes: 'Academic records look strong — 380 marks KCPE', assignedTo: 'Dr. Wanjiku Mwangi' },
    { id: 'APP-003', childFirstName: 'Cynthia', childLastName: 'Njoki', dob: '2010-11-05', gender: 'Female', applyingForGrade: 'Grade 10', parentFirstName: 'Daniel', parentLastName: 'Njoki', parentEmail: 'd.njoki@gmail.com', parentPhone: '0733-200-003', address: 'Wanguru, Kirinyaga', previousSchool: 'Wanguru Secondary School', documents: ['Birth Certificate', 'KCPE Certificate', 'KCSE Transcript', 'School Leaving Certificate'], status: 'approved', submittedDate: '2026-05-10', notes: 'Strong candidate — B+ average. Offer letter sent 15 May.', assignedTo: 'Dr. Wanjiku Mwangi' },
    { id: 'APP-004', childFirstName: 'Dennis', childLastName: 'Kibet', dob: '2016-02-14', gender: 'Male', applyingForGrade: 'Grade 3', parentFirstName: 'Simon', parentLastName: 'Kibet', parentEmail: 's.kibet@gmail.com', parentPhone: '0744-200-004', address: 'Sagana, Kirinyaga', previousSchool: 'Sagana Nursery School', documents: ['Birth Certificate'], status: 'pending', submittedDate: '2026-05-28', notes: '', assignedTo: null },
    { id: 'APP-005', childFirstName: 'Eva', childLastName: 'Mutua', dob: '2014-06-18', gender: 'Female', applyingForGrade: 'Grade 6', parentFirstName: 'Peter', parentLastName: 'Mutua', parentEmail: 'p.mutua@gmail.com', parentPhone: '0755-200-005', address: 'Kagio, Kirinyaga', previousSchool: 'Kagio Primary School', documents: ['Birth Certificate', 'Progress Report'], status: 'rejected', submittedDate: '2026-04-15', notes: 'Grade 6 class is at capacity. Invited to reapply for 2027.', assignedTo: 'Dr. Wanjiku Mwangi' },
  ]

  // ── Timetable Slots ────────────────────────────────────────────────────
  const timetableSlots: TimetableSlot[] = [
    // Grade 4A (cls-101) — Term 2 2026
    { id:'tsl-001', classId:'cls-101', subjectId:'sub-001', staffId:'stf-006', day:'Monday',    startTime:'07:30', endTime:'08:30', room:'A12',   termId:TERM_ID },
    { id:'tsl-002', classId:'cls-101', subjectId:'sub-002', staffId:'stf-003', day:'Monday',    startTime:'08:30', endTime:'09:30', room:'A12',   termId:TERM_ID },
    { id:'tsl-003', classId:'cls-101', subjectId:'sub-004', staffId:'stf-004', day:'Monday',    startTime:'10:00', endTime:'11:00', room:'Lab1',  termId:TERM_ID },
    { id:'tsl-004', classId:'cls-101', subjectId:'sub-003', staffId:'stf-003', day:'Monday',    startTime:'11:00', endTime:'12:00', room:'A12',   termId:TERM_ID },
    { id:'tsl-005', classId:'cls-101', subjectId:'sub-012', staffId:'stf-009', day:'Monday',    startTime:'13:00', endTime:'14:00', room:'Field', termId:TERM_ID },
    { id:'tsl-006', classId:'cls-101', subjectId:'sub-013', staffId:'stf-007', day:'Tuesday',   startTime:'07:30', endTime:'08:30', room:'A12',   termId:TERM_ID },
    { id:'tsl-007', classId:'cls-101', subjectId:'sub-010', staffId:'stf-005', day:'Tuesday',   startTime:'08:30', endTime:'09:30', room:'Lab2',  termId:TERM_ID },
    { id:'tsl-008', classId:'cls-101', subjectId:'sub-011', staffId:'stf-009', day:'Tuesday',   startTime:'10:00', endTime:'11:00', room:'Hall',  termId:TERM_ID },
    { id:'tsl-009', classId:'cls-101', subjectId:'sub-001', staffId:'stf-006', day:'Tuesday',   startTime:'11:00', endTime:'12:00', room:'A12',   termId:TERM_ID },
    { id:'tsl-010', classId:'cls-101', subjectId:'sub-002', staffId:'stf-003', day:'Tuesday',   startTime:'13:00', endTime:'14:00', room:'A12',   termId:TERM_ID },
    { id:'tsl-011', classId:'cls-101', subjectId:'sub-004', staffId:'stf-004', day:'Wednesday', startTime:'07:30', endTime:'08:30', room:'Lab1',  termId:TERM_ID },
    { id:'tsl-012', classId:'cls-101', subjectId:'sub-003', staffId:'stf-003', day:'Wednesday', startTime:'08:30', endTime:'09:30', room:'A12',   termId:TERM_ID },
    { id:'tsl-013', classId:'cls-101', subjectId:'sub-001', staffId:'stf-006', day:'Wednesday', startTime:'10:00', endTime:'11:00', room:'A12',   termId:TERM_ID },
    { id:'tsl-014', classId:'cls-101', subjectId:'sub-012', staffId:'stf-009', day:'Wednesday', startTime:'11:00', endTime:'12:00', room:'Field', termId:TERM_ID },
    { id:'tsl-015', classId:'cls-101', subjectId:'sub-013', staffId:'stf-007', day:'Wednesday', startTime:'13:00', endTime:'14:00', room:'A12',   termId:TERM_ID },
    { id:'tsl-016', classId:'cls-101', subjectId:'sub-002', staffId:'stf-003', day:'Thursday',  startTime:'07:30', endTime:'08:30', room:'A12',   termId:TERM_ID },
    { id:'tsl-017', classId:'cls-101', subjectId:'sub-001', staffId:'stf-006', day:'Thursday',  startTime:'08:30', endTime:'09:30', room:'A12',   termId:TERM_ID },
    { id:'tsl-018', classId:'cls-101', subjectId:'sub-010', staffId:'stf-005', day:'Thursday',  startTime:'10:00', endTime:'11:00', room:'Lab2',  termId:TERM_ID },
    { id:'tsl-019', classId:'cls-101', subjectId:'sub-003', staffId:'stf-003', day:'Thursday',  startTime:'11:00', endTime:'12:00', room:'A12',   termId:TERM_ID },
    { id:'tsl-020', classId:'cls-101', subjectId:'sub-011', staffId:'stf-009', day:'Thursday',  startTime:'13:00', endTime:'14:00', room:'Hall',  termId:TERM_ID },
    { id:'tsl-021', classId:'cls-101', subjectId:'sub-011', staffId:'stf-009', day:'Friday',    startTime:'07:30', endTime:'08:30', room:'Hall',  termId:TERM_ID },
    { id:'tsl-022', classId:'cls-101', subjectId:'sub-013', staffId:'stf-007', day:'Friday',    startTime:'08:30', endTime:'09:30', room:'A12',   termId:TERM_ID },
    { id:'tsl-023', classId:'cls-101', subjectId:'sub-002', staffId:'stf-003', day:'Friday',    startTime:'10:00', endTime:'11:00', room:'A12',   termId:TERM_ID },
    { id:'tsl-024', classId:'cls-101', subjectId:'sub-001', staffId:'stf-006', day:'Friday',    startTime:'11:00', endTime:'12:00', room:'A12',   termId:TERM_ID },
    { id:'tsl-025', classId:'cls-101', subjectId:'sub-004', staffId:'stf-004', day:'Friday',    startTime:'13:00', endTime:'14:00', room:'Lab1',  termId:TERM_ID },
    // Grade 7A (cls-201) — James Ochieng subjects
    { id:'tsl-101', classId:'cls-201', subjectId:'sub-005', staffId:'stf-001', day:'Monday',    startTime:'07:30', endTime:'08:30', room:'Lab1',  termId:TERM_ID },
    { id:'tsl-102', classId:'cls-201', subjectId:'sub-006', staffId:'stf-001', day:'Monday',    startTime:'10:00', endTime:'11:00', room:'Lab1',  termId:TERM_ID },
    { id:'tsl-103', classId:'cls-201', subjectId:'sub-007', staffId:'stf-001', day:'Tuesday',   startTime:'08:30', endTime:'09:30', room:'Lab1',  termId:TERM_ID },
    { id:'tsl-104', classId:'cls-201', subjectId:'sub-005', staffId:'stf-001', day:'Wednesday', startTime:'10:00', endTime:'11:00', room:'Lab1',  termId:TERM_ID },
    { id:'tsl-105', classId:'cls-201', subjectId:'sub-006', staffId:'stf-001', day:'Thursday',  startTime:'07:30', endTime:'08:30', room:'Lab1',  termId:TERM_ID },
    { id:'tsl-106', classId:'cls-201', subjectId:'sub-007', staffId:'stf-001', day:'Friday',    startTime:'11:00', endTime:'12:00', room:'Lab1',  termId:TERM_ID },
  ]

  // ── Attendance Records (stu-001 Amani, Term 2 2026) ───────────────────
  const ATT_DAYS: Array<[string, AttendanceRecord['status'], string]> = [
    ['2026-04-28','present',''], ['2026-04-29','present',''], ['2026-04-30','present',''],
    ['2026-05-01','present',''], ['2026-05-05','absent','No reason provided'],
    ['2026-05-06','present',''], ['2026-05-07','present',''],
    ['2026-05-08','late','Arrived 20 minutes late'], ['2026-05-09','present',''],
    ['2026-05-12','present',''], ['2026-05-13','present',''], ['2026-05-14','present',''],
    ['2026-05-15','absent','Unwell — not in school'], ['2026-05-16','present',''],
    ['2026-05-19','excused','Medical appointment'], ['2026-05-20','present',''],
    ['2026-05-21','present',''], ['2026-05-22','present',''], ['2026-05-23','present',''],
    ['2026-05-26','present',''], ['2026-05-27','present',''], ['2026-05-28','present',''],
  ]
  const attendanceRecords: AttendanceRecord[] = ATT_DAYS.map(([date, status, notes], i) => ({
    id: `att-${String(i + 1).padStart(3, '0')}`,
    studentId: 'stu-001', classId: 'cls-101', termId: TERM_ID,
    date, status, notes, recordedBy: 'stf-006',
  }))

  // ── Student Grades (multi-year) ────────────────────────────────────────
  function gradeLabel(total: number): string {
    if (total >= 80) return 'A'
    if (total >= 75) return 'B+'
    if (total >= 70) return 'B'
    if (total >= 65) return 'C+'
    if (total >= 60) return 'C'
    if (total >= 50) return 'D'
    return 'E'
  }
  type GRow = { c1: number; c2: number; et: number }
  const SUBJ4 = ['sub-001','sub-002','sub-003','sub-004','sub-010','sub-011','sub-012','sub-013']
  const HIST: Record<string, Record<string, GRow>> = {
    'TERM-2024-T1': {
      'sub-001':{c1:55,c2:58,et:60},'sub-002':{c1:62,c2:65,et:68},'sub-003':{c1:60,c2:58,et:62},
      'sub-004':{c1:55,c2:57,et:60},'sub-010':{c1:58,c2:60,et:62},'sub-011':{c1:70,c2:72,et:74},
      'sub-012':{c1:78,c2:80,et:82},'sub-013':{c1:65,c2:68,et:70},
    },
    'TERM-2024-T2': {
      'sub-001':{c1:62,c2:65,et:66},'sub-002':{c1:68,c2:70,et:72},'sub-003':{c1:63,c2:65,et:67},
      'sub-004':{c1:60,c2:62,et:64},'sub-010':{c1:64,c2:66,et:68},'sub-011':{c1:74,c2:76,et:78},
      'sub-012':{c1:82,c2:84,et:85},'sub-013':{c1:70,c2:72,et:74},
    },
    'TERM-2024-T3': {
      'sub-001':{c1:65,c2:68,et:70},'sub-002':{c1:72,c2:74,et:75},'sub-003':{c1:66,c2:68,et:70},
      'sub-004':{c1:62,c2:64,et:66},'sub-010':{c1:66,c2:68,et:70},'sub-011':{c1:76,c2:78,et:80},
      'sub-012':{c1:84,c2:85,et:87},'sub-013':{c1:72,c2:74,et:76},
    },
    'TERM-2025-T1': {
      'sub-001':{c1:68,c2:70,et:72},'sub-002':{c1:74,c2:76,et:78},'sub-003':{c1:68,c2:70,et:72},
      'sub-004':{c1:64,c2:66,et:68},'sub-010':{c1:70,c2:72,et:74},'sub-011':{c1:78,c2:80,et:82},
      'sub-012':{c1:85,c2:87,et:88},'sub-013':{c1:74,c2:76,et:78},
    },
    'TERM-2025-T2': {
      'sub-001':{c1:72,c2:74,et:76},'sub-002':{c1:76,c2:78,et:80},'sub-003':{c1:70,c2:72,et:74},
      'sub-004':{c1:68,c2:70,et:72},'sub-010':{c1:72,c2:74,et:76},'sub-011':{c1:80,c2:82,et:84},
      'sub-012':{c1:86,c2:88,et:90},'sub-013':{c1:76,c2:78,et:80},
    },
    'TERM-2025-T3': {
      'sub-001':{c1:74,c2:76,et:78},'sub-002':{c1:78,c2:80,et:82},'sub-003':{c1:72,c2:74,et:76},
      'sub-004':{c1:70,c2:72,et:74},'sub-010':{c1:74,c2:76,et:78},'sub-011':{c1:82,c2:84,et:86},
      'sub-012':{c1:88,c2:90,et:92},'sub-013':{c1:78,c2:80,et:82},
    },
    'TERM-2026-T1': {
      'sub-001':{c1:76,c2:78,et:80},'sub-002':{c1:80,c2:82,et:84},'sub-003':{c1:74,c2:76,et:78},
      'sub-004':{c1:72,c2:74,et:76},'sub-010':{c1:76,c2:78,et:80},'sub-011':{c1:84,c2:86,et:88},
      'sub-012':{c1:90,c2:92,et:94},'sub-013':{c1:80,c2:82,et:84},
    },
  }
  const T2_CATS: Record<string,{c1:number;c2:number}> = {
    'sub-001':{c1:78,c2:80},'sub-002':{c1:82,c2:84},'sub-003':{c1:76,c2:78},
    'sub-004':{c1:74,c2:76},'sub-010':{c1:78,c2:80},'sub-011':{c1:86,c2:88},
    'sub-012':{c1:92,c2:94},'sub-013':{c1:82,c2:84},
  }
  let gIdx = 1
  const studentGrades: StudentGrade[] = []
  for (const [termId, sMap] of Object.entries(HIST)) {
    for (const subjectId of SUBJ4) {
      const r = sMap[subjectId]; if (!r) continue
      const total = Math.round(r.c1 * 0.2 + r.c2 * 0.2 + r.et * 0.6)
      studentGrades.push({ id:`grd-${String(gIdx++).padStart(3,'0')}`, studentId:'stu-001',
        examId:`exm-hist-${termId}`, subjectId, classId:'cls-101', termId,
        cat1:r.c1, cat2:r.c2, endterm:r.et, total, grade:gradeLabel(total), isLocked:true, enteredBy:'stf-006' })
    }
  }
  for (const subjectId of SUBJ4) {
    const r = T2_CATS[subjectId]; if (!r) continue
    studentGrades.push({ id:`grd-${String(gIdx++).padStart(3,'0')}`, studentId:'stu-001',
      examId:'exm-001', subjectId, classId:'cls-101', termId:TERM_ID,
      cat1:r.c1, cat2:r.c2, endterm:null, total:null, grade:'', isLocked:false, enteredBy:'stf-006' })
  }
  // Grade 7A students for teacher gradebook
  const G7_DATA: Record<string, Record<string,GRow>> = {
    'stu-003': { 'sub-005':{c1:72,c2:75,et:78},'sub-006':{c1:68,c2:70,et:73},'sub-007':{c1:65,c2:68,et:71} },
    'stu-011': { 'sub-005':{c1:80,c2:82,et:85},'sub-006':{c1:76,c2:78,et:80},'sub-007':{c1:74,c2:76,et:79} },
    'stu-004': { 'sub-005':{c1:65,c2:67,et:70},'sub-006':{c1:62,c2:64,et:67},'sub-007':{c1:60,c2:62,et:65} },
  }
  for (const [sid, sMap] of Object.entries(G7_DATA)) {
    for (const subjectId of ['sub-005','sub-006','sub-007']) {
      const r = sMap[subjectId]; if (!r) continue
      const total = Math.round(r.c1 * 0.2 + r.c2 * 0.2 + r.et * 0.6)
      const cId = sid === 'stu-004' ? 'cls-202' : 'cls-201'
      studentGrades.push({ id:`grd-${String(gIdx++).padStart(3,'0')}`, studentId:sid,
        examId:'exm-001', subjectId, classId:cId, termId:TERM_ID,
        cat1:r.c1, cat2:r.c2, endterm:r.et, total, grade:gradeLabel(total), isLocked:false, enteredBy:'stf-001' })
    }
  }

  // ── Homework (cls-101) ────────────────────────────────────────────────
  const homework: Homework[] = [
    { id:'hw-001', classId:'cls-101', subjectId:'sub-001', termId:TERM_ID,
      title:'Fractions Practice — Chapter 5 Exercises',
      description:'Complete exercises 5.1 to 5.4 in your Mathematics workbook. Show all working clearly.',
      assignedBy:'stf-006', assignedByName:'Ms. Lucy Akinyi',
      assignedDate:'2026-05-26', dueDate:'2026-05-30', status:'active' },
    { id:'hw-002', classId:'cls-101', subjectId:'sub-002', termId:TERM_ID,
      title:'Essay: My Future Career',
      description:'Write a 300-word essay about the career you would like to pursue and why. Use clear paragraphs.',
      assignedBy:'stf-003', assignedByName:'Ms. Mercy Njoroge',
      assignedDate:'2026-05-27', dueDate:'2026-06-02', status:'active' },
    { id:'hw-003', classId:'cls-101', subjectId:'sub-004', termId:TERM_ID,
      title:'Lab Report — Photosynthesis Experiment',
      description:'Write a complete lab report on the photosynthesis experiment conducted on Tuesday. Include hypothesis, method, results and conclusion.',
      assignedBy:'stf-004', assignedByName:'Mr. Samuel Kamau',
      assignedDate:'2026-05-22', dueDate:'2026-05-27', status:'closed' },
    { id:'hw-004', classId:'cls-101', subjectId:'sub-003', termId:TERM_ID,
      title:'Insha: Mazingira ya Shule',
      description:'Andika insha ya maneno 250 kuhusu mazingira ya shule yako. Tumia lugha sanifu na andishi nzuri.',
      assignedBy:'stf-003', assignedByName:'Ms. Mercy Njoroge',
      assignedDate:'2026-05-19', dueDate:'2026-05-23', status:'closed' },
    { id:'hw-005', classId:'cls-101', subjectId:'sub-010', termId:TERM_ID,
      title:'Scratch Project: Create a Simple Game',
      description:'Design a Scratch game with at least 2 sprites, a background, sound effects and a scoring system. Share your Scratch link.',
      assignedBy:'stf-005', assignedByName:'Mr. Peter Njeru',
      assignedDate:'2026-05-28', dueDate:'2026-06-05', status:'active' },
    { id:'hw-006', classId:'cls-101', subjectId:'sub-013', termId:TERM_ID,
      title:'Values Reflection: Honesty in Daily Life',
      description:'Write a one-page reflection on how honesty shapes your decisions and relationships at school and at home.',
      assignedBy:'stf-007', assignedByName:'Mr. David Mwangi',
      assignedDate:'2026-05-28', dueDate:'2026-06-10', status:'active' },
  ]

  const publicBlogPosts: PublicBlogPost[] = [
    { id:'pub-blog-1', title:'Gatumbi SDA School Launches New Science Laboratory', slug:'gatumbi-sda-launches-science-lab', excerpt:'Our new modern science lab brings hands-on learning to every student near Mount Kenya.', content:'Gatumbi SDA School proudly unveils its state-of-the-art Science Laboratory, equipped with microscopes, chemistry benches, and biology specimens — all set against the breathtaking backdrop of Mount Kenya.\n\nStudents from Grade 5 through Form 4 will benefit from hands-on experiments aligned to both CBC and KCSE syllabi. The lab was funded through partnerships with the SDA East Africa Union and generous parent contributions.', coverImageUrl:'/images/unsplash-1511379938549-c1f69419868d.jpg', author:'Communications Team', category:'Academics', isPublished:true, publishedAt:'2026-01-15T08:00:00Z', viewCount:1240, createdAt:'2026-01-15T08:00:00Z' },
    { id:'pub-blog-2', title:'Sabbath School Programmes Deepen Student Faith', slug:'sabbath-school-deepening-faith', excerpt:'Our weekly Sabbath programmes are transforming the spiritual lives of students and staff.', content:'At Gatumbi SDA School, faith is not an afterthought — it is the foundation. Every Friday, our boarding students gather for vespers as the sun sets over Mount Kenya\'s ridgeline. Sabbath School on Saturday mornings brings learners together for scripture study, worship songs, and devotional reflection.\n\nOur Chaplain, Mr. David Omondi, leads a vibrant programme that has seen 34 students baptised this academic year alone.', coverImageUrl:'/images/unsplash-1523240795612-9a054b0db644.jpg', author:'Chaplain\'s Office', category:'Faith', isPublished:true, publishedAt:'2026-02-02T08:00:00Z', viewCount:890, createdAt:'2026-02-02T08:00:00Z' },
    { id:'pub-blog-3', title:'Mount Kenya Nature Trail: Our Living Classroom', slug:'mount-kenya-nature-trail-living-classroom', excerpt:'Students explore the highland ecosystem right on our doorstep — faith and science hand in hand.', content:'This term, our Grade 6 and Form 1 students completed a guided nature trail around the school\'s highland grounds, studying local flora and fauna native to the Mount Kenya ecosystem.\n\nThe trail — established by our Science and Environment Club — reinforces CBC environmental themes while reminding every learner that God\'s creation is our greatest classroom. Upcoming fixtures and trail schedules are available on our Activities page.', coverImageUrl:'/images/unsplash-1461896836934-ffe607ba8211.jpg', author:'Science Department', category:'Environment', isPublished:true, publishedAt:'2026-02-28T08:00:00Z', viewCount:650, createdAt:'2026-02-28T08:00:00Z' },
    { id:'pub-blog-4', title:'Tree Planting Day: 500 Seedlings for Our Campus', slug:'tree-planting-day-500-seedlings', excerpt:'Students, staff and parents plant indigenous trees as an act of creation care and community.', content:'On Environment Day, the Gatumbi SDA School community came together to plant 500 indigenous seedlings across our school grounds — a celebration of God\'s creation and a commitment to a greener Kenya.\n\nThe initiative is part of our "Green Campus, Green Hearts" programme, which teaches environmental stewardship as a spiritual discipline rooted in SDA principles of health and wholeness.', coverImageUrl:'/images/unsplash-1541339907198-e08756dedfbf.jpg', author:'Administration', category:'Environment', isPublished:true, publishedAt:'2026-03-10T08:00:00Z', viewCount:430, createdAt:'2026-03-10T08:00:00Z' },
    { id:'pub-blog-5', title:'Parent Portal: Fee Payments Now Live', slug:'parent-portal-fee-payments-now-live', excerpt:'Pay school fees securely via Paybill 522522 — Account: ALBER + Student ID.', content:'Our parent dashboard integrates M-Pesa Paybill flows for seamless fee payments. Track invoices, attendance heatmaps, and grade progress in one premium interface.', coverImageUrl:'/images/unsplash-1556740758-90de374c12ad.jpg', author:'Finance Office', category:'Technology', isPublished:true, publishedAt:'2026-03-20T08:00:00Z', viewCount:780, createdAt:'2026-03-20T08:00:00Z' },
  ]

  const publicEvents: PublicEvent[] = [
    { id:'pub-evt-1', title:'Opening Ceremony 2026', description:'Welcome back celebration with performances.', startDate:'2026-01-12', endDate:'2026-01-12', location:'Main Auditorium', imageUrl:'/images/unsplash-1540575467063-178a50c2df87.jpg', isPublished:true, isPast:true, eventType:'ceremony' },
    { id:'pub-evt-2', title:'CBC Innovation Fair', description:'Student projects and STEM showcases.', startDate:'2026-02-20', endDate:'2026-02-20', location:'Science Block', imageUrl:null, isPublished:true, isPast:true, eventType:'academic' },
    { id:'pub-evt-3', title:'Inter-House Athletics', description:'Annual track and field championships.', startDate:'2026-03-15', endDate:'2026-03-15', location:'Sports Complex', imageUrl:'/images/unsplash-1461896836934-ffe607ba8211.jpg', isPublished:true, isPast:false, eventType:'sports' },
    { id:'pub-evt-4', title:'Music Gala Night', description:'Orchestra, choir, and solo performances.', startDate:'2026-04-08', endDate:'2026-04-08', location:'Arts Academy', imageUrl:null, isPublished:true, isPast:false, eventType:'arts' },
    { id:'pub-evt-5', title:'Parent-Teacher Conference', description:'Term 1 progress reviews.', startDate:'2026-04-22', endDate:'2026-04-22', location:'Various Classrooms', imageUrl:null, isPublished:true, isPast:false, eventType:'academic' },
    { id:'pub-evt-6', title:'Drama & Dance Showcase', description:'End-of-term performing arts premiere.', startDate:'2026-05-10', endDate:'2026-05-10', location:'Theatre Studio', imageUrl:null, isPublished:true, isPast:false, eventType:'arts' },
    { id:'pub-evt-7', title:'IGCSE Mock Exams', description:'Cambridge pathway assessment week.', startDate:'2026-05-18', endDate:'2026-05-22', location:'Exam Hall', imageUrl:null, isPublished:true, isPast:false, eventType:'academic' },
    { id:'pub-evt-8', title:'Environmental Day', description:'Tree planting and sustainability workshops.', startDate:'2026-06-05', endDate:'2026-06-05', location:'School Grounds', imageUrl:null, isPublished:true, isPast:false, eventType:'campus' },
  ]

  const publicGalleryImages: PublicGalleryImage[] = Array.from({ length: 24 }, (_, i) => {
    const cats = ['Campus','Classrooms','Sports','Arts','Events','Students']
    const seeds = ['alber-campus','alber-class','alber-sports','alber-arts','alber-events','alber-students']
    const cat = cats[i % cats.length]
    const seed = seeds[i % seeds.length]
    return {
      id: `pub-gal-${i + 1}`,
      url: `https://picsum.photos/seed/${seed}${i}/800/600`,
      caption: `Demo School ${cat} ${i + 1}`,
      category: cat,
      sortOrder: i + 1,
      isPublic: true,
      createdAt: '2026-01-01T08:00:00Z',
    }
  })

  const publicProgramLevels: PublicProgramLevel[] = [
    { id:'pub-prog-1', slug:'daycare', name:'Daycare & Early Years', ages:'2–5 years', description:'Nurturing foundation with play-based learning and sensory exploration.', imageUrl:'/images/unsplash-1503454537195-1dcabb73ffb9.jpg', sortOrder:1, createdAt:'2026-01-01T08:00:00Z' },
    { id:'pub-prog-2', slug:'primary', name:'Primary School', ages:'6–12 years', description:'CBC-aligned excellence with literacy, numeracy, and creative foundations.', imageUrl:'/images/unsplash-1588072432836-e10032774350.jpg', sortOrder:2, createdAt:'2026-01-01T08:00:00Z' },
    { id:'pub-prog-3', slug:'junior', name:'Junior Secondary', ages:'13–15 years', description:'Pre-IGCSE pathways with STEM labs and leadership development.', imageUrl:'/images/unsplash-1581091226825-a6a2a5aee158.jpg', sortOrder:3, createdAt:'2026-01-01T08:00:00Z' },
    { id:'pub-prog-4', slug:'senior', name:'Senior School', ages:'16–18 years', description:'Cambridge IGCSE & A-Level preparation with university counseling.', imageUrl:'/images/unsplash-1523240795612-9a054b0db644.jpg', sortOrder:4, createdAt:'2026-01-01T08:00:00Z' },
  ]

  const publicFeeRows: PublicFeeRow[] = [
    { id:'pub-fee-1', level:'Daycare', tuition:85000, transport:18000, activities:12000, total:115000, sortOrder:1 },
    { id:'pub-fee-2', level:'Primary', tuition:145000, transport:22000, activities:15000, total:182000, sortOrder:2 },
    { id:'pub-fee-3', level:'Junior Secondary', tuition:185000, transport:25000, activities:18000, total:228000, sortOrder:3 },
    { id:'pub-fee-4', level:'Senior / IGCSE', tuition:245000, transport:28000, activities:22000, total:295000, sortOrder:4 },
  ]

  const publicTeachers: PublicTeacher[] = Array.from({ length: 16 }, (_, i) => {
    const firstNames = ['James','Mary','Grace','David','Peter','Ann','Samuel','Esther','John','Faith','Amina','Brian','Catherine','Henry','Irene','Michael']
    const lastNames = ['Ochieng','Kamau','Wanjiku','Mwangi','Njeru','Muthoni','Kariuki','Wairimu','Odhiambo','Nyambura','Omondi','Akinyi','Njoroge','Wambui','Chebet','Kimani']
    const titles = ['Head of Department','Senior Teacher','Subject Lead','Coordinator','Specialist Instructor','Academic Mentor','Curriculum Developer']
    const depts: Department[] = ['Sciences','Humanities','Languages','Music','Drama','Sports']
    const creds = ['B.Ed (University of Nairobi)','M.Ed (Kenyatta University)','PGDE','TSC Registered','CBC Certified','IGCSE Trained','First Aid Certified']
    const quals = ['15+ years teaching experience','Published curriculum author','National exam marker','Award-winning educator','STEM innovation lead','Arts festival judge','Sports coaching license']
    const name = `${firstNames[i]} ${lastNames[i]}`
    return {
      id: `pub-tch-${i + 1}`,
      name,
      title: titles[i % titles.length],
      department: depts[i % depts.length],
      image: `/images/avatar-${(i % 70) + 1}.jpg`,
      bio: `${name} brings exceptional dedication to ${depts[i % depts.length]} at Gatumbi SDA School. Known for faith-centred, innovative teaching, they have shaped countless young minds in Gatumbi and the wider Kirinyaga community.`,
      credentials: [creds[i % creds.length], creds[(i + 2) % creds.length]],
      qualifications: [quals[i % quals.length],quals[(i + 3) % quals.length],`${(i * 3) + 5}+ years at Gatumbi SDA School`],
    }
  })

  const publicSportFixtures: SportFixture[] = [
    { id:'pub-fit-1', sport:'Football', opponent:'St. Annes Academy', date:'2026-03-20', venue:'Home', result:'3-1', status:'completed' },
    { id:'pub-fit-2', sport:'Rugby', opponent:'Alliance High', date:'2026-03-25', venue:'Away', result:'—', status:'upcoming' },
    { id:'pub-fit-3', sport:'Swimming', opponent:'County Championships', date:'2026-03-22', venue:'Aquatic Centre', result:'Live', status:'live' },
    { id:'pub-fit-4', sport:'Basketball', opponent:'Green Valley School', date:'2026-04-02', venue:'Home', result:'—', status:'upcoming' },
    { id:'pub-fit-5', sport:'Athletics', opponent:'Regional Meet', date:'2026-03-15', venue:'Sports Complex', result:'12 Gold', status:'completed' },
    { id:'pub-fit-6', sport:'Tennis', opponent:'Hillcrest Prep', date:'2026-04-10', venue:'Away', result:'—', status:'upcoming' },
  ]

  // ── CMS Pages ──────────────────────────────────────────────────────────
  const cmsPages: CmsPage[] = [
    { id: 'pg-home',        slug: 'home',          parentId: null,          title: 'Home',          icon: '🏠', path: '/',            isPublished: true, sortOrder: 1 },
    { id: 'pg-about',       slug: 'about',         parentId: null,          title: 'About',         icon: 'ℹ️', path: '/about',        isPublished: true, sortOrder: 2 },
    { id: 'pg-academics',   slug: 'academics',     parentId: null,          title: 'Academics',     icon: '🎓', path: '/academics',    isPublished: true, sortOrder: 3 },
    { id: 'pg-admissions',  slug: 'admissions',    parentId: null,          title: 'Admissions',    icon: '📋', path: '/admissions',   isPublished: true, sortOrder: 4 },
    { id: 'pg-cocurr',      slug: 'co-curricular', parentId: null,          title: 'Co-Curricular', icon: '🎭', path: '/co-curricular',isPublished: true, sortOrder: 5 },
    { id: 'pg-music',       slug: 'music',         parentId: 'pg-cocurr',   title: 'Music Academy', icon: '🎵', path: '/music',        isPublished: true, sortOrder: 1 },
    { id: 'pg-drama',       slug: 'drama-dance',   parentId: 'pg-cocurr',   title: 'Drama & Dance', icon: '💃', path: '/drama-dance',  isPublished: true, sortOrder: 2 },
    { id: 'pg-sports',      slug: 'sports',        parentId: 'pg-cocurr',   title: 'Sports',        icon: '🏆', path: '/sports',       isPublished: true, sortOrder: 3 },
    { id: 'pg-blog',        slug: 'blog',          parentId: null,          title: 'Blog',          icon: '📰', path: '/blog',         isPublished: true, sortOrder: 6 },
    { id: 'pg-contact',     slug: 'contact',       parentId: null,          title: 'Contact',       icon: '📞', path: '/contact',      isPublished: true, sortOrder: 7 },
    { id: 'pg-facilities',  slug: 'facilities',    parentId: null,          title: 'Facilities',    icon: '🏗️', path: '/facilities',   isPublished: true, sortOrder: 8 },
    { id: 'pg-staff',       slug: 'staff',         parentId: null,          title: 'Staff Directory', icon: '👩‍🏫', path: '/staff',        isPublished: true, sortOrder: 9 },
    { id: 'pg-why',         slug: 'why-choose-us', parentId: null,          title: 'Why Choose Us',  icon: '⭐', path: '/why-choose-us', isPublished: true, sortOrder: 10 },
  ]

  function blk(id: string, pageId: string, key: string, label: string, type: CmsBlockType, value: string, helpText: string, sortOrder: number): CmsBlock {
    return { id, pageId, key, label, type, value, helpText, sortOrder }
  }

  const cmsBlocks: CmsBlock[] = [
    // ── Home ──────────────────────────────────────────────────────────────
    blk('cb-h-01','pg-home','hero.tagline',      'Hero Tagline (white)',          'text',    'Where Excellence',           'First line of the hero headline — displayed in white', 1),
    blk('cb-h-02','pg-home','hero.taglineGold',  'Hero Tagline (gold)',           'text',    'Meets Tomorrow',             'Second line displayed in gold — the accent phrase', 2),
    blk('cb-h-03','pg-home','hero.subtitle',     'Hero Subtitle',                 'textarea','Kenya\'s premier learning institution — where every learner discovers their genius in world-class facilities guided by expert educators.','Shown below the hero headline', 3),
    blk('cb-h-04','pg-home','stats.students',    'Stats — Students',              'text',    '2,000+',                     'Number shown on the homepage stats bar', 4),
    blk('cb-h-05','pg-home','stats.teachers',    'Stats — Teachers',              'text',    '120+',                       'Number shown on the homepage stats bar', 5),
    blk('cb-h-06','pg-home','stats.established', 'Stats — Years Established',     'text',    '2005',                       'Year the school was established', 6),
    blk('cb-h-07','pg-home','director.name',     'Director Name',                 'text',    'Dr. Alice Mwangi',           'Name shown in the Director\'s Message section', 7),
    blk('cb-h-08','pg-home','director.title',    'Director Title',                'text',    'School Director',            'Title shown below the director\'s name', 8),
    blk('cb-h-09','pg-home','director.quote',    'Director Quote',                'textarea','When we established Gatumbi SDA School, our founding conviction was simple: every child in Kirinyaga deserves an education rooted in faith, excellence, and the beauty of God\'s creation. Nestled at the foot of Mount Kenya, our school is a sanctuary — a place where learners breathe fresh mountain air and grow in wisdom, knowledge, and the fear of the Lord.\n\nWe are a Seventh-day Adventist institution, and that shapes everything we do — from how we teach, to how we live together as a boarding community, to the values we instil in every learner. Academic excellence and spiritual growth are not separate here; they are one.\n\nWe warmly invite you to come and experience Gatumbi SDA School for yourself. The mountain is waiting.','The director\'s message paragraph shown on the homepage', 9),

    // ── Academics ─────────────────────────────────────────────────────────
    blk('cb-ac-01','pg-academics','hero.headline',   'Page Headline',             'text',    'Programs & Academics',        'Main heading at the top of the Academics page', 1),
    blk('cb-ac-02','pg-academics','hero.subheadline','Page Subheadline',          'textarea','From Playgroup through Senior School — a seamless CBC journey that develops the whole learner across six structured levels.','Shown below the main heading', 2),
    blk('cb-ac-03','pg-academics','cta.headline',    'CTA Box Headline',          'text',    'Ready to Enrol?',             'Heading in the call-to-action box at the bottom of the page', 3),
    blk('cb-ac-04','pg-academics','cta.subtext',     'CTA Box Subtext',           'textarea','Applications are open for the 2026 intake across all levels — from Playgroup to Grade 12. Limited spaces remain.','Body text in the call-to-action box', 4),

    // ── Admissions ────────────────────────────────────────────────────────
    blk('cb-ad-01','pg-admissions','hero.headline',   'Page Headline',            'text',    'Admissions',                  'Main heading at the top of the Admissions page', 1),
    blk('cb-ad-02','pg-admissions','hero.subheadline','Page Subheadline',         'textarea','Join Demo School — applications open for 2026 intake.','Shown below the main heading', 2),
    blk('cb-ad-03','pg-admissions','payment.paybill', 'M-Pesa Paybill Number',    'text',    '522522',                      'The M-Pesa Paybill number shown on the payment step', 3),
    blk('cb-ad-04','pg-admissions','payment.account', 'M-Pesa Account Number',    'text',    'ALBER2026',                   'The account number shown on the payment step', 4),
    blk('cb-ad-05','pg-admissions','payment.note',    'Payment Note',             'text',    'Amount will be confirmed upon review','Small note shown below the account number', 5),

    // ── Co-Curricular ─────────────────────────────────────────────────────
    blk('cb-cc-01','pg-cocurr','hero.headline',   'Page Headline',                'text',    'Co-Curricular',               'Main heading at the top of the Co-Curricular page', 1),
    blk('cb-cc-02','pg-cocurr','hero.subheadline','Page Subheadline',             'textarea','Beyond the classroom — four pillars of holistic development aligned to Kenya\'s CBC framework and Demo School\'s vision of whole-learner excellence.','Shown below the main heading', 2),
    blk('cb-cc-03','pg-cocurr','cta.headline',    'CTA Box Headline',             'text',    'Enrich Your Child\'s Journey','Heading in the call-to-action box at the bottom of the page', 3),
    blk('cb-cc-04','pg-cocurr','cta.subtext',     'CTA Box Subtext',              'textarea','Every learner at Demo School participates in co-curricular activities as part of their holistic CBC assessment. Talk to us about pathways that match your child\'s passions.','Body text in the call-to-action box', 4),

    // ── Music ─────────────────────────────────────────────────────────────
    blk('cb-mu-01','pg-music','hero.headline',   'Page Headline',                 'text',    'Music Academy',               'Main heading at the top of the Music Academy page', 1),
    blk('cb-mu-02','pg-music','hero.subheadline','Page Subheadline',              'textarea','Piano studios · Recording suites · Full orchestra ensemble · ABRSM examination centre.','Shown below the main heading', 2),

    // ── Drama & Dance ─────────────────────────────────────────────────────
    blk('cb-dr-01','pg-drama','hero.headline',   'Page Headline',                 'text',    'Drama & Dance',               'Main heading at the top of the Drama & Dance page', 1),
    blk('cb-dr-02','pg-drama','hero.subheadline','Page Subheadline',              'textarea','Mirror-walled studios · Professional lighting · Sprung floors · 4K capture for portfolio development.','Shown below the main heading', 2),

    // ── Sports ────────────────────────────────────────────────────────────
    blk('cb-sp-01','pg-sports','hero.headline',   'Page Headline',                'text',    'Sports',                      'Main heading at the top of the Sports page', 1),
    blk('cb-sp-02','pg-sports','hero.subheadline','Page Subheadline',             'textarea','Competing at county, national and regional level across a full spectrum of sporting disciplines.','Shown below the main heading', 2),
    blk('cb-sp-03','pg-sports','potm.name',       'Player of Month — Name',       'text',    'Brian Mutua',                     'Name shown on the Player of the Month card', 3),
    blk('cb-sp-04','pg-sports','potm.sport',      'Player of Month — Sport',      'text',    'Football',                        'Sport they play', 4),
    blk('cb-sp-05','pg-sports','potm.class',      'Player of Month — Class',      'text',    'Form 3 Ruby',                     'Class or year group', 5),
    blk('cb-sp-06','pg-sports','potm.image',      'Player of Month — Photo URL',  'text',    '/images/avatar-12.jpg', 'URL of the player photo', 6),
    blk('cb-sp-07','pg-sports','potm.stats',      'Player of Month — Stats Line', 'text',    '14 goals · 8 assists · Captain',  'Stats line shown below the name', 7),

    // ── Blog ──────────────────────────────────────────────────────────────
    blk('cb-bl-01','pg-blog','hero.headline',   'Page Headline',                  'text',    'Blog',                        'Main heading at the top of the Blog page', 1),
    blk('cb-bl-02','pg-blog','hero.subheadline','Page Subheadline',               'textarea','News, stories, and insights from the Demo School community.','Shown below the main heading', 2),

    // ── Contact ───────────────────────────────────────────────────────────
    blk('cb-co-01','pg-contact','hero.headline',    'Page Headline',              'text',    'Contact Us',                  'Main heading at the top of the Contact page', 1),
    blk('cb-co-02','pg-contact','hero.subheadline', 'Page Subheadline',           'textarea','Adjacent to the Governor\'s Offices, Kutus — Kirinyaga County. We\'re here to help.','Shown below the main heading', 2),
    blk('cb-co-03','pg-contact','phone.primary',    'Primary Phone Number',       'text',    '+254 712 345 678',            'Main phone number displayed on the contact cards', 3),
    blk('cb-co-04','pg-contact','phone.secondary',  'Secondary Phone Number',     'text',    '+254 734 567 890',            'Second phone number displayed below the primary', 4),
    blk('cb-co-05','pg-contact','email.primary',    'Primary Email',              'text',    'info@alberschool.ke',         'Main email address shown on the contact card', 5),
    blk('cb-co-06','pg-contact','email.secondary',  'Admissions Email',           'text',    'admissions@alberschool.ke',   'Admissions-specific email address', 6),
    blk('cb-co-07','pg-contact','whatsapp',         'WhatsApp Number (no +)',     'text',    '254712345678',               'WhatsApp number in international format without the + sign (used in links)', 7),
    blk('cb-co-08','pg-contact','address.line1',    'Address Line 1',             'text',    'Adjacent to Governor\'s Offices','First line of the physical address', 8),
    blk('cb-co-09','pg-contact','address.line2',    'Address Line 2',             'text',    'Kutus Town, Kirinyaga County','Second line of the physical address', 9),
    blk('cb-co-10','pg-contact','hours',            'Office Hours',               'text',    'Monday – Friday 7:30 AM – 5:00 PM · Saturday 8:00 AM – 1:00 PM','Office hours shown at the bottom of the contact page', 10),

    // ── Facilities ────────────────────────────────────────────────────────
    blk('cb-fa-01','pg-facilities','hero.headline',   'Page Headline',            'text',    'Facilities',                  'Main heading at the top of the Facilities page', 1),
    blk('cb-fa-02','pg-facilities','hero.subheadline','Page Subheadline',         'textarea','World-class infrastructure designed for modern learning — click any facility to explore.','Shown below the main heading', 2),
    blk('cb-fa-03','pg-facilities','cta.headline',    'CTA Box Headline',         'text',    'Experience It In Person',     'Heading in the call-to-action box at the bottom of the page', 3),
    blk('cb-fa-04','pg-facilities','cta.subtext',     'CTA Box Subtext',          'textarea','Book a campus tour and see our facilities first-hand. Adjacent to the Governor\'s Offices, Kutus.','Body text in the call-to-action box', 4),

    // ── Why Choose Us ─────────────────────────────────────────────────────
    blk('cb-wh-01','pg-why','hero.tagline',      'Section Label',                 'text',    'The Demo School Difference',        'Small pill label shown above the main headline', 1),
    blk('cb-wh-02','pg-why','hero.headline',     'Page Headline',                 'text',    'Why Choose Us?',              'Main heading at the top of the Why Choose Us page', 2),
    blk('cb-wh-03','pg-why','hero.subheadline',  'Page Subheadline',              'textarea','Adjacent to the Governor\'s Offices in Kutus, Kirinyaga County — Demo School has been redefining private education in Kenya since 2005. Here\'s what makes us different.','Paragraph shown below the main heading', 3),
    blk('cb-wh-04','pg-why','stats.students',    'Stats — Students Enrolled',     'text',    '2,000+',                      'Shown on the stats bar', 4),
    blk('cb-wh-05','pg-why','stats.educators',   'Stats — Qualified Educators',   'text',    '120+',                        'Shown on the stats bar', 5),
    blk('cb-wh-06','pg-why','stats.passRate',    'Stats — KCSE Pass Rate',        'text',    '97%',                         'Shown on the stats bar', 6),
    blk('cb-wh-07','pg-why','stats.activities',  'Stats — Co-Curricular Activities','text',  '30+',                         'Shown on the stats bar', 7),
    blk('cb-wh-08','pg-why','cta.headline',      'CTA Box Headline',              'text',    'Ready to Experience It?',     'Heading in the call-to-action box at the bottom of the page', 8),
    blk('cb-wh-09','pg-why','cta.subtext',       'CTA Box Subtext',               'textarea','Book a campus tour and see the Demo School difference first-hand. Adjacent to the Governor\'s Offices, Kutus, Kirinyaga County.','Body text in the call-to-action box', 9),
  ]

  const academicsCompetencies: AcademicsCompetency[] = [
    { id: 'ac-1', icon: '🗣️', title: 'Communication & Collaboration',    desc: 'Learners express ideas clearly, listen actively, and work effectively in teams — skills essential in every career and community.',                                                              isFeatured: false, sortOrder: 1 },
    { id: 'ac-2', icon: '🧠', title: 'Critical Thinking & Problem Solving', desc: 'Structured inquiry, analysis, and creative problem-solving are woven into every subject so learners tackle real challenges with confidence.',                                                         isFeatured: false, sortOrder: 2 },
    { id: 'ac-3', icon: '💡', title: 'Creativity & Imagination',           desc: 'From arts to STEM, learners are challenged to generate original ideas, experiment boldly, and appreciate diverse forms of expression.',                                                                  isFeatured: false, sortOrder: 3 },
    { id: 'ac-4', icon: '🌍', title: 'Citizenship',                        desc: 'Understanding rights, duties, and active community participation builds responsible, patriotic, and globally aware young Kenyans.',                                                                      isFeatured: false, sortOrder: 4 },
    { id: 'ac-5', icon: '💻', title: 'Digital Literacy',                   desc: 'ICT is a cross-cutting element at Demo School — from responsible internet use and data privacy to coding and digital content creation.',                                                                     isFeatured: false, sortOrder: 5 },
    { id: 'ac-6', icon: '📖', title: 'Learning to Learn',                  desc: 'Learners develop metacognitive skills — reflection, self-regulation, and adaptability — so they grow continuously throughout life.',                                                                    isFeatured: false, sortOrder: 6 },
    { id: 'ac-7', icon: '💪', title: 'Self-Efficacy',                      desc: 'Building self-confidence, resilience, and a growth mindset ensures every learner believes in their ability to overcome obstacles.',                                                                     isFeatured: true,  sortOrder: 7 },
  ]

  const academicsSchoolLevels: AcademicsSchoolLevel[] = [
    { id: 'sl-1', slug: 'playgroup',     name: 'Playgroup',      ages: 'Ages 2 – 3',               icon: '🧸', colorKey: 'pink',   desc: 'A warm, nurturing environment that sparks curiosity through play. Children develop social, emotional, and early language skills in our purpose-built Playgroup centre.',          highlights: 'Play-based learning\nStructured routines\nCreative exploration\nSocial development\nMusic & movement\nEarly number sense',                                                                                                                                         sortOrder: 1 },
    { id: 'sl-2', slug: 'ecde',          name: 'ECDE',           ages: 'PP1 & PP2 · Ages 4 – 5',   icon: '🌱', colorKey: 'green',  desc: 'Early Childhood Development Education aligned to the CBC framework. PP1 and PP2 build foundational literacy, numeracy, and environmental awareness through structured activities.', highlights: 'Language Activities\nMathematical Activities\nEnvironmental Activities\nPsychomotor & Creative Arts\nReligious Education\nMusic',                                                                                                                                    sortOrder: 2 },
    { id: 'sl-3', slug: 'lower-primary', name: 'Lower Primary',  ages: 'Grades 1 – 3 · Ages 6 – 8', icon: '📚', colorKey: 'blue',   desc: 'Building core competencies in literacy and numeracy. Learners engage through integrated, activity-based units that connect learning to real-life contexts in Kirinyaga and beyond.',  highlights: 'English\nKiswahili\nMathematics\nIntegrated Science\nSocial Studies\nReligious Education\nCreative Arts\nPhysical Education',                                                                                                                                       sortOrder: 3 },
    { id: 'sl-4', slug: 'upper-primary', name: 'Upper Primary',  ages: 'Grades 4 – 6 · Ages 9 – 11', icon: '🔬', colorKey: 'violet', desc: 'Deepening competencies across all learning areas. Learners begin exploring Agriculture and are assessed through Continuous Assessment Tests (CATs) each term.',                       highlights: 'English\nKiswahili\nMathematics\nIntegrated Science\nSocial Studies\nAgriculture\nCreative Arts\nPhysical Education\nReligious Education',                                                                                                                          sortOrder: 4 },
    { id: 'sl-5', slug: 'junior',        name: 'Junior School',  ages: 'Grades 7 – 9 · Ages 12 – 14', icon: '🎯', colorKey: 'amber',  desc: "Junior Secondary School introduces career-based learning pathways. Learners in Grade 9 sit the Kenya Junior School Education Assessment (KJSEA) — Kenya's national transition exam.", highlights: 'English\nKiswahili\nMathematics\nIntegrated Science\nSocial Studies\nBusiness Studies\nAgriculture\nPre-Technical Studies\nCreative Arts\nLife Skills',                                                                                                              sortOrder: 5 },
    { id: 'sl-6', slug: 'senior',        name: 'Senior School',  ages: 'Grades 10 – 12 · Ages 15 – 17', icon: '🎓', colorKey: 'teal',   desc: "Senior School offers specialised pathways in Sciences, Humanities, STEM, and Arts & Sports. Learners sit the Kenya Certificate of Secondary Education (KCSE) at the end of Grade 12.", highlights: 'English\nKiswahili\nMathematics\nSciences (Biology/Chemistry/Physics)\nSocial Studies\nBusiness Studies\nComputer Science\nAgriculture\nCreative Arts & Design\nPhysical Education', sortOrder: 6 },
  ]

  const aboutCoreValues: AboutCoreValue[] = [
    { id: 'cv-1', icon: '🎓', title: 'Academic Excellence', desc: 'Rigorous standards across CBC and Cambridge IGCSE frameworks with continuous assessment.', sortOrder: 1 },
    { id: 'cv-2', icon: '🤝', title: 'Integrity',            desc: 'Honesty and ethical conduct are the foundation of every interaction in our community.', sortOrder: 2 },
    { id: 'cv-3', icon: '🌍', title: 'Global Citizenship',  desc: 'Celebrating Kenyan heritage while preparing learners for a connected, diverse world.', sortOrder: 3 },
    { id: 'cv-4', icon: '💡', title: 'Innovation',           desc: 'Encouraging curiosity, creativity, and problem-solving across all disciplines.', sortOrder: 4 },
    { id: 'cv-5', icon: '🏆', title: 'Holistic Growth',      desc: 'Developing the whole child — academically, physically, artistically, and emotionally.', sortOrder: 5 },
    { id: 'cv-6', icon: '🌱', title: 'Sustainability',        desc: 'Stewardship of our community and environment for future generations.', sortOrder: 6 },
  ]

  const aboutHistoryItems: AboutHistoryItem[] = [
    { id: 'hi-1', year: '2005', title: 'Foundation',       desc: "Demo School established in Kutus, Kirinyaga County, with a bold vision to deliver premium education adjacent to the Governor's Offices.", sortOrder: 1 },
    { id: 'hi-2', year: '2010', title: 'Primary Expansion', desc: 'Full primary school opened with 400 students. CBC-aligned curriculum launched alongside dedicated science laboratories.', sortOrder: 2 },
    { id: 'hi-3', year: '2014', title: 'Arts Academy',      desc: 'Music studios, drama theatre, and dance halls launched — the first dedicated performing arts complex in Kirinyaga County.', sortOrder: 3 },
    { id: 'hi-4', year: '2018', title: 'IGCSE Pathway',     desc: 'Cambridge international curriculum introduced, giving students a globally recognised academic pathway from Grade 10.', sortOrder: 4 },
    { id: 'hi-5', year: '2022', title: 'Sports Complex',    desc: 'New sports complex completed — football pitch, basketball courts, swimming pool, and athletics track.', sortOrder: 5 },
    { id: 'hi-6', year: '2026', title: 'Digital Frontier',  desc: '360° virtual tours, smart classrooms, and digital learning platforms launched. 2,000+ students, 120+ staff.', sortOrder: 6 },
  ]

  const facilities: Facility[] = [
    { id: 'fac-1', name: 'Smart Classrooms',      icon: '🖥️', sortOrder: 1, isPublished: true,
      img: 'https://picsum.photos/seed/facility-classroom/800/600',
      desc: '86 air-conditioned smart classrooms with interactive whiteboards, high-speed Wi-Fi, and ergonomic furniture designed for CBC and IGCSE learning.',
      highlights: 'Interactive whiteboards\nHigh-speed fibre internet\nAir-conditioned\nCCTV monitored' },
    { id: 'fac-2', name: 'Music Studio',           icon: '🎵', sortOrder: 2, isPublished: true,
      img: 'https://picsum.photos/seed/facility-music/800/600',
      desc: 'Professional music studios with Steinway-ready piano rooms, acoustic-treated recording booths, ensemble rehearsal halls, and an ABRSM examination centre.',
      highlights: 'Piano rooms\nRecording booth\nEnsemble hall\nABRSM centre' },
    { id: 'fac-3', name: 'Dance Studio',           icon: '🩰', sortOrder: 3, isPublished: true,
      img: 'https://picsum.photos/seed/facility-dance/800/600',
      desc: 'Full-wall mirrors, sprung wooden floors, professional lighting rigs, and 4K capture systems for portfolio development and performance recording.',
      highlights: 'Sprung floors\nFull-wall mirrors\nProfessional lighting\n4K recording' },
    { id: 'fac-4', name: 'Sports Complex',         icon: '🏟️', sortOrder: 4, isPublished: true,
      img: 'https://picsum.photos/seed/facility-sports/800/600',
      desc: 'Premium sports complex with two football pitches, basketball and volleyball courts, 25m swimming pool, 400m athletics track, and a fully equipped gym.',
      highlights: '25m swimming pool\nFootball pitches\nAthletics track\nFully equipped gym' },
    { id: 'fac-5', name: 'Digital Library',        icon: '📚', sortOrder: 5, isPublished: true,
      img: 'https://picsum.photos/seed/facility-library/800/600',
      desc: 'A 10,000-volume library with digital cataloguing, quiet study rooms, a maker space, and access to global online databases and journals.',
      highlights: '10,000+ volumes\nDigital catalogue\nStudy rooms\nOnline database access' },
    { id: 'fac-6', name: 'Dining Hall',            icon: '🍽️', sortOrder: 6, isPublished: true,
      img: 'https://picsum.photos/seed/facility-dining/800/600',
      desc: 'Spacious dining hall serving 600 students per sitting. Balanced, nutritionist-approved menus with halal, vegetarian, and allergy-aware options.',
      highlights: '600-seat capacity\nNutritionist menus\nHalal & vegetarian\nAllergy-aware' },
    { id: 'fac-7', name: 'School Buses',           icon: '🚌', sortOrder: 7, isPublished: true,
      img: 'https://picsum.photos/seed/facility-buses/800/600',
      desc: 'Eight modern, GPS-tracked school buses covering Kutus, Kerugoya, Sagana, Kagio, Kagumo, Kianyaga, Mutira, and Ngariama routes.',
      highlights: '8 buses\nGPS tracked\n8 routes\nLicensed drivers' },
    { id: 'fac-8', name: 'Science Laboratories',   icon: '🔬', sortOrder: 8, isPublished: true,
      img: 'https://picsum.photos/seed/facility-science/800/600',
      desc: 'Four dedicated labs — Biology, Chemistry, Physics, and Computer Science — equipped for KNEC and Cambridge IGCSE practical examinations.',
      highlights: 'Biology lab\nChemistry lab\nPhysics lab\nComputer science lab' },
  ]

  const cocurrActivities: CocurrActivity[] = [
    { id: 'ca-s1', categoryId: 'sports',    name: 'Athletics',                   icon: '🏃',  desc: '400m track, field events, relay teams and cross-country competing at county and national level.',                                               sortOrder: 1 },
    { id: 'ca-s2', categoryId: 'sports',    name: 'Ball Games',                  icon: '⚽',  desc: 'Football, basketball, volleyball and netball — structured leagues, coaching and inter-school fixtures.',                                         sortOrder: 2 },
    { id: 'ca-s3', categoryId: 'sports',    name: 'Gymnastics',                  icon: '🤸',  desc: 'Floor work, apparatus and rhythmic gymnastics offered through our Physical Education programme.',                                                sortOrder: 3 },
    { id: 'ca-s4', categoryId: 'sports',    name: 'Martial Arts',                icon: '🥋',  desc: 'Taekwondo and karate offered as both fitness training and competitive discipline.',                                                               sortOrder: 4 },
    { id: 'ca-s5', categoryId: 'sports',    name: 'Boxing',                      icon: '🥊',  desc: 'Supervised boxing and fitness boxing under certified coaches in our dedicated ring.',                                                             sortOrder: 5 },
    { id: 'ca-s6', categoryId: 'sports',    name: 'Indoor Sports',               icon: '🏓',  desc: 'Table tennis, chess, scrabble, and badminton available for all year groups.',                                                                    sortOrder: 6 },
    { id: 'ca-s7', categoryId: 'sports',    name: 'Water Sports',                icon: '🏊',  desc: '25m heated pool for competitive swimming, water polo and synchronized swimming.',                                                                sortOrder: 7 },
    { id: 'ca-s8', categoryId: 'sports',    name: 'Outdoor Pursuits',            icon: '⛰️', desc: "Hiking, orienteering, camping, and environmental trail activities in Kirinyaga's rolling hills.",                                                sortOrder: 8 },
    { id: 'ca-a1', categoryId: 'arts',      name: 'Music',                       icon: '🎵',  desc: 'Piano, violin, guitar, brass, woodwind, drums and choir. ABRSM examination centre on campus.',                                                  sortOrder: 1 },
    { id: 'ca-a2', categoryId: 'arts',      name: 'Dance',                       icon: '💃',  desc: 'Ballet, contemporary, African dance and hip-hop taught in our sprung-floor dance studios.',                                                      sortOrder: 2 },
    { id: 'ca-a3', categoryId: 'arts',      name: 'Drama & Theatre',             icon: '🎭',  desc: 'Annual productions, script writing, stage craft, lighting design and performance portfolios.',                                                   sortOrder: 3 },
    { id: 'ca-a4', categoryId: 'arts',      name: 'Elocution',                   icon: '🎤',  desc: 'Public speaking, debate, poetry recitation and oratory — internal and national competitions.',                                                   sortOrder: 4 },
    { id: 'ca-a5', categoryId: 'arts',      name: 'Fine Arts',                   icon: '🎨',  desc: 'Painting, drawing, sculpture and mixed media across all levels with exhibition opportunities.',                                                  sortOrder: 5 },
    { id: 'ca-a6', categoryId: 'arts',      name: 'Applied Arts',                icon: '✂️', desc: 'Textile design, ceramics, graphic design and craft with real-world application.',                                                                sortOrder: 6 },
    { id: 'ca-a7', categoryId: 'arts',      name: 'Visual Arts',                 icon: '📷',  desc: 'Photography, videography and digital media explored through the lens of creative storytelling.',                                                sortOrder: 7 },
    { id: 'ca-a8', categoryId: 'arts',      name: 'Time-Based Media',            icon: '🎬',  desc: 'Film-making, animation and multimedia production for Senior School learners.',                                                                   sortOrder: 8 },
    { id: 'ca-c1', categoryId: 'community', name: 'Community Service Learning',  icon: '❤️', desc: 'Structured CSL projects in Kutus and Kirinyaga County — environmental, health and education initiatives.',                                      sortOrder: 1 },
    { id: 'ca-c2', categoryId: 'community', name: 'Kenya National Music Festival',icon: '🎼', desc: 'Annual participation exposes learners to diverse cultural instruments and musical traditions from across Kenya.',                                sortOrder: 2 },
    { id: 'ca-c3', categoryId: 'community', name: 'Cultural Festivals',          icon: '🪘',  desc: 'Celebrating Kenyan heritage through food, costume, language, song and storytelling.',                                                            sortOrder: 3 },
    { id: 'ca-c4', categoryId: 'community', name: 'Debate & Model UN',           icon: '🌍',  desc: 'Critical thinking, diplomacy and global awareness through inter-school debate and Model UN simulations.',                                        sortOrder: 4 },
    { id: 'ca-c5', categoryId: 'community', name: 'Environmental Clubs',         icon: '🌱',  desc: 'Sustainability projects including tree planting, recycling drives and solar energy education.',                                                   sortOrder: 5 },
    { id: 'ca-c6', categoryId: 'community', name: 'Student Council',             icon: '🗳️', desc: 'Elected student leadership developing governance, advocacy and civic responsibility skills.',                                                     sortOrder: 6 },
    { id: 'ca-c7', categoryId: 'community', name: 'Peer Counselling',            icon: '🤲',  desc: 'Trained student peer supporters promoting mental wellbeing and positive school culture.',                                                         sortOrder: 7 },
    { id: 'ca-c8', categoryId: 'community', name: 'Inter-House Competitions',    icon: '🏅',  desc: 'Cross-disciplinary house competitions in academics, sports, arts and community engagement.',                                                     sortOrder: 8 },
    { id: 'ca-t1', categoryId: 'cts',       name: 'Tourism & Hospitality',       icon: '🏨',  desc: 'Front office operations, tour guiding, event management and customer service fundamentals.',                                                     sortOrder: 1 },
    { id: 'ca-t2', categoryId: 'cts',       name: 'Culinary Arts',               icon: '👨‍🍳', desc: 'Food preparation, nutrition, kitchen management and catering for school and community events.',                                               sortOrder: 2 },
    { id: 'ca-t3', categoryId: 'cts',       name: 'Hairdressing & Beauty',       icon: '💇',  desc: 'Salon skills, cosmetology basics and entrepreneurship for the beauty industry.',                                                                 sortOrder: 3 },
    { id: 'ca-t4', categoryId: 'cts',       name: 'Welding & Metalwork',         icon: '🔩',  desc: 'Fabrication, welding techniques and basic engineering for technical career pathways.',                                                           sortOrder: 4 },
    { id: 'ca-t5', categoryId: 'cts',       name: 'Photography',                 icon: '📸',  desc: 'Digital photography, darkroom techniques, editing and commercial photography practice.',                                                         sortOrder: 5 },
    { id: 'ca-t6', categoryId: 'cts',       name: 'Carpentry & Woodwork',        icon: '🪚',  desc: 'Joinery, furniture making and woodwork design with an entrepreneurship focus.',                                                                  sortOrder: 6 },
    { id: 'ca-t7', categoryId: 'cts',       name: 'Agriculture',                 icon: '🌾',  desc: "Crop farming, animal husbandry, agribusiness and sustainable food systems aligned to Kirinyaga's context.",                                     sortOrder: 7 },
    { id: 'ca-t8', categoryId: 'cts',       name: 'ICT & Digital Projects',      icon: '💻',  desc: 'Web development, coding, data management, app design and digital entrepreneurship projects.',                                                    sortOrder: 8 },
  ]

  const sportsOffered: SportOffered[] = [
    { id: 'so-1', name: 'Football',          icon: '⚽', desc: 'Two pitches, inter-house and inter-school leagues, dedicated coaching staff.',                 sortOrder: 1 },
    { id: 'so-2', name: 'Basketball',        icon: '🏀', desc: 'Full-size courts. Boys and girls teams competing regionally.',                                  sortOrder: 2 },
    { id: 'so-3', name: 'Volleyball',        icon: '🏐', desc: 'Indoor and outdoor courts for both competitive and recreational play.',                         sortOrder: 3 },
    { id: 'so-4', name: 'Athletics',         icon: '🏃', desc: '400m track, field events, relay squads — training five days a week.',                          sortOrder: 4 },
    { id: 'so-5', name: 'Swimming',          icon: '🏊', desc: '25m heated pool with certified coaches and county-level competition.',                          sortOrder: 5 },
    { id: 'so-6', name: 'Tennis',            icon: '🎾', desc: 'Two courts for individual and doubles coaching from juniors upward.',                           sortOrder: 6 },
  ]

  const sportTrophies: SportTrophy[] = [
    { id: 'tr-1', year: '2025', title: 'Kirinyaga County Football Champions',        category: 'Football',   sortOrder: 1 },
    { id: 'tr-2', year: '2025', title: 'Regional Athletics — Gold (4×100m Relay)',   category: 'Athletics',  sortOrder: 2 },
    { id: 'tr-3', year: '2024', title: 'Inter-School Basketball — Boys Division',    category: 'Basketball', sortOrder: 3 },
    { id: 'tr-4', year: '2024', title: 'Swimming Championships — 3 Gold Medals',     category: 'Swimming',   sortOrder: 4 },
    { id: 'tr-5', year: '2023', title: 'National Volleyball — Semi-finalists',       category: 'Volleyball', sortOrder: 5 },
    { id: 'tr-6', year: '2023', title: 'County Cross Country Champions',             category: 'Athletics',  sortOrder: 6 },
  ]

  const musicInstruments: MusicInstrument[] = [
    { id: 'mi-1', name: 'Piano',              icon: '🎹', desc: 'Steinway-ready studios. Lessons from beginner to Grade 8 ABRSM.',                              sortOrder: 1 },
    { id: 'mi-2', name: 'Violin',             icon: '🎻', desc: 'Classical strings with ensemble and solo performance training.',                                 sortOrder: 2 },
    { id: 'mi-3', name: 'Guitar',             icon: '🎸', desc: 'Acoustic, classical and electric — across all skill levels.',                                   sortOrder: 3 },
    { id: 'mi-4', name: 'Brass',              icon: '🎺', desc: 'Trumpet, trombone, French horn — full brass section ensemble.',                                 sortOrder: 4 },
    { id: 'mi-5', name: 'Woodwind',           icon: '🎷', desc: 'Flute, clarinet, saxophone — individual and band sessions.',                                    sortOrder: 5 },
    { id: 'mi-6', name: 'Drums & Percussion', icon: '🥁', desc: 'Full kit, djembe, marimba and orchestral percussion.',                                          sortOrder: 6 },
  ]

  const musicTeachers: MusicTeacher[] = [
    { id: 'mt-1', name: 'Ms. Ruth Kamau',    subject: 'Piano & Theory',     img: '/images/avatar-44.jpg', credentials: 'B.Mus (University of Nairobi) · ABRSM Grade 8', sortOrder: 1 },
    { id: 'mt-2', name: 'Mr. Victor Omondi', subject: 'Strings & Ensemble', img: '/images/avatar-57.jpg', credentials: 'Conservatoire-trained · 12 years teaching',     sortOrder: 2 },
    { id: 'mt-3', name: 'Ms. Nancy Wanjiru', subject: 'Vocals & Choir',     img: '/images/avatar-32.jpg', credentials: 'Dip. Music Ed. · Former KBC choir director',    sortOrder: 3 },
  ]

  const musicScheduleSlots: MusicScheduleSlot[] = [
    { id: 'ms-1', day: 'Monday',    slots: 'Piano — 3:30–5:00 PM\nChoir Rehearsal — 4:00–5:30 PM',            sortOrder: 1 },
    { id: 'ms-2', day: 'Tuesday',   slots: 'Strings Ensemble — 3:30–5:00 PM\nGuitar — 4:00–5:00 PM',          sortOrder: 2 },
    { id: 'ms-3', day: 'Wednesday', slots: 'Brass & Woodwind — 3:30–5:00 PM\nTheory of Music — 4:00–5:00 PM', sortOrder: 3 },
    { id: 'ms-4', day: 'Thursday',  slots: 'Drums & Percussion — 3:30–5:00 PM\nFull Orchestra — 4:00–6:00 PM',sortOrder: 4 },
    { id: 'ms-5', day: 'Friday',    slots: 'Open Studio — 3:30–5:30 PM\nSolo Coaching (by appointment)',       sortOrder: 5 },
  ]

  const danceStyles: DanceStyle[] = [
    { id: 'ds-1', style: 'Ballet',        icon: '🩰', desc: 'Classical technique from foundational positions to pointe work.', sortOrder: 1 },
    { id: 'ds-2', style: 'Contemporary',  icon: '💫', desc: 'Fluid movement, floor work, and creative improvisation.',         sortOrder: 2 },
    { id: 'ds-3', style: 'African Dance', icon: '🥁', desc: 'Traditional rhythms from across East and West Africa.',           sortOrder: 3 },
    { id: 'ds-4', style: 'Hip-Hop',       icon: '🎤', desc: 'Street styles, breaking, and performance choreography.',          sortOrder: 4 },
  ]

  const dramaPlays: DramaPlay[] = [
    { id: 'dp-1', year: '2024', title: "The Lion's Roar",      desc: 'An original production exploring Kenyan folklore through dance, spoken word, and music. Cast of 60 students.', img: 'https://picsum.photos/seed/drama-2024/600/400', sortOrder: 1 },
    { id: 'dp-2', year: '2023', title: 'Echoes of Kirinyaga',  desc: 'A celebration of Kirinyaga County heritage with traditional dance, acrobatics, and drama. Standing ovation.',   img: 'https://picsum.photos/seed/drama-2023/600/400', sortOrder: 2 },
    { id: 'dp-3', year: '2022', title: "Tomorrow's Leaders",   desc: 'A satirical play on modern education and youth ambition. Directed by Form 4 students.',                         img: 'https://picsum.photos/seed/drama-2022/600/400', sortOrder: 3 },
  ]

  const dramaFaculty: DramaFaculty[] = [
    { id: 'df-1', name: 'Ms. Grace Achieng', role: 'Lead Choreographer · Ballet & Contemporary', img: '/images/avatar-36.jpg', bio: 'Trained in Nairobi and London. 15 years choreographing award-winning productions.',      sortOrder: 1 },
    { id: 'df-2', name: 'Mr. Oscar Njoroge', role: 'Drama Director · Playwright',                img: '/images/avatar-52.jpg', bio: 'Graduate of Kenya National Theatre. Specialist in African contemporary drama.',           sortOrder: 2 },
  ]

  const dramaScheduleSlots: DramaScheduleSlot[] = [
    { id: 'dss-1', day: 'Monday',    activity: 'Ballet — 4:00–5:30 PM',                  sortOrder: 1 },
    { id: 'dss-2', day: 'Tuesday',   activity: 'Drama Workshop — 3:30–5:30 PM',          sortOrder: 2 },
    { id: 'dss-3', day: 'Wednesday', activity: 'Contemporary Dance — 4:00–5:30 PM',      sortOrder: 3 },
    { id: 'dss-4', day: 'Thursday',  activity: 'African Dance & Hip-Hop — 3:30–5:00 PM', sortOrder: 4 },
    { id: 'dss-5', day: 'Friday',    activity: 'Full Company Rehearsal — 3:30–6:00 PM',  sortOrder: 5 },
  ]

  const whyChooseUsItems: WhyChooseUsItem[] = [
    {
      id: 'wcu-1',
      icon: '🏆',
      title: 'Academic Excellence',
      subtitle: 'Top Results, Year After Year',
      desc: 'Demo School consistently ranks among the top-performing schools in Kirinyaga County. Our dual CBC and Cambridge IGCSE pathways are delivered by subject specialists who hold degrees from Kenya\'s leading universities and internationally accredited institutions.',
      stat: '97%',
      statLabel: 'KCSE Pass Rate',
      color: 'gold',
      sortOrder: 1,
      isPublished: true,
    },
    {
      id: 'wcu-2',
      icon: '🏗️',
      title: 'World-Class Facilities',
      subtitle: 'Premium Learning Environments',
      desc: '86 air-conditioned smart classrooms, 4 fully-equipped science labs, a 10,000-volume digital library, professional music studios, sprung-floor dance studios, a 25m heated swimming pool, and GPS-tracked transport — all on one campus in Kutus.',
      stat: '86',
      statLabel: 'Smart Classrooms',
      color: 'blue',
      sortOrder: 2,
      isPublished: true,
    },
    {
      id: 'wcu-3',
      icon: '🎓',
      title: 'Dual Curriculum Pathways',
      subtitle: 'CBC & Cambridge IGCSE',
      desc: 'We are one of the very few schools in Kirinyaga County offering both the Kenya CBC and Cambridge International IGCSE. Students in Grade 10–12 can choose the pathway that best aligns with their future — national universities or international study abroad.',
      stat: '2',
      statLabel: 'Curriculum Pathways',
      color: 'green',
      sortOrder: 3,
      isPublished: true,
    },
    {
      id: 'wcu-4',
      icon: '🎨',
      title: 'Holistic Co-Curricular Programme',
      subtitle: 'Arts, Sports & Community',
      desc: 'From national athletics to ABRSM music exams, ballet to Model UN — our co-curricular programme spans 30+ activities across sports, performing arts, community service, and career & technical education. Every learner finds their genius.',
      stat: '30+',
      statLabel: 'Co-Curricular Activities',
      color: 'purple',
      sortOrder: 4,
      isPublished: true,
    },
    {
      id: 'wcu-5',
      icon: '👩‍🏫',
      title: 'Expert, Passionate Faculty',
      subtitle: '120+ Qualified Educators',
      desc: 'Our 120+ teaching staff hold degrees from the University of Nairobi, Kenyatta University, Moi University, and Cambridge-accredited programmes. Many are TSC-registered specialists with 10+ years of classroom experience and a genuine passion for mentorship.',
      stat: '120+',
      statLabel: 'Qualified Staff',
      color: 'teal',
      sortOrder: 5,
      isPublished: true,
    },
    {
      id: 'wcu-6',
      icon: '🛡️',
      title: 'Safe & Nurturing Environment',
      subtitle: 'Where Every Child Thrives',
      desc: 'CCTV-monitored campus, a dedicated counselling team, an anti-bullying programme, and a student welfare committee ensure every learner feels safe, seen, and supported. Our inclusive culture celebrates diversity and champions every child\'s mental health.',
      stat: '2,000+',
      statLabel: 'Happy Students',
      color: 'rose',
      sortOrder: 6,
      isPublished: true,
    },
    {
      id: 'wcu-7',
      icon: '💰',
      title: 'Affordable Excellence',
      subtitle: 'Value That Goes Beyond Fees',
      desc: 'We believe premium education should be accessible. Competitive fee structures, merit scholarships, sibling discounts, and flexible payment plans via M-Pesa make an Demo School education a genuine investment — not a barrier — for families across Kirinyaga County.',
      stat: '15+',
      statLabel: 'Scholarship Awards Annually',
      color: 'amber',
      sortOrder: 7,
      isPublished: true,
    },
    {
      id: 'wcu-8',
      icon: '🤝',
      title: 'Strong Community & Values',
      subtitle: 'Rooted in Kirinyaga, Ready for the World',
      desc: 'Founded in Kutus in 2005, Demo School is deeply woven into the Kirinyaga community. Our annual cultural festivals, CSL projects, and parent-school partnership programmes build a family where every member — student, parent, and teacher — belongs.',
      stat: '20+',
      statLabel: 'Years Serving Kirinyaga',
      color: 'green',
      sortOrder: 8,
      isPublished: true,
    },
  ]

  return {
    users, students, staff, academicYears, classes, subjects, assessmentSchemes,
    exams, payments, invoices, scholarships, expenses, feeStructures,
    messages, announcements, meetingSlots, leaveRequests, transportRoutes,
    vehicles, books, borrowings, auditLog, mediaAssets, settings, admissions,
    timetableSlots, attendanceRecords, studentGrades, homework,
    publicBlogPosts, publicEvents, publicGalleryImages, publicProgramLevels,
    publicFeeRows, publicTeachers, publicSportFixtures,
    cmsPages, cmsBlocks,
    aboutCoreValues, aboutHistoryItems,
    academicsSchoolLevels, academicsCompetencies,
    facilities,
    cocurrActivities, sportsOffered, sportTrophies,
    musicInstruments, musicTeachers, musicScheduleSlots,
    danceStyles, dramaPlays, dramaFaculty, dramaScheduleSlots,
    whyChooseUsItems,
  }
}

// ── Singleton store ────────────────────────────────────────────────────────

const STORAGE_KEY = 'alber_db_v17'

function loadStore(): DB {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as DB
  } catch { /* ignore */ }
  return createSeed()
}

function saveStore(db: DB): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  } catch { /* ignore quota errors */ }
}

let _db: DB = loadStore()

export function getDB(): DB {
  return _db
}

export function mutateDB(fn: (db: DB) => void): DB {
  fn(_db)
  saveStore(_db)
  return _db
}

export function resetDB(): DB {
  _db = createSeed()
  saveStore(_db)
  return _db
}

export { newId }
