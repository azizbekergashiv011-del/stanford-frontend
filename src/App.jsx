import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { LangProvider } from './context/LangContext'
import { AuthProvider } from './context/AuthContext'
import PublicLayout from './components/layout/PublicLayout'
import AdminLayout from './components/layout/AdminLayout'
import ProtectedRoute from './components/layout/ProtectedRoute'

// Public Pages
import Home from './pages/Home'
import About from './pages/About'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import Teachers from './pages/Teachers'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import Gallery from './pages/Gallery'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import SAT from './pages/SAT'
import AP from './pages/AP'
import CertificateVerify from './pages/CertificateVerify'
import Certificates from './pages/Certificates'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminCourses from './pages/admin/AdminCourses'
import AdminTeachers from './pages/admin/AdminTeachers'
import AdminNews from './pages/admin/AdminNews'
import AdminGallery from './pages/admin/AdminGallery'
import AdminFAQ from './pages/admin/AdminFAQ'
import AdminCertificates from './pages/admin/AdminCertificates'
import AdminSettings from './pages/admin/AdminSettings'
import AdminMessages from './pages/admin/AdminMessages'

export default function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ duration: 3500, style: { fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' } }} />
          <Routes>
            {/* Public */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:slug" element={<CourseDetail />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:slug" element={<NewsDetail />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/sat" element={<SAT />} />
              <Route path="/ap" element={<AP />} />
              <Route path="/certificates" element={<Certificates />} />
              <Route path="/verify/:certificateId" element={<CertificateVerify />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
            </Route>

            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin Protected */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/courses" element={<AdminCourses />} />
                <Route path="/admin/teachers" element={<AdminTeachers />} />
                <Route path="/admin/news" element={<AdminNews />} />
                <Route path="/admin/gallery" element={<AdminGallery />} />
                <Route path="/admin/faq" element={<AdminFAQ />} />
                <Route path="/admin/certificates" element={<AdminCertificates />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/messages" element={<AdminMessages />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LangProvider>
  )
}
