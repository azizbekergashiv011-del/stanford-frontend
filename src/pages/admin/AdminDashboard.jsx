import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import api from '../../utils/api'
import { formatDate } from '../../utils/helpers'
import { BookOpen, Users, Newspaper, Award, CheckCircle, XCircle, MessageSquare, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const { t, lang } = useLang()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/dashboard').then(res => setStats(res.data.data)).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loader"><div className="spinner" /></div>

  const statCards = [
    { icon: <BookOpen size={22} />, label: t('totalCourses'), value: stats?.courses || 0, color: '#3F6CE1', bg: 'rgba(63,108,225,0.1)', link: '/admin/courses' },
    { icon: <Users size={22} />, label: t('totalTeachers'), value: stats?.teachers || 0, color: '#10b981', bg: 'rgba(16,185,129,0.1)', link: '/admin/teachers' },
    { icon: <Newspaper size={22} />, label: t('totalNews'), value: stats?.news || 0, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', link: '/admin/news' },
    { icon: <Award size={22} />, label: t('totalCerts'), value: stats?.certificates?.total || 0, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', link: '/admin/certificates' },
    { icon: <CheckCircle size={22} />, label: t('validCerts'), value: stats?.certificates?.valid || 0, color: '#10b981', bg: 'rgba(16,185,129,0.1)', link: '/admin/certificates' },
    { icon: <XCircle size={22} />, label: t('revokedCerts'), value: stats?.certificates?.revoked || 0, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', link: '/admin/certificates' },
    { icon: <MessageSquare size={22} />, label: t('messages'), value: stats?.messages?.total || 0, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)', link: '/admin/messages' },
    { icon: <TrendingUp size={22} />, label: t('unreadMessages'), value: stats?.messages?.unread || 0, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', link: '/admin/messages' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--dark)' }}>{t('dashboard')}</h1>
        <p style={{ color: 'var(--gray-600)', marginTop: '0.25rem' }}>Stanford Training Center Admin Panel</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {statCards.map((card, i) => (
          <Link key={i} to={card.link} style={{ textDecoration: 'none' }}>
            <div className="stat-card" style={{ transition: 'all 0.25s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-lg)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}>
              <div className="stat-card-icon" style={{ background: card.bg }}>
                <span style={{ color: card.color }}>{card.icon}</span>
              </div>
              <div>
                <div className="stat-card-value">{card.value}</div>
                <div className="stat-card-label">{card.label}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent data */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Recent Certificates */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>{t('recentCerts')}</h3>
            <Link to="/admin/certificates" className="btn btn-sm btn-outline">{t('all')}</Link>
          </div>
          {stats?.recentCertificates?.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead><tr><th>ID</th><th>{t('studentNameLabel')}</th><th>{t('status')}</th></tr></thead>
                <tbody>
                  {stats.recentCertificates.map(cert => (
                    <tr key={cert.id}>
                      <td><code style={{ fontSize: '0.8rem', background: 'var(--gray-100)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>{cert.certificate_number}</code></td>
                      <td style={{ fontWeight: 500 }}>{cert.student_name}</td>
                      <td><span className={`badge ${cert.status === 'VALID' ? 'badge-success' : 'badge-danger'}`}>{cert.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p style={{ color: 'var(--gray-500)', textAlign: 'center', padding: '2rem 0' }}>{t('noData')}</p>}
        </div>

        {/* Recent Messages */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>{t('recentMessages')}</h3>
            <Link to="/admin/messages" className="btn btn-sm btn-outline">{t('all')}</Link>
          </div>
          {stats?.recentMessages?.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead><tr><th>{t('name')}</th><th>{t('message')}</th><th>{t('date')}</th></tr></thead>
                <tbody>
                  {stats.recentMessages.map(msg => (
                    <tr key={msg.id}>
                      <td style={{ fontWeight: 500 }}>{msg.name}{!msg.is_read && <span className="badge badge-warning" style={{ marginLeft: '0.4rem', fontSize: '0.65rem' }}>New</span>}</td>
                      <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--gray-600)', fontSize: '0.85rem' }}>{msg.message}</td>
                      <td style={{ color: 'var(--gray-500)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{formatDate(msg.created_at, lang)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p style={{ color: 'var(--gray-500)', textAlign: 'center', padding: '2rem 0' }}>{t('noData')}</p>}
        </div>
      </div>
    </div>
  )
}
