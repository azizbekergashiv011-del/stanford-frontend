import { useState, useEffect } from 'react'
import { useLang } from '../../context/LangContext'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { Save, Globe, Phone, Share2, Search, RefreshCw } from 'lucide-react'

export default function AdminSettings() {
  const { t } = useLang()
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  useEffect(() => {
    api.get('/settings').then(res => {
      const raw = res.data.raw || []
      const obj = {}
      raw.forEach(s => { obj[s.key] = s.value || '' })
      setSettings(obj)
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put('/settings', settings)
      toast.success('Sozlamalar saqlandi!')
    } catch (err) {
      toast.error(err.response?.data?.message || t('error'))
    } finally {
      setSaving(false)
    }
  }

  const set = (key, val) => setSettings(p => ({ ...p, [key]: val }))

  const tabs = [
    { id: 'general', label: 'Umumiy', icon: <Globe size={16} /> },
    { id: 'contact', label: 'Aloqa', icon: <Phone size={16} /> },
    { id: 'social', label: 'Ijtimoiy', icon: <Share2 size={16} /> },
    { id: 'seo', label: 'SEO', icon: <Search size={16} /> },
    { id: 'stats', label: 'Statistika', icon: <RefreshCw size={16} /> },
  ]

  if (loading) return <div className="loader"><div className="spinner" /></div>

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark)' }}>Sozlamalar</h1>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-sm">
          {saving ? <><div className="spinner spinner-sm" /> Saqlash...</> : <><Save size={16} /> Saqlash</>}
        </button>
      </div>

      <div className="admin-card">
        <div className="tabs" style={{ marginBottom: '2rem' }}>
          {tabs.map(tab => (
            <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* General */}
        {activeTab === 'general' && (
          <div style={{ maxWidth: '700px' }}>
            <div className="form-group">
              <label className="form-label">Sayt nomi</label>
              <input type="text" className="form-control" value={settings.site_name || ''} onChange={e => set('site_name', e.target.value)} />
            </div>
            <div className="form-row form-row-3">
              <div className="form-group">
                <label className="form-label">Shiori (UZ)</label>
                <input type="text" className="form-control" value={settings.site_slogan_uz || ''} onChange={e => set('site_slogan_uz', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Shiori (EN)</label>
                <input type="text" className="form-control" value={settings.site_slogan_en || ''} onChange={e => set('site_slogan_en', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Shiori (RU)</label>
                <input type="text" className="form-control" value={settings.site_slogan_ru || ''} onChange={e => set('site_slogan_ru', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* Contact */}
        {activeTab === 'contact' && (
          <div style={{ maxWidth: '700px' }}>
            <div className="form-row form-row-2">
              <div className="form-group">
                <label className="form-label">Telefon</label>
                <input type="text" className="form-control" value={settings.phone || ''} onChange={e => set('phone', e.target.value)} placeholder="+998 91 185 20 35" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={settings.email || ''} onChange={e => set('email', e.target.value)} placeholder="info@stanford.uz" />
              </div>
            </div>
            <div className="form-row form-row-3">
              <div className="form-group">
                <label className="form-label">Manzil (UZ)</label>
                <input type="text" className="form-control" value={settings.address_uz || ''} onChange={e => set('address_uz', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Address (EN)</label>
                <input type="text" className="form-control" value={settings.address_en || ''} onChange={e => set('address_en', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Адрес (RU)</label>
                <input type="text" className="form-control" value={settings.address_ru || ''} onChange={e => set('address_ru', e.target.value)} />
              </div>
            </div>
            <div className="form-row form-row-2">
              <div className="form-group">
                <label className="form-label">Ish vaqti</label>
                <input type="text" className="form-control" value={settings.working_hours || ''} onChange={e => set('working_hours', e.target.value)} placeholder="Dush-Shanba: 08:00-20:00" />
              </div>
              <div className="form-group">
                <label className="form-label">Google Maps URL</label>
                <input type="url" className="form-control" value={settings.google_maps_url || ''} onChange={e => set('google_maps_url', e.target.value)} placeholder="https://maps.google.com/..." />
              </div>
            </div>
          </div>
        )}

        {/* Social */}
        {activeTab === 'social' && (
          <div style={{ maxWidth: '700px' }}>
            {[
              { key: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/stanford.uz' },
              { key: 'telegram', label: 'Telegram URL', placeholder: 'https://t.me/stanford_uz' },
              { key: 'youtube', label: 'YouTube URL', placeholder: 'https://youtube.com/@stanford_uz' },
              { key: 'facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/stanford.uz' },
            ].map(f => (
              <div key={f.key} className="form-group">
                <label className="form-label">{f.label}</label>
                <input type="url" className="form-control" value={settings[f.key] || ''} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} />
              </div>
            ))}
          </div>
        )}

        {/* SEO */}
        {activeTab === 'seo' && (
          <div style={{ maxWidth: '700px' }}>
            <div className="form-group">
              <label className="form-label">Meta sarlavha</label>
              <input type="text" className="form-control" value={settings.meta_title || ''} onChange={e => set('meta_title', e.target.value)} placeholder="Stanford Training Center - Biz bilan yuqoriga!" />
              <small style={{ color: 'var(--gray-500)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                {(settings.meta_title || '').length}/60 belgi (tavsiya: 50-60)
              </small>
            </div>
            <div className="form-group">
              <label className="form-label">Meta tavsif</label>
              <textarea className="form-control" value={settings.meta_description || ''} onChange={e => set('meta_description', e.target.value)} rows={3} placeholder="Stanford Training Center - zamonaviy ta'lim markazi..." />
              <small style={{ color: 'var(--gray-500)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                {(settings.meta_description || '').length}/160 belgi (tavsiya: 150-160)
              </small>
            </div>

            {/* SEO Preview */}
            <div style={{ background: 'var(--gray-50)', border: '1.5px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', padding: '1.25rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Google ko'rinishi:</p>
              <p style={{ color: '#1a0dab', fontSize: '1.1rem', fontWeight: 500, lineHeight: 1.4, marginBottom: '0.25rem' }}>
                {settings.meta_title || 'Stanford Training Center'}
              </p>
              <p style={{ color: '#006621', fontSize: '0.8rem', marginBottom: '0.25rem' }}>https://stanford.uz</p>
              <p style={{ color: '#545454', fontSize: '0.875rem', lineHeight: 1.5 }}>
                {settings.meta_description || "Stanford Training Center haqida ma'lumot..."}
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        {activeTab === 'stats' && (
          <div style={{ maxWidth: '500px' }}>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Bosh sahifada ko'rsatiladigan statistika raqamlari
            </p>
            <div className="form-row form-row-2">
              <div className="form-group">
                <label className="form-label">Kurslar soni</label>
                <input type="text" className="form-control" value={settings.stats_courses || ''} onChange={e => set('stats_courses', e.target.value)} placeholder="10+" />
              </div>
              <div className="form-group">
                <label className="form-label">O'quvchilar soni</label>
                <input type="text" className="form-control" value={settings.stats_students || ''} onChange={e => set('stats_students', e.target.value)} placeholder="500+" />
              </div>
              <div className="form-group">
                <label className="form-label">O'qituvchilar soni</label>
                <input type="text" className="form-control" value={settings.stats_teachers || ''} onChange={e => set('stats_teachers', e.target.value)} placeholder="20+" />
              </div>
              <div className="form-group">
                <label className="form-label">Muvaffaqiyat foizi</label>
                <input type="text" className="form-control" value={settings.stats_results || ''} onChange={e => set('stats_results', e.target.value)} placeholder="95%" />
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--gray-200)' }}>
          <button onClick={handleSave} disabled={saving} className="btn btn-primary">
            {saving ? <><div className="spinner spinner-sm" /> Saqlash...</> : <><Save size={16} /> Sozlamalarni saqlash</>}
          </button>
        </div>
      </div>
    </div>
  )
}
