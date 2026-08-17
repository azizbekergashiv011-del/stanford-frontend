import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LangContext'
import toast from 'react-hot-toast'
import { GraduationCap, Eye, EyeOff, Lock, Mail } from 'lucide-react'

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth()
  const { t } = useLang()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Xush kelibsiz!')
      navigate('/admin/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || t('error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a1628 0%, #1a2d5a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '72px', height: '72px', background: 'var(--primary)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 8px 32px rgba(63,108,225,0.4)' }}>
            <GraduationCap size={36} color="white" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>STANFORD</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Admin Panel</p>
        </div>

        {/* Card */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '2.5rem', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
          <h2 style={{ fontWeight: 800, color: 'var(--dark)', marginBottom: '0.5rem', textAlign: 'center' }}>{t('adminLogin')}</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', textAlign: 'center', marginBottom: '2rem' }}>
            Admin hisobingizga kiring
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">{t('adminEmail')}</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                <input type="email" className="form-control" placeholder="admin@stanford.uz" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))} style={{ paddingLeft: '2.75rem' }} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('adminPassword')}</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                <input type={showPass ? 'text' : 'password'} className="form-control" placeholder="••••••••" value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))} style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }} required />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
              {loading ? <><div className="spinner spinner-sm" /> Kirish...</> : t('adminLoginBtn')}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', padding: '1rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Default: admin@stanford.uz / Admin@123456</p>
          </div>
        </div>
      </div>
    </div>
  )
}
