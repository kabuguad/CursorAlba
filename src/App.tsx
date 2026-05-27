import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import { Layout } from './components/layout/Layout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

import { Home } from './pages/Home'
import { About } from './pages/About'
import { Academics } from './pages/Academics'
import { Facilities } from './pages/Facilities'
import { CoCurricular } from './pages/CoCurricular'
import { Music } from './pages/Music'
import { DramaDance } from './pages/DramaDance'
import { Sports } from './pages/Sports'
import { Admissions } from './pages/Admissions'
import { Contact } from './pages/Contact'
import { Staff } from './pages/Staff'
import { Login } from './pages/Login'
import { Blog } from './pages/Blog'
import { BlogPost } from './pages/BlogPost'

import { StudentPortalLayout }  from './pages/dashboards/student/StudentPortalLayout'
import { StudentOverview }      from './pages/dashboards/student/StudentOverview'
import { StudentGrades }        from './pages/dashboards/student/StudentGrades'
import { StudentHomework }      from './pages/dashboards/student/StudentHomework'
import { StudentTimetable }     from './pages/dashboards/student/StudentTimetable'
import { StudentNotices }       from './pages/dashboards/student/StudentNotices'

import { TeacherPortalLayout }  from './pages/dashboards/teacher/TeacherPortalLayout'
import { TeacherGrades }        from './pages/dashboards/teacher/TeacherGrades'
import { TeacherAttendance }    from './pages/dashboards/teacher/TeacherAttendance'
import { TeacherAssignments }   from './pages/dashboards/teacher/TeacherAssignments'
import { TeacherClass }         from './pages/dashboards/teacher/TeacherClass'
import { TeacherTimetable }     from './pages/dashboards/teacher/TeacherTimetable'
import { TeacherMessages }      from './pages/dashboards/teacher/TeacherMessages'

import { ParentPortalLayout }   from './pages/dashboards/parent/ParentPortalLayout'
import { ParentGrades }         from './pages/dashboards/parent/ParentGrades'
import { ParentAttendance }     from './pages/dashboards/parent/ParentAttendance'
import { ParentFees }           from './pages/dashboards/parent/ParentFees'
import { ParentHomework }       from './pages/dashboards/parent/ParentHomework'
import { ParentTimetable }      from './pages/dashboards/parent/ParentTimetable'
import { ParentNotices }        from './pages/dashboards/parent/ParentNotices'

import { AdminLayout }          from './pages/dashboards/admin/AdminLayout'
import { Overview }             from './pages/dashboards/admin/Overview'
import { ContentManager }       from './pages/dashboards/admin/ContentManager'
import { BlogManager }          from './pages/dashboards/admin/BlogManager'
import { EventsManager }        from './pages/dashboards/admin/EventsManager'
import { GalleryManager }       from './pages/dashboards/admin/GalleryManager'
import { StudentsManager }      from './pages/dashboards/admin/StudentsManager'
import { StaffManager }         from './pages/dashboards/admin/StaffManager'
import { FeesManager }          from './pages/dashboards/admin/FeesManager'
import { AcademicsManager }     from './pages/dashboards/admin/AcademicsManager'
import { AnnouncementsManager } from './pages/dashboards/admin/AnnouncementsManager'
import { SettingsManager }      from './pages/dashboards/admin/SettingsManager'
import { AdmissionsManager }    from './pages/dashboards/admin/AdmissionsManager'
import { ReportsManager }       from './pages/dashboards/admin/ReportsManager'
import { TimetableManager }     from './pages/dashboards/admin/TimetableManager'
import { PaymentsManager }      from './pages/dashboards/admin/PaymentsManager'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>

              {/* ── Public site ── */}
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about"         element={<About />} />
                <Route path="academics"     element={<Academics />} />
                <Route path="programs"      element={<Navigate to="/academics" replace />} />
                <Route path="facilities"    element={<Facilities />} />
                <Route path="co-curricular" element={<CoCurricular />} />
                <Route path="music"         element={<Music />} />
                <Route path="drama-dance"   element={<DramaDance />} />
                <Route path="sports"        element={<Sports />} />
                <Route path="admissions"    element={<Admissions />} />
                <Route path="contact"       element={<Contact />} />
                <Route path="staff"         element={<Staff />} />
                <Route path="blog"          element={<Blog />} />
                <Route path="blog/:id"      element={<BlogPost />} />
                <Route path="login"         element={<Login />} />
              </Route>

              {/* ── Student Portal ── */}
              <Route
                path="dashboard/student"
                element={<ProtectedRoute role="student"><StudentPortalLayout /></ProtectedRoute>}
              >
                <Route index                  element={<StudentOverview />} />
                <Route path="grades"          element={<StudentGrades />} />
                <Route path="homework"        element={<StudentHomework />} />
                <Route path="timetable"       element={<StudentTimetable />} />
                <Route path="notices"         element={<StudentNotices />} />
              </Route>

              {/* ── Teacher Portal ── */}
              <Route
                path="dashboard/teacher"
                element={<ProtectedRoute role="teacher"><TeacherPortalLayout /></ProtectedRoute>}
              >
                <Route index                  element={<TeacherGrades />} />
                <Route path="attendance"      element={<TeacherAttendance />} />
                <Route path="assignments"     element={<TeacherAssignments />} />
                <Route path="myclass"         element={<TeacherClass />} />
                <Route path="timetable"       element={<TeacherTimetable />} />
                <Route path="messages"        element={<TeacherMessages />} />
              </Route>

              {/* ── Parent Portal ── */}
              <Route
                path="dashboard/parent"
                element={<ProtectedRoute role="parent"><ParentPortalLayout /></ProtectedRoute>}
              >
                <Route index                  element={<ParentGrades />} />
                <Route path="attendance"      element={<ParentAttendance />} />
                <Route path="fees"            element={<ParentFees />} />
                <Route path="homework"        element={<ParentHomework />} />
                <Route path="timetable"       element={<ParentTimetable />} />
                <Route path="notices"         element={<ParentNotices />} />
              </Route>

              {/* ── Admin Portal ── */}
              <Route
                path="dashboard/admin"
                element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}
              >
                <Route index                  element={<Overview />} />
                <Route path="content"         element={<ContentManager />} />
                <Route path="blog"            element={<BlogManager />} />
                <Route path="events"          element={<EventsManager />} />
                <Route path="gallery"         element={<GalleryManager />} />
                <Route path="admissions"      element={<AdmissionsManager />} />
                <Route path="students"        element={<StudentsManager />} />
                <Route path="staff"           element={<StaffManager />} />
                <Route path="academics"       element={<AcademicsManager />} />
                <Route path="timetable"       element={<TimetableManager />} />
                <Route path="payments"        element={<PaymentsManager />} />
                <Route path="fees"            element={<FeesManager />} />
                <Route path="announcements"   element={<AnnouncementsManager />} />
                <Route path="reports"         element={<ReportsManager />} />
                <Route path="settings"        element={<SettingsManager />} />
              </Route>

              <Route path="dashboard" element={<Navigate to="/login" replace />} />

            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
