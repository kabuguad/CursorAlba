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
