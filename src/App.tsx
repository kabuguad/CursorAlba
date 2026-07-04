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
import { NotFound } from './pages/NotFound'

import { AdminLayout }                from './pages/dashboards/admin/AdminLayout'
import { GalleryManager }            from './pages/dashboards/admin/GalleryManager'
import { StaffManager }              from './pages/dashboards/admin/StaffManager'
import { SiteContentManager }        from './pages/dashboards/admin/SiteContentManager'
import { CoCurrPageBuilder }         from './pages/dashboards/admin/CoCurrPageBuilder'
import { FacilitiesPageBuilder }     from './pages/dashboards/admin/FacilitiesPageBuilder'
import { HomePageContentManager }    from './pages/dashboards/admin/HomePageContentManager'
import { ContactPageContentManager } from './pages/dashboards/admin/ContactPageContentManager'
import { AboutContentManager }       from './pages/dashboards/admin/AboutContentManager'
import { WhyChooseUsManager }        from './pages/dashboards/admin/WhyChooseUsManager'
import { AdminAdmissions }           from './pages/dashboards/admin/AdminAdmissions'

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

              {/* ── Admin Portal ── */}
              <Route
                path="dashboard/admin"
                element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}
              >
                <Route index element={<Navigate to="/dashboard/admin/site-content" replace />} />

                {/* Content & Media */}
                <Route path="site-content"                    element={<SiteContentManager />} />
                <Route path="site-content/home"               element={<HomePageContentManager />} />
                <Route path="site-content/contact"            element={<ContactPageContentManager />} />
                <Route path="site-content/co-curricular"      element={<CoCurrPageBuilder />} />
                <Route path="site-content/facilities"         element={<FacilitiesPageBuilder />} />
                <Route path="site-content/about"              element={<AboutContentManager />} />
                <Route path="site-content/why-choose-us"      element={<WhyChooseUsManager />} />
                <Route path="gallery"                    element={<GalleryManager />} />

                {/* Staff */}
                <Route path="staff"                      element={<StaffManager />} />

                {/* Admissions */}
                <Route path="admissions"                 element={<AdminAdmissions />} />

                {/* Legacy redirects */}
                <Route path="pages"         element={<Navigate to="/dashboard/admin/site-content" replace />} />
                <Route path="content"       element={<Navigate to="/dashboard/admin/site-content" replace />} />
                <Route path="why-choose-us" element={<Navigate to="/dashboard/admin/site-content" replace />} />
                <Route path="programs"      element={<Navigate to="/dashboard/admin/site-content" replace />} />
                <Route path="co-curricular" element={<Navigate to="/dashboard/admin/site-content/co-curricular" replace />} />
              </Route>

              <Route path="dashboard" element={<Navigate to="/login" replace />} />

              {/* ── 404 ── */}
              <Route path="*" element={<NotFound />} />

            </Routes>
          </BrowserRouter>
          </PillarsProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
