import { useState } from 'react'
import { useLang } from '../context/LangContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { MapPin, Phone, Mail, Clock, Send, Instagram, Youtube, Facebook } from 'lucide-react'

export default function Contact() {
  const { t, lang } = useLang()
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.message) return toast.error(t('required'))
    setLoading(true)
    try {
      await api.post('/contact', form)
      toast.success(t('contactSuccess'))
      setForm({ name: '', phone: '', email: '', message: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || t('error'))
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    { icon: <MapPin size={20} />, label: t('address'), value: lang === 'uz' ? "Namangan viloyati, Chortoq tumani" : lang === 'ru' ? 'Наманганская область, Чартакский район' : 'Namangan region, Chartok district' },
    { icon: <Phone size={20} />, label: t('phone'), value: '+998 91 185 20 35', href: 'tel:+998911852035' },
    { icon: <Mail size={20} />, label: t('email'), value: 'info@stanford.uz', href: 'mailto:info@stanford.uz' },
    { icon: <Clock size={20} />, label: t('workingHours'), value: lang === 'uz' ? "Dushanba-Shanba: 08:00 - 20:00" : lang === 'ru' ? 'Пн-Сб: 08:00 - 20:00' : 'Mon-Sat: 08:00 - 20:00' },
  ]

  return (
    <div style={{ paddingTop: '80px' }}>
      <div className="page-hero">
        <div className="container">
          <h1>{t('contactTitle')}</h1>
          <p>{lang === 'uz' ? "Biz bilan bog'laning" : lang === 'ru' ? "Свяжитесь с нами" : "Get in touch with us"}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
            {/* Contact Info */}
            <div>
              <h2 style={{ fontWeight: 800, color: 'var(--dark)', marginBottom: '2rem', fontSize: '1.75rem' }}>
                {lang === 'uz' ? "Ma'lumotlar" : lang === 'ru' ? 'Информация' : 'Information'}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {contactInfo.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '48px', height: '48px', background: 'rgba(63,108,225,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>{item.label}</p>
                      {item.href ? (
                        <a href={item.href} style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.95rem', transition: 'color 0.2s' }}>{item.value}</a>
                      ) : (
                        <p style={{ color: 'var(--gray-800)', fontWeight: 600, fontSize: '0.95rem' }}>{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div>
                <h3 style={{ fontWeight: 700, color: 'var(--dark)', marginBottom: '1rem' }}>{t('followUs')}</h3>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {[
                    { href: 'https://instagram.com/stanford.uz', icon: <Instagram size={18} />, label: 'Instagram' },
                    { href: 'https://t.me/stanford_uz', icon: <Send size={18} />, label: 'Telegram' },
                    { href: 'https://youtube.com/@stanford_uz', icon: <Youtube size={18} />, label: 'YouTube' },
                    { href: 'https://facebook.com/stanford.uz', icon: <Facebook size={18} />, label: 'Facebook' },
                  ].map((s, i) => (
                    <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="social-link" aria-label={s.label}
                      style={{ background: 'rgba(63,108,225,0.1)', color: 'var(--primary)', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.25s' }}>
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div>
              <h2 style={{ fontWeight: 800, color: 'var(--dark)', marginBottom: '2rem', fontSize: '1.75rem' }}>
                {lang === 'uz' ? "Xabar yuboring" : lang === 'ru' ? 'Отправить сообщение' : 'Send Message'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row form-row-2">
                  <div className="form-group">
                    <label className="form-label">{t('name')} *</label>
                    <input type="text" className="form-control" placeholder={t('namePlaceholder')} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('phone')}</label>
                    <input type="tel" className="form-control" placeholder={t('phonePlaceholder')} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">{t('email')}</label>
                  <input type="email" className="form-control" placeholder={t('emailPlaceholder')} value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('message')} *</label>
                  <textarea className="form-control" placeholder={t('messagePlaceholder')} rows={5} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required />
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                  {loading ? <><div className="spinner spinner-sm" /> {lang === 'uz' ? 'Yuborilmoqda...' : lang === 'ru' ? 'Отправка...' : 'Sending...'}</> : <><Send size={18} /> {t('send')}</>}
                </button>
              </form>
            </div>
          </div>

          {/* Google Maps placeholder */}
          <div style={{ marginTop: '4rem', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1.5px solid var(--gray-200)', height: '350px', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: 'var(--gray-500)' }}>
              <MapPin size={48} style={{ margin: '0 auto 1rem' }} />
              <p style={{ fontWeight: 600 }}>Namangan viloyati, Chortoq tumani</p>
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline" style={{ marginTop: '0.75rem' }}>
                {lang === 'uz' ? "Google Maps'da ochish" : lang === 'ru' ? 'Открыть в Google Maps' : 'Open in Google Maps'}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
