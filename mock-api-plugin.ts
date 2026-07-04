/**
 * mock-api-plugin.ts
 *
 * Vite dev-server middleware that handles every /api/* request locally
 * when VITE_USE_MOCK=true.  No backend or ngrok tunnel required.
 *
 * Usage:
 *   Create .env.local → VITE_USE_MOCK=true
 *   The plugin is wired in vite.config.ts automatically.
 */

import type { Plugin, ViteDevServer } from 'vite'
import type { IncomingMessage, ServerResponse } from 'http'

// ── Response helpers ──────────────────────────────────────────────────────────

function ok(data: unknown) {
  return {
    success: true,
    data,
    error: null,
    statusCode: 200,
    timestamp: new Date().toISOString(),
    traceId: Math.random().toString(36).slice(2),
  }
}

function created(data: unknown) {
  return { ...ok(data), statusCode: 201 }
}

function notFound(msg = 'Not found') {
  return { success: false, data: null, error: msg, statusCode: 404 }
}

function json(res: ServerResponse, body: unknown, status = 200) {
  const payload = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
    'Access-Control-Allow-Origin': '*',
  })
  res.end(payload)
}

function readBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise(resolve => {
    let raw = ''
    req.on('data', chunk => { raw += chunk })
    req.on('end', () => {
      try { resolve(JSON.parse(raw || '{}')) } catch { resolve({}) }
    })
  })
}

// ── Seed data ─────────────────────────────────────────────────────────────────

const HOMEPAGE_CONTENT = {
  homePageContentId: 1,
  heroImage1Url: 'https://picsum.photos/seed/alber-campus/1400/900',
  heroImage2Url: 'https://picsum.photos/seed/alber-class/1400/900',
  heroImage3Url: 'https://picsum.photos/seed/alber-sports/1400/900',
  heroImage4Url: 'https://picsum.photos/seed/alber-arts/1400/900',
  heroTagline: 'Where Excellence',
  heroTaglineGold: 'Meets Tomorrow',
  heroLocationBadge: 'Kutus · Kirinyaga County · Est. Since 2005',
  heroSubtitle: "Kenya's premier learning institution — where every learner discovers their genius in world-class facilities guided by expert educators.",
  heroPrimaryCtaLabel: 'Apply Now',
  heroPrimaryCtaUrl: '/admissions',
  heroSecondaryCtaLabel: 'Explore Programs',
  heroSecondaryCtaUrl: '/academics',
  statStudentsEnrolled: 1240,
  statEducators: 87,
  statEstYear: 2005,
  statActivities: 34,
  foundationSectionLabel: 'Our Foundation',
  foundationHeading: 'Built on Excellence, Driven by Purpose',
  missionLabel: 'Mission',
  missionTitle: 'Empowering Every Learner',
  missionBody: 'To provide a world-class, holistic education that nurtures academic excellence, character development, and lifelong curiosity in every student.',
  mottoLabel: 'Motto',
  mottoTitle: 'Strive for the Best',
  mottoTagline: 'Excellence in all we do',
  mottoBody: "We believe every student carries untapped genius. Our role is to unlock it through dedicated teaching, rich resources, and an environment where effort meets opportunity.",
  visionLabel: 'Vision',
  visionTitle: 'A Future Without Limits',
  visionBody: 'To be the leading school in East Africa — known for producing confident, compassionate, and capable leaders who transform communities.',
  ctaBadgeText: 'Admissions Open',
  ctaHeading: 'Begin Your Journey at Alber School',
  ctaSubtext: 'Join a community of scholars, athletes, artists, and leaders. Applications for the next academic year are now open.',
  ctaPrimaryLabel: 'Apply Now',
  ctaPrimaryUrl: '/admissions',
  ctaSecondaryLabel: 'Book a Tour',
  ctaSecondaryUrl: '/contact',
}

const CORE_VALUES = [
  { coreValueId: 1, id: 1, icon: '🎓', title: 'Academic Excellence', description: 'We set the highest standards in teaching and learning across all disciplines.', sortOrder: 1 },
  { coreValueId: 2, id: 2, icon: '🤝', title: 'Integrity', description: 'We cultivate honesty, transparency, and ethical leadership in all our students.', sortOrder: 2 },
  { coreValueId: 3, id: 3, icon: '🌍', title: 'Global Citizenship', description: 'We prepare students to thrive and contribute in an interconnected world.', sortOrder: 3 },
  { coreValueId: 4, id: 4, icon: '💡', title: 'Innovation', description: 'We encourage creative thinking, curiosity, and problem-solving at every level.', sortOrder: 4 },
  { coreValueId: 5, id: 5, icon: '❤️', title: 'Compassion', description: 'We foster empathy, service, and care for others within our school and community.', sortOrder: 5 },
  { coreValueId: 6, id: 6, icon: '🏅', title: 'Resilience', description: 'We build grit, perseverance, and the confidence to overcome any challenge.', sortOrder: 6 },
]

const ALBER_DIFFERENCE = [
  { id: 1, icon: '🏫', title: 'World-Class Facilities', description: 'State-of-the-art labs, sports complex, music studios, and a 10,000-book library.' },
  { id: 2, icon: '👨‍🏫', title: 'Expert Educators', description: 'Our teachers hold advanced degrees and undergo continuous professional development.' },
  { id: 3, icon: '🏆', title: 'Proven Results', description: 'Consistent top performers in national exams and regional academic competitions.' },
  { id: 4, icon: '🌱', title: 'Holistic Development', description: 'Arts, sports, drama, and leadership programs alongside rigorous academics.' },
  { id: 5, icon: '🔬', title: 'STEM Focus', description: 'Dedicated STEM programs with robotics, coding, and science olympiad participation.' },
  { id: 6, icon: '🌐', title: 'Global Partnerships', description: 'Exchange programs and partnerships with schools across Africa and beyond.' },
]

const SCHOOL_LEVELS = [
  { id: 1, name: 'Playgroup', ageRange: '2–3 years', description: 'A nurturing introduction to structured learning through play.', enrollmentCount: 48, icon: '🧸' },
  { id: 2, name: 'PP1', ageRange: '4 years', description: 'Building foundational literacy and numeracy skills.', enrollmentCount: 72, icon: '🌈' },
  { id: 3, name: 'PP2', ageRange: '5 years', description: 'Preparing learners for primary school with confidence and curiosity.', enrollmentCount: 80, icon: '🎒' },
  { id: 4, name: 'Primary School', ageRange: 'Grades 1–6', description: 'A comprehensive CBC curriculum delivering academic and character excellence.', enrollmentCount: 420, icon: '📚' },
  { id: 5, name: 'Junior Secondary', ageRange: 'Grades 7–9', description: 'Deepening knowledge across sciences, arts, and humanities.', enrollmentCount: 310, icon: '🔬' },
  { id: 6, name: 'Senior Secondary', ageRange: 'Grades 10–12', description: 'Rigorous preparation for university and global careers.', enrollmentCount: 250, icon: '🎓' },
]

const GALLERY_CATEGORIES = [
  { galleryCategoryId: 1, id: 1, title: 'Campus Life', slug: 'campus-life', description: 'Day-to-day moments across our beautiful campus.', icon: '🏫', sortOrder: 1, isActive: true, imageCount: 12 },
  { galleryCategoryId: 2, id: 2, title: 'Sports', slug: 'sports', description: 'Athletics, tournaments, and team moments.', icon: '⚽', sortOrder: 2, isActive: true, imageCount: 8 },
  { galleryCategoryId: 3, id: 3, title: 'Arts & Culture', slug: 'arts', description: 'Music, drama, and visual arts performances.', icon: '🎨', sortOrder: 3, isActive: true, imageCount: 6 },
  { galleryCategoryId: 4, id: 4, title: 'Academics', slug: 'academics', description: 'Labs, classrooms, and learning in action.', icon: '📖', sortOrder: 4, isActive: true, imageCount: 10 },
  { galleryCategoryId: 5, id: 5, title: 'Events', slug: 'events', description: 'Prize-giving, open days, and special occasions.', icon: '🎉', sortOrder: 5, isActive: true, imageCount: 7 },
]

const GALLERY_IMAGES = Array.from({ length: 20 }, (_, i) => ({
  galleryImageId: i + 1,
  id: i + 1,
  url: `https://picsum.photos/seed/alber-gallery-${i + 1}/800/600`,
  caption: ['Students during morning assembly', 'Science lab experiment', 'Football final 2024', 'Music recital', 'Graduation ceremony', 'Drama night performance', 'Library reading club', 'Art exhibition', 'Swimming gala', 'Prize-giving day', 'CBC classroom session', 'Robotics club', 'School choir', 'Sports day', 'Junior secondary camp', 'STEM fair', 'Parent open day', 'Staff training day', 'Playgroup graduation', 'School garden project'][i],
  sortOrder: i + 1,
  isPublic: true,
  galleryCategoryId: (i % 5) + 1,
  categoryTitle: GALLERY_CATEGORIES[i % 5].title,
  categoryIcon: GALLERY_CATEGORIES[i % 5].icon,
}))

const DEPARTMENTS = [
  { departmentId: 1, id: 1, name: 'Sciences', description: 'Biology, Chemistry, Physics, and Computer Science.', icon: '🔬', sortOrder: 1, isActive: true, teacherCount: 12 },
  { departmentId: 2, id: 2, name: 'Mathematics', description: 'Pure and applied mathematics across all levels.', icon: '📐', sortOrder: 2, isActive: true, teacherCount: 8 },
  { departmentId: 3, id: 3, name: 'Languages', description: 'English, Kiswahili, French, and Arabic.', icon: '📝', sortOrder: 3, isActive: true, teacherCount: 10 },
  { departmentId: 4, id: 4, name: 'Humanities', description: 'History, Geography, CRE, and Social Studies.', icon: '🌍', sortOrder: 4, isActive: true, teacherCount: 9 },
  { departmentId: 5, id: 5, name: 'Arts & Music', description: 'Visual Arts, Music, and Drama.', icon: '🎨', sortOrder: 5, isActive: true, teacherCount: 7 },
  { departmentId: 6, id: 6, name: 'Physical Education', description: 'Sports, fitness, and wellbeing programmes.', icon: '⚽', sortOrder: 6, isActive: true, teacherCount: 6 },
  { departmentId: 7, id: 7, name: 'Early Childhood', description: 'Playgroup, PP1, and PP2 specialist educators.', icon: '🧸', sortOrder: 7, isActive: true, teacherCount: 14 },
]

const TEACHERS = Array.from({ length: 15 }, (_, i) => {
  const dept = DEPARTMENTS[i % DEPARTMENTS.length]
  const first = ['Alice', 'James', 'Grace', 'Peter', 'Mary', 'Samuel', 'Faith', 'David', 'Esther', 'John', 'Lilian', 'Brian', 'Mercy', 'Joseph', 'Winnie'][i]
  const last = ['Mwangi', 'Kamau', 'Njeri', 'Otieno', 'Wangari', 'Kariuki', 'Muriuki', 'Omondi', 'Ndungu', 'Gitau', 'Achieng', 'Mutua', 'Kimani', 'Odhiambo', 'Wanjiku'][i]
  return {
    teacherId: i + 1,
    id: i + 1,
    userId: i + 100,
    firstName: first,
    lastName: last,
    fullName: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@alberschool.ke`,
    title: ['Mr.', 'Mrs.', 'Dr.', 'Ms.'][i % 4],
    credentials: ['B.Ed', 'M.Ed', 'PhD', 'B.Sc Ed', 'M.Sc Ed'][i % 5],
    qualifications: `${['B.Ed (Science)', 'M.Ed (Curriculum)', 'PhD (Education)', 'B.Sc Ed (Maths)', 'M.Sc Ed (Chemistry)'][i % 5]}, ${5 + i * 2} yrs experience`,
    profilePhoto: `https://picsum.photos/seed/teacher-${i + 1}/200/200`,
    academicPortfolio: null,
    hireDate: `${2010 + (i % 12)}-0${(i % 9) + 1}-15`,
    departmentId: dept.id,
    departmentName: dept.name,
  }
})

const ABOUT_PAGE_CONTENT = [{
  aboutPageContentId: 1,
  id: 1,
  headline: 'About Alber School',
  subheadline: 'A legacy of excellence in Kirinyaga County since 2005.',
  mission: 'To provide a world-class, holistic education that nurtures academic excellence, character development, and lifelong curiosity in every student.',
  vision: 'To be the leading school in East Africa — known for producing confident, compassionate, and capable leaders who transform communities.',
  historyIntro: 'Founded in 2005 by a team of passionate educators, Alber School has grown from a small primary school into a full continuum institution serving over 1,200 learners from Playgroup through Senior Secondary.',
  updatedAt: '2024-01-15T08:00:00Z',
}]

const HISTORY_MILESTONES = [
  { historyMilestoneId: 1, id: 1, year: '2005', title: 'Founded', description: 'Alber School opens its doors with 3 classrooms and 45 students.', sortOrder: 1 },
  { historyMilestoneId: 2, id: 2, year: '2008', title: 'Primary School Expansion', description: 'Grades 1–8 fully operational. First KCPE class achieves a mean score of 380.', sortOrder: 2 },
  { historyMilestoneId: 3, id: 3, year: '2012', title: 'Sports Complex Opened', description: 'Multi-sport facility inaugurated, home to our national-award-winning athletics teams.', sortOrder: 3 },
  { historyMilestoneId: 4, id: 4, year: '2016', title: 'Science & Technology Block', description: 'Three fully equipped labs and the first computer lab in the district.', sortOrder: 4 },
  { historyMilestoneId: 5, id: 5, year: '2020', title: 'CBC Transition', description: 'Successfully adopted the Competency-Based Curriculum ahead of the national rollout.', sortOrder: 5 },
  { historyMilestoneId: 6, id: 6, year: '2023', title: 'Senior Secondary Launch', description: 'Grades 10–12 inaugurated, completing the full Playgroup–Grade 12 continuum.', sortOrder: 6 },
]

// Admin mock data
const ADMIN_KPI = {
  totalStudents: 1240,
  totalStaff: 87,
  pendingAdmissions: 34,
  feeCollectionRate: 91.4,
  attendanceRate: 96.2,
  activeClasses: 42,
}

function makeAdminAnalytics() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return {
    enrollmentTrend: months.map((m, i) => ({ month: m, students: 1100 + i * 12 })),
    attendanceTrend: months.map((m, i) => ({ month: m, rate: 94 + Math.sin(i) * 2 })),
    feeCollectionByLevel: SCHOOL_LEVELS.map(l => ({ level: l.name, collected: Math.floor(Math.random() * 500000 + 200000), target: 600000 })),
    admissionsFunnel: [
      { stage: 'Inquiries', count: 180 },
      { stage: 'Applications', count: 120 },
      { stage: 'Interviews', count: 90 },
      { stage: 'Offers', count: 65 },
      { stage: 'Enrolled', count: 58 },
    ],
    academicPerformance: SCHOOL_LEVELS.map(l => ({ level: l.name, average: 70 + Math.floor(Math.random() * 20) })),
    staffByDept: DEPARTMENTS.map(d => ({ department: d.name, count: d.teacherCount })),
    paymentMethods: [
      { method: 'M-Pesa', percentage: 68 },
      { method: 'Bank Transfer', percentage: 22 },
      { method: 'Cash', percentage: 10 },
    ],
    recentActivity: [
      { id: 1, action: 'Admission approved', details: 'Grade 7 — Amina Ochieng', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: 2, action: 'Fee payment received', details: 'KES 45,000 — John Gitau', timestamp: new Date(Date.now() - 7200000).toISOString() },
      { id: 3, action: 'New teacher onboarded', details: 'Ms. Lilian Achieng — Sciences', timestamp: new Date(Date.now() - 86400000).toISOString() },
      { id: 4, action: 'Exam results uploaded', details: 'Grade 9 Mid-Term 2025', timestamp: new Date(Date.now() - 172800000).toISOString() },
    ],
  }
}

const ADMISSIONS_APPLICATIONS = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  applicationNumber: `ALB-2025-${String(i + 100).padStart(4, '0')}`,
  childFullName: ['Amina Ochieng', 'Brian Mwangi', 'Grace Njeri', 'Daniel Kamau', 'Fatuma Ali', 'Kevin Otieno', 'Lydia Wangari', 'Moses Kariuki'][i],
  parentName: ['Sarah Ochieng', 'James Mwangi', 'Alice Njeri', 'Peter Kamau', 'Zainab Ali', 'Paul Otieno', 'Anne Wangari', 'Samuel Kariuki'][i],
  email: `parent${i + 1}@gmail.com`,
  phone: `+254 7${String(10 + i).padStart(2, '0')} ${100000 + i * 12345}`,
  applyingForLevel: SCHOOL_LEVELS[i % SCHOOL_LEVELS.length].name,
  applyingForGrade: `Grade ${i + 1}`,
  status: ['Pending', 'Under Review', 'Interview Scheduled', 'Approved', 'Waitlisted', 'Pending', 'Under Review', 'Approved'][i],
  submittedAt: new Date(Date.now() - i * 86400000 * 3).toISOString(),
  documentCount: 2 + (i % 3),
}))

// ── In-memory mutable stores (survive page reload via dev server process) ─────

let homepageContent = { ...HOMEPAGE_CONTENT }
let coreValues = [...CORE_VALUES]
let alberDifference = [...ALBER_DIFFERENCE]
let galleryCategories = [...GALLERY_CATEGORIES]
let galleryImages = [...GALLERY_IMAGES]
let departments = [...DEPARTMENTS]
let teachers = [...TEACHERS]
let aboutContent = [...ABOUT_PAGE_CONTENT]
let historyMilestones = [...HISTORY_MILESTONES]
let admissionsApplications = [...ADMISSIONS_APPLICATIONS]

// ── Route matcher ─────────────────────────────────────────────────────────────

function matchPath(pattern: string, actual: string): Record<string, string> | null {
  const patParts = pattern.split('/')
  const actParts = actual.split('/')
  if (patParts.length !== actParts.length) return null
  const params: Record<string, string> = {}
  for (let i = 0; i < patParts.length; i++) {
    if (patParts[i].startsWith(':')) {
      params[patParts[i].slice(1)] = actParts[i]
    } else if (patParts[i] !== actParts[i]) {
      return null
    }
  }
  return params
}

// ── Request handler ───────────────────────────────────────────────────────────

async function handleRequest(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const rawUrl = req.url ?? ''
  // Strip /api prefix and query string
  const [pathWithSlash] = rawUrl.replace(/^\/api/, '').split('?')
  const path = pathWithSlash.replace(/\/$/, '') || '/'
  const method = (req.method ?? 'GET').toUpperCase()

  // Helper to match and extract params
  const match = (pattern: string) => matchPath(pattern, path)
  let params: Record<string, string> | null

  // ── Public routes ────────────────────────────────────────────────────────────

  // Homepage content
  if (method === 'GET' && path === '/homepage-content') {
    return json(res, ok([homepageContent])), true
  }
  if (method === 'GET' && (params = match('/homepage-content/:id'))) {
    return json(res, ok(homepageContent)), true
  }
  if ((method === 'PUT' || method === 'PATCH') && (params = match('/homepage-content/:id'))) {
    const body = await readBody(req)
    homepageContent = { ...homepageContent, ...(body as object) } as typeof homepageContent
    return json(res, ok(homepageContent)), true
  }

  // Core values
  if (method === 'GET' && path === '/core-values') {
    return json(res, ok(coreValues)), true
  }
  if (method === 'POST' && path === '/core-values') {
    const body = await readBody(req) as any
    const id = coreValues.length + 1
    const item = { coreValueId: id, id, ...body }
    coreValues.push(item)
    return json(res, created(item), 201), true
  }
  if ((method === 'PUT' || method === 'PATCH') && (params = match('/core-values/:id'))) {
    const body = await readBody(req) as any
    const idx = coreValues.findIndex(v => v.id === Number(params!.id))
    if (idx === -1) return json(res, notFound(), 404), true
    coreValues[idx] = { ...coreValues[idx], ...body }
    return json(res, ok(coreValues[idx])), true
  }
  if (method === 'DELETE' && (params = match('/core-values/:id'))) {
    coreValues = coreValues.filter(v => v.id !== Number(params!.id))
    return json(res, ok({ deleted: true })), true
  }

  // Alber difference
  if (method === 'GET' && path === '/alber-difference') {
    return json(res, ok(alberDifference)), true
  }
  if (method === 'POST' && path === '/alber-difference') {
    const body = await readBody(req) as any
    const id = alberDifference.length + 1
    const item = { id, ...body }
    alberDifference.push(item)
    return json(res, created(item), 201), true
  }
  if ((method === 'PUT' || method === 'PATCH') && (params = match('/alber-difference/:id'))) {
    const body = await readBody(req) as any
    const idx = alberDifference.findIndex(v => v.id === Number(params!.id))
    if (idx === -1) return json(res, notFound(), 404), true
    alberDifference[idx] = { ...alberDifference[idx], ...body }
    return json(res, ok(alberDifference[idx])), true
  }
  if (method === 'DELETE' && (params = match('/alber-difference/:id'))) {
    alberDifference = alberDifference.filter(v => v.id !== Number(params!.id))
    return json(res, ok({ deleted: true })), true
  }

  // Academics
  if (method === 'GET' && path === '/academics-page-content/school-levels') {
    return json(res, ok(SCHOOL_LEVELS)), true
  }

  // Gallery categories
  if (method === 'GET' && path === '/gallery/categories') {
    return json(res, ok(galleryCategories)), true
  }
  if (method === 'POST' && path === '/gallery/categories') {
    const body = await readBody(req) as any
    const id = galleryCategories.length + 1
    const item = { galleryCategoryId: id, id, ...body, imageCount: 0 }
    galleryCategories.push(item)
    return json(res, created(item), 201), true
  }
  if ((method === 'PUT' || method === 'PATCH') && (params = match('/gallery/categories/:id'))) {
    const body = await readBody(req) as any
    const idx = galleryCategories.findIndex(v => v.id === Number(params!.id))
    if (idx === -1) return json(res, notFound(), 404), true
    galleryCategories[idx] = { ...galleryCategories[idx], ...body }
    return json(res, ok(galleryCategories[idx])), true
  }
  if (method === 'DELETE' && (params = match('/gallery/categories/:id'))) {
    galleryCategories = galleryCategories.filter(v => v.id !== Number(params!.id))
    return json(res, ok({ deleted: true })), true
  }

  // Gallery images
  if (method === 'GET' && path === '/gallery') {
    return json(res, ok(galleryImages)), true
  }
  if (method === 'POST' && path === '/gallery') {
    const body = await readBody(req) as any
    const id = galleryImages.length + 1
    const cat = galleryCategories.find(c => c.id === body.galleryCategoryId)
    const item = { galleryImageId: id, id, ...body, categoryTitle: cat?.title, categoryIcon: cat?.icon }
    galleryImages.push(item)
    return json(res, created(item), 201), true
  }
  if (method === 'POST' && path === '/gallery/bulk') {
    const body = await readBody(req) as any
    const items = (Array.isArray(body) ? body : body.images ?? []).map((b: any, i: number) => {
      const id = galleryImages.length + i + 1
      const cat = galleryCategories.find(c => c.id === b.galleryCategoryId)
      return { galleryImageId: id, id, ...b, categoryTitle: cat?.title, categoryIcon: cat?.icon }
    })
    galleryImages.push(...items)
    return json(res, created(items), 201), true
  }
  if ((method === 'PUT' || method === 'PATCH') && (params = match('/gallery/:id'))) {
    const body = await readBody(req) as any
    const idx = galleryImages.findIndex(v => v.id === Number(params!.id))
    if (idx === -1) return json(res, notFound(), 404), true
    galleryImages[idx] = { ...galleryImages[idx], ...body }
    return json(res, ok(galleryImages[idx])), true
  }
  if (method === 'DELETE' && (params = match('/gallery/:id'))) {
    galleryImages = galleryImages.filter(v => v.id !== Number(params!.id))
    return json(res, ok({ deleted: true })), true
  }

  // Teachers
  if (method === 'GET' && path === '/teachers') {
    return json(res, ok(teachers)), true
  }
  if ((params = match('/teachers/:id'))) {
    if (method === 'GET') {
      const t = teachers.find(v => v.id === Number(params!.id))
      return json(res, t ? ok(t) : notFound(), t ? 200 : 404), true
    }
    if (method === 'PUT' || method === 'PATCH') {
      const body = await readBody(req) as any
      const idx = teachers.findIndex(v => v.id === Number(params!.id))
      if (idx === -1) return json(res, notFound(), 404), true
      teachers[idx] = { ...teachers[idx], ...body }
      return json(res, ok(teachers[idx])), true
    }
    if (method === 'DELETE') {
      teachers = teachers.filter(v => v.id !== Number(params!.id))
      return json(res, ok({ deleted: true })), true
    }
  }
  if (method === 'POST' && path === '/teachers') {
    const body = await readBody(req) as any
    const id = teachers.length + 1
    const dept = departments.find(d => d.id === body.departmentId)
    const item = { teacherId: id, id, userId: id + 100, fullName: `${body.firstName} ${body.lastName}`, departmentName: dept?.name ?? '', ...body }
    teachers.push(item as any)
    return json(res, created(item), 201), true
  }

  // Departments
  if (method === 'GET' && path === '/departments') {
    return json(res, ok(departments)), true
  }
  if (method === 'POST' && path === '/departments') {
    const body = await readBody(req) as any
    const id = departments.length + 1
    const item = { departmentId: id, id, teacherCount: 0, ...body }
    departments.push(item as any)
    return json(res, created(item), 201), true
  }
  if ((params = match('/departments/:id'))) {
    if (method === 'GET') {
      const d = departments.find(v => v.id === Number(params!.id))
      return json(res, d ? ok(d) : notFound(), d ? 200 : 404), true
    }
    if (method === 'PUT' || method === 'PATCH') {
      const body = await readBody(req) as any
      const idx = departments.findIndex(v => v.id === Number(params!.id))
      if (idx === -1) return json(res, notFound(), 404), true
      departments[idx] = { ...departments[idx], ...body }
      return json(res, ok(departments[idx])), true
    }
    if (method === 'DELETE') {
      departments = departments.filter(v => v.id !== Number(params!.id))
      return json(res, ok({ deleted: true })), true
    }
  }

  // About page content
  if (method === 'GET' && path === '/about-page-content') {
    return json(res, ok(aboutContent)), true
  }
  if ((method === 'PUT' || method === 'PATCH') && (params = match('/about-page-content/:id'))) {
    const body = await readBody(req) as any
    const idx = aboutContent.findIndex(v => v.id === Number(params!.id))
    if (idx !== -1) aboutContent[idx] = { ...aboutContent[idx], ...body }
    return json(res, ok(aboutContent[idx ?? 0])), true
  }

  // History milestones
  if (method === 'GET' && path === '/history-milestones') {
    return json(res, ok(historyMilestones)), true
  }
  if (method === 'POST' && path === '/history-milestones') {
    const body = await readBody(req) as any
    const id = historyMilestones.length + 1
    const item = { historyMilestoneId: id, id, ...body }
    historyMilestones.push(item)
    return json(res, created(item), 201), true
  }
  if ((params = match('/history-milestones/:id'))) {
    if (method === 'PUT' || method === 'PATCH') {
      const body = await readBody(req) as any
      const idx = historyMilestones.findIndex(v => v.id === Number(params!.id))
      if (idx === -1) return json(res, notFound(), 404), true
      historyMilestones[idx] = { ...historyMilestones[idx], ...body }
      return json(res, ok(historyMilestones[idx])), true
    }
    if (method === 'DELETE') {
      historyMilestones = historyMilestones.filter(v => v.id !== Number(params!.id))
      return json(res, ok({ deleted: true })), true
    }
  }

  // Admissions
  if (method === 'GET' && path === '/admissions/applications') {
    return json(res, ok(admissionsApplications)), true
  }
  if (method === 'POST' && path === '/admissions/applications') {
    const body = await readBody(req) as any
    const id = admissionsApplications.length + 1
    const item = { id, applicationNumber: `ALB-2025-${String(id + 99).padStart(4, '0')}`, status: 'Pending', submittedAt: new Date().toISOString(), documentCount: 0, ...body }
    admissionsApplications.push(item as any)
    return json(res, created(item), 201), true
  }
  if ((params = match('/admissions/applications/:id'))) {
    if (method === 'GET') {
      const a = admissionsApplications.find(v => v.id === Number(params!.id))
      return json(res, a ? ok(a) : notFound(), a ? 200 : 404), true
    }
    if (method === 'PUT' || method === 'PATCH') {
      const body = await readBody(req) as any
      const idx = admissionsApplications.findIndex(v => v.id === Number(params!.id))
      if (idx === -1) return json(res, notFound(), 404), true
      admissionsApplications[idx] = { ...admissionsApplications[idx], ...body }
      return json(res, ok(admissionsApplications[idx])), true
    }
  }

  // ── Admin routes (analytics, staff, fees, etc.) ───────────────────────────

  const analytics = makeAdminAnalytics()

  if (method === 'GET' && path === '/admin/analytics/kpis') return json(res, ok(ADMIN_KPI)), true
  if (method === 'GET' && path === '/admin/analytics/enrollment-trend') return json(res, ok(analytics.enrollmentTrend)), true
  if (method === 'GET' && path === '/admin/analytics/attendance-trend') return json(res, ok(analytics.attendanceTrend)), true
  if (method === 'GET' && path === '/admin/analytics/fee-collection-by-level') return json(res, ok(analytics.feeCollectionByLevel)), true
  if (method === 'GET' && path === '/admin/analytics/admissions-funnel') return json(res, ok(analytics.admissionsFunnel)), true
  if (method === 'GET' && path === '/admin/analytics/academic-performance') return json(res, ok(analytics.academicPerformance)), true
  if (method === 'GET' && path === '/admin/analytics/staff-by-dept') return json(res, ok(analytics.staffByDept)), true
  if (method === 'GET' && path === '/admin/analytics/payment-methods') return json(res, ok(analytics.paymentMethods)), true
  if (method === 'GET' && path === '/admin/analytics/recent-activity') return json(res, ok(analytics.recentActivity)), true

  if (method === 'GET' && path === '/admin/students') return json(res, ok([])), true
  if (method === 'POST' && path === '/admin/students') { await readBody(req); return json(res, created({}), 201), true }

  if (method === 'GET' && path === '/admin/staff') return json(res, ok(teachers)), true
  if (method === 'POST' && path === '/admin/staff') { await readBody(req); return json(res, created({}), 201), true }
  if (method === 'GET' && path === '/admin/staff/stats') return json(res, ok({ total: 87, byDept: analytics.staffByDept })), true
  if (method === 'GET' && path === '/admin/staff/leave') return json(res, ok([])), true

  if (method === 'GET' && path === '/admin/fees') return json(res, ok([])), true
  if (method === 'POST' && path === '/admin/fees') { await readBody(req); return json(res, created({}), 201), true }
  if (method === 'GET' && path === '/admin/fees/summary') return json(res, ok({ totalBilled: 18500000, totalCollected: 16891000, outstanding: 1609000, collectionRate: 91.3 })), true
  if (method === 'GET' && path === '/admin/fees/invoices') return json(res, ok([])), true
  if (method === 'POST' && path === '/admin/fees/invoices/generate') { await readBody(req); return json(res, created({}), 201), true }

  if (method === 'GET' && path === '/admin/payments') return json(res, ok([])), true
  if (method === 'POST' && path === '/admin/payments') { await readBody(req); return json(res, created({}), 201), true }
  if (method === 'GET' && path === '/admin/payments/summary') return json(res, ok({ today: 245000, thisMonth: 3450000, thisYear: 16891000 })), true

  if (method === 'GET' && path === '/admin/expenses') return json(res, ok([])), true
  if (method === 'POST' && path === '/admin/expenses') { await readBody(req); return json(res, created({}), 201), true }

  if (method === 'GET' && path === '/admin/classes') return json(res, ok([])), true
  if (method === 'POST' && path === '/admin/classes') { await readBody(req); return json(res, created({}), 201), true }

  if (method === 'GET' && path === '/admin/subjects') return json(res, ok([])), true
  if (method === 'POST' && path === '/admin/subjects') { await readBody(req); return json(res, created({}), 201), true }

  if (method === 'GET' && path === '/admin/exams') return json(res, ok([])), true
  if (method === 'POST' && path === '/admin/exams') { await readBody(req); return json(res, created({}), 201), true }

  if (method === 'GET' && path === '/admin/assessment-schemes') return json(res, ok([])), true
  if (method === 'POST' && path === '/admin/assessment-schemes') { await readBody(req); return json(res, created({}), 201), true }

  if (method === 'GET' && path === '/admin/announcements') return json(res, ok([])), true
  if (method === 'POST' && path === '/admin/announcements') { await readBody(req); return json(res, created({}), 201), true }

  if (method === 'GET' && path === '/admin/messages/inbox') return json(res, ok([])), true
  if (method === 'POST' && path === '/admin/messages') { await readBody(req); return json(res, created({}), 201), true }

  if (method === 'GET' && path === '/admin/scholarships') return json(res, ok([])), true
  if (method === 'POST' && path === '/admin/scholarships') { await readBody(req); return json(res, created({}), 201), true }

  if (method === 'GET' && path === '/admin/meeting-slots') return json(res, ok([])), true
  if (method === 'POST' && path === '/admin/meeting-slots') { await readBody(req); return json(res, created({}), 201), true }

  if (method === 'GET' && path === '/admin/academic-years') return json(res, ok([])), true
  if (method === 'POST' && path === '/admin/academic-years') { await readBody(req); return json(res, created({}), 201), true }
  if (method === 'GET' && path === '/admin/academic-years/current') return json(res, ok({ id: 1, name: '2025', startDate: '2025-01-06', endDate: '2025-11-28', isCurrent: true })), true
  if ((method === 'PUT' || method === 'PATCH') && path === '/admin/academic-years/current') { await readBody(req); return json(res, ok({})), true }

  if (method === 'GET' && path === '/admin/users') return json(res, ok([])), true
  if (method === 'POST' && path === '/admin/users') { await readBody(req); return json(res, created({}), 201), true }
  if (method === 'GET' && path === '/admin/users/stats') return json(res, ok({ total: 134, admins: 3, teachers: 87, parents: 44 })), true

  if (method === 'GET' && path === '/admin/transport/routes') return json(res, ok([])), true
  if (method === 'POST' && path === '/admin/transport/routes') { await readBody(req); return json(res, created({}), 201), true }
  if (method === 'GET' && path === '/admin/transport/vehicles') return json(res, ok([])), true
  if (method === 'POST' && path === '/admin/transport/vehicles') { await readBody(req); return json(res, created({}), 201), true }
  if (method === 'GET' && path === '/admin/transport/stats') return json(res, ok({ routes: 8, vehicles: 6, studentsTransported: 312 })), true

  if (method === 'GET' && path === '/admin/system/health') return json(res, ok({ status: 'healthy', uptime: '14d 3h', version: '1.0.0 (mock)', database: 'ok' })), true
  if (method === 'GET' && path === '/admin/system/settings') return json(res, ok({ schoolName: 'Alber School', timezone: 'Africa/Nairobi', currency: 'KES', academicYear: '2025' })), true
  if (method === 'PUT' && path === '/admin/system/settings') { await readBody(req); return json(res, ok({})), true }
  if (method === 'POST' && path === '/admin/system/backup') return json(res, created({ backupId: 'backup-mock-001', status: 'queued' }), 201), true
  if (method === 'POST' && path === '/admin/system/maintenance') { await readBody(req); return json(res, ok({})), true }
  if (method === 'POST' && path === '/admin/timetable') { await readBody(req); return json(res, created({}), 201), true }

  // Auth
  if (method === 'POST' && path === '/auth/login') {
    await readBody(req)
    return json(res, ok({ token: 'mock-jwt-token', user: { id: 1, role: 'Admin', name: 'Mock Admin' } })), true
  }

  // Not matched — return 404 but still intercept
  json(res, notFound(`Mock: no handler for ${method} /api${path}`), 404)
  return true
}

// ── Vite plugin ───────────────────────────────────────────────────────────────

export function mockApiPlugin(): Plugin {
  return {
    name: 'vite-mock-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        // Only intercept exact /api or /api/* — avoid matching /apiary etc.
        const url = req.url ?? ''
        if (url !== '/api' && !url.startsWith('/api/') && !url.startsWith('/api?')) return next()
        // OPTIONS preflight
        if (req.method === 'OPTIONS') {
          res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': '*', 'Access-Control-Allow-Headers': '*' })
          return res.end()
        }
        handleRequest(req, res).catch(err => {
          console.error('[mock-api]', err)
          json(res, { success: false, data: null, error: String(err), statusCode: 500 }, 500)
        })
      })

      server.httpServer?.once('listening', () => {
        console.log('\n  \x1b[32m✓\x1b[0m  Mock API active — all /api/* requests served locally (VITE_USE_MOCK=true)\n')
      })
    },
  }
}
