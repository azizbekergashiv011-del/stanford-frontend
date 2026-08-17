import { Link } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { GraduationCap, MapPin, Phone, Mail, Instagram, Youtube, Facebook, Send } from 'lucide-react'

export default function Footer() {
  const { t } = useLang()
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <Link to="/" className="logo">
              <div className="logo-icon"><GraduationCap size={22} /></div>
              <div className="logo-text">
                <div className="logo-name">STANFORD</div>
                <div className="logo-sub">Training Center</div>
              </div>
            </Link>
            <p className="footer-desc">{t('footerDesc')}</p>
            <div className="social-links">
              <a href="https://instagram.com/stanford.uz" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                <Instagram size={16} />
              </a>
              <a href="https://t.me/stanford_uz" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Telegram">
                <Send size={16} />
              </a>
              <a href="https://youtube.com/@stanford_uz" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube">
                <Youtube size={16} />
              </a>
              <a href="https://facebook.com/stanford.uz" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="footer-title">{t('quickLinks')}</h3>
            <ul className="footer-links">
              {[
                { to: '/about', label: t('about') },
                { to: '/courses', label: t('courses') },
                { to: '/teachers', label: t('teachers') },
                { to: '/news', label: t('news') },
                { to: '/gallery', label: t('gallery') },
                { to: '/faq', label: t('faq') },
              ].map(l => (
                <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Certificates */}
          <div>
            <h3 className="footer-title">{t('certificates')}</h3>
            <ul className="footer-links">
              <li><Link to="/certificates">{t('verifyCert')}</Link></li>
              <li><Link to="/sat">SAT {t('courses')}</Link></li>
              <li><Link to="/ap">AP Program</Link></li>
              <li><Link to="/contact">{t('contact')}</Link></li>
            </ul>
            <div style={{ marginTop: '1.5rem' }}>
              <h3 className="footer-title" style={{ marginBottom: '0.75rem' }}>{t('legalLinks')}</h3>
              <ul className="footer-links">
                <li><Link to="/privacy-policy">{t('privacyPolicy')}</Link></li>
                <li><Link to="/terms">{t('terms')}</Link></li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="footer-title">{t('contact')}</h3>
            <div>
              <div className="footer-contact-item">
                <MapPin size={16} />
                <span>Namangan viloyati, Chortoq tumani</span>
              </div>
              <div className="footer-contact-item">
                <Phone size={16} />
                <a href="tel:+998911852035">+998 91 185 20 35</a>
              </div>
              <div className="footer-contact-item">
                <Mail size={16} />
                <a href="mailto:info@stanford.uz">info@stanford.uz</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', width: '100%' }}>
          <span>© {year} Stanford Training Center. {lang === 'uz' ? 'Barcha huquqlar himoyalangan.' : lang === 'ru' ? 'Все права защищены.' : 'All rights reserved.'}</span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>stanford.uz</span>
        </div>
      </div>
    </footer>
  )
}
