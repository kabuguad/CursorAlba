/**
 * In-Memory Data Store
 * Single source of truth for all mock data. Backed by sessionStorage so data
 * survives React re-renders but resets on tab close (simulating a session-scoped
 * API backend). Swap this module for real Axios calls when the ASP.NET Core
 * backend is ready — all service modules only import from here.
 */

import { newId } from './mockApi'

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
}

// ── Seed Data ──────────────────────────────────────────────────────────────

function createSeed(): DB {
  const now = new Date().toISOString()
  const today = new Date().toISOString().slice(0, 10)

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
    { id: 'ann-004', title: 'Science Fair — Registration Open', body: 'The Annual Alber School Science Fair is on 15 July 2026. Students from Grade 7–12 can register their projects before 15 June. Forms available from HODs.', targetRoles: ['student', 'teacher', 'parent'], targetGrades: ['Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'], priority: 'normal', publishAt: '2026-05-28T08:00:00Z', expiresAt: '2026-06-16T00:00:00Z', status: 'published', createdBy: 'Dr. Wanjiku Mwangi', createdAt: '2026-05-27T11:00:00Z', readCount: 67 },
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
    { id: 'mda-001', name: 'school-hero-bg.jpg', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200', type: 'image', size: '2.1 MB', uploadedAt: '2026-01-15T10:00:00Z', uploadedBy: 'Dr. Wanjiku Mwangi', category: 'Hero', usedIn: ['Home Page'] },
    { id: 'mda-002', name: 'science-lab.jpg', url: 'https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?w=800', type: 'image', size: '1.4 MB', uploadedAt: '2026-02-10T11:00:00Z', uploadedBy: 'Dr. Wanjiku Mwangi', category: 'Facilities', usedIn: ['Facilities Page', 'Gallery'] },
    { id: 'mda-003', name: 'sports-day-2025.jpg', url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800', type: 'image', size: '3.2 MB', uploadedAt: '2026-03-05T14:00:00Z', uploadedBy: 'Dr. Wanjiku Mwangi', category: 'Sports', usedIn: ['Gallery'] },
    { id: 'mda-004', name: 'school-prospectus-2026.pdf', url: '#', type: 'document', size: '4.8 MB', uploadedAt: '2026-01-01T08:00:00Z', uploadedBy: 'Albert Njeru', category: 'Documents', usedIn: ['Admissions Page'] },
    { id: 'mda-005', name: 'music-performance.jpg', url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800', type: 'image', size: '1.8 MB', uploadedAt: '2026-04-20T16:00:00Z', uploadedBy: 'Dr. Wanjiku Mwangi', category: 'Arts', usedIn: ['Gallery', 'Co-Curricular'] },
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
    schoolName: 'Alber School',
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

  return {
    users, students, staff, academicYears, classes, subjects, assessmentSchemes,
    exams, payments, invoices, scholarships, expenses, feeStructures,
    messages, announcements, meetingSlots, leaveRequests, transportRoutes,
    vehicles, books, borrowings, auditLog, mediaAssets, settings, admissions,
  }
}

// ── Singleton store ────────────────────────────────────────────────────────

const STORAGE_KEY = 'alber_db_v2'

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
