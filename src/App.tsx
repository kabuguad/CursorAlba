import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import { PillarsProvider } from './contexts/PillarsContext'
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
import { WhyChooseUs } from './pages/WhyChooseUs'
import { Gallery } from './pages/Gallery'

import { TeacherPortalLayout }  from './pages/dashboards/teacher/TeacherPortalLayout'
import { TeacherOverview }      from './pages/dashboards/teacher/TeacherOverview'
import { TeacherGrades }        from './pages/dashboards/teacher/TeacherGrades'
import { TeacherGradebook }     from './pages/dashboards/teacher/TeacherGradebook'
import { TeacherAttendance }    from './pages/dashboards/teacher/TeacherAttendance'
import { TeacherAssignments }   from './pages/dashboards/teacher/TeacherAssignments'
import { TeacherClass }         from './pages/dashboards/teacher/TeacherClass'
import { TeacherTimetable }     from './pages/dashboards/teacher/TeacherTimetable'
import { TeacherMessages }      from './pages/dashboards/teacher/TeacherMessages'
import { TeacherReports }       from './pages/dashboards/teacher/TeacherReports'
import { TeacherLessonPlans }   from './pages/dashboards/teacher/TeacherLessonPlans'
import { TeacherLeaveRequest }  from './pages/dashboards/teacher/TeacherLeaveRequest'
import { TeacherNotices }       from './pages/dashboards/teacher/TeacherNotices'
import { TeacherSettings }      from './pages/dashboards/teacher/TeacherSettings'

import { ParentPortalLayout }   from './pages/dashboards/parent/ParentPortalLayout'
import { ParentOverview }       from './pages/dashboards/parent/ParentOverview'
import { ParentGrades }         from './pages/dashboards/parent/ParentGrades'
import { ParentAttendance }     from './pages/dashboards/parent/ParentAttendance'
import { ParentFees }           from './pages/dashboards/parent/ParentFees'
import { ParentHomework }       from './pages/dashboards/parent/ParentHomework'
import { ParentTimetable }      from './pages/dashboards/parent/ParentTimetable'
import { ParentNotices }        from './pages/dashboards/parent/ParentNotices'
import { ParentMessages }       from './pages/dashboards/parent/ParentMessages'
import { ParentReportCards }    from './pages/dashboards/parent/ParentReportCards'
import { ParentCalendar }       from './pages/dashboards/parent/ParentCalendar'
import { ParentCoCurricular }   from './pages/dashboards/parent/ParentCoCurricular'
import { ParentLeaveRequest }   from './pages/dashboards/parent/ParentLeaveRequest'
import { ParentMeetings }       from './pages/dashboards/parent/ParentMeetings'
import { ParentTransport }      from './pages/dashboards/parent/ParentTransport'
import { ParentSettings }       from './pages/dashboards/parent/ParentSettings'

import { AdminLayout }          from './pages/dashboards/admin/AdminLayout'
import { Overview }             from './pages/dashboards/admin/Overview'
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
import { AccountsManager }      from './pages/dashboards/admin/AccountsManager'
import { SiteContentManager }    from './pages/dashboards/admin/SiteContentManager'
import { ActivitiesManager }     from './pages/dashboards/admin/ActivitiesManager'
import { CoCurrPageBuilder }         from './pages/dashboards/admin/CoCurrPageBuilder'
import { FacilitiesPageBuilder }    from './pages/dashboards/admin/FacilitiesPageBuilder'
import { HomePageContentManager }      from './pages/dashboards/admin/HomePageContentManager'
import { ContactPageContentManager }   from './pages/dashboards/admin/ContactPageContentManager'
import { ParentsManager }      from './pages/dashboards/admin/ParentsManager'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <PillarsProvider>
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
                <Route path="why-choose-us" element={<WhyChooseUs />} />
                <Route path="gallery"       element={<Gallery />} />
                <Route path="login"         element={<Login />} />
              </Route>

              {/* ── Teacher Portal ── */}
              <Route
                path="dashboard/teacher"
                element={<ProtectedRoute role="teacher"><TeacherPortalLayout /></ProtectedRoute>}
              >
                <Route index                   element={<TeacherOverview />} />
                <Route path="gradebook"        element={<TeacherGradebook />} />
                <Route path="grades"           element={<TeacherGrades />} />
                <Route path="attendance"       element={<TeacherAttendance />} />
                <Route path="assignments"      element={<TeacherAssignments />} />
                <Route path="myclass"          element={<TeacherClass />} />
                <Route path="timetable"        element={<TeacherTimetable />} />
                <Route path="messages"         element={<TeacherMessages />} />
                <Route path="reports"          element={<TeacherReports />} />
                <Route path="lesson-plans"     element={<TeacherLessonPlans />} />
                <Route path="leave"            element={<TeacherLeaveRequest />} />
                <Route path="notices"          element={<TeacherNotices />} />
                <Route path="settings"         element={<TeacherSettings />} />
              </Route>

              {/* ── Parent Portal ── */}
              <Route
                path="dashboard/parent"
                element={<ProtectedRoute role="parent"><ParentPortalLayout /></ProtectedRoute>}
              >
                <Route index                   element={<ParentOverview />} />
                <Route path="grades"           element={<ParentGrades />} />
                <Route path="attendance"       element={<ParentAttendance />} />
                <Route path="fees"             element={<ParentFees />} />
                <Route path="homework"         element={<ParentHomework />} />
                <Route path="timetable"        element={<ParentTimetable />} />
                <Route path="notices"          element={<ParentNotices />} />
                <Route path="messages"         element={<ParentMessages />} />
                <Route path="report-cards"     element={<ParentReportCards />} />
                <Route path="calendar"         element={<ParentCalendar />} />
                <Route path="co-curricular"    element={<ParentCoCurricular />} />
                <Route path="leave"            element={<ParentLeaveRequest />} />
                <Route path="meetings"         element={<ParentMeetings />} />
                <Route path="transport"        element={<ParentTransport />} />
                <Route path="settings"         element={<ParentSettings />} />
              </Route>

              {/* ── Admin Portal ── */}
              <Route
                path="dashboard/admin"
                element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}
              >
                <Route index                element={<Overview />} />
                {/* Content & Media — new unified routes */}
                <Route path="site-content"              element={<SiteContentManager />} />
                <Route path="site-content/home"          element={<HomePageContentManager />} />
                <Route path="site-content/contact"       element={<ContactPageContentManager />} />
                <Route path="site-content/co-curricular" element={<CoCurrPageBuilder />} />
                <Route path="site-content/facilities"    element={<FacilitiesPageBuilder />} />
                <Route path="activities"                element={<ActivitiesManager />} />
                <Route path="blog"          element={<BlogManager />} />
                <Route path="events"        element={<EventsManager />} />
                <Route path="gallery"       element={<GalleryManager />} />

                {/* Legacy redirects — old routes forwarded to new unified pages */}
                <Route path="pages"         element={<Navigate to="/dashboard/admin/site-content" replace />} />
                <Route path="content"       element={<Navigate to="/dashboard/admin/site-content" replace />} />
                <Route path="why-choose-us" element={<Navigate to="/dashboard/admin/site-content" replace />} />
                <Route path="programs"      element={<Navigate to="/dashboard/admin/site-content" replace />} />
                <Route path="co-curricular" element={<Navigate to="/dashboard/admin/site-content/co-curricular" replace />} />
                <Route path="sports"        element={<Navigate to="/dashboard/admin/activities" replace />} />
                <Route path="music"         element={<Navigate to="/dashboard/admin/activities" replace />} />
                <Route path="drama"         element={<Navigate to="/dashboard/admin/activities" replace />} />

                {/* School Management */}
                <Route path="admissions"    element={<AdmissionsManager />} />
                <Route path="parents"       element={<ParentsManager />} />
                <Route path="students"      element={<StudentsManager />} />
                <Route path="staff"         element={<StaffManager />} />
                <Route path="academics"     element={<AcademicsManager />} />
                <Route path="timetable"     element={<TimetableManager />} />
                <Route path="announcements" element={<AnnouncementsManager />} />

                {/* Finance */}
                <Route path="payments"      element={<PaymentsManager />} />
                <Route path="fees"          element={<FeesManager />} />

                {/* System */}
                <Route path="reports"       element={<ReportsManager />} />
                <Route path="accounts"      element={<AccountsManager />} />
                <Route path="settings"      element={<SettingsManager />} />
              </Route>

              <Route path="dashboard" element={<Navigate to="/login" replace />} />

            </Routes>
          </BrowserRouter>
          </PillarsProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
