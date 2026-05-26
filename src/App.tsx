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
import { AdminDashboard } from './pages/dashboards/AdminDashboard'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="academics" element={<Academics />} />
                <Route path="programs" element={<Navigate to="/academics" replace />} />
                <Route path="facilities" element={<Facilities />} />
                <Route path="co-curricular" element={<CoCurricular />} />
                <Route path="music" element={<Music />} />
                <Route path="drama-dance" element={<DramaDance />} />
                <Route path="sports" element={<Sports />} />
                <Route path="admissions" element={<Admissions />} />
                <Route path="contact" element={<Contact />} />
                <Route path="staff" element={<Staff />} />
                <Route path="login" element={<Login />} />
                <Route
                  path="dashboard/parent"
                  element={
                    <ProtectedRoute role="parent">
                      <ParentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="dashboard/teacher"
                  element={
                    <ProtectedRoute role="teacher">
                      <TeacherDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="dashboard/admin"
                  element={
                    <ProtectedRoute role="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="dashboard" element={<Navigate to="/login" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
