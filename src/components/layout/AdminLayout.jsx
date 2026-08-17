import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LangContext'
import {
  LayoutDashboard, BookOpen, Users, Newspaper, Image, HelpCircle,
  Award, Settings, MessageSquare, LogOut, GraduationCap, Menu, X
} from 'lucide-react'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const { t } = useLang()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const navGroups = [
    {
      label: 'Main',
      items: [
        { to: '/admin/dashboard', icon: <LayoutDashboard size={18} />, label: t('dashboard') },
        { to: '/admin/messages', icon: <MessageSquare size={18} />, label: t('messages') },
      ]
    },
    {
      label: 'Content',
      items: [
        { to: '/admin/courses', icon: <BookOpen size={18} />, label: t('courses') },
        { to: '/admin/teachers', icon: <Users size={18} />, label: t('teachers') },
        { to: '/admin/news', icon: <Newspaper size={18} />, label: t('news') },
        { to: '/admin/gallery', icon: <Image size={18} />, label: t('gallery') },
        { to: '/admin/faq', icon: <HelpCircle size={18} />, label: t('faq') },
      ]
    },
    {
      label: 'Certificates',
      items: [
        { to: '/admin/certificates', icon: <Award size={18} />, label: t('certificates') },
      ]
    },
    {
      label: 'System',
      items: [
        { to: '/admin/settings', icon: <Settings size={18} />, label: t('settings') },
      ]
    },
  ]

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-logo">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="logo-icon" style={{ background: 'rgba(63,108,225,0.3)', flexShrink: 0 }}>
              <GraduationCap size={22} />
            </div>
            <div>
              <h1>STANFORD</h1>
              <span>Admin Panel</span>
            </div>
          </div>
        </div>

        <nav className="admin-nav">
          {navGroups.map(group => (
            <div key={group.label} className="admin-nav-group">
              <div className="admin-nav-group-label">{group.label}</div>
              {group.items.map(item => (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}>
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.75rem' }}>
            {user?.name || user?.email}
          </div>
          <button className="admin-nav-link" onClick={handleLogout} style={{ width: '100%', color: 'rgba(239,68,68,0.8)' }}>
            <LogOut size={18} />
            {t('logout')}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <div className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ display: 'flex', color: 'var(--gray-700)' }} aria-label="Toggle menu">
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>{user?.email}</div>
            <button onClick={handleLogout} className="btn btn-sm" style={{ color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <LogOut size={15} />
              {t('logout')}
            </button>
          </div>
        </div>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }}
          onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
