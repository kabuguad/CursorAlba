/**
 * Demo / Fallback Portal Data
 * ───────────────────────────
 * Used when the ASP.NET Core backend is unreachable (ECONNREFUSED / Network Error).
 * Replace each function with a real API call once the backend is ready.
 * All shapes match exactly what the real API mappers produce so the UI
 * receives identical objects in both modes.
 */

// ── helpers ────────────────────────────────────────────────────────────────

function gradeLabel(total: number): string {
  if (total >= 80) return 'A'
  if (total >= 75) return 'B+'
  if (total >= 70) return 'B'
  if (total >= 65) return 'C+'
  if (total >= 60) return 'C'
  return 'D'
}

interface GradeRow {
  id: string; studentId: string; subjectId: string; subjectName: string
  termId: string; classId: string
  cat1: number | null; cat2: number | null; endterm: number | null
  total: number | null; grade: string; remarks: string
}

function mkGrade(
  idx: number, subjectName: string,
  cat1: number, cat2: number, endterm: number | null,
  termId: string, remark = '',
): GradeRow {
  const total = endterm !== null ? cat1 + cat2 + endterm : null
  return {
    id: `g-${termId}-${idx}`,
    studentId: 'demo-s1',
    subjectId: subjectName,
    subjectName,
    termId,
    classId: 'demo-cls7j',
    cat1, cat2, endterm,
    total,
    grade: total !== null ? gradeLabel(total) : '',
    remarks: remark,
  }
}

function termAverage(grades: GradeRow[]): number | null {
  const done = grades.filter(g => g.total !== null)
  if (!done.length) return null
  return Math.round(done.reduce((s, g) => s + (g.total ?? 0), 0) / done.length)
}

/** Generate weekday dates between two ISO date strings (inclusive) */
function schoolDays(start: string, end: string): string[] {
  const days: string[] = []
  const cur = new Date(start + 'T00:00:00')
  const fin = new Date(end + 'T00:00:00')
  while (cur <= fin) {
    const d = cur.getDay()
    if (d !== 0 && d !== 6) days.push(cur.toISOString().split('T')[0])
    cur.setDate(cur.getDate() + 1)
  }
  return days
}

// ── Student & parent identity ───────────────────────────────────────────────

export const MOCK_CHILDREN = [
  {
    id: 1, userId: 10,
    fullName: 'Amani Kariuki',
    className: 'Grade 7 Jasmine',
    classId: 7,
    gender: 'Male',
    dateOfBirth: '2013-03-15',
    address: 'Kutus Town, Kirinyaga County',
    parentId: 5,
  },
]

export const MOCK_CHILD_PROFILE = {
  student: {
    id: '1',
    admNo: 'ADM/2023/042',
    firstName: 'Amani',
    lastName: 'Kariuki',
    dob: '2013-03-15',
    gender: 'Male' as const,
    grade: 'Grade 7',
    classId: '7',
    photo: null,
    status: 'active' as const,
  },
  classInfo: {
    id: '7',
    name: 'Grade 7 Jasmine',
    grade: 'Grade 7',
    stream: 'Jasmine',
  },
  term: null,
  invoice: null,
}

// ── Grade history — 2 years × 3 terms ────────────────────────────────────────
// Scores: cat1/30 + cat2/30 + endterm/40 = total/100
// Trend: 67 → 73 → 78 → 82 → 86 (current, partial)

const subjects = [
  'Mathematics', 'English Language', 'Kiswahili',
  'Biology', 'Chemistry', 'Physics',
  'History & Government', 'Geography',
  'Computer Science', 'Physical Education',
]

// 2025 Term 1 — avg 67
const g2025t1 = [
  mkGrade(1,'Mathematics',          18,17,28,'2025-T1','Good grasp of basics. Needs more practice.'),
  mkGrade(2,'English Language',     22,21,31,'2025-T1','Excellent comprehension and expression.'),
  mkGrade(3,'Kiswahili',            19,18,28,'2025-T1','Good effort. Work on vocabulary.'),
  mkGrade(4,'Biology',              16,15,24,'2025-T1','Concepts understood. Lab work needs improvement.'),
  mkGrade(5,'Chemistry',            14,13,22,'2025-T1','Foundation work needed. Seek extra help.'),
  mkGrade(6,'Physics',              17,16,25,'2025-T1','Calculations improving. Keep practising.'),
  mkGrade(7,'History & Government', 20,19,29,'2025-T1','Good command of facts.'),
  mkGrade(8,'Geography',            21,20,30,'2025-T1','Strong map work skills.'),
  mkGrade(9,'Computer Science',     23,22,32,'2025-T1','Excellent logical thinking.'),
  mkGrade(10,'Physical Education',  26,25,36,'2025-T1','Outstanding performance.'),
]

// 2025 Term 2 — avg 73
const g2025t2 = [
  mkGrade(1,'Mathematics',          20,19,30,'2025-T2','Algebra improved significantly.'),
  mkGrade(2,'English Language',     23,22,33,'2025-T2','Good essay writing. Work on grammar.'),
  mkGrade(3,'Kiswahili',            21,20,31,'2025-T2','Insha writing good. Continue reading.'),
  mkGrade(4,'Biology',              18,17,27,'2025-T2','Cell biology well understood.'),
  mkGrade(5,'Chemistry',            16,15,26,'2025-T2','Chemical equations improving.'),
  mkGrade(6,'Physics',              19,18,28,'2025-T2','Mechanics well grasped.'),
  mkGrade(7,'History & Government', 22,21,32,'2025-T2','Analysis skills are growing.'),
  mkGrade(8,'Geography',            23,22,33,'2025-T2','Climate unit excellent.'),
  mkGrade(9,'Computer Science',     25,24,34,'2025-T2','Programming projects outstanding.'),
  mkGrade(10,'Physical Education',  27,26,37,'2025-T2','Team leadership well demonstrated.'),
]

// 2025 Term 3 — avg 78
const g2025t3 = [
  mkGrade(1,'Mathematics',          22,21,32,'2025-T3','Geometry mastered. Excellent revision.'),
  mkGrade(2,'English Language',     24,23,34,'2025-T3','Creative writing is a clear strength.'),
  mkGrade(3,'Kiswahili',            22,21,32,'2025-T3','Methali and hadithi well handled.'),
  mkGrade(4,'Biology',              20,19,30,'2025-T3','Ecology unit very well done.'),
  mkGrade(5,'Chemistry',            18,17,28,'2025-T3','Acids and bases understood.'),
  mkGrade(6,'Physics',              21,20,31,'2025-T3','Wave theory improved greatly.'),
  mkGrade(7,'History & Government', 23,22,34,'2025-T3','Independence unit top marks.'),
  mkGrade(8,'Geography',            24,23,35,'2025-T3','Economic geography excellent.'),
  mkGrade(9,'Computer Science',     26,25,36,'2025-T3','Database design project outstanding.'),
  mkGrade(10,'Physical Education',  28,27,38,'2025-T3','Selected for school athletics team.'),
]

// 2026 Term 1 — avg 82
const g2026t1 = [
  mkGrade(1,'Mathematics',          23,22,34,'2026-T1','Quadratic equations mastered.'),
  mkGrade(2,'English Language',     25,24,36,'2026-T1','Writing and comprehension excellent.'),
  mkGrade(3,'Kiswahili',            24,23,34,'2026-T1','Very good across all skills.'),
  mkGrade(4,'Biology',              22,21,32,'2026-T1','Human body unit excellent.'),
  mkGrade(5,'Chemistry',            20,19,30,'2026-T1','Periodic table well understood.'),
  mkGrade(6,'Physics',              22,21,32,'2026-T1','Electricity topic mastered.'),
  mkGrade(7,'History & Government', 24,23,35,'2026-T1','Research project commended.'),
  mkGrade(8,'Geography',            25,24,36,'2026-T1','Mapping and GIS skills excellent.'),
  mkGrade(9,'Computer Science',     27,26,37,'2026-T1','Software project top of class.'),
  mkGrade(10,'Physical Education',  29,27,38,'2026-T1','County-level selection — well done!'),
]

// 2026 Term 2 (current) — some subjects still pending end-term exam
const g2026t2 = [
  mkGrade(1,'Mathematics',          25,23,null,'2026-T2','End-term exam pending.'),
  mkGrade(2,'English Language',     26,25,37,'2026-T2','Argumentative essay — top marks.'),
  mkGrade(3,'Kiswahili',            25,24,36,'2026-T2','Excellent Fasihi performance.'),
  mkGrade(4,'Biology',              23,22,33,'2026-T2','Genetics unit very well done.'),
  mkGrade(5,'Chemistry',            21,20,31,'2026-T2','Organic chemistry improving.'),
  mkGrade(6,'Physics',              23,22,null,'2026-T2','End-term exam pending.'),
  mkGrade(7,'History & Government', 25,24,37,'2026-T2','Colonial history essay excellent.'),
  mkGrade(8,'Geography',            26,25,37,'2026-T2','Population unit top marks.'),
  mkGrade(9,'Computer Science',     27,27,38,'2026-T2','Web development project outstanding.'),
  mkGrade(10,'Physical Education',  29,28,39,'2026-T2','County athletics champion.'),
]

export const MOCK_GRADES_HISTORY = [
  {
    yearId: '2025', yearLabel: '2025', isCurrent: false,
    terms: [
      { termId: '2025-T1', termLabel: 'Term 1 2025', isCurrent: false, grades: g2025t1, average: termAverage(g2025t1) },
      { termId: '2025-T2', termLabel: 'Term 2 2025', isCurrent: false, grades: g2025t2, average: termAverage(g2025t2) },
      { termId: '2025-T3', termLabel: 'Term 3 2025', isCurrent: false, grades: g2025t3, average: termAverage(g2025t3) },
    ],
  },
  {
    yearId: '2026', yearLabel: '2026', isCurrent: true,
    terms: [
      { termId: '2026-T1', termLabel: 'Term 1 2026', isCurrent: false, grades: g2026t1, average: termAverage(g2026t1) },
      { termId: '2026-T2', termLabel: 'Term 2 2026', isCurrent: true,  grades: g2026t2, average: termAverage(g2026t2) },
    ],
  },
]

// ── Attendance — Term 2 2026 (Apr 28 – Jun 18) ───────────────────────────────

const TERM2_DAYS = schoolDays('2026-04-28', '2026-06-18')

// Mark specific days as non-present
const ABSENT_DAYS  = new Set(['2026-05-08', '2026-06-03'])
const LATE_DAYS    = new Set(['2026-05-22'])
const EXCUSED_DAYS = new Set(['2026-05-14'])

const attendanceRecords = TERM2_DAYS.map((date, i) => ({
  id: `att-${i + 1}`,
  studentId: 'demo-s1',
  date,
  termId: '2026-T2',
  status: ABSENT_DAYS.has(date) ? 'absent' as const
        : LATE_DAYS.has(date)    ? 'late' as const
        : EXCUSED_DAYS.has(date) ? 'excused' as const
        : 'present' as const,
  remarks: ABSENT_DAYS.has(date)  ? 'No notification received'
          : LATE_DAYS.has(date)    ? 'Arrived 20 minutes late'
          : EXCUSED_DAYS.has(date) ? 'Medical appointment'
          : '',
}))

const attPresent = attendanceRecords.filter(r => r.status === 'present').length
const attAbsent  = attendanceRecords.filter(r => r.status === 'absent').length
const attLate    = attendanceRecords.filter(r => r.status === 'late').length
const attExcused = attendanceRecords.filter(r => r.status === 'excused').length
const attTotal   = attendanceRecords.length

export const MOCK_ATTENDANCE = {
  records:  [...attendanceRecords].sort((a, b) => b.date.localeCompare(a.date)),
  present:  attPresent,
  absent:   attAbsent,
  late:     attLate,
  excused:  attExcused,
  total:    attTotal,
  percent:  attTotal > 0 ? Math.round((attPresent / attTotal) * 100) : 100,
}

// ── Timetable ─────────────────────────────────────────────────────────────────

type TSlot = {
  id: string; classId: string; subjectId: string; subjectName: string
  staffId: string; teacherName: string; day: string
  startTime: string; endTime: string; termId: string; room: string
}

function slot(
  id: string, day: string,
  start: string, end: string,
  subject: string, teacher: string, room: string,
): TSlot {
  return {
    id, classId: 'demo-cls7j',
    subjectId: subject, subjectName: subject,
    staffId: 'demo-staff', teacherName: teacher,
    day, startTime: start, endTime: end,
    termId: '2026-T2', room,
  }
}

export const MOCK_TIMETABLE: Record<string, TSlot[]> = {
  Monday: [
    slot('tt-m1','Monday','07:30','08:30','Mathematics',          'Mr. James Ochieng',  'Room 7A'),
    slot('tt-m2','Monday','08:30','09:30','English Language',     'Ms. Mary Wanjiku',   'Room 7A'),
    slot('tt-m3','Monday','09:30','10:30','Kiswahili',            'Mr. David Kamau',    'Room 7A'),
    slot('tt-m4','Monday','11:00','12:00','Biology',              'Ms. Grace Akinyi',   'Lab 1'),
    slot('tt-m5','Monday','12:00','13:00','Chemistry',            'Mr. Samuel Njoroge', 'Lab 2'),
  ],
  Tuesday: [
    slot('tt-t1','Tuesday','07:30','08:30','Physics',             'Mr. Peter Mutua',    'Lab 3'),
    slot('tt-t2','Tuesday','08:30','09:30','History & Government','Ms. Faith Chebet',   'Room 7A'),
    slot('tt-t3','Tuesday','09:30','10:30','Geography',           'Mr. Joseph Waweru',  'Room 7A'),
    slot('tt-t4','Tuesday','11:00','12:00','Computer Science',    'Ms. Alice Njeri',    'CS Lab'),
    slot('tt-t5','Tuesday','12:00','13:00','Physical Education',  'Mr. Daniel Otieno',  'Field'),
  ],
  Wednesday: [
    slot('tt-w1','Wednesday','07:30','08:30','Mathematics',       'Mr. James Ochieng',  'Room 7A'),
    slot('tt-w2','Wednesday','08:30','09:30','English Language',  'Ms. Mary Wanjiku',   'Room 7A'),
    slot('tt-w3','Wednesday','09:30','10:30','Biology',           'Ms. Grace Akinyi',   'Lab 1'),
    slot('tt-w4','Wednesday','11:00','12:00','Chemistry',         'Mr. Samuel Njoroge', 'Lab 2'),
    slot('tt-w5','Wednesday','12:00','13:00','Kiswahili',         'Mr. David Kamau',    'Room 7A'),
  ],
  Thursday: [
    slot('tt-th1','Thursday','07:30','08:30','Physics',           'Mr. Peter Mutua',    'Lab 3'),
    slot('tt-th2','Thursday','08:30','09:30','History & Government','Ms. Faith Chebet', 'Room 7A'),
    slot('tt-th3','Thursday','09:30','10:30','Computer Science',  'Ms. Alice Njeri',    'CS Lab'),
    slot('tt-th4','Thursday','11:00','12:00','Geography',         'Mr. Joseph Waweru',  'Room 7A'),
    slot('tt-th5','Thursday','12:00','13:00','Mathematics',       'Mr. James Ochieng',  'Room 7A'),
  ],
  Friday: [
    slot('tt-f1','Friday','07:30','08:30','English Language',     'Ms. Mary Wanjiku',   'Room 7A'),
    slot('tt-f2','Friday','08:30','09:30','Kiswahili',            'Mr. David Kamau',    'Room 7A'),
    slot('tt-f3','Friday','09:30','10:30','Physical Education',   'Mr. Daniel Otieno',  'Field'),
    slot('tt-f4','Friday','11:00','12:00','Biology',              'Ms. Grace Akinyi',   'Lab 1'),
    slot('tt-f5','Friday','12:00','13:00','Computer Science',     'Ms. Alice Njeri',    'CS Lab'),
  ],
}

// ── Homework ──────────────────────────────────────────────────────────────────

export const MOCK_HOMEWORK = [
  {
    id: 'hw-1', title: 'Algebra — Quadratic Equations Worksheet',
    description: 'Complete exercises 4.1–4.5 from the textbook. Show all working.',
    classId: 'demo-cls7j', subjectId: 'Mathematics', subjectName: 'Mathematics',
    assignedDate: '2026-06-10', dueDate: '2026-06-20',
    teacherName: 'Mr. James Ochieng', status: 'active' as const,
  },
  {
    id: 'hw-2', title: 'Biology Lab Report — Photosynthesis Experiment',
    description: 'Write a full lab report on the leaf disc flotation experiment conducted on June 9.',
    classId: 'demo-cls7j', subjectId: 'Biology', subjectName: 'Biology',
    assignedDate: '2026-06-09', dueDate: '2026-06-25',
    teacherName: 'Ms. Grace Akinyi', status: 'active' as const,
  },
  {
    id: 'hw-3', title: 'English Essay — Effects of Climate Change in Kenya',
    description: 'Write a 500-word argumentative essay. Use at least three sources.',
    classId: 'demo-cls7j', subjectId: 'English Language', subjectName: 'English Language',
    assignedDate: '2026-06-05', dueDate: '2026-06-16',
    teacherName: 'Ms. Mary Wanjiku', status: 'active' as const,
  },
  {
    id: 'hw-4', title: 'Computer Science — Database Design Project',
    description: 'Design an ER diagram and write SQL queries for a school library system.',
    classId: 'demo-cls7j', subjectId: 'Computer Science', subjectName: 'Computer Science',
    assignedDate: '2026-06-12', dueDate: '2026-06-30',
    teacherName: 'Ms. Alice Njeri', status: 'active' as const,
  },
  {
    id: 'hw-5', title: 'Geography — East Africa Map Work',
    description: 'Label physical features, capitals and economic zones on the outline map provided.',
    classId: 'demo-cls7j', subjectId: 'Geography', subjectName: 'Geography',
    assignedDate: '2026-05-20', dueDate: '2026-05-30',
    teacherName: 'Mr. Joseph Waweru', status: 'closed' as const,
  },
  {
    id: 'hw-6', title: 'Kiswahili — Insha ya Mazingira',
    description: 'Andika insha ya maneno 400 kuhusu umuhimu wa kulinda mazingira.',
    classId: 'demo-cls7j', subjectId: 'Kiswahili', subjectName: 'Kiswahili',
    assignedDate: '2026-05-05', dueDate: '2026-05-15',
    teacherName: 'Mr. David Kamau', status: 'closed' as const,
  },
]

// ── Fees ──────────────────────────────────────────────────────────────────────

export const MOCK_FEES = {
  studentFeeId: 1,
  studentName: 'Amani Kariuki',
  className: 'Grade 7 Jasmine',
  feeName: 'Term 2 2026 School Fees',
  // Shape expected by ParentOverview (invoice.total / invoice.paid)
  total:     43000,
  paid:      30000,
  balance:   13000,
  // Alias fields matching InvoiceDto shape
  amountDue:  43000,
  amountPaid: 30000,
  status: 'partial',
  dueDate: '2026-05-15',
  paidAt: null,
  lineItems: [
    { description: 'Tuition Fee',          amount: 35000 },
    { description: 'Transport (Term 2)',    amount:  5000 },
    { description: 'Activities & Excursions', amount: 3000 },
  ],
  payments: [
    { date: '2026-04-28', amount: 20000, method: 'M-Pesa', reference: 'QJK7382940' },
    { date: '2026-05-20', amount: 10000, method: 'Bank Transfer', reference: 'EQB-2026-0520' },
  ],
}

// ── Announcements ─────────────────────────────────────────────────────────────

export const MOCK_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    title: 'End-Term Examinations — 23–27 June 2026',
    body: 'End-term examinations for all classes will be held from Monday 23 June to Friday 27 June 2026. Students should arrive by 7:15 AM each day. No late entry after 7:30 AM. Please ensure all revision is completed by Friday 20 June.',
    priority: 'urgent' as const,
    publishAt: '2026-06-10',
    targetRoles: ['parent'],
  },
  {
    id: 'ann-2',
    title: 'Outstanding Fee Balances — Action Required',
    body: 'Parents with outstanding Term 2 fee balances are requested to clear by 20 June 2026 to avoid disruption of learning. M-Pesa Paybill: 400200, Account: Admission Number. Contact the bursar\'s office for payment plans.',
    priority: 'high' as const,
    publishAt: '2026-06-08',
    targetRoles: ['parent'],
  },
  {
    id: 'ann-3',
    title: 'Sports Day Rescheduled to Saturday 5 July 2026',
    body: 'The Annual Sports Day originally planned for 28 June has been moved to Saturday 5 July 2026 to avoid clash with end-term exams. All students are encouraged to participate. Parents are warmly invited to attend.',
    priority: 'high' as const,
    publishAt: '2026-06-05',
    targetRoles: ['parent'],
  },
  {
    id: 'ann-4',
    title: 'Parent-Teacher Consultation Day — 12 July 2026',
    body: 'Parents are invited to Alber School on Saturday 12 July 2026 from 8:00 AM to 1:00 PM for the Term 2 Parent-Teacher Consultation. Report cards will be issued on the day. Kindly book your slot via the PT Meetings section of this portal.',
    priority: 'normal' as const,
    publishAt: '2026-06-01',
    targetRoles: ['parent'],
  },
]

// ── Subject list (for reference) ───────────────────────────────────────────
export { subjects as MOCK_SUBJECTS }

// ═══════════════════════════════════════════════════════════════════════════
// TEACHER PORTAL MOCK DATA
// Teacher: Mr. James Ochieng — Sciences (Biology, Chemistry, Physics)
// Classes: Grade 7 Jasmine (cls-7j) · Grade 7 Rose (cls-7r)
// Grade components are percentages 0–100; total = round(cat1*0.2 + cat2*0.2 + endterm*0.6)
// ═══════════════════════════════════════════════════════════════════════════

// ── Teacher profile ───────────────────────────────────────────────────────

export const MOCK_TEACHER_PROFILE = {
  id: 'stf-001',
  userId: 'demo-t1',
  firstName: 'James',
  lastName: 'Ochieng',
  email: 'teacher@alberschool.ke',
  qualification: 'B.Ed Science, University of Nairobi',
  specialization: 'Biology, Chemistry & Physics',
  department: 'Sciences',
  staffNo: 'TSC-1001',
  classIds: ['cls-7j', 'cls-7r'],
  subjects: ['sub-005', 'sub-006', 'sub-007'],
}

// ── Teacher classes ───────────────────────────────────────────────────────

export const MOCK_TEACHER_CLASSES = [
  { id: 'cls-7j', name: 'Grade 7 Jasmine', grade: 'Grade 7', stream: 'Jasmine', studentCount: 12 },
  { id: 'cls-7r', name: 'Grade 7 Rose',    grade: 'Grade 7', stream: 'Rose',    studentCount: 10 },
]

// ── Class students ────────────────────────────────────────────────────────
// Fields used by TeacherClass: fullName, admNo, gender, dob, medicalNotes, emergencyContact.phone
// Fields used by TeacherGradebook/Attendance: id, fullName, admNo

function mkStudent(
  id: string, admNo: string, fullName: string, gender: 'Male' | 'Female',
  dob: string, classId: string,
  medicalNotes?: string, phone?: string,
) {
  return {
    id, userId: `u-${id}`,
    fullName, firstName: fullName.split(' ')[0], lastName: fullName.split(' ').slice(1).join(' '),
    gender, dob, admNo, classId,
    medicalNotes: medicalNotes ?? null,
    emergencyContact: { phone: phone ?? '0700-000-000' },
  }
}

export const MOCK_TEACHER_STUDENTS: Record<string, ReturnType<typeof mkStudent>[]> = {
  'cls-7j': [
    mkStudent('ts-j01','ADM/2023/042','Amani Kariuki',    'Male',   '2013-03-15','cls-7j', undefined,                              '0712-042-042'),
    mkStudent('ts-j02','ADM/2023/018','Brenda Wanjiku',   'Female', '2013-07-22','cls-7j', undefined,                              '0722-018-018'),
    mkStudent('ts-j03','ADM/2023/031','Charles Mutua',    'Male',   '2013-01-08','cls-7j', undefined,                              '0733-031-031'),
    mkStudent('ts-j04','ADM/2023/005','Diana Akinyi',     'Female', '2013-11-30','cls-7j', undefined,                              '0744-005-005'),
    mkStudent('ts-j05','ADM/2023/027','Emmanuel Otieno',  'Male',   '2013-05-19','cls-7j', undefined,                              '0755-027-027'),
    mkStudent('ts-j06','ADM/2023/009','Faith Njeri',      'Female', '2013-09-04','cls-7j', undefined,                              '0766-009-009'),
    mkStudent('ts-j07','ADM/2023/033','George Kamau',     'Male',   '2013-04-12','cls-7j', undefined,                              '0777-033-033'),
    mkStudent('ts-j08','ADM/2023/016','Hannah Chebet',    'Female', '2013-08-25','cls-7j', undefined,                              '0788-016-016'),
    mkStudent('ts-j09','ADM/2023/044','Ibrahim Hassan',   'Male',   '2012-12-01','cls-7j', 'Asthma — keep inhaler accessible.',   '0799-044-044'),
    mkStudent('ts-j10','ADM/2023/022','Jane Muthoni',     'Female', '2013-02-14','cls-7j', undefined,                              '0711-022-022'),
    mkStudent('ts-j11','ADM/2023/038','Kevin Mwangi',     'Male',   '2013-06-07','cls-7j', 'Referred to school counsellor.',      '0721-038-038'),
    mkStudent('ts-j12','ADM/2023/003','Linda Waweru',     'Female', '2013-10-18','cls-7j', undefined,                              '0731-003-003'),
  ],
  'cls-7r': [
    mkStudent('ts-r01','ADM/2023/051','Moses Ochieng',    'Male',   '2013-05-10','cls-7r', undefined,                              '0712-051-051'),
    mkStudent('ts-r02','ADM/2023/055','Nancy Kimani',     'Female', '2013-01-28','cls-7r', undefined,                              '0722-055-055'),
    mkStudent('ts-r03','ADM/2023/067','Oscar Weke',       'Male',   '2013-09-14','cls-7r', undefined,                              '0733-067-067'),
    mkStudent('ts-r04','ADM/2023/058','Priscilla Gatheru','Female', '2013-03-02','cls-7r', undefined,                              '0744-058-058'),
    mkStudent('ts-r05','ADM/2023/073','Quinton Otieno',   'Male',   '2013-07-07','cls-7r', undefined,                              '0755-073-073'),
    mkStudent('ts-r06','ADM/2023/052','Rachel Karanja',   'Female', '2013-11-15','cls-7r', undefined,                              '0766-052-052'),
    mkStudent('ts-r07','ADM/2023/062','Samuel Njoroge',   'Male',   '2013-04-22','cls-7r', undefined,                              '0777-062-062'),
    mkStudent('ts-r08','ADM/2023/056','Tabitha Mugo',     'Female', '2013-08-09','cls-7r', undefined,                              '0788-056-056'),
    mkStudent('ts-r09','ADM/2023/069','Usha Patel',       'Female', '2013-02-17','cls-7r', 'Vegetarian — note for school meals.',  '0799-069-069'),
    mkStudent('ts-r10','ADM/2023/078','Victor Omondi',    'Male',   '2013-06-30','cls-7r', undefined,                              '0711-078-078'),
  ],
}

// ── Class grades — Term 2 2026 (current) ─────────────────────────────────
// sub-005 = Biology · sub-006 = Chemistry · sub-007 = Physics
// cat1/cat2/endterm are percentage scores (0–100); null = exam not yet sat

type TeacherGrade = {
  id: string; studentId: string; subjectId: string; subjectName: string
  classId: string; termId: string
  cat1: number | null; cat2: number | null; endterm: number | null
  total: number | null; grade: string; isLocked: boolean
}

function mkTG(
  classId: string, studentId: string, idx: number,
  subId: string, subName: string,
  cat1: number | null, cat2: number | null, endterm: number | null,
): TeacherGrade {
  const total = (cat1 !== null && cat2 !== null && endterm !== null)
    ? Math.round(cat1 * 0.2 + cat2 * 0.2 + endterm * 0.6)
    : null
  return {
    id: `tg-${classId}-${studentId}-${idx}`,
    studentId, subjectId: subId, subjectName: subName,
    classId, termId: '2026-T2',
    cat1, cat2, endterm, total,
    grade: total !== null ? gradeLabel(total) : '',
    isLocked: false,
  }
}

const BIO = ['sub-005', 'Biology']   as const
const CHE = ['sub-006', 'Chemistry'] as const
const PHY = ['sub-007', 'Physics']   as const

// Jasmine grades — Amani's endterm pending (a few others also pending to show variety)
const jGrades: TeacherGrade[] = [
  // ts-j01 Amani Kariuki — endterm pending
  mkTG('cls-7j','ts-j01',1,...BIO, 78, 75, null),
  mkTG('cls-7j','ts-j01',2,...CHE, 65, 62, null),
  mkTG('cls-7j','ts-j01',3,...PHY, 72, 70, null),
  // ts-j02 Brenda Wanjiku
  mkTG('cls-7j','ts-j02',1,...BIO, 85, 88, 91),
  mkTG('cls-7j','ts-j02',2,...CHE, 72, 75, 78),
  mkTG('cls-7j','ts-j02',3,...PHY, 68, 70, 74),
  // ts-j03 Charles Mutua
  mkTG('cls-7j','ts-j03',1,...BIO, 60, 65, 68),
  mkTG('cls-7j','ts-j03',2,...CHE, 55, 58, 62),
  mkTG('cls-7j','ts-j03',3,...PHY, 58, 60, 65),
  // ts-j04 Diana Akinyi
  mkTG('cls-7j','ts-j04',1,...BIO, 90, 92, 95),
  mkTG('cls-7j','ts-j04',2,...CHE, 85, 88, 90),
  mkTG('cls-7j','ts-j04',3,...PHY, 88, 90, 93),
  // ts-j05 Emmanuel Otieno
  mkTG('cls-7j','ts-j05',1,...BIO, 70, 72, 75),
  mkTG('cls-7j','ts-j05',2,...CHE, 65, 68, 72),
  mkTG('cls-7j','ts-j05',3,...PHY, 68, 70, 73),
  // ts-j06 Faith Njeri
  mkTG('cls-7j','ts-j06',1,...BIO, 88, 85, 87),
  mkTG('cls-7j','ts-j06',2,...CHE, 80, 82, 84),
  mkTG('cls-7j','ts-j06',3,...PHY, 78, 76, 80),
  // ts-j07 George Kamau
  mkTG('cls-7j','ts-j07',1,...BIO, 65, 68, 70),
  mkTG('cls-7j','ts-j07',2,...CHE, 60, 62, 65),
  mkTG('cls-7j','ts-j07',3,...PHY, 63, 65, 68),
  // ts-j08 Hannah Chebet
  mkTG('cls-7j','ts-j08',1,...BIO, 82, 84, 86),
  mkTG('cls-7j','ts-j08',2,...CHE, 75, 78, 80),
  mkTG('cls-7j','ts-j08',3,...PHY, 70, 72, 75),
  // ts-j09 Ibrahim Hassan — at risk
  mkTG('cls-7j','ts-j09',1,...BIO, 45, 48, 50),
  mkTG('cls-7j','ts-j09',2,...CHE, 40, 43, 46),
  mkTG('cls-7j','ts-j09',3,...PHY, 48, 50, 53),
  // ts-j10 Jane Muthoni
  mkTG('cls-7j','ts-j10',1,...BIO, 78, 80, 82),
  mkTG('cls-7j','ts-j10',2,...CHE, 72, 74, 76),
  mkTG('cls-7j','ts-j10',3,...PHY, 75, 77, 80),
  // ts-j11 Kevin Mwangi — failing (at risk)
  mkTG('cls-7j','ts-j11',1,...BIO, 30, 33, 35),
  mkTG('cls-7j','ts-j11',2,...CHE, 28, 30, 33),
  mkTG('cls-7j','ts-j11',3,...PHY, 35, 37, 40),
  // ts-j12 Linda Waweru — top student
  mkTG('cls-7j','ts-j12',1,...BIO, 92, 94, 96),
  mkTG('cls-7j','ts-j12',2,...CHE, 88, 90, 92),
  mkTG('cls-7j','ts-j12',3,...PHY, 85, 87, 90),
]

const rGrades: TeacherGrade[] = [
  mkTG('cls-7r','ts-r01',1,...BIO, 75, 78, 80),
  mkTG('cls-7r','ts-r01',2,...CHE, 70, 72, 75),
  mkTG('cls-7r','ts-r01',3,...PHY, 68, 70, 73),
  mkTG('cls-7r','ts-r02',1,...BIO, 88, 90, 92),
  mkTG('cls-7r','ts-r02',2,...CHE, 82, 84, 87),
  mkTG('cls-7r','ts-r02',3,...PHY, 80, 82, 85),
  mkTG('cls-7r','ts-r03',1,...BIO, 55, 58, 62),
  mkTG('cls-7r','ts-r03',2,...CHE, 50, 52, 56),
  mkTG('cls-7r','ts-r03',3,...PHY, 55, 58, 62),
  mkTG('cls-7r','ts-r04',1,...BIO, 82, 84, 87),
  mkTG('cls-7r','ts-r04',2,...CHE, 78, 80, 83),
  mkTG('cls-7r','ts-r04',3,...PHY, 75, 78, 80),
  mkTG('cls-7r','ts-r05',1,...BIO, 62, 65, 68),
  mkTG('cls-7r','ts-r05',2,...CHE, 60, 62, 65),
  mkTG('cls-7r','ts-r05',3,...PHY, 58, 60, 63),
  mkTG('cls-7r','ts-r06',1,...BIO, 90, 92, 94),
  mkTG('cls-7r','ts-r06',2,...CHE, 85, 88, 90),
  mkTG('cls-7r','ts-r06',3,...PHY, 87, 89, 92),
  mkTG('cls-7r','ts-r07',1,...BIO, 72, 74, 76),
  mkTG('cls-7r','ts-r07',2,...CHE, 68, 70, 73),
  mkTG('cls-7r','ts-r07',3,...PHY, 70, 72, 75),
  mkTG('cls-7r','ts-r08',1,...BIO, 80, 82, 85),
  mkTG('cls-7r','ts-r08',2,...CHE, 75, 77, 80),
  mkTG('cls-7r','ts-r08',3,...PHY, 72, 74, 77),
  mkTG('cls-7r','ts-r09',1,...BIO, 68, 70, 73),
  mkTG('cls-7r','ts-r09',2,...CHE, 65, 67, 70),
  mkTG('cls-7r','ts-r09',3,...PHY, 62, 64, 67),
  mkTG('cls-7r','ts-r10',1,...BIO, 52, 55, 58),
  mkTG('cls-7r','ts-r10',2,...CHE, 48, 50, 54),
  mkTG('cls-7r','ts-r10',3,...PHY, 50, 52, 55),
]

export const MOCK_TEACHER_GRADES: Record<string, TeacherGrade[]> = {
  'cls-7j': jGrades,
  'cls-7r': rGrades,
}

// ── Class attendance summary — Term 2 2026 ───────────────────────────────
// Shape expected by TeacherAttendance / TeacherClass:
// { studentId, todayStatus, totalPresent, totalDays }

type AttSummaryRow = {
  studentId: string
  todayStatus: 'present' | 'absent' | 'late' | 'excused' | null
  totalPresent: number
  totalDays: number
}

const TOTAL_TERM_DAYS = 38

function mkAtt(
  studentId: string,
  todayStatus: AttSummaryRow['todayStatus'],
  totalPresent: number,
): AttSummaryRow {
  return { studentId, todayStatus, totalPresent, totalDays: TOTAL_TERM_DAYS }
}

export const MOCK_TEACHER_ATTENDANCE: Record<string, AttSummaryRow[]> = {
  'cls-7j': [
    mkAtt('ts-j01', 'present', 36),
    mkAtt('ts-j02', 'present', 37),
    mkAtt('ts-j03', 'present', 35),
    mkAtt('ts-j04', 'present', 38),
    mkAtt('ts-j05', 'present', 36),
    mkAtt('ts-j06', 'present', 37),
    mkAtt('ts-j07', 'late',    34),
    mkAtt('ts-j08', 'present', 36),
    mkAtt('ts-j09', 'absent',  26),  // poor attendance — at risk
    mkAtt('ts-j10', 'present', 37),
    mkAtt('ts-j11', 'absent',  29),  // poor attendance — at risk
    mkAtt('ts-j12', 'present', 38),
  ],
  'cls-7r': [
    mkAtt('ts-r01', 'present', 36),
    mkAtt('ts-r02', 'present', 38),
    mkAtt('ts-r03', 'present', 34),
    mkAtt('ts-r04', 'present', 37),
    mkAtt('ts-r05', 'present', 35),
    mkAtt('ts-r06', 'present', 38),
    mkAtt('ts-r07', 'present', 36),
    mkAtt('ts-r08', 'present', 37),
    mkAtt('ts-r09', 'late',    35),
    mkAtt('ts-r10', 'late',    31),  // low attendance
  ],
}

// ── Teacher timetable (own schedule, grouped by day) ─────────────────────
// Shape: { id, classId, subjectId, subjectName, day, startTime, endTime, termId, className, room }

type TeacherSlot = {
  id: string; classId: string; subjectId: string; subjectName: string
  staffId: string; teacherName: string; day: string
  startTime: string; endTime: string; termId: string
  className: string; room: string
}

function tSlot(
  id: string, day: string,
  start: string, end: string,
  subId: string, subName: string,
  className: string, classId: string, room: string,
): TeacherSlot {
  return {
    id, classId, subjectId: subId, subjectName: subName,
    staffId: 'stf-001', teacherName: 'Mr. James Ochieng',
    day, startTime: start, endTime: end,
    termId: '2026-T2', className, room,
  }
}

export const MOCK_TEACHER_TIMETABLE: Record<string, TeacherSlot[]> = {
  Monday: [
    tSlot('tt-t-m1','Monday','07:30','08:30',...BIO,'Grade 7 Jasmine','cls-7j','Lab 1'),
    tSlot('tt-t-m2','Monday','10:00','11:00',...CHE,'Grade 7 Jasmine','cls-7j','Lab 1'),
  ],
  Tuesday: [
    tSlot('tt-t-t1','Tuesday','08:30','09:30',...PHY,'Grade 7 Jasmine','cls-7j','Lab 1'),
    tSlot('tt-t-t2','Tuesday','11:00','12:00',...BIO,'Grade 7 Rose',   'cls-7r','Lab 2'),
  ],
  Wednesday: [
    tSlot('tt-t-w1','Wednesday','07:30','08:30',...CHE,'Grade 7 Rose',   'cls-7r','Lab 2'),
    tSlot('tt-t-w2','Wednesday','10:00','11:00',...BIO,'Grade 7 Jasmine','cls-7j','Lab 1'),
  ],
  Thursday: [
    tSlot('tt-t-th1','Thursday','07:30','08:30',...PHY,'Grade 7 Rose',   'cls-7r','Lab 2'),
    tSlot('tt-t-th2','Thursday','11:00','12:00',...CHE,'Grade 7 Jasmine','cls-7j','Lab 1'),
  ],
  Friday: [
    tSlot('tt-t-f1','Friday','09:30','10:30',...BIO,'Grade 7 Rose',   'cls-7r','Lab 2'),
    tSlot('tt-t-f2','Friday','11:00','12:00',...PHY,'Grade 7 Jasmine','cls-7j','Lab 1'),
  ],
  Saturday: [],
  Sunday:   [],
}

// ── Teacher announcements (staff-facing) ──────────────────────────────────

export const MOCK_TEACHER_ANNOUNCEMENTS = [
  {
    id: 'ta-1',
    title: 'Grade Submission Deadline — Friday 20 June 2026',
    body: 'All teachers are reminded that Term 2 end-term examination scores must be entered into the school portal by 5:00 PM on Friday 20 June 2026. Scores submitted after this deadline will require the Head Teacher\'s written approval. Please contact the Examinations Office if you encounter any system issues.',
    priority: 'urgent' as const,
    publishAt: '2026-06-12',
    targetRoles: ['teacher'],
  },
  {
    id: 'ta-2',
    title: 'End-Term Exam Supervision Roster — 23–27 June 2026',
    body: 'The end-term examination supervision timetable has been released. Please check the noticeboard or the portal for your assigned venues and times. Invigilators must arrive 15 minutes before each session. Phones are to be left in the staffroom during invigilation.',
    priority: 'high' as const,
    publishAt: '2026-06-10',
    targetRoles: ['teacher'],
  },
  {
    id: 'ta-3',
    title: 'Staff Meeting — Thursday 19 June 2026, 4:00 PM',
    body: 'There will be a mandatory staff meeting on Thursday 19 June at 4:00 PM in the Main Staffroom. Agenda: (1) End-term exam logistics, (2) Term 3 timetable preview, (3) CBC progress review, (4) Sports Day volunteer sign-up, (5) AOB. All staff must attend. Apologies to the Deputy Head Teacher by noon.',
    priority: 'high' as const,
    publishAt: '2026-06-08',
    targetRoles: ['teacher'],
  },
  {
    id: 'ta-4',
    title: 'CPD Workshop — Digital Assessment in CBC Classrooms',
    body: 'A free Continuing Professional Development workshop on "Digital Assessment Tools for CBC Instruction" will be held on Saturday 5 July 2026 from 9 AM to 1 PM in the ICT Lab. Facilitated by KICD trainers. CPD certificates will be issued. Seats are limited — RSVP to the HOD Sciences by 25 June.',
    priority: 'normal' as const,
    publishAt: '2026-06-01',
    targetRoles: ['teacher'],
  },
]
