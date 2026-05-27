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
import { ParentDashboard } from './pages/dashboards/ParentDashboard'
import { TeacherDashboard } from './pages/dashboards/TeacherDashboard'

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

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>

              {/* ── Public site — shared Navbar + Footer ── */}
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about"        element={<About />} />
                <Route path="academics"    element={<Academics />} />
                <Route path="programs"     element={<Navigate to="/academics" replace />} />
                <Route path="facilities"   element={<Facilities />} />
                <Route path="co-curricular"element={<CoCurricular />} />
                <Route path="music"        element={<Music />} />
                <Route path="drama-dance"  element={<DramaDance />} />
                <Route path="sports"       element={<Sports />} />
                <Route path="admissions"   element={<Admissions />} />
                <Route path="contact"      element={<Contact />} />
                <Route path="staff"        element={<Staff />} />
                <Route path="login"        element={<Login />} />

                <Route path="dashboard/parent" element={
                  <ProtectedRoute role="parent"><ParentDashboard /></ProtectedRoute>
                } />
                <Route path="dashboard/teacher" element={
                  <ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>
                } />
              </Route>

              {/* ── Admin portal — dedicated sidebar layout, no public nav ── */}
              <Route
                path="dashboard/admin"
                element={
                  <ProtectedRoute role="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index             element={<Overview />} />
                <Route path="content"       element={<ContentManager />} />
                <Route path="blog"          element={<BlogManager />} />
                <Route path="events"        element={<EventsManager />} />
                <Route path="gallery"       element={<GalleryManager />} />
                <Route path="students"      element={<StudentsManager />} />
                <Route path="staff"         element={<StaffManager />} />
                <Route path="academics"     element={<AcademicsManager />} />
                <Route path="fees"          element={<FeesManager />} />
                <Route path="announcements" element={<AnnouncementsManager />} />
                <Route path="settings"      element={<SettingsManager />} />
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
